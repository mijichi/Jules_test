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

    const displayHistory = () => {
        const history = getHistory();
        historyList.innerHTML = '';
        history.forEach(item => {
            const listItem = document.createElement('li');

            const itemDetails = document.createElement('div');
            itemDetails.className = 'history-item-details';

            const itemType = document.createElement('span');
            itemType.className = 'history-item-type';
            itemType.textContent = item.type;

            const itemInfo = document.createElement('span');
            itemInfo.textContent = ` | ${item.username} が打刻 | ${item.timestamp}`;

            itemDetails.appendChild(itemType);
            itemDetails.appendChild(itemInfo);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '削除';
            deleteButton.addEventListener('click', () => {
                deleteHistoryItem(item.id);
            });

            listItem.appendChild(itemDetails);
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
            timestamp: new Date().toLocaleString('ja-JP')
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
