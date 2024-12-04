import { useState } from 'react';
import assets from '../assets/assets.ts';
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

function Siswa() {
  const [search, setSearch] = useState('');
  const [data] = useState([
    { id: 1, name: 'John Doe', profile: assets.defaultprofile, kelas: 'X', jurusan: 'RPL', kode: 'A' },
    { id: 2, name: 'Jane Smith', profile: assets.defaultprofile, kelas: 'XI', jurusan: 'DKV', kode: 'B' },
    { id: 3, name: 'Emily Johnson', profile: assets.defaultprofile, kelas: 'XII', jurusan: 'TG', kode: 'C' },
    { id: 4, name: 'Michael Brown', profile: assets.defaultprofile, kelas: 'X', jurusan: 'RPL', kode: 'D' },
    { id: 5, name: 'Chris Green', profile: assets.defaultprofile, kelas: 'X', jurusan: 'MEKA', kode: 'E' },
    { id: 6, name: 'Laura White', profile: assets.defaultprofile, kelas: 'XI', jurusan: 'TKJ', kode: 'F' },
    { id: 7, name: 'Tom Black', profile: assets.defaultprofile, kelas: 'XII', jurusan: 'RPL', kode: 'G' },
    { id: 8, name: 'Nina Grey', profile: assets.defaultprofile, kelas: 'X', jurusan: 'PH', kode: 'H' },
    { id: 9, name: 'Steve Red', profile: assets.defaultprofile, kelas: 'XI', jurusan: 'DKV', kode: 'I' },
    { id: 10, name: 'Lily Blue', profile: assets.defaultprofile, kelas: 'XII', jurusan: 'MEKA', kode: 'J' },
    { id: 11, name: 'Harry Pink', profile: assets.defaultprofile, kelas: 'X', jurusan: 'RPL', kode: 'K' },
  ]);
  const [filteredResults, setFilteredResults] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [kelas, setKelas] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [kode, setKode] = useState('');
  const handleSearch = (value: string) => {
    setSearch(value);
    const filteredData = data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
      const matchesKelas = kelas ? item.kelas === kelas : true;
      const matchesJurusan = jurusan ? item.jurusan === jurusan : true;
      const matchesKode = kode ? item.kode === kode.toUpperCase() : true;
      return matchesSearch && matchesKelas && matchesJurusan && matchesKode;
    });
    setFilteredResults(filteredData);
    setCurrentPage(1);
  };
  const handleFilter = () => {
    const filteredData = data.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
      const matchesKelas = kelas ? student.kelas == kelas : true;
      const matchesJurusan = jurusan ? student.jurusan == jurusan : true;
      const matchesKode = kode ? student.kode == kode.toUpperCase() : true;
      return matchesSearch && matchesKelas && matchesJurusan && matchesKode;
    });
    setFilteredResults(filteredData);
    setCurrentPage(1);
    setFilterModalOpen(false);
  };
  const displayedStudents = search.trim() || kelas || jurusan || kode
    ? filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const toggleFilterModal = () => {
    setFilterModalOpen(!isFilterModalOpen);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;
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
                <img src={assets.filter} className='mr-3 hover:cursor-pointer' onClick={toggleFilterModal} />
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
                <div className='flex items-center ms-3 md:ms-auto'>
                  {startItem} - {endItem} dari {totalItems} siswa
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className='bg-white hover:bg-white focus:outline-none p-0 ml-3'>
                    <img src={assets.backward} />
                  </button>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages} className='bg-white hover:bg-white focus:outline-none p-0 ml-1'>
                    <img src={assets.forward} />
                  </button>
                </div>
              </div>
              <table className="min-w-full mt-5">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">No.</th>
                    <th className="py-2 px-4 border-b text-left">Nama</th>
                    <th className="py-2 px-4 border-b text-left w-1/5">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="py-2 px-4 border-b">{startItem + index}</td>
                      <td className="py-2 px-4 border-b flex">
                        <img
                          src={student.profile}
                          className="mr-3"
                        />
                        <div>
                          <span className='font-bold'>{student.name}</span><br />
                          <span className='opacity-50 text-sm'>{student.kelas} {student.jurusan} {student.kode}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="inline-flex items-center">
                          <img
                            src={assets.edit}
                            className="mr-5"
                          />
                          <img
                            src={assets.destroy}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[400px]">
            <div className="flex justify-between items-center p-8 w-full border-b border-[#C5C5C5]">
              <h1 className="text-xl font-bold">Filter Siswa</h1>
              <button
                className="text-black bg-white hover:bg-white focus:outline-none p-0"
                onClick={toggleFilterModal}
              >
                X
              </button>
            </div>
            <div className='p-8'>
              <div className="mb-4 flex items-center">
                <label className="block mr-4 w-24">Kelas:</label>
                <select className="w-full border border-gray-300 rounded-lg p-2" value={kelas} onChange={(e) => setKelas(e.target.value)}>
                  <option value="">Semua</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <label className="block mr-4 w-24">Jurusan:</label>
                <select className="w-full border border-gray-300 rounded-lg p-2" value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                  <option value="">Semua</option>
                  <option value="TG">TG</option>
                  <option value="DKV">DKV</option>
                  <option value="RPL">RPL</option>
                  <option value="ANI">ANI</option>
                  <option value="TKJ">TKJ</option>
                  <option value="MEKA">MEKA</option>
                  <option value="TL">TL</option>
                  <option value="PH">PH</option>
                </select>
              </div>
              <div className="mb-8 flex items-center">
                <label className="block mr-4 w-24">Kode:</label>
                <input
                  type="text"
                  maxLength={1}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                />
              </div>
              <div className="flex">
                <button
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow-md shadow-gray-500 focus:outline-none"
                  onClick={handleFilter}
                >
                  Simpan
                </button>
                <button
                  className="bg-white hover:bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 ml-2 focus:outline-none"
                  onClick={toggleFilterModal}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Siswa