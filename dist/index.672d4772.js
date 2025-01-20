const canvas = document.getElementById('panal');
const ctx = canvas.getContext('2d');
const mensajeInicio = document.getElementById('mensaje-inicio');
const mensajeFinal = document.getElementById('mensaje-final');
const img = new Image();
img.src = 'img/panal.png'; // Ruta corregida
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let numeroJugador;
let startTime;
img.onload = ()=>{
    console.log("Imagen cargada:", img.src);
    console.log("Ancho de la imagen:", img.width);
    console.log("Alto de la imagen:", img.height);
    if (img.width === 0 || img.height === 0) {
        console.error("La imagen no se ha cargado correctamente. Revisa la ruta y el archivo.");
        return; // Detiene la ejecución si la imagen no se carga
    }
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    numeroJugador = Math.floor(Math.random() * 20) + 1;
    mensajeInicio.textContent = `Eres el jugador n\xfamero ${numeroJugador}`;
    mensajeInicio.style.display = 'block';
    setTimeout(()=>{
        mensajeInicio.textContent = "El juego comienza ahora";
        setTimeout(()=>{
            mensajeInicio.style.display = 'none';
            startTime = Date.now();
        }, 2000);
    }, 3000);
};
img.onerror = ()=>{
    console.error("Error al cargar la imagen:", img.src);
};
function startDrawing(e) {
    isDrawing = true;
    if (e.touches) [lastX, lastY] = [
        e.touches[0].clientX - canvas.offsetLeft,
        e.touches[0].clientY - canvas.offsetTop
    ];
    else [lastX, lastY] = [
        e.offsetX,
        e.offsetY
    ];
}
function endDrawing(e) {
    isDrawing = false;
    if (startTime) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        if (elapsedTime > 5000) {
            mensajeFinal.textContent = `Jugador n\xfamero ${numeroJugador}, ser\xe1s eliminado del cumplea\xf1os, vuelve a intentarlo`;
            mensajeFinal.style.display = 'block';
            setTimeout(()=>{
                mensajeFinal.style.display = 'none';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                startTime = Date.now();
            }, 5000);
        }
    }
}
function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    let currentX, currentY;
    if (e.touches) {
        currentX = e.touches[0].clientX - canvas.offsetLeft;
        currentY = e.touches[0].clientY - canvas.offsetTop;
    } else {
        currentX = e.offsetX;
        currentY = e.offsetY;
    }
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.stroke();
    [lastX, lastY] = [
        currentX,
        currentY
    ];
}
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('touchend', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

//# sourceMappingURL=index.672d4772.js.map
