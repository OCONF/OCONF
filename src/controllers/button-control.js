'use strict';
import $ from 'jquery';
import { Skynet } from '../index';

/**
* Button control module.
* @module button-control
* @see button-control
*/

let buttonControls = {
  audioMuted: false,
  videoMuted: false,
  screenShared: false,
};

/**
* @function audioMuteControl
*/
export function audioMuteControl() {
    $('#audio-mute').on('click', () => {
    buttonControls.audioMuted = !buttonControls.audioMuted;
    if (buttonControls.audioMuted) {
      $('#audio-mute').removeClass('btn-success glyphicon-volume-down').addClass('btn-danger glyphicon-volume-off');
    } else {
      $('#audio-mute').removeClass('btn-danger glyphicon-volume-off').addClass('btn-success glyphicon-volume-down');
    }
    Skynet.muteStream(
      { audioMuted: buttonControls.audioMuted }
    );
  });
}
/**
* @function videoMuteControl
*/
export function videoMuteControl() {
  $('#video-mute').on('click', () => {
    buttonControls.videoMuted = !buttonControls.videoMuted;
    if (buttonControls.videoMuted) {
      $('#video-mute').removeClass('btn-success').addClass('btn-danger');
    } else {
      $('#video-mute').removeClass('btn-danger').addClass('btn-success');
    }
    Skynet.muteStream(
      { videoMuted: buttonControls.videoMuted }
    );
  });
}

export function screenShare() {
  $('#share-screen').on('click', () => {
    if (!buttonControls.screenShared) {
      Skynet.shareScreen({ enableAudio: true }, (error, success) => {
        buttonControls.screenShared = true;
        if (error) console.log(error);
        else console.log(success);
      });
    } else {
      Skynet.stopScreen();
      buttonControls.screenShared = false;
    }
  });
}
