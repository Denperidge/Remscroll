// Saving
document.getElementById("btnSave").addEventListener("click",function(e){
  try {
    chrome.tabs.executeScript({file: "GetScroll.js"}, function(data){
      var currentUrl = data[0][0];

      // Save scroll location
      var scrollLocation = data[0][1];
      var object = {};
      object[currentUrl] = scrollLocation;
      chrome.storage.local.set(object);

      // Save load button name
      var loadButtonName = document.getElementById("loadButtonName").value;
      if (loadButtonName != undefined)
      {
        var obj = {};
        obj[currentUrl + "loadButtonName"] = loadButtonName;
        chrome.storage.local.set(obj);
      }

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
            if (loadButtonName != "")
            {  // If a button has to be clicked
              // Search through spans, buttons and inputs to click it
              chrome.tabs.executeScript({code:
                'var spans = document.getElementsByTagName("span");' +
                'var buttons = document.getElementsByTagName("button");' +
                'var inputs = document.getElementsByTagName("input");' +
                'function RemScrollClick(nodelist){' +
                    'for (i=0; i < nodelist.length; i++)' +
                    '{\n' +
                        'if (nodelist[i].innerHTML.trim().toLowerCase() == "' + loadButtonName.trim().toLowerCase() + '")\n' +
                        '{ nodelist[i].click(); return true; }\n' +
                    '}' +
                    'return false;' +  // If true was not already returned, return false
                '}' +
                'if (RemScrollClick(spans) == false)' +
                    'if (RemScrollClick(buttons) == false)' +
                        'RemScrollClick(inputs);'
              });
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

window.addEventListener("load", function(e)
{
  chrome.tabs.query({currentWindow:true, active:true},function(tabs){
    var currentUrl = tabs[0].url;
    chrome.storage.local.get(currentUrl+"loadButtonName", function(loadButtonName)
    {
      if (loadButtonName[currentUrl+"loadButtonName"] == undefined) return;
      document.getElementById("loadButtonName").value =
        loadButtonName[currentUrl+"loadButtonName"];
      //chrome.storage.local.get(function(e){console.log(e);});
    });
  });
});
