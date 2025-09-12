# Luna Caviar Website

Eine luxuriöse, minimalistische Website für Luna Caviar - den exklusiven mobilen Caviar-Service für Premium-Events.

## Features

- **Modernes, luxuriöses Design** mit viel Weißfläche und goldenen Akzenten
- **Responsive Design** für alle Geräte (Desktop, Tablet, Mobile)
- **Lenis Smooth Scrolling** für premium Scroll-Erfahrung
- **Interaktiver Buchungskalender** mit Formularvalidierung
- **Parallax-Animationen** für eine elegante Benutzererfahrung
- **Service-Pakete** basierend auf dem Businessplan
- **Kontaktformular** mit Modal-Dialog

## Struktur

```
Luna-Caviar/
├── index.html              # Haupt-HTML-Datei
├── styles.css              # CSS-Styles mit luxuriösem Design
├── script.js               # JavaScript für Interaktivität
├── Luna-Caviar-Logo-Schwarz.png  # Schwarzes Logo
├── Luna-Caviar-Logo-Weiss.png    # Weißes Logo
└── README.md               # Diese Datei
```

## Design-Prinzipien

### Farbschema
- **Primäres Gold**: `#D4AF37` - Für Akzente und CTAs
- **Sekundäres Gold**: `#F4E4BC` - Für subtile Highlights
- **Reines Weiß**: `#FFFFFF` - Haupthintergrund
- **Dunkles Grau**: `#333333` - Text und Navigation

### Typografie
- **Überschriften**: Playfair Display (elegant, serif)
- **Fließtext**: Inter (modern, sans-serif)

### Layout
- Minimalistische Gestaltung mit viel Weißfläche
- Goldene Akzente für Premium-Gefühl
- Responsive Grid-System
- Elegante Animationen beim Scrollen

## Funktionalitäten

### Scroll-Erfahrung
- **Lenis Smooth Scrolling** für premium Gefühl
- **Parallax-Effekte** im Hero-Bereich
- **Performance-optimiert** mit GPU-Beschleunigung
- **Touch-freundlich** auf mobilen Geräten

### Buchungsystem
- **Kalender-Integration** mit Mindestdatum (heute)
- **Service-Paket-Auswahl** basierend auf Businessplan:
  - Caviar Stroll (2h, ab 3.000€)
  - Caviar Indulgence (4h, ab 5.000€)
  - Custom Event (individuell)
- **Formularvalidierung** für alle Eingabefelder
- **E-Mail und Telefon-Validierung**
- **Gästeanzahl-Mindestanforderung** (10 Gäste)

### Navigation
- **Lenis Smooth Scrolling** zu Sektionen
- **Mobile Hamburger-Menü**
- **Fixed Navigation** mit Scroll-Effekt
- **CTA-Buttons** für direkte Buchung

### Responsive Design
- **Desktop**: Vollständiges Layout mit Sidebar-Elementen
- **Tablet**: Angepasstes Grid-Layout
- **Mobile**: Stack-Layout mit Touch-freundlichen Elementen

## Verwendung

1. **Dateien öffnen**: Öffnen Sie die `index.html` in einem modernen Webbrowser
2. **Logos**: Die Luna Caviar Logos werden automatisch geladen
3. **Buchung**: Klicken Sie auf "Jetzt Buchen" um das Buchungsformular zu öffnen
4. **Navigation**: Nutzen Sie die Navigation oder scrollen Sie durch die Sektionen

## Browser-Kompatibilität

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## Anpassungen

### Logo austauschen
Ersetzen Sie die Dateien `Luna-Caviar-Logo-Schwarz.png` und `Luna-Caviar-Logo-Weiss.png` mit Ihren eigenen Logos.

### Farben anpassen
Ändern Sie die CSS-Variablen in `styles.css`:
```css
:root {
    --primary-gold: #D4AF37;
    --secondary-gold: #F4E4BC;
    /* ... weitere Farben */
}
```

### Inhalte bearbeiten
Passen Sie den Text in `index.html` an Ihre Bedürfnisse an.

### Buchungsformular
Das Formular ist vorbereitet für die Integration mit einem Backend-Service. Passen Sie die `submitBookingForm()` Funktion in `script.js` an.

## Service-Pakete

Basierend auf dem Luna Caviar Businessplan:

1. **Caviar Stroll** (2 Stunden)
   - 2 elegante Hosts
   - 500g Premium Caviar
   - Pur oder auf Mini-Bellinis
   - Ab 3.000€

2. **Caviar Indulgence** (4 Stunden)
   - 2 elegante Hosts
   - 1000g Premium Caviar (wahlweise 2 Sorten)
   - Pur oder auf Mini-Bellinis
   - Ab 5.000€

3. **Custom Event** (Individuell)
   - 2+ elegante Hosts
   - Variable Caviar-Menge
   - Optional Video & Social Media Service
   - Auf Anfrage

## Kontakt

Für Fragen zur Website oder Buchungen:
- E-Mail: info@lunacaviar.de
- Telefon: +49 (0) 123 456 789

## Lizenz

© 2024 Luna Caviar. Alle Rechte vorbehalten.
