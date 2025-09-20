const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors'); // <--- agregado

const {
    corsOptions,
    limiter,
    aiLimiter,
    helmetConfig,
    sanitizeInput,
    securityLogger,
    sessionConfig,
    bruteForceProtection,
    helmet
} = require('./security-config');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware de seguridad
app.use(helmet(helmetConfig));
app.use(cors(corsOptions)); // ahora cors está definido
app.use(limiter);
app.use(securityLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);
app.use(session(sessionConfig));
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css') || path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));

// Rutas principales
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/chatbot', (req, res) => res.sendFile(path.join(__dirname, 'chatbot.html')));
app.get('/crm', (req, res) => res.sendFile(path.join(__dirname, 'crm.html')));

// Rutas protegidas para APIs de IA
app.use('/api/ai', aiLimiter);

// Ruta protegida para login
app.post('/api/login', bruteForceProtection, (req, res) => {
    res.json({ message: 'Login endpoint' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'NEXUS CEO',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        security: 'enabled'
    });
});

// Endpoint de seguridad
app.get('/api/security-check', (req, res) => {
    res.json({
        headers: {
            'X-Content-Type-Options': res.get('X-Content-Type-Options'),
            'X-Frame-Options': res.get('X-Frame-Options'),
            'X-XSS-Protection': res.get('X-XSS-Protection'),
            'Strict-Transport-Security': res.get('Strict-Transport-Security')
        },
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 NEXUS CEO running on port ${PORT}`);
    console.log(`📱 Access: http://localhost:${PORT}`);
});
