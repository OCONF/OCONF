import hark from 'hark';
import $ from 'jquery';
import _ from 'lodash';
import isTalking from '../controllers/audio-focus-control';
const attachStream = window.attachMediaStream;

export function selfStream(stream, userData) {
  const vid = $('#myvideo');
  vid.attr('data-display-name', window.user);
  const options = { threshold: -45 };
  const selfSpeech = hark(stream, options);
  const talkThrottle = _.throttle(isTalking, 3000);
  selfSpeech.on('speaking', () => {
      talkThrottle(userData.id);
  });
  attachStream(vid[0], stream);
}

export function peerStream(peerId, stream, isSelf, userData) {
  console.log(userData);
  if (isSelf) {
    userData.id = peerId;
    return;
  }
  const vid = $(`#${peerId}`)[0];
  attachStream(vid, stream);
  userData.peerJoining = false;
}
