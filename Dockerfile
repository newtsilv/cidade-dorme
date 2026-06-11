FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY server ./server
COPY src/features/game ./src/features/game
COPY tsconfig.json ./tsconfig.json

ENV NODE_ENV=production

CMD ["npm", "run", "server:start"]
