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

Skynet.on('peerUpdated', function(peerId, peerInfo, isSelf) {
  var videoStatus = peerInfo.mediaStatus.videoMuted;
  if (isSelf) {
  var div = document.getElementById('selfVideo');
    if (videoStatus) {
      div.className = 'unicorn-self';
    } else {
      div.className = '';
    }
  } else {
    var div = document.getElementById('video' + peerId);
    if (videoStatus) {
      div.className = 'videodiv unicorn';
    } else {
      div.className = 'videodiv';
    }
  }
})

Skynet.on('peerLeft', function(peerId, peerInfo, isSelf) {
  if (isSelf) return;
  var vid = document.getElementById('video'+peerId);
  if (vid) {
    document.getElementById('peersVideo').removeChild(vid);
  }
});

Skynet.on('mediaAccessSuccess', function(stream) {
  console.log(stream);
  var vid = document.getElementById('myvideo');
  attachMediaStream(vid, stream);
  var audioMuted = false;
  var videoMuted = false;
  document.getElementById('audio-mute').onclick = function() {
    audioMuted = !audioMuted;
    if (audioMuted) {
      this.className = "btn btn-danger glyphicon glyphicon-volume-off";
    } else {
      this.className = "btn btn-success glyphicon glyphicon-volume-down";
    }
    Skynet.muteStream({audioMuted: audioMuted});
  };
  document.getElementById('video-mute').onclick = function() {
    videoMuted = !videoMuted;
    if (videoMuted) {
      this.className = "btn btn-danger glyphicon glyphicon-facetime-video";
    } else {
      this.className = "btn btn-success glyphicon glyphicon-facetime-video";
    }
    Skynet.muteStream({videoMuted: videoMuted});
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

var screenShared = false;
document.getElementById('share-screen').onclick = function() {

  if (!screenShared) {
    Skynet.shareScreen({enableAudio: true}, function(error, success) {
      screenShared = true;
      if (error) console.log(error);
      else console.log(success);
    });
  } else {
    Skynet.stopScreen();
    screenShared = false;
  }
};


Skynet.init({
  apiKey: '44759962-822a-42db-9de2-39a31bf25675',
  defaultRoom: 'test'
}, function() {
  Skynet.joinRoom({
    audio: true,
    video: true
  });
});


