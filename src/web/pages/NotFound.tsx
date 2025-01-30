import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
      <p className="mt-4">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="mt-6 text-primary hover:underline">
        Regresar a la página principal
      </Link>
    </div>
  );
};

export default NotFound;
