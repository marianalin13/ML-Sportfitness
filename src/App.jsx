import React, { useState, useMemo } from "react";

/* ============================================================
   ML Sportfitness — Prescripción inteligente de ejercicio y nutrición
   MVP funcional · Valoración guiada · Nutrición · Gym · Running
   Bilingüe ES/EN · Tamizaje de seguridad · Adaptación dinámica
   ============================================================ */

/* ---------- THEME ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&family=Inter:wght@400;500;600;700&display=swap');
:root{
  --bg:#F2F4EF; --card:#FFFFFF; --ink:#15241F; --ink2:#4A5A52;
  --sel:#0F5C49; --sel-soft:#E2EEE9; --papaya:#FF7A45; --papaya-soft:#FFE9DF;
  --sun:#F4B62E; --sun-soft:#FBF0D4; --line:#DDE3DA; --danger:#C0392B; --danger-soft:#FAE7E4;
}
*{box-sizing:border-box}
.mlsf{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.disp{font-family:'Archivo','Inter',sans-serif;font-stretch:115%;font-weight:800;letter-spacing:-0.02em}
.wrap{max-width:980px;margin:0 auto;padding:0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px}
.btn{font:inherit;font-weight:600;border:none;border-radius:12px;padding:13px 22px;cursor:pointer;transition:transform .12s ease, box-shadow .12s ease}
.btn:focus-visible{outline:3px solid var(--sun);outline-offset:2px}
.btn:active{transform:scale(.98)}
.btn-p{background:var(--sel);color:#fff}
.btn-p:hover{box-shadow:0 6px 16px rgba(15,92,73,.28)}
.btn-a{background:var(--papaya);color:#fff}
.btn-g{background:transparent;color:var(--sel);border:1.5px solid var(--sel)}
.btn-sm{padding:7px 14px;border-radius:9px;font-size:13px}
.chip{display:inline-flex;align-items:center;gap:6px;border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:8px 14px;cursor:pointer;font-size:14px;font-weight:500;transition:all .12s}
.chip.on{background:var(--sel);border-color:var(--sel);color:#fff}
.chip-warn.on{background:var(--danger);border-color:var(--danger)}
.field{margin-bottom:18px}
.field label{display:block;font-weight:600;font-size:14px;margin-bottom:6px}
.field input,.field select{width:100%;font:inherit;padding:12px 14px;border:1.5px solid var(--line);border-radius:12px;background:#fff;color:var(--ink)}
.field input:focus,.field select:focus{outline:none;border-color:var(--sel);box-shadow:0 0 0 3px var(--sel-soft)}
.why{display:flex;gap:8px;background:var(--sun-soft);border-radius:10px;padding:10px 12px;font-size:13px;color:#5a4a17;margin-top:6px;line-height:1.45}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sel)}
.tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.06em;padding:3px 9px;border-radius:6px}
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl th{text-align:left;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);padding:8px 10px;border-bottom:2px solid var(--line)}
.tbl td{padding:11px 10px;border-bottom:1px solid var(--line);vertical-align:top}
.pulseline{height:34px;width:100%}
.fade{animation:fadeUp .35s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.fade{animation:none}}
.tabbar{display:flex;gap:4px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:5px;overflow-x:auto}
.tab{flex:1;min-width:90px;text-align:center;padding:10px 8px;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;border:none;background:transparent;color:var(--ink2);font-family:inherit}
.tab.on{background:var(--sel);color:#fff}
.weekpill{min-width:46px;padding:9px 0;border-radius:11px;border:1.5px solid var(--line);background:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink2)}
.weekpill.on{background:var(--papaya);border-color:var(--papaya);color:#fff}
.weekpill.done{background:var(--sel-soft);border-color:var(--sel);color:var(--sel)}
.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--ink);color:#fff;padding:14px 22px;border-radius:14px;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:50;max-width:90%;text-align:center}
.measure-fig{background:var(--sel-soft);border-radius:14px;padding:14px;display:flex;justify-content:center}
a.vid{color:var(--sel);font-weight:600;text-decoration:none;font-size:13px}
a.vid:hover{text-decoration:underline}
.progressbar{height:6px;background:var(--line);border-radius:99px;overflow:hidden}
.progressbar>div{height:100%;background:linear-gradient(90deg,var(--sel),var(--papaya));border-radius:99px;transition:width .3s}
`;

/* ---------- Signature: pulse line (ECG → ritmo de carrera) ---------- */
const PulseLine = ({ color = "var(--papaya)" }) => (
  <svg className="pulseline" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 22 H120 l14-9 14 9 22 0 10-16 12 30 12-22 8 8 H320 l12-7 12 7 H440 l10-13 12 22 10-9 H600"
      fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

/* ---------- i18n ---------- */
const T = {
  es: {
    brand: "ML Sportfitness", tagline: "Tu prescripción de ejercicio y nutrición, hecha como la haría un profesional.",
    start: "Crear mi valoración", lang: "EN",
    disclaimer: "ML Sportfitness es una herramienta de orientación y acompañamiento. No reemplaza la consulta médica, nutricional, fisioterapéutica ni deportiva profesional.",
    welcomeNote: "Creada por una fisioterapeuta colombiana, corredora y apasionada del deporte. Cada recomendación se fundamenta en guías de la ACSM, la OMS y evidencia científica actual.",
    next: "Continuar", back: "Atrás", finish: "Generar mi plan",
    stepOf: (a, b) => `Paso ${a} de ${b}`,
    s1: "Cuéntanos de ti", s2: "Tu salud, primero", s3: "Tus medidas", s4: "Tu objetivo", s5: "Tu historia en el gimnasio", s6: "Tu historia corriendo", s7: "Tu alimentación", s8: "Tu tiempo",
    name: "¿Cómo te llamas?", nameWhy: "Queremos hablarte por tu nombre, como lo haría tu entrenador.",
    age: "Edad (años)", ageWhy: "La edad ajusta tu gasto energético y la progresión segura de cargas (fórmula de Mifflin-St Jeor y guías ACSM).",
    sex: "Sexo biológico", sexWhy: "Hombres y mujeres tienen diferencias metabólicas y de composición corporal que cambian el cálculo calórico.",
    sexF: "Femenino", sexM: "Masculino",
    height: "Talla (cm)", heightWhy: "Mídete descalzo/a, de espaldas a una pared, talones juntos y mirada al frente. Marca con un lápiz sobre tu cabeza y mide desde el piso.",
    weight: "Peso (kg)", weightWhy: "Pésate en ayunas, después de ir al baño, con ropa ligera y siempre en la misma báscula. Así el dato es comparable semana a semana.",
    city: "Ciudad", cityWhy: "La altitud importa: entrenar en Bogotá (2.600 m) no es igual que en Cartagena. Ajustamos las expectativas de ritmo.",
    healthIntro: "Antes de prescribir ejercicio, todo profesional hace un tamizaje. Marca lo que aplique. Ser honesto/a aquí te protege.",
    healthNone: "Ninguna de las anteriores",
    conds: ["Enfermedad cardiovascular activa o dolor en el pecho", "Diabetes no controlada", "Cáncer en tratamiento", "Embarazo de alto riesgo", "Hipertensión no controlada", "Mareos o desmayos al hacer esfuerzo", "Otra condición que requiere supervisión médica"],
    injuries: "¿Lesiones o molestias actuales?", injuriesWhy: "Adaptaremos los ejercicios para proteger la zona. Por ejemplo, si reportas rodilla, evitamos alto impacto y priorizamos fortalecimiento sin dolor.",
    injKnee: "Rodilla", injShoulder: "Hombro", injBack: "Espalda baja", injAnkle: "Tobillo", injNone: "Ninguna",
    blockedTitle: "Tu salud merece atención especializada",
    blockedBody: (n) => `${n}, gracias por tu honestidad. Lo que nos contaste indica que necesitas la valoración de tu médico tratante antes de iniciar un plan de ejercicio o nutrición. ML Sportfitness está diseñada para población aparentemente sana, y prescribirte sin esa valoración sería irresponsable. Cuando tu médico te dé el visto bueno, aquí estaremos para acompañarte. Esto no es un rechazo: es cuidarte de verdad.`,
    blockedBtn: "Entendido, consultaré a mi médico",
    waist: "Perímetro de cintura (cm)", hip: "Perímetro de cadera (cm)",
    measureGuide: "Cómo tomarte las medidas en casa",
    waistHow: "Cintura: de pie, relajado/a, ubica el punto medio entre tu última costilla y el borde superior de la cadera (cresta ilíaca). Pasa la cinta horizontal, sin apretar, y mide al final de una exhalación normal.",
    hipHow: "Cadera: de pie con los pies juntos, pasa la cinta por la parte más prominente de los glúteos, manteniéndola horizontal. Mide sin comprimir la piel.",
    measureWhy: "Estos perímetros (protocolo ISAK/OMS) nos permiten calcular tu índice cintura-cadera y cintura-talla, mejores indicadores de riesgo metabólico que el peso solo.",
    goal: "¿Cuál es tu objetivo principal?",
    goalFat: "Perder grasa", goalMuscle: "Ganar masa muscular", goalHealth: "Salud y resistencia",
    goalWhy: "El objetivo define todo: calorías, distribución de macronutrientes, tipo de entrenamiento y progresión. Elige el que más te mueva hoy; podrás ajustarlo después.",
    modules: "¿Qué módulos quieres activar?", modGym: "Gimnasio", modRun: "Running", modNutri: "Nutrición",
    gymBefore: "¿Has entrenado en gimnasio antes?", yes: "Sí", no: "No",
    gymStop: "¿Hace cuánto dejaste de entrenar?", gymStopWhy: "Tras más de 3 meses de pausa el cuerpo pierde adaptaciones. Retomar con las cargas de antes es la causa #1 de lesiones de retorno. Tu plan iniciará como 'retorno progresivo'.",
    stopOpts: ["Sigo entrenando", "Menos de 3 meses", "3 a 12 meses", "Más de 1 año"],
    level: "¿Cómo describirías tu nivel?", levelWhy: "Sé honesto/a: un plan de nivel correcto da resultados más rápido que uno 'avanzado' mal ejecutado.",
    lvlBeg: "Principiante", lvlInt: "Intermedio", lvlAdv: "Avanzado",
    runBefore: "¿Corres actualmente o has corrido antes?",
    runNow: "Corro actualmente", runPast: "Corrí antes, lo dejé", runNever: "Nunca he corrido",
    runStop: "¿Hace cuánto dejaste de correr?",
    pace: "Ritmo aproximado actual (min/km)", paceWhy: "Es el tiempo que tardas en correr 1 km a un esfuerzo en el que aún puedes hablar. Si usas reloj o app, revisa tu promedio. Si no, corre 1 km cómodo y toma el tiempo. De ahí derivamos tus zonas de entrenamiento.",
    runFreq: "¿Cuántas veces corres por semana?",
    racesBefore: "¿Has participado en carreras? ¿Qué distancias?",
    raceGoal: "¿Te preparas para una carrera específica?",
    raceNone: "No, corro por salud",
    raceCalNote: "Calendario referencial de carreras en Colombia 2026. Confirma siempre fecha e inscripción con el organizador.",
    weeksAway: (w) => `Faltan ${w} semanas`,
    raceTooSoon: (race, w, min) => `⚠️ Para llegar bien preparado/a a ${race} necesitarías al menos ${min} semanas con tu nivel actual, y solo quedan ${w}. Forzarlo aumentaría tu riesgo de lesión. Mira estas alternativas alcanzables:`,
    raceOk: (race, w) => `¡Excelente meta! Faltan ${w} semanas para ${race}: tiempo suficiente para una periodización segura. Tu plan estará construido hacia esa fecha.`,
    pickAlt: "Elegir esta carrera",
    mealsDay: "¿Cuántas comidas haces al día?",
    allergies: "Alergias e intolerancias", allergiesWhy: "Jamás incluiremos estos alimentos en tu plan. Tu seguridad no es negociable.",
    alLactose: "Lactosa", alGluten: "Gluten", alNuts: "Frutos secos", alSeafood: "Mariscos", alEgg: "Huevo", alNone: "Ninguna",
    dislikes: "Alimentos que no te gustan (separados por coma)", dislikesWhy: "Un plan que no disfrutas es un plan que abandonas. Los sustituiremos por equivalentes nutricionales.",
    budget: "Presupuesto para alimentación", budgetWhy: "Comer bien no debe ser un lujo. Adaptamos el plan a alimentos accesibles en Colombia según tu presupuesto.",
    bLow: "Ajustado", bMid: "Medio", bHigh: "Amplio",
    daysWeek: "¿Cuántos días a la semana puedes entrenar?", daysWhy: "Un plan realista que cumples vale más que uno perfecto que abandonas. La OMS recomienda mínimo 150 min semanales de actividad moderada.",
    minsSession: "¿Minutos por sesión?",
    genTitle: "Construyendo tu plan…",
    dashHello: (n) => `Hola, ${n} 👋`,
    tabToday: "Hoy", tabNutri: "Nutrición", tabGym: "Gimnasio", tabRun: "Running", tabProfile: "Perfil",
    week: "Semana", currentWeek: "Semana actual", preview: "Vista previa",
    weekGoals: "Objetivos de la semana", motivation: "Tu mensaje de la semana",
    kcalTarget: "Meta calórica diaria", protein: "Proteína", carbs: "Carbohidratos", fat: "Grasas",
    mealPlan: "Tu día de alimentación", swap: "Cambiar", swapped: "Listo, lo cambiamos por una alternativa equivalente 🍃",
    reportFood: "Reportar un ajuste", addAllergy: "Agregar alergia/intolerancia",
    technique: "Técnica", video: "Ver técnica en video", sets: "Series", reps: "Reps", rest: "Descanso",
    markDone: "Completar sesión", done: "¡Completada!",
    sessionType: "Tipo de sesión", distance: "Distancia", targetPace: "Ritmo objetivo",
    reportInjury: "Reportar molestia física", injuryAdjusted: "Plan ajustado: cambiamos los ejercicios que cargaban esa zona 💪",
    sources: "Fuentes científicas", sourcesBtn: "Ver fuentes",
    profileTitle: "Tu valoración", bmi: "IMC", whr: "Índice cintura-cadera", whtr: "Índice cintura-talla",
    bmr: "Metabolismo basal", tdee: "Gasto energético total",
    editNote: "En la versión completa podrás actualizar tus medidas cada 4 semanas y el plan se recalculará.",
    restDay: "Descanso activo", phase: "Fase",
    phases: { adapt: "Adaptación anatómica", build: "Construcción", intensify: "Intensificación", peak: "Pico y puesta a punto", base: "Base aeróbica", taper: "Tapering" },
    runTypes: {
      easy: { n: "Rodaje suave", d: "Carrera cómoda en la que puedes conversar. Construye tu base aeróbica y enseña al cuerpo a usar grasa como combustible. Debe sentirse fácil de verdad." },
      walkrun: { n: "Caminar-trotar", d: "Alterna intervalos de trote suave y caminata. Es el método más seguro para que tendones y articulaciones se adapten al impacto. ¡Caminar no es trampa, es estrategia!" },
      intervals: { n: "Series", d: "Repeticiones cortas a ritmo fuerte con recuperación entre cada una. Mejoran tu velocidad y economía de carrera. El descanso entre series es parte del entrenamiento." },
      fartlek: { n: "Fartlek", d: "'Juego de velocidad': dentro de un rodaje, acelera por tramos libres (ej. hasta el siguiente poste) y recupera trotando. Mejora el ritmo sin la rigidez de la pista." },
      long: { n: "Tirada larga", d: "La sesión más importante de la semana: distancia mayor a ritmo tranquilo. Desarrolla resistencia física y mental. Hidrátate y no te preocupes por la velocidad." },
      tempo: { n: "Tempo", d: "Ritmo 'cómodamente incómodo' sostenido: puedes decir frases cortas pero no conversar. Sube tu umbral, el ritmo que puedes mantener en carrera." },
      rest: { n: "Descanso", d: "El progreso ocurre cuando descansas: el cuerpo asimila el entrenamiento. Camina, estírate o simplemente descansa sin culpa." },
    },
    motiv: [
      (n) => `${n}, empezar ya te pone delante de quien sigue pensándolo. Esta semana solo tienes una misión: presentarte.`,
      (n) => `Segunda semana, ${n}. Tu cuerpo ya empezó a adaptarse aunque el espejo aún no lo cuente. Confía en el proceso.`,
      (n) => `Tres semanas seguidas, ${n}. Esto ya no es un intento: es un hábito en construcción. 🔥`,
      (n) => `Un mes completo. Tu corazón, tus músculos y tu energía ya no son los del día 1. Sigamos.`,
      (n) => `${n}, esta semana sube ligeramente la carga. Estás listo/a: lo construimos juntos paso a paso.`,
      (n) => `Mitad del camino. Mira atrás un momento: ¿recuerdas la semana 1? Eso es progreso real, ${n}.`,
    ],
    doneMsgs: [
      (n) => `¡Sesión completada, ${n}! Cada repetición suma. 💚`,
      (n) => `Hecho. Hoy ganaste la batalla más difícil: empezar.`,
      (n) => `${n}, tu yo de hace un mes estaría orgulloso de esta sesión.`,
      (n) => `¡Otra más! La constancia le gana al talento cuando el talento no es constante.`,
    ],
    sourcesList: [
      "ACSM's Guidelines for Exercise Testing and Prescription, 11ª ed. (2021) — prescripción y tamizaje pre-participación.",
      "OMS (2020). Directrices sobre actividad física y hábitos sedentarios — mínimo 150–300 min/semana.",
      "Mifflin MD, St Jeor ST et al. (1990, referencia clásica validada) — ecuación de gasto energético en reposo.",
      "Jäger R et al. ISSN Position Stand: Protein and Exercise (2017, posición vigente) — 1.4–2.2 g/kg/día según objetivo.",
      "Schoenfeld BJ et al. (2021–2023) — volumen, frecuencia y progresión para hipertrofia.",
      "Casado A et al. (2022) — distribución de intensidad en corredores: ~80% volumen a baja intensidad.",
      "Damas F et al. (2019–2021) — readaptación tras desentrenamiento (memoria muscular).",
      "World Athletics / IAAF — principios de periodización y progresión ≤10% semanal en volumen de carrera.",
    ],
    adminNote: "Versión completa: acceso con cuenta (correo, Google o Apple), panel de administración para aprobar/suspender usuarios y sincronización móvil-web.",
    confirmRace: "Tu carrera meta",
    altitude: "⛰️ Bogotá está a 2.600 m: tus ritmos aquí serán ~10-15 s/km más lentos que a nivel del mar. Es normal y está contemplado en tu plan.",
    weekSummary: "Resumen", kmWeek: "km esta semana",
    nutriNote: "Las porciones usan medidas caseras. Este plan es una guía de orientación; para condiciones clínicas consulta un nutricionista-dietista.",
    optSupp: "Suplementos: no hacen parte del plan base. Si te interesan (ej. creatina, proteína en polvo), consúltalo con un nutricionista.",
  },
  en: {
    brand: "ML Sportfitness", tagline: "Your exercise and nutrition prescription, built the way a professional would.",
    start: "Start my assessment", lang: "ES",
    disclaimer: "ML Sportfitness is a guidance and coaching tool. It does not replace professional medical, nutritional, physiotherapy or sports consultation.",
    welcomeNote: "Created by a Colombian physiotherapist and runner. Every recommendation is grounded in ACSM and WHO guidelines and current scientific evidence.",
    next: "Continue", back: "Back", finish: "Generate my plan",
    stepOf: (a, b) => `Step ${a} of ${b}`,
    s1: "Tell us about you", s2: "Health first", s3: "Your measurements", s4: "Your goal", s5: "Your gym history", s6: "Your running history", s7: "Your eating habits", s8: "Your time",
    name: "What's your name?", nameWhy: "We want to call you by your name, like your coach would.",
    age: "Age (years)", ageWhy: "Age adjusts your energy expenditure and safe load progression (Mifflin-St Jeor equation, ACSM guidelines).",
    sex: "Biological sex", sexWhy: "Men and women have metabolic and body-composition differences that change the calorie calculation.",
    sexF: "Female", sexM: "Male",
    height: "Height (cm)", heightWhy: "Measure barefoot, back against a wall, heels together, looking straight ahead. Mark above your head and measure from the floor.",
    weight: "Weight (kg)", weightWhy: "Weigh yourself fasted, after using the bathroom, in light clothes and always on the same scale, so it's comparable week to week.",
    city: "City", cityWhy: "Altitude matters: training in Bogotá (2,600 m) is not the same as in Cartagena. We adjust pace expectations.",
    healthIntro: "Before prescribing exercise, every professional screens first. Check what applies. Being honest here protects you.",
    healthNone: "None of the above",
    conds: ["Active cardiovascular disease or chest pain", "Uncontrolled diabetes", "Cancer under treatment", "High-risk pregnancy", "Uncontrolled hypertension", "Dizziness or fainting during effort", "Other condition requiring medical supervision"],
    injuries: "Current injuries or discomfort?", injuriesWhy: "We'll adapt exercises to protect the area. E.g., if you report a knee issue, we avoid high impact and prioritize pain-free strengthening.",
    injKnee: "Knee", injShoulder: "Shoulder", injBack: "Lower back", injAnkle: "Ankle", injNone: "None",
    blockedTitle: "Your health deserves specialized attention",
    blockedBody: (n) => `${n}, thank you for your honesty. What you shared indicates you need your physician's assessment before starting an exercise or nutrition plan. ML Sportfitness is designed for apparently healthy people, and prescribing without that assessment would be irresponsible. When your doctor gives the green light, we'll be here. This isn't rejection — it's truly caring for you.`,
    blockedBtn: "Understood, I'll see my doctor",
    waist: "Waist circumference (cm)", hip: "Hip circumference (cm)",
    measureGuide: "How to take your measurements at home",
    waistHow: "Waist: standing relaxed, find the midpoint between your last rib and the top of your hip bone (iliac crest). Wrap the tape horizontally, without squeezing, and measure at the end of a normal exhale.",
    hipHow: "Hip: standing with feet together, wrap the tape around the widest part of your glutes, keeping it horizontal. Don't compress the skin.",
    measureWhy: "These girths (ISAK/WHO protocol) let us compute your waist-to-hip and waist-to-height ratios — better metabolic risk indicators than weight alone.",
    goal: "What's your main goal?",
    goalFat: "Lose fat", goalMuscle: "Build muscle", goalHealth: "Health & endurance",
    goalWhy: "Your goal defines everything: calories, macros, training type and progression. Pick what moves you most today; you can adjust later.",
    modules: "Which modules do you want?", modGym: "Gym", modRun: "Running", modNutri: "Nutrition",
    gymBefore: "Have you trained in a gym before?", yes: "Yes", no: "No",
    gymStop: "How long since you stopped training?", gymStopWhy: "After 3+ months off, the body loses adaptations. Returning at your old loads is the #1 cause of comeback injuries. Your plan will start as 'progressive return'.",
    stopOpts: ["Still training", "Less than 3 months", "3 to 12 months", "More than 1 year"],
    level: "How would you describe your level?", levelWhy: "Be honest: the right-level plan delivers results faster than a poorly executed 'advanced' one.",
    lvlBeg: "Beginner", lvlInt: "Intermediate", lvlAdv: "Advanced",
    runBefore: "Do you currently run or have you run before?",
    runNow: "I currently run", runPast: "I ran before, stopped", runNever: "I've never run",
    runStop: "How long since you stopped running?",
    pace: "Current approximate pace (min/km)", paceWhy: "The time it takes to run 1 km at an effort where you can still talk. Check your watch/app average, or run an easy km and time it. We derive your training zones from this.",
    runFreq: "How many times per week do you run?",
    racesBefore: "Have you raced before? Which distances?",
    raceGoal: "Are you preparing for a specific race?",
    raceNone: "No, I run for health",
    raceCalNote: "Reference calendar of races in Colombia 2026. Always confirm date and registration with the organizer.",
    weeksAway: (w) => `${w} weeks away`,
    raceTooSoon: (race, w, min) => `⚠️ To arrive well prepared at ${race} you'd need at least ${min} weeks at your current level, and only ${w} remain. Forcing it would raise your injury risk. Check these achievable alternatives:`,
    raceOk: (race, w) => `Great goal! ${w} weeks until ${race}: enough time for safe periodization. Your plan will be built toward that date.`,
    pickAlt: "Choose this race",
    mealsDay: "How many meals do you eat per day?",
    allergies: "Allergies & intolerances", allergiesWhy: "We will never include these foods in your plan. Your safety is non-negotiable.",
    alLactose: "Lactose", alGluten: "Gluten", alNuts: "Tree nuts", alSeafood: "Seafood", alEgg: "Egg", alNone: "None",
    dislikes: "Foods you dislike (comma separated)", dislikesWhy: "A plan you don't enjoy is a plan you abandon. We'll swap them for nutritional equivalents.",
    budget: "Food budget", budgetWhy: "Eating well shouldn't be a luxury. We adapt the plan to accessible foods in Colombia based on your budget.",
    bLow: "Tight", bMid: "Medium", bHigh: "Flexible",
    daysWeek: "How many days per week can you train?", daysWhy: "A realistic plan you follow beats a perfect one you quit. WHO recommends at least 150 min/week of moderate activity.",
    minsSession: "Minutes per session?",
    genTitle: "Building your plan…",
    dashHello: (n) => `Hi, ${n} 👋`,
    tabToday: "Today", tabNutri: "Nutrition", tabGym: "Gym", tabRun: "Running", tabProfile: "Profile",
    week: "Week", currentWeek: "Current week", preview: "Preview",
    weekGoals: "This week's goals", motivation: "Your message of the week",
    kcalTarget: "Daily calorie target", protein: "Protein", carbs: "Carbs", fat: "Fat",
    mealPlan: "Your eating day", swap: "Swap", swapped: "Done — replaced with an equivalent alternative 🍃",
    reportFood: "Report an adjustment", addAllergy: "Add allergy/intolerance",
    technique: "Technique", video: "Watch technique video", sets: "Sets", reps: "Reps", rest: "Rest",
    markDone: "Complete session", done: "Completed!",
    sessionType: "Session type", distance: "Distance", targetPace: "Target pace",
    reportInjury: "Report physical discomfort", injuryAdjusted: "Plan adjusted: we swapped the exercises loading that area 💪",
    sources: "Scientific sources", sourcesBtn: "View sources",
    profileTitle: "Your assessment", bmi: "BMI", whr: "Waist-to-hip ratio", whtr: "Waist-to-height ratio",
    bmr: "Basal metabolic rate", tdee: "Total energy expenditure",
    editNote: "In the full version you'll update measurements every 4 weeks and the plan will recalculate.",
    restDay: "Active rest", phase: "Phase",
    phases: { adapt: "Anatomical adaptation", build: "Build", intensify: "Intensification", peak: "Peak & sharpening", base: "Aerobic base", taper: "Tapering" },
    runTypes: {
      easy: { n: "Easy run", d: "Comfortable run where you can hold a conversation. Builds your aerobic base and teaches the body to use fat as fuel. It should feel genuinely easy." },
      walkrun: { n: "Walk-run", d: "Alternate easy jog and walk intervals. The safest way for tendons and joints to adapt to impact. Walking isn't cheating — it's strategy!" },
      intervals: { n: "Intervals", d: "Short hard repetitions with recovery between each. They improve speed and running economy. The rest between reps is part of the workout." },
      fartlek: { n: "Fartlek", d: "'Speed play': within an easy run, surge for free stretches (e.g., to the next lamppost) and recover jogging. Builds pace without track rigidity." },
      long: { n: "Long run", d: "The most important session of the week: longer distance at a relaxed pace. Builds physical and mental endurance. Hydrate and forget about speed." },
      tempo: { n: "Tempo", d: "A sustained 'comfortably hard' pace: you can say short phrases but not chat. Raises your threshold — the pace you can hold in a race." },
      rest: { n: "Rest", d: "Progress happens while you rest: the body absorbs training. Walk, stretch, or simply rest guilt-free." },
    },
    motiv: [
      (n) => `${n}, starting already puts you ahead of everyone still thinking about it. This week your only mission: show up.`,
      (n) => `Week two, ${n}. Your body has already started adapting even if the mirror doesn't show it yet. Trust the process.`,
      (n) => `Three weeks in a row, ${n}. This is no longer an attempt — it's a habit under construction. 🔥`,
      (n) => `A full month. Your heart, muscles and energy are no longer those of day 1. Let's keep going.`,
      (n) => `${n}, this week the load nudges up. You're ready — we built this together, step by step.`,
      (n) => `Halfway there. Look back for a second: remember week 1? That's real progress, ${n}.`,
    ],
    doneMsgs: [
      (n) => `Session complete, ${n}! Every rep counts. 💚`,
      (n) => `Done. Today you won the hardest battle: starting.`,
      (n) => `${n}, the you of a month ago would be proud of this session.`,
      (n) => `Another one! Consistency beats talent when talent isn't consistent.`,
    ],
    sourcesList: [
      "ACSM's Guidelines for Exercise Testing and Prescription, 11th ed. (2021) — prescription & pre-participation screening.",
      "WHO (2020). Guidelines on physical activity and sedentary behaviour — minimum 150–300 min/week.",
      "Mifflin MD, St Jeor ST et al. (1990, validated classic) — resting energy expenditure equation.",
      "Jäger R et al. ISSN Position Stand: Protein and Exercise (2017, current position) — 1.4–2.2 g/kg/day by goal.",
      "Schoenfeld BJ et al. (2021–2023) — volume, frequency and progression for hypertrophy.",
      "Casado A et al. (2022) — intensity distribution in runners: ~80% of volume at low intensity.",
      "Damas F et al. (2019–2021) — retraining after detraining (muscle memory).",
      "World Athletics / IAAF — periodization principles and ≤10% weekly running-volume progression.",
    ],
    adminNote: "Full version: account access (email, Google or Apple), admin panel to approve/suspend users, and mobile-web sync.",
    confirmRace: "Your goal race",
    altitude: "⛰️ Bogotá sits at 2,600 m: your paces here will be ~10-15 s/km slower than at sea level. That's normal and built into your plan.",
    weekSummary: "Summary", kmWeek: "km this week",
    nutriNote: "Portions use household measures. This plan is guidance; for clinical conditions see a registered dietitian.",
    optSupp: "Supplements: not part of the base plan. If interested (e.g., creatine, protein powder), discuss with a dietitian.",
  },
};

/* ---------- Data: Colombian race calendar 2026 (reference) ---------- */
const RACES = [
  { id: "sincelejo", name: "Media Maratón de Sincelejo", date: "2026-06-28", city: "Sincelejo", dists: [21, 10], org: "Org. local" },
  { id: "mmcali", name: "Media Maratón de Cali", date: "2026-06-28", city: "Cali", dists: [21, 10, 5], org: "Juanchito a Cali" },
  { id: "mmb", name: "Media Maratón de Bogotá (mmB)", date: "2026-07-26", city: "Bogotá", dists: [21, 10], org: "Correcaminos de Colombia" },
  { id: "cmt-baq", name: "Corre Mi Tierra", date: "2026-08-02", city: "Barranquilla", dists: [21, 15, 10, 5], org: "Corre Mi Tierra" },
  { id: "bodytech", name: "Expedición Bodytech", date: "2026-08-23", city: "Cali", dists: [10, 5], org: "Bodytech" },
  { id: "medellin", name: "Maratón de Medellín", date: "2026-09-06", city: "Medellín", dists: [42, 21, 10, 5], org: "Maratón Medellín" },
  { id: "mujer", name: "Carrera de la Mujer", date: "2026-09-06", city: "Bogotá", dists: [10, 8, 4], org: "Estrategia Atlética" },
  { id: "salento", name: "Media Maratón Entre Montañas", date: "2026-09-13", city: "Salento", dists: [21, 10, 5], org: "Org. local" },
  { id: "bimbo", name: "Bimbo Global Race", date: "2026-09-27", city: "Bogotá", dists: [10, 5], org: "Bimbo" },
  { id: "cafe", name: "Media Maratón del Café", date: "2026-10-04", city: "Caldas", dists: [21, 10], org: "Org. local" },
  { id: "buc", name: "Media Maratón de Bucaramanga FCV", date: "2026-10-11", city: "Bucaramanga", dists: [21, 10, 5], org: "FCV" },
  { id: "allianz", name: "Allianz 15K Bogotá", date: "2026-10-18", city: "Bogotá", dists: [15], org: "Correcaminos de Colombia" },
  { id: "tunja", name: "Media Maratón de Tunja", date: "2026-11-01", city: "Tunja", dists: [21, 10], org: "Org. local" },
  { id: "cucuta", name: "Media Maratón de Cúcuta", date: "2026-11-15", city: "Cúcuta", dists: [21, 10], org: "Org. local" },
  { id: "sansilv", name: "San Silvestre", date: "2026-12-31", city: "Cali", dists: [10, 5], org: "Org. local" },
];

/* ---------- Data: exercise library ---------- */
const EX = {
  goblet: { es: "Sentadilla goblet", en: "Goblet squat", m: "Piernas/Legs", cue: { es: "Pecho arriba, rodillas alineadas con los pies, baja controlado hasta ~90° sin que los talones se despeguen.", en: "Chest up, knees tracking over toes, lower under control to ~90° keeping heels down." }, q: "goblet squat tecnica", knee: 1 },
  press_pierna: { es: "Prensa de piernas", en: "Leg press", m: "Piernas/Legs", cue: { es: "Pies al ancho de hombros, baja hasta 90° sin despegar la zona lumbar del respaldo.", en: "Feet shoulder-width, lower to 90° keeping lower back on the pad." }, q: "leg press tecnica" },
  rdl: { es: "Peso muerto rumano con mancuernas", en: "Dumbbell Romanian deadlift", m: "Posterior/Hamstrings", cue: { es: "Espalda neutra, empuja la cadera atrás, baja hasta sentir el estiramiento en isquios.", en: "Neutral spine, push hips back, lower until you feel the hamstring stretch." }, q: "peso muerto rumano mancuernas tecnica", back: 1 },
  zancada: { es: "Zancadas", en: "Lunges", m: "Piernas/Legs", cue: { es: "Paso amplio, tronco vertical, la rodilla de atrás baja cerca del piso sin golpearlo.", en: "Long step, upright torso, back knee lowers close to the floor without hitting it." }, q: "zancadas tecnica correcta", knee: 1 },
  ext_quad: { es: "Extensión de cuádriceps", en: "Leg extension", m: "Cuádriceps/Quads", cue: { es: "Extiende controlado, pausa 1 s arriba, baja lento. Sin impulso.", en: "Extend under control, 1 s pause at top, lower slowly. No momentum." }, q: "extension cuadriceps maquina tecnica", knee: 1 },
  curl_fem: { es: "Curl femoral", en: "Hamstring curl", m: "Posterior/Hamstrings", cue: { es: "Cadera pegada al banco, flexiona controlado y regresa lento.", en: "Hips on the pad, curl under control and return slowly." }, q: "curl femoral tecnica" },
  puente: { es: "Puente de glúteo", en: "Glute bridge", m: "Glúteo/Glutes", cue: { es: "Empuja con talones, aprieta glúteos arriba 2 s, sin arquear la lumbar.", en: "Drive through heels, squeeze glutes 2 s at top, don't arch the lower back." }, q: "puente de gluteo tecnica" },
  hip_thrust: { es: "Hip thrust", en: "Hip thrust", m: "Glúteo/Glutes", cue: { es: "Espalda alta apoyada en banco, sube hasta alinear rodilla-cadera-hombro, mentón al pecho.", en: "Upper back on bench, rise until knee-hip-shoulder align, chin tucked." }, q: "hip thrust tecnica" },
  calf: { es: "Elevación de talones", en: "Calf raise", m: "Pantorrilla/Calves", cue: { es: "Sube alto, pausa, baja lento sintiendo el estiramiento.", en: "Rise high, pause, lower slowly feeling the stretch." }, q: "elevacion talones tecnica" },
  press_banca_db: { es: "Press banca con mancuernas", en: "Dumbbell bench press", m: "Pecho/Chest", cue: { es: "Escápulas juntas, codos a ~45° del torso, baja hasta la línea del pecho.", en: "Shoulder blades retracted, elbows ~45° from torso, lower to chest line." }, q: "press banca mancuernas tecnica" },
  flexiones: { es: "Flexiones (rodillas si es necesario)", en: "Push-ups (knees if needed)", m: "Pecho/Chest", cue: { es: "Cuerpo en línea, manos bajo hombros, baja el pecho controlado.", en: "Body in a line, hands under shoulders, lower chest under control." }, q: "flexiones tecnica correcta" },
  press_militar: { es: "Press militar con mancuernas", en: "Dumbbell shoulder press", m: "Hombro/Shoulders", cue: { es: "Core firme, sube sin arquear la lumbar, codos ligeramente al frente.", en: "Brace the core, press without arching the lower back, elbows slightly forward." }, q: "press militar mancuernas tecnica", shoulder: 1 },
  elev_lat: { es: "Elevaciones laterales", en: "Lateral raises", m: "Hombro/Shoulders", cue: { es: "Sube hasta la altura de hombros con codos suaves, baja lento.", en: "Raise to shoulder height with soft elbows, lower slowly." }, q: "elevaciones laterales tecnica", shoulder: 1 },
  remo_db: { es: "Remo con mancuerna", en: "One-arm dumbbell row", m: "Espalda/Back", cue: { es: "Espalda plana, lleva el codo hacia la cadera, aprieta la escápula al final.", en: "Flat back, drive elbow toward hip, squeeze the shoulder blade at the end." }, q: "remo mancuerna tecnica" },
  jalon: { es: "Jalón al pecho", en: "Lat pulldown", m: "Espalda/Back", cue: { es: "Pecho arriba, lleva la barra a la clavícula, codos hacia abajo y atrás.", en: "Chest up, bring bar to collarbone, elbows down and back." }, q: "jalon al pecho tecnica" },
  remo_maq: { es: "Remo en máquina", en: "Seated cable row", m: "Espalda/Back", cue: { es: "Tronco estable, hala hacia el abdomen, no encojas los hombros.", en: "Stable torso, pull to the abdomen, don't shrug." }, q: "remo sentado polea tecnica" },
  curl_bi: { es: "Curl de bíceps", en: "Biceps curl", m: "Brazo/Arms", cue: { es: "Codos pegados al torso, sube sin balancear el cuerpo.", en: "Elbows pinned to torso, curl without swinging." }, q: "curl biceps tecnica" },
  ext_tri: { es: "Extensión de tríceps en polea", en: "Triceps pushdown", m: "Brazo/Arms", cue: { es: "Codos fijos, extiende completo y controla la subida.", en: "Elbows fixed, extend fully and control the return." }, q: "extension triceps polea tecnica" },
  plancha: { es: "Plancha", en: "Plank", m: "Core", cue: { es: "Línea recta cabeza-talones, abdomen y glúteos activos, respira.", en: "Straight line head to heels, brace abs and glutes, keep breathing." }, q: "plancha abdominal tecnica" },
  dead_bug: { es: "Dead bug", en: "Dead bug", m: "Core", cue: { es: "Lumbar pegada al piso, extiende brazo y pierna contrarios lento.", en: "Lower back glued to floor, extend opposite arm and leg slowly." }, q: "dead bug ejercicio tecnica" },
  bird_dog: { es: "Pájaro-perro", en: "Bird dog", m: "Core", cue: { es: "En cuadrupedia, extiende brazo y pierna contrarios sin rotar la cadera.", en: "On all fours, extend opposite arm and leg without rotating the hips." }, q: "bird dog ejercicio tecnica" },
};
const exVideo = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
/* Injury-safe substitutions */
const SUBS = { knee: ["puente", "curl_fem", "hip_thrust"], shoulder: ["remo_maq", "jalon", "flexiones"], back: ["puente", "hip_thrust", "curl_fem"] };

/* ---------- Data: foods (Colombia, by budget) ---------- */
const FOODS = {
  proteinB: [
    { es: "Huevos (2-3 unidades)", en: "Eggs (2-3)", tag: "egg" },
    { es: "Pechuga de pollo (120-150 g)", en: "Chicken breast (120-150 g)" },
    { es: "Lentejas o fríjoles (1 taza cocida)", en: "Lentils or beans (1 cup cooked)" },
    { es: "Atún en agua (1 lata)", en: "Canned tuna in water", tag: "seafood" },
    { es: "Queso campesino (60 g)", en: "Fresh farmer cheese (60 g)", tag: "lactose" },
  ],
  proteinM: [
    { es: "Carne magra de res (120-150 g)", en: "Lean beef (120-150 g)" },
    { es: "Tilapia o mojarra (150 g)", en: "Tilapia (150 g)", tag: "seafood" },
    { es: "Yogur griego natural (1 vaso)", en: "Plain Greek yogurt (1 cup)", tag: "lactose" },
    { es: "Pechuga de pollo (150 g)", en: "Chicken breast (150 g)" },
  ],
  proteinH: [
    { es: "Salmón (140 g)", en: "Salmon (140 g)", tag: "seafood" },
    { es: "Lomo de res (150 g)", en: "Beef tenderloin (150 g)" },
    { es: "Camarones (150 g)", en: "Shrimp (150 g)", tag: "seafood" },
  ],
  carbB: [
    { es: "Arroz (1 taza cocida)", en: "Rice (1 cup cooked)" },
    { es: "Arepa de maíz (1 unidad mediana)", en: "Corn arepa (1 medium)" },
    { es: "Papa o yuca cocida (1.5 tazas)", en: "Boiled potato or cassava (1.5 cups)" },
    { es: "Plátano maduro o verde (1/2 unidad)", en: "Plantain (1/2 unit)" },
    { es: "Avena (1/2 taza en seco)", en: "Oats (1/2 cup dry)", tag: "gluten" },
    { es: "Pan integral (2 tajadas)", en: "Whole-grain bread (2 slices)", tag: "gluten" },
  ],
  carbH: [
    { es: "Quinua (1 taza cocida)", en: "Quinoa (1 cup cooked)" },
    { es: "Pasta integral (1 taza cocida)", en: "Whole-grain pasta (1 cup)", tag: "gluten" },
    { es: "Batata (1 unidad mediana)", en: "Sweet potato (1 medium)" },
  ],
  fatB: [
    { es: "Aguacate (1/4 - 1/2 unidad)", en: "Avocado (1/4 - 1/2)" },
    { es: "Maní sin sal (1 puñado)", en: "Unsalted peanuts (1 handful)", tag: "nuts" },
    { es: "Aceite de oliva o canola (1 cda)", en: "Olive or canola oil (1 tbsp)" },
  ],
  fatH: [
    { es: "Almendras o nueces (1 puñado)", en: "Almonds or walnuts (1 handful)", tag: "nuts" },
    { es: "Semillas de chía o linaza (1 cda)", en: "Chia or flax seeds (1 tbsp)" },
  ],
  veg: [
    { es: "Ensalada de tomate, lechuga y zanahoria", en: "Tomato, lettuce & carrot salad" },
    { es: "Verduras salteadas (brócoli, habichuela)", en: "Sautéed veggies (broccoli, green beans)" },
    { es: "Crema de verduras casera", en: "Homemade vegetable soup" },
  ],
  fruit: [
    { es: "Banano", en: "Banana" }, { es: "Papaya (1 taza)", en: "Papaya (1 cup)" },
    { es: "Mango (1 taza)", en: "Mango (1 cup)" }, { es: "Mandarinas (2)", en: "Tangerines (2)" },
    { es: "Guayaba (2 unidades)", en: "Guava (2)" },
  ],
  dairy: [
    { es: "Yogur natural (1 vaso)", en: "Plain yogurt (1 cup)", tag: "lactose" },
    { es: "Bebida vegetal fortificada (1 vaso)", en: "Fortified plant milk (1 cup)" },
    { es: "Kumis (1 vaso)", en: "Kumis (1 cup)", tag: "lactose" },
  ],
};

/* ---------- Calculations ---------- */
const bmrMifflin = ({ sex, weight, height, age }) =>
  sex === "F" ? 10 * weight + 6.25 * height - 5 * age - 161 : 10 * weight + 6.25 * height - 5 * age + 5;
const activityFactor = (days) => (days <= 1 ? 1.3 : days <= 3 ? 1.45 : days <= 5 ? 1.55 : 1.7);
const paceToSec = (p) => { const [m, s] = String(p).split(":").map(Number); return (m || 7) * 60 + (s || 0); };
const secToPace = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
const weeksBetween = (d) => Math.floor((new Date(d) - new Date()) / (7 * 24 * 3600 * 1000));

const MIN_WEEKS = { 4: { beg: 6, int: 4, adv: 3 }, 5: { beg: 8, int: 6, adv: 4 }, 8: { beg: 9, int: 7, adv: 5 }, 10: { beg: 10, int: 8, adv: 6 }, 15: { beg: 12, int: 9, adv: 7 }, 21: { beg: 16, int: 12, adv: 10 }, 42: { beg: 28, int: 18, adv: 14 } };

function runnerLevel(p) {
  if (p.runStatus === "never") return "beg";
  if (p.runStatus === "past" && p.runStopIdx >= 2) return "beg";
  const freq = Number(p.runFreq) || 0;
  if (freq >= 4 && p.racesBefore) return "adv";
  if (freq >= 2) return "int";
  return "beg";
}
function gymLevel(p) {
  if (!p.gymBefore) return "beg";
  if (p.gymStopIdx === 3) return "beg"; // >1 año → retorno tratado como principiante
  if (p.gymStopIdx === 2) return p.level === "adv" ? "int" : "beg"; // 3-12 meses: bajar un nivel
  return p.level || "beg";
}

/* ---------- Plan builders ---------- */
function buildNutrition(p, extraAllergies, swapState) {
  const bmr = bmrMifflin(p);
  const tdee = bmr * activityFactor(Number(p.daysWeek) || 3);
  let kcal = p.goal === "fat" ? tdee * 0.85 : p.goal === "muscle" ? tdee * 1.1 : tdee;
  const floor = p.sex === "F" ? 1400 : 1600;
  kcal = Math.max(Math.round(kcal / 10) * 10, floor);
  const protG = Math.round((p.goal === "fat" ? 2.0 : p.goal === "muscle" ? 1.8 : 1.6) * p.weight);
  const fatG = Math.round(Math.max(0.9 * p.weight, (kcal * 0.25) / 9));
  const carbG = Math.round((kcal - protG * 4 - fatG * 9) / 4);
  const allergies = new Set([...(p.allergies || []), ...extraAllergies]);
  const dislikes = (p.dislikes || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  const ok = (f) => !allergies.has(f.tag) && !dislikes.some((d) => d && (f.es.toLowerCase().includes(d) || f.en.toLowerCase().includes(d)));
  const pool = (arr) => arr.filter(ok);
  const protPool = pool(p.budget === "high" ? [...FOODS.proteinM, ...FOODS.proteinH, ...FOODS.proteinB] : p.budget === "mid" ? [...FOODS.proteinB, ...FOODS.proteinM] : FOODS.proteinB);
  const carbPool = pool(p.budget === "high" ? [...FOODS.carbB, ...FOODS.carbH] : FOODS.carbB);
  const fatPool = pool(p.budget === "high" ? [...FOODS.fatB, ...FOODS.fatH] : FOODS.fatB);
  const dairyPool = pool(FOODS.dairy);
  const pick = (poolArr, mealKey, slot) => {
    if (!poolArr.length) return null;
    const offset = swapState[`${mealKey}-${slot}`] || 0;
    return { food: poolArr[offset % poolArr.length], pool: poolArr.length };
  };
  const meals = Number(p.mealsDay) || 3;
  const shares = meals === 3 ? [0.3, 0.4, 0.3] : meals === 4 ? [0.25, 0.35, 0.15, 0.25] : [0.22, 0.3, 0.12, 0.12, 0.24];
  const labels = { es: ["Desayuno", "Almuerzo", "Cena", "Snack AM", "Snack PM"], en: ["Breakfast", "Lunch", "Dinner", "AM Snack", "PM Snack"] };
  const order = meals === 3 ? [0, 1, 2] : meals === 4 ? [0, 3, 1, 2] : [0, 3, 1, 4, 2];
  const mealList = order.map((li, i) => {
    const key = `m${i}`;
    const isSnack = li >= 3;
    const items = isSnack
      ? [pick(pool(FOODS.fruit), key, "f"), pick(i % 2 ? dairyPool : fatPool, key, "x")]
      : [pick(protPool, key, "p"), pick(carbPool, key, "c"), pick(pool(FOODS.veg), key, "v"), pick(li === 0 ? pool(FOODS.fruit) : fatPool, key, "g")];
    return { key, labelIdx: li, kcal: Math.round((kcal * shares[i]) / 10) * 10, items: items.filter(Boolean), slots: isSnack ? ["f", "x"] : ["p", "c", "v", "g"] };
  });
  return { kcal, protG, fatG, carbG, bmr: Math.round(bmr), tdee: Math.round(tdee), meals: mealList, labels };
}

function buildGym(p, injuries) {
  const lvl = gymLevel(p);
  const inj = new Set(injuries);
  const sub = (id) => {
    const e = EX[id];
    if ((inj.has("knee") && e.knee) ) return SUBS.knee.find((s) => !EX[s].knee) || "puente";
    if ((inj.has("shoulder") && e.shoulder)) return SUBS.shoulder[0];
    if ((inj.has("back") && e.back)) return SUBS.back[0];
    return id;
  };
  const D = (nameEs, nameEn, ids) => ({ es: nameEs, en: nameEn, ex: ids.map(sub) });
  let days;
  if (lvl === "beg") days = [
    D("Cuerpo completo A", "Full body A", ["goblet", "press_banca_db", "remo_db", "puente", "plancha"]),
    D("Cuerpo completo B", "Full body B", ["press_pierna", "jalon", "press_militar", "curl_fem", "dead_bug"]),
    D("Cuerpo completo C", "Full body C", ["rdl", "flexiones", "remo_maq", "calf", "bird_dog"]),
  ];
  else if (lvl === "int") days = [
    D("Tren superior 1", "Upper 1", ["press_banca_db", "remo_db", "press_militar", "jalon", "curl_bi", "ext_tri"]),
    D("Tren inferior 1", "Lower 1", ["goblet", "rdl", "press_pierna", "calf", "plancha"]),
    D("Tren superior 2", "Upper 2", ["flexiones", "remo_maq", "elev_lat", "jalon", "ext_tri"]),
    D("Tren inferior 2", "Lower 2", ["hip_thrust", "zancada", "curl_fem", "ext_quad", "dead_bug"]),
  ];
  else days = [
    D("Empuje", "Push", ["press_banca_db", "press_militar", "elev_lat", "ext_tri", "flexiones"]),
    D("Halón", "Pull", ["jalon", "remo_db", "remo_maq", "curl_bi", "bird_dog"]),
    D("Pierna 1", "Legs 1", ["goblet", "rdl", "press_pierna", "calf", "plancha"]),
    D("Pierna 2 + Core", "Legs 2 + Core", ["hip_thrust", "zancada", "curl_fem", "ext_quad", "dead_bug"]),
  ];
  const maxDays = Math.min(days.length, Math.max(2, Number(p.daysWeek) || 3));
  days = days.slice(0, maxDays);
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const w = i + 1;
    const phase = w <= 4 ? "adapt" : w <= 8 ? "build" : "intensify";
    const sets = phase === "adapt" ? (lvl === "beg" ? 2 : 3) : phase === "build" ? 3 : lvl === "beg" ? 3 : 4;
    const reps = p.goal === "muscle" ? (phase === "intensify" ? "8-10" : "10-12") : p.goal === "fat" ? "12-15" : "10-15";
    const rest = phase === "intensify" ? "75-90 s" : "60 s";
    const rpe = phase === "adapt" ? "RPE 5-6" : phase === "build" ? "RPE 6-7" : "RPE 7-8";
    return { w, phase, sets, reps, rest, rpe };
  });
  return { lvl, days, weeks, returning: p.gymBefore && p.gymStopIdx >= 1 };
}

function buildRun(p, t) {
  const lvl = runnerLevel(p);
  const baseSec = p.pace ? paceToSec(p.pace) : lvl === "beg" ? 480 : 420;
  const z = {
    easy: secToPace(baseSec + (lvl === "beg" ? 75 : 60)),
    long: secToPace(baseSec + 80),
    tempo: secToPace(Math.max(baseSec - 15, 200)),
    intervals: secToPace(Math.max(baseSec - 40, 180)),
  };
  let totalWeeks = 10, race = null, raceWarn = null, alts = [];
  if (p.raceId && p.raceId !== "none") {
    race = RACES.find((r) => r.id === p.raceId);
    const w = weeksBetween(race.date);
    const dist = p.raceDist || Math.min(...race.dists);
    const min = (MIN_WEEKS[dist] || MIN_WEEKS[10])[lvl];
    if (w < min) {
      raceWarn = t.raceTooSoon(`${race.name} (${dist}K)`, w, min);
      alts = RACES.filter((r) => {
        const wr = weeksBetween(r.date);
        return r.id !== race.id && r.dists.some((d) => d <= dist && wr >= (MIN_WEEKS[d] || MIN_WEEKS[10])[lvl]);
      }).slice(0, 3);
      totalWeeks = Math.min(Math.max(w, 6), 16);
    } else {
      totalWeeks = Math.min(w, 20);
    }
  } else {
    totalWeeks = 10;
  }
  const startKm = lvl === "beg" ? 10 : lvl === "int" ? 20 : 34;
  const freq = lvl === "beg" ? 3 : lvl === "int" ? Math.min(4, Math.max(3, Number(p.runFreq) || 3)) : Math.min(5, Math.max(4, Number(p.runFreq) || 4));
  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const w = i + 1;
    let km = startKm * Math.pow(1.08, i);
    const isCutback = w % 4 === 0 && w < totalWeeks - 2;
    if (isCutback) km *= 0.75;
    const taper = race && !raceWarn && w > totalWeeks - 2;
    if (taper) km *= w === totalWeeks ? 0.5 : 0.7;
    km = Math.round(km);
    const phase = taper ? "taper" : w <= Math.ceil(totalWeeks * 0.4) ? "base" : w <= Math.ceil(totalWeeks * 0.75) ? "build" : "intensify";
    const sessions = [];
    const dayNames = { es: ["Martes", "Jueves", "Sábado", "Domingo", "Viernes"], en: ["Tuesday", "Thursday", "Saturday", "Sunday", "Friday"] };
    if (lvl === "beg" && w <= 4 && p.runStatus === "never") {
      sessions.push({ day: 0, type: "walkrun", det: { es: `${20 + w * 5} min: trota 1 min / camina 2 min`, en: `${20 + w * 5} min: jog 1 min / walk 2 min` }, pace: "—" });
      sessions.push({ day: 1, type: "walkrun", det: { es: `${20 + w * 5} min: trota 2 min / camina 2 min`, en: `${20 + w * 5} min: jog 2 min / walk 2 min` }, pace: "—" });
      sessions.push({ day: 2, type: "walkrun", det: { es: `${25 + w * 5} min continuos suaves o caminar-trotar`, en: `${25 + w * 5} min easy continuous or walk-run` }, pace: z.easy });
    } else {
      const longKm = Math.round(km * 0.4);
      const easyKm = Math.max(3, Math.round((km - longKm) / (freq - 1)));
      sessions.push({ day: 0, type: "easy", det: { es: `${easyKm} km continuos`, en: `${easyKm} km continuous` }, pace: z.easy });
      if (freq >= 3) {
        const quality = phase === "base" ? "fartlek" : phase === "intensify" || phase === "taper" ? "intervals" : w % 2 ? "intervals" : "tempo";
        const qDet = quality === "intervals"
          ? { es: `${4 + Math.min(4, Math.floor(w / 3))} x 400 m (rec. 90 s trote)`, en: `${4 + Math.min(4, Math.floor(w / 3))} x 400 m (90 s jog rec.)` }
          : quality === "tempo"
            ? { es: `${easyKm} km con ${Math.max(2, Math.round(easyKm * 0.5))} km a ritmo tempo`, en: `${easyKm} km incl. ${Math.max(2, Math.round(easyKm * 0.5))} km tempo` }
            : { es: `${easyKm} km con 8-10 aceleraciones de 1 min`, en: `${easyKm} km with 8-10 x 1-min surges` };
        sessions.push({ day: 1, type: quality, det: qDet, pace: quality === "fartlek" ? z.easy : z[quality] });
      }
      if (freq >= 4) sessions.push({ day: 4, type: "easy", det: { es: `${easyKm} km regenerativos`, en: `${easyKm} km recovery` }, pace: z.easy });
      sessions.push({ day: 2, type: "long", det: { es: `${longKm} km`, en: `${longKm} km` }, pace: z.long });
      if (freq >= 5) sessions.push({ day: 3, type: "easy", det: { es: `${easyKm} km muy suaves`, en: `${easyKm} km very easy` }, pace: z.easy });
    }
    return { w, km, phase, sessions, dayNames };
  });
  return { lvl, z, weeks, race, raceWarn, alts, totalWeeks };
}

/* ---------- Small components ---------- */
const Why = ({ children }) => <div className="why"><span aria-hidden>💡</span><span>{children}</span></div>;
const Field = ({ label, why, children }) => (
  <div className="field"><label>{label}</label>{children}{why && <Why>{why}</Why>}</div>
);
const Chips = ({ opts, value, onChange, multi, warn }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {opts.map((o) => {
      const on = multi ? value.includes(o.v) : value === o.v;
      return (
        <button key={o.v} type="button" className={`chip ${warn ? "chip-warn" : ""} ${on ? "on" : ""}`}
          onClick={() => multi
            ? onChange(on ? value.filter((x) => x !== o.v) : [...value.filter((x) => x !== "none" || o.v === "none"), o.v].filter((x) => (o.v === "none" ? x === "none" : x !== "none")))
            : onChange(o.v)}>
          {o.l}
        </button>
      );
    })}
  </div>
);

const MeasureFig = () => (
  <div className="measure-fig" role="img" aria-label="Guía de medición de cintura y cadera">
    <svg width="190" height="170" viewBox="0 0 190 170">
      <ellipse cx="95" cy="26" rx="16" ry="18" fill="#0F5C49" opacity=".9" />
      <path d="M70 52 Q95 44 120 52 L126 95 Q95 86 64 95 Z" fill="#0F5C49" opacity=".75" />
      <path d="M64 95 Q95 86 126 95 L122 132 Q95 124 68 132 Z" fill="#0F5C49" opacity=".55" />
      <rect x="74" y="132" width="14" height="32" rx="6" fill="#0F5C49" opacity=".45" />
      <rect x="102" y="132" width="14" height="32" rx="6" fill="#0F5C49" opacity=".45" />
      <line x1="40" y1="92" x2="150" y2="92" stroke="#FF7A45" strokeWidth="3" strokeDasharray="6 4" />
      <text x="155" y="96" fontSize="11" fontWeight="700" fill="#FF7A45">A</text>
      <line x1="44" y1="122" x2="146" y2="122" stroke="#F4B62E" strokeWidth="3" strokeDasharray="6 4" />
      <text x="152" y="126" fontSize="11" fontWeight="700" fill="#B8860B">B</text>
    </svg>
  </div>
);

/* ---------- Main App ---------- */
export default function App() {
  const [lang, setLang] = useState("es");
  const t = T[lang];
  const [screen, setScreen] = useState("welcome"); // welcome | wizard | blocked | dashboard
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [showSources, setShowSources] = useState(false);

  const [p, setP] = useState({
    name: "", age: "", sex: "F", height: "", weight: "", city: "Bogotá",
    conds: [], injuries: [],
    waist: "", hip: "",
    goal: "fat", modules: ["nutri", "gym", "run"],
    gymBefore: null, gymStopIdx: 0, level: "beg",
    runStatus: "never", runStopIdx: 0, pace: "", runFreq: "2", racesBefore: false, raceId: "none", raceDist: null,
    mealsDay: "3", allergies: [], dislikes: "", budget: "low",
    daysWeek: "3", minsSession: "60",
  });
  const up = (k, v) => setP((s) => ({ ...s, [k]: v }));

  /* dashboard state */
  const [tab, setTab] = useState("today");
  const [activeWeek, setActiveWeek] = useState(1);
  const [doneSessions, setDoneSessions] = useState({});
  const [extraAllergies, setExtraAllergies] = useState([]);
  const [swapState, setSwapState] = useState({});
  const [liveInjuries, setLiveInjuries] = useState([]);

  const allInjuries = useMemo(() => [...new Set([...(p.injuries || []), ...liveInjuries])].filter((x) => x !== "none"), [p.injuries, liveInjuries]);
  const nutri = useMemo(() => (screen === "dashboard" && p.modules.includes("nutri") ? buildNutrition(p, extraAllergies, swapState) : null), [screen, p, extraAllergies, swapState]);
  const gym = useMemo(() => (screen === "dashboard" && p.modules.includes("gym") ? buildGym(p, allInjuries) : null), [screen, p, allInjuries]);
  const run = useMemo(() => (screen === "dashboard" && p.modules.includes("run") ? buildRun(p, t) : null), [screen, p, t]);

  const ping = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  /* steps visible according to chosen modules */
  const steps = useMemo(() => {
    const s = ["s1", "s2", "s3", "s4"];
    if (p.modules.includes("gym")) s.push("s5");
    if (p.modules.includes("run")) s.push("s6");
    if (p.modules.includes("nutri")) s.push("s7");
    s.push("s8");
    return s;
  }, [p.modules]);
  const stepKey = steps[step];
  const lastStep = step === steps.length - 1;

  const tryNext = () => {
    if (stepKey === "s2" && p.conds.length > 0 && !p.conds.includes("none")) { setScreen("blocked"); return; }
    if (lastStep) { setScreen("dashboard"); setActiveWeek(1); }
    else setStep(step + 1);
  };

  const raceInfo = useMemo(() => {
    if (p.raceId === "none") return null;
    const r = RACES.find((x) => x.id === p.raceId);
    if (!r) return null;
    const w = weeksBetween(r.date);
    const dist = p.raceDist || Math.min(...r.dists);
    const min = (MIN_WEEKS[dist] || MIN_WEEKS[10])[runnerLevel(p)];
    return { r, w, dist, min, ok: w >= min };
  }, [p]);

  /* ============ RENDER ============ */
  return (
    <div className="mlsf">
      <style>{css}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--line)", background: "#fff" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="disp" style={{ fontSize: 19, color: "var(--sel)" }}>ML SPORTFITNESS</span>
            <svg width="56" height="20" viewBox="0 0 56 20" aria-hidden><path d="M0 10h12l4-7 6 14 5-10 3 3h26" fill="none" stroke="var(--papaya)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-g btn-sm" onClick={() => setShowSources(true)}>{t.sourcesBtn}</button>
            <button className="btn btn-g btn-sm" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label="Switch language">🌐 {t.lang}</button>
          </div>
        </div>
      </header>

      {/* ---------- WELCOME ---------- */}
      {screen === "welcome" && (
        <main className="wrap fade" style={{ padding: "56px 20px 80px", maxWidth: 700 }}>
          <p className="eyebrow">Colombia · Salud · Movimiento</p>
          <h1 className="disp" style={{ fontSize: "clamp(34px,6vw,58px)", lineHeight: 1.05, margin: "10px 0 16px" }}>{t.tagline}</h1>
          <PulseLine />
          <p style={{ color: "var(--ink2)", fontSize: 16, lineHeight: 1.6, margin: "16px 0 10px" }}>{t.welcomeNote}</p>
          <div className="why" style={{ marginBottom: 26 }}>⚕️ {t.disclaimer}</div>
          <button className="btn btn-a" style={{ fontSize: 17, padding: "16px 30px" }} onClick={() => { setScreen("wizard"); setStep(0); }}>{t.start} →</button>
          <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 22 }}>🔐 {t.adminNote}</p>
        </main>
      )}

      {/* ---------- BLOCKED (safety) ---------- */}
      {screen === "blocked" && (
        <main className="wrap fade" style={{ padding: "60px 20px", maxWidth: 620 }}>
          <div className="card" style={{ borderColor: "var(--danger)", background: "var(--danger-soft)" }}>
            <h2 className="disp" style={{ fontSize: 26, margin: "0 0 12px" }}>🫶 {t.blockedTitle}</h2>
            <p style={{ lineHeight: 1.65, fontSize: 15.5 }}>{t.blockedBody(p.name || "Hola")}</p>
            <button className="btn btn-p" style={{ marginTop: 14 }} onClick={() => { setScreen("welcome"); setStep(0); up("conds", []); }}>{t.blockedBtn}</button>
          </div>
        </main>
      )}

      {/* ---------- WIZARD ---------- */}
      {screen === "wizard" && (
        <main className="wrap fade" style={{ padding: "32px 20px 80px", maxWidth: 640 }} key={stepKey}>
          <p className="eyebrow">{t.stepOf(step + 1, steps.length)}</p>
          <div className="progressbar" style={{ margin: "8px 0 18px" }}><div style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          <h2 className="disp" style={{ fontSize: 30, margin: "0 0 18px" }}>{t[stepKey]}</h2>

          <div className="card">
            {stepKey === "s1" && <>
              <Field label={t.name} why={t.nameWhy}><input value={p.name} onChange={(e) => up("name", e.target.value)} placeholder="Laura, Carlos…" /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label={t.age}><input type="number" min="15" max="90" value={p.age} onChange={(e) => up("age", e.target.value)} /></Field>
                <Field label={t.sex}><select value={p.sex} onChange={(e) => up("sex", e.target.value)}><option value="F">{t.sexF}</option><option value="M">{t.sexM}</option></select></Field>
              </div>
              <Why>{t.ageWhy} · {t.sexWhy}</Why>
              <div style={{ height: 14 }} />
              <Field label={t.height} why={t.heightWhy}><input type="number" min="120" max="220" value={p.height} onChange={(e) => up("height", e.target.value)} placeholder="165" /></Field>
              <Field label={t.weight} why={t.weightWhy}><input type="number" min="35" max="200" step="0.1" value={p.weight} onChange={(e) => up("weight", e.target.value)} placeholder="68.5" /></Field>
              <Field label={t.city} why={t.cityWhy}>
                <select value={p.city} onChange={(e) => up("city", e.target.value)}>
                  {["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Otra / Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </>}

            {stepKey === "s2" && <>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink2)", marginTop: 0 }}>{t.healthIntro}</p>
              <Chips multi warn value={p.conds} onChange={(v) => up("conds", v)}
                opts={[...t.conds.map((c, i) => ({ v: `c${i}`, l: c })), { v: "none", l: t.healthNone }]} />
              <div style={{ height: 20 }} />
              <Field label={t.injuries} why={t.injuriesWhy}>
                <Chips multi value={p.injuries} onChange={(v) => up("injuries", v)}
                  opts={[{ v: "knee", l: t.injKnee }, { v: "shoulder", l: t.injShoulder }, { v: "back", l: t.injBack }, { v: "ankle", l: t.injAnkle }, { v: "none", l: t.injNone }]} />
              </Field>
            </>}

            {stepKey === "s3" && <>
              <p className="eyebrow" style={{ marginTop: 0 }}>{t.measureGuide}</p>
              <MeasureFig />
              <div style={{ fontSize: 14, lineHeight: 1.6, margin: "12px 0" }}>
                <p><b style={{ color: "var(--papaya)" }}>A.</b> {t.waistHow}</p>
                <p><b style={{ color: "#B8860B" }}>B.</b> {t.hipHow}</p>
              </div>
              <Why>{t.measureWhy}</Why>
              <div style={{ height: 14 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label={t.waist}><input type="number" min="50" max="180" value={p.waist} onChange={(e) => up("waist", e.target.value)} placeholder="78" /></Field>
                <Field label={t.hip}><input type="number" min="60" max="190" value={p.hip} onChange={(e) => up("hip", e.target.value)} placeholder="98" /></Field>
              </div>
            </>}

            {stepKey === "s4" && <>
              <Field label={t.goal} why={t.goalWhy}>
                <Chips value={p.goal} onChange={(v) => up("goal", v)}
                  opts={[{ v: "fat", l: `🔥 ${t.goalFat}` }, { v: "muscle", l: `💪 ${t.goalMuscle}` }, { v: "health", l: `❤️ ${t.goalHealth}` }]} />
              </Field>
              <Field label={t.modules}>
                <Chips multi value={p.modules} onChange={(v) => up("modules", v.length ? v : p.modules)}
                  opts={[{ v: "nutri", l: `🥗 ${t.modNutri}` }, { v: "gym", l: `🏋️ ${t.modGym}` }, { v: "run", l: `🏃 ${t.modRun}` }]} />
              </Field>
            </>}

            {stepKey === "s5" && <>
              <Field label={t.gymBefore}>
                <Chips value={p.gymBefore === null ? "" : p.gymBefore ? "y" : "n"} onChange={(v) => up("gymBefore", v === "y")}
                  opts={[{ v: "y", l: t.yes }, { v: "n", l: t.no }]} />
              </Field>
              {p.gymBefore && <Field label={t.gymStop} why={t.gymStopWhy}>
                <Chips value={String(p.gymStopIdx)} onChange={(v) => up("gymStopIdx", Number(v))}
                  opts={t.stopOpts.map((o, i) => ({ v: String(i), l: o }))} />
              </Field>}
              {p.gymBefore && <Field label={t.level} why={t.levelWhy}>
                <Chips value={p.level} onChange={(v) => up("level", v)}
                  opts={[{ v: "beg", l: t.lvlBeg }, { v: "int", l: t.lvlInt }, { v: "adv", l: t.lvlAdv }]} />
              </Field>}
            </>}

            {stepKey === "s6" && <>
              <Field label={t.runBefore}>
                <Chips value={p.runStatus} onChange={(v) => up("runStatus", v)}
                  opts={[{ v: "now", l: t.runNow }, { v: "past", l: t.runPast }, { v: "never", l: t.runNever }]} />
              </Field>
              {p.runStatus === "past" && <Field label={t.runStop}>
                <Chips value={String(p.runStopIdx)} onChange={(v) => up("runStopIdx", Number(v))}
                  opts={t.stopOpts.slice(1).map((o, i) => ({ v: String(i), l: o }))} />
              </Field>}
              {p.runStatus !== "never" && <>
                <Field label={t.pace} why={t.paceWhy}><input value={p.pace} onChange={(e) => up("pace", e.target.value)} placeholder="7:30" /></Field>
                <Field label={t.runFreq}>
                  <Chips value={p.runFreq} onChange={(v) => up("runFreq", v)} opts={["1", "2", "3", "4", "5"].map((n) => ({ v: n, l: n }))} />
                </Field>
                <Field label={t.racesBefore}>
                  <Chips value={p.racesBefore ? "y" : "n"} onChange={(v) => up("racesBefore", v === "y")} opts={[{ v: "y", l: t.yes }, { v: "n", l: t.no }]} />
                </Field>
              </>}
              <Field label={t.raceGoal} why={t.raceCalNote}>
                <select value={p.raceId} onChange={(e) => { up("raceId", e.target.value); up("raceDist", null); }}>
                  <option value="none">{t.raceNone}</option>
                  {RACES.filter((r) => weeksBetween(r.date) > 0).map((r) => (
                    <option key={r.id} value={r.id}>{r.name} — {new Date(r.date + "T12:00").toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "numeric", month: "short" })} — {r.city}</option>
                  ))}
                </select>
              </Field>
              {raceInfo && <>
                <Field label={lang === "es" ? "Distancia objetivo" : "Target distance"}>
                  <Chips value={String(raceInfo.dist)} onChange={(v) => up("raceDist", Number(v))}
                    opts={raceInfo.r.dists.map((d) => ({ v: String(d), l: `${d}K` }))} />
                </Field>
                <div className="why" style={raceInfo.ok ? { background: "var(--sel-soft)", color: "var(--sel)" } : { background: "var(--danger-soft)", color: "var(--danger)" }}>
                  {raceInfo.ok ? "✅ " + t.raceOk(raceInfo.r.name, raceInfo.w) : t.raceTooSoon(`${raceInfo.r.name} (${raceInfo.dist}K)`, raceInfo.w, raceInfo.min)}
                </div>
                {!raceInfo.ok && (
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {RACES.filter((r) => { const wr = weeksBetween(r.date); return r.id !== raceInfo.r.id && r.dists.some((d) => d <= raceInfo.dist && wr >= (MIN_WEEKS[d] || MIN_WEEKS[10])[runnerLevel(p)]); }).slice(0, 3).map((r) => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }}>
                        <span><b>{r.name}</b> · {r.city} · {new Date(r.date + "T12:00").toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "numeric", month: "short" })} · {r.dists.join("K/")}K</span>
                        <button className="btn btn-p btn-sm" onClick={() => { up("raceId", r.id); up("raceDist", null); }}>{t.pickAlt}</button>
                      </div>
                    ))}
                  </div>
                )}
              </>}
              {p.city === "Bogotá" && <div className="why" style={{ marginTop: 12 }}>{t.altitude}</div>}
            </>}

            {stepKey === "s7" && <>
              <Field label={t.mealsDay}>
                <Chips value={p.mealsDay} onChange={(v) => up("mealsDay", v)} opts={["3", "4", "5"].map((n) => ({ v: n, l: n }))} />
              </Field>
              <Field label={t.allergies} why={t.allergiesWhy}>
                <Chips multi value={p.allergies} onChange={(v) => up("allergies", v)}
                  opts={[{ v: "lactose", l: t.alLactose }, { v: "gluten", l: t.alGluten }, { v: "nuts", l: t.alNuts }, { v: "seafood", l: t.alSeafood }, { v: "egg", l: t.alEgg }]} />
              </Field>
              <Field label={t.dislikes} why={t.dislikesWhy}>
                <input value={p.dislikes} onChange={(e) => up("dislikes", e.target.value)} placeholder={lang === "es" ? "ej: atún, yuca" : "e.g.: tuna, cassava"} />
              </Field>
              <Field label={t.budget} why={t.budgetWhy}>
                <Chips value={p.budget} onChange={(v) => up("budget", v)}
                  opts={[{ v: "low", l: `$ ${t.bLow}` }, { v: "mid", l: `$$ ${t.bMid}` }, { v: "high", l: `$$$ ${t.bHigh}` }]} />
              </Field>
            </>}

            {stepKey === "s8" && <>
              <Field label={t.daysWeek} why={t.daysWhy}>
                <Chips value={p.daysWeek} onChange={(v) => up("daysWeek", v)} opts={["2", "3", "4", "5", "6"].map((n) => ({ v: n, l: n }))} />
              </Field>
              <Field label={t.minsSession}>
                <Chips value={p.minsSession} onChange={(v) => up("minsSession", v)} opts={["30", "45", "60", "90"].map((n) => ({ v: n, l: `${n} min` }))} />
              </Field>
            </>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button className="btn btn-g" onClick={() => (step === 0 ? setScreen("welcome") : setStep(step - 1))}>← {t.back}</button>
            <button className="btn btn-p" onClick={tryNext}>{lastStep ? `✨ ${t.finish}` : `${t.next} →`}</button>
          </div>
        </main>
      )}

      {/* ---------- DASHBOARD ---------- */}
      {screen === "dashboard" && (
        <main className="wrap fade" style={{ padding: "26px 20px 90px" }}>
          <h2 className="disp" style={{ fontSize: 28, margin: "0 0 4px" }}>{t.dashHello(p.name || "Runner")}</h2>
          <PulseLine color="var(--sel)" />

          {/* Week navigator */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 0 4px" }}>
            {Array.from({ length: gym ? 12 : run ? run.totalWeeks : 12 }, (_, i) => i + 1).map((w) => (
              <button key={w} className={`weekpill ${w === activeWeek ? "on" : ""} ${w < activeWeek ? "done" : ""}`} onClick={() => setActiveWeek(w)}>
                S{w}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink2)", margin: "4px 0 14px" }}>
            <span className="tag" style={{ background: "var(--papaya-soft)", color: "var(--papaya)" }}>{t.currentWeek}: 1</span>{" "}
            {activeWeek > 1 && <span className="tag" style={{ background: "var(--sun-soft)", color: "#8a6914" }}>{t.preview} · {t.week} {activeWeek}</span>}
          </p>

          {/* Weekly goals + motivation */}
          <div className="card" style={{ background: "var(--sel)", color: "#fff", border: "none", marginBottom: 18 }}>
            <p className="eyebrow" style={{ color: "var(--sun)" }}>{t.motivation}</p>
            <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, margin: "6px 0 0" }}>
              {(t.motiv[Math.min(activeWeek - 1, t.motiv.length - 1)])(p.name || "")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14, fontSize: 13.5, opacity: 0.95 }}>
              {gym && <span>🏋️ {gym.days.length} {lang === "es" ? "sesiones de fuerza" : "strength sessions"} · {t.phases[gym.weeks[Math.min(activeWeek - 1, 11)].phase]}</span>}
              {run && <span>🏃 {run.weeks[Math.min(activeWeek - 1, run.weeks.length - 1)].km} {t.kmWeek}</span>}
              {nutri && <span>🥗 {nutri.kcal} kcal/{lang === "es" ? "día" : "day"}</span>}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabbar" role="tablist" style={{ marginBottom: 18 }}>
            {[["today", t.tabToday], nutri && ["nutri", t.tabNutri], gym && ["gym", t.tabGym], run && ["run", t.tabRun], ["profile", t.tabProfile]].filter(Boolean).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>

          {/* TODAY */}
          {tab === "today" && (
            <div style={{ display: "grid", gap: 14 }}>
              {gym && (() => {
                const wk = gym.weeks[Math.min(activeWeek - 1, 11)];
                const day = gym.days[0];
                const id = `g-${activeWeek}-0`;
                return (
                  <div className="card">
                    <p className="eyebrow">🏋️ {t.tabGym} · {t.week} {activeWeek} · {day[lang]}</p>
                    <p style={{ fontSize: 14, color: "var(--ink2)", margin: "6px 0 10px" }}>{wk.sets} {t.sets.toLowerCase()} × {wk.reps} {t.reps.toLowerCase()} · {t.rest}: {wk.rest} · {wk.rpe}</p>
                    <button className={`btn btn-sm ${doneSessions[id] ? "btn-g" : "btn-a"}`} onClick={() => { if (!doneSessions[id]) { setDoneSessions((s) => ({ ...s, [id]: 1 })); ping(t.doneMsgs[Object.keys(doneSessions).length % t.doneMsgs.length](p.name || "")); } }}>
                      {doneSessions[id] ? `✅ ${t.done}` : t.markDone}
                    </button>
                  </div>
                );
              })()}
              {run && (() => {
                const wk = run.weeks[Math.min(activeWeek - 1, run.weeks.length - 1)];
                const s = wk.sessions[0];
                const id = `r-${activeWeek}-0`;
                const rt = t.runTypes[s.type];
                return (
                  <div className="card">
                    <p className="eyebrow">🏃 {t.tabRun} · {wk.dayNames[lang][s.day]} · {rt.n}</p>
                    <p style={{ fontSize: 14.5, margin: "6px 0" }}><b>{s.det[lang]}</b> · {t.targetPace}: <b>{s.pace}</b> min/km</p>
                    <p style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.55, margin: "0 0 10px" }}>{rt.d}</p>
                    <button className={`btn btn-sm ${doneSessions[id] ? "btn-g" : "btn-a"}`} onClick={() => { if (!doneSessions[id]) { setDoneSessions((s2) => ({ ...s2, [id]: 1 })); ping(t.doneMsgs[(Object.keys(doneSessions).length + 1) % t.doneMsgs.length](p.name || "")); } }}>
                      {doneSessions[id] ? `✅ ${t.done}` : t.markDone}
                    </button>
                  </div>
                );
              })()}
              {nutri && (
                <div className="card">
                  <p className="eyebrow">🥗 {t.kcalTarget}</p>
                  <p className="disp" style={{ fontSize: 34, margin: "4px 0 2px", color: "var(--sel)" }}>{nutri.kcal} kcal</p>
                  <p style={{ fontSize: 14, color: "var(--ink2)" }}>{t.protein} {nutri.protG} g · {t.carbs} {nutri.carbG} g · {t.fat} {nutri.fatG} g</p>
                </div>
              )}
            </div>
          )}

          {/* NUTRITION */}
          {tab === "nutri" && nutri && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, textAlign: "center" }}>
                {[[t.kcalTarget, `${nutri.kcal}`, "kcal"], [t.protein, nutri.protG, "g"], [t.carbs, nutri.carbG, "g"], [t.fat, nutri.fatG, "g"]].map(([l, v, u]) => (
                  <div key={l}><p className="eyebrow" style={{ fontSize: 10 }}>{l}</p><p className="disp" style={{ fontSize: 26, margin: "2px 0", color: "var(--sel)" }}>{v}<span style={{ fontSize: 13 }}> {u}</span></p></div>
                ))}
              </div>
              {nutri.meals.map((m) => (
                <div key={m.key} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 className="disp" style={{ fontSize: 19, margin: 0 }}>{nutri.labels[lang][m.labelIdx]}</h3>
                    <span className="tag" style={{ background: "var(--sel-soft)", color: "var(--sel)" }}>≈ {m.kcal} kcal</span>
                  </div>
                  <table className="tbl" style={{ marginTop: 8 }}>
                    <tbody>
                      {m.items.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.food[lang]}</td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            {it.pool > 1 && <button className="btn btn-g btn-sm" onClick={() => { setSwapState((s) => ({ ...s, [`${m.key}-${m.slots[idx]}`]: (s[`${m.key}-${m.slots[idx]}`] || 0) + 1 })); ping(t.swapped); }}>↻ {t.swap}</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <div className="card">
                <p className="eyebrow">{t.reportFood}</p>
                <p style={{ fontSize: 13.5, color: "var(--ink2)" }}>{t.allergiesWhy}</p>
                <Chips multi value={extraAllergies} onChange={setExtraAllergies}
                  opts={[{ v: "lactose", l: t.alLactose }, { v: "gluten", l: t.alGluten }, { v: "nuts", l: t.alNuts }, { v: "seafood", l: t.alSeafood }, { v: "egg", l: t.alEgg }]} />
                <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 12 }}>{t.nutriNote}<br />{t.optSupp}</p>
              </div>
            </div>
          )}

          {/* GYM */}
          {tab === "gym" && gym && (() => {
            const wk = gym.weeks[Math.min(activeWeek - 1, 11)];
            return (
              <div style={{ display: "grid", gap: 14 }}>
                <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span className="tag" style={{ background: "var(--papaya-soft)", color: "var(--papaya)" }}>{t.phase}: {t.phases[wk.phase]}</span>{" "}
                    <span className="tag" style={{ background: "var(--sel-soft)", color: "var(--sel)" }}>{gym.lvl === "beg" ? t.lvlBeg : gym.lvl === "int" ? t.lvlInt : t.lvlAdv}{gym.returning ? (lang === "es" ? " · retorno progresivo" : " · progressive return") : ""}</span>
                  </div>
                  <span style={{ fontSize: 13.5, color: "var(--ink2)" }}>{wk.rpe} · {t.rest}: {wk.rest}</span>
                </div>
                {gym.days.map((d, di) => (
                  <div key={di} className="card">
                    <h3 className="disp" style={{ fontSize: 19, margin: "0 0 10px" }}>{lang === "es" ? `Día ${di + 1}` : `Day ${di + 1}`} — {d[lang]}</h3>
                    <table className="tbl">
                      <thead><tr><th>{lang === "es" ? "Ejercicio" : "Exercise"}</th><th>{t.sets}</th><th>{t.reps}</th><th>{t.rest}</th></tr></thead>
                      <tbody>
                        {d.ex.map((id) => {
                          const e = EX[id];
                          return (
                            <tr key={id}>
                              <td>
                                <b>{e[lang]}</b> <span style={{ fontSize: 12, color: "var(--ink2)" }}>· {e.m}</span>
                                <div style={{ fontSize: 13, color: "var(--ink2)", marginTop: 3 }}>✅ {e.cue[lang]}</div>
                                <a className="vid" href={exVideo(e.q)} target="_blank" rel="noreferrer">🎥 {t.video}</a>
                              </td>
                              <td>{wk.sets}</td><td>{wk.reps}</td><td>{wk.rest}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
                <div className="card">
                  <p className="eyebrow">{t.reportInjury}</p>
                  <Chips multi value={liveInjuries} onChange={(v) => { setLiveInjuries(v); ping(t.injuryAdjusted); }}
                    opts={[{ v: "knee", l: t.injKnee }, { v: "shoulder", l: t.injShoulder }, { v: "back", l: t.injBack }]} />
                </div>
              </div>
            );
          })()}

          {/* RUN */}
          {tab === "run" && run && (() => {
            const wk = run.weeks[Math.min(activeWeek - 1, run.weeks.length - 1)];
            return (
              <div style={{ display: "grid", gap: 14 }}>
                {run.race && (
                  <div className="card" style={{ background: run.raceWarn ? "var(--danger-soft)" : "var(--sun-soft)", border: "none" }}>
                    <p className="eyebrow">{t.confirmRace}</p>
                    <p style={{ fontWeight: 700, fontSize: 16, margin: "4px 0" }}>🏁 {run.race.name} · {run.race.city} · {new Date(run.race.date + "T12:00").toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "numeric", month: "long" })}</p>
                    <p style={{ fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>{run.raceWarn || t.raceOk(run.race.name, weeksBetween(run.race.date))}</p>
                    {run.raceWarn && run.alts.length > 0 && (
                      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                        {run.alts.map((r) => (
                          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 10, padding: "8px 12px", fontSize: 13.5 }}>
                            <span><b>{r.name}</b> · {r.city} · {r.dists.join("K/")}K</span>
                            <button className="btn btn-p btn-sm" onClick={() => { up("raceId", r.id); up("raceDist", null); ping("✅"); }}>{t.pickAlt}</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <h3 className="disp" style={{ fontSize: 19, margin: 0 }}>{t.week} {activeWeek} · {wk.km} km</h3>
                    <span className="tag" style={{ background: "var(--papaya-soft)", color: "var(--papaya)" }}>{t.phase}: {t.phases[wk.phase] || wk.phase}</span>
                  </div>
                  <table className="tbl" style={{ marginTop: 10 }}>
                    <thead><tr><th>{lang === "es" ? "Día" : "Day"}</th><th>{t.sessionType}</th><th>{t.distance}</th><th>{t.targetPace}</th></tr></thead>
                    <tbody>
                      {wk.sessions.map((s, si) => (
                        <tr key={si}>
                          <td>{wk.dayNames[lang][s.day]}</td>
                          <td><b>{t.runTypes[s.type].n}</b><div style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 3, lineHeight: 1.5 }}>{t.runTypes[s.type].d}</div></td>
                          <td>{s.det[lang]}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{s.pace}{s.pace !== "—" && " min/km"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {p.city === "Bogotá" && <p style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 10 }}>{t.altitude}</p>}
                </div>
              </div>
            );
          })()}

          {/* PROFILE */}
          {tab === "profile" && (() => {
            const h = Number(p.height) || 170, w = Number(p.weight) || 70;
            const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
            const whr = p.waist && p.hip ? (p.waist / p.hip).toFixed(2) : "—";
            const whtr = p.waist ? (p.waist / h).toFixed(2) : "—";
            return (
              <div style={{ display: "grid", gap: 14 }}>
                <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, textAlign: "center" }}>
                  {[[t.bmi, bmi], [t.whr, whr], [t.whtr, whtr], nutri && [t.bmr, `${nutri.bmr} kcal`], nutri && [t.tdee, `${nutri.tdee} kcal`]].filter(Boolean).map(([l, v]) => (
                    <div key={l}><p className="eyebrow" style={{ fontSize: 10 }}>{l}</p><p className="disp" style={{ fontSize: 24, margin: "2px 0", color: "var(--sel)" }}>{v}</p></div>
                  ))}
                </div>
                <div className="card">
                  <p style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.6 }}>{t.editNote}</p>
                  <p style={{ fontSize: 13.5, color: "var(--ink2)" }}>⚕️ {t.disclaimer}</p>
                  <button className="btn btn-g btn-sm" onClick={() => setShowSources(true)}>{t.sourcesBtn}</button>
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* Sources modal */}
      {showSources && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(21,36,31,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={() => setShowSources(false)}>
          <div className="card fade" style={{ maxWidth: 560, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="disp" style={{ fontSize: 22, marginTop: 0 }}>📚 {t.sources}</h3>
            <ul style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink2)", paddingLeft: 18 }}>
              {t.sourcesList.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <button className="btn btn-p btn-sm" onClick={() => setShowSources(false)}>OK</button>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
