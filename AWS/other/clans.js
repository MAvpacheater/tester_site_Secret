// Clans Module - Fixed Version with Proper Path Handling
let clansInitialized = false;
let currentClansLanguage = 'en';
let clansTranslations = null;
let currentClansSection = 'upgrades';
let submittedClans = [];
let clanImagePreview = null;

// Get Base Path for Module
function getClansBasePath() {
    const { protocol, host, pathname } = window.location;
    
    // GitHub Pages
    if (host === 'mavpacheater.github.io') {
        return `${protocol}//${host}/tester_site_Secret/AWS/`;
    }
    
    // Localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
            return `${protocol}//${host}/${pathParts[0]}/AWS/`;
        }
        return `${protocol}//${host}/AWS/`;
    }
    
    // Default
    return '/AWS/';
}

const CLANS_BASE_PATH = getClansBasePath();

// Load translations (cached)
async function loadClansTranslations() {
    if (clansTranslations) return clansTranslations;
    
    try {
        const jsonPath = `${CLANS_BASE_PATH}other/clans.json`;
        
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        clansTranslations = await response.json();
        return clansTranslations;
    } catch (error) {
        
        // Fallback data
        clansTranslations = {
            en: {
                title: "Clans",
                switcher: { upgrades: "Upgrades", add: "Add Clan" },
                upgrades: [
                    { level: "Level 1", cost: "2.5k tokens", boost: "5%" },
                    { level: "Level 2", cost: "10k tokens", boost: "10%" },
                    { level: "Level 3", cost: "25k tokens", boost: "15%" },
                    { level: "Level 4", cost: "50k tokens", boost: "20%" },
                    { level: "Level 5", cost: "87.5k tokens", boost: "25%" },
                    { level: "Level 6", cost: "??? tokens", boost: "30%" },
                    { level: "Level 7", cost: "??? tokens", boost: "35%" }
                ],
                form: {
                    title: "Add Your Clan",
                    clanPhoto: "Clan Photo:",
                    clanName: "Clan Name:",
                    clanBoost: "Clan Boost:",
                    perClick: "Per Click:",
                    rawStrength: "Raw Strength:",
                    event: "Event (CW):",
                    donate: "Donate:",
                    uploadImage: "Upload Image",
                    submit: "Submit Clan",
                    clear: "Clear Form"
                }
            }
        };
        return clansTranslations;
    }
}

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Update language
function updateClansLanguage(newLanguage) {
    if (newLanguage === currentClansLanguage) return;
    
    currentClansLanguage = newLanguage;
    
    if (clansInitialized) {
        generateClansContent();
    }
}

// Handle image upload
function handleClanImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5000000) {
        alert('Image too large! Max 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        clanImagePreview = e.target.result;
        const preview = document.getElementById('clanImagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Clan Image">`;
        }
    };
    reader.readAsDataURL(file);
}

// Switch sections
function switchClansSection(section) {
    currentClansSection = section;
    
    document.querySelectorAll('.clans-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.clansSection === section);
    });
    
    document.querySelectorAll('.clans-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `${section}ClansSection`);
    });
}

// Submit clan form
function submitClanForm() {
    const clanName = document.getElementById('clanNameInput').value.trim();
    
    if (!clanName) {
        alert('Please enter a clan name!');
        return;
    }
    
    const newClan = {
        id: Date.now(),
        photo: clanImagePreview,
        name: clanName,
        boost: document.getElementById('clanBoostInput').value.trim(),
        perClick: document.getElementById('perClickInput').value.trim(),
        rawStrength: document.getElementById('rawStrengthInput').value.trim(),
        event: document.getElementById('eventCWInput').value.trim(),
        donate: document.getElementById('donateInput').value.trim()
    };
    
    submittedClans.push(newClan);
    clearClanForm();
    renderSubmittedClans();
}

// Clear form
function clearClanForm() {
    document.getElementById('clanNameInput').value = '';
    document.getElementById('clanBoostInput').value = '';
    document.getElementById('perClickInput').value = '';
    document.getElementById('rawStrengthInput').value = '';
    document.getElementById('eventCWInput').value = '';
    document.getElementById('donateInput').value = '';
    document.getElementById('clanImageInput').value = '';
    clanImagePreview = null;
    
    const preview = document.getElementById('clanImagePreview');
    if (preview) {
        preview.innerHTML = '<div class="image-placeholder">🏰</div>';
    }
}

// Delete clan
function deleteClan(clanId) {
    submittedClans = submittedClans.filter(clan => clan.id !== clanId);
    renderSubmittedClans();
}

// Render submitted clans
function renderSubmittedClans() {
    const container = document.getElementById('submittedClansContainer');
    if (!container || submittedClans.length === 0) {
        if (container) container.innerHTML = '';
        return;
    }
    
    const data = clansTranslations[currentClansLanguage];
    
    container.innerHTML = submittedClans.map(clan => `
        <div class="submitted-clan-card">
            <div class="submitted-clan-image">
                ${clan.photo ? `<img src="${clan.photo}" alt="${clan.name}">` : '<div class="image-placeholder">🏰</div>'}
            </div>
            <div class="submitted-clan-content">
                <div class="submitted-clan-name">${clan.name}</div>
                ${clan.boost ? `<div class="submitted-clan-requirements"><strong>${data.form.clanBoost}</strong> ${clan.boost}</div>` : ''}
                ${clan.perClick ? `<div class="submitted-clan-requirements"><strong>${data.form.perClick}</strong> ${clan.perClick}</div>` : ''}
                ${clan.rawStrength ? `<div class="submitted-clan-requirements"><strong>${data.form.rawStrength}</strong> ${clan.rawStrength}</div>` : ''}
                ${clan.event ? `<div class="submitted-clan-requirements"><strong>${data.form.event}</strong> ${clan.event}</div>` : ''}
                ${clan.donate ? `<div class="submitted-clan-requirements"><strong>${data.form.donate}</strong> ${clan.donate}</div>` : ''}
                <button class="delete-clan-btn" onclick="deleteClan(${clan.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Generate clans content
function generateClansContent() {
    const data = clansTranslations[currentClansLanguage];
    if (!data) return;
    
    const container = document.getElementById('clansMainContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="clans-switcher">
            <button class="clans-switch-btn ${currentClansSection === 'upgrades' ? 'active' : ''}" 
                    data-clans-section="upgrades" 
                    onclick="switchClansSection('upgrades')">
                ${data.switcher.upgrades}
            </button>
            <button class="clans-switch-btn ${currentClansSection === 'add' ? 'active' : ''}" 
                    data-clans-section="add" 
                    onclick="switchClansSection('add')">
                ${data.switcher.add}
            </button>
        </div>

        <div id="upgradesClansSection" class="clans-section ${currentClansSection === 'upgrades' ? 'active' : ''}">
            <div class="upgrades-container">
                ${data.upgrades.map(upgrade => `
                    <div class="upgrade-item">
                        <div class="upgrade-level">${upgrade.level}</div>
                        <div class="upgrade-info">
                            <div class="upgrade-cost">${upgrade.cost}</div>
                        </div>
                        <div class="upgrade-boost">${upgrade.boost}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="addClansSection" class="clans-section ${currentClansSection === 'add' ? 'active' : ''}">
            <div class="add-clan-container">
                <div class="clan-form">
                    <h2 class="clan-form-title">${data.form.title}</h2>
                    
                    <div class="form-group">
                        <label class="form-label">${data.form.clanPhoto}</label>
                        <div class="form-image-upload">
                            <div class="image-preview" id="clanImagePreview">
                                <div class="image-placeholder">🏰</div>
                            </div>
                            <div>
                                <label class="upload-btn">
                                    📷 ${data.form.uploadImage}
                                    <input type="file" 
                                           id="clanImageInput" 
                                           class="file-input" 
                                           accept="image/*" 
                                           onchange="handleClanImageUpload(event)">
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.clanName}</label>
                        <input type="text" id="clanNameInput" class="form-input" placeholder="${data.form.clanName}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.clanBoost}</label>
                        <input type="text" id="clanBoostInput" class="form-input" placeholder="${data.form.clanBoost}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.perClick}</label>
                        <input type="text" id="perClickInput" class="form-input" placeholder="${data.form.perClick}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.rawStrength}</label>
                        <input type="text" id="rawStrengthInput" class="form-input" placeholder="${data.form.rawStrength}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.event}</label>
                        <input type="text" id="eventCWInput" class="form-input" placeholder="${data.form.event}">
                    </div>

                    <div class="form-group">
                        <label class="form-label">${data.form.donate}</label>
                        <input type="text" id="donateInput" class="form-input" placeholder="${data.form.donate}">
                    </div>

                    <div class="form-actions">
                        <button class="submit-btn" onclick="submitClanForm()">✅ ${data.form.submit}</button>
                        <button class="clear-btn" onclick="clearClanForm()">🗑️ ${data.form.clear}</button>
                    </div>
                </div>

                <div class="submitted-clans" id="submittedClansContainer"></div>
            </div>
        </div>
    `;
    
    renderSubmittedClans();
}

// Initialize clans page
async function initializeClans() {
    const clansPage = document.getElementById('clansPage');
    if (!clansPage) return;
    
    // Skip if already initialized with content
    if (clansInitialized && clansPage.querySelector('.clans-switcher')) {
        return;
    }
    
    currentClansLanguage = getCurrentLanguage();
    
    // Load translations if not loaded
    if (!clansTranslations) {
        await loadClansTranslations();
    }
    
    const data = clansTranslations[currentClansLanguage];
    
    // Create structure
    clansPage.innerHTML = `
        <div class="clans-header">
            <h1 class="clans-title">${data.title}</h1>
        </div>
        <div id="clansMainContainer"></div>
    `;
    
    // Generate content
    generateClansContent();
    
    clansInitialized = true;
    window.clansInitialized = true;
}

// Language change listener
document.addEventListener('languageChanged', function(e) {
    if (e.detail?.language) {
        updateClansLanguage(e.detail.language);
    }
});

// Export functions
Object.assign(window, {
    initializeClans,
    updateClansLanguage,
    switchClansSection,
    handleClanImageUpload,
    submitClanForm,
    clearClanForm,
    deleteClan,
    renderSubmittedClans,
    generateClansContent,
    clansInitialized
});
