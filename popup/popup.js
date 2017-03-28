document.addEventListener('DOMContentLoaded', function() {

});

window._bzPop={
  _setting:null,
  _init:function(){
    //Setting links
    this._findById("_settingLink1")._click(function(){
      _bzPop._showServer();
    });
    this._findById("_settingLink2")._click(function(){
      _bzPop._showServer();
    });
    //Lanuch button
    this._findById("_btnLanuch")._click(function(){
      var _project=_bzPop._findById("_project");
      if(_project){
        _bzPop._setting._project=_project._val();
        _bzPop._launch();
      }
    });
    //set server button
    this._findById("_btnSetServer")._click(function(){
      _bzPop._setServer();
    });
    //login button
    this._findById("_btnLogin")._click(function(){
      _bzPop._login();
    });

    this._setting=localStorage.getItem("_bzSetting");
    
    if(!this._setting){
      this._showServer();
    }else{
      this._setting=JSON.parse(this._setting);
      this._retrieveProjectList();
    }
  },
  _hideAllPages:function(){
    this._findById("_serverPage")._hide();
    this._findById("_loginPage")._hide();
    this._findById("_projectPage")._hide();
    this._findById("_message")._hide();
    this._findById("_settingLink2")._hide();
  },
  _showServer:function(){
    this._hideAllPages();
    this._findById("_serverPage")._show();
  },
  _showLogin:function(){
    this._hideAllPages();
    this._findById("_loginPage")._show();
    this._findById("_signUpLink")._attr({href:"http://"+this._setting._server+"/"});
  },
  _showProject:function(){
    this._hideAllPages();
    this._findById("_projectPage")._show();
    this._findById("_settingLink2")._show();
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
      _bzPop._showMessage(_response);
    });
  },
  _setServer:function(){
    this._setting={_server:this._findById("_serverName")._val()};
    this._retrieveProjectList();
  },
  _login:function(){
    var _data={
      username:this._findById("_username")._val(),
      password:this._findById("_password")._val()
    };
    var _this=this;
    this._sendMsg({_fun:"_login",_setting:_this._setting,_data:_data}, function(_response) {
      if(!_response){
        _this._showServer();
        _bzPop._showMessage("There is no response from the server. Please check the server address.");
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
  _retrieveProjectList:function(){
    var _this=this;
    this._sendMsg({_fun:"_retrieveProjectList",_setting:_this._setting},function(_response) {
      if(!_response){
        _this._showServer();
        _bzPop._showMessage("There is no response from the server. Please check the server address.");
      }else{
        try{
          _response=JSON.parse(_response);
          if(_response.constructor==Array){
            var _select=_this._findById("_project");
            for(var i=0;i<_response.length;i++){
              var r=_response[i];
              if(r.code==_this._setting._project){
                return _this._launch();
              }
              _select._append("<option value='"+r.code+"'>"+r.name+"</option>");
            }
            _bzPop._showProject();
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
