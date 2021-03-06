var ace = require('brace'),
  Mock = require('mockjs');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/mode/xml');
require('brace/mode/html')
require('brace/theme/xcode');
require("brace/ext/language_tools.js");

function run(options) {
  var editor,
    mockEditor,
    rhymeCompleter;
  function handleJson(json) {
    var curData = mockEditor.curData;
    try {
      curData.text = json;
      var obj = JSON.parse(json);
      curData.format = true;
      curData.jsonData = obj;      
    } catch (e) {
      curData.format = e.message;
    }
  }
  options = options || {};
  var container, data;
  container = options.container || 'mock-editor';
  if (options.wordList && typeof options.wordList === 'object' && options.wordList.name && options.wordList.mock) {
    wordList.push(options.wordList);
  }
  data = options.data || '';
  options.readOnly = options.readOnly || false;
  options.fullScreen = options.fullScreen || false;

  editor = ace.edit(container)
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode('ace/mode/javascript');
  if (options.readOnly === true) {
    editor.setReadOnly(true);
    editor.renderer.$cursorLayer.element.style.display = "none";
  }
  editor.setTheme('ace/theme/xcode');
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: false,
    enableLiveAutocompletion: true,
    useWorker: true
  });
  editor._fullscreen_yapi = options.fullScreen;
  mockEditor = {
    curData: {},
    getValue: ()=>mockEditor.curData.text,
    setValue: function (data) {
        editor.setValue(handleData(data));
    },
    editor: editor,
    options: options,
    insertCode: (code)=>{
      let pos = editor.selection.getCursor()
      editor.session.insert(pos, code)
    }
  }

  function formatJson(json){
    try{
      return JSON.stringify(JSON.parse(json), null, 2);
    }catch(err){
      return json;
    }
  }

  function handleData(data){
    data = data || '';
    if(typeof data === 'string'){
      return formatJson(data);
    }else if (typeof data === 'object') {
      return JSON.stringify(data, null, "  ")
    }
  }

  mockEditor.setValue(handleData(data));
  handleJson(editor.getValue())

  editor.clearSelection();

  editor.getSession().on('change', () => {
    handleJson(editor.getValue())
    if (typeof options.onChange === 'function') {
      options.onChange.call(mockEditor, mockEditor.curData);
    }
    editor.clearSelection();

  });

  return mockEditor;
}





/**
 * mockEditor({
      container: 'req_body_json', //dom的id
      data: that.state.req_body_json, //初始化数据
      onChange: function (d) {
        that.setState({
          req_body_json: d.text
        })
      }
    })
 */
module.exports = run;
