import { setTestSettings, clearTestSettings } from "../js/test-settings.js";
import {
  publishMessage,
  publishMessageAsync,
  stopMessage
} from "../js/messaging.js";

async function publisher() {
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const open = document.getElementById("open");
  const openView = document.getElementById("open-view");
  const total = document.getElementById("total");
  const windowCount = document.getElementById("window-count");
  const sample = document.getElementById("sample");
  const threshold = document.getElementById("threshold");
  const iabMode = document.getElementById("iab-mode");
  const notRunning = document.getElementById("not-running");
  const results = document.getElementById("results");
  const broadcastId = "MessageBroadcastChannel";
  const worker = new SharedWorker("../workers/shared-worker.js", {
    type: "module"
  });

  const publisherCommandChannel = new BroadcastChannel(
    "PublisherCommandChannel"
  );

  const broadcastChannel = new BroadcastChannel(broadcastId);

  let selectedMode;
  let url = window.location.href.replace("publisher", "receiver");

  worker.port.start();

  worker.port.addEventListener("message", async (event) => {
    console.log(event);
    if (event.data !== undefined && event.data.messagesSent !== undefined) {
      total.innerText = event.data.messagesSent;
    }
  });

  start.onclick = () => {
    const modeOptions = document.getElementsByName("messagemode");
    const message = JSON.parse(sample.value);
    const messageThreshold = parseInt(threshold.value, 10);
    results.style.display = "none";
    stop.style.display = "unset";
    start.style.display = "none";

    for (let i = 0; i < modeOptions.length; i++) {
      if (modeOptions[i].checked) {
        selectedMode = modeOptions[i].value;
        break;
      }
    }
    // configure the receivers
    // we send a message to the receivers and then kick off the publishing after a delay
    let publishDelay = 500;
    let publishStart = Date.now() + publishDelay;

    let request = {
      action: "start",
      selectedMode,
      threshold: messageThreshold,
      startTime: publishStart,
      message
    };

    publisherCommandChannel.postMessage(request);

    setTestSettings(messageThreshold, message, selectedMode);
    notRunning.style.display = "none";

    // give a pause for the command to reach all windows
    setTimeout(() => {
      action("start-" + selectedMode, {
        message: message
      });
      start.disabled = true;
    }, publishDelay);
  };

  stop.onclick = () => {
    start.disabled = false;
    publisherCommandChannel.postMessage({ action: "stop" });
    clearTestSettings();
    notRunning.style.display = "unset";
    stop.style.display = "none";
    start.style.display = "unset";
    results.style.display = "unset";
    action("stop-" + selectedMode);
  };

  open.onclick = () => {
    let count = parseInt(windowCount.value, 10);
    for (let i = 0; i < count; i++) {
      window.open(url, "_blank");
    }
  };

  if (window.fin !== undefined) {
    iabMode.style.display = "unset";
    if (window.fin.me.isView) {
      const platform = window.fin.Platform.getCurrentSync();

      openView.style.display = "unset";
      openView.onclick = async () => {
        let windowIdentity = (await window.fin.me.getCurrentWindow()).identity;
        let count = parseInt(windowCount.value, 10);

        for (let i = 0; i < count; i++) {
          platform
            .createView(
              {
                url
              },
              windowIdentity
            )
            .then(console.log)
            .catch((err) => console.log(err));
        }

        setTimeout(() => {
          window.fin.me.focus();
        }, 2000);
      };
    }
  }

  function action(id, options) {
    if (id === "start-broadcastworker") {
      if (worker !== undefined) {
        worker.port.postMessage({ action: "start", options });
      }
      return;
    }
    if (id === "stop-broadcastworker") {
      if (worker !== undefined) {
        worker.port.postMessage({ action: "stop", options });
      }
      return;
    }

    if (id === "start-broadcast") {
      let data = {
        message: options.message
      };
      let run = true;
      publishMessage(
        (data) => {
          data.time = Date.now();
          broadcastChannel.postMessage(data);
        },
        data,
        run
      );
      return;
    }

    if (id === "start-iab" && window.fin !== undefined) {
      let data = {
        message: options.message
      };
      let run = true;
      publishMessageAsync(
        async (data) => {
          data.time = Date.now();
          return window.fin.InterApplicationBus.publish(broadcastId, data);
        },
        data,
        run
      );
      return;
    }

    if (id === "stop-broadcast" || id === "stop-iab") {
      total.innerText = stopMessage();
    }
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await publisher();
});
