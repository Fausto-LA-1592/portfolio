const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = Array(256).join("01").split("");
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = Array.from({ length: columns }).fill(1); // Hacemos estas variables let para poder reiniciarlas

// === Control del Botón Toggle ===
const toggleBtn = document.getElementById('toggleEffect');
let isEffectActive = false;
let isCompletingDrops = false;
let matrixInterval = null;

toggleBtn.classList.add('off');
canvas.style.display = 'none';

function initializeMatrix() {
  // Reiniciamos las variables de la matriz
  columns = canvas.width / fontSize;
  drops = Array.from({ length: columns }).fill(1);
  
  // Limpiamos el canvas completamente
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

toggleBtn.addEventListener('click', () => {
  if (isEffectActive) {
    // Al desactivar
    isEffectActive = false;
    isCompletingDrops = true;
    toggleBtn.classList.remove('on');
    toggleBtn.classList.add('off');
  } else {
    // Al activar
    initializeMatrix(); // <-- Reiniciamos la matriz aquí
    
    isEffectActive = true;
    isCompletingDrops = false;
    toggleBtn.classList.remove('off');
    toggleBtn.classList.add('on');
    canvas.style.display = 'block';
    
    // Si ya hay un intervalo, lo limpiamos antes de crear uno nuevo
    if (matrixInterval) {
      clearInterval(matrixInterval);
    }
    matrixInterval = setInterval(drawMatrix, 50);
  }
});

let fadeAlpha = 0; // Variable para controlar la opacidad del fade-out

function drawMatrix() {
  if (isEffectActive) {
    // Modo ACTIVO: efecto normal con transparencia
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fadeAlpha = 0; // Resetear alpha cuando está activo
  } 
  else if (isCompletingDrops) {
    // Modo APAGANDO: aumentar progresivamente la opacidad
    fadeAlpha = Math.min(fadeAlpha + 0.02, 1); // Aumenta 2% cada frame
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } 
  else {
    // Modo APAGADO: limpiar y ocultar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
    clearInterval(matrixInterval);
    matrixInterval = null;
    return;
  }

  // Dibujar letras
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";
  let activeDrops = 0;

  for (let i = 0; i < drops.length; i++) {
    const text = isEffectActive ? letters[Math.floor(Math.random() * letters.length)] : " ";
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize <= canvas.height || isCompletingDrops) {
      drops[i]++;
      activeDrops++;
    }
    
    if (isEffectActive && drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
  }

  // Finalizar cuando todas las gotas hayan caído y el fade esté completo
  if (isCompletingDrops && activeDrops === 0 && fadeAlpha >= 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
    isCompletingDrops = false;
    clearInterval(matrixInterval);
    matrixInterval = null;
  }
}

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  // Al redimensionar, también reiniciamos la matriz si está activa
  if (isEffectActive) {
    initializeMatrix();
  }
});