// src/padelData2.js
// Datos de reservas del Club de Pádel - 1000 registros realistas (Enero a Marzo)

// Nombres segregados por género para mayor realismo
const maleNames = [
  'Carlos Mendoza', 'Roberto Silva', 'Fernando Torres', 'Miguel Hernandez', 'Jorge Ramirez',
  'Diego Castro', 'Alejandro Reyes', 'Ricardo Ortiz', 'Pablo Vargas', 'Eduardo Jimenez',
  'Luis Romero', 'Antonio Mendez', 'Javier Moreno', 'Rafael Aguilar', 'Manuel Castillo',
  'Oscar Vazquez', 'Felipe Rojas', 'Rodrigo Ibarra', 'Hector Fuentes', 'Sergio Campos',
  'Arturo Molina', 'Marcos Guerrero', 'Emilio Perez', 'Ignacio Salazar', 'Raul Carrillo',
  'Victor Duran', 'Andres Villarreal', 'Gonzalo Ochoa', 'Cesar Bravo', 'Ivan Delgado',
  'Mauricio Estrada', 'Guillermo Vega', 'Enrique Trejo', 'Omar Pacheco', 'Alberto Ortega',
  'Hugo Mejia', 'Gustavo Luna', 'Mario Rosales', 'Francisco Padilla', 'Armando Gallegos',
  'Bruno Cervantes', 'Julio Benitez', 'Ruben Cardenas', 'Jaime Cortez', 'Bernardo Esquivel',
  'Arturo Vallejo', 'Alfredo Barrera', 'Ernesto Zuniga', 'Lorenzo Ponce', 'Martin Gutierrez',
  'Juan Pablo Ruiz', 'David Torres', 'Antonio Hernández', 'Francisco García', 'Andrés Quintero'
];

const femaleNames = [
  'Andrea Lopez', 'Patricia Ruiz', 'Daniela Garcia', 'Laura Martinez', 'Sofia Gonzalez',
  'Valeria Morales', 'Carolina Flores', 'Monica Diaz', 'Isabella Cruz', 'Camila Soto',
  'Natalia Rivera', 'Gabriela Santos', 'Ana Gutierrez', 'Elena Navarro', 'Sandra Dominguez',
  'Paola Medina', 'Veronica Pena', 'Claudia Sandoval', 'Mariana Leon', 'Adriana Ramos',
  'Carmen Velasco', 'Beatriz Nunez', 'Rosa Cortes', 'Gloria Espinoza', 'Teresa Avila',
  'Silvia Lara', 'Lorena Maldonado', 'Cristina Paredes', 'Julia Calderon', 'Alicia Contreras',
  'Alejandra Zamora', 'Karla Suarez', 'Diana Rios', 'Luz Herrera', 'Liliana Cabrera',
  'Martha Marin', 'Sara Santana', 'Cecilia Acosta', 'Victoria Velazquez', 'Susana Arellano',
  'Olga Mercado', 'Raquel Figueroa', 'Irene Ayala', 'Pilar Rangel', 'Angela Bautista',
  'Eva Zavala', 'Rocio Gamboa', 'Norma Cazares', 'Clara Villegas', 'Alma Escobar',
  'Rosa Martinez', 'Lucía Fernández', 'Mónica Gómez', 'Carmen López', 'Elena Rodríguez'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
const durations = [1.0, 1.5, 2.0, 2.5];

// Distribución de horarios más realista (fines de semana más reservas)
const timeWeights = {
  '8:00 AM': 8,
  '10:00 AM': 12,
  '12:00 PM': 15,
  '2:00 PM': 14,
  '4:00 PM': 10,
  '6:00 PM': 20,
  '7:00 PM': 18,
  '8:00 PM': 13
};

// Creadores de clientes habituales
const frequentPlayers = {};
let playerIndex = 0;

function createFrequentPlayer() {
  const gender = getRandomGender();
  const name = getRandomName(gender);
  return { name, gender, bookingProbability: Math.random() * 0.7 + 0.3 }; // 30-100% de probabilidad
}

function getRandomName(gender) {
  return gender === 'Male' ? getRandomElement(maleNames) : getRandomElement(femaleNames);
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedRandomTime() {
  const entries = Object.entries(timeWeights);
  const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [time, weight] of entries) {
    random -= weight;
    if (random <= 0) return time;
  }
  return times[times.length - 1];
}

function getRandomDuration() {
  const rand = Math.random();
  if (rand < 0.45) return 2.0;
  if (rand < 0.75) return 1.5;
  if (rand < 0.9) return 2.5;
  return 1.0;
}

function getRandomGender() {
  return Math.random() < 0.65 ? 'Male' : 'Female';
}

function getRandomApplication() {
  return Math.random() < 0.7 ? 'Yes' : 'No';
}

function getRandomCourt() {
  return Math.floor(Math.random() * 4) + 1;
}

function getPrice(application) {
  // Agregar variabilidad: descuentos ocasionales o precios especiales
  const basePrice = application === 'Yes' ? 2400 : 3000;
  const variance = Math.random();
  
  if (variance < 0.05) return basePrice * 0.9; // 5% descuento
  if (variance < 0.08) return basePrice * 1.1; // 10% recargo
  return basePrice;
}

function generateEndTime(startTime, duration) {
  const timeMap = {
    '8:00 AM': 8,
    '10:00 AM': 10,
    '12:00 PM': 12,
    '2:00 PM': 14,
    '4:00 PM': 16,
    '6:00 PM': 18,
    '7:00 PM': 19,
    '8:00 PM': 20
  };
  
  let endHour = timeMap[startTime] + duration;
  const endAMPM = endHour >= 12 ? 'PM' : 'AM';
  if (endHour > 12 && endAMPM === 'PM') endHour = endHour === 12 ? 12 : endHour - 12;
  if (endAMPM === 'AM' && endHour > 12) endHour -= 12;
  
  const minutes = (duration % 1) === 0.5 ? ':30' : ':00';
  return `${endHour}${minutes} ${endAMPM}`;
}

function generateDate(dayOfYear) {
  let month, day;
  
  if (dayOfYear <= 31) {
    month = 'Jan';
    day = dayOfYear;
  } else if (dayOfYear <= 59) {
    month = 'Feb';
    day = dayOfYear - 31;
  } else {
    month = 'Mar';
    day = dayOfYear - 59;
  }
  
  return `${day}-${month}`;
}

function generateBookings(count) {
  const bookings = [];
  
  // Crear 50 jugadores frecuentes
  for (let i = 0; i < 50; i++) {
    frequentPlayers[i] = createFrequentPlayer();
  }
  
  for (let dayOfYear = 1; dayOfYear <= 90; dayOfYear++) {
    const dayIndex = (dayOfYear - 1) % 7;
    const dayName = days[dayIndex];
    const date = generateDate(dayOfYear);
    
    // Fines de semana: 12-18 reservas; Días de semana: 8-14 reservas
    const isWeekend = dayIndex === 5 || dayIndex === 6;
    const dayVariance = Math.random(); // Para agregar aleatoriedad
    
    let baseReservations;
    if (isWeekend) {
      if (dayVariance < 0.2) baseReservations = Math.floor(Math.random() * 4) + 18; // Días muy ocupados 18-22
      else if (dayVariance < 0.6) baseReservations = Math.floor(Math.random() * 5) + 13; // Normales 13-17
      else baseReservations = Math.floor(Math.random() * 5) + 8; // Días bajos 8-12
    } else {
      if (dayVariance < 0.15) baseReservations = Math.floor(Math.random() * 4) + 14; // Días excepcionales
      else if (dayVariance < 0.5) baseReservations = Math.floor(Math.random() * 5) + 10; // Normales
      else baseReservations = Math.floor(Math.random() * 4) + 6; // Días bajos
    }
    
    // Preferencia de canchas por día (algunas canchas más populares ciertos días)
    const favoredCourt = Math.floor(Math.random() * 4) + 1;
    
    // Horarios pico por día (algunos horarios más populares ciertos días)
    const peakHour = times[Math.floor(Math.random() * times.length)];
    
    for (let j = 0; j < baseReservations; j++) {
      let name, gender, application;
      
      // 60% clientes habituales, 40% nuevos
      if (Math.random() < 0.6 && Object.keys(frequentPlayers).length > 0) {
        const frequentId = Math.floor(Math.random() * 50);
        if (frequentPlayers[frequentId] && Math.random() < frequentPlayers[frequentId].bookingProbability) {
          name = frequentPlayers[frequentId].name;
          gender = frequentPlayers[frequentId].gender;
          application = Math.random() < 0.85 ? 'Yes' : 'No'; // Habituales más propensos a usar app
        } else {
          gender = getRandomGender();
          name = getRandomName(gender);
          application = getRandomApplication();
        }
      } else {
        gender = getRandomGender();
        name = getRandomName(gender);
        application = getRandomApplication();
      }
      
      // Elegir cancha: 60% es la favorecida, 40% aleatoria
      const court = Math.random() < 0.6 ? favoredCourt : getRandomCourt();
      
      // Elegir hora: 40% es la hora pico, 60% aleatoria
      const startTime = Math.random() < 0.4 ? peakHour : getWeightedRandomTime();
      
      const duration = getRandomDuration();
      const endTime = generateEndTime(startTime, duration);
      const price = getPrice(application);
      
      bookings.push({
        date,
        day: dayName,
        startTime,
        endTime,
        duration,
        name,
        gender,
        application,
        court,
        price
      });
    }
  }
  
  // Barajar
  for (let i = bookings.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bookings[i], bookings[j]] = [bookings[j], bookings[i]];
  }
  
  return bookings.slice(0, count);
}

export const padelBookings = generateBookings(1000);
