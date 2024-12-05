import * as faceapi from '@vladmandic/face-api';

let initialDescriptor = null;
let currentDescriptor = null;
let challengeDone = false;
let canTakePhoto = false;

document.addEventListener("DOMContentLoaded", async () => {
    //await faceapi.nets.ssdMobilenetv1.loadFromUri('./model');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./model');
    await faceapi.nets.faceLandmark68Net.loadFromUri('./model');
    await faceapi.nets.faceExpressionNet.loadFromUri('./model');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./model');

    const cameraSelect = document.getElementById("camera-select");
    const studentSelect = document.getElementById("student-select");
    const video = document.getElementById('webcam');
    const faceCanvas = document.getElementById("face");
    const instructionCanvas = document.getElementById("instruction");
    const takePhotoButton = document.getElementById("take-photo");

    let currentStream = null;

    // Populate camera options
    const populateCameraOptions = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        cameraSelect.innerHTML = ""; // Clear any existing options

        videoDevices.forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });
    };

    // Start video stream
    const startVideoStream = async (deviceId = null) => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            audio: false,
            video: deviceId ? { deviceId: { exact: deviceId } } : true,
        };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;

        const settings = currentStream.getVideoTracks()[0].getSettings();
        faceCanvas.width = settings.width || 640;
        faceCanvas.height = settings.height || 480;
        instructionCanvas.width = settings.width || 640;
        instructionCanvas.height = settings.height || 480;
    };

    // Handle camera change
    cameraSelect.addEventListener("change", () => {
        const deviceId = cameraSelect.value;
        startVideoStream(deviceId);
    });

    // Initialize
    await populateCameraOptions();
    cameraSelect.dispatchEvent(new Event("change"));

    detectRealTime(video, faceCanvas, instructionCanvas);

    // Take Photo
    takePhotoButton.addEventListener('click', function () {
        if (canTakePhoto && currentDescriptor) {
            findClosestMatches(currentDescriptor)
                .then(matches => {
                    if (matches.length) {
                        studentSelect.innerHTML = ''; // Clear existing options

                        matches.forEach(match => {
                            const option = document.createElement('option');
                            option.value = match.label; 
                            option.text = `${match.label}`;
                            studentSelect.appendChild(option);
                        });
                    } else {
                        console.log('No matches found.');
                    }
                })
                .catch(error => console.error('Error finding closest matches:', error));
        }
    });

})

async function detectRealTime(video, faceCanvas, instructionCanvas) {
    const ctx = faceCanvas.getContext('2d');
    const ictx = instructionCanvas.getContext('2d');

    if (!ctx || !ictx) {
        alert("Something went wrong with the canvas 2D context!");
        return;
    }

    function drawInstructions(instructionText) {
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
        };

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

        // Draw additional data details
        ctx.fillStyle = 'cyan';
        ctx.font = '16px Arial';

        if (!initialDescriptor) {
            initialDescriptor = detection.descriptor;
        } else {
            const currentDescriptor = detection.descriptor;
            const distance = faceapi.euclideanDistance(initialDescriptor, currentDescriptor);

            if (distance > 0.6) {
                console.log("Face mismatch, restarting!");
                drawInstructions("Wajah tidak sesuai, tolong ulangi dari awal");
                initialDescriptor = null;
                challengeDone = false;
            } else {
                if (!challengeDone) {
                    const happyScore = detection.expressions.happy;
                    drawInstructions(`Tolong senyum dengan lebar (${Math.floor((happyScore / 0.7) * 100)}%)`);

                    if (happyScore > 0.7) {
                        challengeDone = true;
                        console.log("Challenge done!");
                        drawInstructions("Wajah siap untuk difoto");
                        //findClosestMatches(detection.descriptor);
                        canTakePhoto = true;
                        //findBestMatch(detection.descriptor, ctx, left, top);
                    }
                } else {
                    // send descriptor to server for matching
                    //findClosestMatches(detection.descriptor);
                    canTakePhoto = true;
                    //findBestMatch(detection.descriptor, ctx, left, top);
                }
            }
        }

    }

    setInterval(() => detectFrame(), 500);
}

async function loadReferenceDescriptors() {
    try {
        const response = await fetch('/api/load-descriptors');
        const labeledDescriptorsData = await response.json();

        const labeledDescriptors = labeledDescriptorsData.map(item => {

            const descriptors = Array.isArray(item.descriptors)
                ? item.descriptors.map(desc => new Float32Array(Object.values(desc)))
                : [new Float32Array(Object.values(item.descriptors))];

            return new faceapi.LabeledFaceDescriptors(item.label, descriptors);
        });

        return labeledDescriptors;
    } catch (error) {
        console.error('Error loading labeled descriptors:', error);
        return [];
    }
}

// Load reference descriptors
const labeledDescriptors = await loadReferenceDescriptors();
if (!labeledDescriptors.length) {
    console.error('No labeled descriptors found in the folder.');
}

async function findClosestMatches(descriptor) {
    /*fetch('/api/find-best-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor }),
    })
        .then(async (response) => {
            if (response.ok) {
                const matches = await response.json();
                console.log('Top Matches:', matches);
                return matches;
            } else {
                console.error('Error:', await response.text());
                return [];
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            return [];
        });*/
    try {
        const response = await fetch('/api/find-best-match', {
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
}

/*async function findBestMatch(descriptor, ctx, left, top) {

    if (!labeledDescriptors.length) {
        console.error('No labeled descriptors found in the folder.');
        return;
    }

    // Create FaceMatcher with the loaded descriptors
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

    // Find the best match for the given detection
    const bestMatch = faceMatcher.findBestMatch(descriptor);
    console.log(bestMatch);
    ctx.fillText(bestMatch.label, left, top - 60);
}*/