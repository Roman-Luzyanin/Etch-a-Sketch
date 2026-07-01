const container = document.querySelector('.container');
const paintingModeBtn = document.querySelector('.paintingModeBtn');
const brush = document.querySelector('.brush');
const colorPickerWrapper = document.querySelector('.colorPickerWrapper');

const gridSizeSlider = document.querySelector('.gridSizeSlider');
const gridSizeValue = document.querySelector('.gridSizeValue');
const colorPicker = document.querySelector('.colorPicker');
const eraser = document.querySelector('.eraser');

const paintSizeSlider = document.querySelector('.paintSizeSlider');
const brushSizeValue = document.querySelector('.brushSizeValue');
const eraseSizeSlider = document.querySelector('.eraseSizeSlider');
const eraserSizeValue = document.querySelector('.eraserSizeValue');

let isDrawing = false;
let isErasing = false;
const brushSize = ['small', 'middle', 'large'];

const getBoxSize = () => 500 / gridSizeSlider.value;
const getBrushValue = () => isErasing ? eraserSizeValue : brushSizeValue;
const getSliderType = () => isErasing ? eraseSizeSlider : paintSizeSlider;

window.addEventListener('mousedown', (e) => {
		if (e.button === 0) {
			isDrawing = true;
			paintArea(e.clientX, e.clientY);
		}
});
	
window.addEventListener('mouseup', () => isDrawing = false);

window.addEventListener('mousemove', (e) => {
	if (!e.target.classList?.contains('box')) return brush.style.display = 'none';
	
	brush.style.display = 'block';
	brush.style.left = e.clientX + 'px';
	brush.style.top = e.clientY + 'px';
	if (isDrawing) paintArea(e.clientX, e.clientY);
});

gridSizeSlider.addEventListener('input', createGrid);

[paintSizeSlider, eraseSizeSlider].forEach(slider => {
	slider.addEventListener('input', () => {
		const idx = updateBrush();
		getBrushValue().textContent = brushSize[idx - 1];
	})
});

paintingModeBtn.addEventListener('click', () => {
	isErasing = !isErasing;
	updateBrush();
	
	eraser.style.display = isErasing ? 'block' : 'none';
	colorPickerWrapper.style.display = isErasing ? 'none' : 'block';
	paintSizeSlider.disabled = isErasing;
	eraseSizeSlider.disabled = !isErasing;
	paintingModeBtn.textContent = isErasing ? 'Erasing mode' : 'Painting mode';
	paintingModeBtn.className = `paintingModeBtn ${isErasing ? 'cleanUp' : 'paint'}`;
});

eraser.addEventListener('click', () => createGrid(gridSizeSlider.value));

function paintArea(x,y) {
	const idx = updateBrush();
	const shift = isErasing ? eraseSizeSlider.value / (idx === 2 ? 4 : 3):
														paintSizeSlider.value / (idx === 2 ? 4 : 3);
	 
	let points = [
		{x, y},
		{x: x - shift, y: y + shift},
		{x: x + shift, y: y + shift},
		{x: x + shift, y: y - shift},
		{x: x - shift, y: y - shift},
		{x, y: y + shift},
		{x, y: y - shift},
		{x: x - shift, y},
		{x: x + shift, y}
	];
	
	idx === 1 ? points = points.slice(0,1) :
	idx === 2 ? points = points.slice(1,5) : '';

	points.forEach(point => {
		const elements = document.elementsFromPoint(point.x,point.y);
		for (const el of elements) {
			if (el.classList.contains('box')) {
				isErasing ? el.style.backgroundColor = 'white' :
					 el.style.backgroundColor = colorPicker.value;
			}
		}
	});
}

function updateBrush() {
		brush.className = `brush ${isErasing ? 'erase' : ''}`;
		brush.style.backgroundColor = `${isErasing ? 'white' : colorPicker.value}`;
		brush.style.width = getSliderType().value + 'px';
		brush.style.height = getSliderType().value + 'px';
		
		return isErasing ? Math.round(eraseSizeSlider.value / getBoxSize()):
											 Math.round(paintSizeSlider.value / getBoxSize());
}

function updateSlider(boxSize) {
	paintSizeSlider.min = boxSize;
	paintSizeSlider.step = boxSize;
	paintSizeSlider.value = boxSize;
	paintSizeSlider.max = boxSize * 3 + 0.1;
	
	eraseSizeSlider.min = boxSize;
	eraseSizeSlider.step = boxSize;
	eraseSizeSlider.value = boxSize;
	eraseSizeSlider.max = boxSize * 3 + 0.1;
}

function createGrid() {
	const boxSize = getBoxSize();
	container.innerHTML = '';
	updateSlider(boxSize);
	updateBrush();
	gridSizeValue.textContent = `${gridSizeSlider.value}x${gridSizeSlider.value}`;
	brushSizeValue.textContent = 'small';
	eraserSizeValue.textContent = 'small';
	eraseSizeSlider.disabled = true;
	if (isErasing) paintingModeBtn.click();
	
	for (let i = 0; i < gridSizeSlider.value ** 2; i++) {
		const box = document.createElement('div');
		box.classList.add('box');
		box.style.width = `${boxSize}px`;
		box.style.height = `${boxSize}px`;
		container.appendChild(box);
	}
}

createGrid();


