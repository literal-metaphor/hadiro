import { useEffect, useRef } from "react";
import * as faceapi from '@vladmandic/face-api';

function Camera() {

  const webcamRef = useRef<HTMLVideoElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const instructionCanvasRef = useRef<HTMLCanvasElement>(null);
  const takePhotoButtonRef = useRef<HTMLButtonElement>(null);
  const studentSelectRef = useRef<HTMLSelectElement>(null);

  let initialDescriptor: Float32Array | null = null;
  let currentDescriptor: Float32Array | null = null;
  let canTakePhoto = false;
  let challengeDone = false;

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
        if (video) {
          video.srcObject = currentStream;

          const settings = currentStream.getVideoTracks()[0].getSettings();
          if (faceCanvas && instructionCanvas) {
            faceCanvas.width = settings.width || 640;
            faceCanvas.height = settings.height || 480;
            instructionCanvas.width = settings.width || 640;
            instructionCanvas.height = settings.height || 480;
          }
        }
      };

      // Initialize
      await startVideoStream();
      if (video && faceCanvas && instructionCanvas && takePhotoButton) {
        detectRealTime(video, faceCanvas, instructionCanvas, takePhotoButton);
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
          canTakePhoto = false;
          initialDescriptor = null;
          challengeDone = false;
          drawInstructions("Wajah tidak terdeteksi");
          return;
        }

        currentDescriptor = detection.descriptor;

        // Draw boxes and details for each detection
        const box = detection.detection.box;
        const { width, height, top, left } = box;

        // Draw the bounding box
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 4;
        ctx.strokeRect(left, top, width, height);

        if (!initialDescriptor) {
          initialDescriptor = detection.descriptor;
        } else {
          const distance = faceapi.euclideanDistance(initialDescriptor, currentDescriptor);

          if (distance > 0.6) {
            console.log("Face mismatch, restarting!");
            drawInstructions("Wajah tidak sesuai, tolong ulangi dari awal");
            initialDescriptor = null;
            challengeDone = false;
          } else {
            if (!challengeDone) {
              const happyScore = detection.expressions.happy;
              drawInstructions(`Tolong senyum dengan lebar (${Math.min(Math.floor((happyScore / 0.7) * 100), 100)}%)`);

              if (happyScore > 0.7) {
                challengeDone = true;
              }
            } else {
              drawInstructions("Wajah siap untuk difoto");
              canTakePhoto = true;
            }
          }
        }

        // Assuming takePhotoButton is defined somewhere in your code
        takePhotoButton.disabled = !canTakePhoto;
      }

      setInterval(() => detectFrame(), 500);
    };

    initialize();
  }, []);

  return (
    <>
      <button id="takePhoto" ref={takePhotoButtonRef} disabled>Ambil Foto</button>
      <select id="studentSelect" ref={studentSelectRef} disabled>
        <option>-- Ambillah foto terlebih dahulu --</option>
      </select>
      <div>
        <video className="absolute" id="webcam" ref={webcamRef} autoPlay muted></video>
        <canvas className="absolute" id="faceCanvas" ref={faceCanvasRef}></canvas>
        <canvas className="absolute" id="instructionCanvas" ref={instructionCanvasRef}></canvas>
      </div>
    </>
  );
}

export default Camera;