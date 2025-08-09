// Content loader script
console.log('🔄 Завантаження контенту...');

// Function to load content
async function loadContent() {
    try {
        const response = await fetch('index/content.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            appContent.innerHTML = content;
            console.log('✅ Контент завантажено успішно');
            
            // Wait a bit for DOM to be ready, then initialize
            setTimeout(() => {
                if (typeof initializeApp === 'function') {
                    initializeApp();
                } else {
                    console.error('❌ initializeApp function not found');
                }
            }, 100);
        } else {
            console.error('❌ app-content element not found');
        }
    } catch (error) {
        console.error('❌ Помилка завантаження контенту:', error);
        
        // Fallback - try to initialize anyway
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        }, 500);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}
