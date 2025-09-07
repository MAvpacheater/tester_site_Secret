// Charms functionality

// Charms data - замініть URL на ваші зображення
const charmsData = [
    {
        title: "Infinite charm",
        imageUrl: "https://i.postimg.cc/W4TNJQmF/2025-09-07-09-40-22.png", // Замініть на ваш URL
        description: "Gives 20% to training rep",
        details: "Max stock: 5",
        category: "charm"
    },
    {
        title: "Leadboard charm",
        imageUrl: "https://i.postimg.cc/vHwZsg1t/image.png", // Замініть на ваш URL
        description: "Gives 18% to training rep",
        details: "Max stock: 7",
        category: "charm"
    },
    {
        title: "Endless charm",
        imageUrl: "https://i.postimg.cc/76TqvwwR/2025-09-07-10-00-26.png", // Замініть на ваш URL
        description: "Gives 15% to training rep",
        details: "Max stock: 10",
        category: "charm"
    },
    {
        title: "Luck charm",
        imageUrl: "https://i.postimg.cc/wxXW7r2N/2025-09-06-22-18-03.png", // Замініть на ваш URL
        description: "Adds 5% to luck",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Training charms",
        imageUrl: "https://i.postimg.cc/FRZLQ0bY/telegram-cloud-photo-size-2-5190785500309485773-m.jpg", // Замініть на ваш URL
        description: "Gives 5% to training rep",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Loot charm",
        imageUrl: "https://i.postimg.cc/7LtL8K75/2025-09-07-09-55-01.png", // Замініть на ваш URL
        description: "Gives 5% to find loot from boss",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Winner charm",
        imageUrl: "https://i.postimg.cc/XY8JxjYc/2025-09-07-09-55-06.png", // Замініть на ваш URL
        description: "Gives 5% more winns from boss",
        details: "Max stock: 16",
        category: "charm"
    },
    {
        title: "Coal charm",
        imageUrl: "https://i.postimg.cc/B68nq2cM/2025-09-07-09-54-40.png", // Замініть на ваш URL
        description: "You can remove charm from pet",
        details: "1 useful",
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
            <div class="charm-image-container">
                <img src="${item.imageUrl}" alt="${item.title}" class="charm-image" loading="lazy">
            </div>
            <div class="charm-content">
                <div class="charm-title">${item.title}</div>
                <div class="charm-description">${item.description}</div>
                <div class="charm-details">${item.details}</div>
                <div class="charm-category ${item.category}">${item.category}</div>
            </div>
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
