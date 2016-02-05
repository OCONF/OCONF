import hark from 'hark';
import $ from 'jquery';
import _ from 'lodash';
import { userData } from '../index';
import isTalking from '../controllers/audio-focus-control';
const attachStream = window.attachMediaStream;

export function selfStream(stream) {
  const vid = $('#myvideo')[0];
  const options = { threshold: -45 };
  const selfSpeech = hark(stream, options);
  const talkThrottle = _.throttle(isTalking, 3000);
  selfSpeech.on('speaking', () => {
    if (!userData.peerJoining) {
      talkThrottle(userData.id);
    }
  });
  attachStream(vid, stream);
}

export function peerStream(peerId, stream, isSelf) {
  // Grabbing our user id if the incoming stream is self but not
  // doing anything with the stream because we have it locally
  if (isSelf) {
    userData.id = peerId;
    return;
  }
  const vid = $(`#${peerId}`)[0];
  attachStream(vid, stream);
  userData.peerJoining = false;
}