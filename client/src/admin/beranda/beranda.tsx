import { useState } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import LineChart from '../../components/linechart';
import PieChart from '../../components/piechart';

function Beranda() {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [hadir, setHadir] = useState("kehadiran");
  const [sort, setSort] = useState("tinggi");
  const [dateRange, setDateRange] = useState<string | null>("1 minggu");
  const [isExpanded, setIsExpanded] = useState<number[]>([]);
  const pieChartData = [
    { category: "Hadir", value: 875, color: "#34A853" },
    { category: "Sakit", value: 22, color: "#6B8CB6" },
    { category: "Dispensasi", value: 12, color: "#FFB200" },
    { category: "Izin", value: 15, color: "#B52FD7" },
    { category: "T.K", value: 10, color: "#A83436" }
  ];
  const users = [
    {
      id: 1,
      name: "Imanuel Revo Admojo",
      attendanceRate: "99.9%",
      avgAttendanceTime: "05:49",
      lastAttendance: "17 Agustus 1945",
      commonAbsenceReason: "Sakit",
    },
    {
      id: 2,
      name: "Emmanuel Jason",
      attendanceRate: "95.0%",
      avgAttendanceTime: "06:15",
      lastAttendance: "16 Agustus 1945",
      commonAbsenceReason: "Libur",
    },
    {
      id: 3,
      name: "User",
      attendanceRate: "90.1%",
      avgAttendanceTime: "06:41",
      lastAttendance: "15 Agustus 1945",
      commonAbsenceReason: "TK",
    },
  ];
  const recentActivities = [
    {
      id: 1,
      name: "Imanuel Revo Admojo",
      activityTime: "1 menit yang lalu",
      time: "06:45",
    },
    {
      id: 2,
      name: "Emmanuel Jason",
      activityTime: "5 menit yang lalu",
      time: "06:40",
    },
    {
      id: 3,
      name: "User",
      activityTime: "10 menit yang lalu",
      time: "06:30",
    },
  ];
  const sortedUsers = [...users].sort((a, b) => {
    const aRate = parseFloat(a.attendanceRate);
    const bRate = parseFloat(b.attendanceRate);

    if (hadir == "kehadiran") {
      return sort == "tinggi" ? bRate - aRate : aRate - bRate;
    } else {
      return sort == "tinggi" ? aRate - bRate : bRate - aRate;
    }
  });
  const toggleHadir = () => setHadir(hadir == "kehadiran" ? "ketidakhadiran" : "kehadiran");
  const toggleSort = () => setSort(sort == "tinggi" ? "rendah" : "tinggi");
  const toggleExpand = (id: number) => {
    setIsExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
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
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Beranda" />
        </div>
        <div className="w-full overflow-x-hidden pt-[78px]">
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
              <div className="mt-5 px-12">
                <LineChart data={[50, 200, 150, 175, 250, 0, 0]} />
              </div>
              <div className="mt-5 px-12 flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-center justify-center">
                  <PieChart data={[pieChartData[0].value, pieChartData[1].value, pieChartData[2].value, pieChartData[3].value, pieChartData[4].value]} total={934} />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 lg:mt-0">
                  <div className="w-24 h-24 bg-[#34A853] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Hadir</span>
                    <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "Hadir")?.value}</span>
                  </div>
                  <div className="w-24 h-24 bg-[#6B8CB6] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Sakit</span>
                    <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "Sakit")?.value}</span>
                  </div>
                  <div className="block sm:hidden md:flex w-24 h-24 bg-[#FFB200] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Dispensasi</span>
                    <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "Dispensasi")?.value}</span>
                  </div>
                  <div className="hidden sm:flex md:hidden w-24 h-24 mx-auto bg-[#FFB200] text-white p-5 rounded flex flex-col items-center justify-center col-span-2">
                    <span className="text-lg font-semibold">Dispensasi</span>
                    <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "Dispensasi")?.value}</span>
                  </div>
                  <div className="flex justify-center gap-5 col-span-full">
                    <div className="w-24 h-24 bg-[#B52FD7] text-white p-5 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">Izin</span>
                      <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "Izin")?.value}</span>
                    </div>
                    <div className="w-24 h-24 bg-[#A83436] text-white p-5 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">T.K</span>
                      <span className="text-3xl font-bold">{pieChartData.find((item) => item.category === "T.K")?.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col md:flex-row">
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-3/5 mr-5'>
                <h1 className="text-xl font-bold">Siswa dengan tingkat <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleHadir}>{hadir}</span> paling <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleSort}>{sort}</span>:</h1>
                <div className="mt-5 overflow-y-scroll space-y-5 max-h-[512px]">
                  {sortedUsers.map((user) => (
                    <div className="flex" key={user.id}>
                      <img
                        src={assets.defaultprofile}
                        className="mr-3 self-start mt-1"
                      />
                      <div className="w-full mr-3">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold border-b border-[#C5C5C5] w-full">{user.name}</p>
                          <button
                            className="text-xl focus:outline-none bg-white hover:bg-white p-0 rounded-none pb-1"
                            style={{ borderBottom: "1px solid #C5C5C5" }}
                            onClick={() => toggleExpand(user.id)}
                          >
                            {isExpanded.includes(user.id) ? (
                              <img
                                src={assets.arrow}
                                className="w-6 h-6"
                              />
                            ) : (
                              <img
                                src={assets.arrow}
                                className="w-6 h-6 rotate-180"
                              />
                            )}
                          </button>
                        </div>
                        {isExpanded.includes(user.id) && (
                          <ul className="opacity-50 list-disc pl-8 mt-3">
                            <li>Tingkat kehadiran <b>{user.attendanceRate}</b></li>
                            <li>Rata-rata waktu kehadiran <b>{user.avgAttendanceTime}</b></li>
                            <li>Kehadiran terakhir pada <b>{user.lastAttendance}</b></li>
                            <li>Alasan ketidakhadiran paling sering <b>{user.commonAbsenceReason}</b></li>
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-2/5 mt-5 sm:mt-0'>
                <h1 className="text-xl font-bold">Aktivitas absensi terbaru:</h1>
                <div className="mt-5 overflow-y-scroll space-y-5 max-h-[512px]">
                  {recentActivities.map((activity) => (
                    <div className="flex justify-between mr-3" key={activity.id}>
                      <div className="flex">
                        <img
                          src={assets.defaultprofile}
                          className="mr-3"
                        />
                        <div className="w-full">
                          <p className="text-lg font-bold w-full">{activity.name}</p>
                          <p className="opacity-50 text-sm">{activity.activityTime}</p>
                        </div>
                      </div>
                      <div className="border-l border-[#C5C5C5] flex items-center pl-3">
                        <p className="opacity-50 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Beranda