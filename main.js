// Preload matrix images to ensure instant GPU caching and blinking
const _preloadAan1 = new Image(); _preloadAan1.src = "matrix_aan1.png";
const _preloadAan2 = new Image(); _preloadAan2.src = "matrix_aan2.png";
const _preloadUit = new Image(); _preloadUit.src = "matrix_uit.png";

// Locales Dictionary (Nederlands & English)
const Locales = {
    nl: {
        pageTitle: '© Mountain Mods | Matrixborden',
        legend: 'Legenda',
        matrixInactive: 'Matrix inactief',
        matrixActive: 'Matrix actief',
        zoom: 'Zoom:',
        seaNote: 'De rijbaan die het dichtst bij de zee ligt, wordt aangeduid als de rechter rijstrook.',
        copyright: '© Mountain Mods - Alle rechten voorbehouden.',
        menuTitle: 'Wijzig verkeerssituatie',
        left: 'Links',
        right: 'Rechts',
        lane1: 'Rijstrook 1',
        lane2: 'Rijstrook 2',
        lane3: 'Rijstrook 3',
        lane4: 'Rijstrook 4',
        makeChoice: 'Maak een keuze...',
        advisorySpeeds: 'ADVIESSNELHEDEN',
        trafficSigns: 'VERKEERSTEKENS',
        warningSigns: 'WAARSCHUWINGEN',
        cross: 'Kruis',
        clear: 'Opheffing',
        arrowLeft: 'Pijl links',
        arrowRight: 'Pijl rechts',
        arrowGreen: 'Groene pijl',
        trafficJam: 'File',
        accident: 'Ongeval',
        slippery: 'Gladheid',
        hazard: 'Gevaar / Uitroepteken',
        restoreBtn: 'HERSTEL ORIGINELE SITUATIE',
        applyBtn: 'WIJZIG SITUATIE',
        inOperation: 'In bedrijf',
        notInOperation: 'Niet in bedrijf',
        noMarkerActive: 'Geen matrixbord actief!',
        noMarkerFound: 'Geen matrixbord gevonden:'
    },
    en: {
        pageTitle: '© Mountain Mods | Matrix Signs',
        legend: 'Legend',
        matrixInactive: 'Matrix Inactive',
        matrixActive: 'Matrix Active',
        zoom: 'Zoom:',
        seaNote: 'The roadway closest to the sea is designated as the right lane.',
        copyright: '© Mountain Mods - All rights reserved.',
        menuTitle: 'Change Traffic Situation',
        left: 'Left',
        right: 'Right',
        lane1: 'Lane 1',
        lane2: 'Lane 2',
        lane3: 'Lane 3',
        lane4: 'Lane 4',
        makeChoice: 'Make a selection...',
        advisorySpeeds: 'ADVISORY SPEEDS',
        trafficSigns: 'TRAFFIC SIGNS',
        warningSigns: 'WARNING SIGNS',
        cross: 'Red Cross',
        clear: 'End of Restrictions',
        arrowLeft: 'Arrow Left',
        arrowRight: 'Arrow Right',
        arrowGreen: 'Green Arrow',
        trafficJam: 'Traffic Jam',
        accident: 'Accident',
        slippery: 'Slippery Road',
        hazard: 'Hazard / Danger',
        restoreBtn: 'RESTORE ORIGINAL SITUATION',
        applyBtn: 'APPLY SITUATION',
        inOperation: 'Active',
        notInOperation: 'Inactive',
        noMarkerActive: 'No matrix sign selected!',
        noMarkerFound: 'No matrix sign found:'
    }
};

let currentLang = 'nl';

// Global Map State
let mapgemaakt = false;
let xCoord = null;
let yCoord = null;
let playerMapPos = null;

function t(key) {
    const dict = Locales[currentLang] || Locales['nl'];
    return dict[key] || key;
}

const DropdownDefinition = [
    { 
        value: "", 
        type: "none", 
        badgeHtml: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`, 
        badgeClass: "badge-none", 
        labelKey: "makeChoice" 
    },
    { isHeader: true, labelKey: "advisorySpeeds" },
    { value: "tien", type: "speed", badgeHtml: "10", badgeClass: "badge-speed", labelText: "10 km/h" },
    { value: "twintig", type: "speed", badgeHtml: "20", badgeClass: "badge-speed", labelText: "20 km/h" },
    { value: "dertig", type: "speed", badgeHtml: "30", badgeClass: "badge-speed", labelText: "30 km/h" },
    { value: "veertig", type: "speed", badgeHtml: "40", badgeClass: "badge-speed", labelText: "40 km/h" },
    { value: "vijftig", type: "speed", badgeHtml: "50", badgeClass: "badge-speed", labelText: "50 km/h" },
    { value: "zestig", type: "speed", badgeHtml: "60", badgeClass: "badge-speed", labelText: "60 km/h" },
    { value: "zeventig", type: "speed", badgeHtml: "70", badgeClass: "badge-speed", labelText: "70 km/h" },
    { value: "tachtig2", type: "speed", badgeHtml: "80", badgeClass: "badge-speed", labelText: "80 km/h" },
    { value: "negentig", type: "speed", badgeHtml: "90", badgeClass: "badge-speed", labelText: "90 km/h" },
    { value: "honderd", type: "speed", badgeHtml: "100", badgeClass: "badge-speed", labelText: "100 km/h" },
    { value: "honderdtien", type: "speed", badgeHtml: "110", badgeClass: "badge-speed", labelText: "110 km/h" },
    { value: "honderdtwintig", type: "speed", badgeHtml: "120", badgeClass: "badge-speed", labelText: "120 km/h" },
    { value: "honderddertig", type: "speed", badgeHtml: "130", badgeClass: "badge-speed", labelText: "130 km/h" },
    { isHeader: true, labelKey: "trafficSigns" },
    { 
        value: "kruis", 
        type: "cross", 
        badgeHtml: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`, 
        badgeClass: "badge-cross", 
        labelKey: "cross" 
    },
    { 
        value: "ophef", 
        type: "clear", 
        badgeHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><line x1="5.5" y1="18.5" x2="18.5" y2="5.5"></line></svg>`, 
        badgeClass: "badge-clear", 
        labelKey: "clear" 
    },
    { 
        value: "pijl links", 
        type: "arrow-l", 
        badgeHtml: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`, 
        badgeClass: "badge-arrow", 
        labelKey: "arrowLeft" 
    },
    { 
        value: "pijl rechts", 
        type: "arrow-r", 
        badgeHtml: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`, 
        badgeClass: "badge-arrow", 
        labelKey: "arrowRight" 
    },
    { 
        value: "pijlg", 
        type: "arrow-g", 
        badgeHtml: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"></line><polyline points="5 13 12 20 19 13"></polyline></svg>`, 
        badgeClass: "badge-arrow-green", 
        labelKey: "arrowGreen" 
    },
    { isHeader: true, labelKey: "warningSigns" },
    { 
        value: "file", 
        type: "traffic-jam", 
        badgeHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="9" rx="2"></rect><circle cx="7.5" cy="16.5" r="1.5" fill="#f59e0b"></circle><circle cx="16.5" cy="16.5" r="1.5" fill="#f59e0b"></circle><path d="M5 11l2-5h10l2 5"></path><line x1="2" y1="4" x2="6" y2="4" stroke="#f59e0b"></line><line x1="18" y1="4" x2="22" y2="4" stroke="#f59e0b"></line></svg>`, 
        badgeClass: "badge-warning-amber", 
        labelKey: "trafficJam" 
    },
    { 
        value: "ongeval", 
        type: "accident", 
        badgeHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8 22 9 17 14 18 21 12 17.5 6 21 7 14 2 9 9 8 12 2" fill="rgba(239,68,68,0.2)"></polygon><line x1="12" y1="7" x2="12" y2="13"></line><circle cx="12" cy="16" r="0.75" fill="#ef4444"></circle></svg>`, 
        badgeClass: "badge-danger", 
        labelKey: "accident" 
    },
    { 
        value: "glad", 
        type: "slippery", 
        badgeHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line><polyline points="10 4 12 2 14 4"></polyline><polyline points="10 20 12 22 14 20"></polyline><polyline points="4 10 2 12 4 14"></polyline><polyline points="20 10 22 12 20 14"></polyline></svg>`, 
        badgeClass: "badge-snowflake", 
        labelKey: "slippery" 
    },
    { 
        value: "uitroepteken", 
        type: "hazard", 
        badgeHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="rgba(245,158,11,0.2)"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3"></line></svg>`, 
        badgeClass: "badge-warning-triangle", 
        labelKey: "hazard" 
    }
];

function getItemLabel(item) {
    if (item.labelKey) return t(item.labelKey);
    return item.labelText || item.value;
}

function initCustomDropdowns() {
    const laneKeys = ["L1","L2","L3","L4","R1","R2","R3","R4"];
    laneKeys.forEach(laneKey => {
        const wrapper = document.getElementById("rijstrook" + laneKey);
        const select = document.getElementById(laneKey);
        if (!wrapper || !select) return;

        let customEl = document.getElementById("custom-dropdown-" + laneKey);
        if (!customEl) {
            customEl = document.createElement("div");
            customEl.className = "custom-dropdown";
            customEl.id = "custom-dropdown-" + laneKey;
            
            const trigger = document.createElement("div");
            trigger.className = "custom-dropdown-trigger";
            trigger.innerHTML = `
                <div class="dropdown-selected-content">
                    <span class="dropdown-badge badge-none"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
                    <span class="dropdown-selected-text">${t('makeChoice')}</span>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            `;

            const menu = document.createElement("div");
            menu.className = "custom-dropdown-menu";

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                const isOpen = customEl.classList.contains("open");
                closeAllCustomDropdowns();
                if (!isOpen) {
                    customEl.classList.add("open");
                }
            });

            customEl.appendChild(trigger);
            customEl.appendChild(menu);
            wrapper.appendChild(customEl);
        }

        renderCustomDropdownOptions(laneKey);
    });
}

function renderCustomDropdownOptions(laneKey) {
    const customEl = document.getElementById("custom-dropdown-" + laneKey);
    const select = document.getElementById(laneKey);
    if (!customEl || !select) return;

    const menu = customEl.querySelector(".custom-dropdown-menu");
    menu.innerHTML = "";

    const curVal = select.value || "";

    DropdownDefinition.forEach(item => {
        if (item.isHeader) {
            const header = document.createElement("div");
            header.className = "dropdown-group-header";
            header.textContent = t(item.labelKey);
            menu.appendChild(header);
        } else {
            const opt = document.createElement("div");
            opt.className = "dropdown-option-item" + ((curVal === item.value || (curVal === "tachtig" && item.value === "tachtig2")) ? " selected" : "");
            opt.innerHTML = `
                <span class="dropdown-badge ${item.badgeClass}">${item.badgeHtml}</span>
                <span>${getItemLabel(item)}</span>
            `;

            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                select.value = item.value;
                if (currentMarker && currentMarker.rijstroken && currentMarker.rijstroken[laneKey]) {
                    currentMarker.rijstroken[laneKey].m = item.value === "" ? null : item.value;
                }
                updateDropdownDisplay(laneKey, item.value);
                closeAllCustomDropdowns();
            });

            menu.appendChild(opt);
        }
    });

    updateDropdownDisplay(laneKey, curVal);
}

function updateDropdownDisplay(laneKey, val) {
    const customEl = document.getElementById("custom-dropdown-" + laneKey);
    const select = document.getElementById(laneKey);
    if (!customEl || !select) return;

    if (val === "tachtig") val = "tachtig2";

    select.value = val || "";

    const matchedItem = DropdownDefinition.find(it => !it.isHeader && (it.value === (val || "") || (val === "tachtig" && it.value === "tachtig2"))) || DropdownDefinition[0];
    
    const badgeEl = customEl.querySelector(".dropdown-badge");
    const textEl = customEl.querySelector(".dropdown-selected-text");
    if (badgeEl && textEl) {
        badgeEl.className = `dropdown-badge ${matchedItem.badgeClass}`;
        badgeEl.innerHTML = matchedItem.badgeHtml;
        textEl.textContent = getItemLabel(matchedItem);
    }

    const menuOptions = customEl.querySelectorAll(".dropdown-option-item");
    const optionItems = DropdownDefinition.filter(it => !it.isHeader);
    menuOptions.forEach((optEl, idx) => {
        const item = optionItems[idx];
        if (item) {
            if (item.value === (val || "") || (val === "tachtig" && item.value === "tachtig2")) {
                optEl.classList.add("selected");
            } else {
                optEl.classList.remove("selected");
            }
        }
    });
}

function closeAllCustomDropdowns() {
    document.querySelectorAll(".custom-dropdown.open").forEach(el => {
        el.classList.remove("open");
    });
}

document.addEventListener("click", () => {
    closeAllCustomDropdowns();
});

function setLanguage(lang) {
    if (!lang || !Locales[lang.toLowerCase()]) lang = 'nl';
    currentLang = lang.toLowerCase();
    const dict = Locales[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    if (dict.pageTitle) {
        document.title = dict.pageTitle;
    }

    const laneKeys = ["L1","L2","L3","L4","R1","R2","R3","R4"];
    laneKeys.forEach(renderCustomDropdownOptions);

    if (typeof markers !== 'undefined' && Array.isArray(markers)) {
        markers.forEach(m => {
            const el = document.getElementById(m.id);
            if (el) {
                const isActive = el.classList.contains('active');
                el.title = isActive ? dict.inOperation : dict.notInOperation;
            }
        });
    }
}

// Global 1-second blink ticker for active matrix signs (guaranteed CEF compatibility)
let _matrixBlinkState = false;
setInterval(() => {
    _matrixBlinkState = !_matrixBlinkState;
    if (_matrixBlinkState) {
        document.body.classList.add('matrix-blink-phase2');
    } else {
        document.body.classList.remove('matrix-blink-phase2');
    }
}, 1000);

const markers = [
    { id: 'LSF_A', x: 0.5633, y: 0.6273, title: 'Niet in bedrijf', weg: 'Los Santos Freeway', rijstroken: {
        L1: {m: null, c: [1299.78967, 598.2414, 85.18611], h: 44}, 
        L2: {m: null, c: [1296.168, 601.9917, 85.18611], h: 44}, 
        R1: {m: null, c: [1305.34949, 590.6291, 85.18611], h: 224}, 
        R2: {m: null, c: [1308.90991, 586.942139, 85.18611], h: 224}, 
    }},
    { id: 'LSF_B', x: 0.548, y: 0.6421, title: 'Niet in bedrijf', weg: 'Los Santos Freeway', rijstroken: {
        L1: {m: null, c: [1115.19543, 415.5779, 90.01783], h: 47}, 
        L2: {m: null, c: [1111.17883, 419.3233, 90.01783], h: 47}, 
        R1: {m: null, c: [1113.25964, 398.287537, 90.01783], h: 227}, 
        R2: {m: null, c: [1117.32153, 394.499756, 90.01783], h: 227}, 
    }},
    { id: 'LSF_C', x: 0.5864, y: 0.5932, title: 'Niet in bedrijf', weg: 'Los Santos Freeway', rijstroken: {
        L1: {m: null, c: [1573.497, 994.131165, 83.6863342], h: 68}, 
        L2: {m: null, c: [1568.70374, 996.067749, 83.6863342], h: 68}, 
        R1: {m: null, c: [1581.3407, 989.5557, 83.6863342], h: 248}, 
        R2: {m: null, c: [1586.07507, 987.6429, 83.6863342], h: 248}, 
    }},
    { id: 'LSF_D', x: 0.5934, y: 0.5701, title: 'Niet in bedrijf', weg: 'Los Santos Freeway', rijstroken: {
        L1: {m: null, c: [1655.018, 1253.48279, 90.3113953], h: 76}, 
        L2: {m: null, c: [1650.11365, 1254.70557, 90.3113953], h: 76}, 
        R1: {m: null, c: [1663.37354, 1250.06091, 90.3113953], h: 256}, 
        R2: {m: null, c: [1668.61169, 1248.755, 90.3113953], h: 256}, 
        R3: {m: null, c: [1670.835, 1248.20068, 90.3113953], h: 256}, 
    }},
    { id: 'LSF_E', x: 0.5973, y: 0.5526, title: 'Niet in bedrijf', weg: 'Los Santos Freeway', rijstroken: {
        L1: {m: null, c: [1707.2572, 1530.39368, 89.69547], h: 79}, 
        L2: {m: null, c: [1701.75745, 1531.46277, 89.69547], h: 79}, 
        R1: {m: null, c: [1716.0647, 1527.35413, 89.69547], h: 259}, 
        R2: {m: null, c: [1721.22888, 1526.35034, 89.69547], h: 259}, 
    }},
    { id: 'LSF_F', x: 0.6157, y: 0.473, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [1899.92737, 2441.87427, 59.51577], h: 57}, 
        L2: {m: null, c: [1895.29077, 2444.8855, 59.51577], h: 57}, 
        L3: {m: null, c: [1883.74109, 2452.38574, 59.51577], h: 57}, 
        L4: {m: null, c: [1878.82214, 2455.58032, 59.51577], h: 57}, 
        R1: {m: null, c: [1916.52686, 2430.978, 59.51639], h: 245}, 
        R2: {m: null, c: [1922.382, 2428.2478, 59.51639], h: 245}, 
        R3: {m: null, c: [1928.94348, 2425.18823, 59.51639], h: 245}, 
        R4: {m: null, c: [1934.89648, 2422.41235, 59.51639], h: 245}, 
    }},
    { id: 'LSF_G', x: 0.6267, y: 0.4615, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2064.57739, 2633.032, 57.5756622], h: 42}, 
        L2: {m: null, c: [2061.061, 2636.9375, 57.5756622], h: 42}, 
        L3: {m: null, c: [2057.17432, 2641.254, 57.5756622], h: 42}, 
        L4: {m: null, c: [2052.96436, 2645.92969, 57.5756622], h: 42}, 
        R1: {m: null, c: [2070.00586, 2625.06152, 57.5756622], h: 222}, 
        R2: {m: null, c: [2074.10938, 2620.50415, 57.5756622], h: 222}, 
        R3: {m: null, c: [2078.50342, 2615.624, 57.5756622], h: 222}, 
        R4: {m: null, c: [2082.77466, 2610.88037, 57.5756622], h: 222}, 
    }},
    { id: 'LSF_H', x: 0.6467, y: 0.4462, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2277.56055, 2817.43457, 47.1047264], h: 38}, 
        L2: {m: null, c: [2273.81763, 2822.22559, 47.1047264], h: 38}, 
        L3: {m: null, c: [2266.58667, 2831.48071, 47.1047264], h: 38}, 
        R1: {m: null, c: [2294.59277, 2806.84229, 47.1047264], h: 218}, 
        R2: {m: null, c: [2298.385, 2801.98853, 47.1047264], h: 218}, 
        R3: {m: null, c: [2306.266, 2791.90112, 47.1047264], h: 218}, 
    }},
    { id: 'LSF_I', x: 0.6734, y: 0.4205, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2647.87744, 3150.6958, 55.6370522], h: 54}, 
        L2: {m: null, c: [2643.02051, 3154.22461, 55.6370522], h: 54}, 
        R1: {m: null, c: [2672.569, 3152.34888, 55.6363655], h: 234}, 
        R2: {m: null, c: [2677.399, 3148.83984, 55.6363655], h: 234}, 
    }},
    { id: 'LSF_J', x: 0.6856, y: 0.3961, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2810.39771, 3465.5874, 60.2822052], h: 66}, 
        L2: {m: null, c: [2804.59937, 3468.169, 60.2822052], h: 66}, 
        R1: {m: null, c: [2826.64771, 3456.92822, 60.2822052], h: 246}, 
        R2: {m: null, c: [2832.21338, 3454.4502, 60.2822052], h: 246}, 
    }},
    { id: 'LSF_K', x: 0.6938, y: 0.3735, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2912.266, 3791.0083, 57.68076], h: 78}, 
        L2: {m: null, c: [2906.25537, 3792.286, 57.68076], h: 78}, 
        R1: {m: null, c: [2930.03052, 3784.925, 57.68956], h: 258}, 
        R2: {m: null, c: [2936.13232, 3783.628, 57.68956], h: 258}, 
    }},
    { id: 'LSF_L', x: 0.6858, y: 0.3273, title: 'Niet in bedrijf', weg: 'Senora Freeway', rijstroken: {
        L1: {m: null, c: [2820.38647, 4281.771, 55.2639023], h: 112}, 
        L2: {m: null, c: [2814.51953, 4279.40039, 55.2639023], h: 112}, 
        R1: {m: null, c: [2844.7373, 4287.3623, 55.2639023], h: 288}, 
        R2: {m: null, c: [2850.42261, 4289.21, 55.2639023], h: 288}, 
    }},
    { id: 'LSF_M', x: 0.6795, y: 0.3038, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [2734.55371, 4587.02, 50.3176437], h: 100}, 
        L2: {m: null, c: [2728.44287, 4585.943, 50.3176437], h: 100}, 
        R1: {m: null, c: [2755.243, 4592.88428, 50.3176437], h: 286}, 
        R2: {m: null, c: [2761.23828, 4594.60352, 50.3176437], h: 286}, 
    }},
    { id: 'LSF_N', x: 0.6733, y: 0.277, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [2660.176, 4930.05957, 49.628904], h: 102}, 
        L2: {m: null, c: [2654.16943, 4928.783, 49.628904], h: 102}, 
        R1: {m: null, c: [2678.589, 4933.774, 49.628904], h: 284}, 
        R2: {m: null, c: [2684.41724, 4935.227, 49.628904], h: 284}, 
    }},
    { id: 'LSF_O', x: 0.6668, y: 0.2506, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [2578.49487, 5229.67236, 49.6291862], h: 106}, 
        L2: {m: null, c: [2572.67358, 5228.00342, 49.6291862], h: 106}, 
        R1: {m: null, c: [2604.65723, 5235.82129, 49.6291862], h: 286}, 
        R2: {m: null, c: [2610.62769, 5237.533, 49.6291862], h: 286}, 
    }},
    { id: 'LSF_P', x: 0.6529, y: 0.2134, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [2419.88867, 5691.342, 49.6310135], h: 116}, 
        L2: {m: null, c: [2414.218, 5688.576, 49.6310135], h: 116}, 
        R1: {m: null, c: [2441.828, 5700.606, 49.6310135], h: 296}, 
        R2: {m: null, c: [2447.316, 5703.28271, 49.6310135], h: 296}, 
    }},
    { id: 'LSF_Q', x: 0.6257, y: 0.1845, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [2120.2373, 6027.916, 58.5615135], h: 146}, 
        L2: {m: null, c: [2117.11768, 6023.62549, 58.5615135], h: 146}, 
        R1: {m: null, c: [2120.94067, 6081.42236, 56.3220764], h: 326}, 
        R2: {m: null, c: [2124.33374, 6086.45264, 56.3220764], h: 326}, 
    }},
    { id: 'LSF_R', x: 0.6051, y: 0.1639, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [1855.92236, 6331.90625, 45.3615547], h: 164}, 
        L2: {m: null, c: [1854.1626, 6325.769, 45.3615547], h: 164}, 
        R1: {m: null, c: [1863.23938, 6352.726, 46.1880737], h: 346}, 
        R2: {m: null, c: [1864.70654, 6358.611, 46.1880737], h: 346}, 
    }},
    { id: 'LSF_S', x: 0.5735, y: 0.1544, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [1432.81226, 6460.88428, 25.8283325], h: 162}, 
        R1: {m: null, c: [1436.10742, 6466.80469, 25.8283325], h: 342}, 
        R2: {m: null, c: [1438.29248, 6473.53, 25.8283325], h: 342}, 
    }},
    { id: 'LSF_T', x: 0.5242, y: 0.1524, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [811.4752, 6490.52832, 28.1743332], h: 178}, 
        R1: {m: null, c: [813.0028, 6496.972, 28.1743332], h: 358}, 
        R2: {m: null, c: [813.2351, 6503.625, 28.1743332], h: 358}, 
    }},
    { id: 'LSF_U', x: 0.4846, y: 0.1461, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [314.5326, 6565.837, 34.2756248], h: 182}, 
        R1: {m: null, c: [315.3936, 6578.53369, 34.2756248], h: 2}, 
    }},
    { id: 'LSF_V', x: 0.4203, y: 0.2024, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-478.5016, 5860.38672, 38.61826], h: 236}, 
        R1: {m: null, c: [-488.519318, 5868.7085, 38.6150452], h: 56}, 
    }},
    { id: 'LSF_W', x: 0.3896, y: 0.2375, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-884.202759, 5429.49463, 40.4938332], h: 198}, 
        L2: {m: null, c: [-882.1885, 5423.295, 40.4938332], h: 198}, 
        R1: {m: null, c: [-884.9434, 5435.96143, 40.4938332], h: 18}, 
    }},
    { id: 'LSF_X', x: 0.3496, y: 0.2644, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-1391.22119, 5083.719, 65.77205], h: 212}, 
        R1: {m: null, c: [-1393.4668, 5089.76172, 65.77343], h: 32}, 
        R2: {m: null, c: [-1396.82373, 5095.13428, 65.77343], h: 32}, 
    }},
    { id: 'LSF_Y', x: 0.327, y: 0.2834, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-1629.083, 4859.69238, 65.59603], h: 224}, 
        R1: {m: null, c: [-1636.54614, 4869.2915, 65.59603], h: 44}, 
    }},
    { id: 'LSF_Z', x: 0.2948, y: 0.314, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2046.17542, 4469.34375, 62.38434], h: 218}, 
        R1: {m: null, c: [-2051.52832, 4478.83154, 62.38801], h: 34}, 
    }},
    { id: 'LSF_AA', x: 0.2736, y: 0.3386, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2293.49121, 4181.144, 44.64047], h: 240}, 
        R1: {m: null, c: [-2298.20068, 4185.367, 44.64047], h: 60}, 
        R2: {m: null, c: [-2303.7915, 4188.595, 44.64047], h: 60}, 
    }},
    { id: 'LSF_AB', x: 0.2637, y: 0.3651, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2441.01538, 3800.72974, 26.1030365], h: 246}, 
        R1: {m: null, c: [-2451.57935, 3806.86279, 26.1030365], h: 66}, 
    }},
    { id: 'LSF_AC', x: 0.2516, y: 0.4076, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2564.4873, 3348.64648, 19.9747978], h: 80}, 
        R1: {m: null, c: [-2570.231, 3349.93677, 19.9882084], h: 80}, 
        R2: {m: null, c: [-2576.205, 3351.096, 19.9882084], h: 260}, 
    }},
    { id: 'LSF_AD', x: 0.2493, y: 0.4325, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2598.828, 2999.50073, 22.9423767], h: 262}, 
        R1: {m: null, c: [-2604.83521, 3000.44238, 22.9423767], h: 82}, 
        R2: {m: null, c: [-2610.768, 3001.27637, 22.9423767], h: 82}, 
    }},
    { id: 'LSF_AE', x: 0.2422, y: 0.4847, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2697.4812, 2333.94824, 22.0926281], h: 258}, 
        R1: {m: null, c: [-2709.60522, 2337.857, 22.0926281], h: 78}, 
    }},
    { id: 'LSF_AF', x: 0.2153, y: 0.5216, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-3003.52856, 1937.73254, 33.94918], h: 246}, 
        R1: {m: null, c: [-3014.626, 1944.10107, 33.94918], h: 66}, 
    }},
    { id: 'LSF_AG', x: 0.2188, y: 0.5487, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2979.64014, 1547.52966, 33.61765], h: 278}, 
        L2: {m: null, c: [-2973.01, 1548.46155, 33.61765], h: 278}, 
        R1: {m: null, c: [-2985.7417, 1547.99036, 33.61765], h: 98}, 
    }},
    { id: 'LSF_AH', x: 0.205, y: 0.5954, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-3148.37524, 968.2067, 20.0660721], h: 258}, 
        R1: {m: null, c: [-3160.88428, 972.198, 20.0660721], h: 78}, 
    }},
    { id: 'LSF_AI', x: 0.2106, y: 0.6125, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-3074.45142, 769.330566, 29.1239735], h: 308}, 
        R1: {m: null, c: [-3086.269, 763.1588, 28.9105755], h: 128}, 
    }},
    { id: 'LSF_AJ', x: 0.2184, y: 0.6406, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2984.55762, 415.421173, 22.5606018], h: 266}, 
        R1: {m: null, c: [-2997.38525, 419.052032, 22.5606018], h: 84}, 
    }},
    { id: 'LSF_AK', x: 0.2342, y: 0.6717, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2790.668, 41.70017, 20.023912], h: 336}, 
        R1: {m: null, c: [-2794.64819, 35.9434433, 20.023912], h: 156}, 
        R2: {m: null, c: [-2797.24268, 30.116375, 20.023912], h: 156}, 
    }},
    { id: 'LSF_AL', x: 0.2768, y: 0.7015, title: 'Niet in bedrijf', weg: 'Great Ocean Highway', rijstroken: {
        L1: {m: null, c: [-2270.544, -329.409271, 18.3086124], h: 342}, 
        L2: {m: null, c: [-2268.879, -324.2845, 18.3086124], h: 342}, 
        R1: {m: null, c: [-2275.04248, -339.0367, 18.3086124], h: 162}, 
        R2: {m: null, c: [-2276.65942, -344.0131, 18.3086124], h: 162}, 
    }},
    { id: 'LSF_AM', x: 0.2996, y: 0.7124, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-1966.132, -467.5409, 17.5872589], h: 320}, 
        L2: {m: null, c: [-1962.63013, -463.367584, 17.46819], h: 320}, 
        L3: {m: null, c: [-1959.01184, -459.055573, 17.2637268], h: 320}, 
        R1: {m: null, c: [-1974.48792, -472.7042, 17.6704327], h: 140}, 
        R2: {m: null, c: [-1978.20056, -477.128662, 17.568441], h: 140}, 
        R3: {m: null, c: [-1981.74646, -481.354462, 17.4089066], h: 140}, 
    }},
    { id: 'LSF_AN', x: 0.3252, y: 0.7327, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-1639.545, -720.0284, 16.2671638], h: 330}, 
        L2: {m: null, c: [-1636.45557, -714.6774, 16.2671638], h: 330}, 
        L3: {m: null, c: [-1633.40222, -709.3888, 16.2671638], h: 330}, 
        R1: {m: null, c: [-1645.77478, -728.221558, 16.2671638], h: 150}, 
        R2: {m: null, c: [-1648.62915, -733.165466, 16.2671638], h: 150}, 
    }},
    { id: 'LSF_AO', x: 0.3811, y: 0.7197, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-953.7215, -550.8419, 23.3309875], h: 22}, 
        L2: {m: null, c: [-955.962952, -545.2942, 23.3309875], h: 22}, 
        L3: {m: null, c: [-958.223145, -539.699951, 23.3309875], h: 22}, 
        L4: {m: null, c: [-960.4519, -534.1835, 23.3309875], h: 22}, 
        R1: {m: null, c: [-951.0514, -560.9423, 23.3310028], h: 202}, 
        R2: {m: null, c: [-948.784668, -566.5527, 23.3310028], h: 202}, 
        R3: {m: null, c: [-946.534, -572.123169, 23.3310028], h: 202}, 
        R4: {m: null, c: [-944.3513, -577.5256, 23.3310028], h: 202}, 
    }},
    { id: 'LSF_AP', x: 0.4025, y: 0.7151, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-732.073669, -508.817871, 29.8806015], h: 2}, 
        L2: {m: null, c: [-732.2908, -502.599762, 29.8806015], h: 2}, 
        L3: {m: null, c: [-732.507263, -496.399872, 29.8806015], h: 2}, 
        L4: {m: null, c: [-732.7145, -490.467255, 29.8806015], h: 2}, 
        R1: {m: null, c: [-733.033142, -518.6948, 29.8806015], h: 182}, 
        R2: {m: null, c: [-732.813232, -524.994751, 29.8806015], h: 182}, 
        R3: {m: null, c: [-732.610352, -530.803, 29.8806015], h: 182}, 
        R4: {m: null, c: [-732.402466, -536.755249, 29.8806015], h: 182}, 
    }},
    { id: 'LSF_AQ', x: 0.42, y: 0.716, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-466.157928, -508.768, 29.88307], h: 0}, 
        L2: {m: null, c: [-466.157928, -502.776245, 29.88307], h: 0}, 
        L3: {m: null, c: [-466.157928, -496.669, 29.88307], h: 0}, 
        L4: {m: null, c: [-466.157928, -490.512665, 29.88307], h: 0}, 
        R1: {m: null, c: [-467.460571, -518.409241, 29.88307], h: 180}, 
        R2: {m: null, c: [-467.460571, -524.815063, 29.88307], h: 180}, 
        R3: {m: null, c: [-467.460571, -531.0148, 29.88307], h: 180}, 
        R4: {m: null, c: [-467.460571, -537.1391, 29.88307], h: 180}, 
    }},
    { id: 'LSF_AR', x: 0.436, y: 0.716, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-305.691772, -508.9599, 29.8805653], h: 0}, 
        L2: {m: null, c: [-305.691772, -502.631378, 29.8805653], h: 0}, 
        L3: {m: null, c: [-305.691772, -496.817261, 29.8805653], h: 0}, 
        L4: {m: null, c: [-305.691772, -490.752869, 29.8805653], h: 0}, 
        R1: {m: null, c: [-306.992737, -518.600464, 29.8805653], h: 180}, 
        R2: {m: null, c: [-306.992737, -525.1759, 29.8805653], h: 180}, 
        R3: {m: null, c: [-306.992737, -530.9995, 29.8805653], h: 180}, 
        R4: {m: null, c: [-306.992737, -536.904663, 29.8805653], h: 180}, 
    }},
    { id: 'LSF_AS', x: 0.4492, y: 0.7154, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [-117.85289, -506.601379, 34.9525772], h: 0}, 
        L2: {m: null, c: [-117.85289, -500.6373, 34.9525772], h: 0}, 
        L3: {m: null, c: [-117.85289, -494.724274, 34.9525772], h: 0}, 
        L4: {m: null, c: [-117.85289, -488.786469, 34.9525772], h: 0}, 
        R1: {m: null, c: [-119.15136, -516.754944, 34.9525772], h: 180}, 
        R2: {m: null, c: [-119.15136, -522.9067, 34.9525772], h: 180}, 
        R3: {m: null, c: [-119.15136, -529.216, 34.9525772], h: 180}, 
        R4: {m: null, c: [-119.15136, -535.0465, 34.9525772], h: 180}, 
    }},
    { id: 'LSF_AT', x: 0.4618, y: 0.7154, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [23.6552067, -505.277679, 38.9517075], h: 0}, 
        L2: {m: null, c: [23.6552067, -498.864441, 38.9517075], h: 0}, 
        L3: {m: null, c: [23.6552067, -492.97287, 38.9517075], h: 0}, 
        L4: {m: null, c: [23.6552067, -487.1261, 38.9517075], h: 0}, 
        R1: {m: null, c: [22.3532333, -515.272, 38.9517075], h: 180}, 
        R2: {m: null, c: [22.3532333, -521.4302, 38.9517075], h: 180}, 
        R3: {m: null, c: [22.3532333, -527.5826, 38.9517075], h: 180}, 
        R4: {m: null, c: [22.3532333, -533.7783, 38.9517075], h: 180}, 
    }},
    { id: 'LSF_AU', x: 0.4753, y: 0.7157, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [236.347183, -505.416748, 38.95259], h: 0}, 
        L2: {m: null, c: [236.347183, -499.353119, 38.95259], h: 0}, 
        L3: {m: null, c: [236.347183, -493.024963, 38.95259], h: 0}, 
        L4: {m: null, c: [236.347183, -487.151, 38.95259], h: 0}, 
        R1: {m: null, c: [243.987076, -515.248047, 38.95259], h: 180}, 
        R2: {m: null, c: [243.987076, -521.4631, 38.95259], h: 180}, 
        R3: {m: null, c: [243.987076, -527.5481, 38.95259], h: 180}, 
        R4: {m: null, c: [243.987076, -533.7043, 38.95259], h: 180}, 
    }},
    { id: 'LSF_AV', x: 0.5118, y: 0.6921, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [650.3335, -221.004242, 48.83725], h: 58}, 
        L2: {m: null, c: [645.2529, -217.829529, 48.83725], h: 58}, 
        L3: {m: null, c: [636.1959, -212.17009, 48.83725], h: 58}, 
        R1: {m: null, c: [658.2577, -227.490845, 48.83725], h: 238}, 
        R2: {m: null, c: [663.61615, -230.839157, 48.83725], h: 238}, 
        R3: {m: null, c: [671.5277, -235.782837, 48.83725], h: 238}, 
    }},
    { id: 'LSF_AW', x: 0.5247, y: 0.6691, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [804.5211, 55.96301, 70.86218], h: 56}, 
        L2: {m: null, c: [799.5542, 59.3132629, 70.86218], h: 56}, 
        L3: {m: null, c: [794.452, 62.75474, 70.86218], h: 56}, 
        R1: {m: null, c: [812.2028, 49.2126656, 70.86218], h: 236}, 
        R2: {m: null, c: [817.2995, 45.7748833, 70.86218], h: 236}, 
        R3: {m: null, c: [822.364441, 42.3585167, 70.86218], h: 236}, 
    }},
    // FF ONDERBREKING
    { id: 'LPF_A', x: 0.4260, y: 0.7257, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-399.707642, -721.878235, 42.11799], h: 270}, 
        L2: {m: null, c: [-393.5135, -721.878235, 42.11799], h: 270}, 
        L3: {m: null, c: [-385.7252, -721.878235, 42.11799], h: 270}, 
        L4: {m: null, c: [-379.65152, -721.878235, 42.11799], h: 270}, 
        R1: {m: null, c: [-409.844543, -720.5766, 42.11799], h: 90}, 
        R2: {m: null, c: [-415.995483, -720.5766, 42.11799], h: 90}, 
        R3: {m: null, c: [-423.2414, -720.5766, 42.11799], h: 90}, 
        R4: {m: null, c: [-429.678345, -720.5766, 42.11799], h: 90}, 
    }},
    { id: 'LPF_B', x: 0.4262, y: 0.7476, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-399.29364, -953.1446, 42.1169258], h: 270}, 
        L2: {m: null, c: [-393.347748, -953.1446, 42.1169258], h: 270}, 
        R1: {m: null, c: [-409.830719, -951.8397, 42.1169258], h: 90}, 
        R2: {m: null, c: [-416.209564, -951.8397, 42.1169258], h: 90}, 
    }},
    { id: 'LPF_C', x: 0.4258, y: 0.7806, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-399.180969, -1395.99475, 43.14202], h: 270}, 
        L2: {m: null, c: [-393.302032, -1395.99475, 43.1431023], h: 270}, 
        R1: {m: null, c: [-409.633728, -1394.69507, 43.1461426], h: 90}, 
        R2: {m: null, c: [-415.557648, -1394.69507, 43.14507], h: 90},
    }},
    { id: 'LPF_D', x: 0.4224, y: 0.8045, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-521.2053, -1682.73572, 42.1118675], h: 213}, 
        L2: {m: null, c: [-517.6474, -1688.21448, 42.1118675], h: 213}, 
        R1: {m: null, c: [-525.795532, -1673.28149, 42.1118675], h: 33}, 
        R2: {m: null, c: [-529.253235, -1667.95715, 42.1118675], h: 33}, 
    }},
    { id: 'LPF_E', x: 0.4126, y: 0.8115, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-720.775635, -1735.82886, 44.0643364], h: 185}, 
        L2: {m: null, c: [-720.227661, -1742.09253, 44.0643364], h: 185}, 
        R1: {m: null, c: [-720.38916, -1725.36841, 44.0643364], h: 5}, 
        R2: {m: null, c: [-720.967, -1718.76355, 44.0643364], h: 5}, 
    }},
    { id: 'LPF_F', x: 0.3845, y: 0.8263, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-915.287231, -1886.55615, 35.6157852], h: 267}, 
        L2: {m: null, c: [-908.839844, -1886.894, 35.6157852], h: 267}, 
        R1: {m: null, c: [-925.3113, -1884.73425, 35.6157852], h: 87}, 
        R2: {m: null, c: [-932.2249, -1884.372, 35.6157852], h: 87}, 
    }},
    { id: 'LPF_G', x: 0.4009, y:0.8438, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-729.013245, -2100.081, 43.6800934], h: 325},
        L2: {m: null, c: [-725.6637, -2095.29761, 43.6800934], h: 325},
        R1: {m: null, c: [-734.3845, -2105.47974, 43.6800934], h: 145},
        R2: {m: null, c: [-737.756958, -2110.29614, 43.6800934], h: 145},
    }},
    { id: 'LPF_H', x: 0.4150, y: 0.8541, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-545.1325, -2228.95752, 63.9699], h: 325},
        L2: {m: null, c: [-541.6798, -2224.02637, 63.9699], h: 325},
        R1: {m: null, c: [-550.3622, -2234.152, 63.9699], h: 145},
        R2: {m: null, c: [-553.7716, -2239.02148, 63.9699], h: 145},
    }},
    { id: 'LPF_I', x: 0.4374, y: 0.8702, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [-267.226532, -2423.38135, 63.9685], h: 325},
        L2: {m: null, c: [-263.8352, -2418.538, 63.9685], h: 325},
        R1: {m: null, c: [-272.633759, -2428.83765, 63.9685], h: 145},
        R2: {m: null, c: [-275.877625, -2433.47046, 63.9685], h: 145},
    }},
    { id: 'LPF_J', x: 0.4628, y: 0.8860, title: 'Niet in bedrijf', weg: 'La Puerta Freeway', rijstroken: {
        L1: {m: null, c: [59.0015755, -2628.65161, 28.0391689], h: 341},
        L2: {m: null, c: [60.91626, -2623.09082, 28.0391689], h: 341},
        R1: {m: null, c: [55.27436, -2635.45923, 28.0391689], h: 161},
        R2: {m: null, c: [53.3714066, -2640.98584, 28.0391689], h: 161},
    }},
    { id: 'LPF_K', x: 0.4919, y: 0.8899, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [408.321472, -2677.31177, 28.0365864], h: 352},
        L2: {m: null, c: [409.072968, -2671.96436, 28.0365864], h: 352},
        R1: {m: null, c: [405.951324, -2684.81958, 28.0365864], h: 172},
        R2: {m: null, c: [405.171936, -2690.365, 28.0365864], h: 172},
    }},
    { id: 'LPF_L', x: 0.5144, y: 0.8868, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [690.677246, -2641.056, 55.08862], h: 10},
        L2: {m: null, c: [689.6795, -2635.39771, 55.08862], h: 10},
        R1: {m: null, c: [690.831543, -2649.394, 55.08862], h: 190},
        R2: {m: null, c: [691.7296, -2654.4873, 55.08862], h: 190},
    }},
    { id: 'LPF_M', x: 0.5558, y: 0.8789, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1221.30151, -2533.112, 43.22874], h: 24},
        L2: {m: null, c: [1219.31519, -2528.651, 43.22874], h: 24},
        R1: {m: null, c: [1223.41064, -2541.05469, 43.22874], h: 204},
        R2: {m: null, c: [1225.44763, -2545.63, 43.22874], h: 204},
    }},
    { id: 'LPF_N', x: 0.5626, y: 0.8498, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1289.01685, -2193.2876, 54.60752], h: 112},
        L2: {m: null, c: [1283.78552, -2195.40137, 54.60752], h: 112},
        R1: {m: null, c: [1299.92737, -2190.28687, 54.60752], h: 292},
        R2: {m: null, c: [1304.804, -2188.31665, 54.60752], h: 292},
    }},
    { id: 'LPF_O', x: 0.5515, y: 0.8225, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1137.25952, -1840.06042, 35.4735352], h: 110},
        L2: {m: null, c: [1131.7218, -1842.07593, 35.4735352], h: 110},
        L3: {m: null, c: [1125.76978, -1844.24231, 35.4735352], h: 110},
        R1: {m: null, c: [1156.48035, -1859.56, 35.42492], h: 290},
        R2: {m: null, c: [1162.27051, -1857.45264, 35.42492], h: 290},
        R3: {m: null, c: [1168.15686, -1855.31018, 35.42492], h: 290},
    }},
    { id: 'LPF_P', x: 0.5447, y: 0.7895, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1059.0354, -1420.85376, 35.0397926], h: 90},
        L2: {m: null, c: [1052.86377, -1420.85376, 35.0397926], h: 90},
        L3: {m: null, c: [1042.0575, -1420.85376, 35.0397926], h: 90},
        L4: {m: null, c: [1036.19092, -1420.85376, 34.9268127], h: 90},
        R1: {m: null, c: [1069.22083, -1451.643, 35.42492], h: 270},
        R2: {m: null, c: [1075.23315, -1451.643, 35.32547], h: 270},
        R3: {m: null, c: [1084.6908, -1451.643, 35.32547], h: 270},
        R4: {m: null, c: [1087.76111, -1451.643, 35.32547], h: 270},
    }},
    { id: 'LPF_Q', x: 0.5477, y: 0.8134, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1094.78613, -1721.50208, 34.1066528], h: 110},
        L2: {m: null, c: [1088.61243, -1723.69519, 34.1066528], h: 110},
        L3: {m: null, c: [1082.864, -1725.788, 34.1066528], h: 110},
        R1: {m: null, c: [1115.92383, -1752.49023, 34.1066528], h: 290},
        R2: {m: null, c: [1121.94263, -1750.35046, 34.1066528], h: 290},
        R3: {m: null, c: [1127.68579, -1748.29358, 34.1066528], h: 290},
    }},
    { id: 'LPF_R', x: 0.5402, y: 0.7475, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [1000.31586, -892.47345, 35.74793], h: 112},
        L2: {m: null, c: [994.545044, -894.805, 35.74793], h: 112},
        L3: {m: null, c: [987.8658, -897.50354, 35.74793], h: 112},
        L4: {m: null, c: [982.3417, -899.7354, 35.74793], h: 112},
        R1: {m: null, c: [1010.15527, -889.899841, 35.74793], h: 292},
        R2: {m: null, c: [1015.90857, -887.5754, 35.74793], h: 292},
        R3: {m: null, c: [1022.69189, -884.8347, 35.74793], h: 292},
        R4: {m: null, c: [1028.4967, -882.489441, 35.74793], h: 292},
    }},
    { id: 'LPF_S', x: 0.5267, y: 0.7294, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [823.718, -675.4882, 47.2200752], h: 146},
        L2: {m: null, c: [820.5686, -680.1574, 47.2200752], h: 146},
        L3: {m: null, c: [817.2316, -685.1047, 47.2200752], h: 146},
        L4: {m: null, c: [813.735657, -690.287659, 47.2200752], h: 146},
        R1: {m: null, c: [830.8438, -667.259644, 47.2200752], h: 326},
        R2: {m: null, c: [834.348145, -662.0643, 47.2200752], h: 326},
        R3: {m: null, c: [837.3408, -657.627441, 47.2200752], h: 326},
        R4: {m: null, c: [840.6646, -652.699768, 47.2200752], h: 326},
    }},
    { id: 'LPF_T', x: 0.5147, y: 0.7232, title: 'Niet in bedrijf', weg: 'Elysian Fields Freeway', rijstroken: {
        L1: {m: null, c: [658.109, -591.9429, 40.8055435], h: 152},
        L2: {m: null, c: [655.2315, -597.3547, 40.8055435], h: 152},
        L3: {m: null, c: [652.6506, -602.20874, 40.8055435], h: 152},
        L4: {m: null, c: [649.818, -607.536, 40.8055435], h: 152},
        R1: {m: null, c: [664.3418, -582.9924, 40.8055435], h: 332},
        R2: {m: null, c: [667.2709, -577.4837, 40.8055435], h: 332},
        R3: {m: null, c: [669.8544, -572.624939, 40.8055435], h: 332},
        R4: {m: null, c: [672.632141, -567.400757, 40.8055435], h: 332},
    }},
    { id: 'LPF_U', x: 0.4903, y: 0.7158, title: 'Niet in bedrijf', weg: 'Del Perro Freeway', rijstroken: {
        L1: {m: null, c: [413.3045, -516.5034, 40.80723], h: 178},
        L2: {m: null, c: [413.0968, -522.45105, 40.80723], h: 178},
        L3: {m: null, c: [412.904144, -527.9679, 40.80723], h: 178},
        L4: {m: null, c: [412.678864, -534.41925, 40.80723], h: 178},
        R1: {m: null, c: [414.980133, -505.853271, 40.80723], h: 358},
        R2: {m: null, c: [415.210358, -499.260864, 40.80723], h: 358},
        R3: {m: null, c: [415.394623, -493.984924, 40.80723], h: 358},
        R4: {m: null, c: [415.612427, -487.747955, 40.80723], h: 358},
    }},
    { id: 'OLF_A', x: 0.4529, y: 0.7719, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [-75.48732, -1225.42432, 42.4029251], h: 180},
        L2: {m: null, c: [-75.48732, -1231.91272, 42.4029251], h: 180},
        L3: {m: null, c: [-75.48732, -1238.56519, 42.4029251], h: 180},
        L4: {m: null, c: [-75.48732, -1244.64673, 42.4029251], h: 180},
        R1: {m: null, c: [-74.1748352, -1204.35266, 42.4029251], h: 0},
        R2: {m: null, c: [-74.1748352, -1198.13245, 42.4029251], h: 0},
        R3: {m: null, c: [-74.1748352, -1191.77344, 42.4029251], h: 0},
        R4: {m: null, c: [-74.1748352, -1185.614, 42.4029251], h: 0},
    }},
    { id: 'OLF_B', x: 0.4847, y: 0.7700, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [296.0272, -1216.82166, 43.11814], h: 180},
        L2: {m: null, c: [296.0272, -1223.34058, 43.11814], h: 180},
        L3: {m: null, c: [296.0272, -1229.3783, 43.11814], h: 180},
        L4: {m: null, c: [296.0272, -1235.595, 43.11814], h: 180},
        R1: {m: null, c: [297.3281, -1191.89355, 43.11814], h: 0},
        R2: {m: null, c: [297.3281, -1185.381, 43.11814], h: 0},
        R3: {m: null, c: [297.3281, -1179.21521, 43.11814], h: 0},
        R4: {m: null, c: [297.3281, -1173.09888, 43.11814], h: 0},
    }},
    { id: 'OLF_C', x: 0.5001, y: 0.7712, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [533.9891, -1209.59058, 47.0267235], h: 182},
        L2: {m: null, c: [534.205566, -1215.78992, 47.0267235], h: 182},
        L3: {m: null, c: [534.521667, -1224.8407, 47.0267235], h: 182},
        L4: {m: null, c: [534.756653, -1231.5697, 47.0267235], h: 182},
        R1: {m: null, c: [533.3212, -1196.78589, 47.025396], h: 358},
        R2: {m: null, c: [533.527161, -1190.88855, 47.025396], h: 358},
        R3: {m: null, c: [533.851135, -1181.60938, 47.025396], h: 358},
        R4: {m: null, c: [534.0749, -1175.20264, 47.025396], h: 358},
    }},
    { id: 'OLF_D', x: 0.5152, y: 0.7708, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [686.452332, -1204.1759, 48.55516], h: 182},
        L2: {m: null, c: [686.669067, -1210.383, 48.55516], h: 182},
        L3: {m: null, c: [687.027466, -1220.6449, 48.55516], h: 182},
        L4: {m: null, c: [687.2506, -1227.0354, 48.55516], h: 182},
        R1: {m: null, c: [687.3917, -1193.78088, 48.55516], h: 2},
        R2: {m: null, c: [687.183838, -1187.828, 48.55516], h: 2},
        R3: {m: null, c: [686.8287, -1177.65735, 48.55516], h: 2},
        R4: {m: null, c: [686.607056, -1171.31128, 48.55516], h: 2},
    }},
    { id: 'OLF_E', x: 0.5798, y: 0.7570, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [1533.21082, -1001.09674, 63.1714378], h: 32},
        L2: {m: null, c: [1529.82983, -995.6863, 63.1714378], h: 32},
        R1: {m: null, c: [1536.79016, -1009.28711, 63.1714378], h: 212},
        R2: {m: null, c: [1540.24976, -1014.82379, 63.1714378], h: 212},
    }},
    { id: 'OLF_F', x: 0.6087, y: 0.7381, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [1840.8783, -799.6742, 83.00088], h: 38},
        L2: {m: null, c: [1837.48816, -795.334961, 83.00088], h: 38},
        R1: {m: null, c: [1845.28735, -807.4264, 83.00088], h: 218},
        R2: {m: null, c: [1848.63428, -811.710144, 83.00088], h: 218},
    }},
    { id: 'OLF_G', x: 0.6458, y: 0.7051, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2311.10718, -386.2388, 91.97243], h: 52},
        L2: {m: null, c: [2306.857, -382.9181, 91.97243], h: 52},
        R1: {m: null, c: [2317.30713, -392.7339, 91.97243], h: 232},
        R2: {m: null, c: [2321.624, -396.106659, 91.97243], h: 232},
    }},
    { id: 'OLF_H', x: 0.6606, y: 0.6749, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2489.398, -9.179823, 99.06617], h: 76},
        L2: {m: null, c: [2484.29614, -7.90779924, 99.06617], h: 76},
        R1: {m: null, c: [2517.14966, -25.3883648, 97.3148361], h: 246},
        R2: {m: null, c: [2521.93628, -27.5195351, 97.3148361], h: 246},
    }},
    { id: 'OLF_I', x: 0.6663, y: 0.6398, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2536.947, 373.007629, 116.47011], h: 88},
        L2: {m: null, c: [2531.901, 373.183868, 116.47011], h: 88},
        R1: {m: null, c: [2620.98462, 358.3555, 102.156221], h: 262},
        R2: {m: null, c: [2626.32, 357.605652, 102.156221], h: 262},
    }},
    { id: 'OLF_J', x: 0.6578, y: 0.6011, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2481.78052, 845.8303, 97.61691], h: 106},
        L2: {m: null, c: [2476.56519, 844.334839, 97.61691], h: 106},
        R1: {m: null, c: [2519.48633, 860.902466, 92.38544], h: 298},
        R2: {m: null, c: [2524.09863, 863.355, 92.38544], h: 298},
    }},
    { id: 'OLF_K', x: 0.6442, y: 0.5833, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2303.12866, 1123.52869, 83.75282], h: 134},
        L2: {m: null, c: [2299.409, 1119.93652, 83.75282], h: 134},
        R1: {m: null, c: [2310.73267, 1129.06689, 83.75282], h: 314},
        R2: {m: null, c: [2314.485, 1132.69055, 83.75282], h: 314},
    }},
    { id: 'OLF_L', x: 0.6235, y: 0.5541, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [2036.93982, 1500.89478, 80.66917], h: 114},
        L2: {m: null, c: [2031.84778, 1498.62769, 80.66917], h: 114},
        R1: {m: null, c: [2045.37659, 1503.22546, 80.66917], h: 294},
        R2: {m: null, c: [2050.32056, 1505.42651, 80.66917], h: 294},
    }},
    { id: 'OLF_M', x: 0.6160, y: 0.5356, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [1941.05493, 1716.73425, 74.0892654], h: 114},
        L2: {m: null, c: [1935.36169, 1714.19958, 74.0892654], h: 114},
        R1: {m: null, c: [1964.092, 1721.63562, 72.525415], h: 288},
        R2: {m: null, c: [1969.53931, 1723.40552, 72.525415], h: 288},
    }},
    { id: 'OLF_N', x: 0.6081, y: 0.5096, title: 'Niet in bedrijf', weg: 'Olympic Freeway', rijstroken: {
        L1: {m: null, c: [1824.09216, 2055.56543, 60.7252136], h: 100},
        L2: {m: null, c: [1818.06165, 2054.5022, 60.7252136], h: 100},
        R1: {m: null, c: [1883.339, 2064.68774, 60.1199661], h: 280},
        R2: {m: null, c: [1889.802, 2065.82739, 60.1199661], h: 280},
    }},
];

let T = null;

function buildTransform(points) {
    const A = [];
    const B = [];

    for (const p of points) {
        const x = p.world.x;
        const y = p.world.y;

        A.push([x, y, 1, 0, 0, 0]);
        B.push(p.map.x);

        A.push([0, 0, 0, x, y, 1]);
        B.push(p.map.y);
    }

    const sol = solveLinearSystem(A, B);

    return {
        a: sol[0], b: sol[1], c: sol[2],
        d: sol[3], e: sol[4], f: sol[5]
    };
}

function solveLinearSystem(A, B) {
    const n = B.length;

    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }

        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [B[i], B[maxRow]] = [B[maxRow], B[i]];

        for (let k = i + 1; k < n; k++) {
            const c = A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                A[k][j] -= c * A[i][j];
            }
            B[k] -= c * B[i];
        }
    }

    const x = new Array(n);

    for (let i = n - 1; i >= 0; i--) {
        let sum = B[i];
        for (let j = i + 1; j < n; j++) {
            sum -= A[i][j] * x[j];
        }
        x[i] = sum / A[i][i];
    }

    return x;
}

const P = [
    { world: {x:-3418.2060546875, y:967.8128051757812}, map:{x:0.18346073464381968, y:0.5968168667405919} },
    { world: {x:55.16508102416992, y:7246.505859375}, map:{x:0.4626722117004982, y:0.09220375327815508} },
    { world: {x:4179.4130859375, y:4502.32958984375}, map:{x:0.7944047878378314, y:0.31230433699586635} }
];

T = buildTransform(P);

function initTransform() {
    T = buildTransform(P);
}

function worldToMap(x, y) {
    return {
        x: T.a * x + T.b * y + T.c,
        y: T.d * x + T.e * y + T.f
    };
}

function mapToWorld(nx, ny) {
    if (!T) return { x: null, y: null };

    const x = (ny * T.c - nx * T.f) / (T.b * T.d - T.a * T.e);
    const y = (nx - T.a * x - T.c) / T.b;

    return { x, y };
}

function spawnPlayerDot(nx, ny) {
    const overlay = document.getElementById('overlay');
    const img = document.getElementById('mapImage');

    const dot = document.createElement('div');
    dot.className = 'playerDot';

    overlay.appendChild(dot);

    function update() {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;

        const x = nx * iw;
        const y = ny * ih;

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
    }

    update();
    return { dot, update };
}

function startmap(){
    const viewer = document.getElementById('viewer');
    const mapInner = document.getElementById('mapInner');
    const img = document.getElementById('mapImage');
    const overlay = document.getElementById('overlay');
    const zoomLabel = document.getElementById('zoomLabel');
    const resetBtn = document.getElementById('resetBtn');
    const fitBtn = document.getElementById('fitBtn');

    // genormaliseerde markerposities (0..1) t.o.v. afbeeldingsafmetingen
    // wijzig deze posities naar de exacte locaties die je wilt (x=0.0..1.0, y=0.0..1.0)

    // transform state
    let scale = 1; // zoom factor
    let tx = 0; // translate x in pixels
    let ty = 0; // translate y in pixels

    // panning state
    let isPanning = false;
    let panStart = {x:0,y:0};
    let startTx = 0;
    let startTy = 0;

    // limits
    const MIN_SCALE = 0.08;
    const MAX_SCALE = 8;

    // maak marker DOM elementen
    function createMarkerEl(m){
        let el = document.getElementById(m.id);
        if (!el) {
            el = document.createElement('button');
            el.className = 'marker';
            el.id = m.id;
            el.title = m.title || 'Niet in bedrijf';
            el.innerHTML = ``;
            el.setAttribute("onclick", `openMenu('${m.id}')`);
            
            el.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
            });
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                openMenu(m.id);
            });

            overlay.appendChild(el);
        }
        m.el = el;
    }

    overlay.innerHTML = '';
    markers.forEach(createMarkerEl);

    // update transform op de kaart en plaats markers
    function render(){
      mapInner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      zoomLabel.textContent = scale.toFixed(2) + 'x';
      positionMarkers();
    }

    // positioneer markers op basis van genormaliseerde coördinaten en huidige transform
    function positionMarkers(){
        const img = document.getElementById('mapImage');
        if (!img) return;

        const iw = img.naturalWidth || img.width || 2304;
        const ih = img.naturalHeight || img.height || 2304;
        if (!iw || !ih || iw <= 0 || ih <= 0) return;
        if (isNaN(scale) || !isFinite(scale) || scale <= 0) scale = 1;
        if (isNaN(tx)) tx = 0;
        if (isNaN(ty)) ty = 0;

        // Dynamische marker schaal: verkleint vloeiend bij uitzoomen (bij bijv. 0.3x zoom naar ~45%)
        const markerScale = Math.max(0.35, Math.min(1.15, Math.pow(scale, 0.65)));
        if (overlay) {
            overlay.style.setProperty('--marker-scale', markerScale.toFixed(3));
        }

        // MARKERS
        markers.forEach(m => {
            if (!m.el) return;
            const px = m.x * iw;
            const py = m.y * ih;

            const sx = px * scale + tx;
            const sy = py * scale + ty;

            m.el.style.left = sx + 'px';
            m.el.style.top = sy + 'px';
        });

        // PLAYER DOT
        if (playerMapPos) {
            const px = playerMapPos.x * iw;
            const py = playerMapPos.y * ih;

            const sx = px * scale + tx;
            const sy = py * scale + ty;

            if (!window.playerDot) {
                const dot = document.createElement('div');
                dot.className = 'playerDot';
                document.getElementById('overlay').appendChild(dot);
                window.playerDot = dot;
            }

            window.playerDot.style.left = sx + 'px';
            window.playerDot.style.top = sy + 'px';
        }
    }

    // helper: clamp
    function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

    // zoomen naar punt (cx,cy) in viewer-coördinaten
    function zoomTo(newScale, cx, cy){
        newScale = clamp(newScale, MIN_SCALE, MAX_SCALE);
        const oldScale = scale || 1;
        // behoud het punt onder de cursor
        tx = cx - ((cx - tx) * newScale / oldScale);
        ty = cy - ((cy - ty) * newScale / oldScale);
        if (isNaN(tx)) tx = 0;
        if (isNaN(ty)) ty = 0;
        scale = newScale;
        render();
    }

    // wheel zoom
    viewer.addEventListener('wheel', (e)=>{
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomFactor = delta > 0 ? 1.12 : 1/1.12;
        const rect = viewer.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        zoomTo(scale * zoomFactor, cx, cy);
    }, {passive:false});

    // pointer/pan handling
    viewer.addEventListener('pointerdown', (e)=>{
      // alleen pannen met primaire knop
        if (e.target.closest('.marker')) return;
        if (e.target.closest('.controls')) return;
        if (e.button !== 0) return;
        isPanning = true;
        viewer.setPointerCapture(e.pointerId);
        panStart = {x: e.clientX, y: e.clientY};
        startTx = tx; startTy = ty;
    });
    viewer.addEventListener('pointermove', (e)=>{
        if (!isPanning) return;
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        tx = startTx + dx;
        ty = startTy + dy;
        render();
    });
    viewer.addEventListener('pointerup', (e)=>{
        isPanning = false;
        try{ viewer.releasePointerCapture(e.pointerId); }catch(_){}
    });
    viewer.addEventListener('pointercancel', ()=>{ isPanning = false; });

    // touch pinch-zoom support (basic)
    let ongoingTouches = [];
    viewer.addEventListener('touchstart', (e)=>{
        if (e.touches.length===2){
            e.preventDefault();
            ongoingTouches = [e.touches[0], e.touches[1]];
        }
    }, {passive:false});
    viewer.addEventListener('touchmove', (e)=>{
        if (e.touches.length===2 && ongoingTouches.length===2){
            e.preventDefault();
            const t0 = e.touches[0], t1 = e.touches[1];
            const oldMid = midPoint(ongoingTouches[0], ongoingTouches[1]);
            const newMid = midPoint(t0,t1);
            const oldDist = distance(ongoingTouches[0], ongoingTouches[1]);
            const newDist = distance(t0,t1);
            const rect = viewer.getBoundingClientRect();
            const cx = newMid.clientX - rect.left;
            const cy = newMid.clientY - rect.top;
            const factor = newDist / (oldDist || 1);
            zoomTo(scale * factor, cx, cy);
            // update ongoing
            ongoingTouches = [t0, t1];
        }
    }, {passive:false});
    viewer.addEventListener('touchend', ()=>{ ongoingTouches = []; }, {passive:true});

    function midPoint(a,b){ return { clientX:(a.clientX+b.clientX)/2, clientY:(a.clientY+b.clientY)/2 }; }
    function distance(a,b){ const dx=a.clientX-b.clientX, dy=a.clientY-b.clientY; return Math.hypot(dx,dy); }

    // fit image inside viewer (centers & scales to fit)
    function fitToViewer(){
        const rect = viewer.getBoundingClientRect();
        const vw = rect.width || window.innerWidth || 1200;
        const vh = rect.height || window.innerHeight || 800;
        const iw = img.naturalWidth || img.width || 2304;
        const ih = img.naturalHeight || img.height || 2304;
        if (!iw || !ih || iw <= 0 || ih <= 0) return;
        const scaleX = vw / iw; const scaleY = vh / ih;
        scale = Math.min(scaleX, scaleY);
        if (isNaN(scale) || !isFinite(scale) || scale <= 0) scale = 0.5;
        // center
        tx = (vw - iw*scale)/2;
        ty = (vh - ih*scale)/2;
        if (isNaN(tx)) tx = 0;
        if (isNaN(ty)) ty = 0;
        render();
    }

    viewer.addEventListener('click', (e) => {
        const rect = viewer.getBoundingClientRect();

        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        const iw = img.naturalWidth || img.width || 2304;
        const ih = img.naturalHeight || img.height || 2304;

        const px = (cx - tx) / scale;
        const py = (cy - ty) / scale;

        const nx = px / iw;
        const ny = py / ih;

        const world = mapToWorld(nx, ny);
    });

    // wanneer afbeelding geladen is: pas aan en render
    img.addEventListener('load', ()=>{
      fitToViewer();
    });

    // responsive: herbereken wanneer viewergrootte verandert
    new ResizeObserver(()=>{ positionMarkers(); }).observe(viewer);

    // initial render
    fitToViewer();
    if (img.complete) img.dispatchEvent(new Event('load'));
};

var toggleStatus = false
let currentMarker = null;

function openMenu(id) {
    initCustomDropdowns();
    const menuID = document.getElementById('menu');
    const subtitel = document.getElementById('menuSubtitel');
    const marker = markers.find(m => m.id === id);

    if (!marker) {
        console.warn("Geen marker gevonden:", id);
        return;
    }

    currentMarker = marker;

    // Highlight clicked marker on the map and remove from previous
    document.querySelectorAll('.marker.selected, .map-marker-icon.selected, .selected').forEach(el => el.classList.remove('selected'));
    const clickedEl = document.getElementById(marker.id);
    if (clickedEl) {
        clickedEl.classList.add('selected');
        if (typeof clickedEl.blur === 'function') clickedEl.blur();
    }

    const titel = document.getElementById('menuTitel');
    if (titel) titel.textContent = marker.id;
    if (subtitel) subtitel.innerHTML = `<i>${marker.weg}</i>`;

    ["L1","L2","L3","L4","R1","R2","R3","R4"].forEach(key => {
        const wrapper = document.getElementById("rijstrook" + key.toUpperCase());
        const select = document.getElementById(key.toUpperCase());

        if (marker.rijstroken && marker.rijstroken.hasOwnProperty(key)) {
            if (wrapper) wrapper.style.display = "block";

            const rijstrook = marker.rijstroken[key];
            const val = (rijstrook && rijstrook.m !== null && rijstrook.m !== undefined) ? rijstrook.m : "";

            if (select) {
                select.value = val;
            }
            updateDropdownDisplay(key, val);
        } else {
            if (wrapper) wrapper.style.display = "none";
        }
    });

    closeAllCustomDropdowns();

    // ALWAYS keep menu open when switching between markers
    if (menuID) {
        menuID.classList.add('open');
        toggleStatus = true;
    }
}

function getResourceName() {
    return (typeof GetParentResourceName === 'function') ? GetParentResourceName() : 'MTM-MATRIXDEV';
}

const isFiveM = (typeof GetParentResourceName === 'function');
const inPadUI = window.location.search.includes('padui=true') || window.location.search.includes('inPad=true');
const isWeb = !isFiveM;

function getApiEndpoint(endpoint, payloadData) {
    let url = '';
    if (isFiveM) {
        url = `https://${GetParentResourceName()}/${endpoint}`;
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        url = `/api/${endpoint}`;
    } else if (window.location.hostname === '185.228.81.171') {
        const currentPath = window.location.pathname;
        const base = currentPath.endsWith('/') ? currentPath : currentPath + '/';
        url = `${base}api/${endpoint}`;
    } else {
        const cfg = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : {};
        const urlParams = new URLSearchParams(window.location.search);
        let serverBase = urlParams.get('server') || cfg.SERVER_URL || 'http://185.228.81.171:30121/MTM-MATRIXDEV';
        const cleanServer = serverBase.endsWith('/') ? serverBase.slice(0, -1) : serverBase;
        url = `${cleanServer}/api/${endpoint}`;
    }

    const cfg = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : {};
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('apikey') || cfg.API_KEY || '';
    const params = [];
    if (apiKey && apiKey.trim() !== '') {
        params.push(`apikey=${encodeURIComponent(apiKey.trim())}`);
    }

    if (payloadData && !isFiveM) {
        params.push(`data=${encodeURIComponent(JSON.stringify({ data: payloadData }))}`);
    }

    if (params.length > 0) {
        const sep = url.includes('?') ? '&' : '?';
        url += `${sep}${params.join('&')}`;
    }
    return url;
}

function getApiHeaders() {
    const headers = { 'Content-Type': 'application/json; charset=UTF-8' };
    if (!isFiveM) {
        const urlParams = new URLSearchParams(window.location.search);
        const cfg = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : {};
        const apiKey = urlParams.get('apikey') || cfg.API_KEY || localStorage.getItem('mtm_matrix_apikey');
        if (apiKey) {
            try { localStorage.setItem('mtm_matrix_apikey', apiKey); } catch(e) {}
            headers['X-Api-Key'] = apiKey;
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
    }
    return headers;
}

async function safeFetchJson(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        let data = {};
        try {
            const text = await res.text();
            data = text ? JSON.parse(text) : {};
        } catch(e) {
            data = {};
        }
        if (res.status === 401 || (data && data.status === 401)) {
            data.isUnauthorized = true;
            data.status = 401;
            if (!data.error) data.error = "Unauthorized: Invalid or missing API key. Please check your API key in config.js.";
        }
        return data;
    } catch(err) {
        clearTimeout(timeoutId);
        console.warn('[Matrix API] safeFetchJson warning:', err);
        return {};
    }
}

let _isBusy = false;

function setButtonsBusy(busy, actionType) {
    _isBusy = busy;
    const applyBtn = document.querySelector('.wijzigen');
    const resetBtn = document.querySelector('.verwijderen');

    if (applyBtn) {
        applyBtn.disabled = busy;
        applyBtn.style.opacity = busy ? '0.6' : '1.0';
        applyBtn.style.pointerEvents = busy ? 'none' : 'auto';
        if (busy && actionType === 'apply') {
            applyBtn.dataset.origText = applyBtn.dataset.origText || applyBtn.textContent;
            applyBtn.textContent = '...';
        } else if (!busy && applyBtn.dataset.origText) {
            applyBtn.textContent = applyBtn.dataset.origText;
        }
    }

    if (resetBtn) {
        resetBtn.disabled = busy;
        resetBtn.style.opacity = busy ? '0.6' : '1.0';
        resetBtn.style.pointerEvents = busy ? 'none' : 'auto';
        if (busy && actionType === 'reset') {
            resetBtn.dataset.origText = resetBtn.dataset.origText || resetBtn.textContent;
            resetBtn.textContent = '...';
        } else if (!busy && resetBtn.dataset.origText) {
            resetBtn.textContent = resetBtn.dataset.origText;
        }
    }
}

function showUnauthorizedNotice(customMsg) {
    const msg = customMsg || 'Access Denied: Unauthorized (Invalid or missing API key). Please configure a valid API key in config.js or add ?apikey=YOUR_KEY to the URL.';
    alert('⚠️ Access Denied: Unauthorized!\n\n' + msg);
}

function showAuthBanner(msg) {
    let banner = document.getElementById('auth-error-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'auth-error-banner';
        banner.style.position = 'fixed';
        banner.style.top = '12px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = '#b91c1c';
        banner.style.color = '#ffffff';
        banner.style.padding = '10px 22px';
        banner.style.borderRadius = '8px';
        banner.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        banner.style.zIndex = '99999';
        banner.style.fontFamily = 'sans-serif';
        banner.style.fontSize = '13px';
        banner.style.fontWeight = '600';
        banner.style.display = 'flex';
        banner.style.alignItems = 'center';
        banner.style.gap = '10px';
        banner.innerHTML = `<span>🔒 <strong>Access Denied:</strong> Invalid or missing API key. Please check config.js.</span>`;
        document.body.appendChild(banner);
    }
}

function hideAuthBanner() {
    const banner = document.getElementById('auth-error-banner');
    if (banner) {
        banner.remove();
    }
}

function herstel() {
    if (_isBusy) return;
    if (!currentMarker) {
        alert(t('noMarkerActive'));
        return;
    }

    setButtonsBusy(true, 'reset');

    const payload = [];

    // Reset all lanes in memory and in form for this marker
    Object.keys(currentMarker.rijstroken).forEach(key => {
        currentMarker.rijstroken[key].m = null;
        updateDropdownDisplay(key, "");
        const select = document.getElementById(key.toUpperCase());
        if (select) {
            select.value = "";
        }
        payload.push({
            marker: "",
            coords: currentMarker.rijstroken[key].c,
            heading: currentMarker.rijstroken[key].h
        });
    });

    closeAllCustomDropdowns();

    // Immediate optimistic update on map dot
    const markericon = document.getElementById(currentMarker.id);
    if (markericon) {
        markericon.classList.remove('active');
        markericon.title = t('notInOperation');
    }

    // Direct immediate API call
    safeFetchJson(getApiEndpoint('resetmarkering', payload), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ data: payload })
    }).then(res => {
        if (res && res.error && (res.error.toLowerCase().includes('unauthorized') || res.status === 401)) {
            showUnauthorizedNotice(res.error);
            showAuthBanner(res.error);
            return;
        }
        if (res && res.success === false && res.error) {
            alert('Error: ' + res.error);
            return;
        }
        hideAuthBanner();
        console.log('[Matrix] Server reset response:', res);
        if (res && res.activeMarkers) {
            updateActiveMarkersOnMap(res.activeMarkers, false);
        }
        if (typeof window.syncMatrixStatus === 'function') {
            window.syncMatrixStatus();
        }
    }).catch(err => {
        console.error('[Matrix] Reset error:', err);
    }).finally(() => {
        setTimeout(() => { setButtonsBusy(false); }, 200);
    });
}

function wijzigSituatie() {
    if (_isBusy) return;
    if (!currentMarker) {
        alert(t('noMarkerActive'));
        return;
    }

    setButtonsBusy(true, 'apply');

    const payload = [];
    let hasAnyActiveLane = false;

    Object.keys(currentMarker.rijstroken).forEach(key => {
        const select = document.getElementById(key.toUpperCase());
        const chosen = (select && select.value !== "" && select.value !== null) ? select.value : "";
        currentMarker.rijstroken[key].m = chosen === "" ? null : chosen;

        if (chosen !== "") {
            hasAnyActiveLane = true;
        }

        // Send both active and cleared lanes so server synchronizes completely
        payload.push({
            marker: chosen,
            coords: currentMarker.rijstroken[key].c,
            heading: currentMarker.rijstroken[key].h
        });
    });

    closeAllCustomDropdowns();

    // Immediate optimistic update on map dot
    const markericon = document.getElementById(currentMarker.id);
    if (markericon) {
        if (hasAnyActiveLane) {
            markericon.classList.add('active');
            markericon.title = t('inOperation');
        } else {
            markericon.classList.remove('active');
            markericon.title = t('notInOperation');
        }
    }

    // Direct immediate API call
    safeFetchJson(getApiEndpoint('spawnmarkering', payload), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ data: payload })
    }).then(res => {
        if (res && res.error && (res.error.toLowerCase().includes('unauthorized') || res.status === 401)) {
            showUnauthorizedNotice(res.error);
            showAuthBanner(res.error);
            return;
        }
        if (res && res.success === false && res.error) {
            alert('Error: ' + res.error);
            return;
        }
        hideAuthBanner();
        console.log('[Matrix] Server spawn response:', res);
        if (res && res.activeMarkers) {
            updateActiveMarkersOnMap(res.activeMarkers, false);
        }
        if (typeof window.syncMatrixStatus === 'function') {
            window.syncMatrixStatus();
        }
    }).catch(err => {
        console.error('[Matrix] Spawn error:', err);
    }).finally(() => {
        setTimeout(() => { setButtonsBusy(false); }, 200);
    });
}

function getCoord(coords, idx) {
    if (!coords) return 0;
    if (Array.isArray(coords)) return Number(coords[idx]) || 0;
    if (typeof coords === 'object') {
        if (idx === 0) {
            if (coords.x !== undefined) return Number(coords.x) || 0;
            if (coords[0] !== undefined) return Number(coords[0]) || 0;
            if (coords['0'] !== undefined) return Number(coords['0']) || 0;
            if (coords[1] !== undefined) return Number(coords[1]) || 0;
            if (coords['1'] !== undefined) return Number(coords['1']) || 0;
        }
        if (idx === 1) {
            if (coords.y !== undefined) return Number(coords.y) || 0;
            if (coords[0] !== undefined || coords['0'] !== undefined || coords.x !== undefined) {
                if (coords[1] !== undefined) return Number(coords[1]) || 0;
                if (coords['1'] !== undefined) return Number(coords['1']) || 0;
            }
            if (coords[2] !== undefined) return Number(coords[2]) || 0;
            if (coords['2'] !== undefined) return Number(coords['2']) || 0;
        }
        if (idx === 2) {
            if (coords.z !== undefined) return Number(coords.z) || 0;
            if (coords[0] !== undefined || coords['0'] !== undefined || coords.x !== undefined) {
                if (coords[2] !== undefined) return Number(coords[2]) || 0;
                if (coords['2'] !== undefined) return Number(coords['2']) || 0;
            }
            if (coords[3] !== undefined) return Number(coords[3]) || 0;
            if (coords['3'] !== undefined) return Number(coords['3']) || 0;
        }
    }
    return 0;
}

function updateActiveMarkersOnMap(activeMarkers, allowUpdatingCurrent = false) {
    if (!activeMarkers || typeof activeMarkers !== 'object') return;
    const activeList = Object.values(activeMarkers);
    const isAnyDropdownOpen = !!document.querySelector('.custom-dropdown.open');

    markers.forEach(m => {
        if (!m.rijstroken) return;
        let isActive = false;
        const isCurrentActiveMarker = currentMarker && currentMarker.id === m.id;

        Object.keys(m.rijstroken).forEach(laneKey => {
            const lane = m.rijstroken[laneKey];
            if (!lane || !lane.c) return;

            let matchedMarker = null;
            activeList.forEach(item => {
                if (item && item.marker && item.marker !== "" && item.coords) {
                    const ix = getCoord(item.coords, 0);
                    const iy = getCoord(item.coords, 1);
                    const lx = getCoord(lane.c, 0);
                    const ly = getCoord(lane.c, 1);

                    const dist = Math.hypot(ix - lx, iy - ly);
                    if (dist < 2.5) {
                        matchedMarker = item.marker;
                        isActive = true;
                    }
                }
            });

            // Update lane in memory (protect only while dropdown is actively open)
            if (!isCurrentActiveMarker || !isAnyDropdownOpen || allowUpdatingCurrent) {
                lane.m = matchedMarker;
            }
        });

        // Always update map dot visuals
        const el = document.getElementById(m.id);
        if (el) {
            if (isActive) {
                el.classList.add('active');
                el.title = t('inOperation');
            } else {
                el.classList.remove('active');
                el.title = t('notInOperation');
            }
        }
    });

    // If explicit update is requested (e.g. on initial load or manual refresh), update form inputs
    if (allowUpdatingCurrent && currentMarker && currentMarker.rijstroken) {
        ["L1","L2","L3","L4","R1","R2","R3","R4"].forEach(key => {
            if (currentMarker.rijstroken[key]) {
                const lane = currentMarker.rijstroken[key];
                const select = document.getElementById(key.toUpperCase());
                const val = (lane && lane.m) ? lane.m : "";
                if (select) {
                    select.value = val;
                    updateDropdownDisplay(key, val);
                }
            }
        });
    }
}

// PadUI Tablet Auto-Sync
if (inPadUI) {
    document.body.classList.add('in-padui');
    const initPadUI = () => {
        const layout = document.getElementById('layout');
        if (layout) layout.style.display = 'flex';
        if (!mapgemaakt) {
            mapgemaakt = true;
            initTransform();
            startmap();
            initCustomDropdowns();
        }
        safeFetchJson(`https://${getResourceName()}/requestActiveMarkersPadUI`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({})
        })
        .then(data => {
            if (data) {
                if (data.language) setLanguage(data.language);
                if (data.activeMarkers) updateActiveMarkersOnMap(data.activeMarkers, true);
                if (data.x !== undefined && data.y !== undefined) {
                    playerMapPos = worldToMap(data.x, data.y);
                    if (typeof render === "function") render();
                }
            }
        })
        .catch(() => {});
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initPadUI);
    } else {
        initPadUI();
    }
}

// Web Mode Auto-Sync (Voor externe websites & live dispatch centers)
if (isWeb) {
    document.body.classList.add('in-web');
    const initWeb = () => {
        const layout = document.getElementById('layout');
        if (layout) layout.style.display = 'flex';
        const imgEl = document.getElementById('mapImage');
        if (imgEl && window.MAP_IMAGE_DATA) {
            imgEl.src = window.MAP_IMAGE_DATA;
        }
        if (!mapgemaakt) {
            mapgemaakt = true;
            initTransform();
            startmap();
            initCustomDropdowns();
        }

        const fetchWebStatus = () => {
            safeFetchJson(getApiEndpoint('active'), {
                method: 'GET',
                headers: getApiHeaders()
            })
            .then(data => {
                if (data && data.success) {
                    if (data.language) setLanguage(data.language);
                    if (data.activeMarkers) updateActiveMarkersOnMap(data.activeMarkers, false);
                }
            })
            .catch(() => {});
        };

        window.syncMatrixStatus = fetchWebStatus;
        fetchWebStatus();
        setInterval(fetchWebStatus, 1500);
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initWeb);
    } else {
        initWeb();
    }
}

window.addEventListener('message', (event) => {
    if (event.data.action === 'matrix:setLanguage') {
        if (event.data.language) {
            setLanguage(event.data.language);
        }
        return;
    }

    if (event.data.action === 'matrix:syncActiveMarkers') {
        if (event.data.activeMarkers) {
            updateActiveMarkersOnMap(event.data.activeMarkers, false);
        }
        return;
    }

    if (event.data.action !== 'MTM-MATRIXBORDEN:openmenu' && event.data.action !== 'MTM-MATRIXDEV:openmenu') return;

    if (event.data.language) {
        setLanguage(event.data.language);
    }

    const layout = document.getElementById('layout');

    if (!event.data.bool && !inPadUI && !isWeb) {
        layout.style.display = "none";
        currentMarker = null;
        closeAllCustomDropdowns();
        document.querySelectorAll('.map-marker-icon.selected, .marker.selected').forEach(el => el.classList.remove('selected'));
        const menuID = document.getElementById('menu');
        if (menuID) menuID.classList.remove('open');
        return;
    }

    layout.style.display = "flex";
    initCustomDropdowns();

    if (!mapgemaakt) {
        mapgemaakt = true;

        initTransform();   // MUST FIRST
        startmap();
    }

    if (event.data.activeMarkers) {
        updateActiveMarkersOnMap(event.data.activeMarkers, true);
    }

    const playerPos = {
        x: event.data.x,
        y: event.data.y
    };

    playerMapPos = worldToMap(playerPos.x, playerPos.y);

    // BELANGRIJK: alles opnieuw renderen via 1 pipeline
    if (typeof render === "function") {
        render();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && !inPadUI && !isWeb) {
        currentMarker = null;
        closeAllCustomDropdowns();
        document.querySelectorAll('.map-marker-icon.selected, .marker.selected').forEach(el => el.classList.remove('selected'));
        const menuID = document.getElementById('menu');
        if (menuID) menuID.classList.remove('open');

        safeFetchJson(`https://${getResourceName()}/closemenu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ bool: false })
        }).catch(() => {});
    }
});