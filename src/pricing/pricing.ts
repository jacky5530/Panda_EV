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
  // TODO(week 1): replace this line
  throw new Error(
    `not implemented: calcChargeCost(${kwh}, ${pricePerKwh}, ${vatPct})`,
  );
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
  // TODO(week 1)
  throw new Error(
    `not implemented: maxKwhForBalance(${balance}, ${pricePerKwh}, ${vatPct})`,
  );
}
