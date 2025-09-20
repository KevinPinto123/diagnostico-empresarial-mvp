// Configuración de Gemini AI
const GEMINI_API_KEY = 'AIzaSyCo3VS4i0ramcvRMu0k8gXTnLymxA4H1Ls';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Estado del cuestionario
let currentQuestion = 0;
let answers = {};
let isTyping = false;

const questions = [
    {
        id: 1,
        question: "¿Cuál es tu modelo de negocio principal? (Ej: SaaS, E-commerce, Servicios, Productos físicos, etc.)",
        key: "business_model"
    },
    {
        id: 2,
        question: "¿Quién es tu cliente ideal? Describe tu mercado objetivo, edad, ubicación, necesidades principales.",
        key: "target_market"
    },
    {
        id: 3,
        question: "¿Cuáles son tus ingresos mensuales actuales aproximados? Si aún no tienes ingresos, indica tu proyección.",
        key: "monthly_revenue"
    },
    {
        id: 4,
        question: "¿Cuáles son tus objetivos de crecimiento a 12 meses? (Ingresos, clientes, expansión, etc.)",
        key: "growth_goals"
    },
    {
        id: 5,
        question: "¿Cuál es tu mayor obstáculo o desafío actual para hacer crecer tu negocio?",
        key: "main_challenges"
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    checkAuthentication();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        addBotMessage("¿Estás listo para comenzar con el análisis empresarial? Haz clic en 'Comenzar Análisis' cuando estés preparado.");
    }, 2000);
});

function checkAuthentication() {
    const user = localStorage.getItem('nexus-user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
}

function setupEventListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && !chatInput.disabled) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Click en preguntas del sidebar
    document.querySelectorAll('.question-item').forEach(item => {
        item.addEventListener('click', function() {
            const questionNum = parseInt(this.dataset.question);
            if (questionNum <= currentQuestion + 1) {
                jumpToQuestion(questionNum);
            }
        });
    });
}

function startQuestionnaire() {
    document.getElementById('quickActions').style.display = 'none';
    document.getElementById('chatInput').disabled = false;
    document.getElementById('sendButton').disabled = false;
    
    currentQuestion = 1;
    askCurrentQuestion();
    updateSidebar();
}

function askCurrentQuestion() {
    if (currentQuestion <= questions.length) {
        const question = questions[currentQuestion - 1];
        
        setTimeout(() => {
            addBotMessage(`**Pregunta ${currentQuestion}/5:**\n\n${question.question}`);
            
            // Actualizar sidebar
            updateQuestionStatus(currentQuestion, 'active');
        }, 1000);
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    input.value = '';
    
    // Guardar respuesta
    if (currentQuestion <= questions.length) {
        const question = questions[currentQuestion - 1];
        answers[question.key] = message;
        
        // Marcar pregunta como completada
        updateQuestionStatus(currentQuestion, 'completed');
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Procesar respuesta con IA
        setTimeout(async () => {
            await processAnswerWithAI(message, currentQuestion);
            hideTypingIndicator();
            
            currentQuestion++;
            updateProgress();
            
            if (currentQuestion <= questions.length) {
                // Siguiente pregunta
                setTimeout(() => {
                    askCurrentQuestion();
                }, 1500);
            } else {
                // Cuestionario completado
                setTimeout(() => {
                    completeQuestionnaire();
                }, 1500);
            }
        }, 2000);
    }
}

async function processAnswerWithAI(answer, questionNum) {
    try {
        const question = questions[questionNum - 1];
        const prompt = `Como NEXUS CEO, un experto asesor empresarial, analiza esta respuesta del emprendedor:

Pregunta: ${question.question}
Respuesta: ${answer}

Proporciona un comentario breve (máximo 50 palabras) que:
1. Valide la respuesta
2. Ofrezca una observación valiosa
3. Mantenga un tono profesional y motivador

Responde solo el comentario, sin introducción.`;

        const response = await callGeminiAPI(prompt);
        addBotMessage(response);
        
    } catch (error) {
        console.error('Error procesando respuesta:', error);
        addBotMessage("Excelente respuesta. Continuemos con la siguiente pregunta.");
    }
}

async function callGeminiAPI(prompt) {
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
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

function completeQuestionnaire() {
    addBotMessage("¡Excelente! Has completado todas las preguntas. Ahora puedo generar un análisis completo de tu negocio con recomendaciones personalizadas.");
    
    // Mostrar botón de resumen
    document.getElementById('summarySection').style.display = 'block';
    
    // Deshabilitar input
    document.getElementById('chatInput').disabled = true;
    document.getElementById('sendButton').disabled = true;
    
    addBotMessage("Haz clic en 'Generar Resumen' en el panel lateral para ver tu análisis empresarial completo.");
}

async function generateSummary() {
    try {
        // Mostrar modal con loading
        showSummaryModal();
        document.getElementById('summaryContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                <p>Generando análisis empresarial personalizado...</p>
            </div>
        `;
        
        // Generar resumen con IA
        const summaryPrompt = `Como NEXUS CEO, analiza las siguientes respuestas empresariales y genera un análisis completo:

RESPUESTAS DEL EMPRENDEDOR:
1. Modelo de Negocio: ${answers.business_model}
2. Mercado Objetivo: ${answers.target_market}
3. Ingresos Mensuales: ${answers.monthly_revenue}
4. Objetivos de Crecimiento: ${answers.growth_goals}
5. Principales Desafíos: ${answers.main_challenges}

Genera un análisis estructurado con:

## RESUMEN EJECUTIVO
[Análisis general del negocio en 2-3 líneas]

## FORTALEZAS IDENTIFICADAS
[3-4 puntos fuertes del negocio]

## ÁREAS DE OPORTUNIDAD
[3-4 áreas de mejora específicas]

## RECOMENDACIONES ESTRATÉGICAS
[5 recomendaciones accionables y específicas]

## PRÓXIMOS PASOS
[3 acciones inmediatas a tomar]

Mantén un tono profesional, motivador y específico. Usa formato markdown para estructura.`;

        const summary = await callGeminiAPILong(summaryPrompt);
        
        // Mostrar resumen generado
        document.getElementById('summaryContent').innerHTML = `
            <div class="summary-content">
                ${formatSummaryContent(summary)}
            </div>
        `;
        
    } catch (error) {
        console.error('Error generando resumen:', error);
        document.getElementById('summaryContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--warning-yellow); margin-bottom: 20px;"></i>
                <p>Error al generar el análisis. Por favor, inténtalo de nuevo.</p>
            </div>
        `;
    }
}

async function callGeminiAPILong(prompt) {
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
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

function formatSummaryContent(content) {
    // Convertir markdown básico a HTML
    return content
        .replace(/## (.*)/g, '<h4><i class="fas fa-chart-line"></i> $1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        .replace(/\n- /g, '<li>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/p>$/g, '</ul>')
        .replace(/<p>([^<]*<li>)/g, '<ul><li>$1')
        .replace(/(<li>.*?)<\/p>/g, '$1</li></ul><p>')
        .replace(/<p><\/p>/g, '');
}

// Funciones de UI
function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chatMessages');
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

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function updateProgress() {
    const progress = (Object.keys(answers).length / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Object.keys(answers).length}/5 completadas`;
}

function updateQuestionStatus(questionNum, status) {
    const questionItem = document.querySelector(`[data-question="${questionNum}"]`);
    if (questionItem) {
        questionItem.classList.remove('active', 'completed');
        if (status) {
            questionItem.classList.add(status);
        }
        
        const statusIcon = questionItem.querySelector('.question-status i');
        if (status === 'completed') {
            statusIcon.className = 'fas fa-check-circle';
        } else if (status === 'active') {
            statusIcon.className = 'fas fa-circle-notch fa-spin';
        } else {
            statusIcon.className = 'fas fa-circle';
        }
    }
}

function updateSidebar() {
    // Actualizar estado visual del sidebar
    document.querySelectorAll('.question-item').forEach((item, index) => {
        if (index < currentQuestion - 1) {
            item.classList.add('completed');
            item.classList.remove('active');
        } else if (index === currentQuestion - 1) {
            item.classList.add('active');
            item.classList.remove('completed');
        } else {
            item.classList.remove('active', 'completed');
        }
    });
}

function jumpToQuestion(questionNum) {
    if (questionNum <= currentQuestion) {
        // Permitir revisar respuestas anteriores
        const question = questions[questionNum - 1];
        const previousAnswer = answers[question.key];
        
        addBotMessage(`**Pregunta ${questionNum}/5:** ${question.question}`);
        if (previousAnswer) {
            addBotMessage(`Tu respuesta anterior fue: "${previousAnswer}"`);
            addBotMessage("¿Deseas mantener esta respuesta o modificarla?");
        }
    }
}

function showSummaryModal() {
    document.getElementById('summaryModal').classList.add('active');
}

function closeSummaryModal() {
    document.getElementById('summaryModal').classList.remove('active');
}

function openCRM() {
    // Guardar datos del análisis para el CRM
    localStorage.setItem('nexus-analysis', JSON.stringify({
        answers: answers,
        timestamp: new Date().toISOString(),
        completed: Object.keys(answers).length === questions.length
    }));
    
    // Redirigir al CRM
    window.location.href = 'crm.html';
}

function logout() {
    localStorage.removeItem('nexus-user');
    localStorage.removeItem('nexus-analysis');
    window.location.href = 'login.html';
}