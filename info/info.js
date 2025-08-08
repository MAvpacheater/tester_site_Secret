// Info functionality

// Info data
const infoData = [
    {
        title: "Max lvl",
        icon: "🍓",
        description: "You need 6k+- ench rasb to get max lvl",
        details: "Its 780k+- xp",
        category: "gameplay"
    },
    {
        title: "Best arm in game",
        icon: "🏋️‍♂️",
        description: "Patrim - from endless pack",
        details: "Gives 42x base and 3x event, If max 88,2x",
        category: "gameplay"
    },
    {
        title: "Best pet in game",
        icon: "🐕",
        description: "Mega Cappucino Assasino ",
        details: "Gives 450% to best pet and 2.15b if baby (have l8), If max 240b+-",
        category: "gameplay"
    },
    {
        title: "Training Optimization",
        icon: "💪",
        description: "Use all boosts",
        details: "Buy beteer pets and arms/trainers/auras",
        category: "tips"
    },
    {
        title: "Best tactic",
        icon: "🏦",
        description: "How to get tokens??.",
        details: "Go to the server - buy cheap, then go to discord and sell - normall/overprice",
        category: "tips"
    },
    {
        title: "How to get best rep??",
        icon: "✨",
        description: "Uprage arm (do golden/craft arms)",
        details: "Uprage pets, craft to big/huge/goliath, make mutation,uprage lvl, do best slime",
        category: "tips"
    },
    {
        title: "Cheap team for main world",
        icon: "🪙",
        description: "Buy pets in bulk (sellers will make discount for bulk)",
        details: "Buy shiny pets, its will make good boost but worth cheaper then normall (310% shiny ≈ 356% but worth 2k+-, and 355% worth 5k+-)",
        category: "tips"
    },
    {
        title: "Recent Updates",
        icon: "🆕",
        description: "Stay informed about the latest game changes, new features, and balance adjustments.",
        details: "Regular updates introduce new content, fix bugs, and rebalance existing mechanics. Stay updated for optimal play.",
        category: "updates"
    },
    {
        title: "Community Tips",
        icon: "👥",
        description: "Valuable insights and strategies shared by experienced players in the community.",
        details: "Learn from other players' experiences and discover new strategies that you might not have considered.",
        category: "tips"
    },
    {
        title: "Resource Management",
        icon: "💰",
        description: "How to effectively manage your in-game resources for long-term progression and success.",
        details: "Prioritize upgrades that provide the highest return on investment. Save premium resources for critical moments.",
        category: "gameplay"
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
