const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const resetButton = document.getElementById('resetButton');
const penSizeInput = document.getElementById('penSize');
const penColorInput = document.getElementById('penColor');
const penSizeValue = document.getElementById('penSizeValue');
const brushTypeSelect = document.getElementById('brushType');

let isDrawing = false;
let drawHistory = [];
let redoHistory = [];
let brushType = 'pen';

// Set canvas size
canvas.width = 500;
canvas.height = 250;

// Set initial drawing properties
ctx.strokeStyle = penColorInput.value;
ctx.lineWidth = penSizeInput.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Function to get the correct mouse position
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
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
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    ctx.closePath();
});

// Undo & Redo
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

// Reset canvas
resetButton.addEventListener('click', resetCanvas);

// Update pen size
penSizeInput.addEventListener('input', updatePenSize);

// Update pen color
penColorInput.addEventListener('input', updatePenColor);

// Update brush type
brushTypeSelect.addEventListener('change', updateBrushType);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    // Save the current canvas state as an image, maintaining transparency.
    const image = canvas.toDataURL('image/png'); // 'image/png' retains transparency
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

function updateBrushType() {
    brushType = brushTypeSelect.value;
    if (brushType === 'highlighter') {
        ctx.globalAlpha = 0.3;  // Make strokes more translucent for highlighter effect
    } else {
        ctx.globalAlpha = 1;
    }
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

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistory = [];
    redoHistory = [];
}
