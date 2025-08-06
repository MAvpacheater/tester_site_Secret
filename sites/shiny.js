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
        [250, 287.5], [255, 293.25], [260, 299], [265, 304.75], [270, 310.5],
        [272,312.8], [275, 316.25], [280, 322],[282,324.3], [285, 327.75],
        [290, 333.5], [295, 339.25],[299,343.85],[300, 345], [305, 350.75], 
        [310, 356.5], [315, 362.25], [320, 368],[325, 373.75], [330, 379.5],
        [335, 385.25], [340, 391], [345, 396.75],[350, 402.5], [355, 408.25], 
        [360, 414],[362,416.3], [365, 419.75], [370, 425.5],[375, 431.25], 
        [380, 437], [385, 442.75], [390, 448.5], [395, 454.25],
        [400, 460], [405, 465.75], [410, 471.5], [415, 477.25], [420, 483],
        [425, 488.75], [430, 494.5], [435, 500.25], [440, 506], [445, 511.75],
        [450, 517.5], [455, 523.25], [460, 529], [465, 534.75], [470, 540.5], 
        [475, 546.25],[480,552],[485,557.75],[490,563.5],[495,569.25],[500,575]
    ];
    
    statsData.forEach(([base, shiny]) => {
        const row = document.createElement('div');
        row.className = 'stat-row';
        const shinyStr = shiny % 1 === 0 ? shiny.toString() : shiny.toString().replace('.', ',');
        row.innerHTML = `<span class="left-value">${base}%</span><span class="right-value">≈ ${shinyStr}%</span>`;
        grid.appendChild(row);
    });
}

// Initialize shiny stats
function initializeShiny() {
    generateShinyStats();
}
