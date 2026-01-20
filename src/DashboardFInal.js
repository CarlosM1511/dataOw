import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Clean EmbeddedDashboard component (separate file to avoid the corrupted original).
// Make sure `recharts` and `lucide-react` are installed in the project.

const EcotiendaPDFReport = ({ client }) => {
      const [data, setData] = useState(null);
      const [generating, setGenerating] = useState(false);
      const dashboardRef = useRef(null);
      const insightsRef = useRef(null);
      const catalogRef = useRef(null);
      const dashboardContentRef = useRef(null);

  useEffect(() => {
    generateData();
  }, []);

  const generateData = () => {
    const products = {
      'Snacks Saludables': [
        { name: 'Chips de Kale', price: 45 },
        { name: 'Nueces Mixtas Premium', price: 85 },
        { name: 'Barritas de Granola', price: 35 },
        { name: 'Almendras Naturales', price: 95 },
        { name: 'Frutos Secos Mix', price: 75 },
        { name: 'Galletas de Avena', price: 40 },
        { name: 'Trail Mix Orgánico', price: 65 }
      ],
      'Bebidas Naturales': [
        { name: 'Kombucha Natural', price: 55 },
        { name: 'Jugo Verde Detox', price: 48 },
        { name: 'Agua de Coco', price: 42 },
        { name: 'Té Matcha Orgánico', price: 120 },
        { name: 'Smoothie de Frutas', price: 52 },
        { name: 'Leche de Almendras', price: 58 }
      ],
      'Productos Orgánicos': [
        { name: 'Miel Orgánica 500g', price: 180 },
        { name: 'Quinoa Blanca 1kg', price: 95 },
        { name: 'Aceite de Coco', price: 150 },
        { name: 'Pasta Integral', price: 48 },
        { name: 'Café Orgánico', price: 135 },
        { name: 'Arroz Integral', price: 55 }
      ],
      'Productos Eco-Limpieza': [
        { name: 'Detergente Biodegradable', price: 85 },
        { name: 'Jabón Líquido Natural', price: 68 },
        { name: 'Limpiador Multiusos Eco', price: 72 },
        { name: 'Esponjas Biodegradables', price: 35 },
        { name: 'Shampoo Sólido', price: 95 }
      ],
      'Productos Premium': [
        { name: 'Aceite de Oliva Extra Virgen', price: 285 },
        { name: 'Superfoods Mix', price: 320 },
        { name: 'Proteína Vegana Premium', price: 450 },
        { name: 'Spirulina Orgánica', price: 380 },
        { name: 'Colágeno Vegetal', price: 420 }
      ]
    };

    const profitMargins = {
      'Snacks Saludables': [0.35, 0.40, 0.38, 0.42],
      'Bebidas Naturales': [0.32, 0.36, 0.34, 0.38],
      'Productos Orgánicos': [0.28, 0.32, 0.30, 0.35],
      'Productos Eco-Limpieza': [0.30, 0.35, 0.33, 0.37],
      'Productos Premium': [0.42, 0.48, 0.45, 0.50]
    };

    const rows = [];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    for (let i = 1; i <= 100; i++) {
      const category = Object.keys(products)[Math.floor(Math.random() * Object.keys(products).length)];
      const productList = products[category];
      const product = productList[Math.floor(Math.random() * productList.length)];
      
      let month = Math.floor(Math.random() * 12) + 1;
      if (Math.random() > 0.7) {
        month = 8 + Math.floor(Math.random() * 3);
      }
      
      const unitsSold = Math.floor(Math.random() * 5) + 1;
      const unitPrice = product.price + (Math.random() * 10 - 5);
      const saleAmount = unitsSold * unitPrice;
      const profitMargin = profitMargins[category][Math.floor(Math.random() * profitMargins[category].length)];
      const ticketSize = Math.floor(Math.random() * 150) + 50;

      rows.push({
        category,
        month: months[month - 1],
        monthNum: month,
        saleAmount,
        profitMargin: profitMargin * 100,
        ticketSize
      });
    }

    processData(rows);
  };

  const processData = (rows) => {
    const ventasCategoria = {};
    rows.forEach(row => {
      if (!ventasCategoria[row.category]) ventasCategoria[row.category] = 0;
      ventasCategoria[row.category] += row.saleAmount;
    });

    const ventasCategoriaData = Object.entries(ventasCategoria).map(([name, value]) => ({
      name: name.replace('Productos ', ''),
      ventas: Math.round(value)
    })).sort((a, b) => b.ventas - a.ventas);

    const margenCategoria = {};
    const countCategoria = {};
    rows.forEach(row => {
      if (!margenCategoria[row.category]) {
        margenCategoria[row.category] = 0;
        countCategoria[row.category] = 0;
      }
      margenCategoria[row.category] += row.profitMargin;
      countCategoria[row.category]++;
    });

    const margenCategoriaData = Object.entries(margenCategoria).map(([name, value]) => ({
      name: name.replace('Productos ', ''),
      margen: parseFloat((value / countCategoria[name]).toFixed(1))
    })).sort((a, b) => b.margen - a.margen);

    const ventasMensuales = {};
    rows.forEach(row => {
      if (!ventasMensuales[row.month]) ventasMensuales[row.month] = 0;
      ventasMensuales[row.month] += row.saleAmount;
    });

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ventasMensualesData = months.map(month => ({
      mes: month.substring(0, 3),
      ventas: Math.round(ventasMensuales[month] || 0)
    }));

    const ticketMensual = {};
    const countMensual = {};
    rows.forEach(row => {
      if (!ticketMensual[row.month]) {
        ticketMensual[row.month] = 0;
        countMensual[row.month] = 0;
      }
      ticketMensual[row.month] += row.ticketSize;
      countMensual[row.month]++;
    });

    const ticketPromedioData = months.map(month => ({
      mes: month.substring(0, 3),
      ticket: Math.round(ticketMensual[month] / (countMensual[month] || 1))
    }));

    setData({
      ventasCategoria: ventasCategoriaData,
      margenCategoria: margenCategoriaData,
      ventasMensuales: ventasMensualesData,
      ticketPromedio: ticketPromedioData
    });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generatePDF();
    }, 50);
  };

  const generatePDF = async () => {
    try {
      // Referencias a cada sección
      const dashboardNode = dashboardRef.current;
      const insightsNode = insightsRef.current;
      const catalogNode = catalogRef.current;

      if (!dashboardNode || !insightsNode || !catalogNode) {
        alert('Error: No se encontraron todas las secciones para el PDF');
        setGenerating(false);
        return;
      }

      // Configuración PDF
    const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Helper para capturar y agregar una sección
      const addSectionToPDF = async (node, isFirstPage = false) => {
        const canvas = await html2canvas(node, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
        });
        const imgData = canvas.toDataURL('image/png');
        // Calcular tamaño proporcional
        let imgWidth = pageWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        if (!isFirstPage) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      };

      // Capturar y agregar cada sección
      await addSectionToPDF(dashboardNode, true);
      await addSectionToPDF(insightsNode);
      await addSectionToPDF(catalogNode);

      // Guardar PDF
      const timestamp = new Date().toISOString().slice(0, 10);
      const clientName = client?.businessName || 'Reporte';
      const filename = `${clientName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      pdf.save(filename);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
      setGenerating(false);
    }
  };

  // ...existing code...
  if (!data) return <div style={{ padding: 20 }}>Cargando dashboard...</div>;
  return (
      <div className="min-h-screen bg-white">
        {/* Control Panel */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DataO</h1>
              <p className="text-gray-600 mt-1">Generador de Reporte - Paquete 2</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
            >
              <FileText size={20} />
              {generating ? 'Generando PDF...' : 'Generar PDF Completo'}
            </button>
          </div>
        </div>
      <div ref={dashboardContentRef}>
        {/* Page 1: Dashboard */}
  <div ref={dashboardRef} className="max-w-screen-2xl mx-auto p-8 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Reporte Ecotiendita</h2>
              <p className="text-lg text-gray-600 mt-1">Dashboard General — Año 2023</p>
            </div>
            <div className="text-right">
              <img src="/img/lupita2.png" alt="Lupita" className="h-24 w-auto mx-auto mb-2" />
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Chart 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Categoría (MXN)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.ventasCategoria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}`} />
                  <Tooltip formatter={(value) => `${value}`} />
                  <Bar dataKey="ventas" fill="#4A90E2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* Chart 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Margen por Categoría (%)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.margenCategoria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="margen" fill="#34D399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* Chart 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas Mensuales (MXN) - 2023</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}`} />
                  <Tooltip formatter={(value) => `${value}`} />
                  <Line type="monotone" dataKey="ventas" stroke="#4A90E2" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
  
            {/* Chart 4 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ticket Promedio Mensual (MXN)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.ticketPromedio}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value}`} />
                  <Tooltip formatter={(value) => `${value}`} />
                  <Bar dataKey="ticket" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="text-center text-xs text-gray-400 mt-8">
            Página 1 de 3 | DataO Analytics
          </div>
        </div>
  
        {/* Page 2: Insights */}
  <div ref={insightsRef} className="max-w-screen-2xl mx-auto p-8 min-h-screen border-t-4 border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Insights del Negocio</h2>
              <p className="text-lg text-gray-600 mt-1">Análisis Descriptivo — Ecotiendita 2023</p>
            </div>
            <div className="text-right">
              <img src="/img/lupita2.png" alt="Lupita" className="h-24 w-auto mx-auto mb-2" />
            </div>
          </div>
  
          <div className="space-y-8">
            {/* Insight 1: Distribución de Ventas */}
            <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Distribución de Ventas por Categoría</h3>
              <p className="text-gray-700 leading-relaxed">
                La categoría Snacks Saludables representa una proporción significativa del total de ventas del período analizado. 
                Los Productos Premium, aunque menos frecuentes en volumen, contribuyen de manera notable al valor total de las transacciones. 
                Se observa que las Bebidas Naturales mantienen un nivel de ventas consistente a lo largo del año.
              </p>
            </div>
  
            {/* Insight 2: Márgenes */}
            <div className="bg-gray-50 border-l-4 border-green-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Análisis de Márgenes de Rentabilidad</h3>
              <p className="text-gray-700 leading-relaxed">
                El margen promedio más alto se encuentra en la categoría de Productos Premium, con valores que superan el 40%. 
                Los Snacks Saludables presentan márgenes superiores al 35%, situándose como la segunda categoría más rentable. 
                Los Productos Orgánicos muestran márgenes más moderados, reflejando la estructura de costos característica de este segmento.
              </p>
            </div>
  
            {/* Insight 3: Tendencia Temporal */}
            <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comportamiento de Ventas Mensuales</h3>
              <p className="text-gray-700 leading-relaxed">
                Se observa un crecimiento notable en el período comprendido entre agosto y octubre de 2023. 
                Las ventas experimentan fluctuaciones naturales durante el año, con ciertos meses presentando picos que superan el promedio general. 
                La tendencia muestra una actividad comercial dinámica con períodos de mayor intensidad en la segunda mitad del año.
              </p>
            </div>
  
            {/* Insight 4: Ticket Promedio */}
            <div className="bg-gray-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comportamiento del Ticket Promedio</h3>
              <p className="text-gray-700 leading-relaxed">
                El ticket promedio muestra un patrón relativamente estable a lo largo del año, con valores que oscilan entre los $90 y $120 pesos. 
                Se identifican ligeros picos en meses específicos, lo cual puede estar asociado a la composición del mix de productos vendidos. 
                La estabilidad del ticket sugiere un comportamiento de compra consistente por parte de los clientes.
              </p>
            </div>
  
            {/* Insight 5: Observaciones Generales */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Observaciones Generales del Período</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                El análisis del año 2023 revela un desempeño comercial diversificado en Ecotiendita. La combinación de categorías 
                de alto margen con productos de rotación frecuente genera un balance favorable en la estructura de ingresos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Los datos muestran que existe una base de clientes recurrentes significativa, y el mix de productos 
                refleja una alineación con el posicionamiento de tienda eco-friendly enfocada en salud y sustentabilidad.
              </p>
            </div>
          </div>
  
          <div className="text-center text-xs text-gray-400 mt-12">
            Página 2 de 3 | DataO Analytics | Reporte generado en diciembre 2024
          </div>
        </div>
  
        {/* Page 3: Product Catalog */}
  <div ref={catalogRef} className="max-w-screen-2xl mx-auto p-8 min-h-screen border-t-4 border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h2>
              <p className="text-lg text-gray-600 mt-1">Inventario Completo — Ecotiendita 2023</p>
            </div>
            <div className="text-right">
              <img src="/img/lupita2.png" alt="Lupita" className="h-24 w-auto mx-auto mb-2" />

            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-6">
            {/* Snacks Saludables */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Snacks Saludables
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Chips de Kale</span>
                  <span className="font-semibold text-blue-600">$45</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Barritas de Granola</span>
                  <span className="font-semibold text-blue-600">$35</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Galletas de Avena</span>
                  <span className="font-semibold text-blue-600">$40</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Trail Mix Orgánico</span>
                  <span className="font-semibold text-blue-600">$65</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Frutos Secos Mix</span>
                  <span className="font-semibold text-blue-600">$75</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Nueces Mixtas Premium</span>
                  <span className="font-semibold text-blue-600">$85</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span>Almendras Naturales</span>
                  <span className="font-semibold text-blue-600">$95</span>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-600">
                <span className="font-semibold">Margen promedio:</span> 35-42%
              </div>
            </div>

            {/* Bebidas Naturales */}
            <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                Bebidas Naturales
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Kombucha Natural</span>
                  <span className="font-semibold text-cyan-600">$55</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Jugo Verde Detox</span>
                  <span className="font-semibold text-cyan-600">$48</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Agua de Coco</span>
                  <span className="font-semibold text-cyan-600">$42</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Té Matcha Orgánico</span>
                  <span className="font-semibold text-cyan-600">$120</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Smoothie de Frutas</span>
                  <span className="font-semibold text-cyan-600">$52</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span>Leche de Almendras</span>
                  <span className="font-semibold text-cyan-600">$58</span>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-cyan-200 text-sm text-gray-600">
                <span className="font-semibold">Margen promedio:</span> 32-38%
              </div>
            </div>
  
            {/* Productos Orgánicos */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Productos Orgánicos
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Miel Orgánica 500g</span>
                  <span className="font-semibold text-green-600">$180</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Quinoa Blanca 1kg</span>
                  <span className="font-semibold text-green-600">$95</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Aceite de Coco</span>
                  <span className="font-semibold text-green-600">$150</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Pasta Integral</span>
                  <span className="font-semibold text-green-600">$48</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Café Orgánico</span>
                  <span className="font-semibold text-green-600">$135</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span>Arroz Integral</span>
                  <span className="font-semibold text-green-600">$55</span>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-green-200 text-sm text-gray-600">
                <span className="font-semibold">Margen promedio:</span> 28-35%
              </div>
            </div>
  
            {/* Productos Eco-Limpieza */}
            <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                Productos Eco-Limpieza
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Esponjas Biodegradables</span>
                  <span className="font-semibold text-teal-600">$35</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Jabón Líquido Natural</span>
                  <span className="font-semibold text-teal-600">$68</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Limpiador Multiusos Eco</span>
                  <span className="font-semibold text-teal-600">$72</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span>Detergente Biodegradable</span>
                  <span className="font-semibold text-teal-600">$85</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span>Shampoo Sólido</span>
                  <span className="font-semibold text-teal-600">$95</span>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-teal-200 text-sm text-gray-600">
                <span className="font-semibold">Margen promedio:</span> 30-37%
              </div>
            </div>
          </div>
  
          {/* Productos Premium - Full Width */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
              Productos Premium
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="font-medium">Aceite de Oliva Extra Virgen</span>
                  <span className="font-bold text-purple-600">$285</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="font-medium">Superfoods Mix</span>
                  <span className="font-bold text-purple-600">$320</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Spirulina Orgánica</span>
                  <span className="font-bold text-purple-600">$380</span>
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="font-medium">Colágeno Vegetal</span>
                  <span className="font-bold text-purple-600">$420</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                  <span className="font-medium">Proteína Vegana Premium</span>
                  <span className="font-bold text-purple-600">$450</span>
                </div>
                <div className="pt-2 text-right">
                  <span className="text-sm font-semibold text-gray-600">Margen promedio: </span>
                  <span className="text-lg font-bold text-purple-600">42-50%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded text-sm text-purple-900">
              <strong>Nota:</strong> Los productos Premium representan el segmento de mayor rentabilidad con márgenes superiores al 40%.
            </div>
          </div>
  
          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">27</div>
              <div className="text-sm text-gray-600 mt-1">Productos Únicos</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600 mt-1">Categorías</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">$35-$450</div>
              <div className="text-sm text-gray-600 mt-1">Rango de Precios</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">28-50%</div>
              <div className="text-sm text-gray-600 mt-1">Rango de Márgenes</div>
            </div>
          </div>
  
          <div className="text-center text-xs text-gray-400 mt-12">
            Página 3 de 3 | DataO Analytics | Catálogo de productos actualizado 2023
          </div>
        </div>
      </div>
      </div>
    );
  };

  export default EcotiendaPDFReport;