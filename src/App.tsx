import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';

import HomePage from './pages/HomePage';
import InserisciComponentePage from './pages/InserisciComponentePage';
import InserisciControlPage from './pages/InserisciControlPage';
import InserisciFormPage from './pages/InserisciFormPage';
import InserisciRenderPage from './pages/InserisciRenderPage';
import ListaFormPage from './pages/ListaFormPage';
import ListaValoriControlPage from './pages/ListaValoriControlPage';
import SchedaComponentePage from './pages/SchedaComponentePage';
import SchedaFormPage from './pages/SchedaFormPage';




function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/lista-form" element={<ListaFormPage />} />
          <Route path="/inserisci-form" element={<InserisciFormPage />} />
          <Route path="/scheda-form/:formId" element={<SchedaFormPage />} />

          <Route path="/inserisci-componente/:formId" element={<InserisciComponentePage />} />
          <Route path="/scheda-componente/:formId/:componentId" element={<SchedaComponentePage />} />

          <Route path="/inserisci-controllo/:formId" element={<InserisciControlPage />} />

          <Route path="/lista-valori-control/:formId/:pk" element={<ListaValoriControlPage />} />

          <Route path="/inserisci-render/:formId" element={<InserisciRenderPage />} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
