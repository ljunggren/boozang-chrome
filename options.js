//window.addEventListener('load', loadOptions);

chrome.runtime.sendMessage({get_settings: "settings"}, function(response) {
    var settings = response.msg;
    if (settings) {
    	console.log("Settings exists");
        window.document.getElementById("projectKey").value = settings.projectKey;
        window.document.getElementById("serverInput").value = settings.server;
    } else {
        console.log("Settings empty");
        window.document.getElementById("projectKey").value = "";
        window.document.getElementById("serverInput").value = "va.boozang.com";
    }   

    window.document.getElementById("saveButton").onclick = saveSettings;
});


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
}

function message(mess) {
  window.document.getElementById("message").innerHTML = mess;
  window.document.getElementById("message").style = "color:black";
}

function message2(mess) {
  window.document.getElementById("message2").innerHTML = mess;
  window.document.getElementById("message2").style = "color:black";
}

function error(mess) {
  window.document.getElementById("message").innerHTML = mess;
  window.document.getElementById("message").style = "color:red";
}

function error2(mess) {
  window.document.getElementById("message2").innerHTML = mess;
  window.document.getElementById("message2").style = "color:red";
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
