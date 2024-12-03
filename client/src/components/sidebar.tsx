import { useState } from 'react';
import assets from '../assets/assets.ts';

interface SidebarProps {
  active: string;
}
function Sidebar({ active }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navItems = [
    { name: 'Beranda', href: '/beranda', icon: assets.beranda },
    { name: 'Siswa', href: '/siswa', icon: assets.siswa },
    { name: 'Riwayat', href: '/riwayat', icon: assets.riwayat },
    { name: 'Buku Tamu', href: '/buku', icon: assets.buku },
  ];
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    window.location.href = '/';
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-[18px] left-[17px] z-40 p-2 bg-[#1A73E8] text-white rounded-lg sm:hidden"
      >
        ☰
      </button>
      <div className={`fixed left-0 top-0 h-full w-2/3 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white border border-[#C5C5C5] z-30 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        <img src={assets.hadiro} />
        <ul className="mt-5 space-y-4 px-5">
        {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  active === item.name
                    ? 'text-white bg-[#1A73E8] hover:text-white shadow-md shadow-gray-500'
                    : 'text-black opacity-50 hover:opacity-100 hover:text-black'
                }`}
              >
                <img
                  src={item.icon}
                  className={`mr-3 w-6 ${
                    active === item.name ? 'filter invert brightness-0' : ''
                  }`}
                  alt={item.name}
                />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className='border border-[#C5C5C5] rounded-lg m-5 p-5 flex items-center mt-auto'>
          <a href="" className='text-black hover:text-black w-3/4'>
            <div className='flex items-center'>
              <img src={assets.defaultprofile} className='mr-3' />
              <span className='truncate max-w-full'>{localStorage.getItem('username')}</span>
            </div>
          </a>
          <div className='ml-3 ms-auto'>
            <img src={assets.logout} className='min-w-6 w-6 hover:cursor-pointer' onClick={handleLogout} />
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
