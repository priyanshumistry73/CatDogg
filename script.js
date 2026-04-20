const URL = "https://teachablemachine.withgoogle.com/models/AhyBtfsT5C/";

let model, webcam, labelContainer, maxPredictions;

// Load model once
async function loadModel() {
    if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";

        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    }
}

// Webcam setup
async function init() {
    await loadModel();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
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

// Upload image handling
document.getElementById("upload").addEventListener("change", async function(event) {
    await loadModel();

    const file = event.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        document.getElementById("image-preview").innerHTML = "";
        document.getElementById("image-preview").appendChild(img);

        await predict(img);
    };
});

// Prediction function
async function predict(image) {
    const prediction = await model.predict(image);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " +
            (prediction[i].probability * 100).toFixed(2) + "%";

        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
