let walletAddress = "";

async function connectWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress = accounts[0];
    document.getElementById('wallet').innerText = `Connected: ${walletAddress}`;
    await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: walletAddress }),
    });
    loadLeaderboard();
  }
}

async function addPoints(points) {
  if (!walletAddress) return alert('Connect wallet first');
  await fetch('/add-points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet: walletAddress, points }),
  });
  loadLeaderboard();
}

async function claim() {
  if (!walletAddress) return alert('Connect wallet first');
  const res = await fetch('/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet: walletAddress }),
  });
  const data = await res.json();
  alert(data.status);
}

async function loadLeaderboard() {
  const res = await fetch('/leaderboard');
  const data = await res.json();
  const list = document.getElementById('leaderboard');
  list.innerHTML = data.map(d => `<li>${d.wallet.slice(0,6)}...${d.wallet.slice(-4)} - ${d.points} pts</li>`).join('');
}

document.getElementById('connectBtn').onclick = connectWallet;
