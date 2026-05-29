// ==========================================
// 1. DICCIONARIO DE TRADUCCIONES (ES / EN)
// ==========================================
const i18n = {
  es: {
    // Navegación
    navHome: "Home",
    navPubs: "Publicaciones",
    navPres: "Presentaciones",
    navOutreach: "Divulgación",
    navProjects: "Proyectos",
    navTeaching: "Docencia",
    navGroup: "Research Group",
    navCollab: "Colaboraciones",
    navResources: "Resources",
    navBlog: "Blog",

    // Barra Lateral
    roleTitle: "Técnico Académico Titular A<br>(Tiempo Completo Definitivo)",
    affilUni: "<strong>Facultad de Psicología, UNAM</strong>",
    affilLoc: "Ciudad de México, México",
    memberTitle: "<strong>Miembro:</strong>",
    contactTitle: "<strong>Contacto:</strong>",
    member1: "Sistema Nacional de Investigadores Nivel I",
    member2: "Laboratorio de Psicolingüística",
    member3: "Interdisciplinary Network for Cognitive and Behavioral Sciences",

    // Inicio
    aboutTitle: "Acerca de mi",
    aboutP1: "Soy Doctor en Psicología (Neurociencias de la Conducta, UNAM; examen 28 de enero de 2025), con formación previa como Maestro en Ciencias del Comportamiento (Neurociencias, UdeG, 2018) y Licenciado en Psicología (UdeG, 2015).",
    aboutP2: "He realizado estancias y colaboración académica en instituciones como el Department of Experimental Psychology (University of Oxford, proyecto “Modelling the Infant Bilingual Lexicon”) y el Center for Brain and Cognition (Universitat Pompeu Fabra).",
    resTitle: "Intereses de investigación",
    resIntro: "Mi trabajo se enfoca en cómo se organiza y anticipa la información lingüística durante la comprensión, considerando factores semánticos, fonológicos y contextuales, y usando medidas experimentales y análisis computacionales.",
    int1: "Predicción lingüística en población típica y clínica",
    int2: "Adquisición del lenguaje (infancia temprana)",
    int3: "Bilingüismo y acceso léxico",
    int4: "Medidas conductuales y psicofisiológicas (eye-tracking, pupilometría, EEG)",
    int5: "Análisis computacional (RSA, series de tiempo, redes léxico-semánticas)",
    keyTitle: "Palabras Clave",
    k1: "Psicolingüística", k2: "Predicción", k3: "Bilingüismo", k4: "Adquisición del lenguaje", k5: "Rastreo ocular", k6: "Pupilometría", k7: "EEG/ERP", k8: "Redes semánticas", k9: "IA aplicada", k10: "Normas de completamiento oracional",
    
    // Publicaciones
    pubsTitle: "Artículos de revista",
    pubsDesc: "Artículos indexados en revistas con revisión por pares ordenados cronológicamente.",

    // Presentaciones
    presTitle: "Presentaciones y Conferencias",
    presDesc: "Selección de ponencias, conferencias magistrales, carteles y talleres presentados en congresos e instituciones académicas.",

    // Grupo de investigación
    groupPageTitle: "Miembros del Grupo de Investigación",
    groupDesc: "Nuestro equipo está formado por estudiantes e investigadores dedicados al estudio de la psicolingüística y las neurociencias cognitivas de la conducta.",
    
    m1Name: "Alexandra Rosselli González Balderrama",
    m1Bio: "Estudiando psicología, actualmente estoy trabajando como ingeniera en monitoreo de redes empresariales en Totalplay.",
    
    m2Name: "Arely Perez Ramirez",
    m2Bio1: "Profesora dedicada a la Enseñanza de Idiomas (Inglés y Francés) a niños, adolescentes y adultos. Apasionada por la Educación Consciente, la Psicolingüística y las Neurociencias.",
    m2Bio2: "Actualmente, además de mi labor docente, formo parte del equipo de investigación dirigido por el Dr. Armando Angulo Chavira en el Laboratorio de Psicolingüística de la Facultad de Psicología de la UNAM como parte de mi servicio social.",

    // Proyectos
    projTitle: "Proyectos de Investigación",

    // Divulgación
    outreachTitle: "Divulgación Científica",
    outreachPubs: "Artículos de Divulgación",
    outreachEvents: "Organización de Eventos",
    outreachMedia: "Entrevistas en Medios",

    // Docencia
    teachingTitle: "Docencia",
    teachUndergrad: "Cursos de Licenciatura",
    teachGrad: "Cursos de Posgrado",

    // Colaboraciones
    collabTitle: "Colaboraciones",
    
    c1Name: "Dra. Natalia Arias Trejo",
    c1Degree: "Doctora en Psicología.",
    c1Position: "Profesora de Tiempo Completo en la Universidad Nacional Autónoma de México (UNAM).",
    c1IntL: "<strong>Temas de interés:</strong>",
    c1IntT: "Adquisición del lenguaje, normas de asociación de palabras.",

    c2Name: "Dr. Anuenue Baker Kukona",
    c2Degree: "Doctor en Psicología.",
    c2Position: "Profesor Titular en Psicología en la Universidad de Greenwich.",
    c2IntL: "<strong>Temas de interés:</strong>",
    c2IntT: "Cognición, lingüística y métodos cuantitativos.",

    c3Name: "Dr. Luis Ángel Llamas Alonso",
    c3Degree: "Doctor en Neurociencias de la Conducta.",
    c3Position: "Profesor de Tiempo Completo en la Universidad Autónoma de Baja California (UABC).",
    c3IntL: "<strong>Temas de interés:</strong>",
    c3IntT: "Neurociencia cognitiva, neurociencia afectiva, psicología experimental.",

    c4Name: "Dr. Julio César Llamas Alonso",
    c4Degree: "Doctor en Psicología.",
    c4Position: "Profesor Investigador de Tiempo Completo en la Universidad Autónoma del Estado de Hidalgo (UAEH).",
    c4IntL: "<strong>Temas de interés:</strong>",
    c4IntT: "Neurociencias, cognición, psicopatología, adicciones, memoria, creatividad.",

    c5Name: "Dr. Vladimir Huerta Chávez",
    c5Degree: "Doctor en Psicología.",
    c5Position: "Miembro del Instituto de Neurociencias de la Universidad de Guadalajara (UdeG).",
    c5IntL: "<strong>Temas de interés:</strong>",
    c5IntT: "Emoción y cognición, ERPs y rastreo ocular (eye-tracking).",

    c6Name: "Dr. Kim Plunkett",
    c6Degree: "Doctor en Psicología Experimental.",
    c6Position: "Profesor Emérito de Ciencias Cognitivas.",
    c6IntL: "<strong>Temas de interés:</strong>",
    c6IntT: "Reconocimiento de palabras, aprendizaje de palabras, desarrollo semántico y formación de categorías.",

    c7Name: "Prof. Bruno Lara",
    c7Degree: "Profesor.",
    c7Position: "Laboratorio de Robótica Cognitiva, CInC, Universidad Autónoma del Estado de Morelos (UAEM).",
    c7IntL: "<strong>Temas de interés:</strong>",
    c7IntT: "Robótica cognitiva, así como el estudio y modelado de procesos predictivos, perceptuales, afectivos y atencionales en agentes biológicos y artificiales.",

    c8Name: "Dra. Alejandra Ciria",
    c8Degree: "Doctora en Ciencias.",
    c8Position: "Investigadora Asociada (Tiempo Completo), Departamento de Ciencias de la Computación, IIMAS, UNAM.",
    c8IntL: "<strong>Temas de interés:</strong>",
    c8IntT: "Intersección entre la cognición corporizada, inteligencia artificial y robótica cognitiva; procesamiento de información multimodal y adaptación en sistemas biológicos y artificiales.",
    
    // Recursos
    resourcesTitle: "Recursos",
    citeText: "Para citar esta base de datos:",
    
    res1Title: "Mexican Spanish adaptation for the Affective Norms for English Words (ANEW)",
    res1Desc: "La Adaptación al Español de México de ANEW es una base de datos que contiene las evaluaciones de 1,028 palabras, calificadas por 753 participantes. Es una herramienta metodológica basada en la escala pictórica SAM (Self-Assessment Manikin) que permite estudiar el procesamiento emocional de las palabras en tres dimensiones: valencia (agrado), activación (arousal) y dominancia (control) dentro de un contexto lingüístico y culturalmente relevante para México.",
    res1Btn: "Descargar Base de Datos (CSV)",

    res2Title: "Sentence‐final completion norms for 2925 Mexican Spanish sentence contexts",
    res2Desc: "La Base de Datos de Normas de Completamiento proporciona un extenso corpus de 2,925 contextos de oraciones evaluados por 1,470 participantes adultos en México. Incluye medidas calculadas para estimar la predictibilidad de la palabra final, tales como la probabilidad de cierre (cloze probability), sorpresa (surprisal) y el nivel de incertidumbre o entropía del contexto. Es una herramienta ideal para investigaciones en psicolingüística, mecanismos predictivos del lenguaje y ciencias cognitivas.",
    res2Btn: "Descargar Base de Datos (XLSX)",

    // Blog
    blogTitle: "Blog",
    blogDesc: "Reflexiones, noticias y notas breves sobre psicolingüística, ciencia cognitiva y tecnología.",
    readMore: "Leer más &rarr;",

    post1Title: "El futuro de la IA en la psicolingüística",
    post1Date: "15 de Marzo, 2026",
    post1Snippet: "Un breve análisis sobre cómo los modelos de lenguaje a gran escala (LLMs) están transformando nuestra forma de modelar y estudiar el léxico mental y el cerebro bilingüe...",

    post2Title: "Consejos para sobrevivir al doctorado",
    post2Date: "10 de Febrero, 2026",
    post2Snippet: "Después de defender mi tesis doctoral, comparto algunas estrategias que me ayudaron a mantener el equilibrio entre las exigencias del laboratorio, la escritura y la vida personal.",

    post3Title: "Entendiendo el 'Eye-Tracking' en la infancia",
    post3Date: "5 de Enero, 2026",
    post3Snippet: "Una introducción amigable a la tecnología de rastreo ocular y cómo esta herramienta no invasiva nos permite descubrir qué saben los bebés mucho antes de que puedan articular palabras."
  },
  
  en: {
    // Navigation
    navHome: "Home",
    navPubs: "Publications",
    navPres: "Presentations",
    navOutreach: "Outreach",
    navProjects: "Projects",
    navTeaching: "Teaching",
    navGroup: "Research Group",
    navCollab: "Collaborations",
    navResources: "Resources",
    navBlog: "Blog",

    // Sidebar
    roleTitle: "Senior Academic Technician A<br>(Full-Time)",
    affilUni: "<strong>Faculty of Psychology, UNAM</strong>",
    affilLoc: "Mexico City, Mexico",
    memberTitle: "<strong>Member:</strong>",
    contactTitle: "<strong>Contact:</strong>",
    member1: "National System of Researchers (SNI) Level I",
    member2: "Psycholinguistics Laboratory",
    member3: "Interdisciplinary Network for Cognitive and Behavioral Sciences",

    // Home
    aboutTitle: "About me",
    aboutP1: "I hold a PhD in Psychology (Behavioral Neuroscience, UNAM; examination January 28, 2025), and previously completed an MSc in Behavioral Sciences (Neuroscience, UdeG, 2018) and a BA in Psychology (UdeG, 2015).",
    aboutP2: "I have conducted research stays and collaborations at institutions such as the Department of Experimental Psychology (University of Oxford, “Modelling the Infant Bilingual Lexicon” project) and the Center for Brain and Cognition (Universitat Pompeu Fabra).",
    resTitle: "Research interests",
    resIntro: "My work focuses on how linguistic information is organized and anticipated during comprehension, considering semantic, phonological, and contextual factors, using experimental measures and computational analyses.",
    int1: "Linguistic prediction in typical and clinical populations",
    int2: "Language acquisition (early childhood)",
    int3: "Bilingualism and lexical access",
    int4: "Behavioral and psychophysiological measures (eye-tracking, pupillometry, EEG)",
    int5: "Computational analysis (RSA, time series, lexico-semantic networks)",
    keyTitle: "Keywords",
    k1: "Psycholinguistics", k2: "Prediction", k3: "Bilingualism", k4: "Language acquisition", k5: "Eye-tracking", k6: "Pupillometry", k7: "EEG/ERP", k8: "Semantic networks", k9: "Applied AI", k10: "Sentence completion norms",

    // Publications
    pubsTitle: "Journal Articles",
    pubsDesc: "Peer-reviewed journal articles arranged chronologically.",

    // Presentations
    presTitle: "Presentations and Conferences",
    presDesc: "Selection of lectures, keynotes, posters, and workshops presented at academic conferences and institutions.",

    // Research Group
    groupPageTitle: "Research Group Members",
    groupDesc: "Our team consists of students and researchers dedicated to the study of psycholinguistics and cognitive neuroscience.",
    
    m1Name: "Alexandra Rosselli González Balderrama",
    m1Bio: "Currently studying Psychology and working as an Enterprise Network Monitoring Engineer at Totalplay.",
    
    m2Name: "Arely Perez Ramirez",
    m2Bio1: "Language teacher (English and French) for children, teenagers, and adults. Passionate about Conscious Education, Psycholinguistics, and Neuroscience.",
    m2Bio2: "Currently, in addition to my teaching work, I am part of the research team led by Dr. Armando Angulo Chavira at the Psycholinguistics Laboratory of the Faculty of Psychology (UNAM) as part of my social service.",

    // Projects
    projTitle: "Research Projects",

    // Outreach
    outreachTitle: "Science Communication & Outreach",
    outreachPubs: "Outreach Publications",
    outreachEvents: "Event Organization",
    outreachMedia: "Media Interviews",

    // Teaching
    teachingTitle: "Teaching",
    teachUndergrad: "Undergraduate Courses",
    teachGrad: "Graduate Courses",

    // Collaborations
    collabTitle: "Collaborations",
    
    c1Name: "Dr. Natalia Arias Trejo",
    c1Degree: "Doctor of Psychology.",
    c1Position: "Full Time Professor at National Autonomous University of Mexico (UNAM).",
    c1IntL: "<strong>Interests Topics:</strong>",
    c1IntT: "Language acquisition, word association norms.",

    c2Name: "Dr. Anuenue Baker Kukona",
    c2Degree: "PhD in Psychology.",
    c2Position: "Senior Lecturer in Psychology at University of Greenwich.",
    c2IntL: "<strong>Interests Topics:</strong>",
    c2IntT: "Cognition, linguistics and quantitative methods.",

    c3Name: "Dr. Luis Angel Llamas Alonso",
    c3Degree: "PhD in Behavioral Neuroscience.",
    c3Position: "Full Time Professor at Autonomous University of Baja California.",
    c3IntL: "<strong>Interests Topics:</strong>",
    c3IntT: "Cognitive Neuroscience, Affective Neuroscience, Experimental Psychology.",

    c4Name: "Dr. Julio César Llamas Alonso",
    c4Degree: "Doctor of Psychology.",
    c4Position: "Full Time Researcher Lecturer at Autonomous University of Hidalgo State.",
    c4IntL: "<strong>Interests Topics:</strong>",
    c4IntT: "Neurosciences, cognition, psychopathology, addictions, memory, creativity.",

    c5Name: "Dr. Vladimir Huerta Chavez",
    c5Degree: "Doctor of Psychology.",
    c5Position: "Member of the Neuroscience Institute at the University of Guadalajara.",
    c5IntL: "<strong>Interests Topics:</strong>",
    c5IntT: "Emotion and cognition, ERP's & eye tracking.",

    c6Name: "Dr. Kim Plunkett",
    c6Degree: "PhD in Experimental Psychology.",
    c6Position: "Emeritus Professor of Cognitive Science.",
    c6IntL: "<strong>Interests Topics:</strong>",
    c6IntT: "Word recognition, word learning, semantic development and category formation.",

    c7Name: "Prof. Bruno Lara",
    c7Degree: "Professor.",
    c7Position: "Cognitive Robotics Laboratory, CInC, Autonomous University of the State of Morelos (UAEM).",
    c7IntL: "<strong>Interests Topics:</strong>",
    c7IntT: "Cognitive Robotics as well as the study and modeling of predictive, perceptual, affective, and attentional processes in biological and artificial agents.",

    c8Name: "Dr. Alejandra Ciria",
    c8Degree: "Ph.D.",
    c8Position: "Associate Researcher (Full-time), Department of Computer Science, IIMAS, UNAM.",
    c8IntL: "<strong>Interests Topics:</strong>",
    c8IntT: "Intersection of embodied cognition, artificial intelligence, and cognitive robotics; multimodal information processing and adaptation in biological and artificial systems.",

    // Resources
    resourcesTitle: "Resources",
    citeText: "To cite this database:",
    
    res1Title: "Mexican Spanish adaptation for the Affective Norms for English Words (ANEW)",
    res1Desc: "The Mexican Spanish Adaptation of ANEW is a database containing the evaluations of 1,028 words, rated by 753 participants. It is a methodological tool based on the Self-Assessment Manikin (SAM) pictorial scale that allows the study of emotional word processing in three dimensions: valence (pleasantness), arousal (activation), and dominance (control) within a linguistically and culturally relevant context for Mexico.",
    res1Btn: "Download Database (CSV)",

    res2Title: "Sentence‐final completion norms for 2925 Mexican Spanish sentence contexts",
    res2Desc: "The Sentence Completion Norms Database provides an extensive corpus of 2,925 sentence contexts evaluated by 1,470 adult participants in Mexico. It includes calculated measures to estimate the predictability of the final word, such as cloze probability, surprisal, and the level of uncertainty or context entropy. It is an ideal tool for research in psycholinguistics, predictive language mechanisms, and cognitive sciences.",
    res2Btn: "Download Database (XLSX)",

    // Blog
    blogTitle: "Blog",
    blogDesc: "Reflections, news, and short notes on psycholinguistics, cognitive science, and technology.",
    readMore: "Read more &rarr;",

    post1Title: "The future of AI in psycholinguistics",
    post1Date: "March 15, 2026",
    post1Snippet: "A brief analysis of how large language models (LLMs) are transforming the way we model and study the mental lexicon and the bilingual brain...",

    post2Title: "Tips for surviving a PhD",
    post2Date: "February 10, 2026",
    post2Snippet: "After defending my doctoral thesis, I share some strategies that helped me balance the demands of the lab, writing, and personal life.",

    post3Title: "Understanding Eye-Tracking in infancy",
    post3Date: "January 5, 2026",
    post3Snippet: "A friendly introduction to eye-tracking technology and how this non-invasive tool allows us to discover what babies know long before they can articulate words."
  }
};

// ==========================================
// 2. FUNCIÓN PARA CARGAR COMPONENTES (FETCH)
// ==========================================
async function loadComponents() {
  try {
    const [headerRes, sidebarRes, footerRes] = await Promise.all([
      fetch('header.html'),
      fetch('sidebar.html'),
      fetch('footer.html')
    ]);

    const headerHtml = await headerRes.text();
    const sidebarHtml = await sidebarRes.text();
    const footerHtml = await footerRes.text();

    const headerPlaceholder = document.getElementById('header-placeholder');
    if(headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;

    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if(sidebarPlaceholder) sidebarPlaceholder.innerHTML = sidebarHtml;

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if(footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

    initLanguage();
    highlightCurrentPage();

  } catch (error) {
    console.error("Error cargando los componentes HTML:", error);
  }
}

// ==========================================
// 3. LÓGICA DE IDIOMAS Y DELEGACIÓN DE EVENTOS
// ==========================================
function setLanguage(lang) {
  const dict = i18n[lang] || i18n.es;
  document.documentElement.lang = lang; 

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  const langImg = document.getElementById("langImg");
  const langText = document.getElementById("langText");

  if (langImg && langText) {
    if (lang === "es") {
      langText.textContent = "EN";
      langImg.src = "img/usa.jpg"; 
      langImg.alt = "Bandera EN";
    } else {
      langText.textContent = "ES";
      langImg.src = "img/mx.jpg"; 
      langImg.alt = "Bandera ES";
    }
  }

  localStorage.setItem("site_lang", lang);
}

function initLanguage() {
  const savedLang = localStorage.getItem("site_lang") || "es";
  setLanguage(savedLang);

  // Delegación de eventos (A prueba de balas)
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("#langToggle");
    
    if (toggleBtn) {
      e.preventDefault(); 
      const currentLang = document.documentElement.lang || "es";
      const newLang = currentLang === "es" ? "en" : "es";
      setLanguage(newLang);
    }
  });
}

// ==========================================
// 4. RESALTAR PÁGINA ACTUAL EN EL MENÚ
// ==========================================
function highlightCurrentPage() {
  const links = document.querySelectorAll(".nav-menu a");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  
  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

// ==========================================
// 5. INICIAR TODO AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  loadComponents();
});
