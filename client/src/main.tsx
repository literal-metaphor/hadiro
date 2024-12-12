import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './login/login.tsx'
import Beranda from './admin/beranda/beranda.tsx'
import Siswa from './admin/siswa/siswa.tsx';
import Riwayat from './admin/riwayat/riwayat.tsx';
import Buku from './admin/buku/buku.tsx';
import Absen from './user/absen/absen.tsx';
import Surat from './user/surat/surat.tsx';
import Jurnal from './user/jurnal/jurnal.tsx';
import Pelanggaran from './user/pelanggaran/pelanggaran.tsx';
import Bukuuser from './user/bukuuser/bukuuser.tsx';

const token = localStorage.getItem('token');//this is basically token

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to={"/beranda"} /> : <Navigate to={"/absen"} />} />

        {/* admin */}
        {token && (
          <>
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/riwayat" element={<Riwayat />} />
            <Route path="/buku" element={<Buku />} />
          </>
        )}

        {/* user */}
        {(!token) && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/absen" element={<Absen />} />
            <Route path="/surat" element={<Surat />} />
            <Route path="/jurnal" element={<Jurnal />} />
            <Route path="/pelanggaran" element={<Pelanggaran />} />
            <Route path="/bukuuser" element={<Bukuuser />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </StrictMode>
);