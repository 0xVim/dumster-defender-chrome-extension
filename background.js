chrome.webRequest.onSendHeaders.addListener((request) => {
    console.log(request);
    if (request.method === 'GET') {
        let authorization = request.requestHeaders.find(header => {
            return header.name === 'Authorization';
        });

        if (authorization) {
            setToken(authorization.value);
        }
    }
}, {
    urls: ["https://6v56radu08.execute-api.us-east-2.amazonaws.com/*",]
}, ["extraHeaders", "requestHeaders"]);

function setToken(token) {
    chrome.tabs.query({active: true, currentWindow: true, url: 'https://*.notoriousaliens.com/*'}, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {action: "render_button", token: token}, (response) => {
                console.log(response);
            });
        });
    });
}