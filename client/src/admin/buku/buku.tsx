import { useState } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar"
import Topbar from "../../components/topbar"

function Buku() {
  const [search, setSearch] = useState('');
  const [data] = useState([
    { id: 1, name: 'John Doe', profile: assets.defaultprofile, keperluan: 'Test Prakerin', notelp: '0086666666666', tujuan: 'Ibu Tyas', instansi: 'Sekawan Media' },
    { id: 2, name: 'Jane Smith', profile: assets.defaultprofile, keperluan: 'Consultation', notelp: '009877788899', tujuan: 'Mr. Jason', instansi: 'Creative Studios' },
    { id: 3, name: 'Emily Johnson', profile: assets.defaultprofile, keperluan: 'Project Discussion', notelp: '00123456789', tujuan: 'Mrs. Linda', instansi: 'Tech Solutions' },
    { id: 4, name: 'Michael Brown', profile: assets.defaultprofile, keperluan: 'Career Advice', notelp: '005555555555', tujuan: 'Mr. David', instansi: 'InfoTech' },
    { id: 5, name: 'Chris Green', profile: assets.defaultprofile, keperluan: 'Internship Inquiry', notelp: '008988776655', tujuan: 'Mrs. Sofia', instansi: 'Mekanika Corp' },
    { id: 6, name: 'Laura White', profile: assets.defaultprofile, keperluan: 'Research Purpose', notelp: '009111223344', tujuan: 'Mr. Tom', instansi: 'NetWorld' },
    { id: 7, name: 'Tom Black', profile: assets.defaultprofile, keperluan: 'Exhibition', notelp: '006677889900', tujuan: 'Mrs. Rachel', instansi: 'Design Innovations' },
    { id: 8, name: 'Nina Grey', profile: assets.defaultprofile, keperluan: 'Test Appointment', notelp: '007766554433', tujuan: 'Mr. Albert', instansi: 'PhotoTech' },
    { id: 9, name: 'Steve Red', profile: assets.defaultprofile, keperluan: 'Design Review', notelp: '004455667788', tujuan: 'Ms. Sara', instansi: 'Artworks Studio' },
    { id: 10, name: 'Lily Blue', profile: assets.defaultprofile, keperluan: 'Mechanical Consultation', notelp: '003344556677', tujuan: 'Mr. Jake', instansi: 'Engineering Corp' },
    { id: 11, name: 'Harry Pink', profile: assets.defaultprofile, keperluan: 'Tech Talk', notelp: '002233445566', tujuan: 'Mr. Ethan', instansi: 'Tech Ventures' },
  ]);
  const [filteredResults, setFilteredResults] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [perihal, setPerihal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [instansi, setInstansi] = useState('');
  const handleSearch = (value: string) => {
    setSearch(value);
    const filteredData = data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
      const matchesPerihal = perihal ? item.keperluan.toLowerCase().includes(perihal.toLowerCase()) : true;
      const matchesTujuan = tujuan ? item.tujuan.toLowerCase().includes(tujuan.toLowerCase()) : true;
      const matchesInstansi = instansi ? item.instansi.toLowerCase().includes(instansi.toLowerCase()) : true;
      return matchesSearch && matchesPerihal && matchesTujuan && matchesInstansi;
    });
    setFilteredResults(filteredData);
    setCurrentPage(1);
  };
  const handleFilter = () => {
    const filteredData = data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesPerihal = perihal ? item.keperluan.toLowerCase().includes(perihal.toLowerCase()) : true;
      const matchesTujuan = tujuan ? item.tujuan.toLowerCase().includes(tujuan.toLowerCase()) : true;
      const matchesInstansi = instansi ? item.instansi.toLowerCase().includes(instansi.toLowerCase()) : true;
      return matchesSearch && matchesPerihal && matchesTujuan && matchesInstansi;
    });
    setFilteredResults(filteredData);
    setCurrentPage(1);
    setFilterModalOpen(false);
  };
  const displayedUsers = search.trim() || perihal || tujuan || instansi
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
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Buku Tamu" />
        </div>
        <div className="w-full overflow-x-hidden pt-[78px]">
          <Topbar />
          <div className="p-12">
            <h1 className="text-3xl font-bold">Data Tamu</h1>
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
                  {startItem} - {endItem} dari {totalItems} data
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className='bg-white hover:bg-white focus:outline-none p-0 ml-3'>
                    <img src={assets.backward} />
                  </button>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages} className='bg-white hover:bg-white focus:outline-none p-0 ml-1'>
                    <img src={assets.forward} />
                  </button>
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className="min-w-full mt-5">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">No.</th>
                      <th className="py-2 px-4 border-b text-left">Nama</th>
                      <th className='py-2 px-4 border-b text-left'>Keperluan</th>
                      <th className='py-2 px-4 border-b text-left'>Nomor Telepon</th>
                      <th className='py-2 px-4 border-b text-left'>Tujuan</th>
                      <th className="py-2 px-4 border-b text-left">Instansi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{startItem + index}</td>
                        <td className="py-2 px-4 border-b">
                          <div className='flex'>
                            <img
                              src={user.profile}
                              className="mr-3"
                            />
                            <span className='font-bold'>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button className='bg-white hover:bg-white focus:outline-none rounded text-black border border-[#C5C5C5] py-1 w-full'>
                            {user.keperluan}
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button className='bg-white hover:bg-white focus:outline-none rounded text-black border border-[#C5C5C5] py-1 w-full'>
                            {user.notelp}
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button className='bg-white hover:bg-white focus:outline-none rounded text-black border border-[#C5C5C5] py-1 w-full'>
                            {user.tujuan}
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button className='bg-white hover:bg-white focus:outline-none rounded text-black border border-[#C5C5C5] py-1 w-full'>
                            {user.instansi}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <label className="block mr-4 w-24">Perihal:</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block mr-4 w-24">Tujuan:</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                />
              </div>
              <div className="mb-8 flex items-center">
                <label className="block mr-4 w-24">Instansi:</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
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

export default Buku