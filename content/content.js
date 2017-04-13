function _insertCode(_xhrObj,_url,_tag,_preCode,_sufCode){
  _xhrObj.open('GET', _url, false);
  _xhrObj.send('');
  _preCode=_preCode||"";
  _sufCode=_sufCode||"";
  var se = document.createElement(_tag);
  if(_tag=="style"){
    se.innerHTML=_xhrObj.responseText;
  }else{
    return _xhrObj.responseText;
//    se.text ="alert(11);eval('alert(22);');"+_preCode+";"+_xhrObj.responseText+";"+_sufCode+";eval('alert(3);')";
  }
  document.getElementsByTagName('head')[0].appendChild(se);
}

chrome.runtime.onMessage.addListener(
  function(_request, _sender, _sendResponse) {
    var _setting=_request._message._setting;
    var _xhrObj = new XMLHttpRequest;
    
    if( _request._message._fun === "_launch" ) {
      document.body.innerHTML="";
      document.write("<html><head></head><div id='bzTmp' style='display:none'>Boozang plug-in doesn't support testing of this website.</div></html>");
      //main ref
      var _url = "//"+ _setting._server + "/ide?id=" + _setting._project + "&type=plugin";
      _url="//"+ _setting._server + "/ide/js/main_en";
//      _insertCode(_xhrObj,_url,"script",code,";function cleanBZ(n){if(n>100){return;} setTimeout(function(){console.clear();if(document.body.innerHTML.length>1000){$('#bzTmp').remove()}else{if(n>20){document.getElementById('bzTmp').style.display=''};cleanBZ(++n)}},100)}cleanBZ(0);");
      
      //load css
      _url = "//"+ _setting._server + "/ide/css/main.max.css";
      _insertCode(_xhrObj,_url,"style");

      _url = "//"+ _setting._server + "/ide/css/main.icons.css";
      _insertCode(_xhrObj,_url,"style");

      //load main.js 
      _url = "//"+ _setting._server + "/ide/js/main_en";
      var code='window.inCrashing=true;window.projectId="58eeec548c2d3e4c82b6e0f5";var ServerHost="//app.boozang.com/";var curUser={"_id":"58e5ba02cc1e41697e66c3b2","email":"lws_home@hotmail.com","code":"58e5ba02cc1e41697e66c3b2","__v":0,"projectMap":{"p58eeec548c2d3e4c82b6e0f5":{"permissions":[35,9,63,63,63,63,63,63,0],"role":"owner"},"p58e66cb18b696f7c8dba490d":{"permissions":["3","1","3","3","3","35","31","63","0"],"role":"qa"},"p58e5c7af52227774421110a9":{"permissions":[35,9,63,63,63,63,63,63,0],"role":"owner"}},"testTimeCounter":361,"updateStamp":{"user":"58e5ba02cc1e41697e66c3b2","time":1492056710106},"createStamp":{"time":1491450370182},"contactInfo":{"firstName":"Wensheng","lastName":"Li","email":"lws_home@hotmail.com"},"status":"active","company":{"obj":null,"role":"owner","permissions":[35,9,63,63,63,63,63,63,0]},"provider":"local","language":"en","displayName":"Wensheng Li","id":"58e5ba02cc1e41697e66c3b2"};var md5Value="9b8f099f4863a3f8890eca4801b3bf44";var curProjectData={_id:"58eeec548c2d3e4c82b6e0f5",versions:["0.0.1"]};document.write("");';
      code+=_insertCode(_xhrObj,_url,"script","window.open(location.href,'_blank','width:900,height:900');");
      var se = document.createElement("script");
      se.text =code;
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
    }else if(_request._message._fun=="_logout"){
      var _url="//"+_setting._server+"/api/signout";
      _xhrObj.open('POST', _url, false);
      _xhrObj.send();
      location.reload();
      _sendResponse (_xhrObj.responseText);
    }
  }
);
