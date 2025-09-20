// Configuración de seguridad avanzada para NEXUS CEO
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Configuración de CORS
const corsOptions = {
    origin: [
        'https://nexus-ceo.huaweicloud.com',
        'https://www.nexus-ceo.huaweicloud.com',
        'http://localhost:8080',
        'http://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting específico para APIs de IA
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // máximo 10 requests de IA por minuto
    message: {
        error: 'Límite de consultas de IA excedido, intenta de nuevo en 1 minuto.',
        code: 'AI_RATE_LIMIT_EXCEEDED'
    }
});

// Configuración de Helmet para headers de seguridad
const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            scriptSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "https://xbubmiyuguaxwwkdiali.supabase.co"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: [
                "'self'",
                "https://generativelanguage.googleapis.com",
                "https://xbubmiyuguaxwwkdiali.supabase.co",
                "wss://xbubmiyuguaxwwkdiali.supabase.co"
            ]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
};

// Middleware de validación de API keys
function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    
    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            error: 'API key inválida o faltante',
            code: 'INVALID_API_KEY'
        });
    }
    
    next();
}

// Middleware de sanitización de inputs
function sanitizeInput(req, res, next) {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    };
    
    // Sanitizar body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        });
    }
    
    // Sanitizar query params
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeString(req.query[key]);
            }
        });
    }
    
    next();
}

// Middleware de logging de seguridad
function securityLogger(req, res, next) {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // Log de requests sospechosos
    const suspiciousPatterns = [
        /\.\.\//,  // Path traversal
        /<script/i, // XSS
        /union.*select/i, // SQL injection
        /exec\(/i, // Code injection
    ];
    
    const url = req.url;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url));
    
    if (isSuspicious) {
        console.warn(`[SECURITY WARNING] ${timestamp} - Suspicious request from ${ip}: ${url} - User-Agent: ${userAgent}`);
    }
    
    next();
}

// Configuración de sesiones seguras
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'nexus-ceo-super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only en producción
        httpOnly: true, // Prevenir acceso desde JavaScript
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'strict' // Protección CSRF
    }
};

// Función para validar tokens JWT
function validateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            error: 'Token de acceso requerido',
            code: 'MISSING_TOKEN'
        });
    }
    
    try {
        // Aquí validarías el token con tu biblioteca JWT
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido',
            code: 'INVALID_TOKEN'
        });
    }
}

// Middleware de protección contra ataques de fuerza bruta
const bruteForceProtection = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        return req.ip + ':' + (req.body.email || 'unknown');
    },
    message: {
        error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
        code: 'BRUTE_FORCE_PROTECTION'
    }
});

module.exports = {
    corsOptions,
    limiter,
    aiLimiter,
    helmetConfig,
    validateApiKey,
    sanitizeInput,
    securityLogger,
    sessionConfig,
    validateJWT,
    bruteForceProtection,
    helmet
};