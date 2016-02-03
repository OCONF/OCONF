import randomWord from 'random-words';
import { Skynet } from '../index';
const $ = window.$;

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
  $('#userModal').modal('toggle');
  $('#room-share').text(window.location.href);
  $('#username').focus();
  $('#username').on('keypress', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      $('#user-okay').trigger('click');
    }
  });
  $('#user-okay').on('click', () => {
    window.user = $('#username').val();
    Skynet.setUserData({
      displayName: window.user,
    });
    // $('#userModal').modal('hide');
    callback();
  });
}
