FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

FROM node:18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
RUN npm ci --omit=dev || npm install --production

EXPOSE 3001
CMD ["sh", "-c", "node dist/scripts/seed.js && node dist/app.js"]

