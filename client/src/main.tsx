import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './login/login.tsx'
import Beranda from './beranda/beranda.tsx'
import Siswa from './siswa/siswa.tsx';
import Riwayat from './riwayat/riwayat.tsx';
import Buku from './buku/buku.tsx';

const email = localStorage.getItem('email');//this is basically token
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={email ? <Navigate to="/beranda" /> : <Login />} />
        <Route path="/beranda" element={email ? <Beranda /> : <Navigate to="/" />} />
        <Route path="/siswa" element={email ? <Siswa /> : <Navigate to="/" />} />
        <Route path="/riwayat" element={email ? <Riwayat /> : <Navigate to="/" />} />
        <Route path="/buku" element={email ? <Buku /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </StrictMode>
)
