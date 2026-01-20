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
                <a
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
              <a
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
// HOME PAGE
// ==========================================
const HomePage = ({ onNavigate }) => {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box', overflow: 'hidden' }}> 
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '5rem 1rem',
        background: theme.gray,
        fontSize: '1.18rem',
        width: '100%',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '1rem',
          color: theme.secondary
        }}>
          Smart Data for Smart Decisions
        </h2>
        <p style={{
          fontSize: '1.3rem',
          color: theme.darkGray,
          marginBottom: '2rem'
        }}>
          Convertimos tus datos en decisiones accionables.
        </p>
        <button
          onClick={() => onNavigate('services')}
          style={{
            padding: '1.1rem 2.5rem',
            background: theme.secondary,
            color: theme.white,
            border: `2px solid ${theme.secondary}`,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '22px',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = theme.primary;
            e.target.style.color = theme.secondary;
            e.target.style.borderColor = theme.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.secondary;
            e.target.style.color = theme.white;
            e.target.style.borderColor = theme.secondary;
          }}
        >
          Aumenta tus ganancias hoy
        </button>
      </section>

      {/* About Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '3rem auto',
        padding: '0 2rem',
        textAlign: 'center',
        fontSize: '1.13rem'
      }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Qué es DataO?</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: theme.darkGray }}>
          DataO es una solución de análisis de datos para pequeñas y medianas empresas que quieren tomar decisiones más inteligentes basadas en información real y no en suposiciones. Creamos dashboards personalizados y te ayudamos a entender tus números de forma clara, simple y visual.
        </p>
      </section>

      {/* Benefits Cards */}
      <section style={{
        maxWidth: '1200px',
        margin: '3rem auto',
        padding: '0 2rem',
        fontSize: '1.13rem'
      }}>
        <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          ¿Por qué elegir DataO?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { emoji: '📊', title: 'Visualización Clara', desc: 'Presentamos tus datos en dashboards intuitivos y fáciles de entender.' },
            { emoji: '🎯', title: 'Análisis Personalizado', desc: 'Cada negocio es único. Adaptamos el análisis a tus necesidades específicas.' },
            { emoji: '💡', title: 'Decisiones Efectivas', desc: 'Te ayudamos a tomar decisiones basadas en datos concretos y actualizados.' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: theme.gray,
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,255,224,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{item.emoji}</div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ color: theme.darkGray }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Botón a Preguntas Frecuentes */}
      <div style={{ maxWidth: '800px', margin: '2rem auto 0', textAlign: 'center' }}>
        <button
          style={{
            padding: '1.1rem 2.5rem',
            background: theme.primary,
            color: theme.secondary,
            border: `2px solid ${theme.primary}`,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '22px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            transition: 'all 0.3s'
          }}
          onClick={() => {
            if (onNavigate) {
              onNavigate('services');
              setTimeout(() => {
                const faqSection = document.querySelector('.faq');
                if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });
              }, 400);
            }
          }}
          onMouseEnter={e => {
            e.target.style.background = theme.secondary;
            e.target.style.color = theme.white;
            e.target.style.borderColor = theme.secondary;
          }}
          onMouseLeave={e => {
            e.target.style.background = theme.primary;
            e.target.style.color = theme.secondary;
            e.target.style.borderColor = theme.primary;
          }}
        >
          Ir a Preguntas Frecuentes
        </button>
      </div>

      {/* Testimonial */}
      <section style={{
        maxWidth: '800px',
        margin: '4rem auto',
        padding: '0 2rem',
        textAlign: 'center',
        fontSize: '1.13rem'
      }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Lo que dicen nuestros clientes</h3>
        <blockquote style={{
          fontStyle: 'italic',
          fontSize: '1.2rem',
          color: theme.darkGray,
          padding: '2rem',
          background: theme.gray,
          borderLeft: `4px solid ${theme.primary}`,
          borderRadius: '8px'
        }}>
          "Gracias a DataO entendimos qué productos eran rentables y cuáles no. Ahora tomamos decisiones basadas en datos, no en corazonadas."
        </blockquote>
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Ana González<br/>
          <span style={{ color: theme.darkGray }}>Dueña de EcoTiendita</span>
        </p>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            style={{
              padding: '1.1rem 2.5rem',
              background: theme.primary,
              color: theme.secondary,
              border: `2px solid ${theme.primary}`,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '22px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: '2rem',
              transition: 'all 0.3s'
            }}
            onClick={() => onNavigate('portal')}
            onMouseEnter={e => {
              e.target.style.background = theme.secondary;
              e.target.style.color = theme.white;
              e.target.style.borderColor = theme.secondary;
            }}
            onMouseLeave={e => {
              e.target.style.background = theme.primary;
              e.target.style.color = theme.secondary;
              e.target.style.borderColor = theme.primary;
            }}
          >
            Ver Demo
          </button>
        </div>
      </section>

      {/* Process */}
      <section style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem'
      }}>
        <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          ¿Cómo funciona DataO?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { num: '1', title: 'Envía tus datos', desc: 'Selecciona un servicio y envíanos tu archivo (.csv, Excel o Google Sheets).' },
            { num: '2', title: 'Proceso y limpieza', desc: 'Procesamos tus datos, limpiamos errores y generamos un dashboard informativo.' },
            { num: '3', title: 'Recibe resultados', desc: 'Te enviamos tu dashboard por correo o WhatsApp, listo para tomar decisiones.' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: theme.white,
                border: `2px solid ${theme.gray}`,
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: theme.primary,
                color: theme.secondary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                {item.num}
              </div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ color: theme.darkGray }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ==========================================
// SERVICES PAGE
// ==========================================
const ServicesPage = ({ onNavigate }) => {
  const services = [
    {
      name: 'Dashboard Básico',
      price: '$750 MXN',
      features: ['✓ Limpieza de datos', '✓ 2 a 3 gráficas informativas', '✓ Acceso a Portal', '⏱ 48–72h de entrega']
    },
    {
      name: 'Análisis con Insights',
      price: '$1500 MXN',
      features: ['✓ Todo lo del plan básico', '✓ Informe escrito con hallazgos clave', '✓ Recomendaciones para mejorar', '✓ Soporte por WhatsApp']
    },
    {
      name: 'Presentación Ejecutiva',
      price: '$2000 MXN',
      features: ['✓ Todo lo de los otros planes', '✓ Presentación profesional', '✓ Video o llamada explicativa', '✓ Atención personalizada']
    }
  ];

  return (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontSize: '1.13rem' }}>
      <section style={{ textAlign: 'center', padding: '3rem 1rem', background: theme.gray, borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nuestros Servicios</h2>
        <p style={{ fontSize: '1.2rem', color: theme.darkGray }}>
          Transformamos tus datos en decisiones claras y accionables.
        </p>
      </section>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {services.map((service, idx) => (
          <div
            key={idx}
            style={{
              background: theme.white,
              border: `2px solid ${theme.gray}`,
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,255,224,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.gray;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.name}</h3>
            <ul style={{ textAlign: 'left', marginBottom: '1rem', listStyle: 'none', padding: 0 }}>
              {service.features.map((feature, i) => (
                <li key={i} style={{ padding: '0.5rem 0', color: theme.darkGray }}>{feature}</li>
              ))}
            </ul>
            <div style={{ fontSize: '1rem', color: theme.darkGray, marginBottom: '0.25rem', fontWeight: 'bold' }}>Precio inicial</div>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>
              {service.price}
            </p>
            <button
              onClick={() => window.open('https://m.me/61563803638340', '_blank')}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: theme.secondary,
                color: theme.white,
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              <span style={{ fontSize: '18px', display: 'inline-block' }}>Contactar</span>
            </button>
            <button
              onClick={onNavigate ? () => onNavigate('portal') : () => { window.location.hash = '#portal'; }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: theme.primary,
                color: theme.secondary,
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                marginTop: '0.25rem'
              }}
            >
              <span style={{ fontSize: '18px', display: 'inline-block' }}>Ver Demo</span>
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img src={process.env.PUBLIC_URL + '/img/tabla-servicios.png'} alt="Tabla comparativa de servicios" style={{ maxWidth: '1000px', width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
          <button
            style={{ marginTop: '12px', background: theme.primary, color: theme.secondary, fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onClick={() => window.open(process.env.PUBLIC_URL + '/img/tabla-servicios.png', '_blank')}
          >
            Abrir imagen en nueva pestaña
          </button>
        </div>
      </div>
  <section className="faq" style={{ marginTop: '4rem', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', background: theme.white, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', padding: '2rem' }}>
  <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', color: '#000', fontWeight: 'bold' }}>Preguntas Frecuentes</h3>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: theme.darkGray }}>¿Qué datos necesito proporcionar?</h4>
          <p style={{ color: theme.darkGray, lineHeight: '1.6' }}>Necesitamos acceso a tus datos en formato digital (Excel, CSV, etc.). Si no tienes los datos organizados, podemos ayudarte a limpiarlos.</p>
        </div>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: theme.darkGray }}>¿Cuánto tiempo toma el proceso?</h4>
          <p style={{ color: theme.darkGray, lineHeight: '1.6' }}>Dependiendo del servicio, la entrega puede ser de 48 a 72 horas para el plan básico y hasta una semana para presentaciones más complejas.</p>
        </div>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: theme.darkGray }}>¿Puedo solicitar cambios después de recibir el servicio?</h4>
          <p style={{ color: theme.darkGray, lineHeight: '1.6' }}>Sí, ofrecemos una revisión gratuita dentro de los primeros 7 días después de la entrega inicial.</p>
        </div>
      </section>
      {/* Disclaimer de precios */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem 2rem',
        background: theme.gray,
        borderRadius: '10px',
        textAlign: 'center',
        color: theme.darkGray,
        fontSize: '1.08rem',
        fontStyle: 'italic',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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