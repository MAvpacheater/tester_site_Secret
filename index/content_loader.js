// Fixed Content Loader - Enhanced Error Handling & DOM Setup
console.log('📄 Content Loader v2.2 - Enhanced Loading System');

let contentLoadAttempts = 0;
const MAX_ATTEMPTS = 3;
let loadingInProgress = false;
let contentLoaded = false;

async function loadContent() {
    if (loadingInProgress || contentLoaded) {
        console.log('⚠️ Content loading already in progress or completed');
        return;
    }
    
    loadingInProgress = true;
    contentLoadAttempts++;
    
    try {
        console.log(`📥 Loading content... (Attempt ${contentLoadAttempts})`);
        updateLoadingText('Loading content files...');
        
        const contentFiles = [
            { name: 'calc', url: 'index/content_calc.html', required: true },
            { name: 'info', url: 'index/content_info.html', required: true },
            { name: 'moderation', url: 'index/content_moderation.html', required: false },
            { name: 'other', url: 'index/content_other.html', required: true }
        ];
        
        const loadFile = async (file) => {
            try {
                const response = await fetch(file.url, { 
                    cache: 'no-cache',
                    headers: { 'Cache-Control': 'no-cache' }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} for ${file.name}`);
                }
                
                const text = await response.text();
                if (!text.trim()) {
                    throw new Error(`Empty content from ${file.name}`);
                }
                
                console.log(`✅ Loaded ${file.name}: ${text.length} characters`);
                return { name: file.name, content: text, loaded: true };
            } catch (error) {
                console.error(`❌ Failed to load ${file.name}:`, error.message);
                return { 
                    name: file.name, 
                    content: getEmptyContent(file.name), 
                    loaded: false,
                    error: error.message
                };
            }
        };

        updateLoadingText('Fetching files...');
        const results = await Promise.all(contentFiles.map(loadFile));
        
        const contents = {};
        const failedFiles = [];
        const loadedFiles = [];
        
        results.forEach((result) => {
            contents[result.name] = result.content;
            if (result.loaded) {
                loadedFiles.push(result.name);
            } else {
                failedFiles.push(result.name);
            }
        });
        
        // Check if critical files loaded
        const criticalFiles = contentFiles.filter(f => f.required).map(f => f.name);
        const criticalFailed = failedFiles.filter(f => criticalFiles.includes(f));
        
        if (criticalFailed.length > 0 && contentLoadAttempts >= MAX_ATTEMPTS) {
            throw new Error(`Critical files failed: ${criticalFailed.join(', ')}`);
        }

        updateLoadingText('Injecting content...');
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            throw new Error('app-content element not found in DOM');
        }
        
        // Generate and inject content
        const fullContent = generateAppContent(contents);
        appContent.innerHTML = fullContent;
        console.log('✅ Content injected successfully');
        
        // Wait for DOM to be ready
        updateLoadingText('Setting up interface...');
        await waitForDOMElements();
        
        // Setup events
        setTimeout(() => {
            setupBasicEvents();
            console.log('✅ Basic events set up');
        }, 100);
        
        // Mark as loaded
        contentLoaded = true;
        
        // Dispatch content loaded event
        document.dispatchEvent(new CustomEvent('contentLoaded', {
            detail: { 
                loaded: loadedFiles, 
                failed: failedFiles,
                attempt: contentLoadAttempts
            }
        }));
        
        // Initialize app after short delay
        updateLoadingText('Initializing application...');
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
                console.log('✅ App initialization triggered');
            } else {
                console.error('❌ initializeApp function not found');
            }
        }, 300);
        
        console.log(`✅ Content loading completed successfully (${loadedFiles.length}/${results.length} files)`);
        
    } catch (error) {
        console.error('❌ Content loading error:', error);
        
        if (contentLoadAttempts < MAX_ATTEMPTS) {
            loadingInProgress = false;
            updateLoadingText(`Retrying... (${contentLoadAttempts}/${MAX_ATTEMPTS})`);
            setTimeout(() => loadContent(), 2000);
            return;
        }
        
        showContentLoadError(error);
    } finally {
        loadingInProgress = false;
    }
}

// Wait for essential DOM elements
async function waitForDOMElements(maxWait = 5000) {
    const startTime = Date.now();
    const requiredElements = ['sidebar', 'sidebarOverlay'];
    
    return new Promise((resolve) => {
        const checkElements = () => {
            const missing = requiredElements.filter(id => !document.getElementById(id));
            
            if (missing.length === 0) {
                console.log('✅ All required DOM elements found');
                resolve(true);
            } else if (Date.now() - startTime > maxWait) {
                console.warn(`⚠️ Timeout waiting for elements: ${missing.join(', ')}`);
                resolve(false);
            } else {
                setTimeout(checkElements, 100);
            }
        };
        
        checkElements();
    });
}

// Basic event setup (before full app initialization)
function setupBasicEvents() {
    console.log('⚙️ Setting up basic events...');
    
    // Mobile menu toggle - immediate setup
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        // Remove existing listeners
        mobileToggle.replaceWith(mobileToggle.cloneNode(true));
        const newToggle = document.querySelector('.mobile-menu-toggle');
        
        newToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Mobile menu toggle clicked (basic)');
            
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            if (sidebar && overlay) {
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('show');
                } else {
                    sidebar.classList.add('open');
                    overlay.classList.add('show');
                }
            }
        });
        console.log('✅ Mobile toggle basic event added');
    }
    
    // Settings gear - immediate setup
    const settingsGear = document.querySelector('.settings-gear-btn');
    if (settingsGear) {
        settingsGear.replaceWith(settingsGear.cloneNode(true));
        const newGear = document.querySelector('.settings-gear-btn');
        
        newGear.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚙️ Settings gear clicked (basic)');
            
            // Basic page switching
            if (typeof window.switchPage === 'function') {
                window.switchPage('settings');
            } else {
                // Fallback - direct page switching
                document.querySelectorAll('.page').forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });
                
                const settingsPage = document.getElementById('settingsPage');
                if (settingsPage) {
                    settingsPage.classList.add('active');
                    settingsPage.style.display = 'block';
                }
            }
        });
        console.log('✅ Settings gear basic event added');
    }
    
    // Overlay close - immediate setup
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            }
        });
        console.log('✅ Overlay basic event added');
    }
    
    // Close sidebar button - immediate setup
    const closeBtn = document.querySelector('.close-sidebar');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar && overlay) {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            }
        });
        console.log('✅ Close button basic event added');
    }
    
    console.log('✅ Basic events setup completed');
}

function getEmptyContent(type) {
    const fallbacks = {
        calc: `
            <div class="page active" id="calculatorPage">
                <div class="header-controls">
                    <h1>🐾 Pet Calculator</h1>
                    <button class="settings-btn" title="Settings">⚙️</button>
                </div>
                <div style="color: #ccc; text-align: center; padding: 40px; background: rgba(139, 69, 19, 0.1); border-radius: 15px; margin: 20px 0;">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                    <h3>Content Loading Failed</h3>
                    <p style="margin: 10px 0;">Calculator content could not be loaded.</p>
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #8B4513, #654321); border: none; color: #FFD700; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 15px;">
                        🔄 Refresh Page
                    </button>
                </div>
            </div>
            <div class="page" id="grindPage">
                <div class="header-controls">
                    <h1>🏋️‍♂️ Grind Calculator</h1>
                    <button class="settings-btn" title="Settings">⚙️</button>
                </div>
                <div style="color: #ccc; text-align: center; padding: 40px; background: rgba(139, 69, 19, 0.1); border-radius: 15px; margin: 20px 0;">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                    <h3>Content Loading Failed</h3>
                    <p style="margin: 10px 0;">Grind calculator content could not be loaded.</p>
                </div>
            </div>`,
        info: `
            <div class="page" id="boostsPage">
                <h1>🚀 Boosts</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="shinyPage">
                <h1>✨ Shiny Stats</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="secretPage">
                <h1>🔮 Secret Pets</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="codesPage">
                <h1>🎁 Codes</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="auraPage">
                <h1>🌟 Aura</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="trainerPage">
                <h1>🏆 Trainer</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="charmsPage">
                <h1>🔮 Charms</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="potionsPage">
                <h1>🧪 Potions & Food</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="worldsPage">
                <h1>🌍 Worlds</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>`,
        moderation: `
            <div class="page" id="settingsPage">
                <h1>⚙️ Settings</h1>
                <div style="color: #ccc; text-align: center; padding: 40px; background: rgba(139, 69, 19, 0.1); border-radius: 15px; margin: 20px 0;">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                    <h3>Settings Content Failed</h3>
                    <p style="margin: 10px 0;">Settings content could not be loaded.</p>
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #8B4513, #654321); border: none; color: #FFD700; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 15px;">
                        🔄 Refresh Page
                    </button>
                </div>
            </div>`,
        other: `
            <div class="page" id="updatesPage">
                <h1>📝 Updates</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="helpPage">
                <h1>🆘 Help</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>
            <div class="page" id="peoplesPage">
                <h1>🙏 Peoples</h1>
                <div class="error-content">Content loading failed. Please refresh the page.</div>
            </div>`
    };
    
    return fallbacks[type] || `
        <div class="page">
            <h1>❌ Error</h1>
            <div class="error-content">Content failed to load.</div>
        </div>`;
}

function generateAppContent(contents) {
    return `
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu" title="Menu">☰</button>

        <!-- Settings Gear Button -->
        <button class="settings-gear-btn" title="Settings" aria-label="Open Settings">⚙️</button>

        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar" role="navigation">
            <div class="sidebar-header">
                <h3>Menu</h3>
                <button class="close-sidebar" aria-label="Close menu" title="Close">×</button>
            </div>
            
            <nav class="nav-buttons">
                <!-- Calculator Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="calculatorButtons" role="button" tabindex="0">
                        <div class="category-title">
                            <span class="category-icon">🧮</span>
                            <span>Calculator</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="calculatorButtons" role="group">
                        <button class="nav-btn active" data-page="calculator" type="button">🐾 Pet Calculator</button>
                        <button class="nav-btn" data-page="grind" type="button">🏋️‍♂️ Grind Calculator</button>
                    </div>
                </div>
                
                <!-- Info Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="infoButtons" role="button" tabindex="0">
                        <div class="category-title">
                            <span class="category-icon">📋</span>
                            <span>Info</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="infoButtons" role="group">
                        <button class="nav-btn" data-page="boosts" type="button">🚀 Boosts</button>
                        <button class="nav-btn" data-page="shiny" type="button">✨ Shiny Stats</button>
                        <button class="nav-btn" data-page="secret" type="button">🔮 Secret Pets</button>
                        <button class="nav-btn" data-page="codes" type="button">🎁 Codes</button>
                        <button class="nav-btn" data-page="aura" type="button">🌟 Aura</button>
                        <button class="nav-btn" data-page="trainer" type="button">🏆 Trainer</button>
                        <button class="nav-btn" data-page="charms" type="button">🔮 Charms</button>
                        <button class="nav-btn" data-page="potions" type="button">🧪 Potions & Food</button>
                        <button class="nav-btn" data-page="worlds" type="button">🌍 Worlds</button>
                    </div>
                </div>

                <!-- Others Category -->
                <div class="nav-category">
                    <div class="category-header" data-category="othersButtons" role="button" tabindex="0">
                        <div class="category-title">
                            <span class="category-icon">🔧</span>
                            <span>Others</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-buttons" id="othersButtons" role="group">
                        <button class="nav-btn" data-page="updates" type="button">📝 Updates</button>
                        <button class="nav-btn" data-page="help" type="button">🆘 Help</button>
                        <button class="nav-btn" data-page="peoples" type="button">🙏 Peoples</button>
                    </div>
                </div>
            </nav>
            
            <!-- User Section -->
            <div class="sidebar-user">
                <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!" disabled>
                    Login (Soon...)
                </button>
            </div>
            
            <!-- Language Controls -->
            <div class="sidebar-controls">
                <div class="language-flags" role="group" aria-label="Language selection">
                    <button class="lang-flag-btn active" data-lang="en" title="English" aria-label="Switch to English">🇺🇸</button>
                    <button class="lang-flag-btn" data-lang="uk" title="Українська" aria-label="Switch to Ukrainian">🇺🇦</button>
                    <button class="lang-flag-btn" data-lang="ru" title="Русский" aria-label="Switch to Russian">🇷🇺</button>
                </div>
            </div>
        </aside>

        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay" role="button" tabindex="-1" aria-label="Close sidebar"></div>
           
        <!-- Main Content -->
        <main class="container" role="main">
            <!-- Inject styles for error content -->
            <style>
                .error-content {
                    color: #ccc;
                    text-align: center;
                    padding: 40px;
                    background: rgba(139, 69, 19, 0.1);
                    border-radius: 15px;
                    margin: 20px 0;
                    border: 2px dashed rgba(139, 69, 19, 0.3);
                }
                .error-content:before {
                    content: '⚠️';
                    display: block;
                    font-size: 48px;
                    margin-bottom: 15px;
                }
            </style>
            
            ${contents.calc || getEmptyContent('calc')}
            ${contents.info || getEmptyContent('info')}
            ${contents.moderation || getEmptyContent('moderation')}
            ${contents.other || getEmptyContent('other')}
        </main>
    `;
}

function showContentLoadError(error) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    console.error('💥 Showing content load error:', error);
    
    appContent.innerHTML = `
        <!-- Mobile Menu Toggle (Fallback) -->
        <button class="mobile-menu-toggle" disabled style="opacity: 0.5;" title="Menu unavailable">☰</button>
        
        <div class="container" style="text-align: center; padding: 40px;">
            <div style="color: #ff6b6b; font-size: 64px; margin-bottom: 30px; animation: bounce 2s infinite;">⚠️</div>
            <h1 style="color: #D4AF37; margin-bottom: 20px; font-size: 2em;">Content Load Error</h1>
            <div style="background: rgba(255, 107, 107, 0.1); border-radius: 15px; padding: 30px; margin: 30px 0; border: 2px solid rgba(255, 107, 107, 0.3);">
                <p style="color: #ccc; margin-bottom: 15px; font-size: 1.1em;">
                    Failed to load application content after <strong>${contentLoadAttempts}</strong> attempts
                </p>
                <p style="color: #aaa; font-size: 0.9em; margin-bottom: 25px;">
                    Error: ${error.message || 'Unknown error occurred'}
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" 
                            style="background: linear-gradient(135deg, #8B4513, #654321); 
                                   border: 2px solid #D4AF37; color: #FFD700; 
                                   padding: 15px 25px; border-radius: 12px; 
                                   cursor: pointer; font-size: 16px; font-weight: 600;
                                   transition: all 0.3s ease;">
                        🔄 Refresh Page
                    </button>
                    <button onclick="window.location.href = window.location.href.split('?')[0]" 
                            style="background: linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 67, 33, 0.9)); 
                                   border: 2px solid #8B4513; color: #D4AF37; 
                                   padding: 15px 25px; border-radius: 12px; 
                                   cursor: pointer; font-size: 16px; font-weight: 600;
                                   transition: all 0.3s ease;">
                        🏠 Reset App
                    </button>
                </div>
            </div>
            <div style="font-size: 0.85em; color: #888; margin-top: 30px;">
                <p>If this problem persists, please check:</p>
                <ul style="text-align: left; max-width: 400px; margin: 15px auto; color: #aaa;">
                    <li>Your internet connection</li>
                    <li>That all content files are available</li>
                    <li>Browser console for detailed errors</li>
                </ul>
            </div>
        </div>
        
        <style>
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
        </style>
    `;
}

function updateLoadingText(text) {
    const subtitle = document.querySelector('.loading-subtitle');
    if (subtitle) {
        subtitle.textContent = text;
        console.log(`📝 Loading: ${text}`);
    }
}

// Global exports
Object.assign(window, {
    loadContent,
    setupBasicEvents,
    showContentLoadError,
    generateAppContent,
    waitForDOMElements,
    getEmptyContent,
    updateLoadingText
});

// Enhanced initialization
function initContentLoader() {
    console.log('🚀 Initializing enhanced content loader...');
    
    const startLoading = () => {
        console.log('📄 Starting content loading process...');
        setTimeout(() => {
            loadContent();
        }, 100);
    };
    
    // Handle various DOM ready states
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
        console.log('📅 Waiting for DOMContentLoaded...');
    } else {
        console.log('📄 DOM already ready, starting immediately...');
        startLoading();
    }
    
    // Backup timer in case events don't fire
    setTimeout(() => {
        if (!contentLoaded && !loadingInProgress) {
            console.warn('⏰ Backup timer triggered, forcing content load...');
            loadContent();
        }
    }, 3000);
}

// Error recovery
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('content_loader')) {
        console.error('💥 Content loader error:', e.error);
        if (!contentLoaded && contentLoadAttempts < MAX_ATTEMPTS) {
            setTimeout(() => {
                console.log('🔄 Attempting recovery...');
                loadContent();
            }, 2000);
        }
    }
});

// Start the content loader
initContentLoader();

console.log('✅ Enhanced Content Loader v2.2 initialized');
