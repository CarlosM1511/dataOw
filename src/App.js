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
    { id: 'services', label: 'Servicios' },
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
              Ver planes
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
          Ver planes
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

// SERVICES PAGE - ESTILO APPLE
// ==========================================
// Mantiene TODO el contenido original, solo cambia el estilo visual

const ServicesPage = ({ onNavigate }) => {
  const services = [
    {
      name: 'Dashboard Básico',
      price: '$499 MXN',
      oldPrice: '$999 MXN',
      idealFor: 'Negocios pequeños, freelancers, emprendedores',
      features: [
        '✓ 4 gráficas clave',
        '✓ 2 KPIs principales', 
        '✓ 2 meses de acceso GRATIS',
        '✓ 1 actualización mensual',
        '✓ 1 revisión gratuita',
        '✓ Sin permanencia',
        '⏱ 3–5 días hábiles'
      ],
      renewal: '$200/mes después'
    },
    {
      name: 'Dashboard Pro',
      price: '$999 MXN',
      oldPrice: '$1,999 MXN',
      idealFor: 'PYMEs, tiendas, restaurantes, clínicas',
      features: [
        '✓ 6 gráficas avanzadas',
        '✓ 4 KPIs estratégicos',
        '✓ 2 secciones completas',
        '✓ 2 meses de acceso GRATIS',
        '✓ 1 actualización mensual',
        '✓ 2 revisiones gratuitas',
        '✓ Soporte WhatsApp',
        '✓ Sin permanencia'
      ],
      renewal: '$300/mes después'
    },
    {
      name: 'Dashboard Premium',
      price: '$1,749 MXN',
      oldPrice: '$3,499 MXN',
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
      ],
      renewal: '$500/mes después'
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
          marginBottom: '6rem'
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

              {/* Precio */}
              <div style={{ 
                marginBottom: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #f5f5f7'
              }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#86868b', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Precio inicial
                </div>
                
                {service.oldPrice && (
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#86868b', 
                    textDecoration: 'line-through', 
                    marginBottom: '0.25rem',
                    fontWeight: '400'
                  }}>
                    {service.oldPrice}
                  </p>
                )}
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
                  <p style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: '#000000', 
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {service.price}
                  </p>
                  
                  {service.oldPrice && (
                    <div style={{ 
                      background: '#34c759', 
                      color: '#ffffff', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600'
                    }}>
                      50% OFF
                    </div>
                  )}
                </div>

                <p style={{ 
                  fontSize: '0.8rem', 
                  color: '#ff3b30', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  ⏰ Oferta válida hasta fin de mes
                </p>
                
                {service.renewal && (
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#86868b', 
                    fontWeight: '400'
                  }}>
                    Renovación: {service.renewal}
                  </p>
                )}
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

      {/* Tabla Comparativa - SIN CAMBIOS (mantener como está) */}
      <section style={{ 
      
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
        
        {/* Botones CTA */}
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
              margin: '0 0.5rem', 
              fontSize: '1.1rem',
              transition: 'all 0.3s'
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
              margin: '0 0.5rem', 
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
        
        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#86868b', fontSize: '0.95rem' }}>
          <p style={{ fontWeight: '600', color: '#ff3b30', marginBottom: '1rem' }}>⏰ Oferta válida hasta fin de mes</p>
          <p style={{ marginBottom: '0.5rem' }}>💡 Actualización = envías tus datos actualizados, nosotros refrescamos tu dashboard</p>
          <p style={{ marginBottom: '0.5rem' }}>📄 Formatos aceptados: Excel, CSV, Google Sheets, Bases de datos SQL</p>
          <p>🧹 Limpieza y análisis de datos incluido en todos los planes</p>
        </div>
      </section>

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
// PORTAL LOGIN
// ==========================================
const PortalLogin = ({ onLoginSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!code) return;
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(code);
      onLoginSuccess(result.client);
    } catch (err) {
      setError(err.message);
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
      background: `linear-gradient(135deg, ${theme.secondary} 0%, #1a1a1a 100%)`
    }}>
      <div style={{
        background: theme.white,
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Portal de Clientes</h2>
          <p style={{ color: theme.darkGray }}>Ingresa tu código de acceso</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Ej: ECOT2023"
          style={{
            width: '100%',
            padding: '1rem',
            border: `2px solid ${theme.gray}`,
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '1rem',
            fontFamily: 'monospace',
            letterSpacing: '2px',
            textAlign: 'center'
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: theme.secondary,
            color: theme.white,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Verificando...' : '🔐 Acceder'}
        </button>

        <details style={{ marginTop: '2rem', textAlign: 'center' }}>
          <summary style={{ cursor: 'pointer', color: theme.darkGray, fontSize: '14px' }}>
            Ver códigos de prueba
          </summary>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PADEL2026'].map(c => (
              <code
                key={c}
                onClick={() => setCode(c)}
                style={{
                  background: theme.gray,
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {c}
              </code>
            ))}
          </div>
        </details>
      </div>
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
// CONTACT PAGE
// ==========================================
const ContactPage = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: theme.white,
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>¿Hablamos?</h2>
        <p style={{ fontSize: '1.2rem', color: theme.darkGray, marginBottom: '1rem' }}>
          Atendemos tus dudas y proyectos por Messenger en tiempo real.
        </p>
        <p style={{ color: theme.darkGray, marginBottom: '2rem' }}>
          Horario: Lunes a Sábado · 10am a 6pm
        </p>
        <a
          href="https://m.me/61563803638340"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: '#0084ff',
            color: theme.white,
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(0,132,255,0.3)'
          }}
        >
          💬 Escríbenos por Messenger
        </a>
      </div>
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
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
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

      <Footer />
      <MessengerButton />
    </div>
  );
};

export default App;