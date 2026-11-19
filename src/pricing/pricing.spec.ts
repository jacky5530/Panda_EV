import { calcChargeCost, maxKwhForBalance } from './pricing';

// WEEK 1: change `describe` to `describe`, run `npm test`, make it green.
describe.skip('calcChargeCost', () => {
  it('10 kWh at 2,900 LAK + 10 % VAT', () => {
    expect(calcChargeCost(10, 2900)).toEqual({
      energyCost: 29000,
      vatAmount: 2900,
      total: 31900,
    });
  });
  it('rounds to whole kip', () => {
    expect(calcChargeCost(1.234, 2900)).toEqual({
      energyCost: 3579,
      vatAmount: 358,
      total: 3937,
    });
  });
  it('0 kWh costs nothing', () => {
    expect(calcChargeCost(0, 2900).total).toBe(0);
  });
  it('rejects negative energy', () => {
    expect(() => calcChargeCost(-1, 2900)).toThrow();
  });
});

describe.skip('maxKwhForBalance', () => {
  it('100,000 LAK at 2,900 + 10 % VAT', () => {
    expect(maxKwhForBalance(100000, 2900)).toBe(31.347);
  });
  it('never more than the balance can pay', () => {
    const kwh = maxKwhForBalance(50000, 2900);
    expect(calcChargeCost(kwh, 2900).total).toBeLessThanOrEqual(50000);
  });
  it('empty wallet → 0', () => {
    expect(maxKwhForBalance(0, 2900)).toBe(0);
  });
});
