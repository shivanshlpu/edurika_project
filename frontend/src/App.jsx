import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';

import Performance from './pages/Performance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
