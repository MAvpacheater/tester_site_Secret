// Aura functionality with multilingual support - Creates full page structure

let auraCurrentLanguage = 'en';
let auraTranslations = null;
let auraInitialized = false;

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations from external file
async function loadAuraTranslations() {
    if (auraTranslations) return auraTranslations;
    
    try {
        const response = await fetch('info/aura/aura.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        auraTranslations = await response.json();
        console.log('✅ Aura translations loaded');
    } catch (error) {
        console.error('❌ Failed to load aura translations:', error);
        throw error;
    }
    return auraTranslations;
}

// Create page structure
function createAuraStructure() {
    const page = document.getElementById('auraPage');
    if (!page) return console.error('❌ Aura page not found');
    
    auraCurrentLanguage = getCurrentLanguage();
    
    // Create title
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = auraTranslations?.[auraCurrentLanguage]?.title || 'Aura Boosts';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'aura-container';
    container.id = 'auraContainer';
    
    // Clear page and add elements
    page.innerHTML = '';
    page.appendChild(title);
    page.appendChild(container);
    
    console.log('✅ Aura structure created');
}

// Update language
function updateAuraLanguage(newLanguage) {
    console.log(`🌟 Aura language: ${auraCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === auraCurrentLanguage) return;
    auraCurrentLanguage = newLanguage;
    
    // Update title
    const titleElement = document.querySelector('.aura-page .title');
    if (titleElement && auraTranslations?.[newLanguage]) {
        titleElement.textContent = auraTranslations[newLanguage].title;
    }
    
    // Regenerate content
    if (auraInitialized) {
        setTimeout(generateAuraContent, 100);
    }
}

// Generate content
async function generateAuraContent() {
    const container = document.getElementById('auraContainer');
    if (!container) return console.error('❌ Aura container not found');
    
    auraCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!auraTranslations) await loadAuraTranslations();
        
        const data = auraTranslations[auraCurrentLanguage];
        if (!data) {
            throw new Error(`No aura data for language: ${auraCurrentLanguage}`);
        }
        
        // Show loading
        container.innerHTML = `<div class="aura-loading">${data.loading}</div>`;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        container.innerHTML = '';
        
        // Create aura items with INDIVIDUAL descriptions
        data.auras.forEach((aura, index) => {
            const item = document.createElement('div');
            item.className = 'aura-item';
            item.style.animationDelay = `${index * 0.05}s`;
            
            // Use individual description if provided, otherwise generate dynamic one
            let description;
            if (aura.description) {
                description = aura.description;
            } else {
                description = data.description
                    .replace('%strength%', `${aura.strength}%`)
                    .replace('%luck%', `${aura.luck}%`)
                    .replace('%speed%', `${aura.speed}%`);
            }
            
            const photoHtml = aura.image 
                ? `<img src="${aura.image}" alt="${aura.name}" onerror="this.parentElement.innerHTML='<div class=\\'aura-photo-placeholder\\'>No Image</div>'">`
                : '<div class="aura-photo-placeholder">No Image</div>';
            
            item.innerHTML = `
                <div class="aura-photo">
                    ${photoHtml}
                </div>
                <div class="aura-content">
                    <div class="aura-name">${aura.name}</div>
                    <div class="aura-description">${description}</div>
                </div>
                <div class="aura-rarity ${aura.rarity}">${aura.rarity.toUpperCase()}</div>
            `;
            container.appendChild(item);
        });
        
        console.log(`✅ Generated ${data.auras.length} auras in ${auraCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating auras:', error);
        container.innerHTML = `
            <div class="aura-error">
                ⚠️ Error loading aura data<br>
                <button class="retry-btn" onclick="generateAuraContent()">Retry</button>
            </div>
        `;
    }
}

// Initialize aura
async function initializeAura() {
    if (auraInitialized) {
        console.log('🔄 Aura already initialized');
        return;
    }
    
    console.log('🌟 Initializing aura...');
    
    auraCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadAuraTranslations();
        createAuraStructure();
        await generateAuraContent();
        
        auraInitialized = true;
        window.auraInitialized = true;
        console.log('✅ Aura initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize aura:', error);
        const page = document.getElementById('auraPage');
        if (page) {
            page.innerHTML = `
                <h1 class="title">Aura Boosts</h1>
                <div class="aura-container">
                    <div class="aura-error">
                        ⚠️ Failed to load aura data<br>
                        <button class="retry-btn" onclick="initializeAura()">Retry</button>
                    </div>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateAuraLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('auraPage');
        if (page?.classList.contains('active')) initializeAura();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'aura') {
        setTimeout(() => {
            if (!auraInitialized) {
                initializeAura();
            }
        }, 300);
    }
});

// Observer for page activation
const auraObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const auraPage = document.getElementById('auraPage');
            if (auraPage?.classList.contains('active') && !auraInitialized) {
                console.log('🌟 Aura page activated, initializing...');
                initializeAura();
            }
        }
    });
});

// Start observing
document.addEventListener('DOMContentLoaded', () => {
    const auraPage = document.getElementById('auraPage');
    if (auraPage) {
        auraObserver.observe(auraPage, { attributes: true });
    }
});

// Global exports
window.initializeAura = initializeAura;
window.updateAuraLanguage = updateAuraLanguage;
window.generateAuraContent = generateAuraContent;
window.auraInitialized = auraInitialized;

console.log('✅ Aura.js loaded');
