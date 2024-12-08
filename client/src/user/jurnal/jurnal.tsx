import { useState } from "react";
import assets from "../../assets/assets.ts";
import Sidebar from "../../components/sidebar";

function Jurnal() {
  const departments: Record<string, string[]> = {
    "Teknik Grafika": ["Teknik Grafika A", "Teknik Grafika B", "Teknik Grafika C", "Teknik Grafika D", "Teknik Grafika E", "Teknik Grafika F", "Teknik Grafika G", "Teknik Grafika H"],
    "Rekayasa Perangkat Lunak": ["Rekayasa Perangkat Lunak A", "Rekayasa Perangkat Lunak B", "Rekayasa Perangkat Lunak C"],
    "Desain Komunikasi Visual": ["Desain Komunikasi Visual A", "Desain Komunikasi Visual B", "Desain Komunikasi Visual C"],
    "Animasi": ["Animasi A", "Animasi B", "Animasi C"],
    "Teknik Mekatronika": ["Teknik Mekatronika A", "Teknik Mekatronika B"],
    "Perhotelan": ["Perhotelan A", "Perhotelan B"],
    "Teknik Komputer Jaringan": ["Teknik Komputer Jaringan A", "Teknik Komputer Jaringan B"],
    "Teknik Logistik": ["Teknik Logistik A", "Teknik Logistik B"],
  };  
  const abbreviations: Record<string, string> = {
    "Teknik Grafika": "TG",
    "Rekayasa Perangkat Lunak": "RPL",
    "Desain Komunikasi Visual": "DKV",
    "Animasi": "ANI",
    "Teknik Mekatronika": "TM",
    "Perhotelan": "PH",
    "Teknik Komputer Jaringan": "TKJ",
    "Teknik Logistik": "TL",
  };
  const buttonStyles: Record<string, string> = {
    "Teknik Grafika": "bg-gradient-to-b from-[#D1D100] to-[#996B00]",
    "Rekayasa Perangkat Lunak": "bg-gradient-to-b from-[#1A73E8] to-[#1A59AB]",
    "Desain Komunikasi Visual": "bg-gradient-to-b from-[#DA1EB4] to-[#B52FD7]",
    "Animasi": "bg-gradient-to-b from-[#FF0000] to-[#940000]",
    "Teknik Mekatronika": "bg-gradient-to-b from-[#FF6F00] to-[#8D4B00]",
    "Perhotelan": "bg-gradient-to-b from-[#A06B00] to-[#552D00]",
    "Teknik Komputer Jaringan": "bg-gradient-to-b from-[#34A853] to-[#00661B]",
    "Teknik Logistik": "bg-gradient-to-b from-[#B52FD7] to-[#400050]",
  };
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null);
  const handleButtonClick = (department: string) => {
    setCurrentDepartment(department);
  };
  const handleSubButtonClick = (subGroup: string) => {
    console.log(`Sub-department selected: ${subGroup}`);// Handle sub-department click here
  };
  const currentButtons = currentDepartment
    ? departments[currentDepartment] || []
    : Object.keys(departments);
  return (
    <>
      <div className="flex">
        <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
          <Sidebar active="Jurnal Kelas" />
        </div>
        <div className="w-full pt-[78px]">
          <div className="p-12">
            <h1 className="text-3xl font-bold mb-5 text-black">
              <span onClick={() => setCurrentDepartment(null)} className="hover:cursor-pointer select-none">
                Jurnal Kehadiran KBM SMKN 4 Malang
              </span>
              {currentDepartment ? ` > ${abbreviations[currentDepartment]}` : ""}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {currentButtons.map((button, index) => {
                const isTeknikGrafika = currentDepartment === "Teknik Grafika";
                const dynamicStyle = currentDepartment
                  ? isTeknikGrafika
                    ? index < 4
                      ? "bg-gradient-to-b from-[#D1D100] to-[#996B00]"
                      : "bg-gradient-to-b from-[#111729] to-[#1A59AB]"
                    : buttonStyles[currentDepartment] || "bg-gray-500 hover:bg-gray-600"
                  : "bg-[#1A73E8] hover:bg-[#1357B5]";
                return (
                  <button
                    key={index}
                    className={`shadow-md shadow-gray-500 text-white flex items-center py-2 px-4 rounded-lg w-full text-left focus:outline-none border-none bg-[#1A73E8] ${dynamicStyle}`}
                    onClick={() =>
                      currentDepartment
                        ? handleSubButtonClick(button)
                        : handleButtonClick(button)
                    }
                  >
                    <img
                      src={assets.jurnal}
                      className="mr-3 w-6 filter invert brightness-0"
                    />
                    {button}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Jurnal;