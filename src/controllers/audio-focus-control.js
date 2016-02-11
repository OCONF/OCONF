import $ from 'jquery';
import { userData } from '../index';
import io from 'socket.io-client';
const socket = io.connect();
//set room
socket.on('connect', () => {
  // Connected, let's sign-up for to receive messages for this room
  socket.emit('room', window.room);
});
socket.on('audioFocus', (data) => {
  let myVideo = $(`#myvideo`);
  let peerVideoGroup = $(`#video${data.id}`).children();
  let peerVideo = $(`#${data.id}`);
  // if myself, move me up
  if (data.id === userData.id) {
    if (myVideo.parent()[0].id !== 'speaker') {
      removeLastFocus();
      $('#speaker').append(myVideo);
      myVideo.removeClass('peervideo');
      myVideo[0].play();
    }
  } else if (peerVideo[0]) {
    if (peerVideo.parent()[0].id !== 'speaker') {
      // otherwise move peer up
      removeLastFocus();
      $('#speaker').append(peerVideoGroup);
      peerVideo.removeClass('peervideo');
      peerVideo[0].play();
    }
  }
});
export default function isTalking() {
  if (userData.audioMuted) return;
  socket.emit('speaking', {
    id: userData.id,
    room: window.room,
  });
}

function removeLastFocus() {
  let lastSpeaker = $('#speaker').children();
  let lastSpeakerVideo = $('#speaker video');
  if (lastSpeaker.length) {
    let id = lastSpeakerVideo[0].id;
    let place = id !== 'myvideo' ? `video${id}` : 'self';
    $(`#${place}`).append(lastSpeaker);
    lastSpeakerVideo.addClass('peervideo');
    lastSpeakerVideo[0].play();
  }
}
