# Panda EV — ໂປຣເຈັກຝຶກງານ Backend

ໂປຣເຈັກນີ້ໃຊ້ **stack ດຽວກັບລະບົບຈິງ** (NestJS 11, TypeScript, Prisma 7, PostgreSQL, Redis, RabbitMQ)
ແຕ່ເປັນ **ຂໍ້ມູນປອມທັງໝົດ** ແລະ ແລ່ນຢູ່ເຄື່ອງຂອງນ້ອງເອງ.

## ກົດຄວາມປອດໄພ (ສຳຄັນ)

1. **ບໍ່ມີສິດເຂົ້າ Prod** — ບໍ່ຕ້ອງຂໍ password, kubeconfig ຫຼື ຖານຂໍ້ມູນຈິງ.
2. ໃຊ້ **ຂໍ້ມູນປອມ** ເທົ່ານັ້ນ (ຊື່ສະຖານີ `FAKE ...`, ຕູ້ `FAKE-A-01`). ຫ້າມ copy ຂໍ້ມູນລູກຄ້າຈິງມາໃສ່.
3. ຫ້າມ commit ໄຟລ໌ `.env` ຫຼື password ໃດໆ (`.gitignore` ກັນໄວ້ແລ້ວ).
4. ປ່ຽນ code ຜ່ານ **Pull Request** ເທົ່ານັ້ນ — ຫ້າມ push ໃສ່ `main` ໂດຍກົງ.

## ມື້ທຳອິດ: ຕິດຕັ້ງ

ຕ້ອງມີ: Node.js 22, Docker Desktop, Git, VS Code.

```bash
git clone <repo-url> && cd panda-ev-intern
cp .env.example .env
npm install
npm run db:up              # Postgres + Redis + RabbitMQ ໃນ Docker
npm run prisma:migrate     # ສ້າງຕາຕະລາງ (ຕັ້ງຊື່ migration: init)
npm run prisma:seed        # ໃສ່ສະຖານີປອມ 3 ແຫ່ງ
npm run start:dev
```

ເປີດ:
- http://localhost:3000/docs — Swagger (ທົດລອງ API)
- http://localhost:3000/api/health — ຕ້ອງໄດ້ `"database": "up"`
- http://localhost:15673 — RabbitMQ UI (user/pass: `intern` / `intern`)
- `npm run prisma:studio` — ເບິ່ງຂໍ້ມູນໃນຕາຕະລາງ

ກວດກ່ອນສົ່ງ PR ທຸກຄັ້ງ: `npm run lint && npm run build && npm test`

## ໂຄງສ້າງ

```
src/health/     ✅ ຕົວຢ່າງທີ່ເຮັດແລ້ວ: controller → service → test (ໃຫ້ copy ຮູບແບບນີ້)
src/pricing/    📝 ອາທິດ 1: ຄິດໄລ່ຄ່າສາກ
src/prisma/     ການເຊື່ອມຕໍ່ຖານຂໍ້ມູນ (ແບບດຽວກັບ Prod)
prisma/         schema.prisma (Station, Connector) + seed.ts
scripts/        fake-charger.ts — ຕູ້ສາກປອມ (ອາທິດ 4)
```

## ວຽກ 4 ອາທິດ

ແຕ່ລະວຽກ = 1 branch + 1 PR. ພີ່ຈະ review ທຸກ PR.

### ອາທິດ 1 — TypeScript, Git, Jest
- ເປີດ `src/pricing/pricing.spec.ts`, ປ່ຽນ `describe.skip` → `describe`
- ຂຽນ `calcChargeCost()` ແລະ `maxKwhForBalance()` ໃນ `pricing.ts` ໃຫ້ test ຜ່ານ
- ✅ ຮັບວຽກເມື່ອ: test 7 ຂໍ້ຜ່ານໝົດ, lint ບໍ່ມີ error, PR ມີຄຳອະທິບາຍ
- ຖາມຕົວເອງ: ເປັນຫຍັງ `maxKwhForBalance` ຕ້ອງປັດລົງ ບໍ່ແມ່ນປັດເຄິ່ງ?

### ອາທິດ 2 — NestJS REST API
- ສ້າງ `StationsModule`: `GET /stations`, `GET /stations/:id`, `POST`, `PATCH`, `DELETE`
- ໃຊ້ DTO + `class-validator` (latitude −90..90, name ບໍ່ຫວ່າງ), ໃສ່ `@ApiTags` ໃຫ້ຂຶ້ນ Swagger
- ບໍ່ພົບ → 404; ຂໍ້ມູນຜິດ → 400
- ສ້າງ `POST /auth/login` ທີ່ອອກ JWT (user ປອມ 1 ຄົນ) ແລະ ປ້ອງກັນ `POST/PATCH/DELETE` ດ້ວຍ guard
- ✅ ຮັບວຽກເມື່ອ: ທົດລອງໄດ້ໃນ Swagger + ມີ test ຂອງ service

### ອາທິດ 3 — SQL, Prisma, Transaction
- ເພີ່ມ model `Wallet` (userId, balance) ແລະ `WalletTransaction` (type TOPUP/CHARGE, amount, balanceAfter)
- `npm run prisma:migrate` ແລ້ວອ່ານໄຟລ໌ SQL ທີ່ Prisma ສ້າງ
- `POST /wallets/:id/topup` ແລະ `POST /wallets/:id/charge`
- **ກົດ: balance ຫ້າມຕິດລົບ** ເຖິງວ່າຈະຍິງ charge 10 ຄັ້ງພ້ອມກັນ → ໃຊ້ `prisma.$transaction` + `UPDATE ... WHERE balance >= amount`
- ✅ ຮັບວຽກເມື່ອ: ມີ test ທີ່ຍິງພ້ອມກັນ ແລະ balance ບໍ່ຕິດລົບ

### ອາທິດ 4 — RabbitMQ, Redis, ອ່ານ code ຈິງ
- ແລ່ນ `npm run fake-charger` → ເບິ່ງ message ໃນ RabbitMQ UI (queue `charging.events`)
- ຂຽນ consumer: `started` → ສ້າງ `ChargingSession`; `meter` → ອັບເດດ kWh ໃນ Redis; `stopped` → ຄິດເງິນດ້ວຍ `calcChargeCost` ແລ້ວຕັດ wallet
- ລອງ `npm run fake-charger -- --zero` → session 0 kWh ຕ້ອງ **ບໍ່ຕັດເງິນ**
- message ດຽວກັນມາ 2 ເທື່ອ ຕ້ອງບໍ່ຕັດເງິນຊ້ຳ (idempotent)
- ອ່ານ repo mobile ກັບພີ່ (read-only) ແລະ ປຽບທຽບກັບທີ່ຂຽນເອງ
- ✅ ຮັບວຽກເມື່ອ: demo ໃຫ້ພີ່ເບິ່ງ 1 session ຄົບວົງຈອນ

## ຂັ້ນຕອນ PR

```bash
git checkout -b week1/pricing
# ... ຂຽນ code ...
npm run lint && npm run build && npm test
git commit -m "feat(pricing): calcChargeCost + maxKwhForBalance"
git push -u origin week1/pricing
```
ເປີດ PR ໃນ GitHub → CI ຕ້ອງຂຽວ → ລໍພີ່ review → ແກ້ຕາມ comment → merge.

## ຕິດບັນຫາ?
ລອງເອງ 30 ນາທີກ່ອນ (ອ່ານ error, ຄົ້ນເອກະສານ), ແລ້ວຖາມໄດ້ເລີຍ — ບອກວ່າລອງຫຍັງໄປແລ້ວ ແລະ error ຂຶ້ນແນວໃດ.
