import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientChart from './pages/PatientChart';
import Submitted from './pages/Submitted';
import PatientAnswer from './pages/PatientAnswer';
import PatientFeedbackReview from './pages/PatientFeedbackReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientChart />} />
        <Route path="/submitted" element={<Submitted />} />
        <Route path="/patient-answer" element={<PatientAnswer />} />

        <Route path="/patient-feedback-review" element={<PatientFeedbackReview />} /> {/* ← ADD THIS */}

      </Routes>
    </Router>
  );
}

export default App;
