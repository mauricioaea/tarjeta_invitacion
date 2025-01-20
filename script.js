const canvas = document.getElementById('panal');
const ctx = canvas.getContext('2d');
const mensajeInicio = document.getElementById('mensaje-inicio');
const mensajeJuego = document.getElementById('mensaje-juego');
const mensajeFeedback = document.getElementById('mensaje-feedback');
const siguienteReto = document.getElementById('siguiente-reto');
const botonReiniciar = document.getElementById('boton-reiniciar');
const barraProgreso = document.getElementById('barra-progreso');
const img = new Image();
img.src = 'img/panal.png';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let numeroJugador;
let tiempoRestante = 20;
let temporizadorInterval;
const temporizadorDisplay = document.getElementById('temporizador');
let juegoEnCurso = false;
let progresoRecorte = 0;

function iniciarJuego() {
    juegoEnCurso = true;
    tiempoRestante = 20;
    progresoRecorte = 0;
    actualizarTemporizador();
    mensajeFeedback.style.display = 'none';
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, 0);
    iniciarTemporizador();
    siguienteReto.style.display = "none";
    botonReiniciar.style.display = "none";
}

function iniciarTemporizador() {

    temporizadorInterval = setInterval(() => {
    
    if (!juegoEnCurso) return;
    
    tiempoRestante--;
    
    actualizarTemporizador();
    
    if (tiempoRestante <= 0) {
    
    clearInterval(temporizadorInterval);
    
    finalizarJuego(`Jugador número ${numeroJugador}, ¡Tiempo agotado! Vuelve a intentarlo.`, "error");
    
    }
    
    }, 1000);
    
    }function actualizarTemporizador() {
    
    tiempoRestante = Math.max(0, tiempoRestante);
    
    let minutos = Math.floor(tiempoRestante / 60);
    
    let segundos = tiempoRestante % 60;
    
    temporizadorDisplay.textContent = `${minutos < 10 ? "0" : ""}${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
    
    }function mostrarMensajesIniciales() {
    
    numeroJugador = Math.floor(Math.random() * 20) + 1;
    
    mensajeInicio.textContent = `Eres el jugador número ${numeroJugador}`;
    
    mensajeInicio.style.display = 'block';
    
    
    
    setTimeout(() => {
    
    mensajeInicio.style.display = 'none';
    
    mensajeJuego.textContent = "¡Es hora de Comienzar el juego!";
    
    mensajeJuego.style.display = 'block';
    
    setTimeout(() => {
    
    mensajeJuego.style.display = 'none';
    
    iniciarJuego();
    
    }, 3000);
    
    }, 3000);
    
    }function mostrarMensaje(texto, tipo) {
    
    mensajeFeedback.textContent = texto;
    
    mensajeFeedback.className = "";
    
    mensajeFeedback.classList.add('mensaje', 'mostrar', tipo || '');
    
    mensajeFeedback.style.display = 'block';
    
    setTimeout(() => {
    
    mensajeFeedback.classList.remove('mostrar');
    
    mensajeFeedback.style.display = 'none';
    
    }, 10000);
    
    }function getTouchPos(canvasDom, touchEvent) {
    
    var rect = canvasDom.getBoundingClientRect();
    
    return {
    
    x: touchEvent.touches[0].clientX - rect.left,
    
    y: touchEvent.touches[0].clientY - rect.top
    
    };
    
    }function startDrawing(e) {
    
    if (!juegoEnCurso) return;
    
    isDrawing = true;
    
    lastX = e.offsetX || (e.touches ? getTouchPos(canvas, e).x : 0);
    
    lastY = e.offsetY || (e.touches ? getTouchPos(canvas, e).y : 0);
    
    }function draw(e) {
    
    if (!isDrawing || !juegoEnCurso) return;
    
    
    
    ctx.beginPath();
    
    ctx.moveTo(lastX, lastY);
    
    const currentX = e.offsetX || (e.touches ? getTouchPos(canvas, e).x : 0);
    
    const currentY = e.offsetY || (e.touches ? getTouchPos(canvas, e).y : 0);
    
    ctx.lineTo(currentX, currentY);
    
    
    
    if (progresoRecorte < 25) {
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    
    } else if (progresoRecorte < 40) {
    
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)';
    
    } else if (progresoRecorte < 50) {
    
    ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)';
    
    } else {
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    
    }
    
    
    
    ctx.lineWidth = 40;
    
    ctx.lineCap = 'round';
    
    ctx.globalCompositeOperation = 'destination-out';
    
    ctx.stroke();
    
    
    
    calcularProgreso();
    
    [lastX, lastY] = [currentX, currentY];
    
    }function finalizarJuego(mensaje, tipo) {
    
    clearInterval(temporizadorInterval);
    
    mostrarMensaje(mensaje, tipo);
    
    juegoEnCurso = false;
    
    siguienteReto.style.display = "block";
    
    botonReiniciar.style.display = "block";
    
    }function endDrawing() {
    
    isDrawing = false;
    
    }function calcularProgreso() {
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const data = imageData.data;
    
    const totalPixels = data.length / 4;
    
    let transparentPixels = 0;
    
    const transparenciaUmbral = 50;
    
    
    
    for (let i = 0; i < data.length; i += 4) {
    
    if (data[i + 3] <= transparenciaUmbral) {
    
    transparentPixels++;
    
    }
    
    }
    
    
    
    progresoRecorte = (transparentPixels / totalPixels) * 100;
    
    barraProgreso.style.width = progresoRecorte + '%';
    
    barraProgreso.textContent = Math.round(progresoRecorte) + '%';
    
    console.log("Progreso de recorte:", progresoRecorte);
    
    
    
    if (progresoRecorte >= 11 && juegoEnCurso) {
    
    finalizarJuego(`Jugador número ${numeroJugador} Felicitaciones, ha sido invitado al Cumpleaños # 8 de MATIAS ERAZO`, "success");
    
    }
    
    }
    
    window.addEventListener('DOMContentLoaded', (event) => {
        img.onload = () => {
            // Ajuste responsivo del canvas
            canvas.width = Math.min(img.width, window.innerWidth * 0.9); // Ancho máximo del 90% de la ventana
            canvas.height = canvas.width * (img.height / img.width); // Mantiene la proporción
            ctx.drawImage(img, 0, 0);
            mostrarMensajesIniciales();
        };
    
    
    
    img.onerror = () => {
    
    console.error("Error al cargar la imagen:", img.src);
    
    };
    
    });canvas.addEventListener('mousedown', startDrawing);
    
    canvas.addEventListener('touchstart', startDrawing);
    
    canvas.addEventListener('mousemove', draw);
    
    canvas.addEventListener('touchmove', draw);canvas.addEventListener('mouseup', endDrawing);
    
    canvas.addEventListener('touchend', endDrawing);
    
    canvas.addEventListener('mouseout', endDrawing);
    
    
    
    siguienteReto.addEventListener("click", () => {
    
    mostrarMensaje("Tu fecha de cumpleaños se acerca, descarga tu tarjeta.", "success");
    
    });
    
    
    
    botonReiniciar.addEventListener("click", () => {
    
    botonReiniciar.style.display = "none";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0);
    
    iniciarJuego();
    
    });