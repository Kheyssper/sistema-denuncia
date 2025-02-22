import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;