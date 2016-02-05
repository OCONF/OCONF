import { Skynet } from '../index';
import {
  sendMessage,
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

  Skynet.on('mediaAccessSuccess', selfStream);

  // Handle that oncoming stream, filter it into new vid elements (made by peer functions)
  Skynet.on('incomingStream', peerStream);

  Skynet.on('incomingMessage', (message, peerId, peerInfo, isSelf) => {
    let user = 'You';
    let className = 'you';
    if (!isSelf) {
      user = peerInfo.userData.displayName || 'Tacocat';
      className = 'message';
    }
    addMessage(`${user}: ${message.content}`, className);
  });

  // Peer Control
  Skynet.on('peerLeft', peerLeft);
  Skynet.on('peerJoined', peerJoined);
  Skynet.on('peerUpdated', peerUpdated);

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
    });
  });
}
