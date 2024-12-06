import { useState } from 'react';
import assets from '../assets/assets.ts';

function Topbar() {
  const [search, setSearch] = useState('');
  const [filteredResults, setFilteredResults] = useState<{ name: string; path: string; }[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const level = localStorage.getItem('level');//for user/admin
  // let data = [];
  // if(level == "1") {// Example search data
  //   data = [//user
  //     { name: 'Absen Sekarang', path: '/absen' },
  //     { name: 'Surat Izin', path: '/surat' },
  //     { name: 'Jurnal Kelas', path: '/jurnal' },
  //     { name: 'Pelanggaran', path: '/pelanggaran' },
  //     { name: 'Buku Tamu', path: '/bukuuser' },
  //   ];
  // } else {
  //   data = [//admin
  //     { name: 'Beranda', path: '/beranda' },
  //     { name: 'Siswa', path: '/siswa' },
  //     { name: 'Riwayat', path: '/riwayat' },
  //     { name: 'Buku Tamu', path: '/buku' },
  //   ];
  // }
  const data = [
    { name: 'Beranda', path: '/beranda' },
    { name: 'Siswa', path: '/siswa' },
    { name: 'Riwayat', path: '/riwayat' },
    { name: 'Buku Tamu', path: '/buku' },
  ];
  // Example notification data
  const notifications = [
    'Notification 1',
    'Notification 2',
    'Notification 3',
  ];
  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      const results = data.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };
  const handleResultClick = (path: string) => {
    window.location.href = path;
    setSearch('');
    setFilteredResults([]);
  };
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  return (
    <>
      <div className="border border-[#C5C5C5] bg-white p-4 flex justify-between items-center w-full sm:w-2/3 md:w-3/4 lg:w-4/5 z-20 fixed top-0 right-0">
        <div className="flex items-center w-1/2 lg:w-1/3 relative">
          <div className="border border-[2px] border-[#E5E5E5] rounded-lg p-2 flex items-center w-full ml-12 sm:ml-0">
            <img src={assets.search} className="mr-3 w-6" />
            <input
              type="text"
              placeholder="Cari apapun di sini..."
              className="w-full border-none outline-none"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {filteredResults.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-white border border-[#C5C5C5] rounded-lg shadow-lg z-10">
              {filteredResults.map((result, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleResultClick(result.path)}
                >
                  {result.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <img src={assets.notification} className="w-6 cursor-pointer" onClick={toggleNotificationDropdown} />
          {isNotificationOpen && (
            <ul className="absolute top-[69px] right-0 m-2 bg-white border border-[#C5C5C5] rounded-lg shadow-lg z-10 w-64">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer">
                    {notification}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No notifications</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Topbar;