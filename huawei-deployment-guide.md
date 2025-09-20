# 🚀 GUÍA COMPLETA DE DEPLOYMENT EN HUAWEI CLOUD

## 📋 PREPARACIÓN PREVIA

### 1. Crear Cuenta en Huawei Cloud
1. Ir a https://www.huaweicloud.com/intl/en-us/
2. Registrarse con email corporativo
3. Verificar identidad y agregar método de pago
4. Activar servicios necesarios

### 2. Instalar Huawei Cloud CLI
```bash
# Windows
curl -O https://obs-cli-release.obs.ap-southeast-1.myhuaweicloud.com/hcloud/latest/hcloud-windows-amd64.zip
# Extraer y agregar al PATH

# Configurar credenciales
hcloud configure
```

## 🛠️ SERVICIOS DE HUAWEI CLOUD PARA NEXUS CEO

### 1. **Elastic Cloud Server (ECS)** - Servidor Principal
- **Función**: Hospedar la aplicación Node.js
- **Configuración**: 
  - Tipo: s6.large.2 (2 vCPUs, 4GB RAM)
  - OS: Ubuntu 20.04 LTS
  - Disco: 40GB SSD
- **Seguridad**: Firewall configurado para puertos 80, 443, 8080

### 2. **Object Storage Service (OBS)** - Almacenamiento
- **Función**: Almacenar assets estáticos (imágenes, CSS, JS)
- **Configuración**:
  - Bucket: nexus-ceo-assets
  - Región: ap-southeast-1
  - Acceso público para assets estáticos

### 3. **Content Delivery Network (CDN)** - Aceleración
- **Función**: Acelerar carga de contenido estático globalmente
- **Configuración**:
  - Dominio: nexus-ceo.huaweicloud.com
  - Origen: OBS bucket
  - Cache TTL: 3600 segundos

### 4. **Relational Database Service (RDS)** - Base de Datos
- **Función**: Almacenar datos de usuarios y análisis
- **Configuración**:
  - Engine: PostgreSQL 13.0
  - Instancia: rds.pg.s1.medium
  - Backup automático diario

### 5. **Cloud Eye Service (CES)** - Monitoreo
- **Función**: Monitorear rendimiento y disponibilidad
- **Métricas**: CPU, Memoria, Red, Disco
- **Alertas**: Configuradas para umbrales críticos

### 6. **Web Application Firewall (WAF)** - Seguridad
- **Función**: Protección contra ataques web
- **Características**:
  - Protección DDoS
  - Filtrado de SQL injection
  - Protección XSS

## 🔐 CONFIGURACIÓN DE SEGURIDAD

### 1. SSL/TLS Certificate
```bash
# Obtener certificado SSL gratuito
hcloud ssl create --domain nexus-ceo.huaweicloud.com
```

### 2. Security Groups (Firewall)
```json
{
  "inbound_rules": [
    {"port": 80, "protocol": "HTTP", "source": "0.0.0.0/0"},
    {"port": 443, "protocol": "HTTPS", "source": "0.0.0.0/0"},
    {"port": 8080, "protocol": "HTTP", "source": "0.0.0.0/0"},
    {"port": 22, "protocol": "SSH", "source": "tu-ip-admin"}
  ],
  "outbound_rules": [
    {"port": "all", "protocol": "all", "destination": "0.0.0.0/0"}
  ]
}
```

### 3. Identity and Access Management (IAM)
- Crear usuarios con permisos específicos
- Configurar roles para diferentes niveles de acceso
- Habilitar MFA para administradores

## 📦 PROCESO DE DEPLOYMENT

### Paso 1: Preparar el Código
```bash
# Clonar repositorio
git clone [tu-repositorio]
cd nexus-ceo

# Instalar dependencias
npm install

# Crear archivo de producción
npm run build
```

### Paso 2: Crear ECS Instance
```bash
# Crear servidor
hcloud ecs create \
  --name nexus-ceo-server \
  --image-id ubuntu-20.04 \
  --flavor s6.large.2 \
  --vpc-id [tu-vpc-id] \
  --subnet-id [tu-subnet-id] \
  --security-group-id [tu-sg-id]
```

### Paso 3: Configurar Servidor
```bash
# Conectar por SSH
ssh ubuntu@[ip-del-servidor]

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2

# Instalar Nginx como proxy reverso
sudo apt install nginx -y
```

### Paso 4: Subir Aplicación
```bash
# Crear directorio de aplicación
sudo mkdir -p /var/www/nexus-ceo
sudo chown ubuntu:ubuntu /var/www/nexus-ceo

# Subir archivos (usando SCP o Git)
scp -r * ubuntu@[ip-servidor]:/var/www/nexus-ceo/

# O clonar directamente en el servidor
cd /var/www/nexus-ceo
git clone [tu-repositorio] .
npm install --production
```

### Paso 5: Configurar Variables de Entorno
```bash
# Crear archivo .env
sudo nano /var/www/nexus-ceo/.env

# Contenido:
NODE_ENV=production
PORT=8080
GEMINI_API_KEY=tu_api_key
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_key
```

### Paso 6: Configurar Nginx
```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/nexus-ceo

# Contenido:
server {
    listen 80;
    server_name nexus-ceo.huaweicloud.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/nexus-ceo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 7: Iniciar Aplicación con PM2
```bash
cd /var/www/nexus-ceo

# Crear archivo de configuración PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nexus-ceo',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Crear directorio de logs
mkdir logs

# Iniciar aplicación
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Paso 8: Configurar SSL
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d nexus-ceo.huaweicloud.com

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 MONITOREO Y MANTENIMIENTO

### 1. Configurar Cloud Eye
```bash
# Instalar agente de monitoreo
wget https://obs-cli-release.obs.ap-southeast-1.myhuaweicloud.com/telescope/latest/telescope-linux-amd64.tar.gz
tar -xzf telescope-linux-amd64.tar.gz
sudo ./telescope install
```

### 2. Configurar Backups
```bash
# Script de backup automático
cat > /home/ubuntu/backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup de aplicación
tar -czf $BACKUP_DIR/nexus-ceo-$DATE.tar.gz /var/www/nexus-ceo

# Backup de base de datos (si usas RDS local)
# pg_dump nexus_ceo > $BACKUP_DIR/db-$DATE.sql

# Subir a OBS
hcloud obs cp $BACKUP_DIR/nexus-ceo-$DATE.tar.gz obs://nexus-ceo-backups/

# Limpiar backups locales antiguos (más de 7 días)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup.sh

# Programar backup diario
crontab -e
# Agregar: 0 2 * * * /home/ubuntu/backup.sh
```

## 🔧 COMANDOS ÚTILES DE MANTENIMIENTO

```bash
# Ver logs de la aplicación
pm2 logs nexus-ceo

# Reiniciar aplicación
pm2 restart nexus-ceo

# Ver estado del servidor
pm2 status
systemctl status nginx

# Monitorear recursos
htop
df -h
free -h

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 💰 ESTIMACIÓN DE COSTOS MENSUALES

| Servicio | Configuración | Costo Estimado (USD) |
|----------|---------------|---------------------|
| ECS | s6.large.2 | $45/mes |
| RDS | PostgreSQL medium | $35/mes |
| OBS | 50GB storage | $2/mes |
| CDN | 100GB transfer | $8/mes |
| WAF | Basic protection | $15/mes |
| **TOTAL** | | **~$105/mes** |

## 🚨 CONSIDERACIONES DE SEGURIDAD

1. **Firewall**: Solo puertos necesarios abiertos
2. **SSL**: Certificado válido y renovación automática
3. **WAF**: Protección contra ataques comunes
4. **Backups**: Automáticos y cifrados
5. **Monitoreo**: Alertas en tiempo real
6. **Updates**: Sistema y dependencias actualizadas
7. **Access Control**: IAM y MFA configurados

## 📞 SOPORTE Y TROUBLESHOOTING

### Problemas Comunes:
1. **App no inicia**: Verificar logs con `pm2 logs`
2. **502 Bad Gateway**: Verificar que la app esté corriendo en puerto 8080
3. **SSL issues**: Renovar certificado con `certbot renew`
4. **Performance**: Monitorear con Cloud Eye y ajustar recursos

### Contacto Soporte Huawei:
- Portal: https://support.huaweicloud.com/
- Email: support@huaweicloud.com
- Teléfono: Disponible en portal según región

---

**¡Tu aplicación NEXUS CEO estará corriendo de forma segura y escalable en Huawei Cloud!** 🚀