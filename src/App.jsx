import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import StockPage from './components/StockPage';
import companies from './functions/companydata'; 

const App = () => {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage companies={companies} />} />
          <Route path="/stock/:company" element={<StockPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    
  );
};

export default App;
