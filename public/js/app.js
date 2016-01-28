'use strict';

var Skynet = new Skylink();

Skynet.on('peerJoined', function(peerId, peerInfo, isSelf) {
  if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
  var vid = document.createElement('video');
  vid.autoplay = true;
  vid.muted = false; // Added to avoid feedback when testing locally
  vid.id = peerId;
  document.body.appendChild(vid);
});

Skynet.on('incomingStream', function(peerId, stream, isSelf) {
  if(isSelf) return;
  var vid = document.getElementById(peerId);
  attachMediaStream(vid, stream);
});

Skynet.on('peerLeft', function(peerId, peerInfo, isSelf) {
  var vid = document.getElementById(peerId);
  document.body.removeChild(vid);
});

Skynet.on('mediaAccessSuccess', function(stream) {
  var vid = document.getElementById('myvideo');
  attachMediaStream(vid, stream);
  var options = {};
  var speechEvents = hark(stream, options);

  speechEvents.on('speaking', function() {
    console.log('speaking');
  });

  speechEvents.on('stopped_speaking', function() {
    console.log('stopped_speaking');
  });
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


