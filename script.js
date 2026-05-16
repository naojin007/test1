// Base Chain Explorer API
const BASE_API_URL = 'https://api.basescan.org/api';
const BASE_API_KEY = 'YourBasescanAPIKey'; // Basescan APIキーが必要

// グローバル変数
let currentWallet = '';

// DOM要素の取得
const walletInput = document.getElementById('walletInput');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const successMsgDiv = document.getElementById('successMsg');
const walletInfoDiv = document.getElementById('walletInfo');
const walletAddressDiv = document.getElementById('walletAddress');
const statsDiv = document.getElementById('stats');
const activitiesDiv = document.getElementById('activities');
const activityListDiv = document.getElementById('activityList');

// イベントリスナー
searchBtn.addEventListener('click', searchWallet);
walletInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWallet();
});

// ウォレット検索メイン関数
async function searchWallet() {
    const address = walletInput.value.trim();
    
    if (!address) {
        showError('ウォレットアドレスを入力してください');
        return;
    }

    // アドレス形式の簡易検証
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        showError('無効なウォレットアドレス形式です (0x... で始まる40文字の16進数)');
        return;
    }

    currentWallet = address;
    clearResults();
    showLoading();

    try {
        // APIから直接データ取得（APIキーがない場合はモックデータを使用）
        const transactions = await fetchTransactions(address);
        const balance = await fetchBalance(address);
        
        displayWalletInfo(address, balance, transactions);
        displayTransactions(transactions);
        
        showSuccessMsg('ウォレット情報を取得しました');
    } catch (error) {
        console.error('Error:', error);
        showError(`エラーが発生しました: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// トランザクション取得
async function fetchTransactions(address) {
    // 注：実際の使用にはBasescan APIキーが必要です
    // ここではモックデータを返しています
    return getMockTransactions(address);
}

// 残高取得
async function fetchBalance(address) {
    // 注：実際の使用にはBasescan APIキーが必要です
    // ここではモックデータを返しています
    return '2.5';
}

// モックデータ（デモ用）
function getMockTransactions(address) {
    const mockData = [
        {
            hash: '0x' + 'a'.repeat(64),
            from: address,
            to: '0x' + 'b'.repeat(40),
            value: '1.5',
            type: 'sent',
            token: 'ETH',
            time: new Date(Date.now() - 1 * 60 * 60 * 1000),
            status: 'Success'
        },
        {
            hash: '0x' + 'c'.repeat(64),
            from: '0x' + 'd'.repeat(40),
            to: address,
            value: '0.8',
            type: 'received',
            token: 'ETH',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'Success'
        },
        {
            hash: '0x' + 'e'.repeat(64),
            from: address,
            to: '0x' + 'f'.repeat(40),
            value: '100',
            type: 'contract',
            token: 'USDC',
            time: new Date(Date.now() - 5 * 60 * 60 * 1000),
            status: 'Success'
        },
        {
            hash: '0x' + '1'.repeat(64),
            from: address,
            to: '0x' + '2'.repeat(40),
            value: '2.2',
            type: 'sent',
            token: 'ETH',
            time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'Success'
        },
        {
            hash: '0x' + '3'.repeat(64),
            from: '0x' + '4'.repeat(40),
            to: address,
            value: '500',
            type: 'received',
            token: 'USDC',
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'Success'
        }
    ];
    return mockData;
}

// ウォレット情報を表示
function displayWalletInfo(address, balance, transactions) {
    walletAddressDiv.textContent = address;
    
    // 統計情報を計算
    const sent = transactions.filter(tx => tx.type === 'sent').length;
    const received = transactions.filter(tx => tx.type === 'received').length;
    const total = transactions.length;

    statsDiv.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">ETH残高</div>
            <div class="stat-value">${balance} ETH</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">送信済み</div>
            <div class="stat-value">${sent}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">受信済み</div>
            <div class="stat-value">${received}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">トランザクション数</div>
            <div class="stat-value">${total}</div>
        </div>
    `;
    
    walletInfoDiv.style.display = 'block';
}

// トランザクションを表示
function displayTransactions(transactions) {
    if (transactions.length === 0) {
        activityListDiv.innerHTML = '<div class="no-data">トランザクション履歴がありません</div>';
    } else {
        activityListDiv.innerHTML = transactions.map((tx, index) => `
            <div class="activity-item">
                <span class="activity-type ${tx.type}">${getTypeLabel(tx.type)}</span>
                <div class="activity-hash">
                    <a href="https://basescan.org/tx/${tx.hash}" target="_blank" rel="noopener noreferrer">
                        ${tx.hash}
                    </a>
                </div>
                <div class="activity-details">
                    <div class="activity-detail">
                        <span class="activity-detail-label">金額</span>
                        <span class="activity-detail-value">${tx.value} ${tx.token}</span>
                    </div>
                    <div class="activity-detail">
                        <span class="activity-detail-label">状態</span>
                        <span class="activity-detail-value">${tx.status}</span>
                    </div>
                    <div class="activity-detail">
                        <span class="activity-detail-label">時刻</span>
                        <span class="activity-detail-value">${formatTime(tx.time)}</span>
                    </div>
                    <div class="activity-detail">
                        <span class="activity-detail-label">相手先</span>
                        <span class="activity-detail-value">${shortenAddress(tx.type === 'sent' ? tx.to : tx.from)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    activitiesDiv.style.display = 'block';
}

// ヘルパー関数
function getTypeLabel(type) {
    const labels = {
        'sent': '送信',
        'received': '受信',
        'contract': 'コントラクト'
    };
    return labels[type] || type;
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '今ちょうど';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 30) return `${days}日前`;
    
    return date.toLocaleDateString('ja-JP');
}

function shortenAddress(address) {
    if (!address) return '-';
    return address.slice(0, 6) + '...' + address.slice(-4);
}

// UI制御関数
function showLoading() {
    loadingDiv.style.display = 'block';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccessMsg(message) {
    successMsgDiv.textContent = message;
    successMsgDiv.style.display = 'block';
    setTimeout(() => {
        successMsgDiv.style.display = 'none';
    }, 3000);
}

function clearResults() {
    errorDiv.style.display = 'none';
    successMsgDiv.style.display = 'none';
    walletInfoDiv.style.display = 'none';
    activitiesDiv.style.display = 'none';
}