let jwtToken = '';

chrome.runtime.sendMessage('ping', res => {

});

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.action === 'render_button') {
        response('Token received');
        token = message.token;
        renderButton(message.token);
    }
});

initMessageBar();

function renderButton(token) {
    const buttonExist = document.getElementById('yolo-dive');
    if (token && !buttonExist) {
        jwtToken = token;
        let messageBar = document.getElementById('nasa-defender-bar');
        let textInit = document.getElementById('nasa-defender-init-text');
        textInit.remove();
        messageBar.append(constructYoloButton());
    }
}

function initMessageBar() {
    let body = document.getElementsByTagName('body');
    let container = document.createElement('div');
    let textInit = document.createElement('span');
    textInit.id = "nasa-defender-init-text";
    textInit.innerText = 'Click on the extension (top right) to start.';

    container.id = 'nasa-defender-bar';
    container.style = 'padding: 0.5rem 0; text-align: center';
    container.append(textInit);
    body[0].prepend(container);
}

function constructYoloButton() {
    let button = document.createElement('button');
    button.className = 'btn-nasa-defender'
    button.innerText = 'YOLO Dive';
    button.id = 'yolo-dive';
    button.addEventListener('click', () => dive());

    return button;
}

function dive() {
    const yollar = parseInt(prompt('How much YOLLAR you gonna spend ser?'));
    if (!isNaN(yollar)) {
        const count = Math.floor(yollar / 100);
        if (count === 0) {
            alert('You are too poor ser!');
            return;
        }

        displayLoading();

        fetch('https://3lo0d7v5e9.execute-api.us-east-2.amazonaws.com/Prod/dive/paid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
            },
            body: JSON.stringify({'diveCount': count})
        })
            .then(res => res.json())
            .then(payload => {
                displayResult(payload);
            }).catch(err => {
            alert(err.message);
        });
    } else {
        alert('Give me a number ser!');
    }
}

function displayLoading() {
    let body = document.querySelector('body');
    let container = document.createElement('div');
    let btnClose = document.createElement('button');
    let loader = document.createElement('div')
    container.id = 'nasa-defender-result'
    container.style = 'width: 30rem;height: 15rem;position: fixed;top: 50%;left: 50%;margin-top: -7rem;margin-left: -15rem;background-color: white;z-index: 9;border-radius: 2rem;border: 0.5rem solid rgb(93, 100, 174);padding: 1rem;display: flex; flex-wrap: wrap;';
    container.append(btnClose);
    btnClose.style = 'color: #5D64AE; font-size: 1.5rem; float: right; border: none; background: none;position: absolute; right: 1rem;top: 1rem;';
    btnClose.innerText = 'X';
    btnClose.addEventListener('click', () => {
        container.remove();
        window.location.reload();
    });
    loader.id = 'nasa-defender-loader'
    loader.style = 'display: flex; margin: 0.3rem; margin-right: 0.5rem; align-items: center; color: darkgray;';
    loader.innerText = 'Loading...';
    container.append(loader);

    body.append(container);
}

function displayResult(payload) {
    let container = document.getElementById('nasa-defender-result');
    let loader = document.getElementById('nasa-defender-loader');
    let items = tabulateItems(payload);
    loader.remove();
    for (const item in items) {
        container.append(constructItem(item, items[item]));
    }
}

function tabulateItems(payload) {
    let items = {};

    if(payload.normal) {
        payload.normal.forEach((item) => {
            let key = item.name;
            let quantity = item.amount;
            if (items[key]) {
                items[key] = items[key] + quantity;
            } else {
                items[key] = quantity;
            }
        });
    }

    if(payload.special) {
        payload.special.forEach((item) => {
            let key = item.name;
            let quantity = item.amount;
            if (items[key]) {
                items[key] = items[key] + quantity;
            } else {
                items[key] = quantity;
            }
        });
    }

    return items;
}

function constructItem(item, quantity) {
    itemImage = '';
    switch (item) {
        case 'lettus':
            itemImage = 'https://www.notoriousaliens.com/static/lettuce-c76a94d92dfbf14cfeb89532e77742d2.png';
            break;
        case 'relish':
            itemImage = 'https://www.notoriousaliens.com/static/relish-3228c95a0088b8d6cdda3c42e5b585fc.png';
            break;
        case 'cheese':
            itemImage = 'https://www.notoriousaliens.com/static/cheese-b6e96419d8cf24b659c49cf22b3a6c1d.png';
            break;
        case 'ketchup':
            itemImage = 'https://www.notoriousaliens.com/static/ketchup-b383f99f6462718e8fe6fa1dd0aac22a.png';
            break;
        case 'patty':
            itemImage = 'data:image/png;base64,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';
            break;
        case 'tomato':
            itemImage = 'https://www.notoriousaliens.com/static/tomato-ab30b98a14510c039ef679e0ffae27cd.png';
            break;
        case 'bun':
            itemImage = 'https://www.notoriousaliens.com/static/bun-7c586b1bb8d8615c2d9d995839e3227d.png';
            break;
        case 'yollar':
            itemImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAhGSURBVHgBxVdpbFxnFT1vn/dm5o1niR3bY3u8xakTN4lRQjaytBFqRYMCqBKibQphS38QJISECv2BgF9IgISE2GklikQVCUUoILVSGrXUTRtky3HjOnbiJV7G9nj27b03b+POjG0lpGnCL5709I09n7/z3XPPPfca+D88zMNseu5gU+PuXe6zvTHzhN9n7mZYNwjWsV0bi7rG3EhnmQsXXve9df7q6uzDnPexoJ/ti/i/9kLnj7Z3zJzbuiXH2rYN3QCyORaWzSAUsOFV3NopmYyIsRvCW/94U/7O715Pjnzcudz9vji1vTV89lu+oSOfmDqpeErM9C0OU2Mc9AyHiOzAxzlIxjkU1hgsL/OIRCxs7zVjgwP6NyOiX7h8zbiM/yXSbzzV3/7VMwNv9Df+ra9QcjB6RUB/m4HmmAveQ3/Eohbp5AwPlnXBOCyCoglaoG6h7wUX/3rP8+cnvqs/TwDuA0F//+OnO088tfdyi/3rjmxmHlcuCTgyqMPfTLTw9T26BkxOcTAECT2DB+BRw0iM/RMtahG5LIOSyyLaauPf18RXDp2tnMF/AbN3/vDyL87GvnD61OWO0HSHrS9g+KqAQzt1JHQRS2siEikWpsUguQqUygwkorgaOqsehiW2AAKDyFYXzUEbWonBwcHKl4d+K/0M98vpsWPH+BfOHB2OtjfGrPlfIb5aQH6RaPSpaN/zGERvIxwrg7lFB6ri4NY0i8YmC7lUHEZxDT4vXWppDWEC5IX12IjH9qh9YE+XrP/1kjV0T6Tf+/q+5/t2botBn4VprGFpkQPP2yiULWiFBCS1BXxgAIqqIGtxdCaDdBGwDRMskwPX0IUywrCsesYkiTDXST36SeMnP/2KMngPaKwn9v3q6panYTsWChkGItGnuBrmJ69jcXIIFctEMLqX3gNo3hHBUpKHblG06RxS8WV0d0eQLoj1UwmbJR5dE2hQHf7oQfPnd4G+ePrwtt7t3V01UKLQoaqXGBs9PS4qGn2uGCgsr2BuagrpxCxdykV79wAG9rQhmZeRolRE1DLhuChoIhimrvDqytLquhwGHrGO/uCLDcc2QJnDxw90cXxdmo5t1hLikEY8MrBr0EUq7SA+D3T6s1iYiWNsZBgri9epNNqwY9/T6N/ZDIFjSVMhKF4Fq2v8Zk6rL8OIkKnUTp4oV5WMKpLLiny/S5RWyimKlK/tpGDgErBEwEeOO1icreDqiIDWrSZKDuUzkYCYT0GmCHt3PQvBvU2qLIKXCygn0xRdPdJ6UVIgrA+qT3tsAxSCAJ+pZZFLxlFKAmHiRPBUo64Dc6TG9m7A32BidJjFlhADrx9YLFG9jl+Hlp9DV3cb/GoEvkgnPM4tlEmACllklWaKhEC9iATLrZ9/NBSt5VTPJ43Ewk3MTU9jZjpL/sqjwlG0dMHqu/EEw8CBIw5SeRezMwxUcqGQ3wHPpLA4dwvzM+MkNgmpgoJkhqtTvGELjEygNrZstffX6nR3l6c3FGBOrcbjVCakWmYZ4VAZJfJVf4CsT1qnqkoNcdNBdsgSBdeu82hqIaGRVWkVBxyjwcPl4ZUcCES1IrvrOa3SGQVjJ6gpSO/UIt3R3zq6srxKpi2AZw1IoT6EIizmSRB2pU7xpiLXVRnroVzvM5GedyHytMlykScGGCsOQYnAdDwwKlXprt+WVWqL6rOlGugrL1+Zj0YZu6LlSVU8XN82MEoApsyilGfIANYFwd5tos1R4PhRcqcPOTSFDajUfbJ5E8OjKQRCMjSTxMARmRxRxcm1Q2QJazXQ81cW0x9+sDwUCKnUHynHiXncnGjA4B4DY7MiTB21EsLGe8cj0/7GCBAQ3Rr1vKBgYFcnEhkVCytsPR8ydQtWqLnF5Lw8t+lIyaz4F1kqwefJoEjtTBCDdC8Ozd025pdE2Hp9X5XqDYFUP68uc4g12cjrAjRbJbvcTl2nFW2xJrS0csRYkG7UBygSVvM++3Ofab21afjNkjAejZrPeCQ2aGglyo+FTNZBV0cBM3GR6pAlUdmbRV9lmwSLMtGfJsCKpKKhqReBcDsZAYEZ08gXyvCHW6nWdsPlaZJxKte6u6N/3wQdnctanQFpoj3KPaeX12BWMtB0BoWci539GkanZHhFD1S/sZnYYp6Ab5NyGYGadwM6evdD8njg6tSeSuMwTAW+QJTKrghXm8D0nO8Pjao8fNe48vYH+en9/bIS9BcPaUSnQWXgklSLBbLDnRriSYGMggzAS793qsUPzMyykPw2SpoLv5yHXZpAammGZqYKtb4wWE8LzNx7GBmxZnb09r7Iaf74PTPSxXdyl/b2yIMNgUqfLNnI0iSQokEsnWbxSJ9Gn3Ws5ZrAio3wkyvxTAXj1Fu93goMLUcWlyNN8Ojo6iZLbEIl9y7SWS0+Nt7wxK5HA0sYEK2PHMwE3nexUXWOC4IV5ain0hAEg5zs9hIJK+IiFCyiSOWVLGyB2tgEvyjCMTiUzTDltIPMYyupPQGDKF5YZhbever59Jd++PgUbrfbaHnNuu8I+uSTPdLjXYnzLY3GyXLFhWkyNIw5tXVLkEVvjEF7W93RqaXCcqom4VK30cFTKKspnlQvvXbhIs795o1ioqZ88g7KlvvAYfvbp9pe6u7KvCRJulQus2R11Nh9ZHmkJsPkyWE4BLzUIKhOHYtFhcxpakZYmZhiz/3xzfT5jzqTexDo+zfyb0ua8qqiCAHGtZVI2I14ZYZ6rQCvzFN0PE2JMsoF3s3lhfcnb7K/HLkinH71amr0fmc+1L8Vdz7PfCrUv3cQOxib2SbLjCpKnL264s5NTjgX/zREvfEhnv8AzDB8RpkRQPcAAAAASUVORK5CYII=';
            break;
        case 'nothing':
            itemImage = 'data:image/png;base64,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';
            break;
        case 'labKey':
            itemImage = 'https://www.freeiconspng.com/thumbs/key-icon/key-icon-4.png';
            break;
        default:
            itemImage = 'data:image/png;base64,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';
    }

    let container = document.createElement('div');
    let text = document.createElement('span');
    container.style = 'display: flex; margin: 0.3rem; margin-right: 0.5rem; align-items: center;';
    text.innerText = quantity;
    text.style = 'color: darkgray;';

    if (itemImage) {
        let image = document.createElement('img');
        image.src = itemImage;
        image.style = 'width: 2rem;';
        container.append(image);
    }

    container.append(text);
    return container;
}
