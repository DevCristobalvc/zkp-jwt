import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import LiveDemo from './components/LiveDemo';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MainContent />
      <LiveDemo />
      <Footer />
    </div>
  );
}

export default App;
