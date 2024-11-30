chrome.contextMenus.onClicked.addListener(activateTimer);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Activate timer",
    contexts: ['selection'],
    id: 'silent'
  });
});

function activateTimer(event) {
    var hmsTime = extractTime(event.selectionText);
    var remainingSeconds = hmsTime.split(':').reduce((acc,time) => (60 * acc) + +time);
    console.log("Time to end: " + remainingSeconds);

    let timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            console.log(`Time left: ${remainingSeconds} seconds`);
            remainingSeconds--;
        } else {
            clearInterval(timerInterval); // Stop the timer
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../images/chef-kiss.png',
                title: 'Timer Alert',
                message: 'Your timer has finished!',
                requireInteraction: true
            });
        }
    }, 1000);
}

function extractTime(input) {
    // Regular expression to match HH:MM:SS format
    const timeRegex = /\b\d{1,2}:\d{2}:\d{2}\b/;
    const match = input.match(timeRegex);
    return match ? match[0] : null;
}