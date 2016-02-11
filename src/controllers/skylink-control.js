import { Skynet } from '../index';
import $ from 'jquery';
import {
  addMessage,
} from './chat-control';
import { userData } from '../index';
import { selfStream, peerStream } from '../helpers/streams';
import { peerLeft,
  peerJoined,
  peerUpdated } from '../helpers/peers';
import { fileTransfer } from '../helpers/fileShare';
import { getKey } from '../../config';


export function initializeSkylink() {

  Skynet.setDebugMode({
    storeLogs: true
  });

  Skynet.on('mediaAccessSuccess', stream => selfStream(stream, userData));

  // Handle that oncoming stream, filter it into new vid elements (made by peer functions)
  Skynet.on('incomingStream', (peerId, stream, isSelf) => peerStream(peerId, stream, isSelf, userData));

  Skynet.on('incomingMessage', (message, peerId, peerInfo, isSelf) => {
    let user = 'You';
    let className = 'you';
    if (!isSelf) {
      user = peerInfo.userData.displayName || 'Tacocat';
      className = 'message';
    }
    addMessage(user, message.content.message, message.content.type, className);
  });

  // Peer Control
  Skynet.on('peerLeft', (peerId, peerInfo, isSelf) =>
    peerLeft(peerId, peerInfo, isSelf, userData));
  Skynet.on('peerJoined', (peerId, peerInfo, isSelf) =>
   peerJoined(peerId, peerInfo, isSelf, userData));
  Skynet.on('peerUpdated', (peerId, peerInfo, isSelf) =>
   peerUpdated(peerId, peerInfo, isSelf, userData));

  Skynet.on('dataTransferState', fileTransfer);

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
    }, () => {
      // Mute self on joining room
      $('#audio-mute').trigger('click');
    });
  });
}
