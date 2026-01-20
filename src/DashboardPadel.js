import React, { useState, useMemo, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  primary: '#00D9FF',
  secondary: '#000000',
  socio: '#00FF88',
  noSocio: '#FFB800',
  male: '#6366F1',
  female: '#FF006E',
  white: '#FFFFFF',
  gray: '#F3F4F6',
  darkGray: '#6B7280',
  border: '#E5E7EB',
  dark: {
    bg: '#000000',
    card: '#0a0a0a',
    border: '#1a1a1a',
    text: '#ffffff'
  }
};

const PadelDashboard = ({ client }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedApp, setSelectedApp] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState(90);
  const [generating, setGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const dashboardRef = useRef(null);
  const insightsRef = useRef(null);
  const dataRef = useRef(null);

  // Detectar cambios de tamaño de pantalla
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para convertir fecha del formato "D-MMM" a número de día del año
  const dateToDay = (dateStr) => {
    const [day, month] = dateStr.split('-');
    const monthMap = { 'Jan': 0, 'Feb': 31, 'Mar': 59 };
    return parseInt(day) + (monthMap[month] || 0);
  };

  // FILTROS APLICADOS
  const filteredData = useMemo(() => {
    const today = 90; // Último día del trimestre (Marzo 31)
    const startDay = selectedPeriod === 7 ? today - 7 : selectedPeriod === 30 ? today - 30 : 0;
    
    return padelBookings.filter(booking => {
      if (selectedCourt !== 'all' && booking.court.toString() !== selectedCourt) return false;
      if (selectedGender !== 'all' && booking.gender !== selectedGender) return false;
      if (selectedApp !== 'all' && booking.application !== selectedApp) return false;
      
      // Filtrar por período
      const bookingDay = dateToDay(booking.date);
      if (bookingDay < startDay) return false;
      
      return true;
    });
  }, [selectedCourt, selectedGender, selectedApp, selectedPeriod]);

  // KPIs CALCULADOS
  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, b) => sum + b.price, 0);
    const totalBookings = filteredData.length;
    const totalHours = filteredData.reduce((sum, b) => sum + b.duration, 0);
    const uniquePlayers = new Set(filteredData.map(b => b.name)).size;
    const avgPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    return { totalRevenue, totalBookings, totalHours, uniquePlayers, avgPrice };
  }, [filteredData]);

  // Stats sin filtros para calcular variaciones
  const totalStats = useMemo(() => {
    const totalRevenue = padelBookings.reduce((sum, b) => sum + b.price, 0);
    const totalBookings = padelBookings.length;
    const totalHours = padelBookings.reduce((sum, b) => sum + b.duration, 0);
    const uniquePlayers = new Set(padelBookings.map(b => b.name)).size;
    return { totalRevenue, totalBookings, totalHours, uniquePlayers };
  }, []);

  // Calcular variaciones más relevantes: comparar con promedio
  const variations = useMemo(() => {
    // Calcular promedio por booking
    const avgRevenuePerBooking = totalStats.totalBookings > 0 ? totalStats.totalRevenue / totalStats.totalBookings : 0;
    const avgHoursPerBooking = totalStats.totalBookings > 0 ? totalStats.totalHours / totalStats.totalBookings : 0;
    
    // Promedio actual en datos filtrados
    const currentAvgRevenue = stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0;
    const currentAvgHours = stats.totalBookings > 0 ? stats.totalHours / stats.totalBookings : 0;
    
    // Variación respecto al promedio (puede ser negativa)
    const revenueVar = avgRevenuePerBooking > 0 ? (((currentAvgRevenue - avgRevenuePerBooking) / avgRevenuePerBooking) * 100).toFixed(1) : 0;
    const bookingsVar = totalStats.totalBookings > 0 ? (((stats.totalBookings - totalStats.totalBookings / 7) / (totalStats.totalBookings / 7)) * 100).toFixed(1) : 0; // Comparar con promedio semanal
    const hoursVar = avgHoursPerBooking > 0 ? (((currentAvgHours - avgHoursPerBooking) / avgHoursPerBooking) * 100).toFixed(1) : 0;
    const playersVar = stats.totalBookings > 0 ? (((stats.uniquePlayers - stats.totalBookings / 2.5) / (stats.totalBookings / 2.5)) * 100).toFixed(1) : 0;
    
    return { revenueVar, bookingsVar, hoursVar, playersVar };
  }, [stats, totalStats]);

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

  // App usage with revenue
  const bookingSourceData = useMemo(() => {
    const appBookings = filteredData.filter(b => b.application === 'Yes').length;
    const directBookings = filteredData.filter(b => b.application === 'No').length;
    const appRevenue = filteredData.filter(b => b.application === 'Yes').reduce((sum, b) => sum + b.price, 0);
    const directRevenue = filteredData.filter(b => b.application === 'No').reduce((sum, b) => sum + b.price, 0);
    
    return [
      { name: 'App Booking', bookings: appBookings, revenue: appRevenue, color: '#10b981' },
      { name: 'Direct Booking', bookings: directBookings, revenue: directRevenue, color: '#f59e0b' }
    ];
  }, [filteredData]);

  // Court utilization
  const courtUtilization = useMemo(() => {
    const courts = {};
    filteredData.forEach(booking => {
      if (!courts[booking.court]) {
        courts[booking.court] = { court: booking.court, bookings: 0, hours: 0, revenue: 0 };
      }
      courts[booking.court].bookings += 1;
      courts[booking.court].hours += booking.duration;
      courts[booking.court].revenue += booking.price;
    });
    return Object.values(courts).sort((a, b) => a.court - b.court);
  }, [filteredData]);

  // PDF GENERATION COMMENTED OUT - NOT IN USE
  /*
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
  */

  const bg = darkMode ? theme.dark.bg : theme.gray;
  const cardBg = darkMode ? theme.dark.card : theme.white;
  const borderColor = darkMode ? theme.dark.border : theme.border;
  const textColor = darkMode ? theme.dark.text : theme.secondary;

  const COLORS = ['#00D9FF', '#00FF88', '#6366F1', '#FF006E', '#FFB800', '#FF1744', '#00E676', '#FF9100'];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: bg, 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
      gridTemplateRows: isMobile ? 'auto 1fr' : '1fr'
    }}>
      {/* SIDEBAR - MENU */}
      <aside style={{
        background: cardBg,
        borderRight: isMobile ? 'none' : `1px solid ${borderColor}`,
        borderBottom: isMobile ? `1px solid ${borderColor}` : 'none',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: '2rem',
        position: isMobile ? 'static' : 'sticky',
        top: isMobile ? 'auto' : 0,
        height: isMobile ? 'auto' : '100vh',
        overflowY: isMobile ? 'visible' : 'auto',
        minWidth: isMobile ? 'auto' : '280px',
        gridColumn: isMobile ? '1' : '1',
        gridRow: isMobile ? '1' : 'auto'
      }}>
        {/* Header del Sidebar */}
        <div style={{ 
          display: isMobile ? 'none' : 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          paddingBottom: '1rem',
          borderBottom: `1px solid ${borderColor}`
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: textColor }}>Padel Club</span>
        </div>



        {/* Navigation */}
        <nav style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'row' : 'column', 
          gap: isMobile ? '0.5rem' : '0.5rem',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <button
            onClick={() => setActiveView('dashboard')}
            style={{
              padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
              background: activeView === 'dashboard' ? '#2563eb' : 'transparent',
              color: textColor,
              border: `1px solid ${activeView === 'dashboard' ? '#2563eb' : borderColor}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeView === 'dashboard' ? '600' : '500',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              textAlign: 'center',
              transition: 'all 0.2s',
              flex: isMobile ? '1' : 'auto',
              minWidth: isMobile ? '100px' : 'auto'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('insights')}
            style={{
              padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
              background: activeView === 'insights' ? '#2563eb' : 'transparent',
              color: textColor,
              border: `1px solid ${activeView === 'insights' ? '#2563eb' : borderColor}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeView === 'insights' ? '600' : '500',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              textAlign: 'center',
              transition: 'all 0.2s',
              flex: isMobile ? '1' : 'auto',
              minWidth: isMobile ? '100px' : 'auto'
            }}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveView('data')}
            style={{
              padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
              background: activeView === 'data' ? '#2563eb' : 'transparent',
              color: textColor,
              border: `1px solid ${activeView === 'data' ? '#2563eb' : borderColor}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeView === 'data' ? '600' : '500',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              textAlign: 'center',
              transition: 'all 0.2s',
              flex: isMobile ? '1' : 'auto',
              minWidth: isMobile ? '100px' : 'auto'
            }}
          >
            Datos relevantes
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ overflowY: 'auto' }}>
    {activeView === 'dashboard' && (
      <>
      {/* PAGE 1: DASHBOARD */}
      <div ref={dashboardRef} style={{ background: bg, minHeight: '100vh', padding: '2rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* HEADER CON FILTROS */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: textColor, margin: 0 }}>
                {client?.businessName || 'Club de Pádel'}
              </h1>
              <p style={{ fontSize: '1rem', color: theme.darkGray, margin: 0, marginTop: '0.25rem' }}>Dashboard de Reservas - Enero a Marzo 2025</p>
            </div>

            {/* Filtros */}
            <div style={{ 
              background: cardBg, 
              border: `2px solid ${borderColor}`, 
              borderRadius: '12px', 
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
              alignItems: 'end'
            }}>
              {/* Filtro de Período */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: theme.primary, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Período</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSelectedPeriod(7)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: `2px solid ${selectedPeriod === 7 ? theme.primary : borderColor}`,
                      background: selectedPeriod === 7 ? theme.primary : 'transparent',
                      color: selectedPeriod === 7 ? '#000' : textColor,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: selectedPeriod === 7 ? '600' : '500',
                      transition: 'all 0.2s',
                      flex: '1',
                      minWidth: '60px'
                    }}
                  >
                    7d
                  </button>
                  <button 
                    onClick={() => setSelectedPeriod(30)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: `2px solid ${selectedPeriod === 30 ? theme.primary : borderColor}`,
                      background: selectedPeriod === 30 ? theme.primary : 'transparent',
                      color: selectedPeriod === 30 ? '#000' : textColor,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: selectedPeriod === 30 ? '600' : '500',
                      transition: 'all 0.2s',
                      flex: '1',
                      minWidth: '60px'
                    }}
                  >
                    30d
                  </button>
                  <button 
                    onClick={() => setSelectedPeriod(90)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: `2px solid ${selectedPeriod === 90 ? theme.primary : borderColor}`,
                      background: selectedPeriod === 90 ? theme.primary : 'transparent',
                      color: selectedPeriod === 90 ? '#000' : textColor,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: selectedPeriod === 90 ? '600' : '500',
                      transition: 'all 0.2s',
                      flex: '1',
                      minWidth: '60px'
                    }}
                  >
                    90d
                  </button>
                </div>
              </div>

              {/* Filtro Cancha */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: theme.primary, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Cancha</label>
                <select value={selectedCourt} onChange={e => setSelectedCourt(e.target.value)} style={{ 
                  width: '100%',
                  padding: '0.6rem 0.75rem', 
                  borderRadius: '6px', 
                  border: `2px solid ${borderColor}`, 
                  background: cardBg, 
                  color: textColor, 
                  fontSize: '0.875rem', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  <option value="all">Todas</option>
                  <option value="1">Cancha 1</option>
                  <option value="2">Cancha 2</option>
                  <option value="3">Cancha 3</option>
                  <option value="4">Cancha 4</option>
                </select>
              </div>

              {/* Filtro Género */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: theme.primary, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Género</label>
                <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)} style={{ 
                  width: '100%',
                  padding: '0.6rem 0.75rem', 
                  borderRadius: '6px', 
                  border: `2px solid ${borderColor}`, 
                  background: cardBg, 
                  color: textColor, 
                  fontSize: '0.875rem', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  <option value="all">Todos</option>
                  <option value="Male">Hombres</option>
                  <option value="Female">Mujeres</option>
                </select>
              </div>

              {/* Filtro Tipo Reserva */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: theme.primary, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Reserva</label>
                <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)} style={{ 
                  width: '100%',
                  padding: '0.6rem 0.75rem', 
                  borderRadius: '6px', 
                  border: `2px solid ${borderColor}`, 
                  background: cardBg, 
                  color: textColor, 
                  fontSize: '0.875rem', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  <option value="all">Todas</option>
                  <option value="Yes">App</option>
                  <option value="No">Directa</option>
                </select>
              </div>

              {/* Botón Limpiar */}
              {(selectedCourt !== 'all' || selectedGender !== 'all' || selectedApp !== 'all' || selectedPeriod !== 90) && (
                <div>
                  <button onClick={() => { setSelectedCourt('all'); setSelectedGender('all'); setSelectedApp('all'); setSelectedPeriod(90); }} style={{ 
                    width: '100%',
                    padding: '0.6rem 1rem', 
                    background: theme.noSocio, 
                    color: theme.white, 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase'
                  }}>
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { title: 'Ingresos Totales', value: `$${stats.totalRevenue.toLocaleString()}`, subtitle: `Promedio: $${stats.avgPrice.toFixed(0)}`, color: theme.socio, variation: variations.revenueVar },
              { title: 'Total Reservas', value: stats.totalBookings, subtitle: 'Slots ocupados', color: theme.primary, variation: variations.bookingsVar },
              { title: 'Horas Totales', value: stats.totalHours.toFixed(1), subtitle: 'Horas jugadas', color: theme.male, variation: variations.hoursVar },
              { title: 'Jugadores Únicos', value: stats.uniquePlayers, subtitle: 'Miembros activos', color: theme.female, variation: variations.playersVar }
            ].map((kpi, i) => {
              const isPositive = parseFloat(kpi.variation) >= 0;
              const variationColor = isPositive ? '#10b981' : '#ef4444';
              const arrow = isPositive ? '↑' : '↓';
              return (
                <div key={i} style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', borderLeft: `4px solid ${kpi.color}`, border: `2px solid ${borderColor}` }}>
                  <p style={{ fontSize: '0.875rem', color: theme.darkGray, marginBottom: '0.5rem' }}>{kpi.title}</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', margin: '0.5rem 0' }}>{kpi.value}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: theme.darkGray, margin: 0 }}>{kpi.subtitle}</p>
                    <span style={{ fontSize: '0.75rem', color: variationColor, fontWeight: 'bold' }}>{arrow} {Math.abs(kpi.variation)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHARTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>Ingresos por Día</h3>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>Reservas por Horario</h3>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>Distribución de Género</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={genderDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="count" label={entry => `${entry.gender}: ${entry.count}`}>
                    {genderDistribution.map((entry) => <Cell key={entry.gender} fill={entry.gender === 'Male' ? '#3b82f6' : '#ec4899'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}`, minWidth: '500px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>Métodos de Reserva</h3>
              
              {/* Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {bookingSourceData.map((source) => {
                  const totalBookings = bookingSourceData.reduce((sum, s) => sum + s.bookings, 0);
                  const percentage = totalBookings > 0 ? ((source.bookings / totalBookings) * 100).toFixed(0) : 0;
                  return (
                    <div key={source.name} style={{ 
                      background: `${source.color}15`,
                      border: `1px solid ${source.color}40`,
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: source.color }} />
                        <span style={{ fontSize: '0.875rem', color: theme.darkGray }}>{source.name}</span>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: textColor }}>
                          {source.bookings}
                          <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: theme.darkGray }}>({percentage}%)</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: source.color }}>
                        ${source.revenue.toFixed(2)} revenue
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={bookingSourceData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis type="number" stroke={theme.darkGray} style={{ fontSize: '12px' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke={theme.darkGray}
                    style={{ fontSize: '12px' }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px' }}
                    formatter={(value) => value}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="bookings" radius={[0, 8, 8, 0]}>
                    {bookingSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: textColor }}>Reservas por Día</h3>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={revenueByDay}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ day, percent }) => `${day}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {revenueByDay.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'][index % 7]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${borderColor}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: cardBg, borderRadius: '12px', padding: '1.5rem', border: `2px solid ${borderColor}`, minWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem', color: textColor }}>Utilización de Canchas</h3>
                <p style={{ fontSize: '0.875rem', color: theme.darkGray, margin: 0 }}>Estadísticas de uso</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {courtUtilization.map((court) => {
                  const maxBookings = Math.max(...courtUtilization.map(c => c.bookings), 1);
                  const percentage = (court.bookings / maxBookings) * 100;
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
                  const courtColor = colors[court.court % colors.length];
                  
                  return (
                    <div key={court.court}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: textColor }}>Cancha {court.court}</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: courtColor }}>{court.bookings}</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '9999px', background: `${borderColor}`, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            background: courtColor,
                            width: `${percentage}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: theme.darkGray, marginTop: '0.25rem' }}>
                        <span>⏱️ {court.hours.toFixed(1)}h</span>
                        <span>💰 ${court.revenue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
            }}>Análisis de Ocupación</h3>
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
            }}>Análisis de Ingresos</h3 >
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
            }}>Perfil de Clientes</h3>
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
            }}>Recomendaciones Estratégicas</h3>
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
      </main>
    </div>
    
  );
};
export default PadelDashboard;

