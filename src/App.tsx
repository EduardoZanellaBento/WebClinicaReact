import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ChoosePatient from './ChoosePatient';
import ForgotPassword from './ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ChoosePatient" element={<ChoosePatient />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
