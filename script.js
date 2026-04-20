const URL = "https://teachablemachine.withgoogle.com/models/AhyBtfsT5C/";

let model;

// Load model
window.onload = async () => {
    try {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        document.getElementById("result").innerText = "✅ Model Loaded! Upload an image.";
    } catch (err) {
        console.error(err);
        document.getElementById("result").innerText = "❌ Model failed to load";
    }
};

// Upload image
document.getElementById("upload").addEventListener("change", async (event) => {
    if (!model) {
        alert("Model still loading...");
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        document.getElementById("image-preview").innerHTML = "";
        document.getElementById("image-preview").appendChild(img);

        const prediction = await model.predict(img);

        let result = "";
        prediction.forEach(p => {
            result += `${p.className}: ${(p.probability * 100).toFixed(2)}%\n`;
        });

        document.getElementById("result").innerText = result;
    };
});
