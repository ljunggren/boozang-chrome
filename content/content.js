chrome.runtime.onMessage.addListener(
  function(_request, _sender, _sendResponse) {
    var _setting=_request._message._setting;
    var _xhrObj = new XMLHttpRequest;
    
    if( _request._message._fun === "_launch" ) {
      var _url = "//"+ _setting._server + "/ide?id=" + _setting._project + "&type=plugin";
      _xhrObj.open('GET', _url, false);
      _xhrObj.send('');

      var se = document.createElement('script');
      se.type = "text/javascript";
      se.text = _xhrObj.responseText;
      document.write('<html><head></head></html>');
      document.getElementsByTagName('head')[0].appendChild(se);
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
