document.addEventListener('DOMContentLoaded', () => {
    // Clear localStorage to start fresh
    localStorage.clear();

    const games = {
        1: {
            name: 'Zoopolis',
            appToken: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            promoId: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            timing: 30000, // 20 seconds
            attempts: 30,
        },
        2: {
            name: 'Fluff Crusade',
            appToken: '112887b0-a8af-4eb2-ac63-d82df78283d9',
            promoId: '112887b0-a8af-4eb2-ac63-d82df78283d9',
            timing: 40000, // 40 seconds
            attempts: 40,
        },
        3: {
            name: 'Tile Trio',
            appToken: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7',
            promoId: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7',
            timing: 30000, // 20 seconds
            attempts: 30,
        },
        4: {
            name: 'Mow and Trim',
            appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            timing: 30000, // 20 seconds
            attempts: 30,
        },
        5: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
            timing: 40000, // 30 seconds
            attempts: 40,
        },
        6: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            timing: 40000, // 30 seconds
            attempts: 40,
        },
        7: {
            name: 'Merge Away',
            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            timing: 40000, // 30 seconds
            attempts: 40,
        },
        8: {
            name: 'Twerk Race 3D',
            appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            timing: 40000, // 30 seconds
            attempts: 40,
        },
        9: {
            name: 'Polysphere',
            appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            timing: 30000, // 20 seconds
            attempts: 30,
        },
        10: {
            name: 'Stone Age',
            appToken: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af',
            promoId: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af',
            timing: 40000, // 40 seconds
            attempts: 40,
        }
    };

    // Initialize UI elements
    const startBtn = document.getElementById('startBtn');
    const keyCountSelect = document.getElementById('keyCountSelect');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressLog = document.getElementById('progressLog');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const gameSelect = document.getElementById('gameSelect');
    const copyStatus = document.getElementById('copyStatus');
    const logArea = document.getElementById('logArea');
    const downloadKeysBtn = document.getElementById('downloadKeysBtn');
    const previousKeysContainer = document.getElementById('previousKeysContainer');
    const previousKeysList = document.getElementById('previousKeysList');
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');

    // Initialize localStorage with fresh data
    const initializeLocalStorage = () => {
        const now = new Date().toISOString().split('T')[0];
        Object.values(games).forEach(game => {
            const storageKey = `keys_generated_${game.name}`;
            localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 0, keys: [] }));
        });
    };

    // Initialize fresh state on page load
    initializeLocalStorage();

    // Ensure logArea is always visible
    logArea.style.display = 'block';

    // Function to log messages
    const logMessage = (message) => {
        logArea.value += message + '\n';
        logArea.scrollTop = logArea.scrollHeight; // Auto-scroll to the bottom
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

    startBtn.addEventListener('click', async () => {
        const gameChoice = parseInt(gameSelect.value);
        const keyCount = parseInt(keyCountSelect.value);
        const game = games[gameChoice];
        const storageKey = `keys_generated_${game.name}`;
        const storedData = JSON.parse(localStorage.getItem(storageKey)) || { count: 0, keys: [] };

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

        try {
            const clientId = generateClientId();
            const clientToken = await login(clientId, game.appToken);

            for (let i = 0; i < game attemptsNumber; i++) {
                updateProgress(100 / keyCount, `Generating key ${i + 1} of ${keyCount}...`);
                let hasCode = false;

                for (let attempt = 0; attempt < game.attemptsNumber; attempt++) {
                    hasCode = await emulateProgress(clientToken, game.promoId);
                    if (hasCode) {
                        logMessage(`Progress event ${attempt + 1} of ${game.attemptsNumber} triggered`);
                        await sleep(game.eventsDelay * delayRandom());
                    } else {
                        logMessage(`Failed to trigger event ${attempt + 1}, retrying...`);
                    }
                }

                if (!hasCode) {
                    throw new Error(`Failed to trigger enough events to unlock the key after ${game.attemptsNumber} attempts.`);
                }

                const promoCode = await generateKey(clientToken, game.promoId);
                storedData.count += 1;
                storedData.keys.push(promoCode);
                localStorage.setItem(storageKey, JSON.stringify(storedData));
                partialKeys.push(promoCode);
                localStorage.setItem('partial_generated_keys', JSON.stringify(partialKeys));
                keysList.innerHTML += `<li>${promoCode}</li>`;
                updateProgress(100 / keyCount, `Key ${i + 1} generated: ${promoCode}`);
                await sleep(game.eventsDelay * delayRandom());
            }

            // Update the UI after all keys are generated
            progressLog.innerText = 'All keys generated successfully.';
            keyContainer.classList.remove('hidden');
            generatedKeysTitle.classList.remove('hidden');
            copyAllBtn.classList.remove('hidden');
            downloadKeysBtn.classList.remove('hidden');
            previousKeysContainer.classList.add('hidden');
            localStorage.removeItem('partial_generated_keys');
        } catch (error) {
            logMessage(`Error: ${error.message}`);
        } finally {
            progressBar.style.width = '100%';
            progressText.innerText = '100%';
            progressLog.innerText += '\nProcess complete.';
            startBtn.disabled = false;
            startBtn.classList.remove('hidden');
            keyCountSelect.classList.remove('hidden');
            gameSelect.classList.remove('hidden');
        }
    });

    // Copy all keys to clipboard
    copyAllBtn.addEventListener('click', () => {
        const keys = storedData.keys.join('\n');
        navigator.clipboard.writeText(keys).then(() => {
            copyStatus.innerText = 'Copied all keys!';
            setTimeout(() => {
                copyStatus.innerText = '';
            }, 2000);
        });
    });

    // Download all keys as a text file
    downloadKeysBtn.addEventListener('click', () => {
        const keysText = storedData.keys.join('\n');
        const blob = new Blob([keysText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${game.name}_keys.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Display previously generated keys
    const displayPreviousKeys = () => {
        Object.values(games).forEach(game => {
            const storageKey = `keys_generated_${game.name}`;
            const storedData = JSON.parse(localStorage.getItem(storageKey));
            if (storedData && storedData.keys.length > 0) {
                previousKeysContainer.classList.remove('hidden');
                const li = document.createElement('li');
                li.innerText = `${game.name}: ${storedData.keys.length} keys generated.`;
                previousKeysList.appendChild(li);
            }
        });
    };

    displayPreviousKeys();
});

