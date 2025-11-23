import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BunkCalculator from './pages/BunkCalculator';

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navbar/Footer on Login page if desired, but keeping them for consistency is usually better.
  // Let's keep them everywhere for a unified feel.

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<BunkCalculator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
