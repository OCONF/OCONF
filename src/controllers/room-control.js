import randomWord from 'random-words';

export default function chooseRoom() {
  const path = window.location.pathname.slice(5);

  if (path) {
    window.room = path;
  } else {
    window.room = getRandomRoom();
    window.location = `/app/${window.room}`;
  }

}

function getRandomRoom() {
  let randomWords = randomWord({exactly: 4});
  return randomWords.join('');
}
