import CodeMirror from 'codemirror';
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/autorefresh');
import $ from 'jquery';

export default function createEditor() {
    const editor = CodeMirror(document.getElementById('text-editor'), {
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
}
