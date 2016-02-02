'use strict';
import jq from 'jquery';
import jqUi from 'jquery-ui';
export default function () {
	let width = jq('#whiteboardModal .modal-content').innerWidth() < 898 ? 898 : jq('#whiteboardModal .modal-content').innerWidth();
	let height  = jq('#whiteboardModal .modal-body .container-fluid').innerHeight() < 500 ? 500 : jq('#whiteboardModal .modal-body').innerHeight();
	const canvas  = document.getElementById('whiteboard');

	jq('#whiteboardModal .modal-content').resizable({
		minHeight: 430,
		minWidth: 250
	});

	jq('#whiteboardModal').draggable({ cursor: "move", handle: '.modal-header'});
	
	jq('#whiteboardModal').on('show.bs.modal', function () {
		jq(this).find('.modal-body').css({
			'max-height': '100%',
		});
	});



	jq('#white-board').on('click', function () {
		const mouse = { 
			click: false,
			move: false,
			pos: {x:0, y:0},
			pos_prev: false
		};
		// create context
		const context = canvas.getContext('2d');
		const socket  = io.connect();

		//set room
		socket.on('connect', () => {
			// Connected, let's sign-up for to receive messages for this room
			socket.emit('room', window.room);
		});

		// set canvas to full browser width/height
		canvas.width = width - 80;//jq('.modal-dialog').innerWidth();//$( window ).width();//width;
		canvas.height = height - 86;//jq('.modal-body').innerHeight();//$( window ).height();//height;

		// register mouse event handlers
		canvas.onmousedown = function(e) { mouse.click = true; };
		canvas.onmouseup = function(e) { mouse.click = false; };

		canvas.onmousemove = function(e) {
			// let rect = document.getElementById("whiteboard").getBoundingClientRect();
			// // normalize mouse position to range 0.0 - 1.0
			// mouse.pos.x = e.clientX - rect.left;//e.offsetX / canvas.width;//e.clientX / jq('.modal-dialog').innerWidth();
			// console.log('x = ', mouse.pos.x);
			// mouse.pos.y = e.clientY - rect.top;//e.offsetY/ canvas.height;//e.clientY / jq('.modal-body').innerHeight();
			// console.log('y = ', mouse.pos.y);
			// mouse.move = true;
			// normalize mouse position to range 0.0 - 1.0
			mouse.pos.x = e.offsetX / width;
			mouse.pos.y = e.offsetY / height;
			mouse.move = true;
		};

		let color = '000';
		let size = 1;

		// draw line received from server
		socket.on('draw_line', data => {
			var line = data.line;
		context.beginPath();
		context.moveTo(line[0].x * width, line[0].y * height);
		context.lineTo(line[1].x * width, line[1].y * height);
		context.strokeStyle = data.color;
		context.lineWidth = data.size;
		context.stroke();
			// const line = data.line;
			// context.beginPath();
			// context.moveTo(line[0].x, line[0].y);
			// context.lineTo(line[1].x, line[1].y);
			// context.strokeStyle = data.color;
			// context.lineWidth = data.size;
			// context.stroke();
		});

		socket.on('clear', data => {
			context.clearRect(0, 0, canvas.width, canvas.height);
		});

		socket.on('changeColor', data => {
			color = data.color;
		});

		socket.on('changeSize', data => {
			size = data.size;
		});

		// main loop, running every 25ms
		function mainLoop() {
			// check if the user is drawing
			if (mouse.click && mouse.move && mouse.pos_prev) {
				 // send line to to the server
				 socket.emit('draw_line', { 
					line: [ mouse.pos, mouse.pos_prev ],
					color: color,
					size: size,
					room: window.room
				 });
				 mouse.move = false;
			}
			mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
			setTimeout(mainLoop, 25);
		}
		mainLoop();

		$('#clear').on('click', () => {
			socket.emit('clear', {room: window.room});
		});
		$('#pencil').on('click', () => {
			color = '#000000';
			//socket.emit('changeColor', { color: '#000000'});
		});
		$('#eraser').on('click', () => {
			color = '#FFFFFF';
			//socket.emit('changeColor', { color: '#FFFFFF'});
		});
		$('#black').on('click', () => {
			color = '#000000';
			//socket.emit('changeColor', { color: '#000000'});
		});
		$('#yellow').on('click', () => {
			color = '#FFFF00';
			//socket.emit('changeColor', { color: '#FFFF00'});
		});
		$('#red').on('click', () => {
			color = '#FF0000';
			//socket.emit('changeColor', { color: '#FF0000'});
		});
		$('#green').on('click', () => {
			color = '#008000';
			//socket.emit('changeColor', { color: '#008000'});
		});
		$('#blue').on('click', () => {
			color = '#0000FF';
			//socket.emit('changeColor', { color: '#0000FF'});
		});
		$('#small').on('click', () => {
			size = 1;
			//socket.emit('changeSize', {size: 1});
		});
		$('#medium').on('click', () => {
			size = 5;
			//socket.emit('changeSize', {size: 5});
		});
		$('#large').on('click', () => {
			size = 10;
			//socket.emit('changeSize', {size: 10});
		});

		jq('#whiteboardModal .modal-content').on('resize', function () {
			width = jq('#whiteboardModal .modal-content').innerWidth();
			height = jq('#whiteboardModal .modal-content').innerHeight();
			canvas.width = width - 80;
			canvas.height = height - 86;
			socket.emit('redraw', {'room': window.room});
		});
	});
};
