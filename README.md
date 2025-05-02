# 3D Balkon Ansicht

Eine einfache 3D-Visualisierung eines Balkons basierend auf Grundrissdaten.

## Anleitung

1. Öffne die Datei `index.html` in einem modernen Webbrowser (Chrome, Firefox, Edge)
2. Die 3D-Ansicht wird automatisch geladen und angezeigt
3. Zum Navigieren in der 3D-Ansicht:
   - **Linke Maustaste**: Drehen der Ansicht
   - **Rechte Maustaste**: Verschieben der Ansicht
   - **Mausrad**: Zoom

## Anpassung des Modells

Um die Dimensionen des Balkons anzupassen, können die Werte am Anfang der Datei `balkon.js` geändert werden:

```javascript
const balkonBreite = 3.5;    // Breite des Balkons
const balkonTiefe = 1.5;     // Tiefe des Balkons
const balkonHoehe = 3.0;     // Höhe über dem Boden
const gelaenderHoehe = 1.0;  // Höhe des Geländers
const bodenDicke = 0.2;      // Dicke des Balkonbodens
```

## Technische Details

Diese Visualisierung verwendet:
- Three.js für 3D-Rendering
- OrbitControls für die Kamerasteuerung

## Hinweis

Dies ist eine vereinfachte Darstellung basierend auf grundlegenden Dimensionen. Für eine detailliertere und maßstabsgetreue Ansicht empfiehlt sich die Verwendung eines professionellen CAD-Programms wie FreeCAD oder Blender mit den original DWG-Dateien. 