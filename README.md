# ProjectOps

Monorepo with:
- `apps/api` (NestJS + Prisma)
- `apps/web` (React + Vite)
- `packages/shared` (shared TS types)

## Quickstart

1) Install dependencies (workspace root):

```bash
npm install
```

2) Create API env file:

```bash
copy .\apps\api\.env.example .\apps\api\.env
```

3) Start Postgres:

```bash
npm run db:up
```

4) Generate Prisma client + run migrations:

```bash
npm -w apps/api run prisma:generate
npm -w apps/api run prisma:deploy
```

5) Run both apps (API + Web):

```bash
npm run dev
```

- API: http://localhost:3000 (Swagger: http://localhost:3000/docs)
- Web: Vite will print the URL in the console (usually http://localhost:5173)

## Stop DB

```bash
npm run db:down
```
