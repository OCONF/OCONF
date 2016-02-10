'use strict';
import $ from 'jquery';
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
  $('#userModal').modal('toggle');
  let roomShare = $('#room-share');
  let roomText = roomShare.text();
  let userNameInput = $('#username');
  roomShare.text(`${roomText} ${window.location.href}`);
  userNameInput.focus();
  // prevent form from being submitted
  userNameInput.on('keypress', e => {
    if (e.keyCode === 13) e.preventDefault();
  });
  userNameInput.on('keyup', e => {
    if (userNameInput.val().length > 0) $('#user-okay').removeClass('disabled');
    else if (userNameInput.val().length === 0) $('#user-okay').addClass('disabled');
    if (e.keyCode === 13) {
      // only allow user to go forward if they've entered a username
      if (userNameInput.val().length > 0) {
        setUserName(callback);
      }
    }
  });
  $('#user-okay').on('click', () => {
      setUserName(callback);
  });
}

function setUserName(callback) {
  window.user = $('#username').val();
  if (window.user.length) {
    Skynet.setUserData({
      displayName: window.user,
    });
    $('#userModal').modal('hide');
    // $('#userModal').modal('hide');
    // var text  = $('#roomName');
    // console.log(text);
    // $('#roomName').text(':' + window.room);
    callback();
  }
}
