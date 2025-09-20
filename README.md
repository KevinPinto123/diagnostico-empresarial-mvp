# NEXUS CEO - Plataforma de IA Empresarial

## 🚀 Descripción
NEXUS CEO es la primera plataforma de IA en LATAM que democratiza el conocimiento empresarial de élite, convirtiendo emprendedores en CEOs expertos mediante análisis inteligente y recomendaciones estratégicas.

## 🏆 Hackathon Huawei 2025
Proyecto desarrollado para el Hackathon Huawei 2025, integrando tecnologías de vanguardia:
- **Huawei Cloud** - Infraestructura y hosting
- **Gemini AI** - Análisis empresarial inteligente
- **Supabase** - Autenticación y base de datos

## ✨ Características Principales
- 🧠 **Análisis Empresarial 360°** - Evaluación completa con IA
- 📊 **Dashboard CRM Inteligente** - Métricas y KPIs en tiempo real
- 🤖 **Chatbot Estratégico** - 5 preguntas clave para análisis
- 🔐 **Autenticación Segura** - Sistema robusto con Supabase
- 🌍 **Multiidioma** - Español, Inglés y Quechua
- 📱 **Responsive Design** - Optimizado para todos los dispositivos

## 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **IA**: Google Gemini AI API
- **Autenticación**: Supabase
- **Gráficos**: Chart.js
- **Cloud**: Huawei Cloud
- **Containerización**: Docker

## 📦 Instalación Local

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Pasos
1. Clonar el repositorio
```bash
git clone [repository-url]
cd nexus-ceo
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
# Crear archivo .env con:
GEMINI_API_KEY=tu_api_key_aqui
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_key
```

4. Ejecutar en desarrollo
```bash
npm start
```

5. Abrir en navegador: `http://localhost:8080`

## 🚀 Deployment en Huawei Cloud

### Opción 1: Docker
```bash
# Construir imagen
docker build -t nexus-ceo .

# Ejecutar contenedor
docker run -p 8080:8080 nexus-ceo
```

### Opción 2: Cloud Build
```bash
# Usar cloudbuild.yaml para deployment automático
gcloud builds submit --config cloudbuild.yaml
```

### Opción 3: App Engine
```bash
# Desplegar usando app.yaml
gcloud app deploy app.yaml
```

## 📊 Estructura del Proyecto
```
nexus-ceo/
├── index.html              # Landing page
├── login.html              # Página de autenticación
├── chatbot.html            # Chat empresarial
├── crm.html                # Dashboard CRM
├── styles/
│   ├── styles.css          # Estilos principales
│   ├── login-styles.css    # Estilos login
│   ├── chatbot-styles.css  # Estilos chat
│   └── crm-styles.css      # Estilos CRM
├── scripts/
│   ├── script.js           # Funcionalidad principal
│   ├── login-script.js     # Lógica autenticación
│   ├── chatbot-script.js   # Lógica chatbot + IA
│   └── crm-script.js       # Lógica dashboard
├── assets/
│   ├── centro.png          # Imagen principal
│   └── logo.png            # Logo
├── server.js               # Servidor Express
├── package.json            # Configuración npm
├── Dockerfile              # Configuración Docker
├── app.yaml                # Configuración App Engine
└── cloudbuild.yaml         # Configuración Cloud Build
```

## 🔧 Configuración de APIs

### Gemini AI
1. Obtener API key en Google AI Studio
2. Configurar en `chatbot-script.js` y `crm-script.js`

### Supabase
1. Crear proyecto en Supabase
2. Configurar autenticación
3. Actualizar credenciales en `login-script.js`

## 🌟 Funcionalidades Clave

### 1. Sistema de Autenticación
- Login con email/contraseña
- OAuth con Google y GitHub
- Validación y manejo de errores
- Sesiones persistentes

### 2. Chatbot Empresarial
- 5 preguntas estratégicas clave
- Análisis en tiempo real con IA
- Progreso visual interactivo
- Generación de resumen personalizado

### 3. Dashboard CRM
- KPIs dinámicos basados en respuestas
- Gráficos interactivos (ingresos, mercado, etc.)
- Análisis competitivo
- Recomendaciones estratégicas con IA
- Sistema de reportes y exportación

## 👨‍💻 Desarrollador
**Kevin Pinto**
- Fundador & Desarrollador Principal
- Especialista en IA y soluciones empresariales
- Participante Hackathon Huawei 2025

## 📄 Licencia
MIT License - Ver archivo LICENSE para más detalles

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Contacto
Para consultas sobre el proyecto o colaboraciones:
- Email: [tu-email]
- LinkedIn: [tu-linkedin]
- GitHub: [tu-github]

---
**NEXUS CEO** - Democratizando el éxito empresarial en LATAM 🚀