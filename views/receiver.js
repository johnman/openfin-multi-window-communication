import { setTestSettings, clearTestSettings } from "../js/test-settings.js";

async function init() {
  const broadcastId = "MessageBroadcastChannel";
  const broadcastChannel = new BroadcastChannel(broadcastId);
  const publisherCommandChannel = new BroadcastChannel(
    "PublisherCommandChannel"
  );
  const count = document.getElementById("count");
  const thresholdExceededCount = document.getElementById(
    "threshold-exceeded-count"
  );
  const slowestMessage = document.getElementById("slowest-message");
  const fastestMessage = document.getElementById("fastest-message");
  const commonMessage = document.getElementById("common-message");
  const fastestExceededMessage = document.getElementById(
    "fastest-exceeded-message"
  );
  const commonExceededMessage = document.getElementById(
    "common-exceeded-message"
  );
  const averageMessage = document.getElementById("average-message");
  const timeStart = document.getElementById("time-start");
  const timeEnd = document.getElementById("time-end");
  const timeLength = document.getElementById("time-length");
  const notRunning = document.getElementById("not-running");
  const results = document.getElementById("results");
  const resetButton = document.getElementById("reset");
  const reset = () => {
    clearTestSettings();
    resetResults();
    notRunning.style.display = "unset";
    entries = [];
  };
  const resetResults = () => {
    results.style.display = "none";
    entries = [];
    exceededEntries = [];
    entriesExceedingThreshold = 0;
    slowestEntry = 0;
    fastestEntry = undefined;
    exceedFastestEntry = undefined;
    modeOfEntry = undefined;
    exceedModeOfEntry = undefined;
    testStart = undefined;
    count.innerText = "";
    thresholdExceededCount.innerText = "";
    slowestMessage.innerText = "";
    fastestMessage.innerText = "";
    commonMessage.innerText = "";
    fastestExceededMessage.innerText = "";
    commonExceededMessage.innerText = "";
    timeLength.innerText = "";
    timeStart.innerText = "";
    timeEnd.innerText = "";
    averageMessage.innerText = "";
  };

  resetButton.onclick = () => {
    reset();
  };

  let entries = [];
  let exceededEntries = [];
  let entriesExceedingThreshold = 0;
  let slowestEntry = 0;
  let exceedFastestEntry = undefined;
  let fastestEntry = undefined;
  let modeOfEntry = 0;
  let exceedModeOfEntry = 0;
  let thresholdLimit = 0;
  let testStart;

  if (window.fin !== undefined) {
    window.fin.InterApplicationBus.subscribe(
      { uuid: window.fin.me.uuid },
      broadcastId,
      (data) => {
        entries.push(Date.now() - data.time);
      }
    )
      .then(() => console.log("Subscribed to messaging test topic"))
      .catch((err) => console.log(err));
  }
  broadcastChannel.addEventListener("message", (event) => {
    entries.push(Date.now() - event.data.time);
  });

  publisherCommandChannel.addEventListener("message", (event) => {
    if (event.data.action === "start") {
      console.log("Start", event.data);
      notRunning.style.display = "none";
      setTestSettings(
        event.data.threshold,
        event.data.message,
        event.data.selectedMode
      );
      resetResults();
      thresholdLimit = parseInt(event.data.threshold, 10);
      testStart = event.data.startTime;
    } else if (event.data.action === "stop") {
      console.log("Stop", event.data);
      let testEnd = Date.now();
      let testLengthInMs = testEnd - testStart;
      let averagePerSecond = Math.round(
        (entries.length / testLengthInMs) * 1000
      );
      timeLength.innerText = testLengthInMs;
      timeStart.innerText = new Date(testStart).toUTCString();
      timeEnd.innerText = new Date(testEnd).toUTCString();
      averageMessage.innerText = averagePerSecond;
      count.innerText = entries.length;

      console.log(entries);
      results.style.display = "unset";

      let modeMapping = {};
      let greatestFrequency = 0;

      let exceedModeMapping = {};
      let exceedGreatestFrequency = 0;

      entries.forEach((entry) => {
        if (entry > slowestEntry) {
          slowestEntry = entry;
        }

        if (fastestEntry === undefined) {
          fastestEntry = entry;
        } else if (entry < fastestEntry) {
          fastestEntry = entry;
        }

        let modeMappingEntry = modeMapping[entry];
        let newModeMappingEntry = (modeMappingEntry || 0) + 1;
        modeMapping[entry] = newModeMappingEntry;

        if (greatestFrequency < newModeMappingEntry) {
          greatestFrequency = newModeMappingEntry;
          modeOfEntry = entry;
        }

        if (entry > thresholdLimit) {
          if (exceedFastestEntry === undefined) {
            exceedFastestEntry = entry;
          } else if (entry < exceedFastestEntry) {
            exceedFastestEntry = entry;
          }

          let exceedModeMappingEntry = exceedModeMapping[entry];
          let newExceedModeMappingEntry = (exceedModeMappingEntry || 0) + 1;
          exceedModeMapping[entry] = newExceedModeMappingEntry;

          if (exceedGreatestFrequency < newExceedModeMappingEntry) {
            exceedGreatestFrequency = newExceedModeMappingEntry;
            exceedModeOfEntry = entry;
          }

          entriesExceedingThreshold++;
          exceededEntries.push(entry);
        }
      });
      thresholdExceededCount.innerText = entriesExceedingThreshold;
      slowestMessage.innerText = slowestEntry;
      fastestMessage.innerText = fastestEntry;
      commonMessage.innerText = modeOfEntry;
      fastestExceededMessage.innerText =
        exceedFastestEntry === undefined ? "N/A" : exceedFastestEntry;
      commonExceededMessage.innerText =
        exceedModeOfEntry === undefined ? "N/A" : exceedModeOfEntry;

      console.log(
        "Entries exceeding limit of: " + thresholdLimit,
        exceededEntries
      );
    }
  });
}

init();
