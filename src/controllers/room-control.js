'use strict';
import jq from 'jquery';
import randomWord from 'random-words';
import { Skynet } from '../index';

export function chooseRoom(callback) {
  const path = window.location.pathname.slice(5);
  if (path) {
    window.room = path;
    userModal(callback);
  } else {
    window.room = getRandomRoom();
    window.location = `/app/${window.room}`;
  }

}

function getRandomRoom() {
  let randomWords = randomWord({exactly: 4});
  return randomWords.join('');
}

export function userModal(callback) {
  // window.user = prompt('What is your name?');
  jq('#userModal').modal('toggle');
  jq('#room-share').text(window.location.href);
  jq('#username').focus();
  jq('#username').on('keypress', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      jq('#user-okay').trigger('click');
    }
  });
  jq('#user-okay').on('click', () => {
    window.user = jq('#username').val();
    Skynet.setUserData({
      displayName: window.user,
    });
    // jq('#userModal').modal('hide');
    callback();
  });
}
