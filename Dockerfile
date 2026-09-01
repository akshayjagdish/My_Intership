FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package.json
COPY src src
COPY public public
COPY scripts scripts
COPY docs docs

RUN mkdir -p data logs && addgroup -S erp && adduser -S erp -G erp && chown -R erp:erp /app
USER erp

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/server.js"]
