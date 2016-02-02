/*
function setName() {
  var input = document.getElementById('name');
  skylink.setUserData({
    name: input.value
  });
}
*/
import $ from 'jquery';
import { Skynet } from '../index';


// export function joinRoom() {
//   skylink.joinRoom();
// }

// export function leaveRoom() {
//   skylink.leaveRoom();
// }


export function sendMessage() {
  let input = document.getElementById('message-input');
  input.onkeyup = function(e){
  if(e.keyCode == 13){
    Skynet.sendMessage(input.value);
    input.value = '';
    console.log('test keypress');
  }
};
}

function scrollToBottom() {
  $('#chatbox-general').scrollTop($('#chatbox-general')[0].scrollHeight);
}
export function addMessage(message, className) {
let chatbox = document.getElementById('chatbox-general'),
  li = document.createElement('li');
  li.className = className;
  li.textContent = message;
  chatbox.appendChild(li);
  scrollToBottom();
}

// Skynet.on('peerJoined',(peerId, peerInfo, isSelf) => {
//   let user = 'You';
//   if(!isSelf) {
//     user = peerInfo.userData.name || peerId;
//   }
//   addMessage(user + ' joined the room', 'action');
// });

// Skynet.on('peerLeft', (peerId, peerInfo, isSelf) => {
//   let user = 'You';
//   if(!isSelf) {
//     user = peerInfo.userData.name || peerId;
//   }
//   addMessage(user + ' left the room', 'action');
// });


