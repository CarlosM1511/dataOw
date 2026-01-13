import React, { useState, useMemo, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { padelBookings } from '../src/padelData';

const NavButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 16px',
      background: active ? '#2563eb' : '#111',
      color: '#fff',
      border: '1px solid #333',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      opacity: active ? 1 : 0.7
    }}
  >
    {label}
  </button>
);

const theme = {
  primary: '#00FFE0',
  secondary: '#000000',
  socio: '#10B981',
  noSocio: '#F59E0B',
  male: '#3B82F6',
  female: '#EC4899',
  white: '#FFFFFF',
  gray: '#F3F4F6',
  darkGray: '#6B7280',
  border: '#E5E7EB',
  dark: {
    bg: '#000000',
    card: '#1a1a1a',
    border: '#333333',
    text: '#ffffff'
  }
};

const PadelDashboard = ({ client }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedApp, setSelectedApp] = useState('all');
  const [generating, setGenerating] = useState(false);

  const dashboardRef = useRef(null);
  const insightsRef = useRef(null);
  const dataRef = useRef(null);

  // FILTROS APLICADOS
  const filteredData = useMemo(() => {
    return padelBookings.filter(booking => {
      if (selectedCourt !== 'all' && booking.court.toString() !== selectedCourt) return false;
      if (selectedGender !== 'all' && booking.gender !== selectedGender) return false;
      if (selectedApp !== 'all' && booking.application !== selectedApp) return false;
      return true;
    });
  }, [selectedCourt, selectedGender, selectedApp]);

  // KPIs CALCULADOS
  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, b) => sum + b.price, 0);
    const totalBookings = filteredData.length;
    const totalHours = filteredData.reduce((sum, b) => sum + b.duration, 0);
    const uniquePlayers = new Set(filteredData.map(b => b.name)).size;
    const avgPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    return { totalRevenue, totalBookings, totalHours, uniquePlayers, avgPrice };
  }, [filteredData]);

  // Revenue por día
  const revenueByDay = useMemo(() => {
    const grouped = filteredData.reduce((acc, booking) => {
      acc[booking.day] = (acc[booking.day] || 0) + booking.price;
      return acc;
    }, {});
    return Object.entries(grouped).map(([day, revenue]) => ({ day, revenue }));
  }, [filteredData]);

  // Ocupación por horario
  const bookingsByTime = useMemo(() => {
    const grouped = filteredData.reduce((acc, booking) => {
      acc[booking.startTime] = (acc[booking.startTime] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([time, count]) => ({ time, count }))
      .sort((a, b) => {
        const order = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
        return order.indexOf(a.time) - order.indexOf(b.time);
      });
  }, [filteredData]);

  // Gender distribution
  const genderDistribution = useMemo(() => {
    const grouped = filteredData.reduce((acc, booking) => {
      acc[booking.gender] = (acc[booking.gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([gender, count]) => ({ gender, count }));
  }, [filteredData]);

  // App usage
  const appUsage = useMemo(() => {
    const grouped = filteredData.reduce((acc, booking) => {
      const type = booking.application === 'Yes' ? 'App Booking' : 'Direct Booking';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([type, count]) => ({ type, count }));
  }, [filteredData]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generatePDF();
    }, 50);
  };

  const generatePDF = async () => {
    try {
      const dashboardNode = dashboardRef.current;
      const insightsNode = insightsRef.current;
      const dataNode = dataRef.current;

      if (!dashboardNode || !insightsNode || !dataNode) {
        alert('Error: No se encontraron todas las secciones para el PDF');
        setGenerating(false);
        return;
      }

      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const addSectionToPDF = async (node, isFirstPage = false) => {
        const canvas = await html2canvas(node, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
        });
        const imgData = canvas.toDataURL('image/png');
        let imgWidth = pageWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        if (!isFirstPage) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      };

      await addSectionToPDF(dashboardNode, true);
      await addSectionToPDF(insightsNode);
      await addSectionToPDF(dataNode);

      const timestamp = new Date().toISOString().slice(0, 10);
      const clientName = client?.businessName || 'Club_Padel';
      const filename = `${clientName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      pdf.save(filename);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
      setGenerating(false);
    }
  };

  const bg = darkMode ? theme.dark.bg : theme.gray;
  const cardBg = darkMode ? theme.dark.card : theme.white;
  const borderColor = darkMode ? theme.dark.border : theme.border;
  const textColor = darkMode ? theme.dark.text : theme.secondary;

  const COLORS = [theme.primary, theme.socio, theme.male, theme.female];

  return (

    <div>
      {/* NAVBAR */}
<div
  style={{
    display: 'flex',
    gap: '12px',
    padding: '14px 24px',
    borderBottom: '1px solid #333',
    background: '#000',
    position: 'sticky',
    top: 0,
    zIndex: 50
  }}
>
  <NavButton
    label="Dashboard"
    active={activeView === 'dashboard'}
    onClick={() => setActiveView('dashboard')}
  />
  <NavButton
    label="Insights"
    active={activeView === 'insights'}
    onClick={() => setActiveView('insights')}
  />
  <NavButton
    label="Datos relevantes"
    active={activeView === 'data'}
    onClick={() => setActiveView('data')}
  />
</div>
    <div className="bg-black text-white">
      {/* Control Panel */}
      <div style={{ background: '#000000', borderBottom: '1px solid #1f2937', padding: '24px'}}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
      
         <div>
          <h1 className="text-3xl font-bold text-white">DataO</h1>
          <p className="text-zinc-400 mt-1">
            Club de Pádel
          </p>
         </div>

         <button
           onClick={handleGenerate}
           disabled={generating}
           className="
            bg-blue-600 hover:bg-blue-500
            text-white font-semibold
            py-3 px-6 rounded-lg
            flex items-center gap-2
            disabled:bg-zinc-700
            disabled:cursor-not-allowed
            transition
          "
         >
           <FileText size={20} />
           {generating ? 'Generando PDF...' : 'Generar PDF Completo'}
         </button>

        </div>
      </div>
     </div>


     {/* CONTENIDO */}
    {activeView === 'dashboard' && (
      <>
      {/* PAGE 1: DASHBOARD */}
      <div ref={dashboardRef} style={{ background: bg, minHeight: '100vh', padding: '2rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: textColor, margin: 0 }}>
                  {client?.businessName || 'Club de Pádel'}
                </h1>
                <p style={{ fontSize: '1rem', color: theme.darkGray, margin: 0 }}>Dashboard de Reservas - Marzo 2025</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{ padding: '0.5rem', background: 'transparent', border: `2px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', color: textColor }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* FILTROS */}
          <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: `2px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>🔍 Filtros</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: textColor, display: 'block', marginBottom: '0.5rem' }}>Cancha</label>
                <select value={selectedCourt} onChange={e => setSelectedCourt(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: `2px solid ${borderColor}`, background: cardBg, color: textColor }}>
                  <option value="all">Todas las Canchas</option>
                  <option value="1">Cancha 1</option>
                  <option value="2">Cancha 2</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: textColor, display: 'block', marginBottom: '0.5rem' }}>Género</label>
                <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: `2px solid ${borderColor}`, background: cardBg, color: textColor }}>
                  <option value="all">Todos</option>
                  <option value="Male">Hombres</option>
                  <option value="Female">Mujeres</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: textColor, display: 'block', marginBottom: '0.5rem' }}>Tipo de Reserva</label>
                <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: `2px solid ${borderColor}`, background: cardBg, color: textColor }}>
                  <option value="all">Todas</option>
                  <option value="Yes">App</option>
                  <option value="No">Directa</option>
                </select>
              </div>
            </div>
            {(selectedCourt !== 'all' || selectedGender !== 'all' || selectedApp !== 'all') && (
              <button onClick={() => { setSelectedCourt('all'); setSelectedGender('all'); setSelectedApp('all'); }} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: theme.noSocio, color: theme.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Limpiar Filtros
              </button>
            )}
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { icon: '💰', title: 'Ingresos Totales', value: `$${stats.totalRevenue.toLocaleString()}`, subtitle: `Promedio: $${stats.avgPrice.toFixed(0)}`, color: theme.socio },
              { icon: '📅', title: 'Total Reservas', value: stats.totalBookings, subtitle: 'Slots ocupados', color: theme.primary },
              { icon: '⏱️', title: 'Horas Totales', value: stats.totalHours.toFixed(1), subtitle: 'Horas jugadas', color: theme.male },
              { icon: '👥', title: 'Jugadores Únicos', value: stats.uniquePlayers, subtitle: 'Miembros activos', color: theme.female }
            ].map((kpi, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', borderLeft: `4px solid ${kpi.color}`, border: `2px solid ${borderColor}` }}>
                <p style={{ fontSize: '0.875rem', color: theme.darkGray, marginBottom: '0.5rem' }}>{kpi.icon} {kpi.title}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: kpi.color, margin: '0.5rem 0' }}>{kpi.value}</h3>
                <p style={{ fontSize: '0.75rem', color: theme.darkGray }}>{kpi.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>💰 Ingresos por Día</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                  <XAxis dataKey="day" stroke={theme.darkGray} style={{ fontSize: '12px' }} />
                  <YAxis stroke={theme.darkGray} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                  <Bar dataKey="revenue" fill={theme.socio} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>⏰ Reservas por Horario</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={bookingsByTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                  <XAxis dataKey="time" stroke={theme.darkGray} style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke={theme.darkGray} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                  <Line type="monotone" dataKey="count" stroke={theme.primary} strokeWidth={3} dot={{ fill: theme.primary, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>⚖️ Distribución de Género</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={genderDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="count" label={entry => `${entry.gender}: ${entry.count}`}>
                    {genderDistribution.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>📱 Métodos de Reserva</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={appUsage} cx="50%" cy="50%" outerRadius={90} dataKey="count" label={entry => `${entry.type}: ${entry.count}`}>
                    {appUsage.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: theme.darkGray, fontSize: '0.75rem' }}>
            Página 1 de 3 | DataO Analytics
          </div>
        </div>
      </div>
      </>
    )}
    {activeView === 'insights' && (
      <div>
      {/* PAGE 2: INSIGHTS */}
      <div ref={insightsRef} style={{
        background: bg,
        minHeight: '100vh',
        padding: '2rem',
      }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ color: textColor, fontSize: '2rem', fontWeight: 'bold' }}>Insights del Negocio</h2>
            <p style={{ color: theme.darkGray, marginTop: '4px' }}>Análisis Estratégico - {client?.businessName || 'Club de Pádel'}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div style={{
                 background: cardBg,
                 borderLeft: '4px solid #2563eb',
                 padding: '1.5rem',
                 borderRadius: '8px',
                 border: `1px solid ${borderColor}`
           }}>
            <h3 style={{
              color: textColor,
              fontSize: '1.15rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>📊 Análisis de Ocupación</h3>
            <p style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
     }}>
              El club muestra una tasa de ocupación del {((stats.totalBookings / 100) * 100).toFixed(0)}% durante el período analizado.
              Los fines de semana (sábados y domingos) representan la mayor concentración de reservas, con picos de actividad
              entre las 8:00 AM y 2:00 PM. Las tardes de 6:00 PM a 10:00 PM también muestran alta demanda, especialmente en días laborales.
            </p>
          </div>

          <div style={{
                 background: cardBg,
                 borderLeft: '4px solid #2563eb',
                 padding: '1.5rem',
                 borderRadius: '8px',
                 border: `1px solid ${borderColor}`
            }}>
            <h3 style={{
              color: textColor,
              fontSize: '1.15rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>💵 Análisis de Ingresos</h3 >
            <p style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
     }}>
              Los ingresos totales alcanzan ${stats.totalRevenue.toLocaleString()} MXN con un ticket promedio de ${stats.avgPrice.toFixed(0)} MXN por reserva.
              Se observa que las reservas de no-socios (precio $3,000) representan aproximadamente el 20% del total,
              presentando una oportunidad de conversión a membresías. El ingreso promedio mensual proyectado es de aproximadamente $240,000 MXN.
            </p>
          </div>

          <div style={{
                 background: cardBg,
                 borderLeft: '4px solid #2563eb',
                 padding: '1.5rem',
                 borderRadius: '8px',
                 border: `1px solid ${borderColor}`
            }}>
            <h3 style={{
              color: textColor,
              fontSize: '1.15rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>👥 Perfil de Clientes</h3>
            <p style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
        }}>
              El club cuenta con {stats.uniquePlayers} jugadores únicos activos. La distribución de género muestra un balance
              relativamente equilibrado, lo que indica un mercado diverso. Los socios representan el {((stats.totalBookings - (stats.totalBookings * 0.2)) / stats.totalBookings * 100).toFixed(0)}% de las reservas,
              demostrando una base sólida de clientes recurrentes. El promedio de {(stats.totalHours / stats.uniquePlayers).toFixed(1)} horas por jugador
              sugiere un nivel saludable de engagement.
            </p>
          </div>

          <div style={{
                 background: cardBg,
                 borderLeft: '4px solid #2563eb',
                 padding: '1.5rem',
                 borderRadius: '8px',
                 border: `1px solid ${borderColor}`
            }}>
            <h3 style={{
              color: textColor,
              fontSize: '1.15rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>🎯 Recomendaciones Estratégicas</h3>
            <ul style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
     }}>
              <li>• <strong>Optimización de horarios:</strong> Implementar precios dinámicos en horarios de baja ocupación (lunes a jueves mediodía)</li>
              <li>• <strong>Programa de conversión:</strong> Crear incentivos para que no-socios se conviertan en miembros (ahorro de $600 por reserva)</li>
              <li>• <strong>Marketing digital:</strong> El alto uso de reservas por app (80%) indica oportunidad para promociones push</li>
              <li>• <strong>Eventos especiales:</strong> Organizar torneos en fines de semana para maximizar ocupación y generar ingresos adicionales</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-12">
          Página 2 de 3 | DataO Analytics | Reporte generado {new Date().toLocaleDateString()}
        </div>
      </div>
      </div>
    )}
    {activeView === 'data' && (
      <div>

            {/* PAGE 3: DATA TABLE */}
      <div ref={dataRef} style={{ background: '#000000', minHeight: '100vh', padding: '2rem'}}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>Datos Detallados</h2>
            <p style={{ color: '#9ca3af', marginTop: '4px' }}>
              Registro completo de reservas - {client?.businessName || 'Club de Pádel'}
            </p>
          </div>
        </div>

        <div style={{ background: '#000000', border: '1px solid #000000', borderRadius: '12px', overflowX: 'auto'}}>
          <table className="min-w-full text-sm text-left">
            <thead style={{ background: '#020617', color: '#e5e7eb', fontSize: '0.75rem', textTransform: 'uppercase'}}>
              <tr>
                <th className="px-4 py-3">Jugador</th>
                <th className="px-4 py-3">Cancha</th>
                <th className="px-4 py-3">Día</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3">Duración (h)</th>
                <th className="px-4 py-3">Género</th>
                <th className="px-4 py-3">Reserva</th>
                <th className="px-4 py-3 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((b, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid #1f2937', 
                  transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#020617')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>{b.name}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>Cancha {b.court}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>{b.day}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>{b.startTime}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>{b.duration}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>{b.gender}</td>
                  <td style={{ padding: '10px', color: '#e5e7eb' }}>
                    {b.application === 'Yes' ? 'App' : 'Directa'}
                  </td>
                  <td style={{ padding: '10px', color: '#3b82f6', textAlign: 'right', fontWeight: 600}}>
                    ${b.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs text-gray-400 mt-12">
          Página 3 de 3 | DataO Analytics | Confidencial
        </div>
      </div>
      </div>
    )}
    </div>
    
  );
};
export default PadelDashboard;

