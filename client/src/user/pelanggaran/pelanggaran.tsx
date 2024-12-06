import { useState } from 'react';
// import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar"

function Pelanggaran() {
  const [dateRange, setDateRange] = useState<string | null>("1 minggu");
  const toggleDate = () => {
    setDateRange((prev) => {
      if (!prev || prev === "1 tahun") {
        //change data
        return "1 minggu";
      }
      if (prev === "1 minggu") {
        //change data
        return "1 bulan";
      }
      if (prev === "1 bulan") {
        //change data
        return "1 tahun";
      }
      return null;
    });
  }
  const data = { terlambat: 10, seragam: 0, luar: 5 };
  return (
    <>
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Pelanggaran" />
        </div>
        <div className="w-full pt-[78px]">
          <div className="p-12">
            <h1 className="text-3xl font-bold">Pelanggaran Siswa</h1>
            <p className="opacity-50 mt-1">Lihat Riwayat pelanggaran siswa dalam <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleDate}>{dateRange}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              <div className="w-full h-full aspect-square bg-[#1A73E8] text-white p-5 rounded flex flex-col items-center md:col-span-2 lg:col-span-1">
                <span className="text-xl font-semibold text-center">Siswa Datang Terlambat</span>
                <span className="text-9xl font-bold flex-grow flex items-center justify-center">{data.terlambat}</span>
              </div>
              <div className="w-full h-full aspect-square bg-[#1A73E8] text-white p-5 rounded flex flex-col items-center">
                <span className="text-xl font-semibold text-center">Ketidaksesuaian Seragam</span>
                <span className="text-9xl font-bold flex-grow flex items-center justify-center">{data.seragam}</span>
              </div>
              <div className="w-full h-full aspect-square bg-[#1A73E8] text-white p-5 rounded flex flex-col items-center">
                <span className="text-xl font-semibold text-center">Pelanggaran diluar Sekolah</span>
                <span className="text-9xl font-bold flex-grow flex items-center justify-center">{data.luar}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Pelanggaran