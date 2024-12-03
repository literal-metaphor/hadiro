import { useState } from 'react';
// import assets from '../assets/assets.ts';
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

function Beranda() {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [hadir, setHadir] = useState("kehadiran");
  const [sort, setSort] = useState("tinggi");
  const [dateRange, setDateRange] = useState<string | null>(null);
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    };
    const parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())) {
      return date;
    } else {
      return parsedDate.toLocaleDateString("id-ID", options);
    };
  };
  const getDateDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 3600 * 24);
    if (diffInDays < 1) {
      return `hari ${new Date(start)}`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} hari`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} minggu`;
    } else if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} bulan`;
    } else {
      return `${Math.floor(diffInDays / 365)} tahun`;
    }
  };
  const toggleDate = () => {
    setDateRange((prev) => {
      if (!prev || prev === "1 tahun") {
        setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
        setEndDate(new Date().toISOString().split("T")[0]);
        return "1 minggu";
      }
      if (prev === "1 minggu") {
        setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
        setEndDate(new Date().toISOString().split("T")[0]);
        return "1 bulan";
      }
      if (prev === "1 bulan") {
        setStartDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
        setEndDate(new Date().toISOString().split("T")[0]);
        return "1 tahun";
      }
      return null;
    });
  }
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  return (
    <>
      <div className="flex h-screen">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Beranda" />
        </div>
        <div className="w-full pt-[78px]">
          <Topbar />
          <div className="p-12">
            <h1 className="text-3xl font-bold">Selamat datang, {localStorage.getItem('username')}!</h1>
            <p className="opacity-50 mt-1">Mari kita lihat data hari ini</p>
            <div className="bg-white rounded-lg border border-[#C5C5C5] p-5 mt-5">
              <h1 className="text-xl font-bold">Statistik Kehadiran dalam <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleDate}>{dateRange || formatDate(getDateDifference(startDate, endDate))}</span> {startDate == endDate ? "" : endDate == new Date().toISOString().split("T")[0] ? "terakhir" : `dari ${formatDate(startDate)}`}</h1>
              <form>
                {isEditing ? (
                  <>
                    <input type="date" defaultValue={startDate.toString()} max={endDate.toString()} className='border border-[#C5C5C5] rounded opacity-50' onBlur={(e) => { setStartDate(e.target.value); setDateRange(null); toggleEdit() }} />
                    {" - "}
                    <input type="date" defaultValue={endDate.toString()} min={startDate.toString()} max={new Date().toISOString().split("T")[0]} className='border border-[#C5C5C5] rounded opacity-50' onBlur={(e) => { setEndDate(e.target.value); setDateRange(null); toggleEdit() }} />
                  </>
                ) : (
                  <p className="opacity-50 mt-1 hover:cursor-pointer" onClick={toggleEdit}>{formatDate(startDate)} - {formatDate(endDate)}</p>
                )}
              </form>
              {/* DIAGRAMS??? */}
            </div>
            <div className="mt-5 flex flex-col md:flex-row">
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-3/5 mr-5'>
                <h1 className="text-xl font-bold">Siswa dengan tingkat <span className='text-blue-500 hover:cursor-pointer select-none' onClick={() => {setHadir(hadir == "kehadiran" ? "ketidakhadiran" : "kehadiran")}}>{hadir}</span> paling <span className='text-blue-500 hover:cursor-pointer select-none' onClick={() => {setSort(sort == "tinggi" ? "rendah" : "tinggi")}}>{sort}</span>:</h1>
              </div>
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-2/5'>
                <h1 className="text-xl font-bold">Aktivitas absensi terbaru:</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Beranda