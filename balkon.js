// Hauptfunktion für die 3D-Visualisierung
document.addEventListener('DOMContentLoaded', () => {
    // Variablen für die Balkon-Dimensionen (in Metern)
    const balkonBreite = 3.5;    // Breite des Balkons (lange Seite)
    const balkonTiefe = 1.5;     // Tiefe des Balkons (kurze Seite)
    const balkonHoehe = 1.0;     // Höhe über dem Boden
    const gelaenderHoehe = 1.0;  // Höhe des Geländers
    const bodenDicke = 0.2;      // Dicke des Balkonbodens
    const eckAbstand = 0.15;     // Abstand der Pfosten von den Ecken

    // Variablen für das Geländer
    const goldenOakBreite = 0.1;   // 10 cm breite Golden Oak Bretter
    const wildgruenBreite = 0.2;   // 20 cm breite Wildgrün Bretter
    const brettDicke = 0.02;       // 2 cm Dicke der Bretter
    const brettAbstand = 0.03;     // 3 cm Abstand zwischen den Brettern
    const haltebrettHoehe = 0.05;  // 5 cm Höhe der horizontalen Haltebretter
    const haltebrettDicke = 0.03;  // 3 cm Dicke der horizontalen Haltebretter
    const haltebrettAbstand = 0.2; // Abstand zwischen den horizontalen Haltebrettern
    const goldenOakFarbe = 0xD2961B; // Goldene Eiche Farbe (angenähert)
    const wildgruenFarbe = 0x2D5C3E; // RAL Wildgrün (angenähert)
    const haltebrettFarbe = 0x505050; // Dunkelgrau für die Haltebretter

    // Berechnung der Abstände für gleichmäßige Verteilung der Pfosten - jetzt global definiert
    const abstandLangeSeite = (balkonBreite - 2 * eckAbstand) / 5; // 5 Zwischenräume für 6 Pfosten
    const abstandKurzeSeite = (balkonTiefe - 2 * eckAbstand) / 2;  // 2 Zwischenräume für 3 Pfosten

    // Three.js Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Himmelblau für den Hintergrund
    
    // Kamera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    // Kontrollen für die Kamera
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Textur-Loader erstellen
    const textureLoader = new THREE.TextureLoader();
    
    // Golden Oak Textur direkt generieren (keine externe Datei notwendig)
    const goldenOakTextur = erstelleGoldenOakTextur();
    
    // Golden Oak Textur direkt im Code erstellen
    function erstelleGoldenOakTextur() {
        // Canvas erstellen
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Grundfarbe (Golden Oak)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#D8A449');
        gradient.addColorStop(0.3, '#D2961B');
        gradient.addColorStop(0.7, '#C08A19');
        gradient.addColorStop(1, '#B37F17');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Holzmaserung hinzufügen
        // Hauptmaserung
        for (let i = 0; i < 80; i++) {
            const y = Math.random() * canvas.height;
            const width = 1 + Math.random() * 3;
            const opacity = 0.1 + Math.random() * 0.2;
            
            ctx.strokeStyle = `rgba(150, 100, 50, ${opacity})`;
            ctx.lineWidth = width;
            
            const amplitude = 5 + Math.random() * 15;
            const frequency = 0.005 + Math.random() * 0.01;
            const phase = Math.random() * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x < canvas.width; x += 2) {
                ctx.lineTo(x, y + Math.sin(x * frequency + phase) * amplitude);
            }
            
            ctx.stroke();
        }
        
        // Dunklere Maserungslinien
        for (let i = 0; i < 30; i++) {
            const y = Math.random() * canvas.height;
            const width = 0.5 + Math.random() * 2;
            
            ctx.strokeStyle = 'rgba(100, 60, 20, 0.4)';
            ctx.lineWidth = width;
            
            const amplitude = 2 + Math.random() * 8;
            const frequency = 0.01 + Math.random() * 0.02;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            for (let x = 0; x < canvas.width; x += 1) {
                ctx.lineTo(x, y + Math.sin(x * frequency) * amplitude);
            }
            
            ctx.stroke();
        }
        
        // Astlöcher und Holzdetails
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = 5 + Math.random() * 15;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#8B5A00');
            gradient.addColorStop(0.5, '#6B4400');
            gradient.addColorStop(1, '#9A6600');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Ringe um die Astlöcher
            for (let j = 0; j < 3; j++) {
                const ringRadius = radius * (1.2 + j * 0.3);
                ctx.strokeStyle = `rgba(160, 120, 60, ${0.3 - j * 0.1})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Feine Holzstruktur
        // Überlagerung mit feiner Textur
        ctx.fillStyle = 'rgba(210, 180, 140, 0.1)';
        
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 0.5 + Math.random() * 1.5;
            
            ctx.fillRect(x, y, size, size);
        }
        
        // Vertikale Struktur
        for (let x = 0; x < canvas.width; x += 4) {
            ctx.strokeStyle = 'rgba(180, 140, 80, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            
            for (let y = 0; y < canvas.height; y += 2) {
                const offset = Math.random() * 2 - 1;
                ctx.lineTo(x + offset, y);
            }
            
            ctx.stroke();
        }
        
        // Textur aus Canvas erstellen
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 3); // Für vertikale Bretter
        
        return texture;
    }
    
    // Beleuchtung
    // Ambientes Licht
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Sonnenlicht
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Hilfsachsen anzeigen
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Boden/Umgebung erstellen
    function erstelleUmgebung() {
        // Boden
        const bodenGeometrie = new THREE.PlaneGeometry(20, 20);
        const bodenMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x7CFC00,
            side: THREE.DoubleSide,
            roughness: 0.8
        });
        const boden = new THREE.Mesh(bodenGeometrie, bodenMaterial);
        boden.rotation.x = -Math.PI / 2;
        boden.receiveShadow = true;
        scene.add(boden);
        
        // Das Haus wird entfernt
    }
    
    // Balkon erstellen
    function erstelleBalkon() {
        // Balkonboden
        const bodenGeometrie = new THREE.BoxGeometry(balkonBreite, bodenDicke, balkonTiefe);
        const bodenMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xA0A0A0,
            roughness: 0.5
        });
        const balkonBoden = new THREE.Mesh(bodenGeometrie, bodenMaterial);
        balkonBoden.position.set(0, balkonHoehe, 0);
        balkonBoden.castShadow = true;
        balkonBoden.receiveShadow = true;
        scene.add(balkonBoden);
        
        // Geländer erstellen - auf allen vier Seiten, da freistehend
        erstelleGelaender();
        
        // Vier Stützen für den freistehenden Balkon
        erstelleStuetze(-balkonBreite/2 + 0.1, balkonTiefe/2 - 0.1);
        erstelleStuetze(balkonBreite/2 - 0.1, balkonTiefe/2 - 0.1);
        // erstelleStuetze(-balkonBreite/2 + 0.1, -balkonTiefe/2 + 0.1);
        // erstelleStuetze(balkonBreite/2 - 0.1, -balkonTiefe/2 + 0.1);
    }
    
    // Geländer erstellen
    function erstelleGelaender() {
        const gelaenderMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x707070,
            metalness: 0.5,
            roughness: 0.2
        });
        
        // Pfosten entlang der vorderen langen Seite (6 Pfosten)
        for (let i = 0; i < 6; i++) {
            const x = -balkonBreite/2 + eckAbstand + i * abstandLangeSeite;
            erstellePfosten(x, balkonTiefe/2);
        }
        
        // Pfosten entlang der hinteren langen Seite (6 Pfosten)
        // for (let i = 0; i < 6; i++) {
        //     const x = -balkonBreite/2 + eckAbstand + i * abstandLangeSeite;
        //     erstellePfosten(x, -balkonTiefe/2);
        // }
        
        // Pfosten entlang der linken kurzen Seite (3 Pfosten)
        for (let i = 2; i > 0; i--) {
            const z = -balkonTiefe/2 + eckAbstand + i * abstandKurzeSeite;
            erstellePfosten(-balkonBreite/2, z);
        }
        
        // Pfosten entlang der rechten kurzen Seite (3 Pfosten)
        for (let i = 2; i > 0; i--) {
            const z = -balkonTiefe/2 + eckAbstand + i * abstandKurzeSeite;
            erstellePfosten(balkonBreite/2, z);
        }
        
        // Horizontale Haltebretter für alle Seiten (vor den Pfosten)
        erstelleHorizontaleHaltebretter(true, balkonTiefe/2);    // Vordere Seite
        // erstelleHorizontaleHaltebretter(true, -balkonTiefe/2);   // Hintere Seite
        erstelleHorizontaleHaltebretter(false, -balkonBreite/2); // Linke Seite
        erstelleHorizontaleHaltebretter(false, balkonBreite/2);  // Rechte Seite
        
        // Handläufe für alle Seiten (oben auf den Pfosten)
        erstelleHandlauf(-balkonBreite/2, balkonBreite/2, 0, balkonTiefe/2, true);  // Vorderer Handlauf
        // erstelleHandlauf(-balkonBreite/2, balkonBreite/2, 0, -balkonTiefe/2, true); // Hinterer Handlauf
        erstelleHandlauf(-balkonBreite/2, -balkonBreite/2, -balkonTiefe/2, balkonTiefe/2, false); // Linker Handlauf
        erstelleHandlauf(balkonBreite/2, balkonBreite/2, -balkonTiefe/2, balkonTiefe/2, false);   // Rechter Handlauf
        
        // Vertikale Bretter für alle Seiten
        erstelleVertikaleBretter(true, balkonTiefe/2);    // Vordere Seite
        // erstelleVertikaleBretter(true, -balkonTiefe/2);   // Hintere Seite
        erstelleVertikaleBretter(false, (-balkonBreite-haltebrettDicke-0.1)/2); // Linke Seite
        erstelleVertikaleBretter(false, balkonBreite/2);  // Rechte Seite
    }
    
    // Handlauf erstellen
    function erstelleHandlauf(x1, x2, z1, z2, isXAxis) {
        const handlaufMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x505050,
            metalness: 0.7,
            roughness: 0.2
        });
        
        const laenge = isXAxis ? Math.abs(x2 - x1) : Math.abs(z2 - z1);
        const handlaufGeometrie = new THREE.CylinderGeometry(0.03, 0.03, laenge, 16);
        const handlauf = new THREE.Mesh(handlaufGeometrie, handlaufMaterial);
        
        if (isXAxis) {
            handlauf.rotation.z = Math.PI/2;
            handlauf.position.set((x1 + x2)/2, balkonHoehe + gelaenderHoehe, z1);
        } else {
            handlauf.rotation.x = Math.PI/2;
            handlauf.position.set(x1, balkonHoehe + gelaenderHoehe, (z1 + z2)/2);
        }
        
        scene.add(handlauf);
    }
    
    // Horizontale Haltebretter erstellen
    function erstelleHorizontaleHaltebretter(isXAxis, position) {
        const haltebrettMaterial = new THREE.MeshStandardMaterial({
            color: haltebrettFarbe,
            roughness: 0.5,
            metalness: 0.7
        });
        
        const verfuegbareLaenge = isXAxis ? balkonBreite - 2 * eckAbstand : balkonTiefe - 2 * eckAbstand;
        
        // Anzahl der Haltebretter (oben, unten und Zwischenbretter)
        const anzahlHaltebretter = Math.floor(gelaenderHoehe / haltebrettAbstand) + 1;
        
        // Erstelle Haltebretter in gleichmäßigen Abständen
        for (let i = 0; i < anzahlHaltebretter; i++) {
            const hoehe = balkonHoehe + (i * haltebrettAbstand) + haltebrettHoehe/2;
            
            // Nach außen verschobene Position - vor den Geländerstützen
            const versatz = isXAxis ? (brettDicke * 1.5) : (brettDicke * 1.5);
            const position_mit_versatz = isXAxis ? position + versatz : position + versatz;
            
            const haltebrettGeometrie = new THREE.BoxGeometry(
                isXAxis ? verfuegbareLaenge : haltebrettDicke,
                haltebrettHoehe,
                isXAxis ? haltebrettDicke : verfuegbareLaenge
            );
            
            const haltebrett = new THREE.Mesh(haltebrettGeometrie, haltebrettMaterial);
            
            // Positioniere das Haltebrett mittig zwischen den Eckpfosten und nach außen versetzt
            haltebrett.position.set(
                isXAxis ? 0 : position_mit_versatz,
                hoehe,
                isXAxis ? position_mit_versatz : 0
            );
            
            scene.add(haltebrett);
            
            // Füge kleine Halterungen zwischen Pfosten und Haltebrett hinzu
            if (isXAxis) {
                // Für die langen Seiten (X-Achse)
                for (let j = 0; j < 6; j++) {
                    const x = -balkonBreite/2 + eckAbstand + j * abstandLangeSeite;
                    erstelleHalterung(x, hoehe, position, isXAxis);
                }
            } else {
                // Für die kurzen Seiten (Z-Achse)
                for (let j = 0; j < 3; j++) {
                    const z = -balkonTiefe/2 + eckAbstand + j * abstandKurzeSeite;
                    erstelleHalterung(position, hoehe, z, isXAxis);
                }
            }
        }
    }
    
    // Kleine Halterungen zwischen Pfosten und Haltebrett
    function erstelleHalterung(x, y, z, isXAxis) {
        const halterungMaterial = new THREE.MeshStandardMaterial({
            color: haltebrettFarbe,
            roughness: 0.5,
            metalness: 0.7
        });
        
        // Berechne die Länge der Halterung, die vom Pfosten zum Haltebrett reicht
        const halterungLaenge = brettDicke * 1.5;
        
        // Erstelle eine kleine Box als Halterung
        const halterungGeometrie = new THREE.BoxGeometry(
            isXAxis ? haltebrettDicke : halterungLaenge,
            haltebrettHoehe * 0.6, // Etwas kleiner als das Haltebrett
            isXAxis ? halterungLaenge : haltebrettDicke
        );
        
        const halterung = new THREE.Mesh(halterungGeometrie, halterungMaterial);
        
        // Positioniere die Halterung zwischen Pfosten und Haltebrett
        if (isXAxis) {
            const halterungPosition = z + (halterungLaenge / 2);
            halterung.position.set(x, y, halterungPosition);
        } else {
            const halterungPosition = x + (halterungLaenge / 2);
            halterung.position.set(halterungPosition, y, z);
        }
        
        scene.add(halterung);
        
        // Füge Schrauben/Bolzen an den Verbindungspunkten hinzu
        const schraubenMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Schraube am Pfosten
        const schraubePfosten = new THREE.CylinderGeometry(0.006, 0.006, haltebrettDicke * 2, 8);
        const schraubeP = new THREE.Mesh(schraubePfosten, schraubenMaterial);
        
        // Schraube am Haltebrett
        const schraubeHaltebrett = new THREE.CylinderGeometry(0.006, 0.006, haltebrettDicke * 2, 8);
        const schraubeH = new THREE.Mesh(schraubeHaltebrett, schraubenMaterial);
        
        if (isXAxis) {
            // Für die X-Achse (vorne/hinten)
            schraubeP.rotation.x = Math.PI/2;
            schraubeP.position.set(x, y, z + haltebrettDicke);
            
            schraubeH.rotation.x = Math.PI/2;
            schraubeH.position.set(x, y, z + halterungLaenge - haltebrettDicke/2);
        } else {
            // Für die Z-Achse (links/rechts)
            schraubeP.rotation.z = Math.PI/2;
            schraubeP.position.set(x + haltebrettDicke, y, z);
            
            schraubeH.rotation.z = Math.PI/2;
            schraubeH.position.set(x + halterungLaenge - haltebrettDicke/2, y, z);
        }
        
        scene.add(schraubeP);
        scene.add(schraubeH);
    }
    
    // Vertikale Bretter für das Geländer erstellen
    function erstelleVertikaleBretter(isXAxis, position) {
        // Golden Oak Material mit Textur
        const goldenOakMaterial = new THREE.MeshStandardMaterial({
            color: goldenOakFarbe,
            roughness: 0.7,
            metalness: 0.3,
            map: goldenOakTextur // Textur hinzufügen
        });
        
        // Wildgrün Material (unverändert)
        const wildgruenMaterial = new THREE.MeshStandardMaterial({
            color: wildgruenFarbe,
            roughness: 0.6,
            metalness: 0.4
        });
        
        const verfuegbareLaenge = isXAxis ? balkonBreite - 2 * eckAbstand : balkonTiefe - 2 * eckAbstand;
        
        // Optimierte Bretterberechnung für ein ausgewogenes Muster
        // 2 Golden Oak (10cm) + 1 Wildgrün (20cm) + Abstand dazwischen (3cm)
        const musterEinheit = 2 * goldenOakBreite + wildgruenBreite + 3 * brettAbstand;
        
        // Berechne, wie viele vollständige Mustereinheiten passen
        const anzahlMuster = Math.floor(verfuegbareLaenge / musterEinheit);
        
        // Berechne den verbleibenden Platz
        let restPlatz = verfuegbareLaenge - (anzahlMuster * musterEinheit);
        
        // Startposition
        let aktuellePosition = isXAxis ? -balkonBreite/2 + eckAbstand : -balkonTiefe/2 + eckAbstand;
        
        // Platziere die Mustereinheiten
        for (let i = 0; i < anzahlMuster; i++) {
            // Erstes Golden Oak Brett
            erstelleVertikalesBrett(
                isXAxis ? aktuellePosition + goldenOakBreite/2 : position,
                isXAxis ? position : aktuellePosition + goldenOakBreite/2,
                goldenOakBreite,
                isXAxis,
                goldenOakMaterial,
                true // außen montiert
            );
            aktuellePosition += goldenOakBreite + brettAbstand;
            
            // Zweites Golden Oak Brett
            erstelleVertikalesBrett(
                isXAxis ? aktuellePosition + goldenOakBreite/2 : position,
                isXAxis ? position : aktuellePosition + goldenOakBreite/2,
                goldenOakBreite,
                isXAxis,
                goldenOakMaterial,
                true // außen montiert
            );
            aktuellePosition += goldenOakBreite + brettAbstand;
            
            // Wildgrün Brett
            erstelleVertikalesBrett(
                isXAxis ? aktuellePosition + wildgruenBreite/2 : position,
                isXAxis ? position : aktuellePosition + wildgruenBreite/2,
                wildgruenBreite,
                isXAxis,
                wildgruenMaterial,
                true // außen montiert
            );
            aktuellePosition += wildgruenBreite + brettAbstand;
        }
        
        // Verteile den verbleibenden Platz falls nötig
        if (restPlatz > goldenOakBreite + brettAbstand) {
            // Platz für ein Golden Oak Brett + Abstand
            erstelleVertikalesBrett(
                isXAxis ? aktuellePosition + goldenOakBreite/2 : position,
                isXAxis ? position : aktuellePosition + goldenOakBreite/2,
                goldenOakBreite,
                isXAxis,
                goldenOakMaterial,
                true // außen montiert
            );
            aktuellePosition += goldenOakBreite + brettAbstand;
            restPlatz -= (goldenOakBreite + brettAbstand);
            
            // Wenn noch Platz für ein weiteres Brett ist
            if (restPlatz > goldenOakBreite) {
                let brettBreite = Math.min(restPlatz - brettAbstand, wildgruenBreite);
                if (brettBreite > 0.05) { // Mindestbreite von 5cm für ein Brett
                    erstelleVertikalesBrett(
                        isXAxis ? aktuellePosition + brettBreite/2 : position,
                        isXAxis ? position : aktuellePosition + brettBreite/2,
                        brettBreite,
                        isXAxis,
                        goldenOakMaterial,
                        true // außen montiert
                    );
                }
            }
        } else if (restPlatz > 0.05) { // Mindestbreite von 5cm für ein Brett
            // Platz für ein schmales Brett
            erstelleVertikalesBrett(
                isXAxis ? aktuellePosition + restPlatz/2 : position,
                isXAxis ? position : aktuellePosition + restPlatz/2,
                restPlatz,
                isXAxis,
                goldenOakMaterial,
                true // außen montiert
            );
        }
    }
    
    // Einzelnes vertikales Brett erstellen mit Verbindung zu Haltebrettern
    function erstelleVertikalesBrett(x, z, breite, isXAxis, material, isOutside = true) {
        // Versatz für außen montierte Bretter - angepasst für die neue Position der Haltebretter
        const versatz = isOutside ? (isXAxis ? brettDicke * 3 : brettDicke * 3) : 0;
        const position_x = isXAxis ? x : (isOutside ? x + versatz : x);
        const position_z = isXAxis ? (isOutside ? z + versatz : z) : z;
        
        // Hauptbrett
        const brettGeometrie = new THREE.BoxGeometry(
            isXAxis ? breite : brettDicke,
            gelaenderHoehe,
            isXAxis ? brettDicke : breite
        );
        
        // UV-Mapping für die Textur anpassen, falls es sich um Golden Oak Material handelt
        if (material.map === goldenOakTextur) {
            brettGeometrie.attributes.uv.array = setCustomUvMapping(brettGeometrie.attributes.uv.array, isXAxis);
        }
        
        const brett = new THREE.Mesh(brettGeometrie, material);
        brett.position.set(position_x, balkonHoehe + gelaenderHoehe/2, position_z);
        brett.castShadow = true;
        scene.add(brett);
        
        // Kleine Halterungen/Schrauben visualisieren
        const anzahlHaltebretter = Math.floor(gelaenderHoehe / haltebrettAbstand) + 1;
        const schraubenMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.8,
            roughness: 0.2
        });
        
        for (let i = 0; i < anzahlHaltebretter; i++) {
            const hoehe = balkonHoehe + (i * haltebrettAbstand) + haltebrettHoehe/2;
            
            // Kleine Schrauben/Bolzen
            const schraubeGeometrie = new THREE.CylinderGeometry(0.005, 0.005, brettDicke * 3, 8);
            const schraube = new THREE.Mesh(schraubeGeometrie, schraubenMaterial);
            
            // Position der Schraube anpassen (von außen durch das Brett in das Haltebrett)
            if (isXAxis) {
                schraube.rotation.x = Math.PI/2;
                schraube.position.set(position_x, hoehe, position_z - brettDicke);
            } else {
                schraube.rotation.z = Math.PI/2;
                schraube.position.set(position_x - brettDicke, hoehe, position_z);
            }
            
            scene.add(schraube);
            
            // Kleine Unterlegscheiben für mehr Detail
            const unterlegscheibeGeometrie = new THREE.CylinderGeometry(0.01, 0.01, 0.004, 16);
            const unterlegscheibe = new THREE.Mesh(unterlegscheibeGeometrie, schraubenMaterial);
            
            if (isXAxis) {
                unterlegscheibe.rotation.x = Math.PI/2;
                unterlegscheibe.position.set(position_x, hoehe, position_z - brettDicke/2);
            } else {
                unterlegscheibe.rotation.z = Math.PI/2;
                unterlegscheibe.position.set(position_x - brettDicke/2, hoehe, position_z);
            }
            
            scene.add(unterlegscheibe);
        }
    }
    
    // Funktion zum Anpassen des UV-Mappings für vertikale Bretter
    function setCustomUvMapping(uvArray, isXAxis) {
        // UV-Koordinaten für Holzmaserung in der richtigen Richtung
        const length = uvArray.length;
        for (let i = 0; i < length; i += 2) {
            // Für vertikale Ausrichtung der Textur
            if (isXAxis) {
                // Für Bretter entlang der X-Achse
                uvArray[i] = uvArray[i] * 1; // U-Koordinate (horizontale Wiederholung)
                uvArray[i + 1] = uvArray[i + 1] * 3; // V-Koordinate (vertikale Wiederholung)
            } else {
                // Für Bretter entlang der Z-Achse
                uvArray[i] = uvArray[i] * 3; // U-Koordinate (horizontale Wiederholung)
                uvArray[i + 1] = uvArray[i + 1] * 1; // V-Koordinate (vertikale Wiederholung)
            }
        }
        return uvArray;
    }
    
    // Geländerpfosten erstellen
    function erstellePfosten(x, z) {
        const pfostenGeometrie = new THREE.CylinderGeometry(0.05, 0.05, gelaenderHoehe, 16);
        const pfostenMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x707070,
            metalness: 0.5,
            roughness: 0.2
        });
        
        const pfosten = new THREE.Mesh(pfostenGeometrie, pfostenMaterial);
        pfosten.position.set(x, balkonHoehe + gelaenderHoehe/2, z);
        pfosten.castShadow = true;
        scene.add(pfosten);
    }
    
    // Stütze erstellen
    function erstelleStuetze(x, z) {
        const stuetzeGeometrie = new THREE.CylinderGeometry(0.1, 0.1, balkonHoehe, 16);
        const stuetzeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x505050,
            metalness: 0.7,
            roughness: 0.2
        });
        
        const stuetze = new THREE.Mesh(stuetzeGeometrie, stuetzeMaterial);
        stuetze.position.set(x, balkonHoehe/2, z);
        stuetze.castShadow = true;
        scene.add(stuetze);
    }
    
    // Umgebung erstellen
    erstelleUmgebung();
    
    // Balkon erstellen
    erstelleBalkon();
    
    // Animation/Render-Schleife
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    
    // Fenster-Größenänderung
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}); 