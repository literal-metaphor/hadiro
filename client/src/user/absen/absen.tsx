// import { useState } from 'react';
// import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar"
import Camera from "../../components/camera"

function Absen() {
  return (
    <>
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Absen Sekarang" />
        </div>
        <Camera />
      </div>
    </>
  )
}

export default Absen