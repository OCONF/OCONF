import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
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
    theme: 'lesser-dark',
    keyMap: 'sublime',
    matchBrackets: true,
    autoCloseBrackets: true,
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
