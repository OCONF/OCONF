'use strict';

/**
 * @module src/index
 */

/**
 * Controls the app, imports other functionality
 *
 */
import $ from 'jquery';
import { audioMuteControl, videoMuteControl, screenShare } from './controllers/button-control';
import { peerJoined, peerLeft, peerUpdated,  } from './controllers/peer-control';

export default class App {
  constructor() {
    // On load, initialize new Skylink connection
    const Skynet = new window.Skylink();

    // Initialize UI controls
    audioMuteControl();
    videoMuteControl();
    screenShare();

    // Initialize peer controllers
    peerJoined();
    peerLeft();
    peerUpdated();

    // Deal with self media
    // TODO: Init may need to be refactored to support different rooms, or at least re-called
    Skynet.on('mediaAccessSuccess', stream => {
      const vid = $('#myvideo');
      window.attachMediaStream(vid, stream);
    });

   // Handle that oncoming stream, filter it into new vid elements (made by peer functions)
    Skynet.on('incomingStream', (peerId, stream, isSelf) => {
      if (isSelf) return;
      let vid = $(`#${peerId}`);
      attachMediaStream(vid, stream);
    });

    Skynet.init({
      // Localhost testing key only for now
      apiKey: '44759962-822a-42db-9de2-39a31bf25675',
      // Yas
      defaultRoom: 'nyannyannyannyannyannyan',
    }, () => {
      Skynet.joinRoom({
        audio: true,
        video: true,
      });
    });
  }
}

// Run that app
const app = new App();
