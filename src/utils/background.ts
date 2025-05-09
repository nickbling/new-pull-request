// background.ts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'sendToSlack') {
        sendToSlack(message.payload).then((success) => {
            sendResponse({ success });
        });

        // Important: return true to indicate async response
        return true;
    }

    if (message.type === 'getSlackWebhook') {
        chrome.storage.sync.get(['slackWebhook'], (result) => {
            sendResponse({ webhook: result.slackWebhook ?? '' });
        });

        return true;
    }

    if (message.type === 'setSlackWebhook') {
        chrome.storage.sync.set({ slackWebhook: message.webhook }, () => {
            sendResponse({ success: true });
        });

        return true;
    }

    return false;
});

async function sendToSlack(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['slackWebhook'], async (result) => {
            const webhookUrl = result.slackWebhook;

            if (!webhookUrl || typeof webhookUrl !== 'string') {
                console.error('Slack webhook not found in storage.');
                return resolve(false);
            }

            try {
                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: message })
                });

                resolve(res.ok);
            } catch (err) {
                console.error('Failed to send to Slack:', err);
                resolve(false);
            }
        });
    });
}