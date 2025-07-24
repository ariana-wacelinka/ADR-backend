# Usar Node.js Alpine (más pequeño)
FROM node:18-alpine

# Crear carpeta para la app
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Crear usuario sin privilegios
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 8080

# Iniciar la aplicación
CMD ["npm", "start"]