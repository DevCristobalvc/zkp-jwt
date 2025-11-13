import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Documentation from './components/Documentation';
import LiveDemo from './components/LiveDemo';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Documentation />
      <LiveDemo />
      <Footer />
    </div>
  );
}

export default App;
