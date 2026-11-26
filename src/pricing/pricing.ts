/**
 * WEEK 1 EXERCISE — implement these functions so the tests in
 * pricing.spec.ts pass. Remove `describe.skip` → `describe` there first.
 *
 * Rules (simplified from production):
 * - Money is Lao kip (LAK), whole numbers only. Round at the end.
 * - Energy cost = kWh × price per kWh.
 * - VAT is 10 % of the energy cost.
 * - Total = energy cost + VAT.
 */

export interface ChargeCost {
  energyCost: number;
  vatAmount: number;
  total: number;
}

export function calcChargeCost(
  kwh: number,
  pricePerKwh: number,
  vatPct = 10,
): ChargeCost {
  if (kwh < 0) throw new Error('kwh must be >= 0');

  const energyCost = Math.round(kwh * pricePerKwh);
  const vatAmount = Math.round((energyCost * vatPct) / 100);

  return { energyCost, vatAmount, total: energyCost + vatAmount };
}

/**
 * How many kWh a wallet balance can buy, so the charger can be told when to
 * stop. Round DOWN to 3 decimals (never sell energy the customer cannot pay for).
 */
export function maxKwhForBalance(
  balance: number,
  pricePerKwh: number,
  vatPct = 10,
): number {
  if (balance <= 0) return 0;

  const raw = balance / (pricePerKwh * (1 + vatPct / 100));
  let kwh = Math.floor(raw * 1000) / 1000;

  // The rounding inside calcChargeCost can push the total over the balance,
  // so step down by 0.001 kWh until it fits.
  while (kwh > 0 && calcChargeCost(kwh, pricePerKwh, vatPct).total > balance) {
    kwh = Math.round((kwh - 0.001) * 1000) / 1000;
  }

  return kwh;
}
