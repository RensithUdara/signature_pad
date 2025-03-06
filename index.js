const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const penSizeInput = document.getElementById('penSize');
const penColorInput = document.getElementById('penColor');
const penSizeValue = document.getElementById('penSizeValue');

let isDrawing = false;
let drawHistory = [];
let redoHistory = [];

// Set canvas size
canvas.width = 500;
canvas.height = 200;

// Set initial drawing properties
ctx.strokeStyle = penColorInput.value;
ctx.lineWidth = penSizeInput.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Function to get the correct mouse position
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;  // Scale for canvas width
    const scaleY = canvas.height / rect.height; // Scale for canvas height
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// Save the state before drawing to enable undo
function saveState() {
    drawHistory.push(canvas.toDataURL());
    if (drawHistory.length > 5) drawHistory.shift(); // Limit the history stack
    redoHistory = []; // Clear redo stack when a new action is performed
}

// Event listeners for drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
    saveState();
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    ctx.closePath();
});

// Clear canvas
clearButton.addEventListener('click', clearCanvas);

// Save signature
saveButton.addEventListener('click', saveSignature);

// Undo and Redo functionality
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

// Update pen size
penSizeInput.addEventListener('input', updatePenSize);

// Update pen color
penColorInput.addEventListener('input', updatePenColor);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

function saveSignature() {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'signature.png';
    link.click();
}

function updatePenSize() {
    ctx.lineWidth = penSizeInput.value;
    penSizeValue.textContent = penSizeInput.value;
}

function updatePenColor() {
    ctx.strokeStyle = penColorInput.value;
}

function undo() {
    if (drawHistory.length > 0) {
        redoHistory.push(drawHistory.pop());
        const lastState = drawHistory[drawHistory.length - 1];
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function redo() {
    if (redoHistory.length > 0) {
        const state = redoHistory.pop();
        const img = new Image();
        img.src = state;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}
