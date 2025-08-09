// Shiny Stats functionality

// Generate shiny stats data
function generateShinyStats() {
    const grid = document.getElementById('statsGrid');
    if (!grid) {
        console.error('Element with ID "statsGrid" not found');
        return;
    }
    
    // Clear existing content
    grid.innerHTML = '';
    
    const statsData = [
        [250, 287.5], [255, 293.25], [260, 299], [265, 304.75], [270, 310.5], [272, 312.8]
        [275, 316.25], [280, 322], [282, 324.3], [285, 327.75], [290, 333.5], [295, 339.25]
        [299, 343.85], [300, 345], [305, 350.75], [310, 356.5], [315, 362.25], [320, 368]
        [325, 373.75], [330, 379.5], [335, 385.25], [340, 391], [345, 396.75], [350, 402.5]
        [355, 408.25], [360, 414], [362, 416.3], [365, 419.75], [370, 425.5], [375, 431.25]
        [380, 437], [385, 442.75], [390, 448.5], [395, 454.25], [400, 460], [405, 465.75]
        [410, 471.5], [415, 477.25], [420, 483], [425, 488.75], [430, 494.5], [435, 500.25]
        [440, 506], [445, 511.75], [450, 517.5], [455, 523.25], [460, 529], [465, 534.75]
        [470, 540.5], [475, 546.25], [480, 552.0], [485, 557.75], [490, 563.5], [495, 569.25]
        [500, 575.0], [505, 580.75], [510, 586.5], [515, 592.25], [520, 598.0], [525, 603.75]
        [530, 609.5], [535, 615.25], [540, 621.0], [545, 626.75], [550, 632.5], [555, 638.25]
        [560, 644.0], [565, 649.75], [570, 655.5], [575, 661.25], [580, 667.0], [585, 672.75]
        [590, 678.5], [595, 684.25], [600, 690.0], [605, 695.75], [610, 701.5], [615, 707.25]
        [620, 713.0], [625, 718.75], [630, 724.5], [635, 730.25], [640, 736.0], [645, 741.75]
        [650, 747.5], [655, 753.25], [660, 759.0], [665, 764.75], [670, 770.5], [675, 776.25]
        [680, 782.0], [685, 787.75], [690, 793.5], [695, 799.25], [700, 805.0], [705, 810.75]
        [710, 816.5], [715, 822.25], [720, 828.0], [725, 833.75], [730, 839.5], [735, 845.25]
        [740, 851.0], [745, 856.75], [750, 862.5]
    ];
    
    statsData.forEach(([base, shiny]) => {
        const row = document.createElement('div');
        row.className = 'stat-row';
        const shinyStr = shiny % 1 === 0 ? shiny.toString() : shiny.toString().replace('.', ',');
        row.innerHTML = `<span class="left-value">${base}%</span><span class="right-value">≈ ${shinyStr}%</span>`;
        grid.appendChild(row);
    });
    
    console.log('Shiny stats generated successfully');
}

// Initialize shiny stats
function initializeShiny() {
    console.log('Initializing shiny stats...');
    generateShinyStats();
}

// Make sure content is generated when shiny page becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const shinyPage = document.getElementById('shinyPage');
                if (shinyPage && shinyPage.classList.contains('active')) {
                    console.log('Shiny page became active, generating content...');
                    generateShinyStats();
                }
            }
        });
    });
    
    // Observe changes to pages
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page, { attributes: true });
    });
});

// Global function for window object (fallback)
window.generateShinyStats = generateShinyStats;
