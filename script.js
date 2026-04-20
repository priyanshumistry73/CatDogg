const URL = https://teachablemachine.withgoogle.com/models/AhyBtfsT5C/

let model;

async function init() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
}

init();

document.getElementById("upload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        const prediction = await model.predict(img);
        let result = "";

        prediction.forEach(p => {
            result += `${p.className}: ${p.probability.toFixed(2)}\n`;
        });

        document.getElementById("result").innerText = result;
    };
});
