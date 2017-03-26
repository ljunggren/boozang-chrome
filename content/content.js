var some = function(list, callback){
	for(var i = 0; i < list.length; i++){
		if(callback(list[i])) return true;
	}
	return false;
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Content.js: Listener active");
  	console.log(sender.tab ?
                "Content.js: Calling from a content script:" + sender.tab.url :
                "Content.js: Calling from the extension");
    if( request.message === "launch_tool" ) {
        console.log("Content.js: Launching Boozang tool");

        chrome.runtime.sendMessage({get_settings: "settings"}, function(response) {
   	        var settings = response.msg;
            if (settings) {
    	       console.log("Settings exists. ProjectKey is " + settings.projectKey + " and server is " + settings.server);
            } else {
            	console.log("Settings empty. Popup window should have taken care of this.");
                //chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) { });            
            }   

             var xhrObj = new XMLHttpRequest;

             var projecturl = "//"+ settings.server + "/ide?id=" + settings.projectKey + "&type=plugin";
             
             console.log("Project URL" + projecturl);
             
             xhrObj.open('GET', projecturl, false);
			 xhrObj.send('');

			 var se = document.createElement('script');
			 se.type = "text/javascript";
			 se.text = xhrObj.responseText;
             
             var doc = document;
			 doc.write('<html><head></head></html>');
			 doc.getElementsByTagName('head')[0].appendChild(se);
        }); 
    }
  }
);

