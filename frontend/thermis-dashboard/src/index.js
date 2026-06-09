import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa o renderizador do React 18
import './index.css';                    // Importa o CSS global da aplicação
import App from './App';                 // Importa o componente principal

// Seleciona o elemento root do HTML e renderiza a aplicação dentro dele
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // Renderiza o componente App na página