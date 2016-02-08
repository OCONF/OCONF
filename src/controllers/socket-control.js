'use strict';
import $ from 'jquery';
import jqUi from 'jquery-ui';
import {wbInit, clearScreen, drawLines, listenClearScreen, resizing} from './whiteboard-control';
import { sendData, setData } from './editor-control';
import io from 'socket.io-client';

export default function (userId) {
	const canvas  = document.getElementById('whiteboard');
	const mouse = {
			click: false,
			move: false,
			pos: {x:0, y:0},
			pos_prev: false
		};
	//initialize white board
	const wb = wbInit();
	// create context
	const context = canvas.getContext('2d');

	// initialize socket
	const socket  = io.connect();
	// set room
	socket.on('connect', () => {
		socket.emit('room', window.room);
	});


	$('#white-board').on('click', function () {
		// set canvas to fit in the modal
		canvas.width = wb.width - 80;
		canvas.height = wb.height - 86;

		// register mouse event handlers
		canvas.onmousedown = function(e) { mouse.click = true; };
		canvas.onmouseup = function(e) { mouse.click = false; };
		canvas.onmousemove = function(e) {
			// normalize mouse position to range 0.0 - 1.0
			mouse.pos.x = e.offsetX / wb.width;
			mouse.pos.y = e.offsetY / wb.height;
			mouse.move = true;
		};

		// main loop for drawing, running every 25ms
		function mainLoop() {
			// check if the user is drawing
			if (mouse.click && mouse.move && mouse.pos_prev) {
				 // send line to to the server
				 socket.emit('draw_line', {
					line: [ mouse.pos, mouse.pos_prev ],
					color: wb.color,
					size: wb.size,
					room: window.room
				 });
				 mouse.move = false;
			}
			mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
			setTimeout(mainLoop, 25);
		};



		// draw line received from server
		drawLines(socket, context, wb);

		// clear screen on button click
		clearScreen(socket, window.room);

		// listen clear screen call
		listenClearScreen(socket, context, canvas);

		// resize modal
		resizing(socket, canvas, wb);

		mainLoop();
	});

		// Text editor controls
		$('#text-editor').on('keyup', () => {
			sendData(socket, userId);
		});

		socket.on('setData', data => setData(data, userId));
};
