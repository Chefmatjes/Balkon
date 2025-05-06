// Balkonmodell JavaScript Implementierung
// Basierend auf den FreeCAD Python-Skripten detailed_balkon.py und detailed_balkon_golden_oak.py

// Balkon-Abmessungen (in Metern)
const balkonBreite = 5.75;    // Breite des Balkons (lange Seite)
const balkonTiefe = 1.5;      // Tiefe des Balkons (kurze Seite)
const balkonHoehe = 1.0;      // Höhe über dem Boden
const gelaenderHoehe = 1.0;   // Höhe des Geländers
const bodenDicke = 0.2;       // Dicke des Balkonbodens
const eckAbstand = 0.15;      // Abstand der Pfosten von den Ecken

// Geländerabmessungen
const goldenOakBreiteStandard = 0.1;  // 10 cm breite Golden Oak Bretter (Standardmodell)
const goldenOakBreiteEnhanced = 0.14; // 15 cm breite Golden Oak Bretter (erweitertes Modell)
const wildgruenBreite = 0.175;          // 20 cm breite Wildgrün Bretter
const brettDicke = 0.02;              // 2 cm Dicke der Bretter
const brettAbstand = 0.03;            // 3 cm Abstand zwischen den Brettern
const haltebrettHoehe = 0.05;         // 5 cm Höhe der horizontalen Haltebretter
const haltebrettDicke = 0.03;         // 3 cm Dicke der horizontalen Haltebretter
const haltebrettAbstand = 0.2;        // Abstand zwischen horizontalen Halterungen

// Farben (RGB-Format)
const goldenOakFarbe = {r: 210, g: 150, b: 27};  // Golden Oak Farbe
const wildgruenFarbe = {r: 45, g: 92, b: 62};    // Wildgrün Farbe
const haltebrettFarbe = {r: 80, g: 80, b: 80};   // Haltebretter Farbe
const postenFarbe = {r: 102, g: 102, b: 102};    // Pfosten Farbe
const bodenFarbe = {r: 179, g: 179, b: 179};     // Boden Farbe

// Pfosten-Abstände
const abstandLangeSeite = (balkonBreite - 2 * eckAbstand) / 5;  // 5 Abstände für 6 Pfosten
const abstandKurzeSeite = (balkonTiefe - 2 * eckAbstand) / 2;   // 2 Abstände für 3 Pfosten

/**
 * Berechnet die Brettpositionierung für ein Muster
 * @param {number} fullLength - Gesamtlänge des Geländers
 * @param {number} goldenOakWidth - Breite der Golden Oak Bretter
 * @returns {Object} Informationen über die Brettanordnung und Abstände
 */
function calculateBoardPattern(fullLength, goldenOakWidth) {
    const baseGoldenOakWidth = goldenOakWidth;
    const baseWildgruenWidth = wildgruenBreite;
    
    // Feste Bretter am Anfang: 2 Golden Oak
    const startWidth = 2 * baseGoldenOakWidth;
    
    // Breite eines vollständigen Musters (WG-GO-GO)
    const patternWidth = baseWildgruenWidth + 2 * baseGoldenOakWidth;
    
    // Verfügbare Länge für Wiederholungsmuster
    const availableLength = fullLength - startWidth;
    
    // Wie viele vollständige Muster passen rein?
    const numCompletePatterns = Math.floor(availableLength / patternWidth);
    
    // Restlänge für Abstände
    const totalBoardWidth = startWidth + (numCompletePatterns * patternWidth);
    const totalBoards = 2 + (numCompletePatterns * 3);  // 2 GO Start + (WG+GO+GO) * num_patterns
    
    // Berechne idealisierten Abstand
    // Anzahl der Abstände = Anzahl der Bretter + 1
    const numGaps = totalBoards + 1;
    let gapSpace = fullLength - totalBoardWidth;
    let idealGap = gapSpace / numGaps;
    
    let finalNumPatterns = numCompletePatterns;
    
    // Wenn der Abstand zu klein ist, reduziere um ein Muster
    const minGap = 0.02;  // Mindestabstand 2 cm
    if (idealGap < minGap && numCompletePatterns > 0) {
        finalNumPatterns = numCompletePatterns - 1;
        const newTotalBoardWidth = startWidth + (finalNumPatterns * patternWidth);
        const newTotalBoards = 2 + (finalNumPatterns * 3);
        const newNumGaps = newTotalBoards + 1;
        gapSpace = fullLength - newTotalBoardWidth;
        idealGap = gapSpace / newNumGaps;
    }
    
    // Erstelle die Brett-Liste
    const boardTypes = [];
    
    // 2 Golden Oak am Anfang
    boardTypes.push("GO");
    boardTypes.push("GO");
    
    // Füge die vollständigen Muster hinzu
    for (let i = 0; i < finalNumPatterns; i++) {
        boardTypes.push("WG");  // Wildgrün
        boardTypes.push("GO");  // Golden Oak
        boardTypes.push("GO");  // Golden Oak
    }
    
    // Berechne die tatsächlichen Positionen der Bretter
    const boardPositions = [];
    let currentPos = -fullLength / 2 + idealGap;
    
    for (let i = 0; i < boardTypes.length; i++) {
        const boardType = boardTypes[i];
        const boardWidth = boardType === "GO" ? baseGoldenOakWidth : baseWildgruenWidth;
        const color = boardType === "GO" ? goldenOakFarbe : wildgruenFarbe;
        
        boardPositions.push({
            type: boardType,
            position: currentPos,
            width: boardWidth,
            color: color
        });
        
        currentPos += boardWidth + idealGap;
    }
    
    return {
        boardPositions: boardPositions,
        gap: idealGap,
        totalBoards: boardTypes.length,
        goldenOakCount: boardTypes.filter(type => type === "GO").length,
        wildgruenCount: boardTypes.filter(type => type === "WG").length
    };
}

/**
 * Berechnet die Positionen der vertikalen Bretter für die Vorder- und Seitengeländer
 * @param {boolean} useEnhancedModel - Ob das erweiterte Modell mit breiteren Golden Oak Brettern verwendet werden soll
 * @returns {Object} Positionsinformationen für alle Geländerbereiche
 */
function calculateRailingBoards(useEnhancedModel = false) {
    const goldenOakWidth = useEnhancedModel ? goldenOakBreiteEnhanced : goldenOakBreiteStandard;
    
    const frontRailing = calculateBoardPattern(balkonBreite, goldenOakWidth);
    const leftSideRailing = calculateBoardPattern(balkonTiefe, goldenOakWidth);
    const rightSideRailing = calculateBoardPattern(balkonTiefe, goldenOakWidth);
    
    return {
        front: frontRailing,
        leftSide: leftSideRailing,
        rightSide: rightSideRailing,
        goldenOakWidth: goldenOakWidth,
        wildgruenWidth: wildgruenBreite
    };
}

/**
 * Berechnet die Positionen der Pfosten für das Geländer
 * @returns {Object} Array mit Pfostenpositionsinformationen
 */
function calculatePosts() {
    const posts = [];
    
    // Vordere Pfosten (6 Stück)
    for (let i = 0; i < 6; i++) {
        const x = -balkonBreite / 2 + eckAbstand + i * abstandLangeSeite;
        posts.push({
            x: x,
            y: balkonTiefe / 2,
            z: balkonHoehe,
            height: gelaenderHoehe
        });
    }
    
    // Seitliche Pfosten (je 3 Stück)
    for (let i = 0; i < 3; i++) {
        const y = -balkonTiefe / 2 + eckAbstand + i * abstandKurzeSeite;
        
        // Linke Seite
        posts.push({
            x: -balkonBreite / 2,
            y: y,
            z: balkonHoehe,
            height: gelaenderHoehe
        });
        
        // Rechte Seite
        posts.push({
            x: balkonBreite / 2,
            y: y,
            z: balkonHoehe,
            height: gelaenderHoehe
        });
    }
    
    return posts;
}

/**
 * Berechnet die horizontalen Halterungen für das Geländer
 * @returns {Object} Array mit Informationen zu horizontalen Halterungen
 */
function calculateHorizontalSupports() {
    const supports = [];
    const numSupports = Math.floor(gelaenderHoehe / haltebrettAbstand) + 1;
    
    // Vordere Halterungen
    for (let i = 0; i < numSupports; i++) {
        const height = balkonHoehe + (i * haltebrettAbstand) + haltebrettHoehe / 2;
        supports.push({
            x: 0,  // Mittelpunkt
            y: balkonTiefe / 2,
            z: height,
            width: balkonBreite - 2 * eckAbstand,
            depth: haltebrettDicke,
            height: haltebrettHoehe,
            orientation: 'horizontal'
        });
    }
    
    // Seitliche Halterungen
    for (let i = 0; i < numSupports; i++) {
        const height = balkonHoehe + (i * haltebrettAbstand) + haltebrettHoehe / 2;
        
        // Linke Seite
        supports.push({
            x: -balkonBreite / 2,
            y: 0,  // Mittelpunkt
            z: height,
            width: haltebrettDicke,
            depth: balkonTiefe - 2 * eckAbstand,
            height: haltebrettHoehe,
            orientation: 'vertical'
        });
        
        // Rechte Seite
        supports.push({
            x: balkonBreite / 2,
            y: 0,  // Mittelpunkt
            z: height,
            width: haltebrettDicke,
            depth: balkonTiefe - 2 * eckAbstand,
            height: haltebrettHoehe,
            orientation: 'vertical'
        });
    }
    
    return supports;
}

/**
 * Berechnet die Handläufe für das Geländer
 * @returns {Object} Array mit Informationen zu den Handläufen
 */
function calculateHandrails() {
    const handrails = [
        // Vorderer Handlauf
        {
            x1: -balkonBreite / 2,
            y1: balkonTiefe / 2,
            z1: balkonHoehe + gelaenderHoehe,
            x2: balkonBreite / 2,
            y2: balkonTiefe / 2,
            z2: balkonHoehe + gelaenderHoehe,
            orientation: 'horizontal'
        },
        // Linker Handlauf
        {
            x1: -balkonBreite / 2,
            y1: -balkonTiefe / 2,
            z1: balkonHoehe + gelaenderHoehe,
            x2: -balkonBreite / 2,
            y2: balkonTiefe / 2,
            z2: balkonHoehe + gelaenderHoehe,
            orientation: 'vertical'
        },
        // Rechter Handlauf
        {
            x1: balkonBreite / 2,
            y1: -balkonTiefe / 2,
            z1: balkonHoehe + gelaenderHoehe,
            x2: balkonBreite / 2,
            y2: balkonTiefe / 2,
            z2: balkonHoehe + gelaenderHoehe,
            orientation: 'vertical'
        }
    ];
    
    return handrails;
}

/**
 * Berechnet die Stützpfosten für den Balkon
 * @returns {Object} Array mit Informationen zu den Stützpfosten
 */
function calculateSupportPosts() {
    const supportPosts = [
        {
            x: -balkonBreite / 2 + 0.1,
            y: balkonTiefe / 2 - 0.1,
            z: 0,
            height: balkonHoehe,
            radius: 0.1
        },
        {
            x: balkonBreite / 2 - 0.1,
            y: balkonTiefe / 2 - 0.1,
            z: 0,
            height: balkonHoehe,
            radius: 0.1
        }
    ];
    
    return supportPosts;
}

/**
 * Erstellt ein komplettes Balkonmodell mit allen Komponenten
 * @param {boolean} useEnhancedModel - Ob das erweiterte Modell mit breiteren Golden Oak Brettern verwendet werden soll
 * @returns {Object} Komplettes Balkonmodell
 */
function createBalkonModel(useEnhancedModel = false) {
    const modelName = useEnhancedModel ? "DetailedBalkonGoldenOak" : "DetailedBalkon";
    
    const model = {
        name: modelName,
        dimensions: {
            width: balkonBreite,
            depth: balkonTiefe,
            height: balkonHoehe,
            railingHeight: gelaenderHoehe,
            floorThickness: bodenDicke
        },
        floor: {
            width: balkonBreite,
            depth: balkonTiefe,
            thickness: bodenDicke,
            color: bodenFarbe,
            position: {
                x: 0,
                y: 0,
                z: balkonHoehe - bodenDicke / 2
            }
        },
        railingBoards: calculateRailingBoards(useEnhancedModel),
        posts: calculatePosts(),
        horizontalSupports: calculateHorizontalSupports(),
        handrails: calculateHandrails(),
        supportPosts: calculateSupportPosts()
    };
    
    return model;
}

// Erstelle beide Modelle
const standardModel = createBalkonModel(false);
const enhancedModel = createBalkonModel(true);

// Exportiere die Modelle und Hilfsfunktionen
module.exports = {
    standardModel,
    enhancedModel,
    calculateBoardPattern,
    calculateRailingBoards,
    calculatePosts,
    calculateHorizontalSupports,
    calculateHandrails,
    calculateSupportPosts,
    createBalkonModel,
    // Konstanten
    dimensions: {
        balkonBreite,
        balkonTiefe,
        balkonHoehe,
        gelaenderHoehe,
        bodenDicke,
        eckAbstand,
        goldenOakBreiteStandard,
        goldenOakBreiteEnhanced,
        wildgruenBreite,
        brettDicke,
        brettAbstand,
        haltebrettHoehe,
        haltebrettDicke,
        haltebrettAbstand
    },
    colors: {
        goldenOakFarbe,
        wildgruenFarbe,
        haltebrettFarbe,
        postenFarbe,
        bodenFarbe
    }
}; 