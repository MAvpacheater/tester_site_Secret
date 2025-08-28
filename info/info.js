// Charms functionality

// Charms data
const charmsData = [
    {
        title: "Infinite charm",
        icon: "🟠",
        description: "Gives 20% to training rep",
        details: "Max stock: 5",
        category: "charm"
    },
    {
        title: "Leadboard charm",
        icon: "🟩",
        description: "Gives 18% to training rep",
        details: "Max stock: 6",
        category: "charm"
    },
    {
        title: "Endless charm",
        icon: "⚪",
        description: "Gives 15% to training rep",
        details: "Max stock: 10",
        category: "charm"
    },
    {
        title: "Luck charm",
        icon: "🍀",
        description: "Adds 5% to luck",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Training charms",
        icon: "🔴",
        description: "Gives 5% to training rep",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Loot charm",
        icon: "🔵",
        description: "Gives 5% to find loot from boss",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Winner charm",
        icon: "🟡",
        description: "Gives 5% more winns from boss",
        details: "Max stock: 16",
        category: "charm"
    }
];

// Generate charms content
function generateCharmsContent() {
    const container = document.getElementById('charmsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    charmsData.forEach(item => {
        const charmItem = document.createElement('div');
        charmItem.className = 'charm-item';
        charmItem.innerHTML = `
            <div class="charm-title">
                <span class="charm-icon">${item.icon}</span>
                ${item.title}
            </div>
            <div class="charm-description">${item.description}</div>
            <div class="charm-details">${item.details}</div>
            <div class="charm-category ${item.category}">${item.category}</div>
        `;
        container.appendChild(charmItem);
    });
}

// Initialize when page loads
function initializeCharms() {
    generateCharmsContent();
}

// Track when user switches to "charms" page
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const charmsPage = document.getElementById('charmsPage');
        if (charmsPage && charmsPage.classList.contains('active')) {
            generateCharmsContent();
        }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
});
