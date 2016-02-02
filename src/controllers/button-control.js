'use strict';
import $ from 'jquery';
import { Skynet } from '../index';
import { userData } from '../index';

/**
* Button control module.
* @module button-control
* @see button-control
*/

/**
* @function audioMuteControl
*/
export function audioMuteControl() {
    $('#audio-mute').on('click', () => {
    userData.audioMuted = !userData.audioMuted;
    if (userData.audioMuted) {
      $('#audio-mute').removeClass('btn-success glyphicon-volume-down').addClass('btn-danger glyphicon-volume-off');
    } else {
      $('#audio-mute').removeClass('btn-danger glyphicon-volume-off').addClass('btn-success glyphicon-volume-down');
    }
    Skynet.muteStream(
      { audioMuted: userData.audioMuted }
    );
  });
}
/**
* @function videoMuteControl
*/
export function videoMuteControl() {
  $('#video-mute').on('click', () => {
    userData.videoMuted = !userData.videoMuted;
    if (userData.videoMuted) {
      $('#video-mute').removeClass('btn-success').addClass('btn-danger');
    } else {
      $('#video-mute').removeClass('btn-danger').addClass('btn-success');
    }
    Skynet.muteStream(
      { videoMuted: userData.videoMuted }
    );
  });
}

export function screenShare() {
  $('#share-screen').on('click', () => {
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
  });
}

export function sendFile() {
  $('#send-file').on('click', () => {
    let files = $('#file')[0].files;
    Skynet.sendBlobData(files[0]);
  })
}

export function addMessage(message, className) {
  var infobox = $('#infobox'),
  div = document.createElement('div');
  div.className = className;
  div.innerHTML = message;
  $('#infobox').append(div);
}

export function addFile(transferId, peerId, displayName, transferInfo, isUpload) {
  var transfers = $('#transfers'),
  item = document.createElement('tr');
  item.innerHTML = '<td>' + ((isUpload) ? '&#8657;' : '&#8659;') + '</td>' +
    '<td>' + displayName + '</td><td>' + transferInfo.name +
    '</td><td><span id="' + peerId + '_' + transferId + '"></span>' +
    ((!isUpload) ? '<a id="' + transferId + '" href="#" download="' +
      transferInfo.name + '" style="display:none">Download</a>' : '') + '</td>';
  transfers.append(item);
}