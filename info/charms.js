// Charms functionality - Multilingual support

let charmsCurrentLanguage = 'en';
let charmsTranslations = null;
let charmsInitialized = false;

const getCurrentLanguage = () => localStorage.getItem('armHelper_language') || 'en';

async function loadCharmsTranslations() {
    if (charmsTranslations) return charmsTranslations;
    
    try {
        console.log('📥 Loading charms translations...');
        const response = await fetch('info/charms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        charmsTranslations = await response.json();
        console.log('✅ Charms translations loaded');
        return charmsTranslations;
    } catch (error) {
        console.error('❌ Error loading charms translations:', error);
        throw error;
    }
}

function createCharmsStructure() {
    const page = document.getElementById('charmsPage');
    if (!page) return console.error('❌ Charms page not found');
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = charmsTranslations?.[charmsCurrentLanguage]?.title || 'Charms Boosts';
    
    const container = document.createElement('div');
    container.className = 'charms-container';
    container.id = 'charmsContainer';
    
    page.innerHTML = '';
    page.appendChild(title);
    page.appendChild(container);
    
    console.log('✅ Charms structure created');
}

function updateCharmsLanguage(newLanguage) {
    console.log(`🔮 Charms language: ${charmsCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === charmsCurrentLanguage) return;
    charmsCurrentLanguage = newLanguage;
    
    const titleElement = document.querySelector('.charms-page .title');
    if (titleElement && charmsTranslations?.[newLanguage]) {
        titleElement.textContent = charmsTranslations[newLanguage].title;
    }
    
    if (charmsInitialized) setTimeout(generateCharmsContent, 100);
}

async function generateCharmsContent() {
    const container = document.getElementById('charmsContainer');
    if (!container) return console.error('❌ Charms container not found');
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!charmsTranslations) await loadCharmsTranslations();
        
        const data = charmsTranslations[charmsCurrentLanguage];
        if (!data) throw new Error(`No charms data for language: ${charmsCurrentLanguage}`);
        
        container.innerHTML = `<div class="charms-loading">${data.loading}</div>`;
        await new Promise(resolve => setTimeout(resolve, 500));
        container.innerHTML = '';
        
        data.charms.forEach((charm, index) => {
            const charmItem = document.createElement('div');
            charmItem.className = 'charm-item';
            charmItem.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            
            charmItem.innerHTML = `
                <div class="charm-image-container">
                    <img src="${charm.imageUrl}" alt="${charm.title}" class="charm-image" loading="lazy">
                </div>
                <div class="charm-content">
                    <div class="charm-title">${charm.title}</div>
                    <div class="charm-description">${charm.description}</div>
                    <div class="charm-details">${charm.details}</div>
                    <div class="charm-category ${charm.category}">${charm.category}</div>
                </div>
            `;
            container.appendChild(charmItem);
        });
        
        console.log(`✅ Generated ${data.charms.length} charms in ${charmsCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating charms:', error);
        const errorText = charmsTranslations?.[charmsCurrentLanguage]?.error || 'Error loading charms data';
        const retryText = charmsTranslations?.[charmsCurrentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="charms-error">
                ⚠️ ${errorText}<br>
                <button class="retry-btn" onclick="generateCharmsContent()">${retryText}</button>
            </div>
        `;
    }
}

async function initializeCharms() {
    if (charmsInitialized) return console.log('🔄 Charms already initialized');
    
    console.log('🔮 Initializing charms...');
    charmsCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadCharmsTranslations();
        createCharmsStructure();
        await generateCharmsContent();
        
        charmsInitialized = true;
        window.charmsInitialized = true;
        console.log('✅ Charms initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize charms:', error);
        const page = document.getElementById('charmsPage');
        if (page) {
            page.innerHTML = `
                <h1 class="title">Charms Boosts</h1>
                <div class="charms-container">
                    <div class="charms-error">
                        ⚠️ Failed to load charms data<br>
                        <button class="retry-btn" onclick="initializeCharms()">Retry</button>
                    </div>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateCharmsLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('charmsPage');
        if (page?.classList.contains('active')) initializeCharms();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'charms') {
        setTimeout(() => { if (!charmsInitialized) initializeCharms(); }, 300);
    }
});

// Observer for page activation
const charmsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const charmsPage = document.getElementById('charmsPage');
            if (charmsPage?.classList.contains('active') && !charmsInitialized) {
                console.log('🔮 Charms page activated, initializing...');
                initializeCharms();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const charmsPage = document.getElementById('charmsPage');
    if (charmsPage) charmsObserver.observe(charmsPage, { attributes: true });
});

// Global exports
Object.assign(window, {
    initializeCharms,
    updateCharmsLanguage,
    switchCharmsLanguage: updateCharmsLanguage,
    generateCharmsContent,
    charmsInitialized
});

console.log('✅ Charms.js loaded');
