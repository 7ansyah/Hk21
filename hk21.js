document.addEventListener('DOMContentLoaded', () => {
    const games = {
        1: {
            name: 'Riding Extreme 3D',
            appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
            promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
            eventsDelay: 21000,
            attemptsNumber: 22,
        },
        5: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
            eventsDelay: 20000,
            attemptsNumber: 10
        },
        4: {
            name: 'Cafe Dash',
            appToken: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            promoId: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11',
            timing: 20000, // 20 seconds
            attempts: 20,
        }
        6: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            eventsDelay: 20000,
            attemptsNumber: 10,
        },
        3: {
            name: 'MergeAway',
            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            eventsDelay: 20000,
            attemptsNumber: 10,
        },
        2: {
            name: 'Twerk Race 3D',
            appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            eventsDelay: 20000,
            attemptsNumber: 10,
        },
        7: {
            name: 'Polysphere',
            appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            eventsDelay: 20000,
            attemptsNumber: 16,
        },
		8: {
            name: 'Mow and Trim',
            appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            eventsDelay: 20000, // 20 seconds
            attemptsNumber: 20,
        },
        9: {
            name: 'Mud Racing',
            appToken: '8814a785-97fb-4177-9193-ca4180ff9da8',
            promoId: '8814a785-97fb-4177-9193-ca4180ff9da8',
            eventsDelay: 20000, // 20 seconds
            attemptsNumber: 20,
        },
    };

    const startBtn = document.getElementById('startBtn');
    const keyCountSelect = document.getElementById('keyCountSelect');
    const keyCountLabel = document.getElementById('keyCountLabel');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressLog = document.getElementById('progressLog');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');
    const gameSelect = document.getElementById('gameSelect');
    const copyStatus = document.getElementById('copyStatus');
    const previousKeysContainer = document.getElementById('previousKeysContainer');
    const previousKeysList = document.getElementById('previousKeysList');
    const telegramChannelBtn = document.getElementById('telegramChannelBtn');
    const logArea = document.getElementById('logArea'); // Ensure logArea is always visible

    // Ensure logArea is always visible
    logArea.style.display = 'block';

    // Function to log messages
    const logMessage = (message) => {
        logArea.value += message + '\n';
        logArea.scrollTop = logArea.scrollHeight; // Auto-scroll to the bottom
    };

    const initializeLocalStorage = () => {
        const now = new Date().toISOString().split('T')[0];
        Object.values(games).forEach(game => {
            const storageKey = `keys_generated_${game.name}`;
            const storedData = JSON.parse(localStorage.getItem(storageKey));
            if (!storedData || storedData.date !== now) {
                localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 0, keys: [] }));
            }
        });
    };

    const generateClientId = () => {
        const timestamp = Date.now();
        const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
        return `${timestamp}-${randomNumbers}`;
    };

    const login = async (clientId, appToken) => {
        const response = await fetch('https://api.gamepromo.io/promo/login-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appToken,
                clientId,
                clientOrigin: 'deviceid'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        return data.clientToken;
    };

    const emulateProgress = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/register-event', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId,
                eventId: generateUUID(),
                eventOrigin: 'undefined'
            })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.hasCode;
    };

    const generateKey = async (clientToken, promoId) => {
        const response = await fetch('https://api.gamepromo.io/promo/create-code', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promoId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate key');
        }

        const data = await response.json();
        return data.promoCode;
    };

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const delayRandom = () => Math.random() / 3 + 1;

    initializeLocalStorage();

   startBtn.addEventListener('click', async () => {
    const gameChoice = parseInt(gameSelect.value);
    const keyCount = parseInt(keyCountSelect.value);
    const game = games[gameChoice];
    const storageKey = `keys_generated_${game.name}`;
    const storedData = JSON.parse(localStorage.getItem(storageKey)) || { count: 0, keys: [] };

    keyCountLabel.innerText = `Number of keys: ${keyCount}`;

    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    progressLog.innerText = 'Starting... \n PLEASE WAIT 1 MINUTE';
    progressContainer.classList.remove('hidden');
    keyContainer.classList.add('hidden');
    generatedKeysTitle.classList.add('hidden');
    keysList.innerHTML = '';
    keyCountSelect.classList.add('hidden');
    gameSelect.classList.add('hidden');
    startBtn.classList.add('hidden');
    copyAllBtn.classList.add('hidden');
    startBtn.disabled = true;

    let progress = 0;
    const partialKeys = JSON.parse(localStorage.getItem('partial_generated_keys')) || [];
    
    const updateProgress = (increment, message) => {
        progress += increment;
        progressBar.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;
        progressLog.innerText = message;
    };
	
	downloadKeysBtn.addEventListener('click', () => {
        const savedKeys = JSON.parse(localStorage.getItem('partial_generated_keys')) || [];
        if (savedKeys.length === 0) {
            alert('No keys to download.');
            return;
        }

        const blob = new Blob([savedKeys.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keys.txt';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });

    document.getElementById('checkKeysBtn').addEventListener('click', () => {
        const savedKeys = JSON.parse(localStorage.getItem('partial_generated_keys')) || [];
        console.log('Recovered keys:', savedKeys);
        alert(`Recovered keys: \n${savedKeys.join('\n')}`);
    });

    const generateKeyProcess = async () => {
        const clientId = generateClientId();
        let clientToken;
        try {
            clientToken = await login(clientId, game.appToken);
        } catch (error) {
            alert(`Failed to login: ${error.message}`);
            startBtn.disabled = false;
            return null;
        }
        
        for (let i = 0; i < game.attemptsNumber; i++) {
            logMessage(`Attempt ${i + 1}: Sending request...`);
            await sleep(game.eventsDelay * delayRandom());

            const hasCode = await emulateProgress(clientToken, game.promoId);
            updateProgress(((100 / game.attemptsNumber) / keyCount), 'Emulating progress...');

            if (hasCode) {
                logMessage(`Attempt ${i + 1}: Request success. Code received.`);
                break;
            } else {
                logMessage(`Attempt ${i + 1}: Request failed. No code received.`);
            }
        }

        try {
            logMessage('Generating the key...');
            const key = await generateKey(clientToken, game.promoId);
            if (key) {
                partialKeys.push(key);
                localStorage.setItem('partial_generated_keys', JSON.stringify(partialKeys));
            }
            logMessage('Key generation successful.');
            updateProgress(30 / keyCount, 'Generating key...');
            return key;
        } catch (error) {
            logMessage(`Key generation failed: ${error.message}`);
            alert(`Failed to generate key: ${error.message}`);
            saveKeysToFile(partialKeys);
            return null;
        }
    };

    const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));

    if (keys.length > 1) {
        keysList.innerHTML = keys.filter(key => key).map(key =>
            `<div class="key-item">
                <input type="text" value="${key}" readonly>
                <button class="copyKeyBtn" data-key="${key}">Copy Key</button>
            </div>`
        ).join('');
        copyAllBtn.classList.remove('hidden');
    } else if (keys.length === 1) {
        keysList.innerHTML =
            `<div class="key-item">
                <input type="text" value="${keys[0]}" readonly>
                <button class="copyKeyBtn" data-key="${keys[0]}">Copy Key</button>
            </div>`;
    }

    saveKeysToFile(partialKeys);
    localStorage.removeItem('partial_generated_keys'); // Clean up after success

    startBtn.disabled = false;
    keyCountSelect.classList.remove('hidden');
    gameSelect.classList.remove('hidden');
    startBtn.classList.remove('hidden');
});

    document.getElementById('ShowKeysBtn').addEventListener('click', () => {
        const generatedCodesContainer = document.getElementById('generatedCodesContainer');
        const generatedCodesList = document.getElementById('generatedCodesList');
        generatedCodesList.innerHTML = ''; // Clear the list

        let codesGeneratedToday = [];

        Object.keys(games).forEach(key => {
            const game = games[key];
            const storageKey = `keys_generated_${game.name}`;
            const storedData = JSON.parse(localStorage.getItem(storageKey));

            if (storedData && storedData.keys && storedData.keys.length > 0) {
                codesGeneratedToday = codesGeneratedToday.concat(storedData.keys.map(code => {
                    return `<li>${game.name}: ${code}</li>`;
                }));
            }
        });

        if (codesGeneratedToday.length > 0) {
            generatedCodesList.innerHTML = codesGeneratedToday.join('');
        } else {
            generatedCodesList.innerHTML = '<li>No codes generated today.</li>';
        }

        generatedCodesContainer.style.display = 'block';
    });

});

function saveKeysToFile(keys) {
    const content = keys.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'generated_keys.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

