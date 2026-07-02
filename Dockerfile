FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
