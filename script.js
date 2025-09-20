// Configuración de Gemini AI
const GEMINI_API_KEY = 'AIzaSyCo3VS4i0ramcvRMu0k8gXTnLymxA4H1Ls';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Variables del chatbot
let chatbotOpen = false;
let isTyping = false;

// Traducciones
const translations = {
    es: {
        'nav-home': 'Inicio',
        'nav-features': 'Características',
        'nav-benefits': 'Beneficios',
        'nav-demo': 'Probar Demo',
        'hero-badge': 'Hackathon Huawei 2025',
        'hero-title': 'Convierte tu <span class="gradient-text">Startup</span> en una <span class="gradient-text">Máquina de Éxito</span>',
        'hero-subtitle': 'La primera plataforma de IA en LATAM que democratiza el conocimiento empresarial de élite. Powered by <strong>Huawei Cloud</strong> y <strong>Gemini AI</strong>.',
        'stat-precision': 'Precisión en predicciones',
        'stat-success': 'Tasa de éxito',
        'stat-available': 'Asesoría disponible',
        'cta-demo': 'Probar Demo Gratis',
        'cta-video': 'Ver Video',
        'features-title': 'El Cerebro Colectivo de los Mejores CEOs',
        'features-subtitle': 'No es solo un chatbot más. Es tener la experiencia de Jeff Bezos, Elon Musk y los mejores CEOs trabajando para ti.',
        'feature1-title': 'Análisis Empresarial 360°',
        'feature1-desc': 'Evaluación completa de tu negocio con la precisión de los mejores analistas del mundo.',
        'feature2-title': 'Predicciones en Tiempo Real',
        'feature2-desc': 'Anticipa tendencias de mercado y oportunidades con 85% de precisión.',
        'feature3-title': 'Planes de Acción Automatizados',
        'feature3-desc': 'Estrategias personalizadas basadas en miles de casos de éxito empresarial.',
        'feature4-title': 'Alertas Preventivas',
        'feature4-desc': 'Te avisa 60 días antes de crisis financieras para que puedas actuar a tiempo.',
        'feature5-title': 'Autenticación Segura',
        'feature5-desc': 'Sistema de autenticación robusto que protege tus datos empresariales con encriptación de nivel bancario.',
        'feature6-title': 'Asistente IA Personalizado',
        'feature6-desc': 'Tu CEO virtual que aprende de tu industria y adapta sus recomendaciones a tu modelo de negocio específico.',
        'tech-advanced': 'IA Avanzada',
        'tech-predictive': 'Predictivo',
        'tech-security': 'Seguridad',
        'tech-personalized': 'Personalizado',
        'team-title': 'Desarrollador',
        'team-subtitle': 'Innovador comprometido con democratizar el éxito empresarial en LATAM',
        'developer-role': 'Fundador & Desarrollador Principal',
        'developer-desc': 'Creador de NEXUS CEO, especialista en IA y desarrollo de soluciones empresariales innovadoras.',
        'team-badge': 'Participante Hackathon Huawei 2025',
        'demo-title': '¿Listo para Revolucionar tu Negocio?',
        'demo-subtitle': 'Experimenta el poder de tener los mejores CEOs del mundo como tus asesores personales',
        'demo-message': 'Analicemos tu startup. Veo potencial de crecimiento del 340%...',
        'demo-metric1': 'Precisión',
        'demo-metric2': 'Disponible',
        'demo-cta': 'Probar Demo',
        'demo-free': 'Demo gratuita',
        'demo-secure': 'Acceso seguro',
        'demo-responsive': 'Multiplataforma',
        'footer-developer': 'Desarrollador',
        'footer-hackathon': 'Hackathon Huawei 2025',
        'footer-rights': '© 2025 NEXUS CEO by Kevin Pinto. Todos los derechos reservados.',
        'chatbot-title': 'NEXUS CEO Assistant',
        'chatbot-status': 'En línea',
        'chatbot-welcome': '¡Hola! Soy NEXUS CEO, tu asistente de IA empresarial. Puedo ayudarte con análisis de negocio, estrategias y recomendaciones. ¿Qué te gustaría saber?',
        'chatbot-placeholder': 'Pregúntame sobre tu negocio...'
    },
    en: {
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-benefits': 'Benefits',
        'nav-demo': 'Try Demo',
        'hero-badge': 'Huawei Hackathon 2025',
        'hero-title': 'Turn your <span class="gradient-text">Startup</span> into a <span class="gradient-text">Success Machine</span>',
        'hero-subtitle': 'The first AI platform in LATAM that democratizes elite business knowledge. Powered by <strong>Huawei Cloud</strong> and <strong>Gemini AI</strong>.',
        'stat-precision': 'Prediction accuracy',
        'stat-success': 'Success rate',
        'stat-available': 'Advisory available',
        'cta-demo': 'Try Free Demo',
        'cta-video': 'Watch Video',
        'features-title': 'The Collective Brain of the Best CEOs',
        'features-subtitle': 'It\'s not just another chatbot. It\'s having the experience of Jeff Bezos, Elon Musk and the best CEOs working for you.',
        'feature1-title': '360° Business Analysis',
        'feature1-desc': 'Complete evaluation of your business with the precision of the world\'s best analysts.',
        'feature2-title': 'Real-Time Predictions',
        'feature2-desc': 'Anticipate market trends and opportunities with 85% accuracy.',
        'feature3-title': 'Automated Action Plans',
        'feature3-desc': 'Personalized strategies based on thousands of successful business cases.',
        'feature4-title': 'Preventive Alerts',
        'feature4-desc': 'Warns you 60 days before financial crises so you can act in time.',
        'feature5-title': 'Secure Authentication',
        'feature5-desc': 'Robust authentication system that protects your business data with bank-level encryption.',
        'feature6-title': 'Personalized AI Assistant',
        'feature6-desc': 'Your virtual CEO that learns from your industry and adapts recommendations to your specific business model.',
        'tech-advanced': 'Advanced AI',
        'tech-predictive': 'Predictive',
        'tech-security': 'Security',
        'tech-personalized': 'Personalized',
        'team-title': 'Developer',
        'team-subtitle': 'Innovator committed to democratizing business success in LATAM',
        'developer-role': 'Founder & Lead Developer',
        'developer-desc': 'Creator of NEXUS CEO, specialist in AI and development of innovative business solutions.',
        'team-badge': 'Huawei Hackathon 2025 Participant',
        'demo-title': 'Ready to Revolutionize your Business?',
        'demo-subtitle': 'Experience the power of having the world\'s best CEOs as your personal advisors',
        'demo-message': 'Let\'s analyze your startup. I see 340% growth potential...',
        'demo-metric1': 'Accuracy',
        'demo-metric2': 'Available',
        'demo-cta': 'Try Demo',
        'demo-free': 'Free demo',
        'demo-secure': 'Secure access',
        'demo-responsive': 'Cross-platform',
        'footer-developer': 'Developer',
        'footer-hackathon': 'Huawei Hackathon 2025',
        'footer-rights': '© 2025 NEXUS CEO by Kevin Pinto. All rights reserved.',
        'chatbot-title': 'NEXUS CEO Assistant',
        'chatbot-status': 'Online',
        'chatbot-welcome': 'Hello! I\'m NEXUS CEO, your business AI assistant. I can help you with business analysis, strategies and recommendations. What would you like to know?',
        'chatbot-placeholder': 'Ask me about your business...'
    },
    qu: {
        'nav-home': 'Qallariy',
        'nav-features': 'Ruwanakuna',
        'nav-benefits': 'Allinkaynin',
        'nav-demo': 'Pruebayta ruway',
        'hero-badge': 'Huawei Hackathon 2025',
        'hero-title': 'Qam <span class="gradient-text">Startup</span> nisqaykita <span class="gradient-text">Atipay Maquina</span> man tikray',
        'hero-subtitle': 'LATAM nisqapi ñawpaq kaq IA plataforma, allin negocio yachayta democratizan. <strong>Huawei Cloud</strong> wan <strong>Gemini AI</strong> wan kallpachasqa.',
        'stat-precision': 'Willakuy chiqan kay',
        'stat-success': 'Atipay tupuy',
        'stat-available': 'Yanapay kachkan',
        'cta-demo': 'Mana qullqiyuq pruebayta ruway',
        'cta-video': 'Videota qaway',
        'features-title': 'Aswan Allin CEOkuna Yuyaynin',
        'features-subtitle': 'Mana huk chatbot-lla. Jeff Bezos, Elon Musk hinallataq aswan allin CEOkuna qampa llamkayniypi kasqanku hina.',
        'feature1-title': '360° Negocio Qhaway',
        'feature1-desc': 'Qampa negocioykita hunt\'asqa qhaway, pachantinpi aswan allin analizadorkunapa chiqan kaynin hina.',
        'feature2-title': 'Chiqap Pachapi Willakuykuna',
        'feature2-desc': '85% chiqan kaywan qhatuy tendenciakuna chaymanta oportunidadkuna ñawpaqman riqsiy.',
        'feature3-title': 'Kikinmanta Ruway Planakuna',
        'feature3-desc': 'Waranqa atipasqa negocio kasukuna kaqpi sayasqa sapanchasqa estrategiakuna.',
        'feature4-title': 'Hark\'ay Alertakuna',
        'feature4-desc': '60 p\'unchaykunamanta ñawpaq qullqi sasachakuykunamanta willasunki, chaynapi pachapi ruwanaykipaq.',
        'feature5-title': 'Waqaychasqa Chiqanchay',
        'feature5-desc': 'Sinchi chiqanchay sistema qampa negocio willakunata banku nivel encriptacionwan waqaychan.',
        'feature6-title': 'Sapanchasqa IA Yanapaq',
        'feature6-desc': 'Qampa virtual CEO qampa industriaykimanta yachan chaymanta qampa negocio modeloykiman hina yuyaychaykunata tupuchin.',
        'tech-advanced': 'Ñawpaq IA',
        'tech-predictive': 'Willaq',
        'tech-security': 'Waqaychay',
        'tech-personalized': 'Sapanchasqa',
        'team-title': 'Ruraykunaq',
        'team-subtitle': 'LATAM nisqapi negocio atipaykunata democratizanapaq comprometisqa innovador',
        'developer-role': 'Qallariq & Umalliq Ruraykunaq',
        'developer-desc': 'NEXUS CEO ruraykunaq, IA nisqapi especialista chaymanta musuq negocio solucionkuna ruraypi.',
        'team-badge': 'Huawei Hackathon 2025 Participante',
        'demo-title': 'Negocioykita Revolucionanapaq wakichisqachu kanki?',
        'demo-subtitle': 'Pachantinpi aswan allin CEOkuna qampa sapalla yanapakunayki hina kasqankumanta kallpata experienciay',
        'demo-message': 'Qampa startupykita analizasun. 340% wiñay atiyniyuq kasqanta rikuni...',
        'demo-metric1': 'Chiqan kay',
        'demo-metric2': 'Kachkan',
        'demo-cta': 'Pruebayta Ruway',
        'demo-free': 'Mana qullqiyuq prueba',
        'demo-secure': 'Waqaychasqa yaykuy',
        'demo-responsive': 'Tukuy plataformapi',
        'footer-developer': 'Ruraykunaq',
        'footer-hackathon': 'Huawei Hackathon 2025',
        'footer-rights': '© 2025 NEXUS CEO Kevin Pinto rurasqan. Tukuy derechokuna waqaychasqa.',
        'chatbot-title': 'NEXUS CEO Yanapaq',
        'chatbot-status': 'Kachkan',
        'chatbot-welcome': '¡Napaykullayki! Ñuqa NEXUS CEO kani, qampa negocio IA yanapaqniyki. Negocio qhaway, estrategiakuna chaymanta yuyaychaykunawan yanapaykayki. ¿Imaynatataq yachanayki munankichu?',
        'chatbot-placeholder': 'Negocioykimanta tapukuy...'
    }
};

let currentLanguage = 'es';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar idioma inicial
    const savedLanguage = localStorage.getItem('nexus-language') || 'es';
    changeLanguage(savedLanguage);
    
    // Event listeners para cambio de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
    
    // Configurar navegación suave
    setupSmoothScrolling();
    
    // Configurar efectos de scroll
    setupScrollEffects();
    
    // Configurar animaciones
    setupAnimations();
    
    // Configurar chatbot
    setupChatbot();
    
    // Mostrar notificación inicial del chatbot
    setTimeout(() => {
        showChatbotNotification();
    }, 3000);
});

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
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    
    // Actualizar placeholders
    updatePlaceholders(lang);
    
    // Guardar preferencia
    localStorage.setItem('nexus-language', lang);
}

// Función para actualizar placeholders
function updatePlaceholders(lang) {
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput && translations[lang] && translations[lang]['chatbot-placeholder']) {
        chatbotInput.placeholder = translations[lang]['chatbot-placeholder'];
    }
}

// Configurar navegación suave
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar efectos de scroll
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Efecto navbar
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Configurar animaciones
function setupAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.feature-card, .section-header, .benefits-content, .demo-content');
    animateElements.forEach(el => observer.observe(el));

    // Contador animado para estadísticas
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
}

// Animar contadores
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericTarget / 50;
        
        const updateCounter = () => {
            if (current < numericTarget) {
                current += increment;
                if (isPercentage) {
                    counter.textContent = Math.ceil(current) + '%';
                } else {
                    counter.textContent = target.includes('/') ? 
                        Math.ceil(current) + '/7' : Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Configurar chatbot
function setupChatbot() {
    const chatbotInput = document.getElementById('chatbotInput');
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
}

// Función para toggle del chatbot
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const notification = document.getElementById('chatbotNotification');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbotContainer.classList.add('active');
        chatbotToggle.classList.remove('pulse');
        notification.style.display = 'none';
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById('chatbotInput');
            if (input) input.focus();
        }, 300);
    } else {
        chatbotContainer.classList.remove('active');
    }
}

// Función para enviar mensaje del chatbot
async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Agregar mensaje del usuario
    addChatMessage(message, 'user');
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        // Llamar a Gemini AI
        const response = await callGeminiAPI(message);
        hideTypingIndicator();
        addChatMessage(response, 'bot');
    } catch (error) {
        console.error('Error al llamar Gemini API:', error);
        hideTypingIndicator();
        const errorMessages = {
            es: 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
            en: 'Sorry, there was an error processing your message. Please try again.',
            qu: 'Pampachakuy, qampa willayniykita ruraypi pantay karqan. Huk kutita ruway.'
        };
        addChatMessage(errorMessages[currentLanguage] || errorMessages.es, 'bot');
    }
}

// Función para enviar mensaje en el chatbot
async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Agregar mensaje del usuario
    addChatMessage(message, 'user');
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        // Llamar a Gemini AI
        const response = await callGeminiAPI(message);
        hideTypingIndicator();
        addChatMessage(response, 'bot');
    } catch (error) {
        console.error('Error al llamar Gemini API:', error);
        hideTypingIndicator();
        const errorMessages = {
            es: 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.',
            en: 'Sorry, there was an error processing your message. Please try again.',
            qu: 'Pampachakuy, qampa willayniykita ruraypi pantay karqan. Huk kutita ruway.'
        };
        addChatMessage(errorMessages[currentLanguage] || errorMessages.es, 'bot');
    }
}

// Función para llamar a la API de Gemini
async function callGeminiAPI(message) {
    const systemPrompts = {
        es: `Eres NEXUS CEO, un asistente de inteligencia artificial empresarial especializado en ayudar a emprendedores y CEOs. Tu personalidad es profesional, conocedora y motivadora.

Contexto: NEXUS CEO es la primera plataforma de IA en LATAM que democratiza el conocimiento empresarial de élite, usando Gemini AI y Huawei Cloud.

Instrucciones:
- Responde como un CEO experto con experiencia
- Proporciona consejos prácticos y accionables
- Mantén un tono profesional pero accesible
- Si no sabes algo específico, sé honesto pero ofrece alternativas
- Enfócate en temas empresariales, startups, estrategia, liderazgo
- Mantén las respuestas concisas pero valiosas (máximo 150 palabras)

Pregunta del usuario: ${message}`,
        en: `You are NEXUS CEO, a business artificial intelligence assistant specialized in helping entrepreneurs and CEOs. Your personality is professional, knowledgeable and motivating.

Context: NEXUS CEO is the first AI platform in LATAM that democratizes elite business knowledge, using Gemini AI and Huawei Cloud.

Instructions:
- Respond as an expert CEO with experience
- Provide practical and actionable advice
- Maintain a professional but accessible tone
- If you don't know something specific, be honest but offer alternatives
- Focus on business topics, startups, strategy, leadership
- Keep responses concise but valuable (maximum 150 words)

User question: ${message}`,
        qu: `Qam NEXUS CEO kanki, negocio inteligencia artificial yanapaq, emprendedorkuna chaymanta CEOkuna yanapaypi especializado. Qampa personalidadniyki profesional, yachaynintin chaymanta kallpachaq.

Contexto: NEXUS CEO LATAM nisqapi ñawpaq kaq IA plataforma, allin negocio yachayta democratizan, Gemini AI chaymanta Huawei Cloud nisqawan.

Instrucciones:
- Experienciayuq CEO experto hina kutichiy
- Ruwaylla chaymanta ruwaylla yuyaychaykunata quy
- Profesional ichaqa aypanapaq tonota waqaychay
- Mana imapas específico yachankichu chayqa, chiqap kay ichaqa alternativakunata quy
- Negocio temakuna, startupkuna, estrategia, liderazgo nisqapi enfocakuy
- Kutichiykunata pisilla ichaqa chaniyuq waqaychay (máximo 150 rimaykuna)

Ruwaqpa tapuynin: ${message}`
    };

    const requestBody = {
        contents: [{
            parts: [{
                text: systemPrompts[currentLanguage] || systemPrompts.es
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
        }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Respuesta inválida de la API');
    }
}

// Función para agregar mensaje al chat
function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Deshabilitar botón de envío
    document.getElementById('sendButton').disabled = true;
}

// Función para ocultar indicador de escritura
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    // Habilitar botón de envío
    document.getElementById('sendButton').disabled = false;
}

// Función para sugerencias rápidas
function askSuggestion(question) {
    const input = document.getElementById('chatbotInput');
    input.value = question;
    sendChatMessage();
}

// Función para mostrar notificación del chatbot
function showChatbotNotification() {
    const notification = document.getElementById('chatbotNotification');
    const toggle = document.getElementById('chatbotToggle');
    
    if (notification && toggle && !chatbotOpen) {
        notification.style.display = 'flex';
        toggle.classList.add('pulse');
    }
}

// Función para abrir demo (redirige a login)
function openDemo() {
    console.log('openDemo function called - redirecting to simple login');
    try {
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error navigating to login:', error);
        window.open('login.html', '_self');
    }
}

// Función para scroll al demo
function scrollToDemo() {
    const demoSection = document.querySelector('#demo');
    if (demoSection) {
        const offsetTop = demoSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Agregar estilos CSS adicionales
const additionalStyles = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px 0;
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--primary-red);
        border-radius: 50%;
        animation: typingDot 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typingDot {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    
    .chatbot-status.online {
        color: var(--success-green);
    }
    
    .quick-suggestions {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        flex-wrap: wrap;
    }
    
    .suggestion-btn {
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid var(--primary-red);
        color: var(--white);
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .suggestion-btn:hover {
        background: var(--primary-red);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.98);
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            border-top: 1px solid var(--primary-red);
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
// Función para agregar mensajes al chat
function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para ocultar indicador de escritura
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}