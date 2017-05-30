// Saving
document.getElementById("btnSave").addEventListener("click",function(e){
  try {
    chrome.tabs.executeScript({file: "GetScroll.js"}, function(data){
      var currentUrl = data[0][0];
      var scrollLocation = data[0][1];
      var object = {};
      object[currentUrl] = scrollLocation;
      chrome.storage.local.set(object);

      document.getElementById("pStatus").innerHTML = "Scroll location saved!"
    });
  }
  catch (e) {
    document.getElementById("pStatus").innerHTML = "Error whilst saving scroll location: " + e.message;
  }
});

// Setting
document.getElementById("btnScroll").addEventListener("click",function(e){
  try {
    chrome.tabs.query({currentWindow:true, active:true},function(tabs){
      var currentUrl = tabs[0].url;
      chrome.storage.local.get(currentUrl, function(data){
        var scrollLocation = data[currentUrl];
        var scrollCode = "document.body.scrollTop = " + scrollLocation;
        chrome.tabs.executeScript({code: scrollCode});

		    // MODIFIED CODE FROM SAVING,GETTING SCROLL LOCATION
		    chrome.tabs.executeScript({file: "GetScroll.js"}, function(data){
          var currentUrl = data[0][0];
			    var currentScroll = data[0][1];
			    if (currentScroll != scrollLocation)
          {  // If the current scroll location is less than the desired
            var loadButtonName = document.getElementById("loadButtonName").value;
            if (loadButtonName != null)
            {  // If a button has to be clicked
              chrome.tabs.executeScript({code:"document.getElementById(" + loadButtonName +"\").click();"});
              chrome.tabs.executeScript({code:"document.getElementsByClassName(\"" + loadButtonName + "\")[0].click();"});
            }

            setTimeout(document.getElementById("btnScroll").click(), 1000);  // Scroll again, don't update status
          }
          else
          {
            document.getElementById("pStatus").innerHTML = "Scroll location set!";  // If the correct scrollLocation is achieved, update status
          }

		    });
      });
    });
  }
  catch (e) {
    document.getElementById("pStatus").innerHTML = "Error whilst setting scroll location: " + e.message;
  }
});
