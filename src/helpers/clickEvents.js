import $ from 'jquery';
import { Skynet } from '../index';
import { userData } from '../index';

export function audioMuteControl() {
  userData.audioMuted = !userData.audioMuted;
  if (userData.audioMuted) {
    $('#audio-mute').removeClass('btn-success').addClass('btn-danger');
  } else {
    $('#audio-mute').removeClass('btn-danger').addClass('btn-success');
  }
  Skynet.muteStream(
    { audioMuted: userData.audioMuted }
  );
}

export function videoMuteControl() {
  userData.videoMuted = !userData.videoMuted;
  if (userData.videoMuted) {
    $('#video-mute').removeClass('btn-success').addClass('btn-danger');
  } else {
    $('#video-mute').removeClass('btn-danger').addClass('btn-success');
  }
  Skynet.muteStream(
    { videoMuted: userData.videoMuted }
  );
}

export function screenShare() {
  if (!userData.screenShared) {
    userData.screenShared = true;
    Skynet.shareScreen({ enableAudio: true }, (cancel) => {
      userData.screenShared = false;
    }, (error) => {
      console.log(error);
    });
  } else {
    Skynet.stopScreen();
    userData.screenShared = false;
    navigator.getUserMedia({video: true}, (stream) => {
      var video = document.getElementById('myvideo');
      attachMediaStream(video, stream);
    }, (error) => {
      console.log(error);
    });
  }
}

export function sendFile() {
  let files = $('#file')[0].files;
  Skynet.sendBlobData(files[0]);
}