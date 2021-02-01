let run = false;
let messageCount = 0;

export function publishMessage(publisher, data, runNow) {
  if (runNow !== undefined) {
    run = runNow;
    messageCount = 0;
  }
  if (run) {
    setTimeout(() => {
      data.time = Date.now();
      publisher(data);
      messageCount++;
      publishMessage(publisher, data);
    }, 0);
  }
}

export async function publishMessageAsync(publisher, data, runNow) {
  if (runNow !== undefined) {
    run = runNow;
    messageCount = 0;
  }
  if (run) {
    setTimeout(async () => {
      data.time = Date.now();
      await publisher(data);
      messageCount++;
      publishMessageAsync(publisher, data);
    }, 0);
  }
}

export function stopMessage() {
  run = false;
  return messageCount;
}
