'use strict';

var Skynet = new Skylink();


Skynet.on('peerJoined', function(peerId, peerInfo, isSelf) {
  if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
  var div = document.createElement('div');
  div.className = 'videodiv'
  div.id = 'video'+peerId;
  var vid = document.createElement('video');
  vid.autoplay = true;
  vid.className = 'videocontainer peervideo';
  vid.muted = false; // Added to avoid feedback when testing locally
  vid.id = peerId;
  div.appendChild(vid);
  document.getElementById('peersVideo').appendChild(div);
});

Skynet.on('incomingStream', function(peerId, stream, isSelf) {
  if(isSelf) return;
  var vid = document.getElementById(peerId);
  attachMediaStream(vid, stream);
});
Skynet.on('peerUpdated', function(peerId, peerInfo) {
  var div = document.getElementById('video' + peerId);
  var videoStatus = peerInfo.mediaStatus.videoMuted;
  if (videoStatus) {
    div.className = 'videodiv unicorn';
  } else {
    div.className = 'videodiv';
  }
})

Skynet.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var vid = document.getElementById('video'+peerId);
  document.getElementById('peersVideo').removeChild(vid);
});

Skynet.on('mediaAccessSuccess', function(stream) {
  var vid = document.getElementById('myvideo');
  attachMediaStream(vid, stream);
  var audioMuted = false;
  var videoMuted = false;
  document.getElementById('audio-mute').onclick = function() {
    audioMuted = !audioMuted;
    Skynet.muteStream({audioMuted: audioMuted});
  };
  document.getElementById('video-mute').onclick = function() {
    videoMuted = !videoMuted;
    Skynet.muteStream({videoMuted: videoMuted});
    // .className = 'videocontainer unicorn';
    // console.log(vid);
  };
  // var options = {};
  // var speechEvents = hark(stream, options);

  // speechEvents.on('speaking', function() {
  //   vid.className = 'speaker'
  //   console.log('speaking');
  //   console.log(vid);
  // });

  // speechEvents.on('stopped_speaking', function() {
  //   console.log('stopped_speaking');
  //   vid.className = ''
  // });
});

Skynet.init({
  apiKey: '44759962-822a-42db-9de2-39a31bf25675',
  defaultRoom: 'test'
}, function() {
  Skynet.joinRoom({
    audio: true,
    video: true
  });
});


