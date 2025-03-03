
import { useState, useEffect } from 'react';
import { mt4Service } from '../services/mt4Service';

export const useMT4Terminals = () => {
  const [mt4Terminals, setMT4Terminals] = useState<string[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<string>('');

  // Cargar terminales MT4 instalados
  const loadMT4Terminals = async () => {
    try {
      const terminals = await mt4Service.getMT4Terminals();
      setMT4Terminals(terminals);
      if (terminals.length > 0) {
        setSelectedTerminal(terminals[0]);
      }
    } catch (error) {
      console.error('Error al cargar terminales MT4:', error);
    }
  };

  // Cargar terminales al iniciar
  useEffect(() => {
    loadMT4Terminals();
  }, []);

  // Cargar configuración de terminal guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('backtestConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.mt4Terminal) setSelectedTerminal(config.mt4Terminal);
      } catch (error) {
        console.error('Error al cargar configuración de terminal:', error);
      }
    }
  }, []);

  return {
    mt4Terminals,
    selectedTerminal,
    setSelectedTerminal,
    refreshTerminals: loadMT4Terminals
  };
};
