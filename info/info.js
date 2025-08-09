// Info functionality

// Info data
const infoData = [
    {
        title: "Max lvl",
        icon: "🍓",
        description: "You need 6k+- ench rasb to get max lvl",
        details: "Its 780k+- xp",
        category: "tips"
    },
    {
        title: "Best arm in game",
        icon: "💪",
        description: "Patrim - from endless pack",
        details: "Gives 42x base and 3x event, If max 88,2x",
        category: "info"
    },
    {
        title: "Best pet in game",
        icon: "🐕",
        description: "Mega Cappucino Assasino ",
        details: "Gives 450% to best pet and 2.15b if baby (have l8), If max 240b+-",
        category: "info"
    },
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
        icon: "🟢",
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

// Generate info content
function generateInfoContent() {
    const container = document.getElementById('infoContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    infoData.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
            <div class="info-title">
                <span class="info-icon">${item.icon}</span>
                ${item.title}
            </div>
            <div class="info-description">${item.description}</div>
            <div class="info-details">${item.details}</div>
            <div class="info-category ${item.category}">${item.category}</div>
        `;
        container.appendChild(infoItem);
    });
}

// Initialize when page loads
function initializeInfo() {
    generateInfoContent();
}

// Track when user switches to "info" page
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const infoPage = document.getElementById('infoPage');
        if (infoPage && infoPage.classList.contains('active')) {
            generateInfoContent();
        }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
});
