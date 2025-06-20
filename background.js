chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "cookie_popup_detected") {
    chrome.storage.local.set({
      lastConsent: msg.data
    });
  }
});