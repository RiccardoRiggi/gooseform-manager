import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';

import HomePage from './pages/HomePage';
import InserisciFormPage from './pages/InserisciFormPage';
import ListaFormPage from './pages/ListaFormPage';
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

          

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
