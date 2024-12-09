import { useEffect, useRef } from 'react';
import assets from '../../assets/assets.ts';
import Sidebar from "../../components/sidebar"
import * as faceapi from '@vladmandic/face-api';

function Absen() {
  const history = [
    { name: "JANE DOE", arrivalTime: "07.10", photo: assets.foto },
    { name: "JOHN SMITH", arrivalTime: "06.45", photo: assets.foto },
    { name: "ABED GREATVO SUSENO", arrivalTime: "06.20", photo: assets.foto },
  ];

  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const instructionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const takePhotoButtonRef = useRef<HTMLButtonElement | null>(null);
  const studentSelectRef = useRef<HTMLSelectElement | null>(null);

  const initialDescriptorRef = useRef<Float32Array | null>(null);
  const currentDescriptorRef = useRef<Float32Array | null>(null);
  const canTakePhotoRef = useRef<boolean>(false);
  const challengeDoneRef = useRef<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      const modelsPath = "./face-api-models";

      // Load models
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath);
      await faceapi.nets.faceExpressionNet.loadFromUri(modelsPath);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath);
      
      const video = webcamRef.current;
      const faceCanvas = faceCanvasRef.current;
      const instructionCanvas = instructionCanvasRef.current;
      const takePhotoButton = takePhotoButtonRef.current;
      const studentSelect = studentSelectRef.current;

      let currentStream: MediaStream | null = null;

      // Start video stream
      const startVideoStream = async () => {
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }
      
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: true,
        };
      
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (webcamRef.current) {
          webcamRef.current.srcObject = currentStream;
      
          const settings = currentStream.getVideoTracks()[0].getSettings();
          if (faceCanvasRef.current && instructionCanvasRef.current) {
            faceCanvasRef.current.width = settings.width || 640;
            faceCanvasRef.current.height = settings.height || 480;
            instructionCanvasRef.current.width = settings.width || 640;
            instructionCanvasRef.current.height = settings.height || 480;
          }
        }
      };      

      // Initialize
      await startVideoStream();
      if (video && faceCanvas && instructionCanvas && takePhotoButton) {
        detectRealTime(video, faceCanvas, instructionCanvas, takePhotoButton);
      }

      if (takePhotoButton && studentSelect) {
        const handleTakePhotoClick = async () => {
          if (canTakePhotoRef.current && currentDescriptorRef.current) {
            studentSelect.disabled = true;
            studentSelect.innerHTML = '';
            const firstOption = document.createElement('option');
            studentSelect.appendChild(firstOption);
    
            try {
              const matches = await findClosestMatches(currentDescriptorRef.current);
              if (matches.length) {
                studentSelect.disabled = false;
                firstOption.text = 'Pilih siswa';
                type Match = {
                  label: string;
                };
                const matches: Match[] = await findClosestMatches(currentDescriptorRef.current);
                matches.forEach((match: Match) => {
                  const option = document.createElement('option');
                  option.value = match.label;
                  option.text = `${match.label}`;
                  studentSelect.appendChild(option);
                });
              } else {
                firstOption.text = 'Tidak ada siswa yang sesuai dengan wajah itu';
              }
            } catch (error) {
              console.error('Error finding closest matches:', error);
            }
          }
        };
    
        takePhotoButton.addEventListener('click', handleTakePhotoClick);
      }

      // Cleanup
      return () => {
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }
      };
    }

    const detectRealTime = async (video: HTMLVideoElement, faceCanvas: HTMLCanvasElement, instructionCanvas: HTMLCanvasElement, takePhotoButton: HTMLButtonElement) => {
      const ctx = faceCanvas.getContext('2d');
      const ictx = instructionCanvas.getContext('2d');

      if (!ctx || !ictx) {
        alert("Something went wrong with the canvas 2D context!");
        return;
      }

      function drawInstructions(instructionText: string) {
        if (!ctx || !ictx) {
          alert("Something went wrong with the canvas 2D context!");
          return;
        }

        ictx.clearRect(0, 0, instructionCanvas.width, instructionCanvas.height);

        ictx.font = "bold 24px Arial";
        ictx.fillStyle = "white";
        ictx.textAlign = "center";

        const textWidth = ictx.measureText(instructionText).width;
        const padding = 20;
        const textX = ictx.canvas.width / 2;
        const textY = ictx.canvas.height - 50;
        ictx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ictx.fillRect(textX - textWidth / 2 - padding / 2, textY - 30, textWidth + padding, 40);

        ictx.fillStyle = "white";
        ictx.fillText(instructionText, textX, textY);
      }

      async function detectFrame() {
        if (!ctx || !ictx) {
          alert("Something went wrong with the canvas 2D context!");
          return;
        }

        // Detect faces
        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptor();

        ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        ictx.clearRect(0, 0, instructionCanvas.width, instructionCanvas.height);

        if (!detection) {
          canTakePhotoRef.current = false;
          initialDescriptorRef.current = null;
          challengeDoneRef.current = false;
          drawInstructions("Wajah tidak terdeteksi");
          return;
        }

        currentDescriptorRef.current = detection.descriptor;

        // Draw boxes and details for each detection
        const box = detection.detection.box;
        const { width, height, top, left } = box;

        // Draw the bounding box
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 4;
        ctx.strokeRect(left, top, width, height);

        if (!initialDescriptorRef.current) {
          initialDescriptorRef.current = detection.descriptor;
        } else {
          const distance = faceapi.euclideanDistance(initialDescriptorRef.current, currentDescriptorRef.current);

          if (distance > 0.6) {
            //console.log("Face mismatch, restarting!");
            drawInstructions("Wajah tidak sesuai, tolong ulangi dari awal");
            initialDescriptorRef.current = null;
            challengeDoneRef.current = false;
          } else {
            if (!challengeDoneRef.current) {
              const happyScore = detection.expressions.happy;
              drawInstructions(`Tolong senyum dengan lebar (${Math.min(Math.floor((happyScore / 0.7) * 100), 100)}%)`);

              if (happyScore > 0.7) {
                challengeDoneRef.current = true;
              }
            } else {
              drawInstructions("Wajah siap untuk difoto");
              canTakePhotoRef.current = true;
            }
          }
        }

        takePhotoButton.disabled = !canTakePhotoRef.current;
      }

      setInterval(() => detectFrame(), 500);
    };

    const findClosestMatches = async (descriptor: Float32Array) => {
      try {
        const response = await fetch('/api/v1/find-closest-matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descriptor }),
        });

        if (!response.ok) {
          console.error('Error:', await response.text());
          return [];
        }

        const matches = await response.json();
        return matches;
      } catch (error) {
        console.error('Fetch error:', error);
        return [];
      }
    };

    initialize();
  }, []);

  return (
    <div className="flex">
      <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 h-full">
        <Sidebar active="Absen Sekarang" />
      </div>
      <div className="w-full pt-[78px]">
        <div className="p-12">
          <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-1">
            <div className="lg:col-span-2 w-full">
              <h1 className="text-3xl font-bold">Dokumentasi Kehadiran</h1>
              <button
                id="takePhoto"
                ref={takePhotoButtonRef}
                disabled
                className="flex items-center p-2 px-3 rounded mt-5 text-white bg-[#1A73E8] hover:text-white shadow-md shadow-gray-500 focus:outline-none"
              >
                Ambil Foto
              </button>
              <div className="w-full bg-[#413C3C] my-5 p-5 flex flex-col justify-center items-center">
                <div className="flex mb-5">
                  <select
                    id="studentSelect"
                    className="bg-transparent text-white text-xl pe-5"
                    ref={studentSelectRef}
                    disabled
                  >
                    <option>Ambillah foto terlebih dahulu</option>
                  </select>
                  <img src={assets.camera} className="w-8 ml-5" />
                </div>
                <div className="relative bg-[#090909] w-full aspect-[4/3] rounded-lg p-5 flex justify-center items-center">
                  <video
                    id="webcam"
                    ref={webcamRef}
                    autoPlay
                    muted
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  ></video>
                  <canvas
                    id="faceCanvas"
                    ref={faceCanvasRef}
                    className="absolute inset-0 w-full h-full rounded-lg"
                  ></canvas>
                  <canvas
                    id="instructionCanvas"
                    ref={instructionCanvasRef}
                    className="absolute inset-0 w-full h-full rounded-lg"
                  ></canvas>
                </div>
              </div>
            </div>
            <div className="w-full h-screen overflow-y-auto mr-1 lg:w-auto lg:col-span-1">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="w-full border border-black rounded-lg bg-[#E1EEFF] p-5 flex items-center justify-start shadow-md shadow-gray-500 mb-3"
                >
                  <img src={item.photo} className="h-full object-cover" />
                  <div className="ml-5 flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span>Jam Kedatangan: {item.arrivalTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Absen;