// background.js

// Called when the user clicks on the browser action.

  // Send a message to the active tab


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    
    var obj = { store: localStorage };
    
    var set_settings = request.set_settings;
    if (set_settings) {
    	console.log("Background.js: Set settings ");
    	console.log("Background.js: Setting project key " + set_settings.projectKey + " and server " + set_settings.server);
    	var settingsStringified = JSON.stringify(set_settings);
    	obj.store.setItem('settingsStringified', settingsStringified);  
        sendResponse({msg: 'Settings saved'});	
    } 

    var get_settings = request.get_settings;
   
    if (get_settings) {
       console.log("Background.js: Get settings ");
       var settingsStringified = obj.store.getItem('settingsStringified');
       if (settingsStringified){
             var settings = JSON.parse(settingsStringified);
       	     console.log("Background.js: Retrieved project key " + settings.projectKey + " and server " + settings.server);
             sendResponse({msg: settings});
       } else {
       	     console.log("Background.js: Settings does not exist");
             sendResponse({msg: "No Settings"});
       }
    }

    // Not existing condition
    sendResponse({msg: "Error usage. Either call set_settings or get_settings"});

  } 
);