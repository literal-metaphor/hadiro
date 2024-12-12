import { useState } from 'react';
import Webcam from 'react-webcam';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar";
import React from 'react';
import apiClient from '../../api/axios.ts';

function Bukuuser() {
  const [nama, setNama] = useState('');
  const [asalInstansi, setAsalInstansi] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [perihal, setPerihal] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    nama: '',
    asalInstansi: '',
    tujuan: '',
    perihal: '',
    nomorTelepon: '',
  });
  const [result, setResult] = useState('');
  const webcamRef = React.useRef<Webcam>(null);
  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); // This is the captured image in base64
    }
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newErrors = {
      nama: '',
      asalInstansi: '',
      tujuan: '',
      perihal: '',
      nomorTelepon: '',
    };
    if (!nama.trim()) newErrors.nama = 'Masukan Nama!';
    if (!asalInstansi.trim()) newErrors.asalInstansi = 'Masukan Asal Instansi!';
    if (!tujuan.trim()) newErrors.tujuan = 'Masukan Tujuan!';
    if (!perihal.trim()) newErrors.perihal = 'Masukan Perihal!';
    console.log(nomorTelepon)
    if (!nomorTelepon.trim()) newErrors.nomorTelepon = 'Masukan Nomor Telepon!';
    if (nomorTelepon.trim() && !/^\d+$/.test(nomorTelepon)) newErrors.nomorTelepon = 'Masukan Nomor Telepon yang valid!';
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error);
    if (!hasErrors) {
      capturePhoto();
      console.log(image);
      //server
      // const response = await apiClient.post('/guest/create', {
      //   name: nama,
      //   instance: asalInstansi,
      //   intention: tujuan,
      //   problem: perihal,
      //   phone_number: nomorTelepon,
      //   photo_path: image //base64
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      // if (response.data) {
      //   capturePhoto();
      //   console.log(image);
      //   setNama('');
      //   setAsalInstansi('');
      //   setTujuan('');
      //   setPerihal('');
      //   setNomorTelepon('');
      //   setResult('Pesan anda telah terkirim, Terimakasih masukannya');
      // } else {
      //   console.error('Unexpected response structure:', response.data);
      //   throw new Error('Unexpected response structure');
      // }
      //client
      setNama('');
      setAsalInstansi('');
      setTujuan('');
      setPerihal('');
      setNomorTelepon('');
      setResult('Pesan anda telah terkirim, Terimakasih masukannya');
    }
  };

  return (
    <>
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Buku Tamu" />
        </div>
        <div className="w-full pt-[78px]">
          <div className="p-12">
            <div className='w-full md:w-3/4 lg:w-2/3 mx-auto'>
              <div className='text-white flex items-center p-5 font-semibold rounded-lg w-full text-left border-none bg-[#1A73E8]'>
                <form className="w-full">
                  <label>
                    Nama
                    <input
                      type="text"
                      placeholder="Masukan nama anda..."
                      className="w-full px-4 py-2 rounded-lg text-black my-3"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                    {errors.nama && <p className="bg-[#FF2400] text-white mb-3 rounded-lg p-2 flex items-center justify-center">{errors.nama}</p>}
                  </label>
                  <label>
                    Asal Instansi
                    <input
                      type="text"
                      placeholder="Masukan nama instansi anda..."
                      className="w-full px-4 py-2 rounded-lg text-black my-3"
                      value={asalInstansi}
                      onChange={(e) => setAsalInstansi(e.target.value)}
                    />
                    {errors.asalInstansi && <p className="bg-[#FF2400] text-white mb-3 rounded-lg p-2 flex items-center justify-center">{errors.asalInstansi}</p>}
                  </label>
                  <label>
                    Tujuan
                    <input
                      type="text"
                      placeholder="Masukan nama guru yang ditemui..."
                      className="w-full px-4 py-2 rounded-lg text-black my-3"
                      value={tujuan}
                      onChange={(e) => setTujuan(e.target.value)}
                    />
                    {errors.tujuan && <p className="bg-[#FF2400] text-white mb-3 rounded-lg p-2 flex items-center justify-center">{errors.tujuan}</p>}
                  </label>
                  <label>
                    Perihal
                    <input
                      type="text"
                      placeholder="Masukan kepentingan anda...."
                      className="w-full px-4 py-2 rounded-lg text-black my-3"
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                    />
                    {errors.perihal && <p className="bg-[#FF2400] text-white mb-3 rounded-lg p-2 flex items-center justify-center">{errors.perihal}</p>}
                  </label>
                  <label>
                    Nomor WA atau Telepon
                    <input
                      type="number"
                      placeholder="Masukan nomor telepon atau wa anda...."
                      className="w-full px-4 py-2 rounded-lg text-black my-3"
                      value={nomorTelepon}
                      onChange={(e) => setNomorTelepon(e.target.value)}
                    />
                    {errors.nomorTelepon && <p className="bg-[#FF2400] text-white mb-3 rounded-lg p-2 flex items-center justify-center">{errors.nomorTelepon}</p>}
                  </label>
                  <label>
                    Foto
                    <div className="w-full bg-[#413C3C] mt-5 p-5 flex flex-col justify-center items-center">
                      <div className="flex mb-5">
                        <label
                          className="bg-transparent text-white opacity-75 text-xl focus:outline-none"
                        >
                          Posisikan wajah Anda dengan tepat
                        </label>
                        <img src={assets.camera} className="w-8 ml-5" />
                      </div>
                      <div className="relative bg-[#090909] w-full aspect-[4/3] rounded-lg p-5 flex justify-center items-center">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </label>
                </form>
              </div>
              <button
                onClick={handleSubmit}
                className='bg-gradient-to-b from-[#1A73E8] to-[#0F4082] flex items-center justify-center w-full p-5 rounded-lg mt-5 text-white hover:text-white focus:outline-none border-0'
              >
                <img
                  src={assets.surat}
                  className='mr-3 w-6 filter invert brightness-0'
                />
                Kirim Permintaan Anda
              </button>
              {result && <>
                <div className="bg-[#34A853] text-white w-full mt-5 p-2 bg-[#34A853] font-medium text-white rounded-lg flex items-center justify-center">
                  <img src={assets.success} className='mr-3' /> {result}
                </div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bukuuser;
