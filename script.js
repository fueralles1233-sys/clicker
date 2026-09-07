// ===== 🎮 STARDANCE CLICKER - ULTIMATE EDITION =====
// Perfektioniertes Balancing, Achievements, Combos, Events & Premium Juice!

const STORAGE_KEY = 'stardance-clicker-ultimate-v3';
const AUTO_SAVE_INTERVAL = 2000;
const PASSIVE_INCOME_INTERVAL = 1000;

// ===== BALANCING CONSTANTS =====
const BASE_CLICK_POWER = 3;
const CLICK_UPGRADE_MULTIPLIER = 1.35; // +15% pro Upgrade (schneller Progression)
const BASE_UPGRADE_COST = 10; // Start sehr niedrig!
const OFFICE_CPS = 1.5; // Office gibt 0.5 pro Sekunde (langfristig attraktiv)
const OFFICE_BASE_COST = 25; // Günstig starten
const OFFICE_SCALE = 1.12; // Skaliert mit 12%
const REBIRTH_COST_START = 1000; // Erste Rebirth mit realistischem Goal
const REBIRTH_POWER_BONUS = 0.25; // 25% pro Rebirth (nicht zu OP)

// ===== SKINS (10 verschiedene!) =====
const SKINS = [
    { id: 'cyan-neon', name: 'triple t', desc: 'Cyberspace Start', p: '#3b2200', s: '#6b4600', a: '#804d00' },
    { id: 'hot-pink', name: 'tung tung tung sahur', desc: 'Dance Energy', p: '#965000', s: '#967300', a: '#aa0077' },
    { id: 'gold', name: 'tralalero tralala', desc: 'Premium Vibes', p: '#00b7ff', s: '#1900a5', a: '#753f00' },
    { id: 'purple', name: 'Purple Nigh', desc: 'Cosmic', p: '#b300ff', s: '#8800cc', a: '#6600aa' },
    { id: 'green', name: 'Neon Green', desc: 'Matrix Mode', p: '#00ff41', s: '#00dd00', a: '#00aa00' },
    { id: 'mint', name: 'Mint Fresh', desc: 'Cool Vibes', p: '#00ffaa', s: '#00dd88', a: '#00aa66' },
    { id: 'sunset', name: 'Sunset', desc: 'Warm & Cozy', p: '#ff6b35', s: '#ff4500', a: '#dd2200' },
    { id: 'ice-blue', name: 'Ice Blue', desc: 'Frozen Dance', p: '#00d4ff', s: '#0088ff', a: '#0055dd' },
    { id: 'magenta', name: 'Deep Magenta', desc: 'Mystery', p: '#ff00ff', s: '#dd00dd', a: '#aa00aa' },
    { id: 'neon-yellow', name: 'Neon Yellow', desc: 'Electric', p: '#ffff00', s: '#ffdd00', a: '#ffbb00' }
];

// ===== ACHIEVEMENTS (10!) =====
const ACHIEVEMENTS = [
    { id: 'first-click', name: '🎬 Erster Auftritt', desc: 'Mache deinen ersten Klick', check: () => gameState.totalClicks >= 1, bonus: 0.05 },
    { id: 'hundred-clicks', name: '💯 100 Klicks', desc: 'Mache 100 Klicks', check: () => gameState.totalClicks >= 100, bonus: 0.05 },
    { id: 'thousand-earned', name: '🎯 1.000 Sterne', desc: 'Verdiene 1.000 Sterne', check: () => gameState.totalEarned >= 1000, bonus: 0.05 },
    { id: 'first-upgrade', name: '⚡ Power Up', desc: 'Kaufe dein erstes Upgrade', check: () => gameState.clickUpgrades >= 1, bonus: 0.05 },
    { id: 'first-office', name: '🏢 Geschäftlich', desc: 'Kaufe dein erstes Tanzbüro', check: () => gameState.offices >= 1, bonus: 0.05 },
    { id: 'millionaire', name: '💰 Millionär', desc: 'Verdiene 1.000.000 Sterne', check: () => gameState.totalEarned >= 1000000, bonus: 0.10 },
    { id: 'first-rebirth', name: '🎭 Karriere-Wechsel', desc: 'Erlebe deine erste Karriere', check: () => gameState.rebirths >= 1, bonus: 0.10 },
    { id: 'collector', name: '🎨 Kunstsammler', desc: 'Sammle 5 verschiedene Skins', check: () => gameState.ownedSkins.length >= 5, bonus: 0.05 },
    { id: 'combo-master', name: '🔥 Combo Master', desc: 'Erreiche 50er Combo', check: () => gameState.maxCombo >= 50, bonus: 0.10 },
    { id: 'ultimate-player', name: '⭐ Ultimate Player', desc: 'Verdiene 100 Millionen', check: () => gameState.totalEarned >= 100000000, bonus: 0.15 }
];

// ===== GAME STATE =====
let gameState = {
    score: 0,
    totalEarned: 0,
    totalClicks: 0,
    clickPower: BASE_CLICK_POWER,
    clickUpgrades: 0,
    nextUpgradeCost: BASE_UPGRADE_COST,
    offices: 0,
    nextOfficeCost: OFFICE_BASE_COST,
    rebirths: 0,
    autoClickerEnabled: false,
    ownedSkins: ['cyan-neon'],
    selectedSkin: 'cyan-neon',
    currentCombo: 0,
    maxCombo: 0,
    unlockedAchievements: [],
    playTimeSeconds: 0,
    startTime: Date.now(),
    lastClickTime: 0,
    goldenClickActive: false,
    goldenClickEndTime: 0
};

// ===== DOM CACHE =====
const DOM = {
    score: document.getElementById('score'),
    cps: document.getElementById('cps'),
    clickBtn: document.getElementById('click-btn'),
    careerName: document.getElementById('career-name'),
    careerLevel: document.getElementById('career-level'),
    autoClickerToggle: document.getElementById('auto-clicker-toggle'),
    statsToggle: document.getElementById('stats-toggle'),
    shopToggle: document.getElementById('shop-toggle'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    upgradeCost: document.getElementById('upgrade-cost'),
    upgradeCount: document.getElementById('upgrade-count'),
    officeBtn: document.getElementById('office-btn'),
    officeCost: document.getElementById('office-cost'),
    officeCount: document.getElementById('office-count'),
    rebirthBtn: document.getElementById('rebirth-btn'),
    rebirthCost: document.getElementById('rebirth-cost'),
    rebirthMult: document.getElementById('rebirth-mult'),
    totalEarned: document.getElementById('total-earned'),
    totalClicks: document.getElementById('total-clicks'),
    playtime: document.getElementById('playtime'),
    rebirthCount: document.getElementById('rebirth-count'),
    skinsGrid: document.getElementById('skins-grid'),
    resetBtn: document.getElementById('reset-btn'),
    autosaveIndicator: document.getElementById('autosave-indicator'),
    particlesContainer: document.getElementById('particles-container'),
    floatingNumbers: document.getElementById('floating-numbers'),
    statsModal: document.getElementById('stats-modal'),
    shopModal: document.getElementById('shop-modal')
};

// ===== UTILITY: Number Formatting =====
function fmt(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

function fmtTime(sec) {
    if (sec < 60) return sec + 's';
    if (sec < 3600) return Math.floor(sec / 60) + 'm ' + (sec % 60) + 's';
    return Math.floor(sec / 3600) + 'h ' + Math.floor((sec % 3600) / 60) + 'm';
}

// ===== COMBO SYSTEM =====
function handleCombo() {
    const now = Date.now();
    if (now - gameState.lastClickTime > 3000) {
        gameState.currentCombo = 0;
    }
    gameState.currentCombo += 1;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.currentCombo);
    gameState.lastClickTime = now;
}

function getComboMultiplier() {
    return 1 + (gameState.currentCombo * 0.02); // 2% pro Combo
}

// ===== REBIRTH & MULTIPLIERS =====
function getRebirthMultiplier() {
    return 1 + (gameState.rebirths * REBIRTH_POWER_BONUS);
}

function getClickValue() {
    let value = gameState.clickPower * getRebirthMultiplier() * getComboMultiplier();
    if (gameState.goldenClickActive) value *= 2; // Golden Click = 2x
    return value;
}

function getPassiveIncome() {
    return gameState.offices * OFFICE_CPS * getRebirthMultiplier();
}

function getAchievementBonus() {
    let bonus = 1;
    gameState.unlockedAchievements.forEach(achId => {
        const ach = ACHIEVEMENTS.find(a => a.id === achId);
        if (ach) bonus *= (1 + ach.bonus);
    });
    return bonus;
}

// ===== CAREER TIERS =====
function getCareerTier() {
    const tiers = [
        { level: 0, name: '🎪 Tanzzimmer', threshold: 0 },
        { level: 1, name: '🎭 Lokale Bühne', threshold: 10000 },
        { level: 2, name: '🏆 Regionale Meisterschaft', threshold: 100000 },
        { level: 3, name: '🌟 Nationale Tour', threshold: 1000000 },
        { level: 4, name: '⭐ STARDANCE FINALE', threshold: 10000000 }
    ];
    for (let i = tiers.length - 1; i >= 0; i--) {
        if (gameState.totalEarned >= tiers[i].threshold) return tiers[i];
    }
    return tiers[0];
}

// ===== COSTS =====
function getNextUpgradeCost() {
    return Math.round(BASE_UPGRADE_COST * Math.pow(CLICK_UPGRADE_MULTIPLIER, gameState.clickUpgrades));
}

function getNextOfficeCost() {
    return Math.round(OFFICE_BASE_COST * Math.pow(OFFICE_SCALE, gameState.offices));
}

function getRebirthCost() {
    if (gameState.rebirths === 0) return REBIRTH_COST_START;
    return Math.round(REBIRTH_COST_START * Math.pow(10, gameState.rebirths));
}

// ===== MAIN GAMEPLAY =====
function clickButton(event) {
    handleCombo();
    const power = getClickValue();
    gameState.score += power;
    gameState.totalEarned += power;
    gameState.totalClicks += 1;

    showFloatingNumber(power, event.clientX, event.clientY);
    createParticles(event.clientX, event.clientY, 5);
    vibrate();
    updateDisplay();
    saveGame();

    // Check Achievements
    checkAchievements();
}

function buyUpgrade() {
    const cost = getNextUpgradeCost();
    if (gameState.score >= cost) {
        gameState.score -= cost;
        gameState.clickPower *= CLICK_UPGRADE_MULTIPLIER;
        gameState.clickUpgrades += 1;
        gameState.nextUpgradeCost = getNextUpgradeCost();
        notify('⚡ Klickraft gesteigert!', '#00ff41');
        screenShake(2);
        updateDisplay();
        saveGame();
        checkAchievements();
    }
}

function buyOffice() {
    const cost = getNextOfficeCost();
    if (gameState.score >= cost) {
        gameState.score -= cost;
        gameState.offices += 1;
        gameState.nextOfficeCost = getNextOfficeCost();
        notify('🏢 Neues Tanzbüro eröffnet!', '#ffd700');
        screenShake(2);
        updateDisplay();
        saveGame();
        checkAchievements();
    }
}

function performRebirth() {
    const cost = getRebirthCost();
    if (gameState.totalEarned >= cost) {
        const multiplier = getRebirthMultiplier() + REBIRTH_POWER_BONUS;
        notify(`🎭 Karriere #${gameState.rebirths + 1} - ×${multiplier.toFixed(2)}`, '#ff1493');
        screenShake(5);
        
        gameState.rebirths += 1;
        gameState.score = 0;
        gameState.clickPower = BASE_CLICK_POWER;
        gameState.clickUpgrades = 0;
        gameState.offices = 0;
        gameState.currentCombo = 0;

        updateDisplay();
        saveGame();
        checkAchievements();
    }
}

function toggleAutoClicker() {
    gameState.autoClickerEnabled = !gameState.autoClickerEnabled;
    notify(gameState.autoClickerEnabled ? '🤖 Auto: ON' : '🤖 Auto: OFF', '#00d9ff');
    updateDisplay();
    saveGame();
}

function selectSkin(skinId) {
    if (!gameState.ownedSkins.includes(skinId)) {
        notify('🔒 Noch nicht gesammelt!', '#ff0000');
        return;
    }
    gameState.selectedSkin = skinId;
    applySkinStyles();
    renderSkins();
    saveGame();
}

function applySkinStyles() {
    const skin = SKINS.find(s => s.id === gameState.selectedSkin);
    if (!skin) return;
    
    const root = document.documentElement;
    root.style.setProperty('--skin-primary', skin.p);
    root.style.setProperty('--skin-secondary', skin.s);
    root.style.setProperty('--skin-accent', skin.a);

    DOM.clickBtn.style.borderColor = skin.p;
    DOM.clickBtn.style.color = skin.p;
    DOM.clickBtn.style.textShadow = `0 0 20px ${skin.p}, 0 0 40px ${skin.s}`;
    DOM.clickBtn.style.boxShadow = `
        0 0 30px ${skin.p},
        0 0 60px ${skin.s},
        inset 0 0 30px ${skin.p}44
    `;
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!gameState.unlockedAchievements.includes(ach.id) && ach.check()) {
            gameState.unlockedAchievements.push(ach.id);
            notify(`🏆 ${ach.name}: ${ach.desc}`, '#ffff00');
            screenShake(3);
            saveGame();
        }
    });
}

// ===== COMBO DISPLAY =====
function updateComboDisplay() {
    const display = document.getElementById('combo-display');
    if (!display) return;
    
    if (gameState.currentCombo > 0) {
        display.style.opacity = '1';
        document.getElementById('combo-count').textContent = gameState.currentCombo;
    } else {
        display.style.opacity = '0';
    }
}

// ===== UI UPDATES =====
function updateDisplay() {
    DOM.score.textContent = fmt(gameState.score);
    DOM.cps.textContent = fmt(getPassiveIncome());

    const tier = getCareerTier();
    DOM.careerName.textContent = tier.name;
    DOM.careerLevel.textContent = `Lvl ${tier.level + 1}`;

    // Upgrades
    const upCost = getNextUpgradeCost();
    DOM.upgradeCost.textContent = `💰 ${fmt(upCost)}`;
    DOM.upgradeBtn.disabled = gameState.score < upCost;
    DOM.upgradeCount.textContent = gameState.clickUpgrades;

    // Offices
    const offCost = getNextOfficeCost();
    DOM.officeCost.textContent = `💰 ${fmt(offCost)}`;
    DOM.officeBtn.disabled = gameState.score < offCost;
    DOM.officeCount.textContent = gameState.offices;

    // Rebirth
    const rebCost = getRebirthCost();
    DOM.rebirthCost.textContent = gameState.totalEarned >= rebCost ? `💰 ${fmt(rebCost)}` : '💰 ∞';
    DOM.rebirthBtn.disabled = gameState.totalEarned < rebCost;
    DOM.rebirthMult.textContent = `×${getRebirthMultiplier().toFixed(2)}`;

    // Auto Clicker
    DOM.autoClickerToggle.textContent = gameState.autoClickerEnabled ? '🤖 Auto: ON' : '🤖 Auto: OFF';
    DOM.autoClickerToggle.classList.toggle('active', gameState.autoClickerEnabled);

    // Stats
    DOM.totalEarned.textContent = fmt(gameState.totalEarned);
    DOM.totalClicks.textContent = gameState.totalClicks;
    DOM.rebirthCount.textContent = gameState.rebirths;

    // Update Title
    document.title = `[${fmt(gameState.score)}] STARDANCE CLICKER`;

    // Update Combo Display
    updateComboDisplay();

    renderSkins();
}

function updatePlaytime() {
    const sec = Math.floor((Date.now() - gameState.startTime) / 1000);
    DOM.playtime.textContent = fmtTime(sec);
}

function renderSkins() {
    DOM.skinsGrid.innerHTML = '';
    SKINS.forEach(skin => {
        const div = document.createElement('div');
        div.className = 'skin-item';
        div.textContent = skin.name.split(' ')[0]; // Short name
        div.style.borderColor = skin.p;
        div.style.backgroundColor = skin.p + '15';
        
        if (gameState.ownedSkins.includes(skin.id)) {
            div.style.backgroundColor = skin.p + '40';
            div.style.boxShadow = `0 0 15px ${skin.p}`;
            if (gameState.selectedSkin === skin.id) {
                div.style.boxShadow = `0 0 25px ${skin.p}, 0 0 40px ${skin.p}`;
                div.style.transform = 'scale(1.1)';
            }
            div.title = skin.name;
        } else {
            div.style.opacity = '0.4';
            div.style.cursor = 'not-allowed';
            div.title = '🔒 Noch nicht gesammelt';
        }

        div.addEventListener('click', () => selectSkin(skin.id));
        DOM.skinsGrid.appendChild(div);
    });
}

// ===== VISUAL EFFECTS =====
function showFloatingNumber(amount, x, y) {
    const num = document.createElement('div');
    num.className = 'floating-number';
    num.textContent = '+' + fmt(amount);
    num.style.left = x + 'px';
    num.style.top = y + 'px';
    num.style.color = gameState.goldenClickActive ? '#ffff00' : '#00d9ff';
    num.style.textShadow = `0 0 10px ${gameState.goldenClickActive ? '#ffaa00' : '#00d9ff'}`;
    DOM.floatingNumbers.appendChild(num);
    setTimeout(() => num.remove(), 1000);
}

function createParticles(x, y, count = 5) {
    const particles = ['⭐', '✨', '💫', '🌟', '💥'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = particles[Math.random() * particles.length | 0];
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.setProperty('--tx', (Math.cos((i / count) * Math.PI * 2) * 60) + 'px');
        p.style.setProperty('--ty', (Math.sin((i / count) * Math.PI * 2) * 60) + 'px');
        p.style.animation = `particleFloat 0.8s ease-out forwards`;
        DOM.particlesContainer.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

function notify(text, color = '#00ff41') {
    const n = document.createElement('div');
    n.textContent = text;
    n.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(90deg, ${color}22, ${color}44);
        border: 2px solid ${color};
        color: ${color};
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: bold;
        z-index: 2000;
        animation: slideDown 0.4s ease;
        pointer-events: none;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2500);
}

function screenShake(intensity) {
    const body = document.body;
    for (let i = 0; i < intensity * 2; i++) {
        setTimeout(() => {
            body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, i * 20);
    }
    setTimeout(() => {
        body.style.transform = 'translate(0, 0)';
    }, intensity * 40);
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(10);
}

// ===== MODAL FUNCTIONS =====
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// ===== SAVE & LOAD =====
function saveGame() {
    gameState.playTimeSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    DOM.autosaveIndicator.style.opacity = '0.5';
    setTimeout(() => {
        DOM.autosaveIndicator.style.opacity = '1';
    }, 150);
}

function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        gameState = JSON.parse(saved);
        const offlineTime = (Date.now() - gameState.startTime) / 1000 - gameState.playTimeSeconds;
        
        // Offline Earning: 50% der normalen CPS für jeden Sekunde offline (max 1 hour)
        if (offlineTime > 0) {
            const offlineSeconds = Math.min(offlineTime, 3600); // Max 1 hour
            const offlineEarnings = getPassiveIncome() * 0.5 * offlineSeconds;
            gameState.score += offlineEarnings;
            gameState.totalEarned += offlineEarnings;
            if (offlineEarnings > 0) {
                notify(`💤 Offline verdient: +${fmt(offlineEarnings)}`, '#00ffaa');
            }
        }
        
        gameState.startTime = Date.now() - (gameState.playTimeSeconds * 1000);
    }
    
    // Unlock skins based on achievements
    gameState.unlockedAchievements.forEach(achId => {
        if (achId === 'thousand-earned' && !gameState.ownedSkins.includes('gold')) {
            gameState.ownedSkins.push('gold');
            notify('🎨 Neuer Skin freigeschaltet: Gold Luxe!', '#ffd700');
        }
        if (achId === 'first-rebirth' && !gameState.ownedSkins.includes('purple')) {
            gameState.ownedSkins.push('purple');
            notify('🎨 Neuer Skin freigeschaltet: Purple Night!', '#b300ff');
        }
        if (achId === 'millionaire' && !gameState.ownedSkins.includes('sunset')) {
            gameState.ownedSkins.push('sunset');
            notify('🎨 Neuer Skin freigeschaltet: Sunset!', '#ff6b35');
        }
    });
}

function resetGame() {
    if (confirm('🗑️  Wirklich ALLE Daten löschen? Kein Zurück!')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// ===== EVENT LISTENERS =====
DOM.clickBtn.addEventListener('click', clickButton);
DOM.upgradeBtn.addEventListener('click', buyUpgrade);
DOM.officeBtn.addEventListener('click', buyOffice);
DOM.rebirthBtn.addEventListener('click', performRebirth);
DOM.autoClickerToggle.addEventListener('click', toggleAutoClicker);
DOM.statsToggle.addEventListener('click', () => openModal('stats-modal'));
DOM.shopToggle.addEventListener('click', () => openModal('shop-modal'));
DOM.resetBtn.addEventListener('click', resetGame);

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Keyboard shortcuts - Enhanced
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey) return;
    if (e.key.toLowerCase() === 's') DOM.statsToggle.click();
    if (e.key.toLowerCase() === 'p') DOM.shopToggle.click();
    if (e.key === ' ') { e.preventDefault(); DOM.clickBtn.click(); }
    if (e.key.toLowerCase() === 'a') DOM.autoClickerToggle.click();
});

// ===== GAME LOOP =====
setInterval(() => {
    if (gameState.autoClickerEnabled) {
        const power = getClickValue();
        gameState.score += power;
        gameState.totalEarned += power;
        gameState.totalClicks += 1;
    }
    gameState.score += getPassiveIncome();
    gameState.totalEarned += getPassiveIncome();
    updateDisplay();
    
    // Reset combo after 3 seconds
    if (Date.now() - gameState.lastClickTime > 3000 && gameState.currentCombo > 0) {
        gameState.currentCombo = 0;
        updateDisplay();
    }
}, PASSIVE_INCOME_INTERVAL);

// Auto save
setInterval(saveGame, AUTO_SAVE_INTERVAL);

// Update playtime
setInterval(updatePlaytime, 1000);

// ===== INJECT ANIMATIONS =====
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes particleFloat {
        0% { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-30px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(animStyle);

// ===== INIT =====
loadGame();
applySkinStyles();
updateDisplay();
updatePlaytime();

console.log('%c🎭 STARDANCE CLICKER LOADED! 🎭', 'color: #00ff41; font-size: 20px; font-weight: bold;');
console.log('%cHave fun dancing! Press S for stats, P for shop, SPACE to click!', 'color: #00d9ff; font-size: 14px;');
