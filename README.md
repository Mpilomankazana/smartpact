# smartpact

SmartPact is a Solana dApp for creating, accepting, and settling on-chain pacts with escrowed SOL.

## Project structure

- `programs/smartpact/` — Anchor smart contract and on-chain escrow logic
- `smartpact-frontend/` — React + Vite frontend application
- `tests/` — Anchor program test suite

## Vercel deployment

This repository is configured to deploy the frontend from `smartpact-frontend/`.

1. Connect the repository to Vercel.
2. Keep the project root at `/`.
3. Vercel will use `vercel.json` to build `smartpact-frontend/package.json` with `@vercel/static-build`.
4. Set frontend environment variables in Vercel, such as `VITE_SOLANA_RPC_URL` and `VITE_PROGRAM_ID`.

## Local setup

Install the frontend dependencies:

```bash
cd smartpact-frontend
npm install
```

Install Anchor and the Solana toolchain as needed.

## Build and test

Build the frontend locally:

```bash
cd smartpact-frontend
npm run build
```

Build the Anchor program:

```bash
anchor build
```

Run tests:

```bash
anchor test
```

## Run locally

Start the frontend:

```bash
cd smartpact-frontend
npm run dev
```

Then use the Solana localnet and deployed smart contract as usual.
