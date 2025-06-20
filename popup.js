const detailsDiv = document.getElementById("details");
const logBtn = document.getElementById("logBtn");

chrome.storage.local.get("lastConsent", (data) => {
  if (data.lastConsent) {
    const { hostname, dataType, purpose } = data.lastConsent;
    detailsDiv.innerHTML = `
      <b>Org:</b> ${hostname}<br>
      <b>Data:</b> ${dataType}<br>
      <b>Purpose:</b> ${purpose}<br>
    `;
  } else {
    detailsDiv.innerText = "No recent consent detected.";
    logBtn.disabled = true;
  }
});

logBtn.addEventListener("click", () => {
  chrome.storage.local.get("lastConsent", (data) => {
    if (data.lastConsent) {
      const stored = JSON.parse(localStorage.getItem("consentLog") || "[]");

      // Check if consent for the same hostname + purpose already exists
      const alreadyExists = stored.some(entry =>
        entry.hostname === data.lastConsent.hostname &&
        entry.dataType === data.lastConsent.dataType &&
        entry.purpose === data.lastConsent.purpose
      );

      if (alreadyExists) {
        showMessage("🔁 Already Logged");
        return;
      }

      stored.push({
        ...data.lastConsent,
        timestamp: new Date().toISOString()
      });

      localStorage.setItem("consentLog", JSON.stringify(stored));
      showMessage("✅ Consent Logged");
    }
  });
});

function showMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.color = "green";
  msg.style.marginTop = "10px";
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 2500);
}


document.getElementById("viewHistoryBtn").addEventListener("click", () => {
  const historyDiv = document.getElementById("history");
  const stored = JSON.parse(localStorage.getItem("consentLog") || "[]");

  if (stored.length === 0) {
    historyDiv.innerHTML = "<i>No consents recorded yet.</i>";
    return;
  }

  historyDiv.innerHTML = "<h4>Consent History:</h4>";
  stored.forEach((entry, index) => {
    historyDiv.innerHTML += `
      <p>
        <b>${index + 1}. ${entry.hostname}</b><br/>
        Data: ${entry.dataType}<br/>
        Purpose: ${entry.purpose}<br/>
        Time: ${new Date(entry.timestamp).toLocaleString()}
      </p>
      <hr/>
    `;
  });
});
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  localStorage.removeItem("consentLog");
  document.getElementById("history").innerHTML = "<i>Consent history cleared.</i>";
});

document.getElementById("closeBtn").addEventListener("click", () => {
  window.close();
});