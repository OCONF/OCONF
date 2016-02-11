import $ from 'jquery';

/**
* @function peerJoined
*/
export function peerJoined(peerId, peerInfo, isSelf, userData) {
  if (isSelf) return;
  userData.peerJoining = true;
  const displayName = peerInfo.userData.displayName !== undefined ? peerInfo.userData.displayName : 'anon';
  const audioStatus = peerInfo.settings.audio;
  const div = $('<div />', {
    id: `video${peerId}`,
    class: 'videodiv',
  });
  const video = $('<video />', {
    id: peerId,
    autoplay: true,
    class: 'videocontainer peervideo img-responsive',
    'data-display-name': displayName,
  });
  const overlay = $('<div />', {
    class: 'overlay',
  });
  overlay.text(displayName + ' ');
  if(audioStatus) {
    overlay.append('<i class="fa fa-microphone-slash text-danger"></i>');
  }
  div.append(overlay).append(video);
  $('#video-list').append(div);
}

/**
* @function peerLeft
*/
export function peerLeft(peerId, peerInfo, isSelf, userData) {
  if (isSelf) return;
  // this should remove the peer,
  else if ($(`#video${peerId}`)) {
    // handling if peer is the speaker, this will ensure speaker is removed
    $(`#${peerId}`).remove();
    $(`#video${peerId}`).remove();
  }
}

/**
* @function peerUpdated
*/
export function peerUpdated (peerId, peerInfo, isSelf, userData) {
  const videoStatus = peerInfo.mediaStatus.videoMuted;
  const audioStatus = peerInfo.mediaStatus.audioMuted;

  const speaker = !isSelf ? $(`#${peerId}`).parent()[0] : $('#myvideo').parent()[0];
  if (speaker.id === 'speaker') {
    const div = $('#speaker');
    if (videoStatus) div.addClass('unicorn-self');
    else div.removeClass('unicorn-self');
  } else if (isSelf) {
    const div = $('#self');
    if (videoStatus) div.addClass('unicorn');
    else div.removeClass('unicorn');
  } else {
    const div = $(`#video${peerId}`);
    if (videoStatus) div.addClass('unicorn');
    else div.removeClass('unicorn');
  }
  
  // audio mute
  if(audioStatus && $(`#video${peerId} > .overlay > i`).length === 0) {
    $(`#video${peerId} > .overlay`).append('<i class="fa fa-microphone-slash text-danger"></i>');
  }
  else {
    $(`#video${peerId} > .overlay > i`).remove();
  }
}
