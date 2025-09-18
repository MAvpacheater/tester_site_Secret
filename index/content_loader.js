// Optimized Content Loader - Fixed Categories
console.log('Content Loader v2.1 - Starting...');

let contentLoadAttempts = 0;
const MAX_ATTEMPTS = 3;
let loadingInProgress = false;

async function loadContent() {
    if (loadingInProgress) return;
    loadingInProgress = true;
    contentLoadAttempts++;
    
    try {
        console.log(`Loading content... (Attempt ${contentLoadAttempts})`);
        
        const contentFiles = [
            { name: 'calc', url: 'index/content_calc.html' },
            { name: 'info', url: 'index/content_info.html' },
            { name: 'moderation', url: 'index/content_moderation.html' },
            { name: 'other', url: 'index/content_other.html' }
        ];
        
        const loadFile = async (file) => {
            const response = await fetch(file.url, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            if (!text.trim()) throw new Error(`Empty content from ${file.name}`);
            return { name: file.name, content: text };
        };

        const results = await Promise.allSettled(contentFiles.map(loadFile));
        
        const contents = {};
        const failedFiles = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                contents[result.value.name] = result.value.content;
            } else {
                const fileName = contentFiles[index].name;
                console.error(`Failed to load ${fileName}:`, result.reason);
                failedFiles.push(fileName);
                contents[fileName] = getEmptyContent(fileName);
            }
        });
        
        if (failedFiles.length === contentFiles.length) {
            throw new Error(`All content files failed to load`);
        }

        const appContent = document.getElementById('app-content');
        if (!appContent) throw new Error('app-content element not found');
        
        appContent.innerHTML = generateAppContent(contents);
        console.log('Content injected successfully');
        
        // Setup events with delay to ensure DOM is ready
        setTimeout(setupEvents, 100);
        
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            }
        }, 200);
        
        console.log('Content loading completed');
        
    } catch (error) {
        console.error('Content loading error:', error);
        
        if (contentLoadAttempts < MAX_ATTEMPTS) {
            loadingInProgress = false;
            setTimeout(() => loadContent(), 1000);
            return;
        }
        
        showContentLoadError(error);
    } finally {
        loadingInProgress = false;
    }
}

function getEmptyContent(type) {
    const fallbacks = {
        calc: `
            <div class="page active" id="calculatorPage">
                <h1>🐾 Pet Calculator</h1>
                <p style="color: #ccc; text-align: center; padding: 40px;">
                    Content failed to load. Please refresh the page.
                </p>
            </div>
            <div class="page" id="grindPage">
                <h1>🏋️‍♂️ Grind Calculator</h1>
                <p style="color: #ccc; text-align: center; padding: 40px;">
                    Content failed to load. Please refresh the page.
                </p>
            </div>`,
        info: `
            <div class="page" id="boostsPage"><h1>🚀 Boosts</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="shinyPage"><h1>✨ Shiny Stats</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="secretPage"><h1>🔮 Secret Pets</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="codesPage"><h1>🎁 Codes</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="auraPage"><h1>🌟 Aura</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="trainerPage"><h1>🏆 Trainer</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="charmsPage"><h1>🔮 Charms</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="potionsPage"><h1>🧪 Potions & Food</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>
            <div class="page" id="worldsPage"><h1>🌍 Worlds</h1><p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p></div>`,
        moderation: `
            <div class="page" id="settingsPage">
                <h1>⚙️ Settings</h1>
                <p style="color: #ccc; text-align: center; padding: 40px;">
                    Settings content failed to load. Please refresh the page.
                </p>
            </div>`,
        other: `
            <div class="page" id="updatesPage">
                <h1>📝 Updates</h1>
                <p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p>
            </div>
            <div class="page" id="helpPage">
                <h1>🆘 Help</h1>
                <p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p>
            </div>
            <div class="page" id="peoplesPage">
                <h1>🙏 Peoples</h1>
                <p style="color: #ccc; text-align: center; padding: 20px;">Content loading failed.</p>
            </div>`
    };
    
    return fallbacks[type] || `<div class="page"><h1>Error</h1><p>Content failed to load.</p></div>`;
}

function generateAppContent(contents) {
    return `
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>

        <!-- Settings Gear Button -->
        <button class="settings-gear-btn" title="Settings" aria-label="Settings">⚙️</button>

        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3>Menu</h3>
                <button class="close-sidebar" aria-label="Close menu">×</button>
            </div>
            
            <nav class="nav-buttons">
                <!-- Calculator Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="calculatorButtons">
                        <div class="category-title">
                            <span class="category-icon">🧮</span>
                            <span>Calculator</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="calculatorButtons">
                        <button class="nav-btn active" data-page="calculator">🐾 Pet Calculator</button>
                        <button class="nav-btn" data-page="grind">🏋️‍♂️ Grind Calculator</button>
                    </div>
                </div>
                
                <!-- Info Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="infoButtons">
                        <div class="category-title">
                            <span class="category-icon">📋</span>
                            <span>Info</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="infoButtons">
                        <button class="nav-btn" data-page="boosts">🚀 Boosts</button>
                        <button class="nav-btn" data-page="shiny">✨ Shiny Stats</button>
                        <button class="nav-btn" data-page="secret">🔮 Secret Pets</button>
                        <button class="nav-btn" data-page="codes">🎁 Codes</button>
                        <button class="nav-btn" data-page="aura">🌟 Aura</button>
                        <button class="nav-btn" data-page="trainer">🏆 Trainer</button>
                        <button class="nav-btn" data-page="charms">🔮 Charms</button>
                        <button class="nav-btn" data-page="potions">🧪 Potions & Food</button>
                        <button class="nav-btn" data-page="worlds">🌍 Worlds</button>
                    </div>
                </div>

                <!-- Others Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="othersButtons">
                        <div class="category-title">
                            <span class="category-icon">🔧</span>
                            <span>Others</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="othersButtons">
                        <button class="nav-btn" data-page="updates">📝 Updates</button>
                        <button class="nav-btn" data-page="help">🆘 Help</button>
                        <button class="nav-btn" data-page="peoples">🙏 Peoples</button>
                    </div>
                </div>
            </nav>
            
            <!-- User Section -->
            <div class="sidebar-user">
                <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!">
                    Login (Soon...)
                </button>
            </div>
            
            <!-- Language Controls -->
            <div class="sidebar-controls">
                <div class="language-flags">
                    <button class="lang-flag-btn active" data-lang="en" title="English">🇺🇸</button>
                    <button class="lang-flag-btn" data-lang="uk" title="Українська">🇺🇦</button>
                    <button class="lang-flag-btn" data-lang="ru" title="Русский">🇷🇺</button>
                </div>
            </div>
        </aside>

        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
           
        <!-- Main Content -->
        <main class="container">
            ${contents.calc || getEmptyContent('calc')}
            ${contents.info || getEmptyContent('info')}
            ${contents.moderation || getEmptyContent('moderation')}
            ${contents.other || getEmptyContent('other')}
        </main>
    `;
}

function setupEvents() {
    console.log('Setting up events...');
    
    // This function is now simplified since all events are handled in general.js
    // We just need to ensure the DOM is ready
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !overlay) {
        console.error('Required elements not found');
        return;
    }
    
    console.log('Events setup completed');
}

function showContentLoadError(error) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    appContent.innerHTML = `
        <div class="container" style="text-align: center; padding: 40px;">
            <div style="color: #ff6b6b; font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h1 style="color: #D4AF37; margin-bottom: 15px;">Content Load Error</h1>
            <p style="color: #ccc; margin-bottom: 20px;">
                Failed to load application content after ${contentLoadAttempts} attempts
            </p>
            <button onclick="location.reload()" 
                    style="background: linear-gradient(135deg, #8B4513, #654321); 
                           border: none; color: #D4AF37; padding: 12px 24px; 
                           border-radius: 8px; cursor: pointer; font-size: 16px;">
                🔄 Refresh Page
            </button>
        </div>
    `;
}

// Global exports
Object.assign(window, {
    loadContent,
    setupEvents,
    showContentLoadError,
    generateAppContent
});

// Initialize
function initContentLoader() {
    console.log('Initializing content loader...');
    
    const startLoading = () => {
        setTimeout(() => loadContent(), 50);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
    } else {
        startLoading();
    }
}

// Start
initContentLoader();
