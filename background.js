  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({version: '0.1'}, function() {
      console.log('This is the very experimental version of CF Friendly Print');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'codeforces.com'},
          })
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }]);
    });
  });
