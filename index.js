// --- 1. DOM Elements ---
const power = document.getElementById("power");
const video = document.getElementById("videoElement");
const capture = document.getElementById("capture");
const image = document.getElementById("imageDisplay");
const timeDisplay = document.getElementById("timeStamp");
const retake = document.getElementById("retake");
const download = document.getElementById("download");
const buttonGroup = document.querySelector(".buttons");

// --- 2. Global State & Constants ---
let imageFile = null;
let powerState = false;
let cameraStreams = null;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const tl = gsap.timeline({
  defaults: { ease: "power2.inOut" },
});

// --- 3. Helper Functions ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shutdown = () => {
  if (cameraStreams) {
    cameraStreams.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
    cameraStreams = null;
  }
};

const formatTime = () => {
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert to 12h format
  const formattedHours = hours.toString().padStart(2, "0");

  return `${month} ${day}, ${year} ${formattedHours}:${minutes} ${ampm}`;
};

// --- 4. Event Listeners ---

// Power On/Off Logic
power.addEventListener("click", async () => {
  gsap.to(".paper", {
    y: -100,
    rotate: 0,
    duration: 0.8,
  });

  if (!powerState) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreams = stream;
      video.srcObject = stream;
      video.play();
      powerState = true;
    } catch (err) {
    }
  } else {
    shutdown();
    powerState = false;
  }
});

// Capture Photo Logic
capture.addEventListener("click", () => {
  if (powerState && video.readyState === 4) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // Mirror effect handle karne ke liye (Optional but professional)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    imageFile = canvas.toDataURL("image/png");
    image.src = imageFile;

    // Update TimeStamp with fixed HH:MM
    timeDisplay.innerHTML = `<br> ${formatTime()} <br><br>`;

    // Animations
    tl.to(
      ".paper",
      {
        y: 350,
        duration: 2,
      },
      "-=0.5"
    );

    shutdown();
    powerState = false;
    buttonGroup.style.display = "grid";
  } else {
  }
});

// Retake Logic
retake.addEventListener("click", async () => {
  // Scroll to top
  window.scrollTo({ top: 100, behavior: "smooth" });

  // Wait for scroll & UI transition
  await delay(800);

  // Reset Animations
  gsap.to(".paper", {
    y: -100,
    rotate: 0,
    duration: 0.8,
  });

  buttonGroup.style.display = "none";

  // Auto-restart camera if it was off
  if (!powerState) {
    power.click();
  }
});

// Download Logic
download.addEventListener("click", () => {
  if (!imageFile) return;

  const link = document.createElement("a");
  link.href = imageFile;
  link.download = `Capture_${Date.now()}.png`; // Unique filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
