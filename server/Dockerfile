FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build
RUN test -f dist/main.js || (echo "ERREUR: dist/main.js non genere" && exit 1)

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY docker-entrypoint.sh /tmp/docker-entrypoint.sh
RUN tr -d '\r' < /tmp/docker-entrypoint.sh > ./docker-entrypoint.sh && \
    chmod +x ./docker-entrypoint.sh && \
    rm /tmp/docker-entrypoint.sh
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api || exit 1
CMD ["./docker-entrypoint.sh"]
