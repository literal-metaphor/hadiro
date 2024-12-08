import * as faceapi from "@vladmandic/face-api";

const modelsPath = "../assets/face-api-models";

await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath);
await faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath);
await faceapi.nets.faceExpressionNet.loadFromUri(modelsPath);
await faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath);

function Camera() {

  return (
    <>
      
    </>
  );
}

export default Camera;