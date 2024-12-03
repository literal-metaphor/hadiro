import { useState } from 'react';
import assets from '../assets/assets.ts';
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

function Siswa() {
  const [search, setSearch] = useState('');
  const [filteredResults, setFilteredResults] = useState<{ name: string; path: string; }[]>([]);
  const data = [
    { name: 'Beranda', path: '/beranda' },
    { name: 'Siswa', path: '/siswa' },
    { name: 'Riwayat', path: '/riwayat' },
    { name: 'Buku Tamu', path: '/buku' },
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
  return (
    <>
      <div className="flex h-screen">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Siswa" />
        </div>
        <div className="w-full pt-[78px]">
          <Topbar />
          <div className="p-12">
            <h1 className="text-3xl font-bold">Daftar Siswa</h1>
            <div className="bg-white border border-[#C5C5C5] p-5 rounded-lg mt-5">
              <div className="flex">
                <img src={assets.filter} className='mr-3' />
                <div className="border border-[2px] border-[#E5E5E5] rounded-lg p-2 flex items-center w-1/2 md:w-1/3">
                  <img src={assets.search} className="mr-3 w-6" />
                  <input
                    type="text"
                    placeholder="Cari siswa..."
                    className="w-full border-none outline-none"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className='flex items-center ms-3 sm:ms-auto'>
                  1 - 10 dari 52 halaman
                  <img src={assets.backward} />
                  <img src={assets.forward} />
                </div>
              </div>
              <table className="min-w-full mt-5">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">No.</th>
                    <th className="py-2 px-4 border-b text-left">Nama</th>
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">1</td>
                    <td className="py-2 px-4 border-b flex">
                      <img src={assets.defaultprofile} className='mr-3'/>John Doe
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="inline-flex items-center">
                        <img src={assets.edit} className="mr-5" />
                        <img src={assets.destroy} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">2</td>
                    <td className="py-2 px-4 border-b flex">
                    <img src={assets.defaultprofile} className='mr-3'/>Jane Smith
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="inline-flex items-center">
                        <img src={assets.edit} className="mr-5" />
                        <img src={assets.destroy} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Siswa