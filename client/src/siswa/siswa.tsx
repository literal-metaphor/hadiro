// import { useState } from 'react';
// import assets from '../assets/assets.ts';
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

function Siswa() {
  return (
    <>
      <div className="flex h-screen">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Siswa" />
        </div>
        <div className="w-full pt-20">
          <Topbar />
          <h1>SISWA</h1>
        </div>
      </div>
    </>
  )
}

export default Siswa