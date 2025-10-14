import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import ChoosePatient from './ChoosePatient';
import ForgotPassword from './ForgotPassword';
import ChooseRecord from './ChooseRecord';
import RecordMedicalHistory from './RecordMedicalHistory';
import RecordPhysicalExam from './RecordPhysicalExam';
import RecordArticulation from './RecordArticulation';
import RecordDailyEvolution from './RecordDailyEvolution';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ChoosePatient" element={<ChoosePatient />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ChooseRecord" element={<ChooseRecord />} />
        <Route path="/RecordMedicalHistory" element={<RecordMedicalHistory />} />
        <Route path="/RecordPhysicalExam" element={<RecordPhysicalExam />} />
        <Route path="/RecordArticulation" element={<RecordArticulation />} />
        <Route path="/RecordDailyEvolution" element={<RecordDailyEvolution />} />
      </Routes>
    </Router>
  );
}

export default App;
