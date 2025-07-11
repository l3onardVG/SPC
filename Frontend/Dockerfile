# Multi-stage build para optimizar el tamaño de la imagen final
FROM node:20-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
# Verificar https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué libc6-compat podría ser necesario.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY SPC/package.json SPC/package-lock.json* ./
# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Etapa de construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY SPC/ .

# Definir argumentos de build
ARG REACT_APP_API_URL
ARG NODE_ENV
ARG VITE_MODE

# Establecer variables de entorno para el build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_ENV=$NODE_ENV
ENV VITE_MODE=$VITE_MODE

# Generar build de producción
RUN npm run build

# Etapa de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix

# Copiar archivos de build
COPY --from=builder --chown=remix:nodejs /app/build ./build
COPY --from=builder --chown=remix:nodejs /app/public ./public
COPY --from=builder --chown=remix:nodejs /app/package.json ./package.json
COPY --from=builder --chown=remix:nodejs /app/package-lock.json ./package-lock.json

# Instalar solo dependencias de producción para la imagen final
RUN npm ci --only=production

# Cambiar al usuario no-root
USER remix

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando para ejecutar la aplicación
CMD ["npm", "start"] 