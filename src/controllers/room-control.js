import randomWord from 'random-words';
import { Skynet } from '../index';

export default function chooseRoom() {
  const path = window.location.pathname.slice(5);
  console.log(path);
  if (path) {
    window.room = path;
    getUserName();
  } else {
    window.room = getRandomRoom();
    window.location = `/app/${window.room}`;
  }

}

function getRandomRoom() {
  let randomWords = randomWord({exactly: 4});
  return randomWords.join('');
}

function getUserName() {
  window.user = prompt('What is your name?');
  Skynet.setUserData({
    displayName: window.user,
  });
}
