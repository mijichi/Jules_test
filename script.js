document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const clockInButton = document.getElementById('clock-in');
    const clockOutButton = document.getElementById('clock-out');
    const messageArea = document.getElementById('message-area');
    const updateHistoryButton = document.getElementById('update-history');
    const historyList = document.getElementById('history-list');

    const getHistory = () => {
        const history = localStorage.getItem('timecardHistory');
        return history ? JSON.parse(history) : [];
    };

    const saveHistory = (history) => {
        localStorage.setItem('timecardHistory', JSON.stringify(history));
    };

    const formatTimestamp = (date) => {
        const Y = date.getFullYear();
        const M = String(date.getMonth() + 1).padStart(2, '0');
        const D = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${Y}/${M}/${D} ${h}:${m}:${s}`;
    };

    const displayHistory = () => {
        const history = getHistory();
        historyList.innerHTML = '';
        history.forEach(item => {
            const listItem = document.createElement('li');

            const itemContent = document.createElement('div');
            itemContent.className = 'history-item-content';

            const itemType = document.createElement('div');
            itemType.className = 'history-item-type';
            itemType.textContent = item.type;

            const itemInfo = document.createElement('div');
            itemInfo.className = 'history-item-info';
            itemInfo.textContent = `${item.username} が打刻`;

            const itemTimestamp = document.createElement('div');
            itemTimestamp.className = 'history-item-timestamp';
            itemTimestamp.textContent = item.timestamp;

            itemContent.appendChild(itemType);
            itemContent.appendChild(itemInfo);
            itemContent.appendChild(itemTimestamp);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', () => {
                deleteHistoryItem(item.id);
            });

            listItem.appendChild(itemContent);
            listItem.appendChild(deleteButton);
            historyList.appendChild(listItem);
        });
    };

    const addHistoryItem = (type) => {
        const username = usernameInput.value.trim();
        if (!username) {
            messageArea.textContent = 'ユーザー名を入力してください。';
            return;
        }

        const history = getHistory();
        const newItem = {
            id: Date.now(),
            username,
            type,
            timestamp: formatTimestamp(new Date())
        };

        history.push(newItem);
        saveHistory(history);
        displayHistory();
        messageArea.textContent = `${username}さんの${type}を記録しました。`;
        usernameInput.value = '';
    };

    const deleteHistoryItem = (id) => {
        let history = getHistory();
        history = history.filter(item => item.id !== id);
        saveHistory(history);
        displayHistory();
    };

    clockInButton.addEventListener('click', () => addHistoryItem('出勤'));
    clockOutButton.addEventListener('click', () => addHistoryItem('退勤'));
    updateHistoryButton.addEventListener('click', displayHistory);

    displayHistory();
});
