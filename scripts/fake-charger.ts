/**
 * WEEK 4: a fake charger. It publishes charging events to RabbitMQ queue
 * `charging.events`, the way our OCPP service does for real chargers.
 * Your task: write a NestJS consumer that reads them, updates a
 * ChargingSession, and bills the wallet when the session stops.
 *
 *   npm run fake-charger                 # one session, 2 minutes
 *   npm run fake-charger -- --zero       # a session that never gets energy (0 kWh)
 */
import 'dotenv/config';
import * as amqp from 'amqplib';

const QUEUE = 'charging.events';
const zero = process.argv.includes('--zero');

async function main() {
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL ?? 'amqp://intern:intern@localhost:5673',
  );
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE, { durable: true });
  const send = (event: Record<string, unknown>) => {
    ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });
    console.log('→', JSON.stringify(event));
  };

  const chargerId = 'FAKE-A-01';
  const connectorId = 1;
  const transactionId = Math.floor(Date.now() / 1000);
  let meterWh = 1_000_000 + Math.floor(Math.random() * 1000);
  const meterStart = meterWh;

  send({
    type: 'started',
    chargerId,
    connectorId,
    transactionId,
    meterStartWh: meterWh,
    at: new Date().toISOString(),
  });
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    if (!zero) meterWh += 100 + Math.floor(Math.random() * 30); // ~40 kW
    send({
      type: 'meter',
      chargerId,
      connectorId,
      transactionId,
      meterWh,
      powerW: zero ? 0 : 40_000,
      at: new Date().toISOString(),
    });
  }
  send({
    type: 'stopped',
    chargerId,
    connectorId,
    transactionId,
    meterStopWh: meterWh,
    reason: 'Remote',
    at: new Date().toISOString(),
  });
  console.log(`done: ${(meterWh - meterStart) / 1000} kWh`);
  await ch.close();
  await conn.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
