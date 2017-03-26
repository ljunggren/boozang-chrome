document.addEventListener('DOMContentLoaded', function() {

});

chrome.runtime.sendMessage({get_settings: "settings"}, function(response) {
  console.log("Popup: Message reply.")
  if (response) {
    console.log("Popup: Response is not null")
    var settings = response.msg;
    if (initSettings(settings)) {
      console.log("Launching tool");
      launchTool();
    } else {
        console.log("Settings empty");
    }  
  } else {
    console.log("Popup: Response is null. Bad code");
  }
});

function launchTool(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {message: "launch_tool"}, function(response) {
      console.log('Start action sent. Response ' + response);
    });  
  });
}

  function initSettings(settings) {
    window.document.getElementById("editLink").onclick = setEditMode;
    window.document.getElementById("saveButton").onclick = saveSettings;

    if (settings && settings.projectKey&& settings.server) {
      console.log("Settings exists so show launch tool button");
      window.document.getElementById("projectKey").value = settings.projectKey;
      window.document.getElementById("serverInput").value = settings.server;
      window.document.getElementById("projectKeyText").innerHTML = settings.projectKey;
      
      setLaunchMode();
      return true;
    }
    else {
      window.document.getElementById("projectKey").value = "";
      window.document.getElementById("serverInput").value = "va.boozang.com";
      window.document.getElementById("projectKeyText").innerHTML = "";
      setEditMode();
      return false;
    }
  }

 function setEditMode () {
    window.document.getElementById("launchBlock").style = "display: none";
    window.document.getElementById("editBlock").style = "display: block";
  }


 function setLaunchMode () {
    window.document.getElementById("launchBlock").style = "display: block";
    window.document.getElementById("editBlock").style = "display: none";
  }
 
 function saveSettings() {
        // Get a value saved in a form.
        var projectKey = window.document.getElementById("projectKey").value;
        var server = window.document.getElementById("serverInput").value;

        console.log("Project Key = " + projectKey);
        console.log("Server Input = " + server);
        
        // Check that there's some code there.
        if (!projectKey) {
          error('Error: Project Key needs to be specified');
          return;
        } 

        var re = /[0-9A-Fa-f]{6}/g;
        if(!re.test(projectKey)) {
          error('Error: Project Key needs to be a hexadecimal value');
           return;
        }
       

        if (!server || server.length === 0) {
           server =  "va.boozang.com";
        }

        if ( !isURL(server) ){
          error2('Error: Server needs to be in format va.boozang.com'); 
          return;
        }


        chrome.runtime.sendMessage({set_settings: {"projectKey": projectKey, "server": server}}, function(response) {
             console.log("Options settings. " + response.msg);
             message(response.msg);
        });

        setLaunchMode();
        launchTool();
}


function message(mess) {
  window.document.getElementById("message").innerHTML = mess;
  window.document.getElementById("message").style = "color:black";
}

function error(mess) {
  window.document.getElementById("message").innerHTML = mess;
  window.document.getElementById("message").style = "color:red";
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}