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
  const peerParent = $(`#${peerId}`).parent();
  if (isSelf) return;
  // this should remove the peer,
  else if ($(`#video${peerId}`)) {
    // handling if peer is the speaker, this will ensure speaker is removed
    peerParent.children().remove();
    // $(`#${peerId}`).remove();
    // $(`#video${peerId}`).remove();
  }
}

/**
* @function peerUpdated
*/
export function peerUpdated (peerId, peerInfo, isSelf, userData) {
  const videoStatus = peerInfo.mediaStatus.videoMuted;
  const audioStatus = peerInfo.mediaStatus.audioMuted;

  const parent = !isSelf ? $(`#${peerId}`).parent() : $('#myvideo').parent();
  const parentId = parent[0].id;
  let unicornClass = parentId === 'speaker' ? 'unicorn-self' : 'unicorn';
  if (videoStatus) parent.addClass(unicornClass);
  else parent.removeClass(unicornClass);

  // audio mute
  if (audioStatus && $(`#${parentId} > .overlay > i`).length === 0) {
    $(`#${parentId} > .overlay`).append('<i class="fa fa-microphone-slash text-danger"></i>');
  }
  else {
    $(`#${parentId} > .overlay > i`).remove();
  }
}
