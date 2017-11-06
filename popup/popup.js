//Mats to check the below message!!! I think we should mention maybe the reason is on our server side.
var NoResponse="There is no response from the server. Please check your network.";
var APP_SERVER="app.boozang.com";
document.addEventListener('DOMContentLoaded', function() {

});

var blockList=[
  "www.facebook.com",
  "app.boozang.com",
  "www.boozang.com",
  "github.com",
  "www.linkedin.com"]
window._bzPop={
  _setting:null,
  _clickCount:0,
  _init:function(){
    var _this=this;
    document.body.onclick=function(){
      _bzPop._clickCount++;
      if(_bzPop._clickCount>5 && Date.now()-_bzPop._clickTime<3000){
        _bzPop._showServer();
      }else if(!_bzPop._clickTime || (Date.now()-_bzPop._clickTime>3000)){
        _bzPop._clickTime=Date.now();
        _bzPop._clickCount=1;
      }
    }
    //Setting links
/*
    this._findById("_settingLink1")._click(function(){
      _bzPop._showProject();
    });
*/
    this._findById("_settingLink2")._click(function(){
      _bzPop._showProject();
    });
    this._findById("_logout")._click(function(){
      _bzPop._sendMsg({_fun:"_logout",_setting:_bzPop._setting}, function(_response) {
        location.reload()
      });
    });
    //Lanuch button
    this._findById("_btnLanuch")._click(function(){
      var _project=_bzPop._findById("_project");
      if(_project){
        _bzPop._setting._project=_project._val();
        _bzPop._launch();
      }
    });
    //login button
    this._findById("_btnLogin")._click(function(){
      _bzPop._login();
    });
console.log("start ....")
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      var url=tab.url;
      if(url){
        url=url.split("/"+"/")[1].split("/")[0]
      }
      console.log(url)
      if(blockList.includes(url)){
        _this._hideAllPages();
        _this._showMessage("Cannot test the website: "+url)
      }else{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log("reload: "+tabs[0].url)
          chrome.tabs.reload();
//          chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });

        _this._findById("_domain")._html(url);
        
        //    this._setting=localStorage.getItem("_bzSetting");
        if(!_this._setting){
          _this._setting={_server:"app.boozang.com"};
        }else{
          _this._setting=JSON.parse(_this._setting);
          _this._setting._server=APP_SERVER;
        }
        _this._retrieveProjectList(1);
      }
    });
  },
  _hideAllPages:function(){
    this._findById("_loginPage")._hide();
    this._findById("_projectPage")._hide();
    this._findById("_message")._hide();
    this._findById("_settingLink2")._hide();
  },
  _showServer:function(){
    this._hideAllPages();
    this._findById("_logout")._hide()
  },
  _showLogin:function(){
    this._hideAllPages();
    this._findById("_loginPage")._show();
    this._findById("_serverName")._val(this._setting._server)
    this._findById("_signUpLink")._attr({href:"https://"+this._setting._server+"/"});
  },
  _showProject:function(){
    this._hideAllPages();
    this._setting._project=null;
    this._findById("_projectPage")._show();
    this._findById("_settingLink2")._hide();
  },
  _showMessage:function(msg){
    _bzPop._findById("_message")._html(msg)._show();
  },
  _launch:function(){
    this._hideAllPages();
    this._showMessage("Launch ...");
    this._findById("_settingLink2")._show();
    localStorage.setItem("_bzSetting",JSON.stringify(this._setting));
    this._sendMsg({_fun:"_launch",_setting:this._setting}, function(_response) {
      if (_response === 'ok') {
         _bzPop._showMessage("Refresh browser to quit Boozang. All unsaved changes will be lost. ");
      } else {
        _bzPop._showMessage("Something went wrong. " + _response);
      }
    });
  },
  _setServer:function(){
    this._setting={_server:this._findById("_serverName")._val()};
    this._retrieveProjectList();
  },
  _login:function(){
    this._setting={_server:this._findById("_serverName")._val()};
    var _data={
      username:this._findById("_username")._val(),
      password:this._findById("_password")._val()
    };
    var _this=this;
    this._sendMsg({_fun:"_login",_setting:_this._setting,_data:_data}, function(_response) {
      if(!_response){
        _this._showLogin();
        _bzPop._showMessage(NoResponse);
        
      }else{
        _response=JSON.parse(_response);
        if(_response.message){
          _bzPop._showMessage("Login failed! Please try again");
        }else{
          _bzPop._retrieveProjectList();
        }
      }
    });
  },
  _retrieveProjectList:function(_first){
    var _this=this;
    this._sendMsg({_fun:"_retrieveProjectList",_setting:_this._setting},function(_response) {
      if(!_response){
        _this._showLogin();
        console.log("first: "+_first)
        if(!_first){
          
          _bzPop._showMessage(NoResponse);
        }
      }else{
        var _ready=false;
        try{
          _response=JSON.parse(_response);
          if(_response.constructor==Array){
            _this._findById("_logout")._show()
            var _select=_this._findById("_project");
            _select._element.innerHTML="";
            for(var i=0;i<_response.length;i++){
              var r=_response[i];
              if(r.code==_this._setting._project){
                _ready=true;
              }
              _select._append("<option value='"+r.code+"'>"+r.name+"</option>");
            }
            if(_ready){
              return _this._launch();
            }else{
              _bzPop._showProject();
            }
          }else{
            _bzPop._showLogin();
          }
        }catch(e){
          _bzPop._showLogin();
        }
      }
    });
  },
  _sendMsg:function(_message,_fun){
    console.log(_message)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {_message: _message}, _fun);  
    });
  },
  _findById:function(id){
    return {
      _element:window.document.getElementById(id),
      _show:function(){
        this._element.style.display="";
        return this;
      },
      _hide:function(){
        this._element.style.display="none";
        return this;
      },
      _val:function(){
        return this._element.value;
      },
      _click:function(_fun){
        this._element.onclick=_fun;
        return this;
      },
      _html:function(_msg){
        this._element.innerHTML=_msg;
        return this;
      },
      _attr:function(d){
        for(var k in d){
          this._element[k]=d[k];
        }
        return this;
      },
      _append:function(v){
        this._element.innerHTML+=v;
        return this;
      }
    };
  },
}
setTimeout(function(){
  window._bzPop._init();
},100)
