let btnStart = document.getElementById("btn-start");
btnStart.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true,  url: 'https://*.notoriousaliens.com/*' });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reloadPage,
  });
});

detectDumpsterPage()

async function detectDumpsterPage() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true,  url: 'https://*.notoriousaliens.com/*' });

  if(tab) {
    document.getElementById('nasa-defender-page-connect').remove();
  } else  {
    document.getElementById('btn-start').remove();
  }
}

function reloadPage() {
  window.location.reload();
}
