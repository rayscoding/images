const images = [
  "https://source.unsplash.com/800x400/?nature,water",
  "https://source.unsplash.com/800x400/?nature,forest",
  "https://source.unsplash.com/800x400/?nature,mountain",
  "https://source.unsplash.com/800x400/?nature,river"
];

let currentIndex = 0;
let interval = setInterval(nextImage, 4000);

const mainImage = document.getElementById("mainImage");
const thumbnails = document.querySelectorAll(".thumb");

function showImage(index) {
  currentIndex = index;
  mainImage.style.opacity = 0;
  setTimeout(() => {
    mainImage.src = images[index];
    mainImage.style.opacity = 1;
  }, 300);
  updateThumbnails();
}

function updateThumbnails() {
  thumbnails.forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === currentIndex);
  });
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

document.getElementById("nextBtn").addEventListener("click", () => {
  nextImage();
  resetInterval();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  prevImage();
  resetInterval();
});

thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", (e) => {
    const index = parseInt(e.target.getAttribute("data-index"));
    showImage(index);
    resetInterval();
  });
});

function resetInterval() {
  clearInterval(interval);
  interval = setInterval(nextImage, 4000);
}

showImage(currentIndex);
