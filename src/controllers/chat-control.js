import $ from 'jquery';
import {
  Skynet,
} from '../index';

export function sendMessage() {
  const input = document.getElementById('message-input');
  input.onkeyup = function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      Skynet.sendMessage(input.value);
      input.value = '';
    }
  };
}


function scrollToBottom() {
  $('#chat-history').scrollTop($('#chat-history')[0].scrollHeight);
}

export function addMessage(message, className) {
  const chatbox = document.getElementById('chat-history');
  const li = document.createElement('li');
  li.className = className;
  li.textContent = message;
  chatbox.appendChild(li);
  scrollToBottom();
}

export function button() {
  $('#peek').on('click', function() {
    var $this = $(this);
    if ($this.hasClass('open')) {
      $(document).keyup(function(e) {
        if (e.keyCode == 27) { 
          $this.animate({
            left: '360px'
          }, 500).removeClass('open');
        }
      });
    } else {
      $this.animate({
        left: 0
      }, 500).addClass('open');
    }
  });
}
