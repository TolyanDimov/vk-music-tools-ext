![Preview](assets/preview-2026-08-08.png)
# SmartScroll & VK Musik

[English](README.md) · [Русский](README_RU.md) · [Deutsch](README_DE.md)

Die Erweiterung kombiniert SmartScroll und Tools für VK Musik-Playlists.
Erstellt aus älteren [Snippets](https://github.com/TolyanDimov/Snippets), die über F12 in [DevTools](https://developer.chrome.com/docs/devtools/console/javascript?hl=en) genutzt wurden.

## Funktionen

- **SmartScroll:** schneller oder sanfter Auto-Scroll hoch/runter, Container-Auswahl, schwebendes Bedienfeld und ein kurzer Nachladeimpuls am Listenende.
- **VK Musik:** Massen-Hinzufügen/Entfernen im Playlist-Bearbeitungsmodus, Paketgröße von 1–100, zufällige Trackauswahl sowie geladene Tracks und sichere Duplikate aus der Musik löschen.
- **VK-Fotoalben:** alle Fotos mit der nativen VK-Schaltfläche auswählen, um sie anschließend über das Menü **Mehr** zu verschieben.
- **Export:** Trackliste des ausgewählten Containers als TXT (`Künstler - Titel`), doppelte Zeilen werden entfernt.

## Lokalisierungsunterstützung

Die Erweiterung unterstützt drei Sprachen: Russisch, Englisch und Deutsch.

## Installation (Entwicklermodus)

1. Öffne `chrome://extensions/` in der Adressleiste.
2. Entwicklermodus aktivieren.
3. **Entpackte Erweiterung laden** und den Ordner `vk-music-tools-ext` wählen.

## Nutzung

### SmartScroll

1. **Panel öffnen** im Popup.
2. Das Panel bietet **Hoch**, **Runter**, **Container**, **Stopp**, **Schließen** und **TXT exportieren**.
3. Mit **Sanftes Scrollen** zwischen sanftem Scrollen mit Pausen und dem schnellen Modus wechseln.

### VK Musik

1. VK Musik öffnen und Playlist-Bearbeitung starten.
2. **Zuerst bis zum Ende scrollen** (SmartScroll verwenden).
3. **Hinzufügen** anklicken und die Anzahl der Tracks eingeben. Leer lassen, um alle gefundenen Tracks hinzuzufügen.
4. Vor dem Start **Zufällige Reihenfolge** aktivieren, um Tracks zufällig auszuwählen.
5. Bei **Pro Paket** eine Größe von 1 bis 100 eingeben. Ohne Zufallsmodus beginnt das Hinzufügen am Ende der verfügbaren Liste.
6. Mit **Entfernen** Häkchen entfernen und mit **Stopp** den Vorgang abbrechen.
7. Fortschritt wird in der Statuszeile des Panels angezeigt.

Um Titel aus einer TXT-Datei hinzuzufügen, im Panel **Aus Datei** oder im Popup **Aus TXT hinzufügen** verwenden. Die Titel werden nach `Künstler - Titel` erkannt und in umgekehrter Dateireihenfolge ausgewählt. Mehrere Künstler sowie ältere Dateien mit nur einem Künstler werden unterstützt.

### Fotos zwischen VK-Alben verschieben

1. Das gewünschte VK-Album öffnen und den Auswahlmodus aktivieren.
2. Im Erweiterungs-Popup **Alle Fotos auswählen** anklicken.
3. In VK **Mehr** öffnen und das Verschieben in ein anderes Album auswählen.

Die Erweiterung drückt die native VK-Schaltfläche **Alle auswählen**. Die Verfügbarkeit des Verschiebens hängt von den Kontoberechtigungen und der aktuellen VK-Oberfläche ab.

### Export

1. Playlist oder VK Musik öffnen.
2. **Zuerst bis zum Ende scrollen** (SmartScroll verwenden).
3. **TXT exportieren** im Popup oder im schwebenden Panel.

Beim Export aus dem schwebenden Panel zuerst mit **Container** die gewünschte Liste auswählen. Nur dieser Container wird exportiert; doppelte `Künstler - Titel`-Zeilen werden entfernt.

### Musik Löschen

1. VK Musik mit einer Trackliste öffnen.
2. **Zuerst bis zum Ende scrollen** (SmartScroll verwenden).
3. **Musik löschen** im Popup drücken, die Anzahl eingeben und beide ausführlichen Warnungen bestätigen.
4. Leer lassen, um alle gefundenen Tracks zu löschen.
5. Der Löschfortschritt wird im SmartScroll-Panel angezeigt.

### Duplikate Löschen

1. VK Musik mit einer Trackliste öffnen.
2. **Zuerst bis zum Ende scrollen** (SmartScroll verwenden).
3. **Duplikate löschen** im Popup drücken und beide ausführlichen Warnungen bestätigen.
4. Ein sicheres Duplikat hat denselben Titel und dieselbe Dauer.

## Hinweise

- Playlist-Hinzufügen/Entfernen funktioniert nur in der Playlist-Bearbeitung.
- Die VK-Werkzeuge unterstützen `vk.com` und `vk.ru`.
- Löschen arbeitet mit den auf der Seite geladenen Tracks und nutzt in der aktuellen VK-Oberfläche die native Löschen-Schaltfläche.
- Das Löschen erfordert zwei Bestätigungen und kann nicht automatisch rückgängig gemacht werden.
- Wenn VK am Listenende die Lazy-Loading-Aktivierung verzögert, bewegt SmartScroll sich kurz um einige Tracks nach oben und wieder nach unten.
- Tab während der Ausführung nicht schließen.
- Große Playlists können den Browser verlangsamen.

## Lizenzen

- Rubik-Schrift: `assets/fonts/OFL.txt`.

## Autor

Anatoly Dimov — https://github.com/TolyanDimov


