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
import {
  audioMuteControl,
  videoMuteControl,
  screenShare,
  sendFile } from './controllers/button-control';
import {
  peerJoined,
  peerLeft,
  peerUpdated,
  fileTransfer } from './controllers/peer-control';
import {
  sendMessage,
  addMessage,
  button } from './controllers/chat-control';
import isTalking from './controllers/audio-focus-control';
import { getKey } from '../config';
import socketsCtrl from './controllers/socket-control';
import { chooseRoom } from './controllers/room-control';
import hark from 'hark';
import _ from 'lodash';
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
  Skynet.setDebugMode({ storeLogs: true });

  // Initialize UI controls
  audioMuteControl();
  videoMuteControl();
  screenShare();
  sendFile();

  // Initialize message controls
  addMessage();
  sendMessage();
  button();
  // Initialize peer controllers
  peerJoined();
  peerLeft();
  peerUpdated();
  fileTransfer();

  // Deal with self media
  // TODO: Init may need to be refactored to support different rooms, or at least re-called
  Skynet.on('mediaAccessSuccess', stream => {
    const vid = document.getElementById('myvideo');
    const options = {
      threshold: -45,
    };
    const selfSpeech = hark(stream, options);
    const talkThrottle = _.throttle(isTalking, 3000);
    selfSpeech.on('speaking', () => {
      if (!userData.peerJoining) {
        talkThrottle(userData.id);
      }
    });
    window.attachMediaStream(vid, stream);
  });

 // Handle that oncoming stream, filter it into new vid elements (made by peer functions)
  Skynet.on('incomingStream', (peerId, stream, isSelf) => {
    if (isSelf) {
      userData.id = peerId;
      return;
    }
    const vid = document.getElementById(`${peerId}`);
    window.attachMediaStream(vid, stream);
    userData.peerJoining = false;
  });

  Skynet.on('incomingMessage', (message, peerId, peerInfo, isSelf) => {
    let user = 'You';
    let className = 'you';
    if (!isSelf) {
      user = peerInfo.userData.displayName || 'Tacocat';
      className = 'message';
    }
    addMessage(`${user}: ${message.content}`, className);
  });

  Skynet.init({
    // Localhost testing key only for now
    apiKey: getKey(),
    // Yas
    defaultRoom: window.room,
  }, () => {
    Skynet.joinRoom({
      audio: true,
      video: {
        resolution: Skynet.VIDEO_RESOLUTION.VGA,
        frameRate: 20,
      },
    });
  });
  socketsCtrl();
}

chooseRoom(() => {
  const app = App;
  app();
});
