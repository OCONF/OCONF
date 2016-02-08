import CodeMirror from 'codemirror';
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/xml/xml');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
import $ from 'jquery';

export default function createEditor() {
    CodeMirror(document.getElementById('text-editor'), {
    lineNumber: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
    },
    mode: {
      name: 'javascript',
      globalVars: true,
    },
  });
}
