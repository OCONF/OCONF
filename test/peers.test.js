import assert from 'assert';
import $ from 'jquery';
import { peerJoined } from '../src/helpers/peers';

function addMessage(message, className) {
  console.log(`${message}: ${className}`);
}

describe('peers.js', () => {
  describe('peerJoined', () => {
    const peerInfo = {
      userData: {
        displayName: 'test',
      },
      settings: {
        audio: {},
      },
    };
    const userData = {
      id: '',
      audioMuted: false,
      videoMuted: false,
      screenShared: false,
      peerJoining: false,
    };
    const videoList = $('<div />', {
      id: 'video-list',
    });
    videoList.appendTo('body');
    peerJoined(1, peerInfo, false, userData, addMessage);
    it('should create a new peer div', () => {
      const expected = $('#video1').length;
      assert.equal(expected, 1);
    });
    it('should create a new peer video', () => {
      const expected = $('#1').length;
      assert.equal(expected, 1);
    });
    it('should have a display name equal to the userdata display name', () => {
      const expected = $('#1').attr('data-display-name');
      assert.equal(expected, 'test');
    })
  });
});
