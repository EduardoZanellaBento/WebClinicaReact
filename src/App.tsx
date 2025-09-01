import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import EscolhaPacientes from './EscolhaPacientes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/escolha-pacientes" element={<EscolhaPacientes />} />
      </Routes>
    </Router>
  );
}

export default App;
