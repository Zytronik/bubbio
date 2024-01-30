@echo off

start cmd /k "cd .\frontend && npm run dev"
start cmd /k "cd .\backend && npm run start:dev"
start cmd /k "cd .\backend && npm run db:dev:up & timeout /t 2 && npm run prisma:start && npx prisma studio"