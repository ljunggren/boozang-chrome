var some = function(list, callback){
	for(var i = 0; i < list.length; i++){
		if(callback(list[i])) return true;
	}
	return false;
};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

    		// get some kind of XMLHttpRequest
    		var xhrObj = new XMLHttpRequest;
			//var xhrObj = createXMLHTTPObject();
			// open and send a synchronous request
			xhrObj.open('GET', "//va.boozang.com/ide?id=58c3158bcff3277db8d3f2e1", false);
			xhrObj.send('');
			// add the returned content to a newly created script tag
			var se = document.createElement('script');
			se.type = "text/javascript";
			se.text = xhrObj.responseText;

			//var content = "<script type='text/javascript' src='//api.boozang.com/ide?id=5805259759a13a375ba5ef33'></script>";		
			
			var doc = document.implementation.createHTMLDocument(""+(document.title || ""));
			doc.open();
			//var head = doc.createElement("head");
			doc.write('<html><head></head></html>');
			doc.getElementsByTagName('head')[0].appendChild(se);

			//doc.write(content);
			doc.close();

			//Doing this will activate all the modified scripts and the "old page" will be gone as the document is replaced
			document.replaceChild( document.importNode(doc.documentElement, true), document.documentElement);
    }
  }
);