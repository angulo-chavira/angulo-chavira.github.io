// ==========================================
// 1. DICCIONARIO DE TRADUCCIONES (ES / EN)
// ==========================================
const i18n = {
  es: {
    // Navegación
    navHome: "Inicio",
    navMenu: "Menú",
    navPubs: "Publicaciones",
    navPres: "Presentaciones",
    navOutreach: "Divulgación",
    navProjects: "Proyectos",
    navTeaching: "Docencia",
    navGroup: "Grupo de investigación",
    navCollab: "Colaboraciones",
    navResources: "Recursos",
    navBlog: "Blog",

    // Barra Lateral
    roleTitle: "Investigador en Psicología Cognitiva y Psicolingüística",
    affilUni: "<strong>Facultad de Psicología, UNAM</strong>",
    affilLoc: "Ciudad de México, México",
    memberTitle: "<strong>Miembro:</strong>",
    contactTitle: "<strong>Contacto:</strong>",
    member1: "Sistema Nacional de Investigadores Nivel I",
    member2: "Laboratorio de Psicolingüística",
    member3: "Interdisciplinary Network for Cognitive and Behavioral Sciences",

    // Inicio
    homeEyebrow: "Neurociencia cognitiva · Modelado computacional",
    homeTitle: "Cerebro, cognición y computación",
    homeLead: "Investigo cómo representamos, anticipamos y producimos información. Actualmente desarrollo proyectos de modelado computacional del lenguaje, decodificación de habla interna con EEG, experimentación en línea y juicios morales, desde una perspectiva de neurociencia cognitiva.",
    homeCredential1: "Doctor en Psicología · Neurociencias de la Conducta",
    homeCredential2: "Facultad de Psicología · UNAM",
    homeCtaPubs: "Explorar publicaciones <span aria-hidden=\"true\">↗</span>",
    homeCtaProjects: "Ver proyectos",
    homePhotoCaption: "Psicología · Psicolingüística",
    homeFocusEyebrow: "Agenda de investigación",
    homeFocusTitle: "Cerebro, modelos y experimentos",
    homeFocusIntro: "Una agenda que conecta procesos cognitivos, herramientas computacionales y nuevas formas de investigar.",
    homeArea1Title: "Modelado computacional del lenguaje",
    homeArea1Desc: "Construir y comparar modelos que expliquen cómo se representa, comprende y anticipa el lenguaje.",
    homeArea2Title: "Habla interna y decodificación",
    homeArea2Desc: "Usar EEG y análisis computacional para estudiar las representaciones cerebrales del habla no pronunciada.",
    homeArea3Title: "Juicios morales y cognición social",
    homeArea3Desc: "Diseñar experimentos para estudiar cómo evaluamos acciones, intenciones y situaciones sociales.",
    homeArea4Title: "Herramientas digitales para investigar",
    homeArea4Desc: "Desarrollar aplicaciones de experimentación en línea, validación de tareas y flujos reproducibles.",
    homeAreaLink: "Proyectos relacionados <span aria-hidden=\"true\">↗</span>",
    homeMethodsEyebrow: "Métodos",
    homeMethodsTitle: "Del fenómeno cognitivo al modelo y al experimento",
    homeMethodPupil: "Pupilometría",
    homeMethodModels: "Modelos computacionales",
    homeMethodNetworks: "Redes léxico-semánticas",
    homeMethodOnline: "Experimentos en línea",
    homeMethodOpenScience: "Ciencia abierta",
    homeRecentEyebrow: "Producción académica",
    homeRecentTitle: "Publicaciones recientes",
    homeAllPubs: "Ver todas las publicaciones <span aria-hidden=\"true\">↗</span>",
    homeRecentIntro: "Una selección que se actualiza a partir del catálogo de publicaciones del sitio.",
    homeLoading: "Cargando publicaciones…",
    homeTrainingEyebrow: "Formación",
    homeTrainingTitle: "Trayectoria académica",
    homeTeachingLink: "Docencia y actividades <span aria-hidden=\"true\">↗</span>",
    homePhd: "Doctorado en Psicología · Neurociencias de la Conducta",
    homeMsc: "Maestría en Ciencias del Comportamiento · Neurociencias",
    homeBa: "Licenciatura en Psicología",
    homeContactEyebrow: "Contacto",
    homeContactTitle: "¿Te interesa colaborar?",
    homeContactText: "Estoy abierto a conversaciones sobre investigación, datos y proyectos en ciencias cognitivas.",
    homeContactButton: "Escríbeme <span aria-hidden=\"true\">↗</span>",
    homePubsLoading: "Cargando publicaciones…",
    homePublicationLink: "Ver publicación <span aria-hidden=\"true\">↗</span>",
    homeFirstAuthor: "Primer autor",
    homeCorrespondingAuthor: "Autor de correspondencia",
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
    pubsTitle: "Publicaciones",
    pubsDesc: "Explora la lista por año, tema y tipo de autoría. Los resúmenes y etiquetas se pueden completar o actualizar desde el administrador de contenidos.",

    // Presentaciones
    presTitle: "Presentaciones y Conferencias",
    presDesc: "Selección de ponencias, conferencias magistrales, carteles y talleres presentados en congresos e instituciones académicas.",

    // Grupo de investigación
    groupPageTitle: "Miembros del Grupo de Investigación",
    groupDesc: "Estudiantes y colegas que colaboran en proyectos del Laboratorio de Psicolingüística y en investigación sobre lenguaje y cognición.",
    
    m1Name: "Alexandra Rosselli González Balderrama",
    m1Bio: "Estudiante de Psicología y especialista en monitoreo de redes empresariales en Totalplay.",
    
    m2Name: "Arely Pérez Ramírez",
    m2Bio1: "Profesora de inglés y francés para niñas, niños, adolescentes y adultos. Sus intereses incluyen la educación consciente, la psicolingüística y las neurociencias.",
    m2Bio2: "Colabora en proyectos del Laboratorio de Psicolingüística de la Facultad de Psicología de la UNAM como parte de su servicio social.",

    // Proyectos
    projEyebrow: "Neurociencia cognitiva · Modelado · Experimentación",
    projTitle: "Proyectos de investigación",
    projIntro: "Mi trabajo actual combina preguntas sobre cognición y cerebro con herramientas computacionales y experimentales.",
    projCurrentEyebrow: "En desarrollo",
    projCurrentTitleText: "Líneas de trabajo",
    projCurrentDesc: "Proyectos que conectan modelos, actividad cerebral y diseño experimental.",
    projStatus: "En desarrollo",
    projModelTitle: "Modelado computacional del lenguaje",
    projModelDesc: "Desarrollo de modelos para estudiar cómo se representan y procesan el lenguaje y sus significados.",
    projModelTag: "Lenguaje · Modelos computacionales",
    projInnerTitle: "Decodificación de habla interna",
    projInnerDesc: "Estudio con EEG y análisis computacional de las representaciones implicadas en el habla interna y su relación con la producción verbal.",
    projOnlineTitle: "Experimentación en línea",
    projOnlineDesc: "Desarrollo de una aplicación web para diseñar, ejecutar y validar experimentos desde el navegador.",
    projOnlineTag: "Aplicaciones web · Métodos abiertos",
    projMoralTitle: "Juicios morales y cognición social",
    projMoralDesc: "Diseño y validación de una tarea experimental para estudiar cómo evaluamos acciones, intenciones y situaciones sociales.",
    projMoralTag: "Cognición social · Diseño experimental",
    projOtherTitle: "Otros proyectos y colaboraciones",
    projOtherDesc: "Participación en proyectos institucionales y colaborativos en distintas etapas de mi trayectoria.",
    projPapiitTitle: "PAPIIT · UNAM",
    projPapiit1: "Colaborador en IN304825, “Representación del conocimiento conceptual: análisis del contenido sensoriomotor de los conceptos mediante herramientas de inteligencia artificial y experimentación con contextos oracionales” (2025–2027).",
    projPapiit2: "Colaborador en AG300224, “Predicción lingüística en monolingües y bilingües español-inglés” (2024–2026).",
    projPapiit3: "Colaborador en IN303221, “Efecto de la restricción oracional y la similitud entre palabras en la actividad EEG” (2021–2023).",
    projPapiit4: "Colaborador en el proyecto “Discriminación léxica en bilingües mediante seguimiento ocular”, Departamento de Lingüística Aplicada, bajo la dirección de la Dra. Alina María Signoret Dorcasberro (diciembre de 2014–diciembre de 2015).",
    projOtherInstitutionTitle: "Otros proyectos institucionales",
    projConacyt: "Asistente de investigación en el Laboratorio de Psicolingüística, bajo la dirección de la Dra. Natalia Arias Trejo, en el proyecto “Mecanismos de formación y modulación de redes semánticas en adolescencia y adultez” (CONACyT-167900; junio de 2013–diciembre de 2015).",
    projIndependent: "Colaboración en proyectos del Laboratorio de Psicolingüística sobre predicción y redes léxicas en personas con síndrome de Down, y priming durante el envejecimiento con seguimiento ocular (semestre 2022-2).",
    projSeminar: "Seminario-taller del proyecto PAPIIT-IG300224 “Predicción lingüística en monolingües y bilingües español-inglés”, ENALLT, UNAM (2 de agosto–22 de noviembre de 2024).",

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
    collabDesc: "Una red de colegas e instituciones con quienes he colaborado en proyectos y publicaciones sobre lenguaje, desarrollo y ciencias cognitivas.",
    
    c1Name: "Dra. Natalia Arias Trejo",
    c1Degree: "Doctora en Psicología.",
    c1Position: "Profesora de Tiempo Completo en la Universidad Nacional Autónoma de México (UNAM).",
    c1IntL: "<strong>Áreas de investigación:</strong>",
    c1IntT: "Adquisición del lenguaje, normas de asociación de palabras.",

    c2Name: "Dr. Anuenue Baker Kukona",
    c2Degree: "Doctor en Psicología.",
    c2Position: "Profesor Titular en Psicología en la Universidad de Greenwich.",
    c2IntL: "<strong>Áreas de investigación:</strong>",
    c2IntT: "Cognición, lingüística y métodos cuantitativos.",

    c3Name: "Dr. Luis Ángel Llamas Alonso",
    c3Degree: "Doctor en Neurociencias de la Conducta.",
    c3Position: "Profesor de Tiempo Completo en la Universidad Autónoma de Baja California (UABC).",
    c3IntL: "<strong>Áreas de investigación:</strong>",
    c3IntT: "Neurociencia cognitiva, neurociencia afectiva, psicología experimental.",

    c4Name: "Dr. Julio César Llamas Alonso",
    c4Degree: "Doctor en Psicología.",
    c4Position: "Profesor Investigador de Tiempo Completo en la Universidad Autónoma del Estado de Hidalgo (UAEH).",
    c4IntL: "<strong>Áreas de investigación:</strong>",
    c4IntT: "Neurociencias, cognición, psicopatología, adicciones, memoria, creatividad.",

    c5Name: "Dr. Vladimir Huerta Chávez",
    c5Degree: "Doctor en Psicología.",
    c5Position: "Miembro del Instituto de Neurociencias de la Universidad de Guadalajara (UdeG).",
    c5IntL: "<strong>Áreas de investigación:</strong>",
    c5IntT: "Emoción y cognición, ERPs y rastreo ocular (eye-tracking).",

    c6Name: "Dr. Kim Plunkett",
    c6Degree: "Doctor en Psicología Experimental.",
    c6Position: "Profesor Emérito de Ciencias Cognitivas.",
    c6IntL: "<strong>Áreas de investigación:</strong>",
    c6IntT: "Reconocimiento de palabras, aprendizaje de palabras, desarrollo semántico y formación de categorías.",

    c7Name: "Prof. Bruno Lara",
    c7Degree: "Profesor.",
    c7Position: "Laboratorio de Robótica Cognitiva, CInC, Universidad Autónoma del Estado de Morelos (UAEM).",
    c7IntL: "<strong>Áreas de investigación:</strong>",
    c7IntT: "Robótica cognitiva, así como el estudio y modelado de procesos predictivos, perceptuales, afectivos y atencionales en agentes biológicos y artificiales.",

    c8Name: "Dra. Alejandra Ciria",
    c8Degree: "Doctora en Ciencias.",
    c8Position: "Investigadora Asociada (Tiempo Completo), Departamento de Ciencias de la Computación, IIMAS, UNAM.",
    c8IntL: "<strong>Áreas de investigación:</strong>",
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
    navMenu: "Menu",
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
    roleTitle: "Researcher in Cognitive Psychology and Psycholinguistics",
    affilUni: "<strong>Faculty of Psychology, UNAM</strong>",
    affilLoc: "Mexico City, Mexico",
    memberTitle: "<strong>Member:</strong>",
    contactTitle: "<strong>Contact:</strong>",
    member1: "National System of Researchers (SNI) Level I",
    member2: "Psycholinguistics Laboratory",
    member3: "Interdisciplinary Network for Cognitive and Behavioral Sciences",

    // Home
    homeEyebrow: "Cognitive neuroscience · Computational modeling",
    homeTitle: "Brain, cognition, and computation",
    homeLead: "I study how we represent, anticipate, and produce information. I am currently developing projects in computational language modeling, EEG decoding of inner speech, online experimentation, and moral judgment from a cognitive neuroscience perspective.",
    homeCredential1: "PhD in Psychology · Behavioral Neuroscience",
    homeCredential2: "Faculty of Psychology · UNAM",
    homeCtaPubs: "Explore publications <span aria-hidden=\"true\">↗</span>",
    homeCtaProjects: "View projects",
    homePhotoCaption: "Psychology · Psycholinguistics",
    homeFocusEyebrow: "Research agenda",
    homeFocusTitle: "Brains, models, and experiments",
    homeFocusIntro: "An agenda connecting cognitive processes, computational tools, and new ways of doing research.",
    homeArea1Title: "Computational language modeling",
    homeArea1Desc: "Building and comparing models to explain how language is represented, understood, and predicted.",
    homeArea2Title: "Inner speech and decoding",
    homeArea2Desc: "Using EEG and computational analyses to study the neural representations of unspoken language.",
    homeArea3Title: "Moral judgment and social cognition",
    homeArea3Desc: "Designing experiments to study how people evaluate actions, intentions, and social situations.",
    homeArea4Title: "Digital research tools",
    homeArea4Desc: "Developing online experiment applications, task validation, and reproducible workflows.",
    homeAreaLink: "Related projects <span aria-hidden=\"true\">↗</span>",
    homeMethodsEyebrow: "Methods",
    homeMethodsTitle: "From cognitive phenomena to models and experiments",
    homeMethodPupil: "Pupillometry",
    homeMethodModels: "Computational models",
    homeMethodNetworks: "Lexical-semantic networks",
    homeMethodOnline: "Online experiments",
    homeMethodOpenScience: "Open science",
    homeRecentEyebrow: "Research output",
    homeRecentTitle: "Recent publications",
    homeAllPubs: "Browse all publications <span aria-hidden=\"true\">↗</span>",
    homeRecentIntro: "A selection drawn from the website's publication catalog.",
    homeLoading: "Loading publications…",
    homeTrainingEyebrow: "Education",
    homeTrainingTitle: "Academic background",
    homeTeachingLink: "Teaching and activities <span aria-hidden=\"true\">↗</span>",
    homePhd: "PhD in Psychology · Behavioral Neuroscience",
    homeMsc: "MSc in Behavioral Sciences · Neuroscience",
    homeBa: "BA in Psychology",
    homeContactEyebrow: "Contact",
    homeContactTitle: "Interested in collaborating?",
    homeContactText: "I welcome conversations about research, data, and projects in cognitive science.",
    homeContactButton: "Get in touch <span aria-hidden=\"true\">↗</span>",
    homePubsLoading: "Loading publications…",
    homePublicationLink: "View publication <span aria-hidden=\"true\">↗</span>",
    homeFirstAuthor: "First author",
    homeCorrespondingAuthor: "Corresponding author",
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
    pubsTitle: "Publications",
    pubsDesc: "Browse by year, topic, and author role. Abstracts and tags can be added or updated through the content manager.",

    // Presentations
    presTitle: "Presentations and Conferences",
    presDesc: "Selection of lectures, keynotes, posters, and workshops presented at academic conferences and institutions.",

    // Research Group
    groupPageTitle: "Research Group Members",
    groupDesc: "Students and colleagues collaborating on Psycholinguistics Laboratory projects and research on language and cognition.",
    
    m1Name: "Alexandra Rosselli González Balderrama",
    m1Bio: "Psychology student and enterprise network monitoring specialist at Totalplay.",
    
    m2Name: "Arely Pérez Ramírez",
    m2Bio1: "English and French teacher for children, teenagers, and adults. Her interests include conscious education, psycholinguistics, and neuroscience.",
    m2Bio2: "She collaborates on projects at the Psycholinguistics Laboratory, Faculty of Psychology, UNAM, as part of her social service.",

    // Projects
    projEyebrow: "Cognitive neuroscience · Modeling · Experimentation",
    projTitle: "Research projects",
    projIntro: "My current work combines questions about cognition and the brain with computational and experimental tools.",
    projCurrentEyebrow: "In development",
    projCurrentTitleText: "Research directions",
    projCurrentDesc: "Projects connecting models, brain activity, and experimental design.",
    projStatus: "In development",
    projModelTitle: "Computational language modeling",
    projModelDesc: "Developing models to study how language and meaning are represented and processed.",
    projModelTag: "Language · Computational models",
    projInnerTitle: "Inner speech decoding",
    projInnerDesc: "Using EEG and computational analyses to study the representations involved in inner speech and their relation to verbal production.",
    projOnlineTitle: "Online experimentation",
    projOnlineDesc: "Developing a web application to design, run, and validate experiments in a browser.",
    projOnlineTag: "Web applications · Open methods",
    projMoralTitle: "Moral judgment and social cognition",
    projMoralDesc: "Designing and validating an experimental task to study how we evaluate actions, intentions, and social situations.",
    projMoralTag: "Social cognition · Experimental design",
    projOtherTitle: "Other projects and collaborations",
    projOtherDesc: "Participation in institutional and collaborative projects at different stages of my career.",
    projPapiitTitle: "PAPIIT · UNAM",
    projPapiit1: "Collaborator on IN304825, “Representation of conceptual knowledge: analysis of the sensorimotor content of concepts using artificial intelligence tools and experimentation with sentence contexts” (2025–2027).",
    projPapiit2: "Collaborator on AG300224, “Linguistic prediction in Spanish-English monolinguals and bilinguals” (2024–2026).",
    projPapiit3: "Collaborator on IN303221, “Effect of sentence restriction and word similarity on EEG activity” (2021–2023).",
    projPapiit4: "Collaborator on “Lexical discrimination in bilinguals through eye-tracking”, Department of Applied Linguistics, under Dr. Alina María Signoret Dorcasberro (December 2014–December 2015).",
    projOtherInstitutionTitle: "Other institutional projects",
    projConacyt: "Research assistant at the Psycholinguistics Laboratory, under Dr. Natalia Arias Trejo, on “Mechanisms in the formation and modulation of semantic networks in adolescence and adulthood” (CONACyT-167900; June 2013–December 2015).",
    projIndependent: "Collaborated on Psycholinguistics Laboratory projects on prediction and lexical networks in people with Down syndrome, and priming during aging using eye-tracking (semester 2022-2).",
    projSeminar: "Workshop seminar for PAPIIT-IG300224, “Linguistic prediction in Spanish-English monolinguals and bilinguals,” ENALLT, UNAM (August 2–November 22, 2024).",

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
    collabDesc: "A network of colleagues and institutions with whom I have collaborated on projects and publications about language, development, and cognitive science.",
    
    c1Name: "Dr. Natalia Arias Trejo",
    c1Degree: "Doctor of Psychology.",
    c1Position: "Full Time Professor at National Autonomous University of Mexico (UNAM).",
    c1IntL: "<strong>Research areas:</strong>",
    c1IntT: "Language acquisition, word association norms.",

    c2Name: "Dr. Anuenue Baker Kukona",
    c2Degree: "PhD in Psychology.",
    c2Position: "Senior Lecturer in Psychology at University of Greenwich.",
    c2IntL: "<strong>Research areas:</strong>",
    c2IntT: "Cognition, linguistics and quantitative methods.",

    c3Name: "Dr. Luis Angel Llamas Alonso",
    c3Degree: "PhD in Behavioral Neuroscience.",
    c3Position: "Full Time Professor at Autonomous University of Baja California.",
    c3IntL: "<strong>Research areas:</strong>",
    c3IntT: "Cognitive Neuroscience, Affective Neuroscience, Experimental Psychology.",

    c4Name: "Dr. Julio César Llamas Alonso",
    c4Degree: "Doctor of Psychology.",
    c4Position: "Full Time Researcher Lecturer at Autonomous University of Hidalgo State.",
    c4IntL: "<strong>Research areas:</strong>",
    c4IntT: "Neurosciences, cognition, psychopathology, addictions, memory, creativity.",

    c5Name: "Dr. Vladimir Huerta Chavez",
    c5Degree: "Doctor of Psychology.",
    c5Position: "Member of the Neuroscience Institute at the University of Guadalajara.",
    c5IntL: "<strong>Research areas:</strong>",
    c5IntT: "Emotion and cognition, ERP's & eye tracking.",

    c6Name: "Dr. Kim Plunkett",
    c6Degree: "PhD in Experimental Psychology.",
    c6Position: "Emeritus Professor of Cognitive Science.",
    c6IntL: "<strong>Research areas:</strong>",
    c6IntT: "Word recognition, word learning, semantic development and category formation.",

    c7Name: "Prof. Bruno Lara",
    c7Degree: "Professor.",
    c7Position: "Cognitive Robotics Laboratory, CInC, Autonomous University of the State of Morelos (UAEM).",
    c7IntL: "<strong>Research areas:</strong>",
    c7IntT: "Cognitive Robotics as well as the study and modeling of predictive, perceptual, affective, and attentional processes in biological and artificial agents.",

    c8Name: "Dr. Alejandra Ciria",
    c8Degree: "Ph.D.",
    c8Position: "Associate Researcher (Full-time), Department of Computer Science, IIMAS, UNAM.",
    c8IntL: "<strong>Research areas:</strong>",
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

  } catch (error) {
    console.error("Error cargando los componentes HTML:", error);
  }
}

// ==========================================
// 3. IDIOMA, TEMA Y NAVEGACIÓN
// ==========================================
function setLanguage(lang) {
  const selected = i18n[lang] ? lang : "es";
  const dict = i18n[selected];
  document.documentElement.lang = selected;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) el.innerHTML = dict[key];
  });

  const langText = document.getElementById("langText");
  if (langText) langText.textContent = selected === "es" ? "EN" : "ES";
  try { localStorage.setItem("site_lang", selected); } catch (_) { /* storage is optional */ }
  document.dispatchEvent(new CustomEvent("site:language", { detail: { lang: selected } }));
}

function setTheme(theme) {
  const selected = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selected;
  const label = document.getElementById("themeLabel");
  const button = document.getElementById("themeToggle");
  const isSpanish = document.documentElement.lang !== "en";
  if (label) label.textContent = selected === "dark"
    ? (isSpanish ? "Modo claro" : "Light mode")
    : (isSpanish ? "Modo oscuro" : "Dark mode");
  if (button) {
    button.setAttribute("aria-label", selected === "dark"
      ? (isSpanish ? "Cambiar a modo claro" : "Switch to light mode")
      : (isSpanish ? "Cambiar a modo oscuro" : "Switch to dark mode"));
    button.setAttribute("aria-pressed", String(selected === "dark"));
  }
  try { localStorage.setItem("site_theme", selected); } catch (_) { /* storage is optional */ }
}

function initCursor() {
  const supportsCustomPointer = window.matchMedia
    && window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
  if (!supportsCustomPointer || document.getElementById("siteCursor")) return;

  const cursor = document.createElement("div");
  cursor.id = "siteCursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="cursor-ring"><span class="cursor-core"></span><span class="cursor-arrow">↗</span></span>';
  document.body.appendChild(cursor);
  document.body.classList.add("custom-pointer");

  function moveCursor(event) {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!target) return;

    cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
    cursor.style.setProperty("--cursor-y", `${event.clientY}px`);

    const region = target.closest("[data-cursor-size]");
    const regionScale = Number(region?.getAttribute("data-cursor-size") || 1);
    const interactive = target.closest("a, button, [role=\"button\"], .research-card, .project-card, .pub-card, .resource-card, .person-card, .home-pub-card, .blog-post, .vault-card, .training-grid article");
    const link = target.closest("a, button, [role=\"button\"]");
    const editing = target.closest("input, textarea, select, [contenteditable=\"true\"]");

    cursor.style.setProperty("--cursor-scale", String(Math.max(.72, Math.min(2.1, regionScale * (interactive ? 1.3 : 1)))));
    cursor.classList.toggle("is-link", Boolean(link));
    cursor.classList.toggle("is-hidden", Boolean(editing));
    cursor.classList.add("is-visible");
  }

  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
  window.addEventListener("blur", () => cursor.classList.remove("is-visible"));
}

function initControls() {
  let savedLanguage = "es";
  try { savedLanguage = localStorage.getItem("site_lang") || "es"; } catch (_) { /* storage is optional */ }
  setLanguage(savedLanguage);
  initCursor();

  document.addEventListener("click", (event) => {
    if (event.target.closest("#langToggle")) {
      const next = document.documentElement.lang === "es" ? "en" : "es";
      setLanguage(next);
      setTheme(document.documentElement.dataset.theme || "light");
    }
    if (event.target.closest("#themeToggle")) {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    }
    const menuButton = event.target.closest("#menuToggle");
    if (menuButton) {
      const nav = document.getElementById("siteNavigation");
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav?.classList.toggle("is-open", !isOpen);
    }
  });
}

// ==========================================
// 4. RESALTAR LA PÁGINA ACTUAL
// ==========================================
function highlightCurrentPage() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPath);
  });
}

// ==========================================
// 5. INICIAR TODO AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = "light";
  let savedLanguage = "es";
  try {
    savedTheme = localStorage.getItem("site_theme") || "light";
    savedLanguage = localStorage.getItem("site_lang") || "es";
  } catch (_) { /* storage is optional */ }
  document.documentElement.dataset.theme = savedTheme;
  document.documentElement.lang = savedLanguage;
  loadComponents().then(() => {
    initControls();
    setTheme(savedTheme);
    highlightCurrentPage();
    window.dispatchEvent(new CustomEvent("site:components-loaded"));
  });
});
