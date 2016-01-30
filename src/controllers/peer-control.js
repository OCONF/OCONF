import $ from 'jquery';
import { Skynet } from '../index';

/**
* @function peerJoined
*/
export function peerJoined() {
  Skynet.on('peerJoined', (peerId, peerInfo, isSelf) => {
    if (isSelf) return;
    let div = $('<div></div>')
      .addClass('videodiv')
      .attr('id', `video${peerId}`);
    let vid = $('<video></video>')
      .addClass('videocontainer peervideo')
      .attr({
        id: peerId,
        autoplay: true,
        muted: false,
      });
    div.append(vid);
    $('#peersVideo').append(div);
  });
}

/**
* @function peerLeft
*/
export function peerLeft() {
  Skynet.on('peerLeft', (peerId, peerInfo, isSelf) => {
    if (isSelf) return;
    else if ($(`#video${peerId}`)) $(`#video${peerId}`).remove();
  });
}

/**
* @function peerUpdated
*/
export function peerUpdated () {
  Skynet.on('peerUpdated', (peerId, peerInfo, isSelf) => {
    const videoStatus = peerInfo.mediaStatus.videoMuted;
    if (isSelf) {
      let div = $('#selfVideo');
      if (videoStatus) div.addClass('unicorn-self');
      else div.removeClass('unicorn-self');
    } else {
      let div = $(`#video${peerId}`);
      if (videoStatus) div.addClass('unicorn');
      else div.removeClass('unicorn');
    }
  });
}
