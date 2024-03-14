@echo off

start cmd /k "cd .\frontend && npm run dev"
start cmd /k "cd .\backend && docker start backend-dev-db-1 && npx prisma migrate dev && npx prisma generate && npm run start:dev"

npx prisma migrate dev
npx prisma generate