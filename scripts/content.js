function applyRTL() {
  document.body.style.direction = "rtl";
  document.body.style.textAlign = "right";
  const fontUrl = chrome.runtime.getURL("fonts/YekanBakh-VF.ttf");

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'YekanBakh';
      src: url(${fontUrl});
    }
    * {
      font-family: 'YekanBakh', sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

function resetStyles() {
  document.body.style.direction = "";
  document.body.style.textAlign = "";
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enable") {
    applyRTL();
  } else if (request.action === "disable") {
    resetStyles();
  }
});

(async function checkAutoApply() {
  const domain = getDomain(window.location.href);
  chrome.storage.local.get([domain], (result) => {
    if (result[domain]) {
      applyRTL();
    }
  });
})();
