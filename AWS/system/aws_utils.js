// ========== AWS UTILITIES (FIXED - Base Path) ==========

class AWSUtils {
    constructor() {
        this.storagePrefix = 'armHelper_aws_';
        this.basePath = this.getBasePath();
        console.log('📁 AWS Utils Base Path:', this.basePath);
    }

    getBasePath() {
        // Use base tag if available
        const baseTag = document.querySelector('base');
        if (baseTag && baseTag.href) {
            const baseUrl = new URL(baseTag.href);
            return baseUrl.pathname + 'AWS/';
        }

        // Fallback to manual detection
        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/AWS/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
                return `${protocol}//${host}/${pathParts[0]}/AWS/`;
            }
            return `${protocol}//${host}/AWS/`;
        }
        
        return '/AWS/';
    }

    // ========== STORAGE ==========
    saveToStorage(key, value) {
        try {
            const fullKey = `${this.storagePrefix}${key}`;
            const data = typeof value === 'object' ? JSON.stringify(value) : value;
            localStorage.setItem(fullKey, data);
        } catch (error) {
            console.error('❌ Storage save failed:', error);
        }
    }

    loadFromStorage(key, parse = false) {
        try {
            const data = localStorage.getItem(`${this.storagePrefix}${key}`);
            if (!data) return null;
            return parse ? JSON.parse(data) : data;
        } catch (error) {
            console.error('❌ Storage load failed:', error);
            return null;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(`${this.storagePrefix}${key}`);
        } catch (error) {
            console.error('❌ Storage remove failed:', error);
        }
    }

    clearAllStorage() {
        try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith(this.storagePrefix));
            keys.forEach(key => localStorage.removeItem(key));
            console.log(`🗑️ Cleared ${keys.length} items`);
        } catch (error) {
            console.error('❌ Storage clear failed:', error);
        }
    }

    // ========== NUMBER FORMATTING ==========
    formatNumber(num, decimals = 2) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        if (Math.abs(num) >= 1e12) return num.toExponential(decimals);
        
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    }

    formatPercentage(value, decimals = 2) {
        if (typeof value !== 'number' || isNaN(value)) return '0%';
        return `${value.toFixed(decimals)}%`;
    }

    formatTime(seconds) {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '0s';
        
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0 || parts.length === 0) parts.push(`${s}s`);
        
        return parts.join(' ');
    }

    // ========== DATA VALIDATION ==========
    isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    parseNumber(value, defaultValue = 0) {
        const parsed = parseFloat(value);
        return this.isValidNumber(parsed) ? parsed : defaultValue;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // ========== DOM HELPERS ==========
    createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    clearContainer(selector) {
        const element = selector instanceof HTMLElement 
            ? selector 
            : (document.getElementById(selector) || document.querySelector(selector));
        
        if (element) element.innerHTML = '';
    }

    toggleElement(selector, show) {
        const element = selector instanceof HTMLElement 
            ? selector 
            : (document.getElementById(selector) || document.querySelector(selector));
        
        if (element) {
            element.style.display = show ? '' : 'none';
            element.classList.toggle('hidden', !show);
        }
    }

    showElement(selector) {
        this.toggleElement(selector, true);
    }

    hideElement(selector) {
        this.toggleElement(selector, false);
    }

    // ========== ASYNC HELPERS ==========
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // ========== TRANSLATION HELPERS ==========
    async loadTranslations(moduleName) {
        try {
            const url = `${this.basePath}translations/${moduleName}.json`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const translations = await response.json();
            console.log(`✅ Loaded translations: ${moduleName}`);
            return translations;
        } catch (error) {
            console.warn(`⚠️ Translation load failed: ${moduleName}`, error.message);
            return null;
        }
    }

    getCurrentLanguage() {
        return (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en';
    }

    // ========== MODULE STATE ==========
    resetModuleState(moduleName) {
        const stateKey = `${moduleName}Initialized`;
        if (typeof window[stateKey] !== 'undefined') {
            window[stateKey] = false;
            console.log(`🔄 Reset state: ${moduleName}`);
        }
    }

    isModuleInitialized(moduleName) {
        return window[`${moduleName}Initialized`] === true;
    }

    setModuleInitialized(moduleName, value = true) {
        window[`${moduleName}Initialized`] = value;
    }

    // ========== LOGGING ==========
    log(moduleName, message, level = 'info') {
        const emoji = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
        const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
        console[method](`${emoji[level] || 'ℹ️'} AWS ${moduleName}: ${message}`);
    }

    // ========== CALCULATIONS ==========
    calculatePercentage(value, total) {
        return total === 0 ? 0 : (value / total) * 100;
    }

    calculateMultiplier(baseValue, modifiers = []) {
        return modifiers.reduce((total, mod) => total * (1 + mod / 100), baseValue);
    }

    sumArray(array) {
        return array.reduce((sum, val) => sum + val, 0);
    }

    averageArray(array) {
        return array.length === 0 ? 0 : this.sumArray(array) / array.length;
    }

    // ========== CLIPBOARD ==========
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }

    // ========== NOTIFICATIONS ==========
    showNotification(message, type = 'info', duration = 3000) {
        const notification = this.createElement('div', `aws-notification aws-notification-${type}`, message);
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// ========== GLOBAL INSTANCE ==========
const awsUtils = new AWSUtils();

// ========== EXPORTS ==========
Object.assign(window, {
    AWSUtils,
    awsUtils,
    awsSave: (key, value) => awsUtils.saveToStorage(key, value),
    awsLoad: (key, parse = false) => awsUtils.loadFromStorage(key, parse),
    awsFormatNumber: (num, decimals) => awsUtils.formatNumber(num, decimals),
    awsFormatTime: (seconds) => awsUtils.formatTime(seconds)
});

console.log('✅ AWS Utils initialized');
console.log('📍 Base path:', awsUtils.basePath);
