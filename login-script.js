// Configuración de Supabase
const SUPABASE_URL = 'https://xbubmiyuguaxwwkdiali.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidWJtaXl1Z3VheHd3a2RpYWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTc0NzEsImV4cCI6MjA3MzczMzQ3MX0.Un3OnfwswpH7ahvURXRANT8OxjyDaeFGbPuiNODe5dw';

// Inicializar Supabase (usando CDN)
let supabase;

// Cargar Supabase desde CDN
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Traducciones para login
const loginTranslations = {
    es: {
        'brand-tagline': 'Tu CEO Virtual Inteligente',
        'feature-ai': 'IA Empresarial Avanzada',
        'feature-secure': 'Seguridad Bancaria',
        'feature-analytics': 'Análisis Predictivo',
        'hackathon-badge': 'Hackathon Huawei 2025',
        'login-title': 'Iniciar Sesión',
        'login-subtitle': 'Accede a tu plataforma de IA empresarial',
        'email-label': 'Correo Electrónico',
        'password-label': 'Contraseña',
        'remember-me': 'Recordarme',
        'forgot-password': '¿Olvidaste tu contraseña?',
        'login-btn': 'Iniciar Sesión',
        'or-continue': 'O continúa con',
        'google-login': 'Google',
        'github-login': 'GitHub',
        'no-account': '¿No tienes cuenta?',
        'signup-link': 'Regístrate aquí',
        'developed-by': 'Desarrollado por <strong>Kevin Pinto</strong>'
    },
    en: {
        'brand-tagline': 'Your Intelligent Virtual CEO',
        'feature-ai': 'Advanced Business AI',
        'feature-secure': 'Bank-Level Security',
        'feature-analytics': 'Predictive Analytics',
        'hackathon-badge': 'Huawei Hackathon 2025',
        'login-title': 'Sign In',
        'login-subtitle': 'Access your business AI platform',
        'email-label': 'Email Address',
        'password-label': 'Password',
        'remember-me': 'Remember me',
        'forgot-password': 'Forgot your password?',
        'login-btn': 'Sign In',
        'or-continue': 'Or continue with',
        'google-login': 'Google',
        'github-login': 'GitHub',
        'no-account': "Don't have an account?",
        'signup-link': 'Sign up here',
        'developed-by': 'Developed by <strong>Kevin Pinto</strong>'
    },
    qu: {
        'brand-tagline': 'Qampa Yachaysapa Virtual CEO',
        'feature-ai': 'Ñawpaq Negocio IA',
        'feature-secure': 'Banku Nivel Waqaychay',
        'feature-analytics': 'Willaq Analizay',
        'hackathon-badge': 'Huawei Hackathon 2025',
        'login-title': 'Yaykuy',
        'login-subtitle': 'Qampa negocio IA plataformaman yaykuy',
        'email-label': 'Correo Electrónico',
        'password-label': 'Yaykuna rimay',
        'remember-me': 'Yuyariway',
        'forgot-password': 'Yaykuna rimaykita qunqarqankichu?',
        'login-btn': 'Yaykuy',
        'or-continue': 'Utaq kaywan puririchiy',
        'google-login': 'Google',
        'github-login': 'GitHub',
        'no-account': 'Mana cuentayuqchu kanki?',
        'signup-link': 'Kaypi qillqakuy',
        'developed-by': '<strong>Kevin Pinto</strong> rurasqan'
    }
};

let currentLanguage = 'es';

// Función para cambiar idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar textos
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (loginTranslations[lang] && loginTranslations[lang][key]) {
            element.innerHTML = loginTranslations[lang][key];
        }
    });
    
    // Actualizar placeholders
    updatePlaceholders(lang);
    
    // Guardar preferencia
    localStorage.setItem('nexus-language', lang);
}

// Función para actualizar placeholders
function updatePlaceholders(lang) {
    const placeholders = {
        es: {
            'email': 'tu@email.com',
            'password': 'Tu contraseña segura'
        },
        en: {
            'email': 'your@email.com',
            'password': 'Your secure password'
        },
        qu: {
            'email': 'qampa@email.com',
            'password': 'Qampa waqaychasqa yaykuna rimay'
        }
    };
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && placeholders[lang]) {
        emailInput.placeholder = placeholders[lang]['email'];
    }
    if (passwordInput && placeholders[lang]) {
        passwordInput.placeholder = placeholders[lang]['password'];
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Función de login simulado para demostración
async function simulateLogin(email, password) {
    return new Promise((resolve) => {
        // Simular delay de red
        setTimeout(() => {
            // Validar credenciales básicas (cualquier email válido funciona)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                resolve({
                    success: false,
                    message: 'Por favor ingresa un correo electrónico válido'
                });
                return;
            }
            
            if (password.length < 6) {
                resolve({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
                return;
            }
            
            // Crear usuario simulado
            const simulatedUser = {
                id: 'demo-user-' + Date.now(),
                email: email,
                name: email.split('@')[0],
                created_at: new Date().toISOString()
            };
            
            // Guardar en localStorage
            localStorage.setItem('nexus-user', JSON.stringify(simulatedUser));
            localStorage.setItem('nexus-login-time', new Date().toISOString());
            
            resolve({
                success: true,
                user: simulatedUser
            });
        }, 1000); // Simular 1 segundo de carga
    });
}

// Función de autenticación con Supabase (respaldo)
async function authenticateUser(email, password) {
    try {
        if (!supabase) {
            await loadSupabase();
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            return {
                success: false,
                message: error.message === 'Invalid login credentials' ? 
                    'Credenciales incorrectas' : 'Error de autenticación'
            };
        }
        
        // Guardar sesión
        localStorage.setItem('nexus-user', JSON.stringify(data.user));
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('Error en autenticación:', error);
        return {
            success: false,
            message: 'Error de conexión'
        };
    }
}

// Función para registro de usuario
async function registerUser(email, password) {
    try {
        if (!supabase) {
            await loadSupabase();
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            return {
                success: false,
                message: error.message
            };
        }
        
        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        console.error('Error en registro:', error);
        return {
            success: false,
            message: 'Error de conexión'
        };
    }
}

// Función para login con Google
async function loginWithGoogle() {
    try {
        showLoginMessage('Redirigiendo a Google...', 'info');
        
        if (!supabase) {
            await loadSupabase();
        }
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
        
        if (error) {
            showLoginMessage('Error al conectar con Google', 'error');
        }
    } catch (error) {
        console.error('Error Google OAuth:', error);
        showLoginMessage('Error de conexión con Google', 'error');
    }
}

// Función para login con GitHub
async function loginWithGithub() {
    try {
        showLoginMessage('Redirigiendo a GitHub...', 'info');
        
        if (!supabase) {
            await loadSupabase();
        }
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
        
        if (error) {
            showLoginMessage('Error al conectar con GitHub', 'error');
        }
    } catch (error) {
        console.error('Error GitHub OAuth:', error);
        showLoginMessage('Error de conexión con GitHub', 'error');
    }
}

// Función para mostrar mensajes
function showLoginMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insertar antes del formulario
    const loginForm = document.querySelector('.login-form');
    loginForm.insertBefore(messageDiv, loginForm.firstChild);
    
    // Agregar estilos dinámicamente
    const messageStyles = `
        .login-message {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        }
        
        .login-message.success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10B981;
        }
        
        .login-message.error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #EF4444;
        }
        
        .login-message.warning {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #F59E0B;
        }
        
        .login-message.info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #3B82F6;
        }
        
        @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#message-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'message-styles';
        styleSheet.textContent = messageStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Remover mensaje después de 4 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 4000);
}

// Validación del formulario
function validateForm(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        return { valid: false, message: 'Por favor ingresa tu correo electrónico' };
    }
    
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Por favor ingresa un correo electrónico válido' };
    }
    
    if (!password) {
        return { valid: false, message: 'Por favor ingresa tu contraseña' };
    }
    
    if (password.length < 6) {
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    return { valid: true };
}

// Debug: Verificar que el script se carga
console.log('Login script loaded');

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Login DOM loaded');
    // Cargar Supabase
    try {
        await loadSupabase();
        console.log('Supabase cargado correctamente');
    } catch (error) {
        console.error('Error cargando Supabase:', error);
    }
    
    // Configurar idioma inicial
    const savedLanguage = localStorage.getItem('nexus-language') || 'es';
    changeLanguage(savedLanguage);
    
    // Event listeners para cambio de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
    
    // Manejar envío del formulario
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }
    
    console.log('Login form found, adding event listener');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validar formulario
        const validation = validateForm(email, password);
        if (!validation.valid) {
            showLoginMessage(validation.message, 'error');
            return;
        }
        
        // Mostrar loading
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Iniciando sesión...</span>';
        loginBtn.disabled = true;
        
        // Sistema de login de demostración (funciona sin conexión)
        simulateLogin(email, password)
            .then((result) => {
                if (result.success) {
                    showLoginMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                    setTimeout(() => {
                        // Redirigir al chatbot
                        window.location.href = 'chatbot.html';
                    }, 1500);
                } else {
                    showLoginMessage(result.message, 'error');
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                }
            })
            .catch((error) => {
                console.error('Error de autenticación:', error);
                showLoginMessage('Error de conexión. Inténtalo de nuevo.', 'error');
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            });
    });
    
    // Efectos de focus en inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Animación de entrada
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.opacity = '0';
    loginContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        loginContainer.style.transition = 'all 0.6s ease-out';
        loginContainer.style.opacity = '1';
        loginContainer.style.transform = 'translateY(0)';
    }, 100);
});

// Agregar estilos adicionales para animaciones
const additionalStyles = `
    @keyframes slideUp {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .input-container {
        transition: transform 0.2s ease;
    }
    
    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .login-btn:disabled:hover {
        transform: none !important;
    }
`;

// Agregar estilos adicionales al documento
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);
//
// Función para volver al index
function goBackToIndex() {
    console.log('Going back to index');
    try {
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error navigating to index:', error);
        window.open('index.html', '_self');
    }
}

// Hacer función global
window.goBackToIndex = goBackToIndex;
// Función para login demo rápido
function quickDemoLogin() {
    console.log('Quick demo login');
    
    // Llenar campos automáticamente
    document.getElementById('email').value = 'demo@nexusceo.com';
    document.getElementById('password').value = 'password123';
    
    // Mostrar loading
    const demoBtn = document.querySelector('.demo-login-btn');
    const originalText = demoBtn.innerHTML;
    demoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Accediendo...</span>';
    demoBtn.disabled = true;
    
    // Simular login
    simulateLogin('demo@nexusceo.com', 'password123')
        .then((result) => {
            if (result.success) {
                showLoginMessage('¡Acceso demo exitoso! Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = 'chatbot.html';
                }, 1000);
            } else {
                showLoginMessage('Error en demo login', 'error');
                demoBtn.innerHTML = originalText;
                demoBtn.disabled = false;
            }
        })
        .catch((error) => {
            console.error('Error demo login:', error);
            showLoginMessage('Error en demo login', 'error');
            demoBtn.innerHTML = originalText;
            demoBtn.disabled = false;
        });
}

// Hacer función global
window.quickDemoLogin = quickDemoLogin;