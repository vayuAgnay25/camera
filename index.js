const capture = document.getElementById("capture");
const retake = document.getElementById("retake");
const video = document.getElementById("videoElement");
const image = document.getElementById("imageDisplay");
const timeDisplay = document.getElementById("timeStamp");
const download = document.getElementById("download");
let toggleCamera = false;
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
capture.innerText = "On";
let count = 0;
const defaultWidth = window.innerWidth;
const defaultHeight = window.innerHeight;

function startCamera() {
  if (toggleCamera) {
    capture.innerText = "On";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageFile = canvas.toDataURL("image/png");
    image.src = imageFile;
    const currentTime = new Date();
    timeDisplay.innerHTML = `<br> ${
      months[currentTime.getMonth()]
    } ${currentTime.getDate()}, ${currentTime.getFullYear()} ${currentTime.getHours()>12?(currentTime.getHours()-12):(currentTime.getHours())}:${currentTime.getMinutes()}${currentTime.getHours()>12? "PM":"AM"}<br><br>`;
    image.classList.add("loaded");
    video.srcObject.getTracks().forEach((track) => track.stop());
    toggleCamera = false;
    console.log("x");
    download.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = imageFile;
        a.download = `photo_${count + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    document.querySelector(".buttons").style.display = "grid";
    count++;
  } 
  else {
    capture.innerText = "Snap";
    image.classList.remove("loaded");
    timeDisplay.innerHTML = ``;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      toggleCamera = true;
      video.srcObject = stream;
      video.play();
    });
    console.log("y");
    document.querySelector(".buttons").style.display = "none";
  }
}

capture.addEventListener("click", () => {
  startCamera(toggleCamera);
});

retake.addEventListener("click", () => {
  toggleCamera = false;
  startCamera(toggleCamera);
});
