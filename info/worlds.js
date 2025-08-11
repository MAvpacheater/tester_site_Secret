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
        details: "First pets: Dog, Cat, Rabbit. Training areas include the Tutorial Field and Beginner's Ground. Perfect place to learn game mechanics and start your collection."
    },
    {
        title: "World 2: Space Gym",
        icon: "🏋️",
        description: "Golden machine | Echant table",
        details: "Home to Dragons, Unicorns, and Phoenix pets. Features the Enchanted Grove and Magic Tower training spots. First world where you can find rare magical pets."
    },
    {
        title: "World 3: Beach",
        icon: "🌟",
        description: "Garden teleport |Tokens leadboard | Void machine | Trainers machine",
        details: "Robot pets, Cyber Dogs, and AI companions await. Training in the Data Center and Cyber Gym provides unique technological boosts."
    },
    {
        title: "World 4: Bunker",
        icon: "🟢",
        description: "Mutate machine | Cure Machine | ",
        details: "Candy Cats, Chocolate Dogs, and Gummy Bears roam freely. The Sugar Factory and Candy Castle offer delicious training experiences."
    },
    {
        title: "World 5: Dino",
        icon: "💀",
        description: "Goliath machine",
        details: "Alien creatures, Space Cats, and Cosmic Dogs. Train in the Space Station and Moon Base for out-of-this-world stats."
    },
    {
        title: "World 6: Void",
        icon: "⭐",
        description: "Aura machine",
        details: "Dolphins, Tropical Fish, and Beach Crabs. The Ocean Depths and Sandy Shore provide refreshing training environments."
    },
    {
        title: "World 7: Space Center",
        icon: "🌙 ",
        description: "Slime machine",
        details: "Ghost pets, Skeleton Dogs, and Vampire Cats lurk in the shadows. Train in the Haunted Mansion and Graveyard for spooky bonuses."
    },
    {
        title: "World 8: Roman Empire",
        icon: "🗡️",
        description: "Forge machine",
        details: "Pixel pets inspired by classic games. The Arcade Hall and Retro Zone offer nostalgic training with pixelated rewards."
    },
    {
        title: "World 9: Underworld",
        icon: "🔥",
        description: "Molten machine | Magma merchant",
        details: "Clockwork animals and Steam-powered creatures. Train in the Gear Factory and Steam Workshop for mechanical advantages."
    },
    {
        title: "World 10: Magic Forest",
        icon: "🪄",
        description: "Sorcerey | Magic Merchant",
        details: "Tigers, Parrots, and Monkeys swing through the trees. The Jungle Canopy and Ancient Ruins offer wild training experiences."
    },
    {
        title: "World 11: Showy Peaks",
        icon: "❄️",
        description: "Frosty merchant",
        details: "Polar Bears, Ice Dragons, and Snow Foxes. Train in the Ice Castle and Frozen Lake for chilling stat boosts."
    },
    {
        title: "World 12: Dusty Tawern",
        icon: "🌵",
        description: "Medal merchant | Cave fortune",
        details: "Camels, Scorpions, and Desert Foxes. The Oasis and Sand Dunes provide hot training conditions for tough pets."
    },
    {
        title: "World 13: Lost Kingdom",
        icon: "⚔️",
        description: "Wrestle trial | Orc merchant | Chest master",
        details: "Sharks, Whales, and Sea Turtles. Train in the Deep Trench and Coral Reef for aquatic mastery and water-based bonuses."
    },
    {
        title: "World 14: Orc Paradise",
        icon: "🍄",
        description: "Paradise merchant | Vault goblin",
        details: "Flying pets like Eagles, Cloud Dragons, and Wind Spirits. The Sky Temple and Cloud Platform offer heavenly training."
    },
    {
        title: "World 15: Heavenly Island",
        icon: "☁️",
        description: "Divine fortune | Wrestle Trial",
        details: "Fire Dragons, Lava Hounds, and Phoenix pets. Train in the Volcano Core and Magma Pools for fiery stat increases."
    },
    {
        title: "World 16: The Rift",
        icon: "⭐",
        description: "Rift Cave | Rift machine | Rift leadboard",
        details: "Crystal Cats, Diamond Dogs, and Ruby Birds. The Crystal Cave and Gem Mine offer precious training opportunities."
    },
    {
        title: "World 17: Matrix",
        icon: "💻",
        description: "Matrix merchant | Matrix case",
        details: "Shadow creatures, Dark Knights, and Void pets. Train in the Shadow Temple and Dark Portal for mysterious powers."
    },
    {
        title: "World 18: The Field",
        icon: "🏈",
        description: "Super Wrestle",
        details: "Rainbow Unicorns, Colorful Birds, and Prism Cats. The Rainbow Bridge and Color Palace provide spectacular training."
    },
    {
        title: "World 19: Magic Castle",
        icon: "🏰",
        description: "Pristine machine | Boost decoration",
        details: "Lightning pets, Electric Eels, and Thunder Birds. Train in the Power Plant and Lightning Rod for electrifying results."
    },
    {
        title: "World 20: Sakura Temple",
        icon: "🌸",
        description: "Prestige shrine | Sakura fortune | Alchemist machine",
        details: "Legendary Void creatures and Cosmic entities. The Void Chamber and Reality Rift offer the ultimate training experience for masters only."
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
