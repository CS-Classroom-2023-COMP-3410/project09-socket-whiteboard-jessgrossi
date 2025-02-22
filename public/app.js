const socket = io();
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let drawing = false;
let color = '#000000';
let brushSize = 5;

document.getElementById('colorPicker').onchange = (e) => {
  color = e.target.value;
};
document.getElementById('brushSize').oninput = (e) => {
  brushSize = e.target.value;
};

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
  if (!drawing) return;
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const data = { x, y, color, brushSize };
  socket.emit('draw', data);
  paint(data);
}

function paint({ x, y, color, brushSize }) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

socket.on('draw', paint);
socket.on('boardState', (state) => {
  state.forEach(paint);
});
socket.on('clearBoard', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

function clearBoard() {
  socket.emit('clearBoard');
}