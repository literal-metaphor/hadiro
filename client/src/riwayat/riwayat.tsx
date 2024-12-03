// import { useState } from 'react';
// import assets from '../assets/assets.ts';
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

function Riwayat() {
  return (
    <>
      <div className="flex h-screen">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Riwayat" />
        </div>
        <div className="w-full pt-[78px]">
          <Topbar />
          <div className="p-12">
            <h1>RIWAYAT</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Riwayat