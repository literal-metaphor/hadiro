import { useState } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import LineChart from '../../components/linechart';
import PieChart from '../../components/piechart';
import apiClient from '../../api/axios.ts';

function Beranda() {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [hadir, setHadir] = useState("kehadiran");
  const [sort, setSort] = useState("tinggi");
  const [dateRange, setDateRange] = useState<string | null>("1 minggu");
  const [isExpanded, setIsExpanded] = useState<number[]>([]);
  const pieChartData = [
    { category: "Hadir", value: 875 },//total startDate - endDate
    { category: "Sakit", value: 22 },
    { category: "Dispensasi", value: 12 },
    { category: "Izin", value: 15 },
    { category: "T.K", value: 10 }
  ];
  const lineChartData = [
    { value: 50 },//date 1
    { value: 200 },//date 2
    { value: 150 },//date 3
    { value: 175 },
    { value: 250 },
    { value: 0 },
    { value: 0 },
  ];
  //server
  // let users = [];
  // const response = await apiClient.get('/attendance/insight', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  // if (response.data) {
  //   users = response.data;
  // } else {
  //   console.error('Unexpected response structure:', response.data);
  //   throw new Error('Unexpected response structure');
  // }

  let users = [];
  const getInsight = async () => {
    const response = await apiClient.get('/attendance/insight', {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    })
    if (response.data) {
      users = response.data;
      console.log(users);
    } else {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Unexpected response structure');
    }
  }

  getInsight();

  //client
  /*const users = [
    {
      id: 1,
      name: "Imanuel Revo Admojo",
      attendanceRatio: "99.9%",
      attendanceTimeAvg: "05:49",
      latestAttendance: "17 Agustus 1945",
      mostInattendanceReason: "Sakit",
    },
    {
      id: 2,
      name: "Emmanuel Jason",
      attendanceRatio: "95.0%",
      attendanceTimeAvg: "06:15",
      latestAttendance: "16 Agustus 1945",
      mostInattendanceReason: "Libur",
    },
    {
      id: 3,
      name: "User",
      attendanceRatio: "90.1%",
      attendanceTimeAvg: "06:41",
      latestAttendance: "15 Agustus 1945",
      mostInattendanceReason: "TK",
    },
  ];*/
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
    const aRate = parseFloat(a.attendanceRatio);
    const bRate = parseFloat(b.attendanceRatio);

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
  const toggleStartDate = () => {
    setDateRange(null);
    toggleEdit();
    //change linechartdata & piechartdata
  };
  const toggleEndDate = () => {
    setDateRange(null);
    toggleEdit();
    //change linechartdata & piechartdata
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
                    <input type="date" defaultValue={startDate.toString()} max={endDate.toString()} className='border border-[#C5C5C5] rounded opacity-50' onBlur={(e) => { toggleStartDate(); setStartDate(e.target.value) }} />
                    {" - "}
                    <input type="date" defaultValue={endDate.toString()} min={startDate.toString()} max={new Date().toISOString().split("T")[0]} className='border border-[#C5C5C5] rounded opacity-50' onBlur={(e) => { toggleEndDate(); setEndDate(e.target.value) }} />
                  </>
                ) : (
                  <p className="opacity-50 mt-1 hover:cursor-pointer" onClick={toggleEdit}>{formatDate(startDate)} - {formatDate(endDate)}</p>
                )}
              </form>
              <div className="mt-5 px-12">
                <LineChart data={lineChartData.map(item => item.value)} label={endDate == new Date().toISOString().split("T")[0] ? true : false} />
              </div>
              <div className="mt-5 px-12 flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-center justify-center">
                  <PieChart data={pieChartData.map(item => item.value)} total={pieChartData.reduce((acc, item) => acc + item.value, 0)} />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 lg:mt-0">
                  <div className="w-24 h-24 bg-[#34A853] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Hadir</span>
                    <span className="text-3xl font-bold">{pieChartData[0].value}</span>
                  </div>
                  <div className="w-24 h-24 bg-[#6B8CB6] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Sakit</span>
                    <span className="text-3xl font-bold">{pieChartData[1].value}</span>
                  </div>
                  <div className="block sm:hidden md:flex w-24 h-24 bg-[#FFB200] text-white p-5 rounded flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">Dispensasi</span>
                    <span className="text-3xl font-bold">{pieChartData[2].value}</span>
                  </div>
                  <div className="hidden sm:flex md:hidden w-24 h-24 mx-auto bg-[#FFB200] text-white p-5 rounded flex flex-col items-center justify-center col-span-2">
                    <span className="text-lg font-semibold">Dispensasi</span>
                    <span className="text-3xl font-bold">{pieChartData[2].value}</span>
                  </div>
                  <div className="flex justify-center gap-5 col-span-full">
                    <div className="w-24 h-24 bg-[#B52FD7] text-white p-5 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">Izin</span>
                      <span className="text-3xl font-bold">{pieChartData[3].value}</span>
                    </div>
                    <div className="w-24 h-24 bg-[#A83436] text-white p-5 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">T.K</span>
                      <span className="text-3xl font-bold">{pieChartData[4].value}</span>
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
                        className="mr-3 self-start mt-1 w-8 rounded-full"
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
                            <li>Tingkat kehadiran <b>{user.attendanceRatio}</b></li>
                            <li>Rata-rata waktu kehadiran <b>{user.attendanceTimeAvg}</b></li>
                            <li>Kehadiran terakhir pada <b>{user.latestAttendance}</b></li>
                            <li>Alasan ketidakhadiran paling sering <b>{user.mostInattendanceReason}</b></li>
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
                          className="mr-3 w-8 rounded-full"
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