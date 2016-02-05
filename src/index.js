'use strict';

/**
 * @module src/index
 */

/**
 * Controls the app, imports other functionality
 *
 */
import $ from 'jquery';
global.$ = $;
import bootstrap from 'bootstrap';
global.bootstrap = bootstrap;
import { buttons } from './controllers/button-control';
import {
  sendMessage,
  addMessage,
  button } from './controllers/chat-control';
import { initializeSkylink } from './controllers/skylink-control';
import socketsCtrl from './controllers/socket-control';
import { chooseRoom } from './controllers/room-control';
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
  button();
  // Initialize peer controllers
  socketsCtrl();
}

chooseRoom(() => {
  const app = App;
  app();
});
