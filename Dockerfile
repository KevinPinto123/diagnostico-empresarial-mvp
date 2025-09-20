# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8080

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Comando de inicio
CMD ["npm", "start"]