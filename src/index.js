'use strict';

/**
 * @module src/index
 */

/**
 * Controls the app, imports other functionality
 *
 */
global.jQuery = require('jquery');
global.io = require('socket.io-client');
import 'bootstrap';
import { buttons } from './controllers/button-control';
import {
  sendMessage,
  addMessage,
  slideButton } from './controllers/chat-control';
import { initializeSkylink } from './controllers/skylink-control';
import socketsCtrl from './controllers/socket-control';
import { chooseRoom } from './controllers/room-control';
import createEditor from './controllers/editor-control';
export const Skynet = new window.Skylink();
export const userData = {
  id: '',
  audioMuted: false,
  videoMuted: false,
  screenShared: false,
  peerJoining: false,
};


function App() {
  // On load, initialize new Skylink connection
  initializeSkylink();
  buttons();
  // Initialize UI controls
  // audioMuteControl();
  // videoMuteControl();
  // screenShare();
  // sendFile();

  // Initialize message controls
  addMessage();
  sendMessage();
  slideButton();
  // Initialize peer controllers
  socketsCtrl(userData);
  createEditor();
}

chooseRoom(() => {
  const app = App;
  app();
});
