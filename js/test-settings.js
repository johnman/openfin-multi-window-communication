const message = document.getElementById("set-json");
const threshold = document.getElementById("set-threshold");
const messagemode = document.getElementById("set-messagemode");
const running = document.getElementById("running");

export function setTestSettings(thresholdInMs, messageToSend, mode) {
  const modeMap = {
    broadcast: "Broadcast Channel Direct",
    broadcastworker: "Broadcast Channel Via Shared Worker",
    iab: "OpenFin IAB Message Bus"
  };
  let mappedMode = modeMap[mode];
  message.innerText = JSON.stringify(messageToSend, undefined, 4);
  threshold.innerText = thresholdInMs;
  messagemode.innerText = mappedMode;
  running.style.display = "unset";
}

export function clearTestSettings() {
  message.innerText = "";
  threshold.innerText = "";
  messagemode.innerText = "";
  running.style.display = "none";
}
