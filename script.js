// Dapatkan elemen-elemen DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

// Minta akses ke kamera peranti
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    startScanning();
  })
  .catch((error) => {
    console.error('Ralat:', error);
    result.textContent = 'Tidak dapat mengakses kamera.';
    result.style.color = 'red';
  });

// Fungsi untuk memulakan pemindaian kod QR
function startScanning() {
  const context = canvas.getContext('2d');

  function scanFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Tetapkan saiz canvas sama dengan video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Lukis frame video ke atas canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Dapatkan data piksel dari canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Gunakan jsQR untuk memindai kod QR
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        result.textContent = `Hasil: ${qrCode.data}`;
        result.style.color = 'green';
      } else {
        result.textContent = 'Tiada kod QR dikesan.';
        result.style.color = 'red';
      }
    }

    // Panggil semula fungsi untuk memindai setiap frame
    requestAnimationFrame(scanFrame);
  }

  // Mulakan pemindaian
  scanFrame();
}