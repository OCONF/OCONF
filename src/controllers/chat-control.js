import $ from 'jquery';
import {
  Skynet
} from '../index';

export function sendMessage() {
  const input = $('#message-input')[0];
  let message;
  input.onkeyup = function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      let text = input.value.trim();
      if (text === '') {
        input.value = '';
        return;
      }
      if (['/giphy'].some(function(giphy) {
          return text.toLowerCase().indexOf(giphy) === 0;
        })) {
        let gif = text.replace('/giphy ', '').split(' ').join('+');
        getGiphy(gif, function(giphy) {
          message = {
            type: 'gif',
            message: `<p>${text}</p> <img src="${giphy}" class="img-responsive">`,
          }
          Skynet.sendMessage(message);
          input.value = '';
        });
      } else {
        message = {
          type: 'text',
          message: text,
        }
        Skynet.sendMessage(message);
        input.value = '';

      }
    }
  };
}

function scrollToBottom() {
  $('#chat-history').scrollTop($('#chat-history')[0].scrollHeight);
}

export function addMessage(user, message, type, className) {
  if (!user) {
    return;
  }
  const chatbox = $('#chat-history');
  const li = $('<li>');
  var content = `<p>${user}: </p><span>`;

  if (type === 'text') {
    content += message.replace(/[<>]/ig, '');
  }
  if (type === 'gif') {
    content += message
  }
  content += '</span>';
  let $content = $(content);
  li.append($content);
  li.appendTo(chatbox);
  $('img').bind('load', function() {
    scrollToBottom();
  });
  scrollToBottom();
}

export function slide() {
  $('#peek').on('click', function() {
    const $this = $(this);
    if ($this.hasClass('open')) {
      $(document).keyup(function(e) {
        if (e.keyCode == 27) {
          $this.animate({
            left: '500px'
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

export function slideButton() {
  const peek = $('#peek');
  if (peek.hasClass('open')) {
    peek.animate({
      left: '500px'
    }, 500).removeClass('open');
  } else {
    peek.animate({
      left: 0
    }, 500).addClass('open');
  }
}


function getGiphy(gif, cb) {
  let url = `http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC&s=${gif}`;
  let xhr = new XMLHttpRequest();

  xhr.open('GET', url);
  xhr.onload = () => {
    let json = JSON.parse(xhr.response);
    let gif = json.data.images.fixed_height.url;
    cb(gif);

  };
  xhr.onerror = function() {
    console.log(e);
  };
  xhr.send();
}
