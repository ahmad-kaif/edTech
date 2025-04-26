import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeProvider';

const Layout = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <Navbar />
      {/* Add padding-top to account for fixed navbar height */}
      <main className="flex-grow bg-black text-white relative overflow-hidden pt-24">
        {/* Simple ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Content wrapper with subtle styling */}
          <div className="rounded-lg backdrop-blur-md bg-black/30 border border-white/10 p-6">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;