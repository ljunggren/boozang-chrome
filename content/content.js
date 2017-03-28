function _insertCode(_xhrObj,_url,_tag,_code){
  _xhrObj.open('GET', _url, false);
  _xhrObj.send('');
  _code=_code||"";
  var se = document.createElement(_tag);
  if(_tag=="style"){
    se.innerHTML=_xhrObj.responseText;
  }else{
    se.text = _code+_xhrObj.responseText;
  }
  document.getElementsByTagName('head')[0].appendChild(se);
}

chrome.runtime.onMessage.addListener(
  function(_request, _sender, _sendResponse) {
    var _setting=_request._message._setting;
    var _xhrObj = new XMLHttpRequest;
    
    if( _request._message._fun === "_launch" ) {
      document.write('<html><head></head></html>');
      //main ref
      var _url = "//"+ _setting._server + "/ide?id=" + _setting._project + "&type=plugin";
      _insertCode(_xhrObj,_url,"script");
      /*
      //load css
      _url = "//"+ _setting._server + "/ide/new/scss/main.max.css";
      _insertCode(_xhrObj,_url,"style");

      _url = "//"+ _setting._server + "/ide/new/scss/main.icons.css";
      _insertCode(_xhrObj,_url,"style");

      //load main.js 
      _url = "//"+ _setting._server + "/ide/js/main_en";
      _insertCode(_xhrObj,_url,"script","window.open(location.href,'_blank','width:900,height:900');");
      */
      _sendResponse ("ok");
    }else if(_request._message._fun=="_retrieveProjectList"){
      var _url="//"+_setting._server+"/api/projects";
      _xhrObj.open('GET', _url, false);
      _xhrObj.send('');
      _sendResponse (_xhrObj.responseText);
    }else if(_request._message._fun=="_login"){
      var _url="//"+_setting._server+"/api/signin";
      _xhrObj.open('POST', _url, false);
      _xhrObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      _xhrObj.setRequestHeader("Accept","application/json, text/plain, */*");
      _xhrObj.send(JSON.stringify(_request._message._data));
      _sendResponse (_xhrObj.responseText);
    }
  }
);
