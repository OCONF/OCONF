import CodeMirror from 'codemirror';
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/autorefresh');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/javascript-hint');
import $ from 'jquery';

let editor;

export default function createEditor() {
    editor = CodeMirror(document.getElementById('text-editor'), {
    lineNumbers: true,
    autoRefresh: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
    },
    mode: {
      name: 'javascript',
      globalVars: true,
    },
  });
  $('#textModal').draggable({ cursor: "move", handle: '.modal-header'});
}

export function sendData(socket, userId) {
  socket.emit('textChange', {
    text: editor.getValue(),
    room: window.room,
    senderId: userId,
  });
}

export function setData(data, userId) {
  if (data.senderId !== userId) editor.setValue(data.text);
}
