
import robot from 'robotjs';

export const startMouseTracking = () => {
  console.log('Iniciando seguimiento del ratón...');
  console.log('Presiona Ctrl+C para detener');

  // Intervalo para capturar la posición del ratón cada 500ms
  const interval = setInterval(() => {
    const mousePos = robot.getMousePos();
    const color = robot.getPixelColor(mousePos.x, mousePos.y);
    
    console.log(`Posición del ratón - X: ${mousePos.x}, Y: ${mousePos.y}`);
    console.log(`Color en la posición: #${color}`);
    console.log('------------------------');
  }, 500);

  // Manejar la detención del programa
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\nSeguimiento del ratón detenido');
    process.exit();
  });
};

// Función para detectar elementos por color
export const findElementByColor = (targetColor: string) => {
  const screenSize = robot.getScreenSize();
  
  for (let x = 0; x < screenSize.width; x++) {
    for (let y = 0; y < screenSize.height; y++) {
      const color = robot.getPixelColor(x, y);
      if (color === targetColor) {
        return { x, y };
      }
    }
  }
  
  return null;
};

// Función para guardar coordenadas en un archivo de configuración
export const saveCoordinates = (name: string, x: number, y: number) => {
  const coordinates = {
    [name]: { x, y }
  };
  
  console.log(`Coordenadas guardadas para ${name}: X=${x}, Y=${y}`);
  return coordinates;
};
