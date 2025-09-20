// Configuración de Gemini AI
const GEMINI_API_KEY = "AIzaSyCo3VS4i0ramcvRMu0k8gXTnLymxA4H1Ls";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Variables globales
let analysisData = {};
let charts = {};

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadAnalysisData();
  setupEventListeners();
  initializeDashboard();
});

function checkAuthentication() {
  const user = localStorage.getItem("nexus-user");
  if (!user) {
    window.location.href = "login.html";
    return;
  }
}

function loadAnalysisData() {
  const savedAnalysis = localStorage.getItem("nexus-analysis");
  if (savedAnalysis) {
    analysisData = JSON.parse(savedAnalysis);
    console.log("Datos de análisis cargados:", analysisData);
  } else {
    // Datos de ejemplo si no hay análisis previo
    analysisData = {
      answers: {
        business_model: "SaaS - Software como Servicio",
        target_market: "Pequeñas y medianas empresas en LATAM",
        monthly_revenue: "$5,000 USD mensuales",
        growth_goals: "Alcanzar $50,000 USD mensuales en 12 meses",
        main_challenges: "Adquisición de clientes y retención",
      },
      completed: true,
    };
  }
}

function setupEventListeners() {
  // Menu sidebar
  document.querySelectorAll(".menu-item[data-section]").forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.dataset.section;
      switchSection(section);

      // Actualizar menu activo
      document
        .querySelectorAll(".menu-item")
        .forEach((mi) => mi.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

async function initializeDashboard() {
  showLoading();

  try {
    // Generar KPIs basados en los datos
    await generateKPIs();

    // Inicializar gráficos
    initializeCharts();

    // Generar contenido de análisis
    await generateAnalysisContent();

    // Generar recomendaciones
    await generateRecommendations();

    // Cargar contenido de métricas
    loadMetricsContent();

    hideLoading();
  } catch (error) {
    console.error("Error inicializando dashboard:", error);
    hideLoading();
  }
}

async function generateKPIs() {
  if (!analysisData.answers) return;

  // Extraer números de los ingresos
  const revenueMatch = analysisData.answers.monthly_revenue.match(/[\d,]+/);
  const currentRevenue = revenueMatch
    ? parseInt(revenueMatch[0].replace(",", ""))
    : 5000;

  // Actualizar KPIs con formato de moneda
  document.getElementById(
    "revenueKPI"
  ).textContent = `$${currentRevenue.toLocaleString()}`;

  // Calcular métricas estimadas más realistas
  const estimatedCustomers = Math.floor(currentRevenue / 50) || 100;
  const conversionRate = Math.min(Math.floor(currentRevenue / 500) + 5, 25);
  const growthRate = Math.floor(Math.random() * 40) + 20;

  document.getElementById("customersKPI").textContent =
    estimatedCustomers.toLocaleString();
  document.getElementById("conversionKPI").textContent = `${conversionRate}%`;
  document.getElementById("growthKPI").textContent = `${growthRate}%`;
}

function initializeCharts() {
  // Gráfico de ingresos
  const revenueCtx = document.getElementById("revenueChart");
  if (revenueCtx) {
    // Generar datos más realistas
    const baseRevenue = 3000;
    const revenueData = [];
    for (let i = 0; i < 6; i++) {
      revenueData.push(baseRevenue + i * 500 + Math.random() * 1000);
    }

    charts.revenue = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Ingresos ($)",
            data: revenueData,
            borderColor: "#DC2626",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#FFFFFF",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#FFFFFF",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#FFFFFF",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });
  }

  // Gráfico de mercado
  const marketCtx = document.getElementById("marketChart");
  if (marketCtx) {
    charts.market = new Chart(marketCtx, {
      type: "doughnut",
      data: {
        labels: ["Tu Negocio", "Competidor A", "Competidor B", "Otros"],
        datasets: [
          {
            data: [25, 30, 20, 25],
            backgroundColor: [
              "#DC2626",
              "#EF4444",
              "#B91C1C",
              "rgba(255, 255, 255, 0.3)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#FFFFFF",
              padding: 20,
            },
          },
        },
      },
    });
  }
}

async function generateAnalysisContent() {
  if (!analysisData.answers) return;

  try {
    const prompt = `Como NEXUS CEO, genera un análisis empresarial detallado basado en estas respuestas:

DATOS DEL NEGOCIO:
- Modelo: ${analysisData.answers.business_model}
- Mercado: ${analysisData.answers.target_market}
- Ingresos: ${analysisData.answers.monthly_revenue}
- Objetivos: ${analysisData.answers.growth_goals}
- Desafíos: ${analysisData.answers.main_challenges}

Genera un análisis estructurado con:

## ANÁLISIS DE SITUACIÓN ACTUAL
[Evaluación del estado actual del negocio en 2-3 párrafos]

## ANÁLISIS DE MERCADO
[Oportunidades y amenazas del mercado en 2-3 párrafos]

## ANÁLISIS FINANCIERO
[Proyecciones y recomendaciones financieras en 2-3 párrafos]

## ANÁLISIS COMPETITIVO
[Posicionamiento vs competencia en 2-3 párrafos]

Usa formato HTML con <h4>, <p>, <ul>, <li>. Máximo 800 palabras.`;

    const analysis = await callGeminiAPI(prompt);
    document.getElementById("analysisContent").innerHTML =
      formatAnalysisContent(analysis);

    // También actualizar el resumen de negocio
    const summaryPrompt = `Basado en los datos anteriores, genera un resumen ejecutivo de 3 párrafos sobre este negocio. Formato HTML con <p>.`;
    const summary = await callGeminiAPI(summaryPrompt);
    document.getElementById("businessSummaryContent").innerHTML = summary;
  } catch (error) {
    console.error("Error generando análisis:", error);
    // Contenido de respaldo
    document.getElementById("analysisContent").innerHTML = `
            <h4><i class="fas fa-chart-line"></i> Análisis de Situación Actual</h4>
            <p>Tu negocio ${analysisData.answers.business_model} muestra un potencial sólido en el mercado ${analysisData.answers.target_market}. Con ingresos actuales de ${analysisData.answers.monthly_revenue}, tienes una base financiera estable para el crecimiento.</p>
            
            <h4><i class="fas fa-target"></i> Análisis de Mercado</h4>
            <p>El mercado objetivo presenta oportunidades significativas de expansión. Las tendencias actuales favorecen tu modelo de negocio, especialmente en la región LATAM donde hay una creciente demanda de soluciones digitales.</p>
            
            <h4><i class="fas fa-dollar-sign"></i> Análisis Financiero</h4>
            <p>Basado en tus objetivos de ${analysisData.answers.growth_goals}, necesitarás implementar estrategias de escalamiento que incluyan optimización de costos y diversificación de ingresos.</p>
            
            <h4><i class="fas fa-chess"></i> Análisis Competitivo</h4>
            <p>Tu principal desafío "${analysisData.answers.main_challenges}" es común en el sector, pero con las estrategias correctas puedes convertirlo en una ventaja competitiva.</p>
        `;

    document.getElementById("businessSummaryContent").innerHTML = `
            <p><strong>Resumen Ejecutivo:</strong> Tu empresa opera en el sector ${analysisData.answers.business_model} con un enfoque en ${analysisData.answers.target_market}.</p>
            <p><strong>Situación Financiera:</strong> Con ingresos de ${analysisData.answers.monthly_revenue}, la empresa muestra estabilidad y potencial de crecimiento hacia ${analysisData.answers.growth_goals}.</p>
            <p><strong>Próximos Pasos:</strong> El principal foco debe estar en resolver ${analysisData.answers.main_challenges} mediante estrategias de crecimiento sostenible y optimización operacional.</p>
        `;
  }
}

function formatAnalysisContent(content) {
  return content
    .replace(/## (.*)/g, '<h4><i class="fas fa-chart-line"></i> $1</h4>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><\/p>/g, "");
}

async function generateRecommendations() {
  if (!analysisData.answers) return;

  try {
    const prompt = `Como NEXUS CEO, genera 5 recomendaciones estratégicas específicas para este negocio:

CONTEXTO:
- Modelo: ${analysisData.answers.business_model}
- Mercado: ${analysisData.answers.target_market}
- Ingresos: ${analysisData.answers.monthly_revenue}
- Objetivos: ${analysisData.answers.growth_goals}
- Desafíos: ${analysisData.answers.main_challenges}

Para cada recomendación incluye:
1. Título específico y accionable
2. Descripción detallada (2-3 líneas)
3. Prioridad (Alta/Media/Baja)
4. Impacto esperado

Responde en formato: TITULO|DESCRIPCION|PRIORIDAD|IMPACTO (separado por |)`;

    const recommendations = await callGeminiAPI(prompt);
    const recommendationsContainer = document.getElementById(
      "recommendationsContent"
    );

    // Procesar recomendaciones
    const recLines = recommendations
      .split("\n")
      .filter((line) => line.includes("|"));
    let recommendationsHTML = "";

    if (recLines.length === 0) {
      // Recomendaciones de respaldo
      const backupRecs = [
        "Optimizar Adquisición de Clientes|Implementar estrategias de marketing digital y automatización para reducir el costo de adquisición de clientes en un 30%.|Alta|+40% en conversiones",
        "Diversificar Fuentes de Ingresos|Desarrollar productos complementarios o servicios premium para aumentar el valor promedio por cliente.|Alta|+25% ingresos",
        "Automatizar Procesos Operativos|Implementar herramientas de automatización para reducir costos operativos y mejorar la eficiencia.|Media|+20% eficiencia",
        "Expandir Mercado Geográfico|Explorar nuevos mercados en LATAM con estrategias de localización específicas.|Media|+35% mercado potencial",
        "Fortalecer Retención de Clientes|Desarrollar programas de fidelización y mejorar la experiencia del cliente para reducir la rotación.|Baja|+15% retención",
      ];

      backupRecs.forEach((line, index) => {
        const [title, description, priority, impact] = line.split("|");
        const priorityClass = priority.toLowerCase().includes("alta")
          ? "priority-high"
          : priority.toLowerCase().includes("media")
          ? "priority-medium"
          : "priority-low";

        recommendationsHTML += `
                    <div class="recommendation-card">
                        <h4><i class="fas fa-lightbulb"></i> ${title}</h4>
                        <p>${description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <span class="priority-badge ${priorityClass}">${priority}</span>
                            <span style="color: var(--success-green); font-weight: 600;">${impact}</span>
                        </div>
                    </div>
                `;
      });
    } else {
      recLines.forEach((line, index) => {
        const [title, description, priority, impact] = line.split("|");
        const priorityClass = priority.toLowerCase().includes("alta")
          ? "priority-high"
          : priority.toLowerCase().includes("media")
          ? "priority-medium"
          : "priority-low";

        recommendationsHTML += `
                    <div class="recommendation-card">
                        <h4><i class="fas fa-lightbulb"></i> ${title}</h4>
                        <p>${description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            <span class="priority-badge ${priorityClass}">${priority}</span>
                            <span style="color: var(--success-green); font-weight: 600;">${impact}</span>
                        </div>
                    </div>
                `;
      });
    }

    recommendationsContainer.innerHTML = recommendationsHTML;
  } catch (error) {
    console.error("Error generando recomendaciones:", error);
    // Contenido de respaldo ya incluido arriba
  }
}

function loadMetricsContent() {
  // Cargar análisis competitivo
  const competitiveAnalysis = document.getElementById("competitiveAnalysis");
  if (competitiveAnalysis) {
    competitiveAnalysis.innerHTML = `
            <div class="competitor-item">
                <div class="competitor-info">
                    <span class="competitor-name">Tu Posición Actual</span>
                    <span class="competitor-desc">Basado en tu modelo de negocio</span>
                </div>
                <div class="competitor-score">
                    <span class="score-value">75</span>
                    <span class="score-max">/100</span>
                </div>
            </div>
            <div class="competitor-item">
                <div class="competitor-info">
                    <span class="competitor-name">Líder del Mercado</span>
                    <span class="competitor-desc">Referente en tu industria</span>
                </div>
                <div class="competitor-score">
                    <span class="score-value">85</span>
                    <span class="score-max">/100</span>
                </div>
            </div>
            <div class="competitor-item">
                <div class="competitor-info">
                    <span class="competitor-name">Competidor Directo</span>
                    <span class="competitor-desc">Similar tamaño y mercado</span>
                </div>
                <div class="competitor-score">
                    <span class="score-value">70</span>
                    <span class="score-max">/100</span>
                </div>
            </div>
            <div class="competitor-item">
                <div class="competitor-info">
                    <span class="competitor-name">Promedio del Sector</span>
                    <span class="competitor-desc">Benchmark de la industria</span>
                </div>
                <div class="competitor-score">
                    <span class="score-value">65</span>
                    <span class="score-max">/100</span>
                </div>
            </div>
        `;
  }

  // Cargar oportunidades de mercado
  const marketOpportunities = document.getElementById("marketOpportunities");
  if (marketOpportunities) {
    marketOpportunities.innerHTML = `
            <div class="opportunity-item">
                <div class="opportunity-header">
                    <h5><i class="fas fa-rocket"></i> Expansión Digital</h5>
                    <span class="opportunity-potential">+40%</span>
                </div>
                <p>Oportunidad de crecimiento del 40% mediante optimización de canales digitales y marketing automatizado.</p>
            </div>
            <div class="opportunity-item">
                <div class="opportunity-header">
                    <h5><i class="fas fa-building"></i> Mercado B2B</h5>
                    <span class="opportunity-potential">+60%</span>
                </div>
                <p>Potencial no explorado en el segmento empresarial con soluciones personalizadas para PyMEs.</p>
            </div>
            <div class="opportunity-item">
                <div class="opportunity-header">
                    <h5><i class="fas fa-cogs"></i> Automatización</h5>
                    <span class="opportunity-potential">+25%</span>
                </div>
                <p>Reducción de costos del 25% mediante automatización de procesos operativos y atención al cliente.</p>
            </div>
            <div class="opportunity-item">
                <div class="opportunity-header">
                    <h5><i class="fas fa-globe-americas"></i> Expansión LATAM</h5>
                    <span class="opportunity-potential">+80%</span>
                </div>
                <p>Mercado regional con alta demanda de soluciones tecnológicas y baja competencia directa.</p>
            </div>
        `;
  }

  // Inicializar gráficos adicionales
  initializeMetricsCharts();
}

function initializeMetricsCharts() {
  // Gráfico financiero
  const financialCtx = document.getElementById("financialChart");
  if (financialCtx && !charts.financial) {
    charts.financial = new Chart(financialCtx, {
      type: "bar",
      data: {
        labels: ["Ingresos", "Gastos", "Ganancia", "Proyección"],
        datasets: [
          {
            label: "Financiero ($)",
            data: [5000, 3500, 1500, 7500],
            backgroundColor: [
              "rgba(220, 38, 38, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(59, 130, 246, 0.8)",
            ],
            borderColor: ["#DC2626", "#EF4444", "#10B981", "#3B82F6"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#FFFFFF",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#FFFFFF",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });
  }

  // Gráfico de clientes
  const customerCtx = document.getElementById("customerChart");
  if (customerCtx && !charts.customer) {
    charts.customer = new Chart(customerCtx, {
      type: "pie",
      data: {
        labels: ["Nuevos", "Recurrentes", "Inactivos"],
        datasets: [
          {
            data: [40, 45, 15],
            backgroundColor: ["#DC2626", "#10B981", "rgba(255, 255, 255, 0.3)"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#FFFFFF",
              padding: 15,
            },
          },
        },
      },
    });
  }
}

async function callGeminiAPI(prompt) {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error("Respuesta inválida de la API");
  }
}

// Funciones de navegación
function switchSection(sectionName) {
  // Ocultar todas las secciones
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Mostrar sección seleccionada
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add("active");

    // Cargar contenido específico si es necesario
    if (sectionName === "metrics") {
      loadMetricsContent();
    }
  }
}

// Funciones de utilidad
function showLoading() {
  document.getElementById("loadingOverlay").classList.add("active");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
}

function refreshData() {
  const refreshBtn = document.querySelector(".refresh-btn");
  refreshBtn.style.transform = "rotate(360deg)";

  setTimeout(() => {
    refreshBtn.style.transform = "rotate(0deg)";
    // Recargar datos
    initializeDashboard();
    showNotification("Datos actualizados correctamente", "success");
  }, 1000);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-info-circle"
        }"></i>
        <span>${message}</span>
    `;

  // Agregar estilos si no existen
  if (!document.querySelector("#notification-styles")) {
    const styles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--dark-gray);
                border: 1px solid var(--primary-red);
                color: var(--white);
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                box-shadow: var(--shadow-lg);
            }
            
            .notification.success {
                border-color: var(--success-green);
            }
            
            .notification.success i {
                color: var(--success-green);
            }
            
            @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.id = "notification-styles";
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Funciones de exportación
function exportData() {
  showNotification("Preparando exportación de datos...", "info");

  setTimeout(() => {
    const dataToExport = {
      business_analysis: analysisData,
      generated_at: new Date().toISOString(),
      user: "Kevin Pinto - NEXUS CEO",
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nexus-ceo-analysis-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    showNotification("Datos exportados correctamente", "success");
  }, 1500);
}

function scheduleReport() {
  showNotification("Funcionalidad de programación próximamente", "info");
}

function generateExecutiveReport() {
  showNotification("Generando reporte ejecutivo...", "info");
  setTimeout(() => {
    showNotification("Reporte PDF generado (simulación)", "success");
  }, 2000);
}

function generateFinancialReport() {
  showNotification("Generando análisis financiero...", "info");
  setTimeout(() => {
    showNotification("Reporte Excel generado (simulación)", "success");
  }, 2000);
}

function generateActionPlan() {
  showNotification("Generando plan de acción...", "info");
  setTimeout(() => {
    showNotification("Plan de acción generado (simulación)", "success");
  }, 2000);
}

// Funciones de navegación
function goBackToChat() {
  window.location.href = "chatbot.html";
}

function logout() {
  localStorage.removeItem("nexus-user");
  localStorage.removeItem("nexus-analysis");
  window.location.href = "login.html";
}
