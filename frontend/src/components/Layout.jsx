import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 relative">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;