(function () {
  const observer = new MutationObserver(() => {
    const popup = document.querySelector("[id*='cookie'], [class*='cookie']");
    if (popup) {
      chrome.runtime.sendMessage({
        type: "cookie_popup_detected",
        data: {
          hostname: window.location.hostname,
          dataType: "Cookies",
          purpose: "Analytics / Personalization"
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();