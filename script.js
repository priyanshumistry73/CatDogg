const URL = "./model/";
let model, webcam, maxPredictions;

async function loadModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
}

window.onload = async () => {
  await loadModel();
};

// ================== WEBCAM ==================
async function initWebcam() {
  const flip = true;
  webcam = new tmImage.Webcam(224, 224, flip);

  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam-container").innerHTML = "";
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict(webcam.canvas);
  window.requestAnimationFrame(loop);
}

function stopWebcam() {
  if (webcam) webcam.stop();
}

// ================== FILE UPLOAD ==================
document.getElementById("upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  const img = document.getElementById("preview");

  img.src = window.URL.createObjectURL(file);

  img.onload = async () => {
    await predict(img);
  };
});

// ================== PREDICTION ==================
async function predict(image) {
  const prediction = await model.predict(image);

  let resultText = "";

  prediction.forEach(p => {
    resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}% <br>`;
  });

  document.getElementById("result").innerHTML = resultText;
}
