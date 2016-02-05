'use strict';

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import fs from 'fs';
import http from 'http';
import socketIO from 'socket.io';
import store from './routes/auth';
import _ from 'lodash';

const app = express();
const testStore = {};
const port = process.env.PORT || 3000;

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')));
app.enable('trust proxy');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'nyancat is testing this!',
  proxy: true,
  key: 'session.sid',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: store
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'public/app.html')));
app.use('/app/:room', express.static(path.join(__dirname, 'public/app.html')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

const server = http.Server(app);
const io = socketIO.listen(server);

server.listen(port, () => console.log('Express server listening on port ' + server.address().port));

// whiteboard

// object to hold idividual arrays for each room
const history = {};
function audioFocus(data) {
  io.to(data.room).emit('audioFocus', {
    id: data.id,
  });
}
const audioThrottle = _.throttle(audioFocus, 3000);

// event-handler for new incoming connections
io.on('connection', socket => {

  socket.on('room', room => {
    socket.join(room);
    history[room] = history[room] || [];
    // first send the history to the new client
    for (const line in history[room]) {
      io.to(room).emit('draw_line', {
        line: history[room][line].line,
        color: history[room][line].color,
        size: history[room][line].size
      });
    }
  });

  // redraw the lines
  socket.on('redraw', data => {
    // send lines to the client
    for (const line in history[data.room]) {
      socket.emit('draw_line', {
        line: history[data.room][line].line,
        color: history[data.room][line].color,
        size: history[data.room][line].size 
      });
    }
  });

  // handler for message type "draw_line".
  socket.on('draw_line', data => {
    // add received line to history
    history[data.room].push(data);
    // send line to all clients
    io.to(data.room).emit('draw_line', {
      line: data.line,
      color: data.color,
      size: data.size

	// clear screen
	socket.on('clear', data => {
		history[data.room] = [];
		// send clear to all clients
		io.to(data.room).emit('clear', {});
	});

  socket.on('speaking', data => {
    io.to(data.room).emit('audioFocus', {
      id: data.id,
    });
  });

  socket.on('speaking', (data) => audioThrottle(data));
});


export default app;
