// Worlds functionality

// Worlds data - 20 світів
const worldsData = [
    {
        title: "World 0: Garden",
        icon: "🌳",
        description: "Weekly leadboard | Mail | Token store | Garden",
        details: "To get here you need to open 3 worlds"
    },
    {
        title: "World 1: Spawn",
        icon: "🏠",
        description: "Event teleport | Index machine",
        details: "Dont have permissinons"
    },
    {
        title: "World 2: Space Gym",
        icon: "🏋️",
        description: "Golden machine | Echant table",
        details: "To advance to World 2, you need to defeat the 'Champion' and have 625 wins."
    },
    {
        title: "World 3: Beach",
        icon: "🌟",
        description: "Garden teleport |Tokens leadboard | Void machine | Trainers machine",
        details: "To advance to World 3, you need to defeat the 'Rogue Ai' and have 10m wins."
    },
    {
        title: "World 4: Bunker",
        icon: "🟢",
        description: "Mutate machine | Cure Machine | ",
        details: "To advance to World 4, you need to defeat the 'Kraken' and have 30b wins"
    },
    {
        title: "World 5: Dino",
        icon: "💀",
        description: "Goliath machine",
        details: "To advance to World 5, you need to defeat the 'Mutant King' and have 1.2qa wins"
    },
    {
        title: "World 6: Void",
        icon: "⭐",
        description: "Aura machine",
        details: "To advance to World 6, you need to defeat the 'Mamoth' and have 500qi wins"
    },
    {
        title: "World 7: Space Center",
        icon: "🌙 ",
        description: "Slime machine",
        details: "To advance to World 7, you need to defeat the 'Ud'zal' and have 50sp wins"
    },
    {
        title: "World 8: Roman Empire",
        icon: "🗡️",
        description: "Forge machine",
        details: "To advance to World 8, you need to defeat the 'Space Dog' and have 150oc wins"
    },
    {
        title: "World 9: Underworld",
        icon: "🔥",
        description: "Molten machine | Magma merchant",
        details: "To advance to World 9, you need to defeat the 'Undead Sparta' and have 1.5d wins"
    },
    {
        title: "World 10: Magic Forest",
        icon: "🪄",
        description: "Sorcerey | Magic Merchant",
        details: "To advance to World 10, you need to defeat the 'Evil Overseer' and have 1tdc wins"
    },
    {
        title: "World 11: Showy Peaks",
        icon: "❄️",
        description: "Frosty merchant",
        details: "To advance to World 11, you need to defeat the 'Brute Killer' and have 50tdc wins"
    },
    {
        title: "World 12: Dusty Tawern",
        icon: "🌵",
        description: "Medal merchant | Cave fortune",
        details: "To advance to World 12, you need to defeat the 'Glaciator' and have 1qt wins"
    },
    {
        title: "World 13: Lost Kingdom",
        icon: "⚔️",
        description: "Wrestle trial | Orc merchant | Chest master",
        details: "To advance to World 13, you need to defeat the 'Mr lizard' and have 50qt wins"
    },
    {
        title: "World 14: Orc Paradise",
        icon: "🍄",
        description: "Paradise merchant | Vault goblin",
        details: "To advance to World 14, you need to defeat the 'Shiny Knight' and have 200qt wins"
    },
    {
        title: "World 15: Heavenly Island",
        icon: "☁️",
        description: "Divine fortune | Wrestle Trial",
        details: "To advance to World 15, you need to defeat the 'Leader Orc' and have 1qd wins"
    },
    {
        title: "World 16: The Rift",
        icon: "⭐",
        description: "Rift Cave | Rift machine | Rift leadboard",
        details: "To advance to World 16, you need to defeat the 'Emprion' and have 5qd wins"
    },
    {
        title: "World 17: Matrix",
        icon: "💻",
        description: "Matrix merchant | Matrix case",
        details: "To advance to World 17, you need to defeat the 'Light Bringer'"
    },
    {
        title: "World 18: The Field",
        icon: "🏈",
        description: "Super Wrestle",
        details: "To advance to World 18, you need to defeat the 'Corrupt Guess'"
    },
    {
        title: "World 19: Magic Castle",
        icon: "🏰",
        description: "Pristine machine | Boost decoration",
        details: "To advance to World 19, you need to defeat the 'Manager Mike'"
    },
    {
        title: "World 20: Sakura Temple",
        icon: "🌸",
        description: "Prestige shrine | Sakura fortune | Alchemist machine",
        details: "To advance to World 20, you need to defeat the 'Flaming Reaper'"
    }
];

// Generate worlds content
function generateWorldsContent() {
    const container = document.getElementById('worldsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    worldsData.forEach(world => {
        const worldItem = document.createElement('div');
        worldItem.className = 'world-item';
        worldItem.innerHTML = `
            <div class="world-title">
                <span class="world-icon">${world.icon}</span>
                ${world.title}
            </div>
            <div class="world-description">${world.description}</div>
            <div class="world-details">${world.details}</div>
        `;
        container.appendChild(worldItem);
    });
}

// Initialize when page loads
function initializeWorlds() {
    generateWorldsContent();
}

// Track when user switches to "worlds" page
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const worldsPage = document.getElementById('worldsPage');
        if (worldsPage && worldsPage.classList.contains('active')) {
            generateWorldsContent();
        }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
});
