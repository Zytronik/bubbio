@echo off

start cmd /k "cd .\frontend && npm run dev"
start cmd /k "cd .\backend && npm run start:dev"
start cmd /k "cd .\backend && docker start backend-dev-db-1 && npm run prisma:start && npx prisma studio"