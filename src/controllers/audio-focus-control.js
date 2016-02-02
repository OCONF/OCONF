import jq from 'jquery';
import { userData } from '../index';

const socket  = io.connect();
//set room
socket.on('connect', () => {
  // Connected, let's sign-up for to receive messages for this room
  socket.emit('room', window.room);
});
socket.on('audioFocus', (data) => {
  let myVideo = jq(`#myvideo`);
  // if myself, move me up
  if (data.id === userData.id) {
    if (myVideo.parent()[0].id !== 'speaker') {
      removeLastFocus();
      jq('#speaker').append(myVideo);
      myVideo.removeClass('peervideo');
      myVideo[0].play();
    }
  } else {
    // otherwise move peer up
    removeLastFocus();
    let peerVideo = jq(`#${data.id}`);
    jq('#speaker').append(peerVideo);
    peerVideo.removeClass('peervideo');
    peerVideo[0].play();
  }
});
export default function isTalking(userId) {
  if (userData.audioMuted) return;
  socket.emit('speaking', {
    id: userId,
    room: window.room,
  });
}

function removeLastFocus() {
  let lastSpeaker = jq('#speaker').children();
  if (lastSpeaker.length) {
    let id = jq('#speaker').children()[0].id;
    let place = id !== 'myvideo' ? `video${id}` : 'video-list';
    jq(`#${place}`).append(lastSpeaker);
    lastSpeaker.addClass('peervideo');
    lastSpeaker[0].play();
  }
}