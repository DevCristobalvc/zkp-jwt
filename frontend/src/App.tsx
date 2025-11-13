import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JWTPage from './pages/JWT';
import ZKPPage from './pages/ZKP';
import LibraryPage from './pages/Library';
import ArchitecturePage from './pages/Architecture';
import ResourcesPage from './pages/Resources';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jwt" element={<JWTPage />} />
          <Route path="/zkp" element={<ZKPPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/docs" element={<LibraryPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
