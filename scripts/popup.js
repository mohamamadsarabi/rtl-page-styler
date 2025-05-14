const btn = document.getElementById("toggle");

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function updateUI() {
  const tab = await getCurrentTab();
  const domain = getDomain(tab.url);

  chrome.storage.local.get([domain], (result) => {
    const isActive = result[domain];
    btn.textContent = isActive ? "غیرفعال‌سازی " : "فعالسازی ";
  });
}

btn.addEventListener("click", async () => {
  const tab = await getCurrentTab();
  const domain = getDomain(tab.url);

  chrome.storage.local.get([domain], (result) => {
    const isActive = result[domain];
    const newState = !isActive;

    chrome.storage.local.set({ [domain]: newState }, () => {
      chrome.tabs.sendMessage(tab.id, { action: newState ? "enable" : "disable" });

      chrome.action.setIcon({
        tabId: tab.id,
        path: newState ? "iconRightToLeft.png" : "iconLeftToRight.png"
      });

      updateUI();
    });
  });
});

updateUI();
