// Enhanced Content loader script - Fully Optimized with Better Error Handling
console.log('🔄 Content Loader v2.0 - Starting...');

let contentLoadAttempts = 0;
const MAX_CONTENT_LOAD_ATTEMPTS = 3;
let contentLoadingInProgress = false;

async function loadContent() {
    if (contentLoadingInProgress) {
        console.log('Content loading already in progress, skipping...');
        return;
    }
    
    contentLoadingInProgress = true;
    contentLoadAttempts++;
    
    try {
        console.log(`📥 Loading content files... (Attempt ${contentLoadAttempts})`);
        
        // Load all content files with timeout and retry logic
        const contentFiles = [
            { name: 'calc', url: 'index/content_calc.html' },
            { name: 'info', url: 'index/content_info.html' },
            { name: 'moderation', url: 'index/content_moderation.html' },
            { name: 'other', url: 'index/content_other.html' }
        ];
        
        const loadWithTimeout = async (file) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            try {
                const response = await fetch(file.url, { 
                    signal: controller.signal,
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const text = await response.text();
                if (!text || text.trim().length === 0) {
                    throw new Error(`Empty content received from ${file.name}`);
                }
                
                console.log(`✅ ${file.name} content loaded (${text.length} chars)`);
                return { name: file.name, content: text };
                
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error(`Timeout loading ${file.name}`);
                }
                throw error;
            }
        };

        // Load all files concurrently with individual error handling
        const results = await Promise.allSettled(
            contentFiles.map(file => loadWithTimeout(file))
        );
        
        const contents = {};
        const failedFiles = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                contents[result.value.name] = result.value.content;
            } else {
                const fileName = contentFiles[index].name;
                console.error(`❌ Failed to load ${fileName}:`, result.reason);
                failedFiles.push(fileName);
                contents[fileName] = getEmptyContent(fileName);
            }
        });
        
        if (failedFiles.length > 0 && failedFiles.length === contentFiles.length) {
            throw new Error(`All content files failed to load: ${failedFiles.join(', ')}`);
        }
        
        if (failedFiles.length > 0) {
            console.warn(`⚠️ Some content files failed to load: ${failedFiles.join(', ')}, using fallback content`);
        }

        const appContent = document.getElementById('app-content');
        if (!appContent) {
            throw new Error('app-content element not found in DOM');
        }
        
        // Generate the complete content structure
        const fullContent = generateAppContent(contents);
        
        // Inject content with error boundary
        try {
            appContent.innerHTML = fullContent;
            console.log('✅ Content injected successfully');
        } catch (error) {
            console.error('❌ Error injecting content:', error);
            throw new Error('Failed to inject content into DOM');
        }
        
        // Setup event listeners with error handling
        setupSidebarEvents();
        
        // Dispatch content loaded event
        document.dispatchEvent(new CustomEvent('contentLoaded', {
            detail: { 
                loadedFiles: Object.keys(contents),
                failedFiles: failedFiles,
                attempt: contentLoadAttempts
            }
        }));
        
        // Initialize app after brief delay
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                console.log('🚀 Triggering app initialization...');
                window.initializeApp();
            } else {
                console.warn('⚠️ window.initializeApp not found');
            }
        }, 200);
        
        console.log('✅ Content loading completed successfully');
        
    } catch (error) {
        console.error('❌ Critical error in content loading:', error);
        
        if (contentLoadAttempts < MAX_CONTENT_LOAD_ATTEMPTS) {
            console.log(`🔄 Retrying content loading... (${contentLoadAttempts + 1}/${MAX_CONTENT_LOAD_ATTEMPTS})`);
            contentLoadingInProgress = false;
            setTimeout(() => loadContent(), 2000 * contentLoadAttempts); // Progressive delay
            return;
        }
        
        // Show error screen after all attempts failed
        showContentLoadError(error);
        
        // Still try to initialize app with minimal functionality
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                console.log('🚀 Attempting app initialization despite content load failure...');
                window.initializeApp();
            }
        }, 1000);
        
    } finally {
        contentLoadingInProgress = false;
    }
}

function getEmptyContent(type) {
    const fallbackContents = {
        calc: `
            <div class="page active" id="calculatorPage">
                <div class="calculator-container">
                    <h1>🐾 Pet Calculator</h1>
                    <div class="error-message">
                        <p>⚠️ Calculator content failed to load. Please refresh the page.</p>
                        <button onclick="location.reload()">🔄 Refresh</button>
                    </div>
                </div>
            </div>
            <div class="page" id="grindPage">
                <h1>🏋️‍♂️ Grind Calculator</h1>
                <div class="error-message">
                    <p>⚠️ Grind calculator content failed to load. Please refresh the page.</p>
                </div>
            </div>`,
        info: `
            <div class="page" id="boostsPage"><h1>🚀 Boosts</h1><p>Content loading failed.</p></div>
            <div class="page" id="shinyPage"><h1>✨ Shiny Stats</h1><p>Content loading failed.</p></div>
            <div class="page" id="secretPage"><h1>🔮 Secret Pets</h1><p>Content loading failed.</p></div>
            <div class="page" id="codesPage"><h1>🎁 Codes</h1><p>Content loading failed.</p></div>
            <div class="page" id="auraPage"><h1>🌟 Aura</h1><p>Content loading failed.</p></div>
            <div class="page" id="trainerPage"><h1>🏆 Trainer</h1><p>Content loading failed.</p></div>
            <div class="page" id="charmsPage"><h1>🔮 Charms</h1><p>Content loading failed.</p></div>
            <div class="page" id="potionsPage"><h1>🧪 Potions & Food</h1><p>Content loading failed.</p></div>
            <div class="page" id="worldsPage"><h1>🌍 Worlds</h1><p>Content loading failed.</p></div>`,
        moderation: `
            <div class="page" id="settingsPage">
                <h1>⚙️ Settings</h1>
                <div class="error-message">
                    <p>⚠️ Settings content failed to load. Please refresh the page.</p>
                </div>
            </div>`,
        other: `
            <div class="page" id="updatesPage">
                <h1>📝 Updates</h1>
                <div class="error-message">
                    <p>⚠️ Updates content failed to load. Please refresh the page.</p>
                </div>
            </div>
            <div class="page" id="helpPage">
                <h1>🆘 Help</h1>
                <div class="error-message">
                    <p>⚠️ Help content failed to load. Please refresh the page.</p>
                </div>
            </div>
            <div class="page" id="peoplesPage">
                <h1>🙏 Peoples</h1>
                <div class="error-message">
                    <p>⚠️ Peoples content failed to load. Please refresh the page.</p>
                </div>
            </div>`
    };
    
    return fallbackContents[type] || `<div class="page"><h1>Error</h1><p>Content failed to load.</p></div>`;
}

function generateAppContent(contents) {
    return `
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" onclick="window.toggleMobileMenu()" aria-label="Toggle menu">
            ☰
        </button>

        <!-- Settings Gear Button -->
        <button class="settings-gear-btn" onclick="window.switchPage('settings')" title="Settings" aria-label="Settings">
            ⚙️
        </button>

        <!-- Enhanced Sidebar Navigation -->
        <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
            <div class="sidebar-header">
                <h3>Menu</h3>
                <button class="close-sidebar" onclick="window.closeSidebar()" aria-label="Close menu">×</button>
            </div>
            
            <nav class="nav-buttons" role="menubar">
                <!-- Calculator Category -->
                <div class="nav-category" role="none">
                    <div class="category-header" data-category="calculatorButtons" role="menuitem" tabindex="0" 
                         aria-expanded="false" aria-controls="calculatorButtons">
                        <div class="category-title">
                            <span class="category-icon" aria-hidden="true">🧮</span>
                            <span>Calculator</span>
                        </div>
                        <span class="category-toggle" aria-hidden="true">▼</span>
                    </div>
                    <div class="category-buttons" id="calculatorButtons" role="group" aria-labelledby="calculator-category">
                        <button class="nav-btn active" data-page="calculator" role="menuitem">
                            🐾 Pet Calculator
                        </button>
                        <button class="nav-btn" data-page="grind" role="menuitem">
                            🏋️‍♂️ Grind Calculator
                        </button>
                    </div>
                </div>
                
                <!-- Info Category -->
                <div class="nav-category" role="none">
                    <div class="category-header" data-category="infoButtons" role="menuitem" tabindex="0"
                         aria-expanded="false" aria-controls="infoButtons">
                        <div class="category-title">
                            <span class="category-icon" aria-hidden="true">📋</span>
                            <span>Info</span>
                        </div>
                        <span class="category-toggle" aria-hidden="true">▼</span>
                    </div>
                    <div class="category-buttons" id="infoButtons" role="group" aria-labelledby="info-category">
                        <button class="nav-btn" data-page="boosts" role="menuitem">🚀 Boosts</button>
                        <button class="nav-btn" data-page="shiny" role="menuitem">✨ Shiny Stats</button>
                        <button class="nav-btn" data-page="secret" role="menuitem">🔮 Secret Pets</button>
                        <button class="nav-btn" data-page="codes" role="menuitem">🎁 Codes</button>
                        <button class="nav-btn" data-page="aura" role="menuitem">🌟 Aura</button>
                        <button class="nav-btn" data-page="trainer" role="menuitem">🏆 Trainer</button>
                        <button class="nav-btn" data-page="charms" role="menuitem">🔮 Charms</button>
                        <button class="nav-btn" data-page="potions" role="menuitem">🧪 Potions & Food</button>
                        <button class="nav-btn" data-page="worlds" role="menuitem">🌍 Worlds</button>
                    </div>
                </div>

                <!-- Others Category -->
                <div class="nav-category" role="none">
                    <div class="category-header" data-category="othersButtons" role="menuitem" tabindex="0"
                         aria-expanded="false" aria-controls="othersButtons">
                        <div class="category-title">
                            <span class="category-icon" aria-hidden="true">🔧</span>
                            <span>Others</span>
                        </div>
                        <span class="category-toggle" aria-hidden="true">▼</span>
                    </div>
                    <div class="category-buttons" id="othersButtons" role="group" aria-labelledby="others-category">
                        <button class="nav-btn" data-page="updates" role="menuitem">📝 Updates</button>
                        <button class="nav-btn" data-page="help" role="menuitem">🆘 Help</button>
                        <button class="nav-btn" data-page="peoples" role="menuitem">🙏 Peoples</button>
                    </div>
                </div>
            </nav>
            
            <!-- User Section -->
            <div class="sidebar-user" id="sidebarUser">
                <button class="auth-btn-sidebar disabled" id="authButton" 
                        title="Coming Soon!" onclick="window.handleAuthAction()" 
                        aria-label="Login (Coming Soon)">
                    Login (Soon...)
                </button>
            </div>
            
            <!-- Language Controls -->
            <div class="sidebar-controls">
                <div class="language-flags" role="group" aria-label="Language selection">
                    <button class="lang-flag-btn active" data-lang="en" title="English" 
                            aria-label="Switch to English">🇺🇸</button>
                    <button class="lang-flag-btn" data-lang="uk" title="Українська" 
                            aria-label="Switch to Ukrainian">🇺🇦</button>
                    <button class="lang-flag-btn" data-lang="ru" title="Русский" 
                            aria-label="Switch to Russian">🇷🇺</button>
                </div>
            </div>
        </aside>

        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>
           
        <!-- Main Content Container -->
        <main class="container" role="main">
            ${contents.calc || getEmptyContent('calc')}
            ${contents.info || getEmptyContent('info')}
            ${contents.moderation || getEmptyContent('moderation')}
            ${contents.other || getEmptyContent('other')}
        </main>
    `;
}

function setupSidebarEvents() {
    console.log('🔧 Setting up sidebar events...');
    
    try {
        // Enhanced category header event listeners with keyboard support
        const categoryHeaders = document.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            const categoryId = header.getAttribute('data-category');
            if (!categoryId) {
                console.warn('Category header missing data-category attribute');
                return;
            }
            
            // Click event
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.toggleCategory === 'function') {
                    window.toggleCategory(categoryId);
                    updateAriaExpanded(header, categoryId);
                } else {
                    console.error('window.toggleCategory function not available');
                }
            };
            
            // Keyboard event
            const keyHandler = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickHandler(e);
                }
            };
            
            header.addEventListener('click', clickHandler);
            header.addEventListener('keydown', keyHandler);
        });
        
        // Enhanced navigation button event listeners
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            const page = btn.getAttribute('data-page');
            if (!page) {
                console.warn('Navigation button missing data-page attribute');
                return;
            }
            
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.switchPage === 'function') {
                    console.log(`🔄 Switching to page: ${page}`);
                    window.switchPage(page);
                } else {
                    console.error('window.switchPage function not available');
                }
            };
            
            // Keyboard support
            const keyHandler = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickHandler(e);
                }
            };
            
            btn.addEventListener('click', clickHandler);
            btn.addEventListener('keydown', keyHandler);
        });
        
        // Enhanced language button event listeners
        const langButtons = document.querySelectorAll('.lang-flag-btn');
        langButtons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (!lang) {
                console.warn('Language button missing data-lang attribute');
                return;
            }
            
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.switchAppLanguage === 'function') {
                    console.log(`🌐 Switching language to: ${lang}`);
                    window.switchAppLanguage(lang);
                } else {
                    console.error('window.switchAppLanguage function not available');
                }
            };
            
            btn.addEventListener('click', clickHandler);
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickHandler(e);
                }
            });
        });

        // Sidebar overlay event listener with improved error handling
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.closeSidebar === 'function') {
                    window.closeSidebar();
                } else {
                    console.error('window.closeSidebar function not available');
                }
            });
        } else {
            console.warn('Sidebar overlay not found');
        }
        
        // Focus management for accessibility
        setupFocusManagement();
        
        console.log('✅ Sidebar events set up successfully');
        
    } catch (error) {
        console.error('❌ Error setting up sidebar events:', error);
        // Try to setup basic functionality
        setupBasicEvents();
    }
}

function updateAriaExpanded(header, categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    if (categoryButtons) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        header.setAttribute('aria-expanded', isExpanded.toString());
    }
}

function setupFocusManagement() {
    // Focus trap for sidebar when opened
    const sidebar = document.getElementById('sidebar');
    const focusableElements = sidebar?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (sidebar && focusableElements?.length) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        sidebar.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
}

function setupBasicEvents() {
    console.log('🔧 Setting up basic events as fallback...');
    
    // Basic navigation without error checking
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.getAttribute('data-page');
            if (page && window.switchPage) {
                window.switchPage(page);
            }
        });
    });
    
    // Basic category toggles
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const categoryId = header.getAttribute('data-category');
            if (categoryId && window.toggleCategory) {
                window.toggleCategory(categoryId);
            }
        });
    });
}

function showContentLoadError(error) {
    console.error('📱 Showing content load error screen');
    
    const appContent = document.getElementById('app-content');
    if (!appContent) {
        console.error('Cannot show error - app-content element not found');
        return;
    }
    
    const errorDetails = error instanceof Error ? error.message : 'Unknown error occurred';
    const timestamp = new Date().toLocaleString();
    
    appContent.innerHTML = `
        <div class="container" style="text-align: center; padding: 40px; max-width: 600px;">
            <div style="color: #ff6b6b; font-size: 48px; margin-bottom: 20px;" aria-hidden="true">⚠️</div>
            
            <h1 style="color: #D4AF37; margin-bottom: 15px; font-size: 2em;">
                Content Load Error
            </h1>
            
            <p style="color: #ccc; margin-bottom: 20px; font-size: 1.1em;">
                Failed to load application content after ${contentLoadAttempts} attempts
            </p>
            
            <details style="margin-bottom: 25px; text-align: left; background: rgba(255, 107, 107, 0.1); padding: 15px; border-radius: 8px;">
                <summary style="color: #ff6b6b; cursor: pointer; font-weight: bold;">
                    Technical Details
                </summary>
                <pre style="color: #999; font-size: 12px; margin-top: 10px; white-space: pre-wrap; word-break: break-word;">
Error: ${errorDetails}
Time: ${timestamp}
Attempts: ${contentLoadAttempts}/${MAX_CONTENT_LOAD_ATTEMPTS}
User Agent: ${navigator.userAgent}
                </pre>
            </details>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="location.reload()" 
                        style="background: linear-gradient(135deg, #8B4513, #654321); border: none; color: #D4AF37; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; 
                               font-weight: bold; transition: all 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'">
                    🔄 Refresh Page
                </button>
                
                <button onclick="window.loadContent()" 
                        style="background: linear-gradient(135deg, #4CAF50, #45a049); border: none; color: white; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; 
                               font-weight: bold; transition: all 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'">
                    🔄 Retry Loading
                </button>
            </div>
            
            <p style="color: #888; margin-top: 25px; font-size: 14px;">
                If this problem persists, please try:
                <br>• Clearing your browser cache
                <br>• Checking your internet connection  
                <br>• Trying a different browser
            </p>
        </div>
    `;
}

// Enhanced global exports with error handling
const contentLoaderExports = {
    loadContent,
    setupSidebarEvents,
    showContentLoadError,
    generateAppContent,
    getEmptyContent,
    setupFocusManagement,
    updateAriaExpanded
};

// Safe global assignment
try {
    Object.assign(window, contentLoaderExports);
    console.log('✅ Content loader functions exported to global scope');
} catch (error) {
    console.error('❌ Failed to export content loader functions:', error);
}

// Enhanced initialization with better error handling and retry logic
function initializeContentLoader() {
    console.log('🚀 Initializing content loader...');
    
    // Reset state
    contentLoadAttempts = 0;
    contentLoadingInProgress = false;
    
    const startLoading = () => {
        console.log(`📋 Document ready state: ${document.readyState}`);
        setTimeout(() => {
            loadContent().catch(error => {
                console.error('❌ Content loader initialization failed:', error);
            });
        }, 50);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoading);
    } else {
        startLoading();
    }
    
    // Fallback initialization timer
    setTimeout(() => {
        if (!contentLoadingInProgress && contentLoadAttempts === 0) {
            console.warn('⚠️ Fallback content loading triggered');
            loadContent();
        }
    }, 5000);
}

// Global error handler for content loader
window.addEventListener('error', (event) => {
    if (event.filename?.includes('content_loader') || event.message?.includes('content')) {
        console.error('Content Loader Error:', event.error || event.message);
        
        // If content loading failed completely, try one more time
        if (!contentLoadingInProgress && contentLoadAttempts < MAX_CONTENT_LOAD_ATTEMPTS) {
            setTimeout(() => {
                console.log('🔄 Attempting recovery content load...');
                loadContent();
            }, 3000);
        }
    }
});

// Performance monitoring
if (window.performance && window.performance.mark) {
    window.performance.mark('content-loader-start');
    
    document.addEventListener('contentLoaded', () => {
        window.performance.mark('content-loader-end');
        try {
            window.performance.measure('content-loader-duration', 'content-loader-start', 'content-loader-end');
            const measures = window.performance.getEntriesByName('content-loader-duration');
            if (measures.length > 0) {
                console.log(`📊 Content loading took ${Math.round(measures[0].duration)}ms`);
            }
        } catch (e) {
            console.warn('Performance measurement failed:', e);
        }
    });
}

// Start the content loader
console.log('🎯 Starting content loader initialization...');
initializeContentLoader();
