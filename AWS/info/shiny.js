// SHINY STATS - Optimized
(() => {
    let initialized = false;

    const statsData = [
        [100, 115.0], [105, 120.75], [110, 126.5], [115, 132.25], [120, 138.0], [125, 143.75],
        [130, 149.5], [135, 155.25], [140, 161.0], [145, 166.75], [150, 172.5], [155, 178.25],
        [160, 184.0], [165, 189.75], [170, 195.5], [175, 201.25], [180, 207.0], [185, 212.75],
        [190, 218.5], [195, 224.25], [200, 230.0], [205, 235.75], [210, 241.5], [215, 247.25],
        [220, 253.0], [225, 258.75], [230, 264.5], [235, 270.25], [240, 276.0], [245, 281.75],
        [250, 287.5], [255, 293.25], [260, 299.0], [265, 304.75], [270, 310.5], [275, 316.25],
        [280, 322.0], [285, 327.75], [290, 333.5], [295, 339.25], [300, 345.0], [305, 350.75],
        [310, 356.5], [315, 362.25], [320, 368.0], [325, 373.75], [330, 379.5], [335, 385.25],
        [340, 391.0], [345, 396.75], [350, 402.5], [355, 408.25], [360, 414.0], [365, 419.75],
        [370, 425.5], [375, 431.25], [380, 437.0], [385, 442.75], [390, 448.5], [395, 454.25],
        [400, 460.0], [405, 465.75], [410, 471.5], [415, 477.25], [420, 483.0], [425, 488.75],
        [430, 494.5], [435, 500.25], [440, 506.0], [445, 511.75], [450, 517.5], [455, 523.25],
        [460, 529.0], [465, 534.75], [470, 540.5], [475, 546.25], [480, 552.0], [485, 557.75],
        [490, 563.5], [495, 569.25], [500, 575.0], [505, 580.75], [510, 586.5], [515, 592.25],
        [520, 598.0], [525, 603.75], [530, 609.5], [535, 615.25], [540, 621.0], [545, 626.75],
        [550, 632.5], [555, 638.25], [560, 644.0], [565, 649.75], [570, 655.5], [575, 661.25],
        [580, 667.0], [585, 672.75], [590, 678.5], [595, 684.25], [600, 690.0], [605, 695.75],
        [610, 701.5], [615, 707.25], [620, 713.0], [625, 718.75], [630, 724.5], [635, 730.25],
        [640, 736.0], [645, 741.75], [650, 747.5], [655, 753.25], [660, 759.0], [665, 764.75],
        [670, 770.5], [675, 776.25], [680, 782.0], [685, 787.75], [690, 793.5], [695, 799.25],
        [700, 805.0], [705, 810.75], [710, 816.5], [715, 822.25], [720, 828.0], [725, 833.75],
        [730, 839.5], [735, 845.25], [740, 851.0], [745, 856.75], [750, 862.5], [755, 868.25],
        [760, 874.0], [765, 879.75], [770, 885.5], [775, 891.25], [780, 897.0], [785, 902.75],
        [790, 908.5], [795, 914.25], [800, 920.0], [805, 925.75], [810, 931.5], [815, 937.25],
        [820, 943.0], [825, 948.75], [830, 954.5], [835, 960.25], [840, 966.0], [845, 971.75],
        [850, 977.5], [855, 983.25], [860, 989.0], [865, 994.75], [870, 1000.5], [875, 1006.25],
        [880, 1012.0], [885, 1017.75], [890, 1023.5], [895, 1029.25], [900, 1035.0], [905, 1040.75],
        [910, 1046.5], [915, 1052.25], [920, 1058.0], [925, 1063.75], [930, 1069.5], [935, 1075.25],
        [940, 1081.0], [945, 1086.75], [950, 1092.5], [955, 1098.25], [960, 1104.0], [965, 1109.75],
        [970, 1115.5], [975, 1121.25], [980, 1127.0], [985, 1132.75], [990, 1138.5], [995, 1144.25],
        [1000, 1150.0]
    ];

    const createStructure = () => {
        const page = document.getElementById('shinyPage');
        if (!page) return console.error('❌ Shiny page not found');
        
        page.innerHTML = `
            <h1 class="title">Shiny pets</h1>
            <div class="stats-grid" id="statsGrid"></div>
        `;
        
        console.log('✅ Shiny structure created');
    };

    const generateStats = () => {
        const grid = document.getElementById('statsGrid');
        if (!grid) return console.error('❌ Stats grid not found');
        
        grid.innerHTML = statsData.map(([base, shiny]) => {
            const shinyStr = shiny % 1 === 0 ? shiny : shiny.toString().replace('.', ',');
            return `
                <div class="stat-row">
                    <span class="left-value">${base}%</span>
                    <span class="right-value">≈ ${shinyStr}%</span>
                </div>
            `;
        }).join('');
        
        console.log(`✅ Generated ${statsData.length} shiny stat rows`);
    };

    const init = () => {
        if (initialized) {
            console.log('🔄 Shiny already initialized');
            return;
        }
        
        console.log('✨ Initializing shiny stats...');
        
        createStructure();
        generateStats();
        
        initialized = true;
        window.shinyInitialized = true;
        
        console.log('✅ Shiny initialized successfully');
    };

    const checkInit = () => {
        const page = document.getElementById('shinyPage');
        if (page?.classList.contains('active') && !initialized) {
            console.log('✨ Shiny page activated, initializing...');
            init();
        }
    };

    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));

    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'shiny') {
            setTimeout(checkInit, 300);
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.type === 'attributes' && mut.attributeName === 'class') {
                checkInit();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const page = document.getElementById('shinyPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        initializeShiny: init,
        generateShinyStats: generateStats,
        shinyInitialized: initialized
    });

    console.log('✅ Shiny.js loaded');
})();
