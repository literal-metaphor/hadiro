import { useState, useEffect, useRef } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar";
import Topbar from "../../components/topbar";
import LineChart from '../../components/linechart';
import PieChart from '../../components/piechart';
import apiClient from '../../api/axios.ts';

type User = {
  id: string;
  name: string;
  attendanceRatio: string;
  attendanceTimeAvg: string;
  latestAttendance: string;
  mostInattendanceReason: string;
};

type Student = {
  name: string;
};

type Activity = {
  id: string;
  name: string;
  created_at: string;
  student: Student;
};

type RecentActivity = {
  id: string;
  name: string;
  activityTime: string;
  time: string;
};

type AttendanceCounts = { 
  [key: string]: number 
};

function Beranda() {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [hadir, setHadir] = useState("kehadiran");
  const [sort, setSort] = useState("tinggi");
  const [dateRange, setDateRange] = useState<string | null>("1 minggu");
  const [isExpanded, setIsExpanded] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [lineChartData, setLineChartData] = useState<number[]>([]);
  const [pieChartData, setPieChartData] = useState<{ category: string; value: number }[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [recentActivitiesLoading, setRecentActivitiesLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  
  //server
  const getInsight = async () => {
    try {
      const response = await apiClient.get('/attendance/insight', {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      });
      if (response.data) {
        setUsers(response.data);
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setUsersLoading(false);
    }
  }

  const getRecentActivities = async () => {
    try {
      const response = await apiClient.get('/attendance/paginate', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          page: 1
        },
        timeout: 20000,
      });
      if (response.data) {
        const activities = response.data.result.map((activity: Activity, index: number) => ({
          id: index,
          name: activity.student.name,
          activityTime: formatActivityTime(activity.created_at),
          time: (new Date(activity.created_at)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: "h24" }),
        }));
        setRecentActivities(activities);
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRecentActivitiesLoading(false);
    }
  }

  const getStats = async () => {
    setChartsLoading(true);
    try {
      const response = await apiClient.get('/attendance/stats', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          from: startDate,
          until: endDate
        },
        timeout: 20000,
      });
      if (response.data) {
        const { attendances, inattendances } = response.data;

        //console.log(startDate, endDate);

        // Process line chart data
        const lineData = attendances.reduce((acc: AttendanceCounts, date: string) => {
          const dateObj = new Date(date);
          const dateKey = dateObj.toISOString().split('T')[0];
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {});
        const sortedLineData = Object.keys(lineData).sort().map(key => lineData[key]);
        setLineChartData(sortedLineData);

        // Process pie chart data
        const attendanceCounts = attendances.reduce((acc: AttendanceCounts) => {
          acc['HADIR'] = (acc['HADIR'] || 0) + 1;
          return acc;
        }, {});

        const inattendanceCounts = inattendances.reduce((acc: AttendanceCounts, reason: string) => {
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {});

        const combinedCounts = { ...attendanceCounts, ...inattendanceCounts };
        const pieDataArray = Object.keys(combinedCounts).map(key => ({
          category: key,
          value: combinedCounts[key]
        }));
        setPieChartData(pieDataArray);
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setChartsLoading(false);
    }
  }

  //client
  const sortedUsers = [...users].sort((a, b) => {
    const aRate = parseFloat(a.attendanceRatio.replace('%', ''));
    const bRate = parseFloat(b.attendanceRatio.replace('%', ''));

    if (hadir == "kehadiran") {
      return sort == "tinggi" ? bRate - aRate : aRate - bRate;
    } else {
      return sort == "tinggi" ? aRate - bRate : bRate - aRate;
    }
  });

  const toggleHadir = () => setHadir(hadir == "kehadiran" ? "ketidakhadiran" : "kehadiran");
  const toggleSort = () => setSort(sort == "tinggi" ? "rendah" : "tinggi");
  const toggleExpand = (id: string) => {
    setIsExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const formatActivityTime = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) {
      return `${Math.floor(diffInMs / 1000)} detik yang lalu`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
    }
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
  };
  const toggleEndDate = () => {
    setDateRange(null);
    toggleEdit();
  };

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    getInsight();
    getRecentActivities();
  }, []);

  useEffect(() => {
    getStats();
  }, [startDate, endDate]);
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
                {chartsLoading ? (
                  <p>Loading...</p>
                ) : (
                  <LineChart data={lineChartData} label={endDate == new Date().toISOString().split("T")[0] ? true : false} />
                )}
              </div>
              <div className="mt-5 px-12 flex flex-col lg:flex-row items-center justify-between">
                {chartsLoading ? (
                  <p>Loading...</p>
                ) : (
                  <><div className="flex items-center justify-center">
                      <PieChart data={pieChartData.map(item => item.value)} total={pieChartData.reduce((acc, item) => acc + item.value, 0)} />
                    </div><div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 lg:mt-0">
                        <div className="w-24 h-24 bg-[#34A853] text-white p-5 rounded flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold">Hadir</span>
                          <span className="text-3xl font-bold">{pieChartData.find(item => item.category === "HADIR")?.value || 0}</span>
                        </div>
                        <div className="w-24 h-24 bg-[#6B8CB6] text-white p-5 rounded flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold">Sakit</span>
                          <span className="text-3xl font-bold">{pieChartData.find(item => item.category === "SAKIT")?.value || 0}</span>
                        </div>
                        <div className="block sm:hidden md:flex w-24 h-24 bg-[#FFB200] text-white p-5 rounded flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold">Dispensasi</span>
                          <span className="text-3xl font-bold">{pieChartData.find(item => item.category === "DISPEN")?.value || 0}</span>
                        </div>
                        <div className="flex justify-center gap-5 col-span-full">
                          <div className="w-24 h-24 bg-[#B52FD7] text-white p-5 rounded flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold">Izin</span>
                            <span className="text-3xl font-bold">{pieChartData.find(item => item.category === "IZIN")?.value || 0}</span>
                          </div>
                          <div className="w-24 h-24 bg-[#A83436] text-white p-5 rounded flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold">T.K</span>
                            <span className="text-3xl font-bold">{pieChartData.find(item => item.category === "TK")?.value || 0}</span>
                          </div>
                        </div>
                      </div></>
                )}
              </div>
            </div>
            <div className="mt-5 flex flex-col md:flex-row">
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-3/5 mr-5'>
                <h1 className="text-xl font-bold">Siswa dengan tingkat <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleHadir}>{hadir}</span> paling <span className='text-blue-500 hover:cursor-pointer select-none' onClick={toggleSort}>{sort}</span>:</h1>
                <div className="mt-5 overflow-y-scroll space-y-5 max-h-[512px]">
                  {usersLoading ? (
                    <p>Loading...</p>
                  ) : (
                    sortedUsers.map((user: User) => (
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
                    ))
                  )}
                </div>
              </div>
              <div className='bg-white rounded-lg border border-[#C5C5C5] p-5 w-full md:w-2/5 mt-5 sm:mt-0'>
                <h1 className="text-xl font-bold">Aktivitas absensi terbaru:</h1>
                <div className="mt-5 overflow-y-scroll space-y-5 max-h-[512px]">
                  {recentActivitiesLoading ? (
                    <p>Loading...</p>
                  ) : (
                    recentActivities.map((recentActivity: RecentActivity) => (
                      <div className="flex justify-between mr-3" key={recentActivity.id}>
                        <div className="flex">
                          <img
                            src={assets.defaultprofile}
                            className="mr-3 w-8 rounded-full"
                          />
                          <div className="w-full">
                            <p className="text-lg font-bold w-full">{recentActivity.name}</p>
                            <p className="opacity-50 text-sm">{recentActivity.activityTime}</p>
                          </div>
                        </div>
                        <div className="border-l border-[#C5C5C5] flex items-center pl-3">
                          <p className="opacity-50 text-sm">{recentActivity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
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