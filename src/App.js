import { useState, useEffect } from 'react';
import DashboardPadel from './DashboardPadel';

// ==========================================
// THEME COLORS (From DataO Logo)
// ==========================================
const theme = {
  primary: '#00FFE0',      // Cyan from logo
  secondary: '#000000',    // Black
  white: '#FFFFFF',
  gray: '#f8f8f8',
  darkGray: '#333333'
};

// ===============================
// PORTAL THEME (DataO Dark)
// ===============================
const portalTheme = {
  bg: '#000000',
  panel: '#0a0a0a',
  card: '#111111',
  border: '#333333',
  text: '#ffffff',
  muted: '#9ca3af',
  primary: '#2563eb',
  dangerBg: '#7f1d1d',
  dangerBorder: '#991b1b'
};

// ==========================================
// AUTH SERVICE FOR PORTAL
// ==========================================
const clientDatabase = {
  'PADEL2026': {
    id: 3,
    name: 'Padel Pro',
    businessName: 'Padel Pro',
    dashboardType: 'padel', 
    dashboardUrl: 'https://lookerstudio.google.com/embed/reporting/1sMGl0jXFu-5S6HqJd-pXdJZ0TZqLKp8m',
    theme: { primary: '#0ea5e9', secondary: '#020617' }
  }
};

const authService = {
  login: (accessCode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = clientDatabase[accessCode.toUpperCase().trim()];
        if (client) {
          resolve({ success: true, client });
        } else {
          reject({ success: false, message: 'Código incorrecto' });
        }
      }, 800);
    });
  }
};

// ==========================================
// HEADER COMPONENT
// ==========================================
const Header = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
    const y = window.scrollY;

    // solo mostrar header cuando estés cerca del top
    if (y < 120) {
      setIsScrolled(false);
    } else {
      setIsScrolled(true);
    }
  };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Servicio' },
    { id: 'portal', label: 'Portal Clientes' },
    { id: 'contact', label: 'Contacto' }
  ];

  return (
    <header style={{
      background: theme.secondary,
      padding: '0',
      position: 'sticky',
      top: isScrolled ? '-150px' : '0',
      zIndex: 1000,
      transition: 'top 0.3s',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      width: '100%',
      overflow: 'visible',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem clamp(1rem, 2vw, 2rem)',
        paddingTop: '0.1rem',
        paddingLeft: '0.1rem',
        paddingBottom: '0.2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <img 
            src={process.env.PUBLIC_URL + '/img/DataO.jpg'} 
            alt="DataO Logo"
            style={{
              width: '180px',
              height: '80px',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
          className="mobile-menu-btn"
        >
          <span style={{ width: '24px', height: '3px', background: theme.white, borderRadius: '3px' }}/>
          <span style={{ width: '24px', height: '3px', background: theme.white, borderRadius: '3px' }}/>
          <span style={{ width: '24px', height: '3px', background: theme.white, borderRadius: '3px' }}/>
        </button>

        <nav style={{ display: 'flex' }} className="desktop-nav">
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            gap: '2rem',
            margin: 0,
            padding: 0
          }}>
            {navItems.map(item => (
              <li key={item.id}>
                <a href
                  onClick={() => onNavigate(item.id)}
                  style={{
                    color: currentPage === item.id ? theme.primary : theme.white,
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.primary}
                  onMouseLeave={(e) => e.target.style.color = currentPage === item.id ? theme.primary : theme.white}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <nav style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: theme.secondary,
        padding: menuOpen ? '1rem' : '0',
        maxHeight: menuOpen ? '300px' : '0',
        opacity: menuOpen ? 1 : 0,
        visibility: menuOpen ? 'visible' : 'hidden',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        display: 'none',
        zIndex: 999
      }} className="mobile-nav">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map(item => (
            <li key={item.id} style={{ padding: '0.75rem 1rem' }}>
              <a href
                onClick={() => {
                  onNavigate(item.id);
                  setMenuOpen(false);
                }}
                style={{
                  color: theme.white,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'block'
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            background: ${theme.secondary} !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </header>
  );
};

// ==========================================
// HOMEPAGE - ESTILO APPLE
// ==========================================

const HomePage = ({ onNavigate }) => {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box', overflow: 'hidden' }}> 
      
      {/* Hero Section - Apple Style */}
      <section style={{
        textAlign: 'center',
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo de fondo */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,255,224,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            marginBottom: '1.5rem',
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Datos que hablan.<br/>Decisiones que funcionan.
          </h2>
          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#86868b',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            fontWeight: '400'
          }}>
            La forma más inteligente de entender tu negocio.
          </p>
          <button
            onClick={() => onNavigate('services')}
            style={{
              padding: '1.2rem 3rem',
              background: '#00FFE0',
              color: '#000000',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.2rem',
              borderRadius: '50px',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,255,224,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(0,255,224,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,255,224,0.3)';
            }}
          >
            Empieza hoy
          </button>
        </div>
      </section>

      {/* About Section - Apple Style */}
      <section style={{
        maxWidth: '1000px',
        margin: '8rem auto',
        padding: '0 2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          marginBottom: '1.5rem',
          color: '#000000',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          Tus datos. Tus decisiones.<br/>Sin complicaciones.
        </h3>
        <p style={{ 
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
          lineHeight: '1.6', 
          color: '#86868b',
          fontWeight: '400'
        }}>
          Dashboards que muestran lo que importa.<br/>
          Sin curva de aprendizaje. Sin sorpresas.
        </p>
      </section>

      {/* Dashboard Preview Section - Apple Style */}
      <section style={{
        background: '#000000',
        padding: '6rem 2rem',
        margin: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Tu dashboard. Profesional. Poderoso.
          </h3>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            color: '#86868b',
            marginBottom: '4rem',
            maxWidth: '800px',
            margin: '0 auto 4rem'
          }}>
            Visualiza tus datos en tiempo real con gráficas interactivas que revelan insights al instante.
          </p>

          <div style={{
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto 4rem',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0, 255, 224, 0.15), 0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'transform 0.5s ease, box-shadow 0.5s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02) translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 35px 100px rgba(0, 255, 224, 0.25), 0 15px 40px rgba(0, 0, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 80px rgba(0, 255, 224, 0.15), 0 10px 30px rgba(0, 0, 0, 0.5)';
          }}
          onClick={() => onNavigate('portal')}
          >
            <img 
              src={process.env.PUBLIC_URL + '/img/dashboard-preview.png'} 
              alt="Dashboard DataO Preview" 
              style={{ 
                width: '100%', 
                height: 'auto',
                display: 'block'
              }}
            />
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
              pointerEvents: 'none'
            }} />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <button
              onClick={() => onNavigate('portal')}
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: '#00FFE0',
                border: '2px solid #00FFE0',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#00FFE0';
                e.target.style.color = '#000000';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#00FFE0';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Explorar demo interactivo
            </button>
            
            <button
              onClick={() => onNavigate('services')}
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: '#ffffff',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#ffffff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Ver servicio
            </button>
          </div>

          <p style={{
            marginTop: '3rem',
            fontSize: '0.9rem',
            color: '#86868b',
            fontWeight: '400'
          }}>
            Dashboard real de uno de nuestros clientes. Datos anonimizados.
          </p>
        </div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0,255,224,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
      </section>

      {/* Benefits Section - Apple Style */}
      <section style={{
        maxWidth: '1200px',
        margin: '8rem auto',
        padding: '0 2rem'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          marginBottom: '4rem',
          color: '#000000',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          ¿Por qué DataO?
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem'
        }}>
          {[
            { 
              emoji: '⚡', 
              title: 'Claridad absoluta.', 
              desc: 'Información visual. Decisiones rápidas.' 
            },
            { 
              emoji: '🎯', 
              title: 'Para tu negocio.', 
              desc: 'Dashboards diseñados específicamente para ti.' 
            },
            { 
              emoji: '💡', 
              title: 'Datos accionables.', 
              desc: 'No solo números. Insights que impulsan crecimiento.' 
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                filter: 'grayscale(20%)'
              }}>
                {item.emoji}
              </div>
              <h4 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '0.75rem',
                color: '#000000',
                fontWeight: '600',
                letterSpacing: '-0.01em'
              }}>
                {item.title}
              </h4>
              <p style={{ 
                color: '#86868b',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        textAlign: 'center',
        padding: '6rem 2rem',
        background: '#f5f5f7',
        margin: '4rem 0'
      }}>
        <h3 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '1.5rem',
          color: '#000000',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          Listo para empezar?
        </h3>
        <p style={{
          fontSize: '1.3rem',
          color: '#86868b',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem'
        }}>
          Transforma tus datos en decisiones hoy mismo.
        </p>
        <button
          onClick={() => onNavigate('services')}
          style={{
            padding: '1.2rem 3rem',
            background: '#00FFE0',
            color: '#000000',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1.2rem',
            borderRadius: '50px',
            transition: 'all 0.3s',
            boxShadow: '0 10px 30px rgba(0,255,224,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 15px 40px rgba(0,255,224,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(0,255,224,0.3)';
          }}
        >
          Ver servicio
        </button>
      </section>

      {/* Testimonial - Apple Style */}
      <section style={{
        maxWidth: '900px',
        margin: '8rem auto',
        padding: '0 2rem',
        textAlign: 'center'
      }}>
        <blockquote style={{
          fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
          color: '#000000',
          padding: '0',
          border: 'none',
          fontWeight: '500',
          lineHeight: '1.5',
          fontStyle: 'normal',
          marginBottom: '2rem'
        }}>
          "Ahora tomamos decisiones basadas en datos, no en corazonadas."
        </blockquote>
        <p style={{ 
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '0.25rem'
        }}>
          Ana González
        </p>
        <p style={{ 
          color: '#86868b',
          fontSize: '1rem'
        }}>
          Dueña de EcoTiendita
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              color: '#000000',
              border: '2px solid #00FFE0',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1.1rem',
              borderRadius: '50px',
              transition: 'all 0.3s'
            }}
            onClick={() => onNavigate('portal')}
            onMouseEnter={e => {
              e.target.style.background = '#00FFE0';
              e.target.style.color = '#000';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#000000';
            }}
          >
            Ver Demo
          </button>
        </div>
      </section>

      {/* Process Section - Simplified Apple Style */}
      <section style={{
        maxWidth: '1200px',
        margin: '8rem auto 4rem',
        padding: '0 2rem'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          marginBottom: '4rem',
          color: '#000000',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          Cómo funciona
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem'
        }}>
          {[
            { num: '1', title: 'Envía tus datos', desc: 'Excel, CSV o conexión directa.' },
            { num: '2', title: 'Creamos tu dashboard', desc: 'Limpieza, análisis y diseño personalizado.' },
            { num: '3', title: 'Toma decisiones', desc: 'Accede a tu portal y actúa con confianza.' }
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#00FFE0',
                color: '#000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 auto 1.5rem'
              }}>
                {item.num}
              </div>
              <h4 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '0.75rem',
                color: '#000',
                fontWeight: '600'
              }}>
                {item.title}
              </h4>
              <p style={{ 
                color: '#86868b',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

// ==========================================
// COTIZADOR INTELIGENTE
// ==========================================

const CYAN = "#00FFE0";

// ─── Catálogos ──────────────────────────────────────────────

const BUSINESS_TYPES = [
  { id: "restaurant",  label: "🍽️ Restaurante / Bar",        complexity: 1 },
  { id: "retail",      label: "🛍️ Tienda / Retail",          complexity: 1 },
  { id: "clinic",      label: "🏥 Clínica / Salud",           complexity: 2 },
  { id: "gym",         label: "💪 Gimnasio / Deporte",        complexity: 1 },
  { id: "realestate",  label: "🏠 Inmobiliaria",              complexity: 2 },
  { id: "ecommerce",   label: "🛒 E-commerce",                complexity: 2 },
  { id: "franchise",   label: "🏢 Franquicia / Cadena",       complexity: 3 },
  { id: "consulting",  label: "📊 Consultoría / Servicios",   complexity: 2 },
  { id: "other",       label: "🔧 Otro",                      complexity: 1 },
];

const DATA_VOLUMES = [
  {
    id: "xs",
    label: "Menos de 500 filas",
    sublabel: "Ej. registro semanal pequeño, negocio nuevo",
    score: 0,
    surcharge: 0,
    minPlan: null,
    badge: null,
  },
  {
    id: "sm",
    label: "500 – 5,000 filas",
    sublabel: "Ej. ventas mensuales de tienda o restaurante",
    score: 1,
    surcharge: 0,
    minPlan: null,
    badge: null,
  },
  {
    id: "md",
    label: "5,000 – 25,000 filas",
    sublabel: "Ej. transacciones anuales de e-commerce o clínica",
    score: 2,
    surcharge: 900,
    minPlan: "pro",
    badge: "Requiere mínimo Plan Pro",
  },
  {
    id: "lg",
    label: "25,000 – 100,000 filas",
    sublabel: "Ej. registros de cadena, franquicia o ERP",
    score: 3,
    surcharge: 2250,
    minPlan: "premium",
    badge: "Requiere Plan Premium",
  },
  {
    id: "xl",
    label: "Más de 100,000 filas",
    sublabel: "Big Data — requiere arquitectura especial",
    score: 4,
    surcharge: 4050,
    minPlan: "premium",
    badge: "🔥 Big Data — cotización personalizada",
  },
];

const DATA_SOURCES = [
  { id: "excel",  label: "Excel / CSV",        cost: 0 },
  { id: "sheets", label: "Google Sheets",      cost: 0 },
  { id: "pos",    label: "Sistema POS",        cost: 450 },
  { id: "sql",    label: "Base de datos SQL",  cost: 900 },
  { id: "api",    label: "API externa",        cost: 1350 },
  { id: "multi",  label: "+3 fuentes mixtas",  cost: 1800 },
];

const FREQUENCIES = [
  { id: "monthly",  label: "Mensual",      surcharge: 0,    multiplier: 1.0, renewalMult: 1.0 },
  { id: "biweekly", label: "Quincenal",    surcharge: 450,  multiplier: 1.2, renewalMult: 1.2 },
  { id: "weekly",   label: "Semanal",      surcharge: 1050, multiplier: 1.5, renewalMult: 1.5 },
  { id: "realtime", label: "Tiempo real",  surcharge: 2250, multiplier: 2.0, renewalMult: 2.0 },
];

const BUDGETS = [
  { id: "low",  label: "Menos de $2,500 MXN",          max: 2499 },
  { id: "mid",  label: "$2,500 – $5,000 MXN",          max: 5000 },
  { id: "high", label: "$5,000 – $10,000 MXN",         max: 10000 },
  { id: "open", label: "Sin límite, quiero lo mejor",   max: 99999 },
];

const PLANS = {
  basico:  { name: "Básico",  base: 2247,  renewal: 900,  graphs: 4, kpis: 2, sections: 1, support: "—",           delivery: "3–5 días",  color: "#10b981", badge: "Starter" },
  pro:     { name: "Pro",     base: 4497,  renewal: 1350, graphs: 6, kpis: 4, sections: 2, support: "WhatsApp",    delivery: "5–7 días",  color: "#3b82f6", badge: "Más popular ⭐" },
  premium: { name: "Premium", base: 7872,  renewal: 2250, graphs: 8, kpis: 6, sections: 3, support: "Prioritario", delivery: "7–10 días", color: "#f59e0b", badge: "Top tier 🏆" },
};

const PLAN_ORDER = ["basico", "pro", "premium"];

// ─── Algoritmo ──────────────────────────────────────────────

function calculateQuote({ businessType, dataVolume, dataSource, frequency, budget }) {
  const biz  = BUSINESS_TYPES.find(b => b.id === businessType);
  const vol  = DATA_VOLUMES.find(v => v.id === dataVolume);
  const src  = DATA_SOURCES.find(d => d.id === dataSource);
  const freq = FREQUENCIES.find(f => f.id === frequency);
  const budg = BUDGETS.find(b => b.id === budget);

  if (!biz || !vol || !src || !freq || !budg) return null;

  // 1. Score base → determina plan inicial
  const score =
    biz.complexity * 2 +
    vol.score * 2 +
    (src.cost > 0 ? 2 : 0) +
    (freq.multiplier > 1.2 ? 2 : freq.multiplier > 1 ? 1 : 0);

  let planKey = score <= 4 ? "basico" : score <= 9 ? "pro" : "premium";

  // 2. Override por volumen — upgrade forzado si el volumen lo requiere
  if (vol.minPlan) {
    const currentIdx = PLAN_ORDER.indexOf(planKey);
    const minIdx     = PLAN_ORDER.indexOf(vol.minPlan);
    if (minIdx > currentIdx) planKey = vol.minPlan;
  }

  // 3. Override por presupuesto — downgrade si no alcanza
  const budgetOverride = budget !== "open";
  if (budgetOverride) {
    const base = PLANS[planKey].base + vol.surcharge;
    if (budg.max < base) {
      const affordable = PLAN_ORDER.slice().reverse().find(k => PLANS[k].base + vol.surcharge <= budg.max);
      if (affordable) planKey = affordable;
    }
  }

  const plan = PLANS[planKey];

  // 4. Precio final — frecuencia suma costo fijo + multiplica renovación
  const extras          = src.cost + vol.surcharge + freq.surcharge;
  const adjustedBase    = Math.round(plan.base + extras);
  const adjustedRenewal = Math.round(plan.renewal * freq.renewalMult);

  const fits      = adjustedBase <= budg.max || budget === "open";
  const isBigData = dataVolume === "xl";

  // 5. Desglose de precio
  const breakdown = [
    { label: `Plan ${plan.name} (base)`,                          amount: plan.base },
    ...(vol.surcharge  > 0 ? [{ label: `Volumen: ${vol.label}`,          amount: vol.surcharge  }] : []),
    ...(src.cost       > 0 ? [{ label: `Integración: ${src.label}`,      amount: src.cost       }] : []),
    ...(freq.surcharge > 0 ? [{ label: `Frecuencia: ${freq.label}`,      amount: freq.surcharge }] : []),
  ];

  // 6. Mensaje Messenger
  const msg = encodeURIComponent(
    `Hola DataO 👋 Me interesa una cotización.\n\n` +
    `📌 Plan recomendado: ${plan.name}\n` +
    `📊 Negocio: ${biz.label}\n` +
    `📦 Volumen de datos: ${vol.label}\n` +
    `📁 Fuente: ${src.label}\n` +
    `🔄 Actualización: ${freq.label}\n` +
    `💰 Presupuesto: ${budg.label}\n\n` +
    `➡️ Estimado: $${adjustedBase.toLocaleString()} MXN iniciales\n` +
    `   Renovación: $${adjustedRenewal.toLocaleString()}/mes`
  );

  return { planKey, plan, adjustedBase, adjustedRenewal, fits, isBigData, breakdown, freq, vol, msg };
}

// ─── UI Helpers ─────────────────────────────────────────────

const STEPS = ["Negocio", "Volumen", "Datos", "Frecuencia", "Presupuesto"];

function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: 11,
              background: i < current ? CYAN : i === current ? "#000" : "#111",
              color: i < current ? "#000" : i === current ? CYAN : "#333",
              border: `2px solid ${i <= current ? CYAN : "#222"}`,
              transition: "all .3s",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i <= current ? CYAN : "#333", marginTop: 3, whiteSpace: "nowrap", fontWeight: i === current ? 700 : 400 }}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ height: 2, flex: 1, background: i < current ? CYAN : "#1a1a1a", transition: "background .3s", marginBottom: 14 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function OptionCard({ selected, onClick, children, highlight }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? `${CYAN}12` : highlight ? "#0f1a17" : "#0d0d0d",
      border: `2px solid ${selected ? CYAN : highlight ? `${CYAN}30` : "#1e1e1e"}`,
      borderRadius: 10, padding: "0.85rem 1rem", cursor: "pointer",
      textAlign: "left", transition: "all .2s", color: selected ? CYAN : "#ccc",
      fontWeight: selected ? 700 : 400, fontSize: 13, width: "100%",
      boxShadow: selected ? `0 0 14px ${CYAN}22` : "none",
    }}>
      {children}
    </button>
  );
}

function Breakdown({ items, total }) {
  return (
    <div style={{ background: "#050505", border: "1px solid #1a1a1a", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
      <p style={{ fontSize: 10, color: CYAN, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Desglose del precio</p>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < items.length - 1 ? "1px solid #111" : "none" }}>
          <span style={{ fontSize: 12, color: "#666" }}>{item.label}</span>
          <span style={{ fontSize: 12, color: item.amount ? "#aaa" : CYAN, fontWeight: item.note ? 700 : 400 }}>
            {item.note ? item.note : item.amount ? `+$${item.amount.toLocaleString()}` : ""}
          </span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${CYAN}30` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Total estimado</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: CYAN }}>${total.toLocaleString()} MXN</span>
      </div>
    </div>
  );
}

function ResultCard({ result, onReset }) {
  const { plan, planKey, adjustedBase, adjustedRenewal, fits, isBigData, breakdown, msg } = result;

  return (
    <div style={{ animation: "fadeIn .45s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }`}</style>

      {/* Plan hero */}
      <div style={{ background: `${plan.color}0e`, border: `2px solid ${plan.color}40`, borderRadius: 16, padding: "1.75rem", marginBottom: "1.25rem", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: plan.color, color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 20, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
          {plan.badge}
        </div>
        <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>
          Plan {plan.name}
        </div>
        {isBigData ? (
          <div style={{ marginTop: 12, background: "#f59e0b15", border: "1px solid #f59e0b50", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🔥 Volumen Big Data detectado</p>
            <p style={{ color: "#888", fontSize: 12 }}>Tu volumen requiere arquitectura especial. El precio es una estimación base — contáctanos para una cotización personalizada.</p>
          </div>
        ) : (
          <div style={{ fontSize: "3rem", fontWeight: 900, color: plan.color, marginTop: 8, letterSpacing: "-2px" }}>
            ${adjustedBase.toLocaleString()}
            <span style={{ fontSize: "0.9rem", color: "#555", fontWeight: 400 }}> MXN</span>
          </div>
        )}
        <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
          Renovación estimada: <strong style={{ color: "#888" }}>${adjustedRenewal.toLocaleString()}/mes</strong>
        </div>

        {!fits && (
          <div style={{ marginTop: 12, background: "#f59e0b10", border: "1px solid #f59e0b40", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#f59e0b" }}>
            ⚠️ Este plan supera tu presupuesto. Contáctanos para ajustar el alcance.
          </div>
        )}
      </div>

      {/* Desglose */}
      <Breakdown items={breakdown} total={adjustedBase} />

      {/* Includes */}
      <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ color: CYAN, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>¿Qué incluye?</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {[
            ["📊", `${plan.graphs} gráficas`],
            ["🎯", `${plan.kpis} KPIs`],
            ["📑", `${plan.sections} sección${plan.sections > 1 ? "es" : ""}`],
            ["🔄", `Actualización ${result.freq.label.toLowerCase()}`],
            ["💬", `Soporte: ${plan.support}`],
            ["⏱", `Entrega: ${plan.delivery}`],
            ["🎁", "2 meses acceso gratis"],
            ["📦", `Volumen: ${result.vol.label.split("–")[0].trim()}...`],
          ].map(([icon, txt]) => (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#aaa" }}>
              <span>{icon}</span><span>{txt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={`https://m.me/61563803638340?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", width: "100%", padding: "1rem", borderRadius: 10,
          textAlign: "center", background: CYAN, color: "#000", fontWeight: 800,
          fontSize: 15, textDecoration: "none", boxShadow: `0 8px 24px ${CYAN}33`,
          transition: "all .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = `0 12px 32px ${CYAN}55`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 8px 24px ${CYAN}33`; }}
      >
        💬 Quiero este plan — Abrir Messenger
      </a>

      <button onClick={onReset} style={{ marginTop: "0.75rem", width: "100%", padding: "0.7rem", background: "transparent", border: "1px solid #1e1e1e", borderRadius: 10, color: "#444", cursor: "pointer", fontSize: 12, transition: "border .2s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}>
        🔄 Volver a cotizar
      </button>

      <p style={{ textAlign: "center", fontSize: 10, color: "#2a2a2a", marginTop: 10 }}>
        * Precio estimado. El costo final puede variar según el alcance del proyecto.
      </p>
    </div>
  );
}

function CotizadoraDataO() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const select = (field, value) => {
    const next = { ...answers, [field]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setTimeout(() => { setStep(s => s + 1); setAnimKey(k => k + 1); }, 200);
    } else {
      setResult(calculateQuote(next));
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); setAnimKey(k => k + 1); };
  const back  = () => { setStep(s => s - 1); setAnimKey(k => k + 1); };

  const FIELDS   = ["businessType", "dataVolume", "dataSource", "frequency", "budget"];
  const OPTIONS  = [BUSINESS_TYPES, DATA_VOLUMES, DATA_SOURCES, FREQUENCIES, BUDGETS];
  const QUESTIONS = [
    "¿Qué tipo de negocio tienes?",
    "¿Cuántos registros / filas de datos manejas?",
    "¿Desde dónde vienen tus datos?",
    "¿Con qué frecuencia necesitas actualizar tu dashboard?",
    "¿Cuál es tu presupuesto inicial aproximado?",
  ];
  const SUBTITLES = [
    "Nos ayuda a entender la complejidad operativa.",
    "El volumen de datos define procesamiento, limpieza y precio.",
    "Cada fuente tiene distintos niveles de integración.",
    "Más frecuencia = dashboards más vivos y mayor inversión.",
    "Te recomendaremos el plan que más te convenga.",
  ];

  const currentField   = FIELDS[step];
  const currentOptions = OPTIONS[step];

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem 1rem", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn { from { opacity:0; transform:translateX(18px) } to { opacity:1; transform:none } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", background: `${CYAN}15`, border: `1px solid ${CYAN}35`, borderRadius: 20, padding: "3px 14px", fontSize: 10, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            DataO — Cotizador inteligente
          </div>
          <h1 style={{ fontSize: "clamp(1.7rem, 5vw, 2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Tu plan ideal.<br /><span style={{ color: CYAN }}>En 5 preguntas.</span>
          </h1>
          <p style={{ color: "#444", marginTop: 8, fontSize: 13 }}>
            El volumen de tus datos define tu precio real — no hay sorpresas.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "#080808", border: "1px solid #141414", borderRadius: 20, padding: "clamp(1.5rem, 5vw, 2.25rem)", boxShadow: "0 24px 64px rgba(0,0,0,.7)" }}>

          {!result ? (
            <>
              <StepBar current={step} />

              <div key={animKey} style={{ animation: "slideIn .28s ease" }}>
                <h2 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 700, marginBottom: 5 }}>
                  {QUESTIONS[step]}
                </h2>
                <p style={{ color: "#444", fontSize: 12, marginBottom: "1.25rem" }}>
                  {SUBTITLES[step]}
                </p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {currentOptions.map(opt => (
                    <OptionCard
                      key={opt.id}
                      selected={answers[currentField] === opt.id}
                      highlight={opt.minPlan === "premium"}
                      onClick={() => select(currentField, opt.id)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div>{opt.label}</div>
                          {opt.sublabel && (
                            <div style={{ fontSize: 11, color: answers[currentField] === opt.id ? `${CYAN}99` : "#444", marginTop: 2 }}>
                              {opt.sublabel}
                            </div>
                          )}
                          {opt.badge && (
                            <div style={{ display: "inline-block", marginTop: 4, background: opt.minPlan === "premium" ? "#f59e0b20" : "#3b82f620", border: `1px solid ${opt.minPlan === "premium" ? "#f59e0b50" : "#3b82f650"}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: opt.minPlan === "premium" ? "#f59e0b" : "#3b82f6", fontWeight: 700 }}>
                              {opt.badge}
                            </div>
                          )}
                        </div>
                        {opt.surcharge > 0 && (
                          <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap", marginLeft: 8 }}>
                            +${opt.surcharge.toLocaleString()}
                          </span>
                        )}
                        {opt.cost > 0 && (
                          <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap", marginLeft: 8 }}>
                            +${opt.cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </OptionCard>
                  ))}
                </div>

                {step > 0 && (
                  <button onClick={back} style={{ marginTop: "1rem", background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
                    ← Volver
                  </button>
                )}
              </div>
            </>
          ) : (
            <ResultCard result={result} onReset={reset} />
          )}
        </div>

        <p style={{ textAlign: "center", color: "#1e1e1e", fontSize: 10, marginTop: "1.25rem" }}>
          DataO Analytics · Made with 💡 in Mexico
        </p>
      </div>
    </div>
  );
}

// SERVICES PAGE - ESTILO APPLE
// ==========================================
// Nueva versión sin precios fijos, usando el cotizador inteligente

const ServicesPage = ({ onNavigate }) => {
  const services = [
    {
      name: 'Dashboard Básico',
      idealFor: 'Negocios pequeños, freelancers, emprendedores',
      features: [
        '✓ 4 gráficas clave',
        '✓ 2 KPIs principales',
        '✓ 2 meses de acceso GRATIS',
        '✓ 1 actualización mensual',
        '✓ 1 revisión gratuita',
        '✓ Sin permanencia',
        '⏱ 3–5 días hábiles'
      ]
    },
    {
      name: 'Dashboard Profesional',
      idealFor: 'PYMEs, tiendas, restaurantes, clínicas, negocios en crecimiento',
      features: [
        '✓ 6 gráficas avanzadas',
        '✓ 4 KPIs estratégicos',
        '✓ 2 secciones completas',
        '✓ 2 meses de acceso GRATIS',
        '✓ 1 actualización mensual',
        '✓ 2 revisiones gratuitas',
        '✓ Soporte WhatsApp',
        '✓ Sin permanencia'
      ]
    },
    {
      name: 'Dashboard Premium',
      idealFor: 'Franquicias, cadenas, consultorías, empresas',
      features: [
        '✓ 8 gráficas personalizadas',
        '✓ 6 KPIs con tendencias',
        '✓ 3 secciones completas',
        '✓ 2 meses de acceso GRATIS',
        '✓ Actualizaciones quincenales',
        '✓ 3 revisiones gratuitas',
        '✓ Capacitación (videollamada)',
        '✓ Atención prioritaria'
      ]
    }
  ];

  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      
      {/* Hero Section - Apple Style */}
      <section style={{ 
        textAlign: 'center', 
        padding: '8rem 2rem 4rem', 
        background: '#000000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo de fondo */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,255,224,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            marginBottom: '1.5rem',
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Nuestros Servicios
          </h2>
          <p style={{ 
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', 
            color: '#86868b',
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: '400'
          }}>
            Transformamos tus datos en decisiones claras y accionables.
          </p>
        </div>
      </section>

      {/* Cards Section - Apple Style */}
      <section style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '4rem 2rem',
        background: '#ffffff'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          marginBottom: '0rem'
        }}>
          {services.map((service, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #d2d2d7',
                borderRadius: '18px',
                padding: '2.5rem',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00FFE0';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,224,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d2d2d7';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
              }}
            >
              {/* Nombre del paquete */}
              <h3 style={{ 
                fontSize: '1.75rem', 
                marginBottom: '0.5rem',
                color: '#000000',
                fontWeight: '600',
                letterSpacing: '-0.01em'
              }}>
                {service.name}
              </h3>
              
              {/* Ideal para */}
              {service.idealFor && (
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#86868b', 
                  marginBottom: '2rem',
                  fontWeight: '400'
                }}>
                  Ideal para: {service.idealFor}
                </p>
              )}

              {/* Features */}
              <ul style={{ 
                textAlign: 'left', 
                marginBottom: '2rem', 
                listStyle: 'none', 
                padding: 0 
              }}>
                {service.features.map((feature, i) => (
                  <li key={i} style={{ 
                    padding: '0.5rem 0', 
                    color: '#1d1d1f',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    borderBottom: i === service.features.length - 1 ? 'none' : '1px solid #f5f5f7'
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Info de cotización */}
              <div style={{ 
                marginBottom: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #f5f5f7'
              }}>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#86868b', 
                  fontWeight: '400'
                }}>
                  💰 El precio se calcula en el cotizador inteligente basado en tu volumen de datos y necesidades específicas.
                </p>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => window.open('https://m.me/61563803638340', '_blank')}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1d1d1f';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#000000';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Contactar
                </button>
                
                <button
                  onClick={onNavigate ? () => onNavigate('portal') : () => { window.location.hash = '#portal'; }}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'transparent',
                    color: '#000000',
                    border: '2px solid #00FFE0',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#00FFE0';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Ver Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cotizador Inteligente - Nueva sección */}
      <section style={{ 
        maxWidth: '100%', 
        margin: '0', 
        padding: '0',
        background: '#000000'
      }}>
        <CotizadoraDataO />
      </section>

      {/* Tabla Comparativa - comentada */}
      {/* <section style={{ 
      
        margin: '0 auto', 
        padding: '4rem 2rem',
        background: '#f5f5f7'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          marginBottom: '3rem', 
          color: '#000',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
        Comparativa de Paquetes
        </h3>

        <div style={{ margin: '0 auto', maxWidth: 1400, overflowX: 'auto', borderRadius: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', minWidth: '800px' }}>
            <thead style={{ background: '#000', color: 'white' }}>
              <tr>
                <th style={{ padding: '1.5rem 1rem', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'left', background: '#1a1a1a' }}>Feature</th>
                <th style={{ padding: '1.5rem 1rem', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}>Básico</th>
                <th style={{ padding: '1.5rem 1rem', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}>Pro</th>
                <th style={{ padding: '1.5rem 1rem', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: '600', background: '#fafafa' }}>Precio inicial</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <div style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through', marginBottom: '0.25rem' }}>$999</div>
                  $499 MXN
                  <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.25rem' }}>50% OFF</div>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <div style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through', marginBottom: '0.25rem' }}>$1,999</div>
                  $999 MXN
                  <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.25rem' }}>50% OFF</div>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <div style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through', marginBottom: '0.25rem' }}>$3,499</div>
                  $1,749 MXN
                  <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.25rem' }}>50% OFF</div>
                </td>
              </tr>
              <tr style={{ background: '#fafafa', fontStyle: 'italic', borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600' }}>Acceso portal (gratis)</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2 meses</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2 meses</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2 meses</td>
              </tr>
              <tr style={{ background: '#fafafa', fontStyle: 'italic', borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600' }}>Renovación mensual</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>$200/mes</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>$300/mes</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>$500/mes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Gráficas</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>4</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>6</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>8</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>KPIs</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>4</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>6</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Secciones</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>1</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>3</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Actualizaciones</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>Mensuales</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>Mensuales</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>Quincenales</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Revisiones gratuitas</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>1</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>3</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Soporte</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontSize: '1.2rem' }}>✗</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>WhatsApp</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ background: '#00FFE0', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>Prioritario</span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Capacitación</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontSize: '1.2rem' }}>✗</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontSize: '1.2rem' }}>✗</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontSize: '1.2rem' }}>✓</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Tiempo entrega</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>3-5 días</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>5-7 días</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>7-10 días</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '1rem', fontWeight: '600', background: '#fafafa' }}>Ideal para</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>Negocios pequeños, freelancers</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>PYMEs, tiendas, restaurantes</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>Franquicias, cadenas, empresas</td>
              </tr>
            </tbody>
          </table>
        </div>
        
         

        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: '#ffffff', borderRadius: '18px' }}>
          <button 
            onClick={() => window.open('https://m.me/61563803638340', '_blank')}
            style={{ 
              padding: '1rem 3rem', 
              background: '#000', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '50px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              margin: '0 0.75rem', 
              fontSize: '1.1rem',
              transition: 'all 0.3s',
              marginBottom: '.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1d1d1f';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#000';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Contactar
          </button>
          <button 
            onClick={() => onNavigate('portal')}
            style={{ 
              padding: '1rem 3rem', 
              background: 'transparent', 
              color: '#000000', 
              border: '2px solid #00FFE0', 
              borderRadius: '50px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              margin: '0 0.75rem', 
              fontSize: '1.1rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#00FFE0';
              e.target.style.color = '#000';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#000000';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Ver Demo
          </button>
        </div>
        
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#86868b', fontSize: '0.95rem' }}>
          <p style={{ fontWeight: '600', color: '#ff3b30', marginBottom: '1rem' }}>⏰ Oferta válida hasta fin de mes</p>
          <p style={{ marginBottom: '0.5rem' }}>💡 Actualización = envías tus datos actualizados, nosotros refrescamos tu dashboard</p>
          <p style={{ marginBottom: '0.5rem' }}>📄 Formatos aceptados: Excel, CSV, Google Sheets, Bases de datos SQL</p>
          <p>🧹 Limpieza y análisis de datos incluido en todos los planes</p>
        </div>
      </section> */}

      {/* FAQ Section - Apple Style */}
      <section style={{ 
        maxWidth: '1000px', 
        margin: '4rem auto', 
        padding: '4rem 2rem',
        background: '#ffffff',
        borderRadius: '18px'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          color: '#000', 
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }}>
          Preguntas Frecuentes
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#000', fontWeight: '600' }}>¿Qué datos necesito proporcionar?</h4>
            <p style={{ color: '#86868b', lineHeight: '1.7', fontSize: '1.05rem' }}>Necesitamos acceso a tus datos en formato digital (Excel, CSV, etc.). Si no tienes los datos organizados, podemos ayudarte a limpiarlos.</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#000', fontWeight: '600' }}>¿Cuánto tiempo toma el proceso?</h4>
            <p style={{ color: '#86868b', lineHeight: '1.7', fontSize: '1.05rem' }}>Dependiendo del servicio, la entrega puede ser de 48 a 72 horas para el plan básico y hasta una semana para presentaciones más complejas.</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#000', fontWeight: '600' }}>¿Puedo solicitar cambios después de recibir el servicio?</h4>
            <p style={{ color: '#86868b', lineHeight: '1.7', fontSize: '1.05rem' }}>Sí, ofrecemos una revisión gratuita dentro de los primeros 7 días después de la entrega inicial.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer de precios - Apple Style */}
      <div style={{
        maxWidth: '1000px',
        margin: '3rem auto 4rem',
        padding: '2rem',
        background: '#f5f5f7',
        borderRadius: '18px',
        textAlign: 'center',
        color: '#86868b',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        <span>
          * Los precios mostrados son referenciales y pueden ajustarse según las necesidades y el alcance específico de cada proyecto. Para una cotización personalizada, contáctanos y cuéntanos más sobre tus objetivos.
        </span>
      </div>
    </div>
  );
};

// ==========================================
// PORTAL LOGIN - OPCIÓN 1: CÓDIGO AUTOMÁTICO + HINT
// ==========================================
// El código PADEL2026 se escribe automáticamente
// Un hint apunta al botón "Acceder" con animación

const PortalLogin = ({ onLoginSuccess }) => {
  const [code, setCode] = useState('PADEL2026'); // ← Código pre-llenado
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true); // ← Hint visible al inicio

  const handleLogin = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    setShowHint(false); // Ocultar hint al hacer clic

    try {
      const result = await authService.login(code);
      onLoginSuccess(result.client);
    } catch (err) {
      setError(err.message);
      setShowHint(true); // Mostrar hint de nuevo si hay error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      position: 'relative'
    }}>
      {/* Efecto de brillo de fondo */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0,255,224,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '3.5rem 3rem',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.75rem',
            color: '#000000',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            Portal de Clientes
          </h2>
          <p style={{ 
            color: '#86868b',
            fontSize: '1.1rem',
            fontWeight: '400'
          }}>
            Accede a tu dashboard personalizado
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '0.95rem',
            fontWeight: '500',
            border: '1px solid #ef9a9a'
          }}>
            {error}
          </div>
        )}

        {/* Input Field */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#86868b',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Código de acceso
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setShowHint(false); // Ocultar hint si el usuario escribe
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Ej: PADEL2026"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid #d2d2d7',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontFamily: 'monospace',
              letterSpacing: '3px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#000000',
              transition: 'all 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00FFE0';
              e.target.style.boxShadow = '0 0 0 4px rgba(0,255,224,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d2d2d7';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Botón de Acceso con Hint Animado */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#86868b' : '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.3s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#1d1d1f';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#000000';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>

          {/* Hint Animado (solo visible al inicio) */}
          {showHint && !loading && (
            <div style={{
              position: 'absolute',
              right: '-120px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{
                background: '#00FFE0',
                color: '#000000',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,255,224,0.3)',
                whiteSpace: 'nowrap'
              }}>
                👈 Prueba el demo
              </div>
            </div>
          )}
        </div>

        {/* Info adicional */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1rem',
          background: '#f5f5f7',
          borderRadius: '12px'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#86868b',
            margin: 0,
            lineHeight: '1.5'
          }}>
            💡 Código de prueba pre-cargado.<br/>
            Haz clic en "Acceder" para explorar el demo.
          </p>
        </div>

        {/* Link de ayuda */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#86868b' }}>
            ¿No tienes código?{' '}
            <a 
              href="https://m.me/61563803638340" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#00FFE0', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      {/* CSS para animación del hint */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-50%) translateX(-5px);
          }
        }

        @media (max-width: 768px) {
          /* Hint se mueve arriba en móvil */
          div[style*="right: '-120px'"] {
            right: auto !important;
            top: -60px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// PORTAL DASHBOARD (Simplified)
// ==========================================
const PortalDashboard = ({ client, onLogout }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: portalTheme.bg,
        color: portalTheme.text,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          background: portalTheme.bg,
          padding: '14px 24px',
          borderBottom: `1px solid ${portalTheme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            {client.businessName}
          </h2>
          <p style={{ color: portalTheme.muted, fontSize: '0.875rem', margin: 0 }}>
            Dashboard de Análisis
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '10px 16px',
            background: portalTheme.dangerBg,
            color: '#fff',
            border: `1px solid ${portalTheme.dangerBorder}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '0' }}>
        <div
          style={{
            flex: 1,
            background: portalTheme.bg,
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          {client.dashboardType === 'padel' ? (
            <DashboardPadel client={client} />
          ): null}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CONTACT PAGE - ESTILO APPLE
// ==========================================
const handleCopyEmail = () => {
  navigator.clipboard.writeText('oficialdatao@gmail.com');
  // Mostrar feedback visual
};

const ContactPage = () => {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      
      {/* Hero Section con fondo oscuro */}
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        padding: '8rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo de fondo */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,255,224,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            marginBottom: '1.5rem',
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Hablemos de tu proyecto.
          </h2>
          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#86868b',
            maxWidth: '800px',
            margin: '0 auto',
            fontWeight: '400'
          }}>
            Estamos listos para transformar tus datos en decisiones inteligentes.
          </p>
        </div>
      </section>

      {/* Sección principal con cards */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        background: '#ffffff'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          {/* Card Messenger */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d2d2d7',
            borderRadius: '18px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#0084ff';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,132,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d2d2d7';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
          }}
          >
            {/* Icono */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              boxShadow: '0 10px 30px rgba(0,132,255,0.3)'
            }}>
              💬
            </div>

            <h3 style={{
              fontSize: '1.75rem',
              marginBottom: '1rem',
              color: '#000000',
              fontWeight: '600',
              letterSpacing: '-0.01em'
            }}>
              Messenger
            </h3>

            <p style={{
              color: '#86868b',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Respuesta en tiempo real para tus dudas y proyectos.
            </p>

            <div style={{
              background: '#f5f5f7',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#86868b',
                margin: 0,
                fontWeight: '500'
              }}>
                📅 Lunes a Sábado<br/>
                🕐 10:00 AM - 6:00 PM
              </p>
            </div>

            <a
              href="https://m.me/61563803638340"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: '#0084ff',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1.05rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(0,132,255,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0066cc';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,132,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#0084ff';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 16px rgba(0,132,255,0.3)';
              }}
            >
              Abrir Messenger
            </a>
          </div>

          {/* Card Email */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d2d2d7',
            borderRadius: '18px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00FFE0';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,224,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d2d2d7';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
          }}
          >
            {/* Icono */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #00FFE0 0%, #00d4c0 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              boxShadow: '0 10px 30px rgba(0,255,224,0.3)'
            }}>
              ✉️
            </div>

            <h3 style={{
              fontSize: '1.75rem',
              marginBottom: '1rem',
              color: '#000000',
              fontWeight: '600',
              letterSpacing: '-0.01em'
            }}>
              Email
            </h3>

            <p style={{
              color: '#86868b',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Para proyectos más detallados o cotizaciones formales.
            </p>

            <div style={{
              background: '#f5f5f7',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '0.95rem',
                color: '#000000',
                margin: 0,
                fontWeight: '600',
                fontFamily: 'monospace'
              }}>
                oficialdatao@gmail.com
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: '#86868b',
                margin: '0.5rem 0 0',
                fontWeight: '400'
              }}>
                Respuesta en 24-48 horas
              </p>
            </div>

            <button
              onClick={handleCopyEmail}
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: '#00FFE0',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1.05rem',
                border: '2px solid #00FFE0',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#00FFE0';
                e.target.style.color = '#000000';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#00FFE0';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Copiar Email
            </button>
          </div>

          {/* Card WhatsApp (Opcional - puedes eliminar si no tienes) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d2d2d7',
            borderRadius: '18px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#25D366';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(37,211,102,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d2d2d7';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
          }}
          >
            {/* Icono */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #25D366 0%, #20ba5a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              boxShadow: '0 10px 30px rgba(37,211,102,0.3)'
            }}>
              📱
            </div>

            <h3 style={{
              fontSize: '1.75rem',
              marginBottom: '1rem',
              color: '#000000',
              fontWeight: '600',
              letterSpacing: '-0.01em'
            }}>
              WhatsApp
            </h3>

            <p style={{
              color: '#86868b',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Consultas rápidas y seguimiento de proyectos activos.
            </p>

            <div style={{
              background: '#f5f5f7',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#86868b',
                margin: 0,
                fontWeight: '500'
              }}>
                Próximamente<br/>
                <span style={{ fontSize: '0.8rem' }}>Mientras tanto, usa Messenger 💬</span>
              </p>
            </div>

            <button
              disabled
              style={{
                padding: '1rem 2.5rem',
                background: '#f5f5f7',
                color: '#86868b',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1.05rem',
                cursor: 'not-allowed',
                opacity: 0.5
              }}
            >
              Próximamente
            </button>
          </div>
        </div>
      </section>

      {/* FAQ rápido */}
      <section style={{
        background: '#f5f5f7',
        padding: '5rem 2rem',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '3rem',
            color: '#000000',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          }}>
            ¿Tienes dudas?
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {[
              {
                q: '¿Cuánto tarda la primera respuesta?',
                a: 'En Messenger respondemos en minutos durante horario de atención. Por email, máximo 48 horas.'
              },
              {
                q: '¿Puedo agendar una videollamada?',
                a: 'Sí, escríbenos por Messenger y coordinamos una sesión según tu disponibilidad.'
              },
              {
                q: '¿Atienden fuera de horario?',
                a: 'Los mensajes enviados fuera de horario se responden al siguiente día hábil.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid #d2d2d7',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00FFE0';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,255,224,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d2d2d7';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.75rem',
                  color: '#000000',
                  fontWeight: '600'
                }}>
                  {item.q}
                </h4>
                <p style={{
                  color: '#86868b',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        textAlign: 'center',
        padding: '6rem 2rem',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0,255,224,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1.5rem',
            color: '#ffffff',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          }}>
            ¿Listo para empezar?
          </h3>
          <p style={{
            fontSize: '1.3rem',
            color: '#86868b',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            Hablemos hoy mismo sobre tu proyecto.
          </p>
          <a
            href="https://m.me/61563803638340"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '1.2rem 3rem',
              background: '#00FFE0',
              color: '#000000',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.2rem',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,255,224,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(0,255,224,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,255,224,0.3)';
            }}
          >
            Iniciar conversación
          </a>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// FOOTER COMPONENT
// ==========================================
const Footer = () => {
  return (
    <footer style={{
      background: theme.secondary,
      color: portalTheme.text,
      textAlign: 'center',
      padding: '2rem',
    }}>
      <p>© 2025 DataO. All rights reserved.</p>
      <p style={{ fontSize: '14px', color: '#888', marginTop: '0.5rem' }}>
        Made with 💡 in Mexico
      </p>
    </footer>
  );
};

// ==========================================
// MESSENGER FLOATING BUTTON
// ==========================================
const MessengerButton = () => {
  return (
    <a
      href="https://m.me/61563803638340"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#0084ff',
        color: theme.white,
        padding: '14px 18px',
        borderRadius: '50px',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontWeight: 'bold',
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#006fd6';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#0084ff';
        e.target.style.transform = 'scale(1)';
      }}
    >
      💬 Messenger
    </a>
  );
};

// ==========================================
// MAIN APP
// ==========================================
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [portalClient, setPortalClient] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setPortalClient(null);
  };

  const handlePortalLogin = (client) => {
    setPortalClient(client);
  };

  const handlePortalLogout = () => {
    setPortalClient(null);
  };

  return (
    <div style={{ minHeight: '100vh', 
                  display: 'flex', 
                  flexDirection: 'column',
                  width: '100%',
                  overflow: 'hidden',
                  margin: 0,
                  padding: 0 
                }}>
      {!portalClient && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      
      <main style={{ flex: 1 , width: '100%', overflow: 'hidden'}}>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'services' && <ServicesPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'portal' && !portalClient && (
          <PortalLogin onLoginSuccess={handlePortalLogin} />
        )}
        {currentPage === 'portal' && portalClient && (
          <PortalDashboard client={portalClient} onLogout={handlePortalLogout} />
        )}
      </main>

      {!portalClient && <Footer />}
      {!portalClient && <MessengerButton />}
    </div>
  );
};

export default App;