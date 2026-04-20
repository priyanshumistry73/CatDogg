const URL = "https://teachablemachine.withgoogle.com/models/AhyBtfsT5C/";

let model, labelContainer, maxPredictions;

// Load model
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    console.log("✅ Model Loaded");
}

// Run immediately when page loads
loadModel();

// Upload Image Fix
document.getElementById("upload").addEventListener("change", async function(event) {
    if (!model) {
        alert("Model is still loading...");
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.width = 300;

    img.onload = async () => {
        document.getElementById("image-preview").innerHTML = "";
        document.getElementById("image-preview").appendChild(img);

        await predict(img);
    };
});

// Prediction function
async function predict(image) {
    const prediction = await model.predict(image);

    let resultHTML = "";

    prediction.forEach(p => {
        resultHTML += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
    });

    labelContainer.innerHTML = resultHTML;

    console.log("✅ Prediction Done");
}
