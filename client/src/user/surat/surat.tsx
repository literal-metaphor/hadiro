import { useState } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar";

function Surat() {
  const [fileName, setFileName] = useState("Upload File Perizinan");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFileName(file ? file.name : "Upload File Perizinan");
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    if (file) {
      setFileName(file.name);

      const inputElement = document.getElementById("file-upload") as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if(fileName == "Upload File Perizinan") {
      setError("Masukan File!");
    } else {
      setFileName("Upload File Perizinan");
      // setResult("Tidak dapat mengirim coba lagi nanti");
      setResult("Surat Izin Berhasil terkirim");
    }
  };
  return (
    <>
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Surat Izin" />
        </div>
        <div className="w-full pt-[78px]">
          <div className="p-12">
            <h1 className="text-3xl font-bold">Kirim Perizinan Siswa</h1>
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="relative border border-[2px] border-[#E5E5E5] bg-white shadow-md shadow-gray-500 rounded-lg p-2 flex items-center w-full md:w-2/3 lg:w-1/2">
                <img src={assets.upload} className="ms-3 mr-5 w-6" alt="Upload" />
                <label htmlFor="file-upload" className="w-full font-bold">
                  {fileName}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0"
                  onChange={handleFileChange}
                />
              </div>
              <div
                className={`mt-5 bg-[#D9D9D9] aspect-square rounded-lg p-5 flex flex-col items-center justify-center w-full md:w-2/3 lg:w-1/2 ${
                  isDragOver ? "bg-gray-300" : "bg-[#D9D9D9]"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <img
                  src={assets.file}
                  className="w-16 mb-3"
                />
                <p className="text-gray-600 font-semibold">
                  Drop your file in the form
                </p>
              </div>
              <div className='flex'>
                <button
                  className='flex items-center p-2 px-3 rounded mt-5 text-white bg-[#1A73E8] hover:text-white shadow-md shadow-gray-500 focus:outline-none'
                >
                  <img
                    src={assets.surat}
                    className='mr-3 w-6 filter invert brightness-0'
                  />
                  Kirim Surat Izin
                </button>
                {error && <div className="bg-[#FF2400] text-white ms-5 mt-5 rounded p-2 px-3 flex items-center justify-center">
                  <img src={assets.error} className='mr-3' /> {error}
                </div>}
                {result == "Surat Izin Berhasil terkirim" && <>
                  <div className="hidden xl:flex absolute top-[78px] right-0 px-24 py-6 bg-[#34A853] font-medium text-white me-12 mt-12 rounded flex items-center justify-center">
                    <img src={assets.success} className='mr-5' /> {result}
                  </div>
                  <div className="xl:hidden bg-[#34A853] text-white ms-5 mt-5 p-2 px-3 bg-[#34A853] font-medium text-white rounded flex items-center justify-center">
                    <img src={assets.success} className='mr-3' /> {result}
                  </div>
                </>}
                {result == "Tidak dapat mengirim coba lagi nanti" && <>
                  <div className="hidden xl:flex absolute top-[78px] right-0 px-20 py-6 bg-[#A83436] font-medium text-white me-12 mt-12 rounded flex items-center justify-center">
                    <img src={assets.fail} className='mr-5' /> {result}
                  </div>
                  <div className="xl:hidden bg-[#34A853] text-white ms-5 mt-5 p-2 px-3 bg-[#A83436] font-medium text-white rounded flex items-center justify-center">
                    <img src={assets.fail} className='mr-3' /> {result}
                  </div>
                </>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Surat;
