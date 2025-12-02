import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/layout/Header'; 
import Footer from './components/layout/Footer'; 
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton /> 
    </div>
  );
}

export default App;