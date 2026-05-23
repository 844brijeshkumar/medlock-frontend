import React, { useState, useEffect, useRef } from 'react';

const marqueeStyles = `
  .marquee-container { 
    width: 90%;
    max-width: 1200px; 
    margin: 0 auto; 
    overflow: hidden;
    background: linear-gradient(135deg, #e0f2f7 0%, #b2dfdb 50%, #e0f2f7 100%);
    padding: 12px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(15, 118, 110, 0.1);
    border-bottom: 1px solid rgba(15, 118, 110, 0.1);
    border-radius:10px;
  }

  .marquee-content { 
    display: inline-block;
    padding-left: 100%;
    animation-name: marquee;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-text {
    font-size: 1.1rem;
    color: #0f766e;
    font-weight: 600;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .loading-text {
    font-style: italic;
    color: #14b8a6;
    padding-left: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
  
  @media (max-width: 768px) {
    .marquee-container {
      width: 95%;
    }
    .marquee-text, .loading-text {
      font-size: 0.95rem;
    }
  }
`;

const MedicalFactMarquee = () => {
  const [fact, setFact] = useState("Loading medical fact...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const speed = 80;
      const width = contentRef.current.offsetWidth;
      const duration = width / speed;
      contentRef.current.style.animationDuration = `${Math.max(duration, 15)}s`;
    }
  }, [fact, isLoading, error]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = marqueeStyles;
    document.head.appendChild(styleSheet);
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  useEffect(() => {
    const fetchMedicalFact = async () => {
      setIsLoading(true);
      setError(null);

      const medicalTopics = [
        { topic: 'Coronary Artery Disease', emoji: '💓' },
        { topic: 'Type 2 Diabetes', emoji: '🩸' },
        { topic: 'Hypertension', emoji: '🩺' },
        { topic: 'Asthma', emoji: '🫁' },
        { topic: 'Osteoarthritis', emoji: '🦴' },
        { topic: 'Anxiety Disorder', emoji: '🧠' },
        { topic: 'Migraine', emoji: '🤕' },
        { topic: 'Gastroesophageal reflux disease', emoji: '🔥' },
        { topic: 'Chronic Kidney Disease', emoji: '💧' },
        { topic: 'Allergic Rhinitis', emoji: '🤧' },
        { topic: 'Anemia', emoji: '💉' },
        { topic: 'High Cholesterol', emoji: '🍔' },
        { topic: 'Hypothyroidism', emoji: '🦋' },
        { topic: 'Osteoporosis', emoji: '💪' },
        { topic: 'Sleep Apnea', emoji: '😴' },
        { topic: 'Major Depressive Disorder', emoji: '☁️' },
        { topic: 'Psoriasis', emoji: '✋' },
        { topic: 'Celiac Disease', emoji: '🍞' },
        { topic: 'Crohn\'s Disease', emoji: '🤢' },
        { topic: 'Ulcerative Colitis', emoji: '💩' },
        { topic: 'Rheumatoid Arthritis', emoji: '🖐️' },
        { topic: 'Lupus', emoji: '🦋' },
        { topic: 'Multiple Sclerosis', emoji: '🧠' },
        { topic: 'Parkinson\'s Disease', emoji: '👴' },
        { topic: 'Alzheimer\'s Disease', emoji: '🧠' },
        { topic: 'Dementia', emoji: '👵' },
        { topic: 'Epilepsy', emoji: '⚡' },
        { topic: 'Schizophrenia', emoji: '🧠' },
        { topic: 'Bipolar Disorder', emoji: '🎭' },
        { topic: 'Obsessive-compulsive disorder', emoji: '🪣' },
        { topic: 'Post-traumatic stress disorder', emoji: '🤯' },
        { topic: 'Panic Disorder', emoji: '🚨' },
        { topic: 'Social anxiety disorder', emoji: '😨' },
        { topic: 'Fibromyalgia', emoji: '🦵' },
        { topic: 'Chronic Fatigue Syndrome', emoji: 'ired' },
        { topic: 'Gout', emoji: '🦶' },
        { topic: 'Cystic Fibrosis', emoji: '🧬' },
        { topic: 'Huntington\'s Disease', emoji: '🧬' },
        { topic: 'Muscular Dystrophy', emoji: '💪' },
        { topic: 'Amyotrophic lateral sclerosis', emoji: '🧠' },
        { topic: 'Polycystic ovary syndrome', emoji: '🚺' },
        { topic: 'Endometriosis', emoji: '🌸' },
        { topic: 'Thyroid cancer', emoji: '🦋' },
        { topic: 'Breast cancer', emoji: '🎀' },
        { topic: 'Prostate cancer', emoji: '♂️' },
        { topic: 'Lung cancer', emoji: '🫁' },
        { topic: 'Colorectal cancer', emoji: '💩' },
        { topic: 'Skin cancer', emoji: '☀️' },
        { topic: 'Leukemia', emoji: '🩸' },
        { topic: 'Lymphoma', emoji: '🎗️' },
        { topic: 'Melanoma', emoji: '⚫' },
        { topic: 'Cataracts', emoji: '👁️' },
        { topic: 'Glaucoma', emoji: '👀' },
        { topic: 'Macular degeneration', emoji: '👓' },
        { topic: 'Tinnitus', emoji: '👂' },
        { topic: 'Vertigo', emoji: '😵' },
        { topic: 'Kidney stones', emoji: '💎' },
        { topic: 'Urinary tract infection', emoji: '🚽' },
        { topic: 'Hemorrhoids', emoji: '🍑' },
        { topic: 'Diverticulitis', emoji: '肠' },
        { topic: 'Appendicitis', emoji: '🚑' },
        { topic: 'Gallstones', emoji: '🪨' },
        { topic: 'Pancreatitis', emoji: '🔥' },
        { topic: 'Hepatitis', emoji: '肝' },
        { topic: 'Cirrhosis', emoji: '肝' },
        { topic: 'Varicose veins', emoji: '🦵' },
        { topic: 'Deep vein thrombosis', emoji: '🩸' },
        { topic: 'Aneurysm', emoji: '💥' },
        { topic: 'Stroke', emoji: '🧠' },
        { topic: 'Transient ischemic attack', emoji: '🧠' },
        { topic: 'Congestive heart failure', emoji: '💔' },
        { topic: 'Arrhythmia', emoji: '💓' },
        { topic: 'Atrial fibrillation', emoji: '💓' },
        { topic: 'Myocardial infarction', emoji: '💔' },
        { topic: 'Influenza', emoji: '🤒' },
        { topic: 'Pneumonia', emoji: '🫁' },
        { topic: 'Bronchitis', emoji: '🫁' },
        { topic: 'Tuberculosis', emoji: '🫁' },
        { topic: 'HIV/AIDS', emoji: '❤️' },
        { topic: 'Herpes', emoji: '👄' },
        { topic: 'Human papillomavirus infection', emoji: '🦠' },
        { topic: 'Chlamydia', emoji: '🤫' },
        { topic: 'Gonorrhea', emoji: '🤫' },
        { topic: 'Syphilis', emoji: '🤫' },
        { topic: 'Shingles', emoji: '🔴' },
        { topic: 'Chickenpox', emoji: '🔴' },
        { topic: 'Measles', emoji: '🔴' },
        { topic: 'Mumps', emoji: '😷' },
        { topic: 'Rubella', emoji: '😷' },
        { topic: 'Mononucleosis', emoji: '💋' },
        { topic: 'Lyme disease', emoji: '🐜' },
        { topic: 'Malaria', emoji: '🦟' },
        { topic: 'Dengue fever', emoji: '🦟' },
        { topic: 'Zika fever', emoji: '🦟' },
        { topic: 'Ebola virus disease', emoji: '💀' },
        { topic: 'COVID-19', emoji: '😷' },
        { topic: 'Eczema', emoji: '🧴' },
        { topic: 'Rosacea', emoji: '🌹' },
        { topic: 'Acne vulgaris', emoji: ' face' },
        { topic: 'Psoriatic arthritis', emoji: '💪' },
        { topic: 'Keratosis pilaris', emoji: '🦵' },
        { topic: 'Vitiligo', emoji: '🦓' },
        { topic: 'Alopecia areata', emoji: '👩‍🦲' },
        { topic: 'Pneumothorax', emoji: '🫁' },
        { topic: 'Emphysema', emoji: '🫁' },
        { topic: 'Chronic obstructive pulmonary disease', emoji: '🚬' },
        { topic: 'Sleepwalking', emoji: '🚶' },
        { topic: 'Narcolepsy', emoji: '😴' },
        { topic: 'Restless legs syndrome', emoji: '🦵' },
        { topic: 'Insomnia', emoji: '🌙' },
        { topic: 'Urinary incontinence', emoji: '🚽' },
        { topic: 'Benign prostatic hyperplasia', emoji: '♂️' },
        { topic: 'Interstitial cystitis', emoji: '🚽' },
        { topic: 'Overactive bladder', emoji: '🚽' },
        { topic: 'Polymyalgia rheumatica', emoji: '👴' },
        { topic: 'Temporal arteritis', emoji: '🤕' },
        { topic: 'Sjögren\'s syndrome', emoji: '💧' },
        { topic: 'Sarcoidosis', emoji: '🫁' },
        { topic: 'Pulmonary fibrosis', emoji: '🫁' },
        { topic: 'Celiac disease', emoji: '🍞' },
        { topic: 'Irritable bowel syndrome', emoji: '💩' },
        { topic: 'Diverticular disease', emoji: '肠' },
        { topic: 'Peptic ulcer disease', emoji: '胃' },
        { topic: 'Gastritis', emoji: '胃' },
        { topic: 'Hiatal hernia', emoji: '💨' },
        { topic: 'Ankylosing spondylitis', emoji: '脊椎' },
        { topic: 'Sacroiliitis', emoji: '骨盆' },
        { topic: 'Scoliosis', emoji: '脊椎' },
        { topic: 'Kyphosis', emoji: '背' },
        { topic: 'Lordosis', emoji: '背' },
        { topic: 'Spina bifida', emoji: '脊椎' },
        { topic: 'Cerebral palsy', emoji: '👶' },
        { topic: 'Down syndrome', emoji: 'chromosome' },
        { topic: 'Fragile X syndrome', emoji: 'chromosome' },
        { topic: 'Turner syndrome', emoji: 'chromosome' },
        { topic: 'Klinefelter syndrome', emoji: 'chromosome' },
        { topic: 'Sickle-cell disease', emoji: '🩸' },
        { topic: 'Thalassemia', emoji: '🩸' },
        { topic: 'Hemophilia', emoji: '🩸' },
        { topic: 'Von Willebrand disease', emoji: '🩸' },
        { topic: 'Hepatitis C', emoji: '肝' },
        { topic: 'Hepatitis B', emoji: '肝' },
        { topic: 'Hepatitis A', emoji: '肝' },
        { topic: 'Meningitis', emoji: '🧠' },
        { topic: 'Encephalitis', emoji: '🧠' },
        { topic: 'Guillain–Barré syndrome', emoji: '🦵' },
        { topic: 'Bell\'s palsy', emoji: ' face' },
        { topic: 'Trigeminal neuralgia', emoji: '🤕' },
        { topic: 'Raynaud\'s phenomenon', emoji: '🥶' },
        { topic: 'Scleroderma', emoji: '🖐️' },
        { topic: 'Polymyositis', emoji: '🦵' },
        { topic: 'Dermatomyositis', emoji: '🖐️' },
        { topic: 'Temporal arteritis', emoji: '🤕' },
        { topic: 'Giant-cell arteritis', emoji: '🤕' },
        { topic: 'Wegener\'s granulomatosis', emoji: '🫁' },
        { topic: 'Kawasaki disease', emoji: '👶' },
        { topic: 'Behçet\'s disease', emoji: '👁️' },
        { topic: 'Polymyalgia rheumatica', emoji: '👴' },
        { topic: 'Rheumatic fever', emoji: '💔' },
        { topic: 'Sarcoidosis', emoji: '🫁' },
        { topic: 'Aplastic anemia', emoji: '🩸' },
        { topic: 'Hemolytic anemia', emoji: '🩸' },
        { topic: 'Pernicious anemia', emoji: '🩸' },
        { topic: 'Iron-deficiency anemia', emoji: '🩸' },
        { topic: 'Thrombocytopenia', emoji: '🩸' },
        { topic: 'Leukopenia', emoji: '🩸' },
        { topic: 'Neutropenia', emoji: '🩸' },
        { topic: 'Hodgkin lymphoma', emoji: '🎗️' },
        { topic: 'Non-Hodgkin lymphoma', emoji: '🎗️' },
        { topic: 'Multiple myeloma', emoji: '🦴' },
        { topic: 'Leukemia', emoji: '🩸' },
        { topic: 'Myelodysplastic syndromes', emoji: '🩸' },
        { topic: 'Polycythemia vera', emoji: '🩸' },
        { topic: 'Essential thrombocythemia', emoji: '🩸' },
        { topic: 'Primary myelofibrosis', emoji: '🩸' },
        { topic: 'Hereditary hemochromatosis', emoji: '🧬' },
        { topic: 'Wilson\'s disease', emoji: '🧬' },
        { topic: 'Cystic fibrosis', emoji: '🧬' },
        { topic: 'Tay–Sachs disease', emoji: '🧬' },
        { topic: 'Gaucher\'s disease', emoji: '🧬' },
        { topic: 'Fabry disease', emoji: '🧬' },
        { topic: 'Niemann–Pick disease', emoji: '🧬' },
        { topic: 'Mucopolysaccharidosis', emoji: '🧬' },
        { topic: 'Adrenoleukodystrophy', emoji: '🧠' },
        { topic: 'Duchenne muscular dystrophy', emoji: '🧬' },
        { topic: 'Becker muscular dystrophy', emoji: '🧬' },
        { topic: 'Myotonic dystrophy', emoji: '🧬' },
        { topic: 'Spinal muscular atrophy', emoji: '🧬' },
        { topic: 'Charcot–Marie–Tooth disease', emoji: '🧬' },
        { topic: 'Friedreich\'s ataxia', emoji: '🧬' },
        { topic: 'Ataxia–telangiectasia', emoji: '🧬' },
        { topic: 'Huntington\'s disease', emoji: '🧬' },
        { topic: 'Ehlers–Danlos syndromes', emoji: '🧬' },
        { topic: 'Marfan syndrome', emoji: '🧬' },
        { topic: 'Osteogenesis imperfecta', emoji: '🦴' },
        { topic: 'Achondroplasia', emoji: '📏' },
        { topic: 'Fibrodysplasia ossificans progressiva', emoji: '🦴' },
        { topic: 'Neurofibromatosis', emoji: '🧬' },
        { topic: 'Tuberous sclerosis', emoji: '🧬' },
        { topic: 'Sturge–Weber syndrome', emoji: '🧬' },
        { topic: 'Von Hippel–Lindau disease', emoji: '🧬' },
        { topic: 'Rett syndrome', emoji: '🚺' },
        { topic: 'Rett syndrome', emoji: '🚺' },
        { topic: 'Angelman syndrome', emoji: '🧬' },
        { topic: 'Prader–Willi syndrome', emoji: '🧬' },
        { topic: 'Cri du chat syndrome', emoji: '🧬' },
        { topic: 'Wolf–Hirschhorn syndrome', emoji: '🧬' },
        { topic: 'Edwards syndrome', emoji: '🧬' },
        { topic: 'Patau syndrome', emoji: '🧬' },
        { topic: 'Celiac disease', emoji: '🍞' },
        { topic: 'Irritable bowel syndrome', emoji: '💩' },
        { topic: 'Crohn\'s disease', emoji: '🤢' },
        { topic: 'Ulcerative colitis', emoji: '💩' },
        { topic: 'Gastroesophageal reflux disease', emoji: '🔥' },
        { topic: 'Diverticulitis', emoji: '肠' },
        { topic: 'Appendicitis', emoji: '🚑' },
        { topic: 'Gallstones', emoji: '🪨' },
        { topic: 'Pancreatitis', emoji: '🔥' },
        { topic: 'Hepatitis', emoji: '肝' },
        { topic: 'Cirrhosis', emoji: '肝' },
        { topic: 'Kidney stones', emoji: '💎' },
        { topic: 'Urinary tract infection', emoji: '🚽' },
        { topic: 'Benign prostatic hyperplasia', emoji: '♂️' },
        { topic: 'Interstitial cystitis', emoji: '🚽' },
        { topic: 'Polycystic kidney disease', emoji: '🧬' },
        { topic: 'Glomerulonephritis', emoji: '💧' },
        { topic: 'Nephrotic syndrome', emoji: '💧' },
        { topic: 'Chronic kidney disease', emoji: '💧' },
        { topic: 'End-stage renal disease', emoji: '💧' },
        { topic: 'Lupus erythematosus', emoji: '🦋' },
        { topic: 'Sjögren\'s syndrome', emoji: '💧' },
        { topic: 'Systemic sclerosis', emoji: '🖐️' },
        { topic: 'Scleroderma', emoji: '🖐️' },
        { topic: 'Fibromyalgia', emoji: '🦵' },
        { topic: 'Chronic fatigue syndrome', emoji: 'ired' },
        { topic: 'Gout', emoji: '🦶' },
        { topic: 'Pseudogout', emoji: '🦶' },
        { topic: 'Rheumatoid arthritis', emoji: '🖐️' },
        { topic: 'Osteoarthritis', emoji: '🦴' },
        { topic: 'Juvenile idiopathic arthritis', emoji: '👶' },
        { topic: 'Osteoporosis', emoji: '💪' },
        { topic: 'Paget\'s disease of bone', emoji: '🦴' },
        { topic: 'Rickets', emoji: '🦴' },
        { topic: 'Spina bifida', emoji: '脊椎' },
        { topic: 'Scoliosis', emoji: '脊椎' },
        { topic: 'Kyphosis', emoji: '背' },
        { topic: 'Lordosis', emoji: '背' },
      ];

      try {
        const randomTopic = medicalTopics[Math.floor(Math.random() * medicalTopics.length)];
        
        const baseUrl = 'https://en.wikipedia.org/w/api.php';
        const params = new URLSearchParams({
          action: 'query',
          format: 'json',
          prop: 'extracts',
          exintro: 'true',
          explaintext: 'true',
          redirects: '1',
          titles: randomTopic.topic,
          origin: '*',
        });
        const apiUrl = `${baseUrl}?${params.toString()}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId && pageId !== '-1') {
          const entry = pages[pageId];
          const title = entry.title;
          const summary = entry.extract;
          
          if (summary) {
            const shortSummary = summary.split('. ')[0] + '.';
            setFact(`${randomTopic.emoji} ${title}: ${shortSummary}`);
          } else {
            setFact(`${randomTopic.emoji} ${title}: Learn more about this important health topic.`);
          }
        } else {
          throw new Error(`No Wikipedia article found for "${randomTopic.topic}".`);
        }
      } catch (e) {
        console.error("Failed to fetch medical fact:", e);
        setError("Could not retrieve a medical fact at this time.");
        setFact("🩺 Regular health check-ups are key to early detection and prevention of diseases.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalFact();
    const interval = setInterval(fetchMedicalFact, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="marquee-container">
      {isLoading ? (
        <span ref={contentRef} className="marquee-content loading-text">Loading medical fact...</span>
      ) : error ? (
        <span ref={contentRef} className="marquee-content marquee-text" style={{ color: '#dc2626' }}>⚠️ {error}</span>
      ) : (
        <span ref={contentRef} className="marquee-content marquee-text">{fact}</span>
      )}
    </div>
  );
};

export default MedicalFactMarquee;