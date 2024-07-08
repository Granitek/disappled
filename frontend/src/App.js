import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leopard from './pages/Leopard';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Leopard" element={<Leopard />} />
          <Route path="/Cheetah" element={<Leopard />} />
          <Route path="/Text" element={<Leopard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
