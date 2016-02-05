'use strict';
import jq from 'jquery';
import jqUi from 'jquery-ui';

export function wbInit () {
	const wb = {};

	wb.color = "#000000";
	wb.size = 1;
	wb.width = jq('#whiteboardModal .modal-content').innerWidth() < 898 ? 898 : jq('#whiteboardModal .modal-content').innerWidth();
	wb.height  = jq('#whiteboardModal .modal-body .container-fluid').innerHeight() < 500 ? 500 : jq('#whiteboardModal .modal-body').innerHeight();

	jq('#whiteboardModal .modal-content').resizable({
		minHeight: 430,
		minWidth: 250
	});

	jq('#whiteboardModal').draggable({ cursor: "move", handle: '.modal-header'});

	jq('#pencil').on('click', function () {
	 	wb.color = jq(this).data().color;
	 	wb.size = jq(this).data().size;
	});

	jq('.color').on('click', function () {
		wb.color = jq(this).data().color;
	});

	jq('.size').on('click', function () {
		wb.size = jq(this).data().size;
	});

	return wb;
};

export function clearScreen(socket, room) {
	jq('#clear').on('click', () => {
		socket.emit('clear', {room: room});
	});
};

export function listenClearScreen(socket, context, canvas) {
	socket.on('clear', () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
	});
};

export function resizing(socket, canvas, wb) {
	jq('#whiteboardModal .modal-content').on('resize', function () {
		wb.width = jq('#whiteboardModal .modal-content').innerWidth();
		wb.height = jq('#whiteboardModal .modal-content').innerHeight();
		canvas.width = wb.width - 80;
		canvas.height = wb.height - 86;
		socket.emit('redraw', {'room': window.room});
	});
};

export function drawLines(socket, context, wb) {
	socket.on('draw_line', data => {
		var line = data.line;
		context.beginPath();
		context.moveTo(line[0].x * wb.width, line[0].y * wb.height);
		context.lineTo(line[1].x * wb.width, line[1].y * wb.height);
		context.strokeStyle = data.color;
		context.lineWidth = data.size;
		context.stroke();
	});
};