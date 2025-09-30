// SHARED CALCULATOR LOGIC
// calc/system/logic.js

/**
 * Common utilities and logic shared across all calculators
 */

// ============================================================================
// LANGUAGE MANAGEMENT
// ============================================================================

/**
 * Get current application language with fallback
 * @returns {string} Language code (en, uk, ru)
 */
function getCurrentAppLanguage() {
    if (typeof getCurrentLanguage === 'function') {
        return getCurrentLanguage();
    }
    return localStorage.getItem('selectedLanguage') || 'en';
}

/**
 * Setup language change listener for a calculator
 * @param {Function} updateCallback - Function to call when language changes
 */
function setupLanguageListener(updateCallback) {
    document.addEventListener('languageChanged', (e) => {
        if (e.detail?.language) {
            updateCallback(e.detail.language);
        }
    });
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

/**
 * Add Enter key support to an input field
 * @param {string} inputId - ID of the input element
 * @param {Function} callback - Function to call on Enter press
 */
function addEnterKeyListener(inputId, callback) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                callback();
            }
        });
    }
}

/**
 * Add input listener to clear error messages
 * @param {string} inputId - ID of the input element
 * @param {string} errorId - ID of the error message element
 */
function addErrorClearListener(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.addEventListener('input', () => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }
}

/**
 * Parse and validate numeric input
 * @param {string} value - Input value to parse
 * @param {Object} options - Validation options
 * @returns {Object} {valid: boolean, value: number, error: string}
 */
function parseNumericInput(value, options = {}) {
    const {
        allowEmpty = false,
        min = null,
        max = null,
        integer = false
    } = options;

    if (!value || value.trim() === '') {
        return {
            valid: allowEmpty,
            value: null,
            error: allowEmpty ? null : 'empty'
        };
    }

    const parsed = parseFloat(value);

    if (isNaN(parsed)) {
        return { valid: false, value: null, error: 'invalid' };
    }

    if (integer && !Number.isInteger(parsed)) {
        return { valid: false, value: parsed, error: 'not_integer' };
    }

    if (min !== null && parsed < min) {
        return { valid: false, value: parsed, error: 'too_small' };
    }

    if (max !== null && parsed > max) {
        return { valid: false, value: parsed, error: 'too_large' };
    }

    return { valid: true, value: parsed, error: null };
}

// ============================================================================
// UI UTILITIES
// ============================================================================

/**
 * Toggle visibility of a panel
 * @param {string} panelId - ID of the panel element
 */
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('show');
    }
}

/**
 * Show result section with animation
 * @param {string} sectionId - ID of the result section
 * @param {number} delay - Delay before showing (ms)
 */
function showResultSection(sectionId, delay = 100) {
    const section = document.getElementById(sectionId);
    if (section) {
        setTimeout(() => section.classList.add('show'), delay);
    }
}

/**
 * Hide result section
 * @param {string} sectionId - ID of the result section
 */
function hideResultSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('show');
    }
}

/**
 * Display error message
 * @param {string} errorId - ID of error element
 * @param {string} message - Error message to display
 */
function showError(errorId, message) {
    const error = document.getElementById(errorId);
    if (error && message) {
        error.textContent = message;
        error.style.display = 'block';
    }
}

/**
 * Clear error message
 * @param {string} errorId - ID of error element
 */
function clearError(errorId) {
    const error = document.getElementById(errorId);
    if (error) {
        error.textContent = '';
        error.style.display = 'none';
    }
}

/**
 * Update text content of an element
 * @param {string} elementId - ID of the element
 * @param {string} text - Text to set
 */
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element && text !== undefined) {
        element.textContent = text;
    }
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with locale-specific formatting
 * @param {number} value - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number
 */
function formatNumber(value, options = {}) {
    const {
        locale = 'uk-UA',
        minDecimals = null,
        maxDecimals = 8,
        autoDecimals = true
    } = options;

    const hasDecimals = value % 1 !== 0;
    
    return value.toLocaleString(locale, {
        minimumFractionDigits: autoDecimals ? (hasDecimals ? 2 : 0) : (minDecimals || 0),
        maximumFractionDigits: maxDecimals
    });
}

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @param {Object} units - Translation units {s, m, h, d}
 * @returns {string} Formatted time string
 */
function formatTimeDuration(seconds, units = { s: 's', m: 'm', h: 'h', d: 'd' }) {
    if (seconds < 60) {
        const sec = Math.ceil(seconds);
        return `${sec}${units.s}`;
    }
    
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        return remainingSeconds === 0 
            ? `${minutes}${units.m}` 
            : `${minutes}${units.m} ${remainingSeconds}${units.s}`;
    }
    
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        let result = `${hours}${units.h}`;
        if (minutes > 0) result += ` ${minutes}${units.m}`;
        if (remainingSeconds > 0 && minutes === 0) result += ` ${remainingSeconds}${units.s}`;
        
        return result;
    }
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let result = `${days}${units.d}`;
    if (hours > 0) result += ` ${hours}${units.h}`;
    if (minutes > 0 && hours === 0) result += ` ${minutes}${units.m}`;
    
    return result;
}

// ============================================================================
// CHECKBOX & TOGGLE UTILITIES
// ============================================================================

/**
 * Handle exclusive checkbox selection (only one can be checked)
 * @param {string} selectedId - ID of the selected checkbox
 * @param {string[]} allIds - Array of all checkbox IDs in the group
 * @param {Function} callback - Optional callback after update
 */
function handleExclusiveCheckbox(selectedId, allIds, callback = null) {
    const selectedCheckbox = document.getElementById(selectedId);
    
    // If unchecking, just run callback
    if (!selectedCheckbox || !selectedCheckbox.checked) {
        if (callback) callback();
        return;
    }
    
    // Uncheck all others
    allIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        }
    });
    
    if (callback) callback();
}

/**
 * Get checked checkbox from a group
 * @param {string[]} checkboxIds - Array of checkbox IDs
 * @returns {string|null} ID of checked checkbox or null
 */
function getCheckedCheckbox(checkboxIds) {
    for (const id of checkboxIds) {
        const checkbox = document.getElementById(id);
        if (checkbox?.checked) return id;
    }
    return null;
}

/**
 * Set checkbox state
 * @param {string} checkboxId - ID of checkbox
 * @param {boolean} checked - State to set
 */
function setCheckboxState(checkboxId, checked) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) checkbox.checked = checked;
}

// ============================================================================
// CALCULATOR INITIALIZATION
// ============================================================================

/**
 * Standard calculator initialization wrapper
 * @param {Object} config - Configuration object
 * @returns {boolean} Success status
 */
function initializeCalculator(config) {
    const {
        pageId,
        initFlag,
        createHTML,
        addListeners,
        afterInit = null,
        forceInit = false
    } = config;

    if (initFlag && !forceInit) {
        console.log(`Calculator already initialized: ${pageId}`);
        return true;
    }

    const page = document.getElementById(pageId);
    if (!page) {
        console.warn(`Page not found: ${pageId}`);
        return false;
    }

    console.log(`🚀 Initializing ${pageId}...`);

    if (!createHTML()) {
        console.error(`Failed to create HTML for ${pageId}`);
        return false;
    }

    setTimeout(() => {
        if (addListeners) addListeners();
        if (afterInit) afterInit();
        console.log(`✅ ${pageId} initialized`);
    }, 100);

    return true;
}

/**
 * Setup delayed event listeners (with timeout)
 * @param {Object[]} listeners - Array of listener configs
 * @param {number} delay - Delay in ms
 */
function setupDelayedListeners(listeners, delay = 100) {
    setTimeout(() => {
        listeners.forEach(({ id, event, handler, useCapture = false }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler, useCapture);
            }
        });
    }, delay);
}

// ============================================================================
// MODAL UTILITIES
// ============================================================================

/**
 * Close modal by ID
 * @param {string} modalId - ID of modal element
 * @param {number} animationDelay - Delay before removing (ms)
 */
function closeModal(modalId = 'categoryModal', animationDelay = 300) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), animationDelay);
    }
}

/**
 * Close modal on Escape key
 * @param {string} modalId - ID of modal element
 */
function setupModalEscapeKey(modalId = 'categoryModal') {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modalId);
        }
    });
}

// ============================================================================
// CATEGORY/ACCORDION UTILITIES
// ============================================================================

/**
 * Toggle category with exclusive behavior (only one open)
 * @param {string} categoryId - ID of category content element
 */
function toggleExclusiveCategory(categoryId) {
    const categoryContent = document.getElementById(categoryId);
    const categoryHeader = document.querySelector(`[onclick*="${categoryId}"]`);
    
    if (!categoryContent || !categoryHeader) {
        console.error(`Category elements not found: ${categoryId}`);
        return;
    }
    
    const toggleIcon = categoryHeader.querySelector('.category-toggle-modifier');
    const isCurrentlyExpanded = categoryContent.classList.contains('expanded');
    
    // Close all categories
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.remove('expanded');
        header.classList.add('collapsed');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) icon.classList.remove('expanded');
    });
    
    // If wasn't expanded, expand it now
    if (!isCurrentlyExpanded) {
        categoryContent.classList.add('expanded');
        categoryHeader.classList.remove('collapsed');
        categoryHeader.classList.add('expanded');
        if (toggleIcon) toggleIcon.classList.add('expanded');
    }
}

/**
 * Initialize all categories as closed
 */
function initializeClosedCategories() {
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) icon.classList.remove('expanded');
    });
}

// ============================================================================
// MULTIPLIER CALCULATION
// ============================================================================

/**
 * Calculate total multiplier from multiple modifiers
 * @param {Object} modifiers - Object with modifier IDs and values
 * @param {string[]} excludeIds - IDs to exclude from calculation
 * @returns {number} Total multiplier
 */
function calculateMultiplier(modifiers, excludeIds = []) {
    let multiplier = 1;
    
    for (const id in modifiers) {
        if (excludeIds.includes(id)) continue;
        
        const checkbox = document.getElementById(id);
        if (checkbox?.checked) {
            multiplier *= modifiers[id];
        }
    }
    
    return multiplier;
}

/**
 * Calculate multiplier from selected options
 * @param {string[]} selectedIds - Array of selected option IDs
 * @param {Object} modifiers - Object with modifier values
 * @returns {number} Total multiplier
 */
function calculateMultiplierFromSelection(selectedIds, modifiers) {
    let multiplier = 1;
    
    selectedIds.forEach(id => {
        if (modifiers[id]) {
            multiplier *= modifiers[id];
        }
    });
    
    return multiplier;
}

// ============================================================================
// EXPORTS
// ============================================================================

// Make all functions globally available
window.CalcLogic = {
    // Language
    getCurrentAppLanguage,
    setupLanguageListener,
    
    // Input handling
    addEnterKeyListener,
    addErrorClearListener,
    parseNumericInput,
    
    // UI utilities
    togglePanel,
    showResultSection,
    hideResultSection,
    showError,
    clearError,
    updateElementText,
    
    // Number formatting
    formatNumber,
    formatTimeDuration,
    
    // Checkbox utilities
    handleExclusiveCheckbox,
    getCheckedCheckbox,
    setCheckboxState,
    
    // Calculator initialization
    initializeCalculator,
    setupDelayedListeners,
    
    // Modal utilities
    closeModal,
    setupModalEscapeKey,
    
    // Category utilities
    toggleExclusiveCategory,
    initializeClosedCategories,
    
    // Multiplier calculation
    calculateMultiplier,
    calculateMultiplierFromSelection
};

console.log('✅ Calculator Logic System loaded');
