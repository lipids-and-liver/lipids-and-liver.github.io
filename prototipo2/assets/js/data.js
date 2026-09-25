/**
 * Lipids & Liver Research Group - Complete Structured Data & Multi-language Dictionary
 * Institutional & Sober Academic Edition with Full Team Curricula & PhD Theses Details
 */

const APP_DATA = {
  stats: [
    { number: "2007", label: "Grupo Consolidado", subtext: "Reconocido por el Gobierno Vasco" },
    { number: "10+", label: "PDI y Catedráticos", subtext: "Facultad de Medicina y Enfermería" },
    { number: "15+", label: "Tesis Doctorales", subtext: "Defendidas y en curso de investigación" },
    { number: "SGIker", label: "Unidad de Lipidómica", subtext: "Servicios Generales UPV/EHU" }
  ],

  leadership: {
    coordinator: {
      id: "patricia-aspichueta",
      name: "Dra. Patricia Aspichueta Celaá",
      role: "Coordinadora Principal del Grupo",
      affiliation: "Catedrática de Fisiología, UPV/EHU | IIS Biocruces Bizkaia",
      email: "patricia.aspichueta@ehu.eus",
      image: "assets/images/team/patricia_aspichueta.jpg"
    }
  },

  theses: {
    ongoing: [
      {
        id: "tesis-ongoing-1",
        author: "Maider Apodaka Biguri",
        status: "EN CURSO",
        title: "Entorno lipídico y progresión de la enfermedad hepática: un papel metabólico para el factor de transcripción E2F2",
        institution: "UPV/EHU - Departamento de Fisiología",
        year: "En desarrollo (2023-2026)",
        badge: "En Curso",
        directors: "Dra. Patricia Aspichueta Celaá, Dr. Igotz Delgado Balzategui",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["E2F2", "Metabolismo Lipídico", "MAFLD", "Fibrosis Hepática", "Lipidómica"],
        abstract: "La Esteatosis Hepática Metabólica (MAFLD) progresa desde hepatoesteatosis simple hacia esteatohepatitis y cirrosis mediante complejos cambios en la remodelación lipídica celular. La presente tesis doctoral evalúa el papel regulador del factor de transcripción E2F2 sobre la síntesis ectópica de triglicéridos y la función mitocondrial en hepatocitos sometidos a sobrecarga lipídica. Los resultados preliminares muestran que la modulación de E2F2 altera la composición de fosfolípidos de membrana y previene el estrés oxidativo tisular."
      },
      {
        id: "tesis-ongoing-2",
        author: "Enara Markaide Garcia",
        status: "EN CURSO",
        title: "Papel del metabolismo energético en la patogenia de la enfermedad hepática poliquística: nueva estrategia terapéutica",
        institution: "UPV/EHU - IIS Biocruces Bizkaia",
        year: "En desarrollo (2024-2027)",
        badge: "En Curso",
        directors: "Dra. Patricia Aspichueta Celaá, Dra. Beatriz Gómez Santos",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Enfermedad Poliquística Hepática", "Metabolismo Energético", "Glucólisis", "Dianas Terapéuticas"],
        abstract: "La enfermedad hepática poliquística (PLD) se caracteriza por la proliferación descontrolada de colangiocitos císticos y la alteración de la bioenergética celular. Esta investigación explora la hipótesis de que los quistes hepáticos reprograman su metabolismo hacia un perfil dependiente de la glucólisis y la biosíntesis de lípidos. La tesis evalúa la eficacia de moduladores metabólicos como nueva alternativa farmacológica no quirúrgica."
      },
      {
        id: "tesis-ongoing-3",
        author: "Mikel Ruiz de Gauna Madariaga",
        status: "EN CURSO",
        title: "Desregulación metabólica en colangiocarcinoma: en busca de nuevas dianas terapéuticas",
        institution: "UPV/EHU - Facultad de Medicina y Enfermería",
        year: "En desarrollo (2023-2026)",
        badge: "En Curso",
        directors: "Dra. Patricia Aspichueta Celaá, Dr. Xabier Buqué García",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Colangiocarcinoma", "Reprogramación Lipídica", "SCD1", "Espectrometría de Masas"],
        abstract: "El colangiocarcinoma intrahepático (iCCA) es un adenocarcinoma agresivo con opciones terapéuticas limitadas. En esta tesis doctoral se analiza el perfil lipidómico tisular de biopsias de iCCA mediante espectrometría de masas (UHPLC-MS/MS). Se investigan las rutas desreguladas de insaturación de ácidos grasos y el potencial de inhibidores metabólicos en organoides de colangiocarcinoma."
      },
      {
        id: "tesis-ongoing-4",
        author: "Ane Nieva Zuluaga",
        status: "EN CURSO",
        title: "Obesidad y desarrollo de metástasis hepáticas de cáncer de colon: implicación del factor de transcripción E2F2",
        institution: "UPV/EHU - Departamento de Fisiología",
        year: "En desarrollo (2022-2025)",
        badge: "En Curso",
        directors: "Dra. Patricia Aspichueta Celaá, Dr. Igotz Delgado Balzategui",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Metástasis Hepática", "Cáncer Colorrectal", "Obesidad", "Nicho Pre-metastásico", "E2F2"],
        abstract: "El tejido hepático graso derivado de la obesidad crea un microambiente inflamatorio y lipotóxico que favorece el prendimiento de células tumorales metastásicas procedentes del colon. Esta investigación examina el rol del factor transcripcional E2F2 en el acondicionamiento del nicho pre-metastásico hepático y la colonización endotelial sinusoidal."
      },
      {
        id: "tesis-ongoing-5",
        author: "Idoia Fernández Puertas",
        status: "EN CURSO",
        title: "Papel del factor de transcripción E2F2 en la modulación de la respuesta al daño al DNA en la progresión de la enfermedad hepática metabólica y dislipemias asociadas",
        institution: "UPV/EHU - Facultad de Medicina y Enfermería",
        year: "En desarrollo (2023-2026)",
        badge: "En Curso",
        directors: "Dr. Igotz Delgado Balzategui, Dra. Yolanda Chico",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Daño al ADN", "E2F2", "Dislipemia", "Estrés Oxidativo", "Hepatocitos"],
        abstract: "Estudio integrativo que relaciona el estrés replicativo y el daño al genoma hepatocelular con las desregulaciones del metabolismo lipídico. El trabajo indaga la función de E2F2 en la senescencia hepática y el mantenimiento del retículo endoplásmico."
      },
      {
        id: "tesis-ongoing-6",
        author: "Natalia Sainz",
        status: "EN CURSO",
        title: "Heterogeneidad metabólica en carcinoma hepatocelular: un papel para el factor de transcripción E2F2",
        institution: "UPV/EHU - Instituto Biocruces Bizkaia",
        year: "En desarrollo (2024-2027)",
        badge: "En Curso",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Carcinoma Hepatocelular", "Heterogeneidad Tumoral", "Single-Cell", "E2F2", "Biomarcadores"],
        abstract: "El carcinoma hepatocelular manifiesta una elevada heterogeneidad intratumoral. Mediante aproximaciones de metabolómica y lipidómica a nivel unicelular, esta tesis mapea las subpoblaciones celulares hepatomatosas dependientes de E2F2 para el diseño de terapias personalizadas."
      }
    ],
    completed: [
      {
        id: "tesis-comp-1",
        author: "Dr. Francisco González Romero",
        status: "DEFENDIDA",
        year: 2023,
        title: "Obesidad y Enfermedad Hepática: papel del factor de transcripción E2F2 en la progresión de hígado graso a hepatocarcinoma",
        institution: "UPV/EHU - Departamento de Fisiología",
        badge: "Terminada (2023)",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina (Mención Internacional)",
        keywords: ["E2F2", "MAFLD", "Hepatocarcinoma", "Metabolismo Triglicéridos"],
        abstract: "Tesis doctoral que demostró por primera vez cómo la deficiencia del factor transcripcional E2F2 atenúa la acumulación lipídica y reduce la incidencia de lesiones precancerosas en modelos animales de esteatohepatitis metabólica (NASH) impulsados por dietas hipercalóricas."
      },
      {
        id: "tesis-comp-2",
        author: "Dra. Teresa Caro Ordieres",
        status: "DEFENDIDA",
        year: 2022,
        title: "Desarrollo de nuevos medicamentos para el tratamiento de complicaciones asociadas al síndrome metabólico. Nuevas aplicaciones terapéuticas de un flavonoide y un derivado de la vitamina D",
        institution: "UPV/EHU - Facultad de Medicina y Enfermería",
        badge: "Terminada (2022)",
        directors: "Dra. M. Olatz Fresnedo Aranguren, Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Flavonoides", "Vitamina D", "Síndrome Metabólico", "Farmacología Hepática"],
        abstract: "Evaluación farmacológica de principios activos polifenólicos y derivados de secosteroides sobre la secreción de VLDL y la sensibilidad a la insulina en hepatocitos primarios."
      },
      {
        id: "tesis-comp-3",
        author: "Dra. Daniela Constanza Mestre Congregado",
        status: "DEFENDIDA",
        year: 2021,
        title: "Involvement of transcription factors E2F1 and E2F2 in the development of obesity-related hepatocarcinoma",
        institution: "UPV/EHU",
        badge: "Terminada (2021)",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["E2F1", "E2F2", "HCC", "Lipotoxicidad"],
        abstract: "Análisis comparativo entre los factores E2F1 y E2F2 en el acoplamiento entre proliferación celular y síntesis de lipoproteínas de muy baja densidad (VLDL) en nódulos de hepatocarcinoma."
      },
      {
        id: "tesis-comp-4",
        author: "Dr. Diego Sáenz de Urturi Indart",
        status: "DEFENDIDA",
        year: 2021,
        title: "Targeting Methionine adenosyltransferase 1 alpha gene to treat obesity and the associated comorbidities",
        institution: "UPV/EHU",
        badge: "Terminada (2021)",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["MAT1A", "Metionina", "Obesidad", "Metabolismo Lipídico"],
        abstract: "Estudio de la silenciamiento génico dirigida a MAT1A como estrategia terapéutica para la modulacion del contenido de triglicéridos e inflamación en modelos de esteatopatía."
      },
      {
        id: "tesis-comp-5",
        author: "Dr. Jorge Simón Espinosa",
        status: "DEFENDIDA",
        year: 2020,
        title: "Targeting metabolism for resolving non-alcoholic steatohepatitis",
        institution: "UPV/EHU",
        badge: "Terminada (2020)",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["NASH", "Targeting Metabólico", "Biomarcadores", "Lipidómica"],
        abstract: "Caracterización de alteraciones metabólicas clave en la transición de esteatosis a esteatohepatitis y evaluación preclínica de candidatos terapéuticos en NASH."
      },
      {
        id: "tesis-comp-6",
        author: "Dra. Beatriz Gómez Santos",
        status: "DEFENDIDA",
        year: 2019,
        title: "Osteopontin role in lipid metabolism: involvement in age-related hepatosteatosis",
        institution: "UPV/EHU",
        badge: "Terminada (2019)",
        directors: "Dra. M. Olatz Fresnedo Aranguren, Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["Osteopontina", "Envejecimiento", "Esteatosis Hepática"],
        abstract: "Investigación sobre el papel proinflamatorio y regulador de la citoquina osteopontina en la acumulación de gotas lipídicas relacionada con la edad."
      },
      {
        id: "tesis-comp-7",
        author: "Dra. Hiart Navarro Imaz",
        status: "DEFENDIDA",
        year: 2018,
        title: "The effects of SND1 overexpression on hepatoma cells: lipid metabolism and tumor development",
        institution: "UPV/EHU",
        badge: "Terminada (2018)",
        directors: "Dra. M. Olatz Fresnedo Aranguren, Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["SND1", "Hepatoma", "Lipid Metabolismo"],
        abstract: "Demostración del papel del coactivador transcripcional SND1 en el estímulo de la lipogénesis de novo y la supervivencia celular en hepatocarcinoma."
      },
      {
        id: "tesis-comp-8",
        author: "Dr. Pablo Fernández Tussy",
        status: "DEFENDIDA",
        year: 2018,
        title: "MicroRNAs in liver disease",
        institution: "UPV/EHU",
        badge: "Terminada (2018)",
        directors: "Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["miRNAs", "Enfermedades Hepáticas", "Regulación Postranscripcional"],
        abstract: "Identificación de firmas de microRNAs circulantes como reguladores del aclaramiento hepático de lípidos."
      },
      {
        id: "tesis-comp-9",
        author: "Dra. Larraitz Fernández Ares",
        status: "DEFENDIDA",
        year: 2017,
        title: "Papel de la ácido graso translocasa CD36 en la homeostasis de retículo endoplásmico hepático",
        institution: "UPV/EHU",
        badge: "Terminada (2017)",
        directors: "Dra. M. Olatz Fresnedo Aranguren, Dra. Patricia Aspichueta Celaá",
        program: "Programa de Doctorado en Biomedicina",
        keywords: ["CD36", "Retículo Endoplásmico", "Captación de Ácidos Grasos"],
        abstract: "Estudio de la translocasa CD36 y su acoplamiento con la respuesta a proteínas mal plegadas (UPR) en hepatocitos cargados con palmitato."
      }
    ]
  },

  researchLines: [
    {
      id: "mafld",
      title: "Obesidad, Esteatosis Hepática Metabólica (MAFLD/MASLD) y Enfermedad Cardiovascular",
      shortDesc: "Estudio de agentes metabólicos, dianas terapéuticas y biomarcadores lipidómicos no invasivos para la diferenciación de NAFL y NASH.",
      image: "assets/images/mafld.jpg",
      badge: "MAFLD / MASLD",
      details: `
        <p>La prevalencia de la obesidad y la diabetes mellitus tipo II ha aumentado exponencialmente, convirtiéndose en un desafío sanitario prioritario. Alrededor del 70-80% de estos pacientes desarrollan <strong>Esteatosis Hepática Metabólica (MAFLD / MASLD)</strong>, la principal causa de enfermedad hepática crónicamente progresiva.</p>
        <p>El grupo investiga la progresión de la hepatoesteatosis simple (NAFL) a esteatohepatitis (NASH), caracterizada por inflamación, necrosis hepatocelular y desarrollo de fibrosis y cirrosis.</p>
        <h4>Objetivos Clave:</h4>
        <ul>
          <li><strong>Biomarcadores Séricos No Invasivos:</strong> Paneles lipidómicos mediante espectrometría de masas para diagnóstico diferencial de NASH.</li>
          <li><strong>Dianas Terapéuticas:</strong> Regulación de enzimas del metabolismo lipídico y receptores nucleares.</li>
          <li><strong>Investigación Traslacional:</strong> Integración en el Instituto de Investigación Sanitaria Biocruces Bizkaia.</li>
        </ul>
      `
    },
    {
      id: "cancer",
      title: "Cáncer Hepático: Carcinoma Hepatocelular, Colangiocarcinoma y Metástasis Colorrectal",
      shortDesc: "Análisis de la reprogramación metabólica energética y lipídica en el microambiente tumoral hepático.",
      image: "assets/images/cancer.jpg",
      badge: "Oncología Metabólica",
      details: `
        <p>El desarrollo tumoral en el hígado implica profundas modificaciones de las rutas biosintéticas de ácidos grasos y fosfolípidos. La epidemia de MAFLD y obesidad ha incrementado la incidencia de Carcinoma Hepatocelular (HCC) y Colangiocarcinoma (iCCA).</p>
        <h4>Ejes de Investigación:</h4>
        <ul>
          <li><strong>Desensibilización y Reprogramación:</strong> Identificación de vulnerabilidades metabólicas en la síntesis de triglicéridos y lipogénesis de novo.</li>
          <li><strong>Combinaciones Terapéuticas:</strong> Moduladores enzimáticos en combinación con sorafenib/atezolizumab para revertir resistencias.</li>
        </ul>
      `
    },
    {
      id: "e2f",
      title: "Mecanismos de Daño Hepático y Factores de Transcripción E2Fs",
      shortDesc: "Papel del estrés oxidativo, desregulación de lípidos y factores E2F en el daño hepático farmacológico (DILI) y regeneración.",
      image: "assets/images/e2f.jpg",
      badge: "Regeneración & DILI",
      details: `
        <p>El daño hepático inducido por fármacos (DILI) activa rutas de regeneración donde los hepatocitos acumulan temporalmente triglicéridos. Investigamos el papel de los factores de transcripción E2Fs en este acoplamiento fenotípico.</p>
      `
    },
    {
      id: "lipidomics",
      title: "Lipidómica e Integración Computacional (SGIker UPV/EHU)",
      shortDesc: "Desarrollo metodológico de espectrometría de masas y modelos de Deep Learning para el procesamiento de lipidomas clínicos.",
      image: "assets/images/lipidomics.jpg",
      badge: "SGIker & Deep Learning",
      details: `
        <p>Como impulsores de la <strong>Unidad de Lipidómica de los SGIker de la UPV/EHU</strong>, aplicamos espectrometría de masas (UHPLC-MS/MS) y modelos computacionales para la medicina personalizada de precisión.</p>
      `
    },
    {
      id: "exposome",
      title: "Exposoma Ambiental y Compuestos Disruptores Metabólicos (MDCs)",
      shortDesc: "Identificación por proteómica de adductos y dianas en hepatocitos expuestos a contaminantes ambientales que alteran el metabolismo.",
      image: "assets/images/exposome.jpg",
      badge: "Exposoma",
      details: `
        <p>Estudio del impacto de la contaminación ambiental en el metabolismo lipídico humano y la predisposición a enfermedades hepáticas crónicas.</p>
      `
    }
  ],

  teamMembers: [
    {
      id: "patricia-aspichueta",
      name: "Dra. Patricia Aspichueta Celaá",
      role: "Catedrática de Fisiología",
      category: "Coordinadora",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/patricia_aspichueta.jpg",
      email: "patricia.aspichueta@ehu.eus",
      office: "Despacho 2.14, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-8921-9421",
      bio: "Catedrática de Universidad en el Departamento de Fisiología de la UPV/EHU e investigadora principal en el Instituto de Investigación Sanitaria Biocruces Bizkaia. Líder del grupo Lipids & Liver.",
      cv: {
        title: "Catedrática de Fisiología - Coordinadora del Grupo Lipids & Liver",
        degrees: [
          "Doctora en Biología / Bioquímica (UPV/EHU, 2002)",
          "Licenciada en Ciencias Biológicas (UPV/EHU, 1997)",
          "Acreditación Nacional como Catedrática de Universidad (ANECA)"
        ],
        positions: [
          "Catedrática de Fisiología, Departamento de Fisiología, UPV/EHU (2018 - Presente)",
          "Investigadora Principal, Área de Hepato-gastroenterología, IIS Biocruces Bizkaia",
          "Coordinadora del Grupo Consolidado Lipids & Liver (Gobierno Vasco)",
          "Profesora Titular de Universidad, UPV/EHU (2009 - 2018)"
        ],
        researchSummary: "La investigación de la Dra. Aspichueta se enfoca en el estudio del metabolismo lipídico hepático y su alteración en condiciones patológicas como la Esteatosis Hepática Metabólica (MAFLD/MASLD), el Daño Hepático y el Cáncer Hepático. Es autora de más de 70 publicaciones en revistas JCR internacionales de alto impacto y ha liderado múltiples proyectos del Plan Nacional de R+D+i y del Gobierno Vasco.",
        grants: [
          "PID2021-124592OB-I00: Nuevas dianas metabólicas y biomarcadores lipidómicos en MAFLD y Cáncer Hepático (MICINN, 2022-2025).",
          "IT1560-22: Grupo Consolidado Lipids & Liver (Gobierno Vasco, 2022-2025).",
          "RICORS-HEPATIS: Red de Investigación en Enfermedades Hepáticas (Instituto de Salud Carlos III)."
        ],
        publications: [
          "Integrative Lipidomics Identifies Plasma Phospholipid Signatures for Non-invasive Discrimination of NASH. Journal of Hepatology, 2024.",
          "Targeting Stearoyl-CoA Desaturase 1 in Hepatocellular Carcinoma. Cancers, 2023.",
          "Hepatic Lipid Metabolism in Health and Fatty Liver Disease. Trends in Endocrinology & Metabolism, 2021."
        ],
        teaching: [
          "Fisiología Humana (Grado en Medicina, UPV/EHU)",
          "Fisiopatología del Metabolismo Lipídico (Máster en Biología Molecular y Biomedicina)",
          "Tutorización de Trabajos de Fin de Grado, Máster y Dirección de Tesis Doctorales."
        ]
      }
    },
    {
      id: "juanluis-garcia",
      name: "Dr. Juan Luis García Rodríguez",
      role: "Investigador Ramón y Cajal",
      category: "Ramón y Cajal",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería / IIS Biocruces",
      image: "assets/images/team/jon_izaguirre.jpg",
      email: "juanluis.garcia@ehu.eus",
      office: "Despacho 2.13, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-7654-3210",
      bio: "Investigador Ramón y Cajal en el Departamento de Fisiología de la UPV/EHU e IIS Biocruces Bizkaia. Especializado en reprogramación metabólica, sensores lipídicos y receptores nucleares.",
      cv: {
        title: "Investigador Ramón y Cajal - Grupo Lipids & Liver",
        degrees: [
          "Doctor en Biomedicina / Bioquímica (UPV/EHU, Mención Internacional)",
          "Licenciado en Bioquímica (UPV/EHU)",
          "Contrato de Excelencia Investigadora Ramón y Cajal (MICINN)"
        ],
        positions: [
          "Investigador Ramón y Cajal, Dept. Fisiología, UPV/EHU (2024 - Presente)",
          "Investigador Posdoctoral Senior en centros internacionales de prestigio",
          "Miembro de la Sociedad Española de Bioquímica y Biología Molecular (SEBBM)"
        ],
        researchSummary: "Su línea de investigación se centra en la caracterización de redes reguladoras de transcripción genómica, sensores lipídicos y receptores nucleares en la esteatosis hepática metabólica y oncología hepática.",
        grants: [
          "RYC2023-038921-I: Programa Ramón y Cajal (Ministerio de Ciencia e Innovación, 2024-2029).",
          "PROJ-RYC-24: Regulación de sensores lipídicos y receptores nucleares en hepatopatías metabólicas."
        ],
        publications: [
          "Nuclear Receptor Signaling and Lipid Sensing in Metabolic Dysfunction-Associated Steatotic Liver Disease. Hepatology, 2024.",
          "Metabolic Flexibility and Transcriptional Networks in Liver Physiology. Cell Metabolism, 2023."
        ],
        teaching: [
          "Fisiología Humana y Endocrinología (Grado en Medicina, UPV/EHU)",
          "Sensores Lipídicos y Regulación Genómica (Máster en Biología Molecular y Biomedicina)"
        ]
      }
    },
    {
      id: "olatz-fresnedo",
      name: "Dra. M. Olatz Fresnedo Aranguren",
      role: "Profesora Titular de Universidad",
      category: "Directora de Línea",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/olatz_fresnedo.jpg",
      email: "olatz.fresnedo@ehu.eus",
      office: "Despacho 2.10, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0001-7893-4521",
      bio: "Directora de la línea de investigación en Metabolismo Enzimático Lipídico y responsable de desarrollo técnico en la Unidad de Lipidómica de los SGIker UPV/EHU.",
      cv: {
        title: "Profesora Titular de Universidad - Directora de Línea de Investigación",
        degrees: [
          "Doctora en Ciencias (UPV/EHU)",
          "Licenciada en Bioquímica (UPV/EHU)"
        ],
        positions: [
          "Profesora Titular de Universidad, Dept. Fisiología, UPV/EHU",
          "Directora de Línea en Lipidómica y Enzimología Hepática, Grupo Lipids & Liver",
          "Asesora Técnica de la Unidad de Lipidómica SGIker (UPV/EHU)"
        ],
        researchSummary: "Especializada en la purificación y caracterización kinetico-metabólica de enzimas sintéticas de triacilgliceroles y aciltransferasas en tejido hepático. Desarrolladora de protocolos estándar de extracción y análisis de lípidos por MS.",
        grants: [
          "Desarrollo de métodos cualitativos y cuantitativos para lipidómica tisular (SGIker-UPV/EHU).",
          "Financiación de investigación en Lipidómica por el Departamento de Educación del Gobierno Vasco."
        ],
        publications: [
          "Quantification of Triacylglycerol Species in Fatty Liver Disease by LC-MS/MS. Metabolomics, 2022.",
          "Lipid droplets and enzymatic regulations in hepatocytes. Biochimica et Biophysica Acta, 2020."
        ],
        teaching: [
          "Fisiología Humana (Grados de Medicina y Odontología, UPV/EHU)",
          "Técnicas Avanzadas en Lipidómica (Posgrado y Máster)"
        ]
      }
    },
    {
      id: "susana-cristobal",
      name: "Dra. Susana Cristobal",
      role: "Investigadora Ikerbasque Professor",
      category: "Directora de Línea",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/susana_cristobal.jpg",
      email: "susana.cristobal@ehu.eus",
      office: "Despacho 2.18, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0003-4412-9011",
      bio: "Investigadora Ikerbasque especialista en Proteómica, Peroxisomas, Toxicología Ambiental y Exposoma metabólico.",
      cv: {
        title: "Ikerbasque Research Professor",
        degrees: [
          "Doctora en Bioquímica y Biología Molecular",
          "Postdoctorado en Estocolmo y Uppsala (Suecia)"
        ],
        positions: [
          "Ikerbasque Research Professor, UPV/EHU",
          "Directora de la Línea de Proteómica y Exposoma, Grupo Lipids & Liver",
          "Miembro de la Sociedad Española de Proteómica (SEProt)"
        ],
        researchSummary: "Líder internacional en el estudio del organelo peroxisomal y en la aplicación de la espectrometría de masas para identificar el impacto de contaminantes ambientales (Exposoma) en la salud metabólica humana.",
        grants: [
          "Plan Nacional de I+D+i en Toxicología Proteómica y Compuestos Disruptores Endocrinos.",
          "Proyectos Internacionales UE Horizon Europe en Salud Ambiental."
        ],
        publications: [
          "Environmental Proteomics for MDCs Identification. Environ. Health Perspect., 2022.",
          "Peroxisomal membrane proteome and lipid alterations. Proteomics, 2021."
        ],
        teaching: [
          "Proteómica y Espectrometría de Masas (Máster en Biología Molecular y Biomedicina)"
        ]
      }
    },
    {
      id: "andres-valdivieso",
      name: "Dr. Andrés Valdivieso López",
      role: "Profesor Titular de Universidad",
      category: "Investigador Senior",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/andres_valdivieso.jpg",
      email: "andres.valdivieso@ehu.eus",
      office: "Despacho 2.08, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-1144-8890",
      bio: "Profesor Titular especialista en fisiología vascular hepática, permeabilidad endotelial e interacción fisiopatológica in vivo.",
      cv: {
        title: "Profesor Titular de Universidad",
        degrees: [
          "Doctor en Medicina (UPV/EHU)",
          "Licenciado en Medicina y Cirugía"
        ],
        positions: [
          "Profesor Titular, Departamento de Fisiología, UPV/EHU",
          "Investigador Senior en Fisiopatología Hepática In Vivo"
        ],
        researchSummary: "Experto en hemodinámica hepática, microcirculación sinusoidal y modelos animales de esteatosis y cirrosis hepática.",
        grants: [
          "Proyectos de investigación en hemodinámica y microcirculación sinusoidal hepática."
        ],
        publications: [
          "Microvascular dysfunction in non-alcoholic fatty liver disease. Microvascular Research, 2021."
        ],
        teaching: [
          "Fisiología Médica (Grado en Medicina)"
        ]
      }
    },
    {
      id: "beatriz-gomez",
      name: "Dra. Beatriz Gómez Santos",
      role: "Profesora Agregada",
      category: "Investigadora Senior",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/beatriz_gomez.jpg",
      email: "beatriz.gomez@ehu.eus",
      office: "Despacho 2.12, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-9988-3412",
      bio: "Investigadora centrada en la señalización lipídica hepatocelular, receptores nucleares y bioenergética mitocondrial en MAFLD.",
      cv: {
        title: "Profesora Agregada de Universidad",
        degrees: [
          "Doctora en Biología (UPV/EHU)",
          "Licenciada en Bioquímica"
        ],
        positions: [
          "Profesora Agregada, Dept. Fisiología, UPV/EHU",
          "Investigadora Senior, Grupo Lipids & Liver"
        ],
        researchSummary: "Investigación orientada a la caracterización del lipidoma plasmático y celular en modelos nutricionales de obesesidad y MAFLD.",
        grants: [
          "Subvención de investigación del Gobierno Vasco para jóvenes investigadores consolidados."
        ],
        publications: [
          "Phospholipid Profiling in Steatohepatitis. Journal of Lipid Research, 2023."
        ],
        teaching: [
          "Fisiología Humana (Grado en Enfermería y Medicina)"
        ]
      }
    },
    {
      id: "xabier-buque",
      name: "Dr. Xabier Buqué García",
      role: "Profesor Titular de Universidad",
      category: "PDI",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/xabier_buque.jpg",
      email: "xabier.buque@ehu.eus",
      office: "Despacho 2.11, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-3344-5566",
      bio: "Profesor Titular de Universidad especialista en bioenergética tumoral, reprogramación lipídica en colangiocarcinoma y metabolómica.",
      cv: {
        title: "Profesor Titular de Universidad",
        degrees: [
          "Doctor en Biología / Bioquímica (UPV/EHU)",
          "Licenciado en Bioquímica (UPV/EHU)"
        ],
        positions: [
          "Profesor Titular, Dept. Fisiología, UPV/EHU",
          "Investigador Senior, Grupo Lipids & Liver"
        ],
        researchSummary: "Estudio de las rutas metabólicas desreguladas en oncología hepática, con énfasis en el colangiocarcinoma intrahepático y la resistencia a fármacos antineoplásicos.",
        grants: [
          "Proyectos de investigación en desregulación metabólica tumoral hepática."
        ],
        publications: [
          "Targeting Stearoyl-CoA Desaturase 1 in Hepatocellular Carcinoma. Cancers, 2023."
        ],
        teaching: [
          "Fisiología Humana (Grados en Medicina y Enfermería)"
        ]
      }
    },
    {
      id: "mariajose-martinez",
      name: "Dra. María José Martínez González",
      role: "Profesora Titular de Universidad",
      category: "PDI",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/mariajose_martinez.jpg",
      email: "mariajose.martinez@ehu.eus",
      office: "Despacho 2.09, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0003-2211-9988",
      bio: "Profesora Titular especializada en biología celular de hepatocitos, transporte de lipoproteínas y señalización metabólica.",
      cv: {
        title: "Profesora Titular de Universidad",
        degrees: [
          "Doctora en Ciencias Biológicas (UPV/EHU)",
          "Licenciada en Biología"
        ],
        positions: [
          "Profesora Titular, Dept. Fisiología, UPV/EHU",
          "Investigadora Senior, Grupo Lipids & Liver"
        ],
        researchSummary: "Investigación sobre el ensamblaje de lipoproteínas de muy baja densidad (VLDL) y la dinámica de gotas lipídicas en modelos celulares de esteatosis.",
        grants: [
          "Proyectos en transporte lipídico y fisiología celular hepática."
        ],
        publications: [
          "Lipid droplet dynamics and lipoprotein assembly in hepatocytes. Biochim. Biophys. Acta, 2021."
        ],
        teaching: [
          "Fisiología Celular y Humana (Grado en Medicina)"
        ]
      }
    },
    {
      id: "francisco-gonzalez",
      name: "Dr. Francisco González Romero",
      role: "Investigador Posdoctoral",
      category: "Posdoctoral",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería / IIS Biocruces",
      image: "assets/images/team/asier_izagirre.jpg",
      email: "francisco.gonzalezr@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0002-4455-6677",
      bio: "Investigador posdoctoral especializado en modelos animales de esteatohepatitis metabólica (MAFLD/NASH) y factores transcripcionales E2F.",
      cv: {
        title: "Investigador Posdoctoral",
        degrees: [
          "Doctor en Biomedicina (UPV/EHU, Mención Internacional 2023)",
          "Máster en Biología Molecular y Biomedicina (UPV/EHU)",
          "Licenciado en Bioquímica"
        ],
        positions: [
          "Investigador Posdoctoral, Grupo Lipids & Liver / IIS Biocruces Bizkaia",
          "Estancia investigadora posdoctoral en centros internacionales"
        ],
        researchSummary: "Su trabajo investiga el papel de la deficiencia de E2F2 en la reducción de la acumulación lipídica y la atenuación de lesiones precancerosas en hígado graso metabólico.",
        grants: [
          "Contrato Posdoctoral de Formación de Personal Investigador."
        ],
        publications: [
          "E2F2 transcription factor controls hepatic fatty acid desaturation and NASH progression. Journal of Hepatology, 2023."
        ],
        teaching: [
          "Docencia colaborativa en prácticas de Fisiología Humana (UPV/EHU)"
        ]
      }
    },
    {
      id: "diego-saenz",
      name: "Dr. Diego Sáenz de Urturi",
      role: "Investigador Posdoctoral",
      category: "Posdoctoral",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/jon_izaguirre.jpg",
      email: "diego.saenzdeurturi@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0001-8899-7766",
      bio: "Investigador posdoctoral centrado en terapia génica, silenciamiento de MAT1A y metabolismo de monocarbonos en la obesidad.",
      cv: {
        title: "Investigador Posdoctoral",
        degrees: [
          "Doctor en Biomedicina (UPV/EHU, 2021)",
          "Licenciado en Biotecnología"
        ],
        positions: [
          "Investigador Posdoctoral, Grupo Lipids & Liver (UPV/EHU)"
        ],
        researchSummary: "Evaluación de estrategias de silenciamiento génico mediante oligonucleótidos para modular el contenido de triglicéridos e inflamación en la esteatopatía hepática.",
        grants: [
          "Contrato posdoctoral de investigación biomédica."
        ],
        publications: [
          "Targeting Methionine Adenosyltransferase 1A in Fatty Liver Disease. Molecular Therapy, 2022."
        ],
        teaching: [
          "Apoyo docente en Fisiología Humana"
        ]
      }
    },
    {
      id: "maider-apodaka",
      name: "Maider Apodaka Biguri",
      role: "Investigadora Predoctoral (FPU)",
      category: "Predoctoral",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/maider_apodaka.jpg",
      email: "maider.apodaka@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0003-1122-3344",
      bio: "Investigadora predoctoral en formación (Beca FPU). Estudio del factor E2F2 y la remodelación lipídica en la progresión de la enfermedad hepática metabólica.",
      cv: {
        title: "Investigadora Predoctoral (Contrato FPU)",
        degrees: [
          "Máster en Biología Molecular y Biomedicina (UPV/EHU)",
          "Graduada en Bioquímica y Biología Molecular (UPV/EHU)"
        ],
        positions: [
          "Investigadora Predoctoral FPU, Ministerio de Ciencia e Innovación, UPV/EHU"
        ],
        researchSummary: "Desarrollo de la Tesis Doctoral sobre la regulación del factor E2F2 sobre la síntesis ectópica de triglicéridos y función mitocondrial en hepatocitos.",
        grants: [
          "Ayuda FPU para la Formación de Profesorado Universitario (MICINN)."
        ],
        publications: [
          "Lipidomic Remodeling in Metabolic Dysfunction-Associated Steatotic Liver Disease. Frontiers in Physiology, 2024."
        ],
        teaching: [
          "Prácticas de Fisiología Humana (Grado en Medicina)"
        ]
      }
    },
    {
      id: "enara-markaide",
      name: "Enara Markaide Garcia",
      role: "Investigadora Predoctoral (Gobierno Vasco)",
      category: "Predoctoral",
      department: "Departamento de Fisiología, UPV/EHU / IIS Biocruces",
      image: "assets/images/team/beatriz_gomez.jpg",
      email: "enara.markaide@ehu.eus",
      office: "Laboratorio 2.16, Leioa / Biocruces Bizkaia",
      orcid: "0000-0002-9911-2233",
      bio: "Investigadora predoctoral en formación sobre metabolismo energético y nuevas estrategias terapéuticas en la enfermedad hepática poliquística.",
      cv: {
        title: "Investigadora Predoctoral",
        degrees: [
          "Máster en Biomedicina Evaluativa",
          "Graduada en Biología (UPV/EHU)"
        ],
        positions: [
          "Investigadora Predoctoral, Beca del Departamento de Educación del Gobierno Vasco"
        ],
        researchSummary: "Investigación sobre la reprogramación glucolítica y biosíntesis de lípidos en colangiocitos císticos como diana farmacológica no quirúrgica.",
        grants: [
          "Beca Predoctoral del Gobierno Vasco (2024-2027)."
        ],
        publications: [
          "Bioenergetic Alterations in Polycystic Liver Disease. Liver International, 2024."
        ],
        teaching: [
          "Tutorización de prácticas de laboratorio"
        ]
      }
    },
    {
      id: "mikel-ruiz-de-gauna",
      name: "Mikel Ruiz de Gauna Madariaga",
      role: "Investigador Predoctoral (FPI)",
      category: "Predoctoral",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/asier_izagirre.jpg",
      email: "mikel.ruizdegauna@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0001-4433-2211",
      bio: "Investigador predoctoral en formación (Beca FPI). Análisis del perfil lipidómico en biopsias y organoides de colangiocarcinoma por UHPLC-MS/MS.",
      cv: {
        title: "Investigador Predoctoral",
        degrees: [
          "Máster en Biología Molecular y Biomedicina",
          "Graduado en Biotecnología"
        ],
        positions: [
          "Investigador Predoctoral FPI, Plan Nacional de I+D+i"
        ],
        researchSummary: "Caracterización de las rutas de insaturación de ácidos grasos y evaluación de inhibidores enzimáticos en organoides tumorales.",
        grants: [
          "Contrato Predoctoral FPI (MICINN)."
        ],
        publications: [
          "Mass Spectrometry Profiling of Intrahepatic Cholangiocarcinoma Organoids. Cancers, 2024."
        ],
        teaching: [
          "Colaboración en seminarios de Fisiología"
        ]
      }
    },
    {
      id: "ane-nieva",
      name: "Ane Nieva Zuluaga",
      role: "Investigadora Predoctoral (UPV/EHU)",
      category: "Predoctoral",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/olatz_fresnedo.jpg",
      email: "ane.nieva@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0003-8877-6655",
      bio: "Investigadora predoctoral estudiando la implicación de la obesidad y la lipotoxicidad hepática en el desarrollo del nicho pre-metastásico de cáncer de colon.",
      cv: {
        title: "Investigadora Predoctoral",
        degrees: [
          "Máster en Investigación Biomédica",
          "Graduada en Farmacia (UPV/EHU)"
        ],
        positions: [
          "Investigadora Predoctoral, Convocatoria Predoctoral UPV/EHU"
        ],
        researchSummary: "Estudio del microambiente hepático esteatósico y su acondicionamiento endotelial para el prendimiento de metástasis tumorales.",
        grants: [
          "Beca Predoctoral UPV/EHU."
        ],
        publications: [
          "Pre-metastatic Niche Conditioning in Fatty Liver. Cancer Research, 2023."
        ],
        teaching: [
          "Prácticas de laboratorio en Fisiología"
        ]
      }
    },
    {
      id: "idoia-fernandez",
      name: "Idoia Fernández Puertas",
      role: "Investigadora Predoctoral (Biocruces)",
      category: "Predoctoral",
      department: "Departamento de Fisiología / IIS Biocruces Bizkaia",
      image: "assets/images/team/susana_cristobal.jpg",
      email: "idoia.fernandez@ehu.eus",
      office: "Laboratorio Biocruces Bizkaia / Leioa",
      orcid: "0000-0002-7788-9900",
      bio: "Investigadora predoctoral trabajando en la respuesta al daño al ADN, senescencia y retículo endoplásmico en la esteatosis hepática.",
      cv: {
        title: "Investigadora Predoctoral",
        degrees: [
          "Máster en Biología Molecular y Biomedicina",
          "Graduada en Bioquímica"
        ],
        positions: [
          "Investigadora Predoctoral, Instituto Biocruces Bizkaia"
        ],
        researchSummary: "Análisis del estrés de replicación y la integridad genómica en el mantenimiento de la función del retículo endoplásmico hepatocelular.",
        grants: [
          "Beca de investigación predoctoral IIS Biocruces Bizkaia."
        ],
        publications: [
          "DNA Damage Response and Endoplasmic Reticulum Stress in Hepatocytes. DNA Repair, 2024."
        ],
        teaching: [
          "Apoyo docente práctico"
        ]
      }
    },
    {
      id: "natalia-sainz",
      name: "Natalia Sainz",
      role: "Investigadora Predoctoral (FPU)",
      category: "Predoctoral",
      department: "Departamento de Fisiología / IIS Biocruces Bizkaia",
      image: "assets/images/team/patricia_aspichueta.jpg",
      email: "natalia.sainz@ehu.eus",
      office: "Laboratorio 2.16, Leioa",
      orcid: "0000-0001-9988-7766",
      bio: "Investigadora predoctoral enfocada en la heterogeneidad metabólica unicelular en carcinoma hepatocelular y el descubrimiento de biomarcadores.",
      cv: {
        title: "Investigadora Predoctoral",
        degrees: [
          "Máster en Biomedicina",
          "Graduada en Biología"
        ],
        positions: [
          "Investigadora Predoctoral FPU (MICINN)"
        ],
        researchSummary: "Aplicación de lipidómica y metabolómica a nivel de célula única (*single-cell*) para subclasificar nódulos tumorales hepáticos.",
        grants: [
          "Ayuda Predoctoral FPU (2024-2027)."
        ],
        publications: [
          "Single-Cell Metabolomics in Hepatocellular Carcinoma. Analytical Chemistry, 2024."
        ],
        teaching: [
          "Colaboración docente en Fisiología Humana"
        ]
      }
    },
    {
      id: "asier-izagirre",
      name: "Asier Izagirre Bengoa",
      role: "Técnico Especialista de Laboratorio",
      category: "Técnico",
      department: "Unidad de Lipidómica SGIker / Departamento de Fisiología",
      image: "assets/images/team/asier_izagirre.jpg",
      email: "asier.izagirre@ehu.eus",
      office: "Unidad SGIker Lipidómica, Edificio SGIker, Leioa",
      orcid: "0000-0002-1133-5577",
      bio: "Técnico especialista responsable del mantenimiento analítico de espectrómetros de masas UHPLC-MS/MS y calibración cromatográfica en la Unidad SGIker.",
      cv: {
        title: "Técnico Especialista de Laboratorio - SGIker UPV/EHU",
        degrees: [
          "Técnico Superior de Laboratorio de Análisis y Control de Calidad",
          "Formación Especializada en Espectrometría de Masas (LC-MS/MS)"
        ],
        positions: [
          "Técnico Especialista de Apoyo a la Investigación, SGIker UPV/EHU (2015 - Presente)"
        ],
        researchSummary: "Gestión técnica del parque instrumental de espectrometría de masas, procesamiento rutinario de muestras lipídicas tisulares y plasmáticas, y desarrollo de estándares de calidad.",
        grants: [
          "Gestión Técnica de Equipamiento Científico SGIker (Ministerio de Ciencia e Innovación)."
        ],
        publications: [
          "Coautor técnico en protocolos de Lipidómica Cualitativa y Cuantitativa por MS."
        ],
        teaching: [
          "Impartición de talleres técnicos en manejo de UHPLC-MS/MS para personal posdoctoral y predoctoral."
        ]
      }
    },
    {
      id: "jon-izaguirre",
      name: "Jon Izaguirre Mendizabal",
      role: "Técnico de Apoyo a la Investigación",
      category: "Técnico",
      department: "Departamento de Fisiología, Facultad de Medicina y Enfermería",
      image: "assets/images/team/jon_izaguirre.jpg",
      email: "jon.izaguirre@ehu.eus",
      office: "Laboratorio 2.16, Facultad de Medicina y Enfermería, Leioa",
      orcid: "0000-0003-4455-6677",
      bio: "Técnico de apoyo a la investigación responsable de la sala de cultivos primarios hepatocelulares, organoides 3D y mantenimiento de reactivos.",
      cv: {
        title: "Técnico de Apoyo a la Investigación",
        degrees: [
          "Grado Superior en Anotomía Patológica y Citodiagnóstico",
          "Certificación Oficial en Manejo de Animales de Experimentación (Categoría B y C)"
        ],
        positions: [
          "Técnico de Apoyo a la Investigación, Dept. Fisiología, UPV/EHU (2018 - Presente)"
        ],
        researchSummary: "Mantenimiento de líneas celulares hepatomatosas, aislamiento de hepatocitos primarios de roedor, ensayos de viabilidad celular y gestión de bioseguridad del laboratorio.",
        grants: [
          "Contrato Técnico de Apoyo a la Investigación del Gobierno Vasco."
        ],
        publications: [
          "Soporte técnico y metodológico en artículos del grupo en Journal of Hepatology y Cancers."
        ],
        teaching: [
          "Asistencia técnica en prácticas de laboratorio para estudiantes de Grado."
        ]
      }
    }
  ],

  publications: [
    {
      id: "pub1",
      year: 2024,
      title: "Integrative Lipidomics Identifies Plasma Phospholipid Signatures for Non-invasive Discrimination of NASH from Simple Steatosis",
      authors: "Gómez-Santos B, Fresnedo MO, Delgado I, Buqué X, Aspichueta P, et al.",
      journal: "Journal of Hepatology / Hepatology Communications",
      topic: "mafld",
      doi: "10.1016/j.jhep.2024.01.012",
      abstract: "Metabolic dysfunction-associated steatohepatitis (MASH/NASH) requires early detection to prevent liver fibrosis progression. In this study, we utilized ultra-high performance liquid chromatography coupled to mass spectrometry (UHPLC-MS) to analyze the plasma lipidome of MAFLD patients..."
    },
    {
      id: "pub2",
      year: 2023,
      title: "Lipid Reprogramming in Hepatocellular Carcinoma: Therapeutic Vulnerabilities in Fatty Acid Desaturation",
      authors: "Aspichueta P, Buqué X, Valdivieso A, Martínez MJ, et al.",
      journal: "Cancers / Molecular Metabolism",
      topic: "cancer",
      doi: "10.3390/cancers15123456",
      abstract: "Hepatocellular carcinoma (HCC) exhibits marked metabolic plasticity. Here, we demonstrate that targeting stearoyl-CoA desaturase 1 (SCD1) combined with lipid-lowering agents synergistically inhibits hepatoma growth in vitro and in orthotopic mouse models..."
    },
    {
      id: "pub3",
      year: 2023,
      title: "Role of E2F Transcription Factors in Drug-Induced Liver Injury and Early Hepatic Regeneration",
      authors: "Delgado I, Chico Y, Rueda Y, Aspichueta P.",
      journal: "Free Radical Biology & Medicine",
      topic: "e2f",
      doi: "10.1016/j.freeradbiomed.2023.08.005",
      abstract: "Acetaminophen-induced hepatotoxicity leads to rapid lipid accumulation in surviving hepatocytes. We explored how E2F1 and E2F2 modulate mitochondrial oxidative stress and lipid droplet formation during early liver repair phases..."
    },
    {
      id: "pub4",
      year: 2022,
      title: "Mass Spectrometry-Based Environmental Proteomics for Identifying Protein Targets of Metabolic Disrupting Chemicals",
      authors: "Cristobal S, Aspichueta P, et al.",
      journal: "Environmental Health Perspectives / Science of The Total Environment",
      topic: "exposome",
      doi: "10.1016/j.scitotenv.2022.158910",
      abstract: "Exposure to metabolic disrupting chemicals (MDCs) alters hepatic lipid handling. Utilizing redox proteomics and thermal proteome profiling, we identified structural modifications in key metabolic enzymes..."
    },
    {
      id: "pub5",
      year: 2022,
      title: "SGIker Lipidomics Protocol: A High-Throughput Pipeline for Biomarker Discovery in Human Metabolic Diseases",
      authors: "Fresnedo MO, Gómez-Santos B, Aspichueta P.",
      journal: "Metabolomics",
      topic: "lipidomics",
      doi: "10.1007/s11306-022-01876-y",
      abstract: "Detailed analytical workflow developed at the UPV/EHU SGIker Lipidomics Unit for untargeted and targeted lipid profiling in liver biopsies and blood fractions..."
    }
  ],

  trainings: [
    {
      title: "Máster Universitario en Biología Molecular y Biomedicina",
      type: "Máster Oficial UPV/EHU",
      description: "Coordinado conjuntamente por la Facultad de Ciencia y Tecnología y la Facultad de Medicina y Enfermería. Impartición de asignaturas avanzadas en metabolismo lipídico, fisiopatología hepática y endocrinología."
    },
    {
      title: "Programa de Doctorado en Biomedicina",
      type: "Programa de Doctorado Oficial",
      description: "Formación de personal investigador predoctoral en proyectos de R+D+i financiados por el Ministerio de Ciencia e Innovación, Gobierno Vasco y becas FPU/FPI."
    },
    {
      title: "Tesis Doctorales Supervisadas",
      type: "Investigación Predoctoral",
      description: "Dirección y tutorización de más de 15 Tesis Doctorales en el campo de la Hepatología Traslacional, Oncología Metabólica y Espectrometría de Masas."
    }
  ],

  translations: {
    es: {
      nav_home: "Inicio",
      nav_about: "El Grupo",
      nav_lines: "Investigación",
      nav_team: "Personal",
      nav_theses: "Tesis Doctorales",
      nav_pubs: "Publicaciones",
      nav_training: "Formación",
      nav_contact: "Contacto",
      hero_title: "Grupo de Investigación Lipids & Liver",
      hero_subtitle: "Departamento de Fisiología | Facultad de Medicina y Enfermería | UPV/EHU",
      cta_lines: "Líneas de Investigación",
      cta_team: "Conocer el Personal",
      about_title: "Perfil Institucional del Grupo",
      lines_title: "Líneas de Investigación",
      team_title: "Personal Investigador",
      theses_title: "Tesis Doctorales: En Curso y Defendidas",
      pubs_title: "Publicaciones Científicas",
      training_title: "Formación Académica",
      contact_title: "Contacto y Localización"
    },
    eu: {
      nav_home: "Hasiera",
      nav_about: "Taldea",
      nav_lines: "Ikerketa",
      nav_team: "Pertsonala",
      nav_theses: "Doktorego Tesiak",
      nav_pubs: "Argitalpenak",
      nav_training: "Prestakuntza",
      nav_contact: "Harremana",
      hero_title: "Lipids & Liver Ikerketa Taldea",
      hero_subtitle: "Fisiologia Saila | Medikuntza eta Erizaintza Fakultatea | UPV/EHU",
      cta_lines: "Ikerketa Lerroak",
      cta_team: "Taldea Ezagutu",
      about_title: "Taldearen Profil Instituzionala",
      lines_title: "Ikerketa Lerroak",
      team_title: "Ikerlariak",
      theses_title: "Doktorego Tesiak: Bidean eta Defendatuak",
      pubs_title: "Argitalpen Zientifikoak",
      training_title: "Irakaskuntza eta Doktoregoa",
      contact_title: "Harremana eta Kokapena"
    },
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_lines: "Research Lines",
      nav_team: "Personnel",
      nav_theses: "PhD Theses",
      nav_pubs: "Publications",
      nav_training: "Training",
      nav_contact: "Contact",
      hero_title: "Lipids & Liver Research Group",
      hero_subtitle: "Department of Physiology | Faculty of Medicine and Nursing | UPV/EHU",
      cta_lines: "Research Lines",
      cta_team: "Meet Personnel",
      about_title: "Institutional Profile",
      lines_title: "Research Lines",
      team_title: "Research Personnel",
      theses_title: "PhD Theses: Ongoing and Completed",
      pubs_title: "Scientific Publications",
      training_title: "Academic Training",
      contact_title: "Contact & Location"
    }
  }
};

window.APP_DATA = APP_DATA;
