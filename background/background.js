// background.js

// Called when the user clicks on the browser action.

  // Send a message to the active tab


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  } 
);
