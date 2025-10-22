// ========== CONTENT LOADER (AWS + RCU + System - NO MENU LOGIC) ==========

// Конфігурація іконок для сторінок
const PAGE_ICONS = {
    calculator: '🐾', arm: '💪', grind: '🏋️‍♂️', roulette: '🎰', boss: '👹',
    boosts: '🚀', shiny: '✨', secret: '🔮', codes: '🎁', aura: '🌟',
    trainer: '🏆', charms: '🔮', potions: '🧪', worlds: '🌍',
    trader: '🛒', clans: '🏰', petscalc: '🐾',
    settings: '⚙️', help: '🆘', peoples: '🙏'
};

async function loadContent() {
    try {
        const baseTag = document.querySelector('base');
        const basePath = baseTag ? new URL(baseTag.href).pathname : '';
        
        // Load AWS content
        const awsContentURL = basePath ? `${basePath}AWS/system/content.html` : 'AWS/system/content.html';
        console.log('📦 Loading AWS content from:', awsContentURL);
        
        const awsResponse = await fetch(awsContentURL);
        if (!awsResponse.ok) throw new Error(`HTTP ${awsResponse.status}`);
        const awsHTML = await awsResponse.text();
        
        // Load RCU content
        const rcuContentURL = basePath ? `${basePath}RCU/system/RCU_content.html` : 'RCU/system/RCU_content.html';
        console.log('📦 Loading RCU content from:', rcuContentURL);
        
        const rcuResponse = await fetch(rcuContentURL);
        if (!rcuResponse.ok) throw new Error(`HTTP ${rcuResponse.status}`);
        const rcuHTML = await rcuResponse.text();
        
        // Load System content
        const systemContentURL = basePath ? `${basePath}system/system_content/system_content.html` : 'system/system_content/system_content.html';
        console.log('📦 Loading System content from:', systemContentURL);
        
        const systemResponse = await fetch(systemContentURL);
        if (!systemResponse.ok) throw new Error(`HTTP ${systemResponse.status}`);
        const systemHTML = await systemResponse.text();
        
        // Combine content (AWS + RCU + System)
        const combinedContent = awsHTML + '\n' + rcuHTML + '\n' + systemHTML;
        
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error('❌ app-content not found');
            return;
        }

        appContent.innerHTML = createAppStructure(combinedContent);
        console.log('✅ Content structure created (AWS + RCU + System)');

        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            } else if (typeof window.updateMenuTranslations === 'function') {
                window.updateMenuTranslations();
                window.updatePageTitles?.();
            }
        }, 0);
        
        initializeSignatureEasterEgg();
        document.dispatchEvent(new CustomEvent('contentLoaded'));
        
        console.log('✅ Content loaded (AWS + RCU + System)');
        
    } catch (error) {
        console.error('❌ Error loading content:', error);
        document.dispatchEvent(new CustomEvent('contentLoadError', { detail: error }));
    }
}

function createAppStructure(contentHTML) {
    return `
        <!-- LEFT SIDEBAR -->
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3></h3>
                <button class="close-sidebar" onclick="window.closeSidebar(); return false;">×</button>
            </div>
            <div class="nav-buttons">
                ${createMainCategory('awsCategory', '📦', [
                    { id: 'calculatorButtons', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                    { id: 'infoButtons', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'] },
                    { id: 'othersAWSButtons', icon: '🔧', pages: ['trader', 'clans'] }
                ])}

                ${createMainCategory('rcuCategory', '🎮', [
                    { id: 'rcuCalculatorButtons', icon: '🧮', pages: ['petscalc'] }
                ])}

                ${createMainCategoryDirect('systemCategory', '⚙️', ['settings', 'help', 'peoples'])}
            </div>
            
            <div class="sidebar-controls" id="sidebarControls">
                <button class="settings-btn-sidebar" onclick="switchPage('settings')" title="Settings">⚙️</button>
            </div>
        </div>

        <!-- RIGHT SIDEBAR (IDENTICAL TO LEFT) -->
        <div class="sidebar sidebar-right" id="sidebarRight">
            <div class="sidebar-header">
                <h3></h3>
                <button class="close-sidebar" onclick="window.closeSidebarRight(); return false;">×</button>
            </div>
            <div class="nav-buttons">
                ${createMainCategory('awsCategoryRight', '📦', [
                    { id: 'calculatorButtonsRight', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                    { id: 'infoButtonsRight', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'] },
                    { id: 'othersAWSButtonsRight', icon: '🔧', pages: ['trader', 'clans'] }
                ])}

                ${createMainCategory('rcuCategoryRight', '🎮', [
                    { id: 'rcuCalculatorButtonsRight', icon: '🧮', pages: ['petscalc'] }
                ])}

                ${createMainCategoryDirect('systemCategoryRight', '⚙️', ['settings', 'help', 'peoples'])}
            </div>
            
            <div class="sidebar-controls" id="sidebarControlsRight">
                <button class="settings-btn-sidebar" onclick="switchPage('settings')" title="Settings">⚙️</button>
            </div>
        </div>

        <!-- OVERLAYS -->
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="window.closeSidebar(); return false;"></div>
        <div class="sidebar-overlay sidebar-overlay-right" id="sidebarOverlayRight" onclick="window.closeSidebarRight(); return false;"></div>
        
        <!-- TOGGLE BUTTONS -->
        <button class="mobile-menu-toggle" onclick="window.toggleMobileMenu(); return false;">☰</button>
        <button class="mobile-menu-toggle mobile-menu-toggle-right" onclick="window.toggleMobileMenuRight(); return false;">☰</button>
           
        <div class="container">${contentHTML}</div>
    `;
}

function createMainCategory(id, icon, subcategories) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span class="main-category-text"></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content" id="${id}">
                ${subcategories.map(sub => createNavCategory(sub.id, sub.icon, sub.pages)).join('')}
            </div>
        </div>
    `;
}

function createMainCategoryDirect(id, icon, pages) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span class="main-category-text"></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content main-category-direct" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="nav-btn-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="nav-btn-text"></span>
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createNavCategory(id, icon, pages) {
    return `
        <div class="nav-category">
            <div class="category-header" data-category="${id}" onclick="toggleCategory('${id}')">
                <div class="category-title">
                    <span class="category-icon">${icon}</span>
                    <span class="category-text"></span>
                </div>
                <span class="category-toggle">▼</span>
            </div>
            <div class="category-buttons" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="nav-btn-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="nav-btn-text"></span>
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// ========== CATEGORY MANAGEMENT ==========

function toggleMainCategory(mainCategoryId) {
    const mainContent = document.getElementById(mainCategoryId);
    const toggleIcon = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && toggleIcon) {
        const isExpanded = mainContent.classList.contains('expanded');
        
        if (!isExpanded) {
            // Get parent sidebar
            const sidebar = mainContent.closest('.sidebar');
            
            // Close all categories in this sidebar
            sidebar.querySelectorAll('.main-category-content').forEach(el => {
                if (el !== mainContent) el.classList.remove('expanded');
            });
            sidebar.querySelectorAll('.main-category-toggle').forEach(el => {
                if (el !== toggleIcon) el.classList.remove('expanded');
            });
            
            mainContent.classList.add('expanded');
            toggleIcon.classList.add('expanded');
            
            if (!mainContent.classList.contains('main-category-direct')) {
                const firstSubcategory = mainContent.querySelector('.category-buttons');
                const firstToggle = mainContent.querySelector('.category-toggle');
                if (firstSubcategory && firstToggle) {
                    firstSubcategory.classList.add('expanded');
                    firstToggle.classList.add('expanded');
                }
            }
        } else {
            mainContent.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        if (!isExpanded) {
            const parentMainCategory = categoryButtons.closest('.main-category-content');
            if (parentMainCategory) {
                parentMainCategory.querySelectorAll('.category-buttons').forEach(el => {
                    if (el !== categoryButtons) el.classList.remove('expanded');
                });
                parentMainCategory.querySelectorAll('.category-toggle').forEach(el => {
                    if (el !== toggleIcon) el.classList.remove('expanded');
                });
            }
            
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        } else {
            categoryButtons.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

// ========== AUTO-OPEN CATEGORIES BY PAGE ==========

function openCategoryForPage(page) {
    console.log('📂 Opening category for page:', page);
    
    const categoryMap = {
        'calculator': ['awsCategory', 'calculatorButtons'],
        'arm': ['awsCategory', 'calculatorButtons'],
        'grind': ['awsCategory', 'calculatorButtons'],
        'roulette': ['awsCategory', 'calculatorButtons'],
        'boss': ['awsCategory', 'calculatorButtons'],
        'boosts': ['awsCategory', 'infoButtons'],
        'shiny': ['awsCategory', 'infoButtons'],
        'secret': ['awsCategory', 'infoButtons'],
        'codes': ['awsCategory', 'infoButtons'],
        'aura': ['awsCategory', 'infoButtons'],
        'trainer': ['awsCategory', 'infoButtons'],
        'charms': ['awsCategory', 'infoButtons'],
        'potions': ['awsCategory', 'infoButtons'],
        'worlds': ['awsCategory', 'infoButtons'],
        'trader': ['awsCategory', 'othersAWSButtons'],
        'clans': ['awsCategory', 'othersAWSButtons'],
        'petscalc': ['rcuCategory', 'rcuCalculatorButtons'],
        'settings': ['systemCategory', null],
        'help': ['systemCategory', null],
        'peoples': ['systemCategory', null]
    };
    
    const categories = categoryMap[page];
    if (!categories) {
        console.warn('⚠️ No category mapping for page:', page);
        return;
    }
    
    const [mainCategoryId, subCategoryId] = categories;
    
    // Close all in both sidebars
    document.querySelectorAll('.main-category-content').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.main-category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    // Open in LEFT sidebar
    const mainContent = document.getElementById(mainCategoryId);
    const mainToggle = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && mainToggle) {
        mainContent.classList.add('expanded');
        mainToggle.classList.add('expanded');
    }
    
    if (subCategoryId) {
        const subContent = document.getElementById(subCategoryId);
        const subToggle = document.querySelector(`[data-category="${subCategoryId}"] .category-toggle`);
        
        if (subContent && subToggle) {
            subContent.classList.add('expanded');
            subToggle.classList.add('expanded');
        }
    }
    
    // Open in RIGHT sidebar
    const mainContentRight = document.getElementById(mainCategoryId + 'Right');
    const mainToggleRight = document.querySelector(`[data-main-category="${mainCategoryId}Right"] .main-category-toggle`);
    
    if (mainContentRight && mainToggleRight) {
        mainContentRight.classList.add('expanded');
        mainToggleRight.classList.add('expanded');
    }
    
    if (subCategoryId) {
        const subContentRight = document.getElementById(subCategoryId + 'Right');
        const subToggleRight = document.querySelector(`[data-category="${subCategoryId}Right"] .category-toggle`);
        
        if (subContentRight && subToggleRight) {
            subContentRight.classList.add('expanded');
            subToggleRight.classList.add('expanded');
        }
    }
}

// ========== EASTER EGG ==========

function initializeSignatureEasterEgg() {
    const signature = document.querySelector('.signature');
    if (!signature) {
        setTimeout(initializeSignatureEasterEgg, 500);
        return;
    }
    
    let clickCount = 0;
    let clickTimer = null;
    
    signature.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => clickCount = 0, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            const hasBg = document.body.style.backgroundImage.includes('megadep.png');
            
            if (hasBg) {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
            } else {
                const baseTag = document.querySelector('base');
                const basePath = baseTag ? new URL(baseTag.href).pathname : '';
                const bgPath = basePath ? `${basePath}AWS/image/bg/megadep.png` : 'AWS/image/bg/megadep.png';
                
                Object.assign(document.body.style, {
                    backgroundImage: `url(${bgPath})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                });
                console.log('🎨 Megadep background activated! 🎉');
            }
        }
    });
    
    signature.style.cursor = 'pointer';
    signature.title = 'Double click me! 😉';
    
    console.log('✅ Easter egg initialized');
}

// ========== EVENT LISTENERS ==========

document.addEventListener('languageChanged', () => {
    console.log('🌍 Language changed');
});

// ========== PAGE CHANGE OBSERVER ==========

document.addEventListener('pageChanged', (e) => {
    if (e.detail && e.detail.page) {
        setTimeout(() => {
            openCategoryForPage(e.detail.page);
        }, 100);
    }
});

// ========== INITIALIZATION ==========

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
    });
} else {
    loadContent();
}

// Exports
Object.assign(window, { 
    toggleMainCategory,
    toggleCategory,
    openCategoryForPage,
    PAGE_ICONS
});

console.log('✅ Content Loader ready (WITH RIGHT SIDEBAR)');
