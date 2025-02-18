
// Versión simplificada sin robotjs
export const startMouseTracking = () => {
  console.log('Función de seguimiento del ratón deshabilitada');
};

export const findElementByColor = (targetColor: string) => {
  console.log('Función de búsqueda por color deshabilitada');
  return null;
};

export const saveCoordinates = (name: string, x: number, y: number) => {
  const coordinates = {
    [name]: { x, y }
  };
  
  console.log(`Coordenadas guardadas para ${name}: X=${x}, Y=${y}`);
  return coordinates;
};
