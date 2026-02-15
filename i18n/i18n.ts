import * as RNLocalization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const Localization = RNLocalization;

// Translation resources
const resources = {
  en: {
    translation: {
      // Menu Screen
      appTitle: "iPhone Screen Tester",
      appSubtitle: "Detect dead pixels, burn-in, and screen issues",
      howToUse: "How to use:",
      instructions:
        "• Choose a test mode from above\n• View in a dark room for best results\n• Look for stuck pixels, color inconsistencies\n• Tap anywhere during test to return to menu",

      // Test Names
      solidColors: "Solid Colors",
      gradientTest: "Gradient Test",
      deadPixelDetection: "Dead Pixel Detection",
      burninTest: "Burn-in Test",
      gridPattern: "Grid Pattern",
      touchDrawTest: "Touch & Draw Test",
      isScreenOriginal: "Is Screen Original?",

      // Common
      tapToExit: "Tap to exit",
      backToMenu: "← Back to Menu",

      // Gradient Test
      gradientInstruction: "Look for banding or uneven transitions",

      // Pixel Test
      deadPixelTitle: "Dead Pixel Detection",
      deadPixelInstruction: "Look for black or white dots that don't change",

      // Burn-in Test
      burninTitle: "Burn-in Test",
      burninInstruction:
        "Look for ghost images or persistent shadows\nfrom status bar, navigation, or static elements",

      // Grid Test
      gridTitle: "Grid Pattern Test",
      gridInstruction: "Check for alignment and screen uniformity",

      // Touch Test
      touchTitle: "Touch & Draw Test",
      touchSubtitle: "Draw patterns on the screen to test touch responsiveness",
      touchTip1: "• Draw straight lines to check tracking accuracy",
      touchTip2: "• Draw circles to test smooth response",
      touchTip3: "• Test all corners and edges",
      touchTip4: "• Try fast and slow movements",
      clearCanvas: "Clear Canvas",
      exit: "Exit",

      // Screen Info
      infoTitle: "Is My Screen Original?",
      infoSubtitle:
        "Unfortunately, this app cannot detect if your screen is an original Apple part. Here's how to check manually:",

      method1Title: "📱 Method 1: Check iOS Settings",
      method1Step1: "1. Open {{settings}} app",
      method1Step2: "2. Go to {{general}} → {{about}}",
      method1Step3: "3. Look for {{importantDisplay}}",
      settings: "Settings",
      general: "General",
      about: "About",
      importantDisplay: "Important Display Message",
      method1Warning:
        "⚠️ If you see a warning message, your screen may not be a genuine Apple part",
      openSettings: "Open Settings",

      method2Title: "🔍 Method 2: Visual Inspection",
      signsOfNonOriginal: "Signs of Non-Original Screen:",
      sign1: "• Poor color accuracy or washed-out colors",
      sign2: "• Lower brightness compared to original",
      sign3: "• Touch response issues or dead zones",
      sign4: "• True Tone not working or missing",
      sign5: "• Night Shift behaves differently",
      sign6: "• Visible light bleeding around edges",
      sign7: "• Screen doesn't fit perfectly in frame",
      sign8: "• Different glass texture or reflection",

      method3Title: "✅ Method 3: True Tone Test",
      method3Step1: "1. Go to {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Check if {{trueTone}} option exists",
      method3Step3: "3. Toggle it on/off to see color changes",
      displayBrightness: "Display & Brightness",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Original screens always have True Tone (iPhone 8 and newer). Third-party screens often lack this feature.",

      method4Title: "🏪 Method 4: Apple Diagnostics",
      mostReliableMethod: "Most Reliable Method:",
      method4Item1: "• Visit an Apple Store or Authorized Service Provider",
      method4Item2: "• They have official diagnostic tools",
      method4Item3: "• Can verify all components including screen",
      method4Item4: "• Check your device's repair history",

      whyCantDetectTitle: "❓ Why Can't This App Detect It?",
      whyCantDetect:
        "iOS doesn't allow apps to access hardware-level information like:",
      whyCantItem1: "• Screen serial numbers",
      whyCantItem2: "• Component manufacturer IDs",
      whyCantItem3: "• Hardware authentication data",
      whyCantItem4: "• True Tone sensor details",
      privacyNote:
        "This is for your privacy and security. Only iOS system-level checks can verify genuine parts.",

      whatAppCanDoTitle: "🔧 What This App CAN Do",
      whatAppCanDo:
        "This app helps identify {{qualityIssues}} that might indicate a non-original or defective screen:",
      qualityIssues: "quality issues",
      canDo1: "✓ Dead or stuck pixels",
      canDo2: "✓ Touch responsiveness problems",
      canDo3: "✓ Color accuracy issues",
      canDo4: "✓ Burn-in or image retention",
      canDo5: "✓ Screen uniformity problems",
      canDo6: "✓ Touch tracking accuracy",

      disclaimerTitle: "⚖️ Important Note",
      disclaimerText:
        "Even if a screen passes all tests in this app, it doesn't guarantee it's an original Apple screen. Similarly, quality third-party screens can perform well in these tests. For definitive verification, consult Apple directly.",
    },
  },
  es: {
    translation: {
      appTitle: "Probador de Pantalla iPhone",
      appSubtitle:
        "Detecta píxeles muertos, quemaduras y problemas de pantalla",
      howToUse: "Cómo usar:",
      instructions:
        "• Elige un modo de prueba arriba\n• Visualiza en una habitación oscura para mejores resultados\n• Busca píxeles atascados, inconsistencias de color\n• Toca en cualquier lugar durante la prueba para volver al menú",

      solidColors: "Colores Sólidos",
      gradientTest: "Prueba de Degradado",
      deadPixelDetection: "Detección de Píxeles Muertos",
      burninTest: "Prueba de Quemadura",
      gridPattern: "Patrón de Cuadrícula",
      touchDrawTest: "Prueba de Tacto y Dibujo",
      isScreenOriginal: "¿Es la Pantalla Original?",

      tapToExit: "Toca para salir",
      backToMenu: "← Volver al Menú",

      gradientInstruction: "Busca bandas o transiciones irregulares",

      deadPixelTitle: "Detección de Píxeles Muertos",
      deadPixelInstruction: "Busca puntos negros o blancos que no cambian",

      burninTitle: "Prueba de Quemadura",
      burninInstruction:
        "Busca imágenes fantasma o sombras persistentes\nde la barra de estado, navegación o elementos estáticos",

      gridTitle: "Prueba de Patrón de Cuadrícula",
      gridInstruction: "Verifica la alineación y uniformidad de la pantalla",

      touchTitle: "Prueba de Tacto y Dibujo",
      touchSubtitle:
        "Dibuja patrones en la pantalla para probar la capacidad de respuesta táctil",
      touchTip1:
        "• Dibuja líneas rectas para verificar la precisión del seguimiento",
      touchTip2: "• Dibuja círculos para probar la respuesta suave",
      touchTip3: "• Prueba todas las esquinas y bordes",
      touchTip4: "• Prueba movimientos rápidos y lentos",
      clearCanvas: "Limpiar Lienzo",
      exit: "Salir",

      infoTitle: "¿Es Mi Pantalla Original?",
      infoSubtitle:
        "Desafortunadamente, esta aplicación no puede detectar si tu pantalla es una pieza original de Apple. Aquí te mostramos cómo verificar manualmente:",

      method1Title: "📱 Método 1: Verificar Ajustes de iOS",
      method1Step1: "1. Abre la aplicación {{settings}}",
      method1Step2: "2. Ve a {{general}} → {{about}}",
      method1Step3: "3. Busca {{importantDisplay}}",
      settings: "Ajustes",
      general: "General",
      about: "Información",
      importantDisplay: "Mensaje Importante de Pantalla",
      method1Warning:
        "⚠️ Si ves un mensaje de advertencia, tu pantalla puede no ser una pieza genuina de Apple",
      openSettings: "Abrir Ajustes",

      method2Title: "🔍 Método 2: Inspección Visual",
      signsOfNonOriginal: "Señales de Pantalla No Original:",
      sign1: "• Precisión de color pobre o colores deslavados",
      sign2: "• Brillo más bajo comparado con el original",
      sign3: "• Problemas de respuesta táctil o zonas muertas",
      sign4: "• True Tone no funciona o falta",
      sign5: "• Night Shift se comporta diferente",
      sign6: "• Sangrado de luz visible alrededor de los bordes",
      sign7: "• La pantalla no encaja perfectamente en el marco",
      sign8: "• Textura de vidrio o reflejo diferente",

      method3Title: "✅ Método 3: Prueba de True Tone",
      method3Step1: "1. Ve a {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Verifica si existe la opción {{trueTone}}",
      method3Step3: "3. Actívalo/desactívalo para ver cambios de color",
      displayBrightness: "Pantalla y Brillo",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Las pantallas originales siempre tienen True Tone (iPhone 8 y más nuevos). Las pantallas de terceros a menudo carecen de esta función.",

      method4Title: "🏪 Método 4: Diagnóstico de Apple",
      mostReliableMethod: "Método Más Confiable:",
      method4Item1:
        "• Visita una Apple Store o Proveedor de Servicio Autorizado",
      method4Item2: "• Tienen herramientas de diagnóstico oficiales",
      method4Item3:
        "• Pueden verificar todos los componentes incluida la pantalla",
      method4Item4: "• Verificar el historial de reparación de tu dispositivo",

      whyCantDetectTitle: "❓ ¿Por Qué Esta App No Puede Detectarlo?",
      whyCantDetect:
        "iOS no permite que las aplicaciones accedan a información a nivel de hardware como:",
      whyCantItem1: "• Números de serie de la pantalla",
      whyCantItem2: "• IDs del fabricante de componentes",
      whyCantItem3: "• Datos de autenticación de hardware",
      whyCantItem4: "• Detalles del sensor True Tone",
      privacyNote:
        "Esto es por tu privacidad y seguridad. Solo las verificaciones a nivel del sistema iOS pueden verificar piezas genuinas.",

      whatAppCanDoTitle: "🔧 Lo Que Esta App SÍ Puede Hacer",
      whatAppCanDo:
        "Esta aplicación ayuda a identificar {{qualityIssues}} que pueden indicar una pantalla no original o defectuosa:",
      qualityIssues: "problemas de calidad",
      canDo1: "✓ Píxeles muertos o atascados",
      canDo2: "✓ Problemas de capacidad de respuesta táctil",
      canDo3: "✓ Problemas de precisión de color",
      canDo4: "✓ Quemadura o retención de imagen",
      canDo5: "✓ Problemas de uniformidad de pantalla",
      canDo6: "✓ Precisión de seguimiento táctil",

      disclaimerTitle: "⚖️ Nota Importante",
      disclaimerText:
        "Incluso si una pantalla pasa todas las pruebas en esta aplicación, no garantiza que sea una pantalla original de Apple. De manera similar, las pantallas de terceros de calidad pueden funcionar bien en estas pruebas. Para verificación definitiva, consulta a Apple directamente.",
    },
  },
  it: {
    translation: {
      appTitle: "Tester Schermo iPhone",
      appSubtitle: "Rileva pixel morti, burn-in e problemi dello schermo",
      howToUse: "Come usare:",
      instructions:
        "• Scegli una modalità di test dall'alto\n• Visualizza in una stanza buia per risultati migliori\n• Cerca pixel bloccati, incongruenze di colore\n• Tocca ovunque durante il test per tornare al menu",

      solidColors: "Colori Solidi",
      gradientTest: "Test Gradiente",
      deadPixelDetection: "Rilevamento Pixel Morti",
      burninTest: "Test Burn-in",
      gridPattern: "Modello a Griglia",
      touchDrawTest: "Test Tocco e Disegno",
      isScreenOriginal: "Lo Schermo è Originale?",

      tapToExit: "Tocca per uscire",
      backToMenu: "← Torna al Menu",

      gradientInstruction: "Cerca banding o transizioni irregolari",

      deadPixelTitle: "Rilevamento Pixel Morti",
      deadPixelInstruction: "Cerca punti neri o bianchi che non cambiano",

      burninTitle: "Test Burn-in",
      burninInstruction:
        "Cerca immagini fantasma o ombre persistenti\ndalla barra di stato, navigazione o elementi statici",

      gridTitle: "Test Modello a Griglia",
      gridInstruction: "Verifica l'allineamento e l'uniformità dello schermo",

      touchTitle: "Test Tocco e Disegno",
      touchSubtitle:
        "Disegna modelli sullo schermo per testare la reattività del tocco",
      touchTip1:
        "• Disegna linee rette per verificare la precisione del tracciamento",
      touchTip2: "• Disegna cerchi per testare la risposta fluida",
      touchTip3: "• Testa tutti gli angoli e i bordi",
      touchTip4: "• Prova movimenti veloci e lenti",
      clearCanvas: "Cancella Tela",
      exit: "Esci",

      infoTitle: "Il Mio Schermo è Originale?",
      infoSubtitle:
        "Sfortunatamente, questa app non può rilevare se il tuo schermo è un componente originale Apple. Ecco come verificare manualmente:",

      method1Title: "📱 Metodo 1: Controlla Impostazioni iOS",
      method1Step1: "1. Apri l'app {{settings}}",
      method1Step2: "2. Vai a {{general}} → {{about}}",
      method1Step3: "3. Cerca {{importantDisplay}}",
      settings: "Impostazioni",
      general: "Generali",
      about: "Info",
      importantDisplay: "Messaggio Importante Display",
      method1Warning:
        "⚠️ Se vedi un messaggio di avviso, il tuo schermo potrebbe non essere un componente originale Apple",
      openSettings: "Apri Impostazioni",

      method2Title: "🔍 Metodo 2: Ispezione Visiva",
      signsOfNonOriginal: "Segni di Schermo Non Originale:",
      sign1: "• Scarsa precisione del colore o colori sbiaditi",
      sign2: "• Luminosità inferiore rispetto all'originale",
      sign3: "• Problemi di risposta al tocco o zone morte",
      sign4: "• True Tone non funziona o mancante",
      sign5: "• Night Shift si comporta diversamente",
      sign6: "• Sanguinamento della luce visibile intorno ai bordi",
      sign7: "• Lo schermo non si adatta perfettamente alla cornice",
      sign8: "• Texture del vetro o riflesso diverso",

      method3Title: "✅ Metodo 3: Test True Tone",
      method3Step1: "1. Vai a {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Verifica se esiste l'opzione {{trueTone}}",
      method3Step3: "3. Attiva/disattiva per vedere i cambiamenti di colore",
      displayBrightness: "Schermo e Luminosità",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Gli schermi originali hanno sempre True Tone (iPhone 8 e successivi). Gli schermi di terze parti spesso non hanno questa funzione.",

      method4Title: "🏪 Metodo 4: Diagnostica Apple",
      mostReliableMethod: "Metodo Più Affidabile:",
      method4Item1:
        "• Visita un Apple Store o Fornitore di Servizi Autorizzato",
      method4Item2: "• Hanno strumenti diagnostici ufficiali",
      method4Item3:
        "• Possono verificare tutti i componenti incluso lo schermo",
      method4Item4:
        "• Controlla la cronologia delle riparazioni del tuo dispositivo",

      whyCantDetectTitle: "❓ Perché Questa App Non Può Rilevarlo?",
      whyCantDetect:
        "iOS non consente alle app di accedere a informazioni a livello hardware come:",
      whyCantItem1: "• Numeri di serie dello schermo",
      whyCantItem2: "• ID del produttore dei componenti",
      whyCantItem3: "• Dati di autenticazione hardware",
      whyCantItem4: "• Dettagli del sensore True Tone",
      privacyNote:
        "Questo è per la tua privacy e sicurezza. Solo i controlli a livello di sistema iOS possono verificare i componenti originali.",

      whatAppCanDoTitle: "🔧 Cosa Può Fare Questa App",
      whatAppCanDo:
        "Questa app aiuta a identificare {{qualityIssues}} che potrebbero indicare uno schermo non originale o difettoso:",
      qualityIssues: "problemi di qualità",
      canDo1: "✓ Pixel morti o bloccati",
      canDo2: "✓ Problemi di reattività al tocco",
      canDo3: "✓ Problemi di precisione del colore",
      canDo4: "✓ Burn-in o ritenzione dell'immagine",
      canDo5: "✓ Problemi di uniformità dello schermo",
      canDo6: "✓ Precisione del tracciamento tattile",

      disclaimerTitle: "⚖️ Nota Importante",
      disclaimerText:
        "Anche se uno schermo supera tutti i test in questa app, non garantisce che sia uno schermo originale Apple. Allo stesso modo, schermi di terze parti di qualità possono funzionare bene in questi test. Per una verifica definitiva, consulta Apple direttamente.",
    },
  },
  de: {
    translation: {
      appTitle: "iPhone Bildschirmtester",
      appSubtitle: "Erkennt tote Pixel, Einbrennen und Bildschirmprobleme",
      howToUse: "So verwenden:",
      instructions:
        "• Wählen Sie oben einen Testmodus\n• In dunklem Raum für beste Ergebnisse ansehen\n• Suchen Sie nach festsitzenden Pixeln, Farbinkonsistenzen\n• Tippen Sie während des Tests irgendwo, um zum Menü zurückzukehren",

      solidColors: "Volltonfarben",
      gradientTest: "Verlaufstest",
      deadPixelDetection: "Tote Pixel Erkennung",
      burninTest: "Einbrenn-Test",
      gridPattern: "Gittermuster",
      touchDrawTest: "Touch & Zeichen-Test",
      isScreenOriginal: "Ist der Bildschirm Original?",

      tapToExit: "Zum Beenden tippen",
      backToMenu: "← Zurück zum Menü",

      gradientInstruction:
        "Suchen Sie nach Banding oder ungleichmäßigen Übergängen",

      deadPixelTitle: "Tote Pixel Erkennung",
      deadPixelInstruction:
        "Suchen Sie nach schwarzen oder weißen Punkten, die sich nicht ändern",

      burninTitle: "Einbrenn-Test",
      burninInstruction:
        "Suchen Sie nach Geisterbildern oder anhaltenden Schatten\nvon der Statusleiste, Navigation oder statischen Elementen",

      gridTitle: "Gittermuster-Test",
      gridInstruction:
        "Überprüfen Sie Ausrichtung und Gleichmäßigkeit des Bildschirms",

      touchTitle: "Touch & Zeichen-Test",
      touchSubtitle:
        "Zeichnen Sie Muster auf dem Bildschirm, um die Touch-Reaktionsfähigkeit zu testen",
      touchTip1:
        "• Zeichnen Sie gerade Linien zur Überprüfung der Tracking-Genauigkeit",
      touchTip2: "• Zeichnen Sie Kreise zum Testen der flüssigen Reaktion",
      touchTip3: "• Testen Sie alle Ecken und Kanten",
      touchTip4: "• Versuchen Sie schnelle und langsame Bewegungen",
      clearCanvas: "Leinwand Löschen",
      exit: "Beenden",

      infoTitle: "Ist Mein Bildschirm Original?",
      infoSubtitle:
        "Leider kann diese App nicht erkennen, ob Ihr Bildschirm ein Original-Apple-Teil ist. So überprüfen Sie manuell:",

      method1Title: "📱 Methode 1: iOS-Einstellungen Prüfen",
      method1Step1: "1. Öffnen Sie die {{settings}}-App",
      method1Step2: "2. Gehen Sie zu {{general}} → {{about}}",
      method1Step3: "3. Suchen Sie nach {{importantDisplay}}",
      settings: "Einstellungen",
      general: "Allgemein",
      about: "Info",
      importantDisplay: "Wichtige Display-Nachricht",
      method1Warning:
        "⚠️ Wenn Sie eine Warnmeldung sehen, ist Ihr Bildschirm möglicherweise kein echtes Apple-Teil",
      openSettings: "Einstellungen Öffnen",

      method2Title: "🔍 Methode 2: Sichtprüfung",
      signsOfNonOriginal: "Anzeichen für Nicht-Original-Bildschirm:",
      sign1: "• Schlechte Farbgenauigkeit oder ausgewaschene Farben",
      sign2: "• Geringere Helligkeit im Vergleich zum Original",
      sign3: "• Touch-Reaktionsprobleme oder tote Zonen",
      sign4: "• True Tone funktioniert nicht oder fehlt",
      sign5: "• Night Shift verhält sich anders",
      sign6: "• Sichtbare Lichtverluste an den Rändern",
      sign7: "• Bildschirm passt nicht perfekt in den Rahmen",
      sign8: "• Unterschiedliche Glastextur oder Reflexion",

      method3Title: "✅ Methode 3: True Tone Test",
      method3Step1: "1. Gehen Sie zu {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Prüfen Sie, ob die {{trueTone}}-Option existiert",
      method3Step3: "3. Schalten Sie sie ein/aus, um Farbänderungen zu sehen",
      displayBrightness: "Anzeige & Helligkeit",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Original-Bildschirme haben immer True Tone (iPhone 8 und neuer). Drittanbieter-Bildschirme fehlt diese Funktion oft.",

      method4Title: "🏪 Methode 4: Apple-Diagnose",
      mostReliableMethod: "Zuverlässigste Methode:",
      method4Item1:
        "• Besuchen Sie einen Apple Store oder autorisierten Service-Provider",
      method4Item2: "• Sie haben offizielle Diagnose-Tools",
      method4Item3:
        "• Können alle Komponenten einschließlich Bildschirm überprüfen",
      method4Item4: "• Überprüfen Sie den Reparaturverlauf Ihres Geräts",

      whyCantDetectTitle: "❓ Warum Kann Diese App Es Nicht Erkennen?",
      whyCantDetect:
        "iOS erlaubt Apps nicht, auf Hardware-Level-Informationen zuzugreifen wie:",
      whyCantItem1: "• Bildschirm-Seriennummern",
      whyCantItem2: "• Komponenten-Hersteller-IDs",
      whyCantItem3: "• Hardware-Authentifizierungsdaten",
      whyCantItem4: "• True Tone Sensor-Details",
      privacyNote:
        "Dies dient Ihrer Privatsphäre und Sicherheit. Nur iOS-Systemprüfungen können echte Teile verifizieren.",

      whatAppCanDoTitle: "🔧 Was Diese App KANN",
      whatAppCanDo:
        "Diese App hilft, {{qualityIssues}} zu identifizieren, die auf einen nicht-originalen oder defekten Bildschirm hinweisen könnten:",
      qualityIssues: "Qualitätsprobleme",
      canDo1: "✓ Tote oder festsitzende Pixel",
      canDo2: "✓ Touch-Reaktionsprobleme",
      canDo3: "✓ Farbgenauigkeitsprobleme",
      canDo4: "✓ Einbrennen oder Bildretention",
      canDo5: "✓ Bildschirm-Gleichmäßigkeitsprobleme",
      canDo6: "✓ Touch-Tracking-Genauigkeit",

      disclaimerTitle: "⚖️ Wichtiger Hinweis",
      disclaimerText:
        "Selbst wenn ein Bildschirm alle Tests in dieser App besteht, garantiert dies nicht, dass es sich um einen Original-Apple-Bildschirm handelt. Ebenso können qualitativ hochwertige Drittanbieter-Bildschirme in diesen Tests gut abschneiden. Für eine definitive Überprüfung wenden Sie sich direkt an Apple.",
    },
  },
  fr: {
    translation: {
      appTitle: "Testeur d'Écran iPhone",
      appSubtitle:
        "Détecte les pixels morts, la rémanence et les problèmes d'écran",
      howToUse: "Comment utiliser:",
      instructions:
        "• Choisissez un mode de test ci-dessus\n• Visualisez dans une pièce sombre pour de meilleurs résultats\n• Recherchez les pixels bloqués, les incohérences de couleur\n• Appuyez n'importe où pendant le test pour revenir au menu",

      solidColors: "Couleurs Unies",
      gradientTest: "Test de Dégradé",
      deadPixelDetection: "Détection de Pixels Morts",
      burninTest: "Test de Rémanence",
      gridPattern: "Motif de Grille",
      touchDrawTest: "Test Tactile et Dessin",
      isScreenOriginal: "L'Écran est-il Original?",

      tapToExit: "Appuyez pour quitter",
      backToMenu: "← Retour au Menu",

      gradientInstruction:
        "Recherchez les bandes ou les transitions irrégulières",

      deadPixelTitle: "Détection de Pixels Morts",
      deadPixelInstruction:
        "Recherchez des points noirs ou blancs qui ne changent pas",

      burninTitle: "Test de Rémanence",
      burninInstruction:
        "Recherchez des images fantômes ou des ombres persistantes\nde la barre d'état, de la navigation ou des éléments statiques",

      gridTitle: "Test de Motif de Grille",
      gridInstruction: "Vérifiez l'alignement et l'uniformité de l'écran",

      touchTitle: "Test Tactile et Dessin",
      touchSubtitle:
        "Dessinez des motifs sur l'écran pour tester la réactivité tactile",
      touchTip1:
        "• Dessinez des lignes droites pour vérifier la précision du suivi",
      touchTip2: "• Dessinez des cercles pour tester la réponse fluide",
      touchTip3: "• Testez tous les coins et bords",
      touchTip4: "• Essayez des mouvements rapides et lents",
      clearCanvas: "Effacer le Canevas",
      exit: "Quitter",

      infoTitle: "Mon Écran est-il Original?",
      infoSubtitle:
        "Malheureusement, cette application ne peut pas détecter si votre écran est une pièce Apple d'origine. Voici comment vérifier manuellement:",

      method1Title: "📱 Méthode 1: Vérifier les Réglages iOS",
      method1Step1: "1. Ouvrez l'application {{settings}}",
      method1Step2: "2. Allez dans {{general}} → {{about}}",
      method1Step3: "3. Recherchez {{importantDisplay}}",
      settings: "Réglages",
      general: "Général",
      about: "Informations",
      importantDisplay: "Message Important d'Écran",
      method1Warning:
        "⚠️ Si vous voyez un message d'avertissement, votre écran peut ne pas être une pièce Apple authentique",
      openSettings: "Ouvrir Réglages",

      method2Title: "🔍 Méthode 2: Inspection Visuelle",
      signsOfNonOriginal: "Signes d'Écran Non Original:",
      sign1: "• Mauvaise précision des couleurs ou couleurs délavées",
      sign2: "• Luminosité inférieure par rapport à l'original",
      sign3: "• Problèmes de réponse tactile ou zones mortes",
      sign4: "• True Tone ne fonctionne pas ou manquant",
      sign5: "• Night Shift se comporte différemment",
      sign6: "• Fuite de lumière visible autour des bords",
      sign7: "• L'écran ne s'adapte pas parfaitement au cadre",
      sign8: "• Texture du verre ou réflexion différente",

      method3Title: "✅ Méthode 3: Test True Tone",
      method3Step1: "1. Allez dans {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Vérifiez si l'option {{trueTone}} existe",
      method3Step3:
        "3. Activez/désactivez pour voir les changements de couleur",
      displayBrightness: "Luminosité et Affichage",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Les écrans d'origine ont toujours True Tone (iPhone 8 et plus récents). Les écrans tiers manquent souvent de cette fonction.",

      method4Title: "🏪 Méthode 4: Diagnostics Apple",
      mostReliableMethod: "Méthode la Plus Fiable:",
      method4Item1:
        "• Visitez un Apple Store ou un Fournisseur de Services Agréé",
      method4Item2: "• Ils ont des outils de diagnostic officiels",
      method4Item3: "• Peuvent vérifier tous les composants y compris l'écran",
      method4Item4: "• Vérifier l'historique de réparation de votre appareil",

      whyCantDetectTitle: "❓ Pourquoi Cette App Ne Peut-elle Pas le Détecter?",
      whyCantDetect:
        "iOS n'autorise pas les applications à accéder aux informations au niveau matériel telles que:",
      whyCantItem1: "• Numéros de série de l'écran",
      whyCantItem2: "• IDs du fabricant de composants",
      whyCantItem3: "• Données d'authentification matérielle",
      whyCantItem4: "• Détails du capteur True Tone",
      privacyNote:
        "C'est pour votre confidentialité et sécurité. Seules les vérifications au niveau du système iOS peuvent vérifier les pièces authentiques.",

      whatAppCanDoTitle: "🔧 Ce Que Cette App PEUT Faire",
      whatAppCanDo:
        "Cette application aide à identifier les {{qualityIssues}} qui pourraient indiquer un écran non original ou défectueux:",
      qualityIssues: "problèmes de qualité",
      canDo1: "✓ Pixels morts ou bloqués",
      canDo2: "✓ Problèmes de réactivité tactile",
      canDo3: "✓ Problèmes de précision des couleurs",
      canDo4: "✓ Rémanence ou rétention d'image",
      canDo5: "✓ Problèmes d'uniformité de l'écran",
      canDo6: "✓ Précision du suivi tactile",

      disclaimerTitle: "⚖️ Note Importante",
      disclaimerText:
        "Même si un écran passe tous les tests de cette application, cela ne garantit pas qu'il s'agit d'un écran Apple d'origine. De même, des écrans tiers de qualité peuvent bien fonctionner dans ces tests. Pour une vérification définitive, consultez Apple directement.",
    },
  },
  zh: {
    translation: {
      appTitle: "iPhone 屏幕测试仪",
      appSubtitle: "检测死像素、烧屏和屏幕问题",
      howToUse: "使用方法：",
      instructions:
        "• 从上方选择测试模式\n• 在暗室中查看以获得最佳效果\n• 查找卡住的像素、颜色不一致\n• 在测试期间点击任意位置返回菜单",

      solidColors: "纯色",
      gradientTest: "渐变测试",
      deadPixelDetection: "死像素检测",
      burninTest: "烧屏测试",
      gridPattern: "网格图案",
      touchDrawTest: "触摸和绘制测试",
      isScreenOriginal: "屏幕是原装的吗？",

      tapToExit: "点击退出",
      backToMenu: "← 返回菜单",

      gradientInstruction: "查找条带或不均匀的过渡",

      deadPixelTitle: "死像素检测",
      deadPixelInstruction: "查找不变的黑点或白点",

      burninTitle: "烧屏测试",
      burninInstruction: "查找来自状态栏、导航或静态元素的\n重影或持续阴影",

      gridTitle: "网格图案测试",
      gridInstruction: "检查屏幕对齐和均匀性",

      touchTitle: "触摸和绘制测试",
      touchSubtitle: "在屏幕上绘制图案以测试触摸响应性",
      touchTip1: "• 绘制直线以检查跟踪精度",
      touchTip2: "• 绘制圆圈以测试平滑响应",
      touchTip3: "• 测试所有角落和边缘",
      touchTip4: "• 尝试快速和慢速移动",
      clearCanvas: "清除画布",
      exit: "退出",

      infoTitle: "我的屏幕是原装的吗？",
      infoSubtitle:
        "不幸的是，此应用程序无法检测您的屏幕是否为原装 Apple 零件。以下是手动检查的方法：",

      method1Title: "📱 方法 1：检查 iOS 设置",
      method1Step1: "1. 打开{{settings}}应用",
      method1Step2: "2. 前往{{general}} → {{about}}",
      method1Step3: "3. 查找{{importantDisplay}}",
      settings: "设置",
      general: "通用",
      about: "关于",
      importantDisplay: "重要显示信息",
      method1Warning: "⚠️ 如果您看到警告消息，您的屏幕可能不是正品 Apple 零件",
      openSettings: "打开设置",

      method2Title: "🔍 方法 2：目视检查",
      signsOfNonOriginal: "非原装屏幕的迹象：",
      sign1: "• 色彩准确度差或颜色褪色",
      sign2: "• 亮度低于原装",
      sign3: "• 触摸响应问题或死区",
      sign4: "• 原彩显示不工作或缺失",
      sign5: "• 夜览模式行为不同",
      sign6: "• 边缘周围可见光泄漏",
      sign7: "• 屏幕与框架不完美契合",
      sign8: "• 玻璃质感或反射不同",

      method3Title: "✅ 方法 3：原彩显示测试",
      method3Step1: "1. 前往{{settings}} → {{displayBrightness}}",
      method3Step2: "2. 检查是否存在{{trueTone}}选项",
      method3Step3: "3. 切换开/关以查看颜色变化",
      displayBrightness: "显示与亮度",
      trueTone: "原彩显示",
      trueToneTip:
        "💡 原装屏幕始终具有原彩显示（iPhone 8 及更新机型）。第三方屏幕通常缺少此功能。",

      method4Title: "🏪 方法 4：Apple 诊断",
      mostReliableMethod: "最可靠的方法：",
      method4Item1: "• 访问 Apple Store 或授权服务提供商",
      method4Item2: "• 他们拥有官方诊断工具",
      method4Item3: "• 可以验证包括屏幕在内的所有组件",
      method4Item4: "• 检查设备的维修历史",

      whyCantDetectTitle: "❓ 为什么此应用程序无法检测？",
      whyCantDetect: "iOS 不允许应用程序访问硬件级信息，例如：",
      whyCantItem1: "• 屏幕序列号",
      whyCantItem2: "• 组件制造商 ID",
      whyCantItem3: "• 硬件认证数据",
      whyCantItem4: "• 原彩显示传感器详细信息",
      privacyNote:
        "这是为了您的隐私和安全。只有 iOS 系统级检查才能验证正品零件。",

      whatAppCanDoTitle: "🔧 此应用程序能做什么",
      whatAppCanDo:
        "此应用程序有助于识别可能表明非原装或有缺陷屏幕的{{qualityIssues}}：",
      qualityIssues: "质量问题",
      canDo1: "✓ 死像素或卡住的像素",
      canDo2: "✓ 触摸响应问题",
      canDo3: "✓ 色彩准确度问题",
      canDo4: "✓ 烧屏或图像残留",
      canDo5: "✓ 屏幕均匀性问题",
      canDo6: "✓ 触摸跟踪精度",

      disclaimerTitle: "⚖️ 重要提示",
      disclaimerText:
        "即使屏幕通过了此应用程序中的所有测试，也不能保证它是原装 Apple 屏幕。同样，优质的第三方屏幕也可以在这些测试中表现良好。要进行最终验证，请直接咨询 Apple。",
    },
  },
  ru: {
    translation: {
      appTitle: "Тестер Экрана iPhone",
      appSubtitle:
        "Обнаруживает мертвые пиксели, выгорание и проблемы с экраном",
      howToUse: "Как использовать:",
      instructions:
        "• Выберите режим тестирования выше\n• Просматривайте в темной комнате для лучших результатов\n• Ищите застрявшие пиксели, несоответствия цветов\n• Нажмите в любом месте во время теста, чтобы вернуться в меню",

      solidColors: "Сплошные Цвета",
      gradientTest: "Тест Градиента",
      deadPixelDetection: "Обнаружение Мертвых Пикселей",
      burninTest: "Тест Выгорания",
      gridPattern: "Сетчатый Узор",
      touchDrawTest: "Тест Касания и Рисования",
      isScreenOriginal: "Экран Оригинальный?",

      tapToExit: "Нажмите для выхода",
      backToMenu: "← Назад в Меню",

      gradientInstruction: "Ищите полосы или неравномерные переходы",

      deadPixelTitle: "Обнаружение Мертвых Пикселей",
      deadPixelInstruction: "Ищите черные или белые точки, которые не меняются",

      burninTitle: "Тест Выгорания",
      burninInstruction:
        "Ищите призрачные изображения или стойкие тени\nот строки состояния, навигации или статических элементов",

      gridTitle: "Тест Сетчатого Узора",
      gridInstruction: "Проверьте выравнивание и однородность экрана",

      touchTitle: "Тест Касания и Рисования",
      touchSubtitle:
        "Рисуйте узоры на экране для проверки отзывчивости касания",
      touchTip1: "• Рисуйте прямые линии для проверки точности отслеживания",
      touchTip2: "• Рисуйте круги для проверки плавного отклика",
      touchTip3: "• Тестируйте все углы и края",
      touchTip4: "• Попробуйте быстрые и медленные движения",
      clearCanvas: "Очистить Холст",
      exit: "Выход",

      infoTitle: "Мой Экран Оригинальный?",
      infoSubtitle:
        "К сожалению, это приложение не может определить, является ли ваш экран оригинальной деталью Apple. Вот как проверить вручную:",

      method1Title: "📱 Метод 1: Проверка Настроек iOS",
      method1Step1: "1. Откройте приложение {{settings}}",
      method1Step2: "2. Перейдите в {{general}} → {{about}}",
      method1Step3: "3. Найдите {{importantDisplay}}",
      settings: "Настройки",
      general: "Основные",
      about: "Об устройстве",
      importantDisplay: "Важное Сообщение о Дисплее",
      method1Warning:
        "⚠️ Если вы видите предупреждающее сообщение, ваш экран может быть не оригинальной деталью Apple",
      openSettings: "Открыть Настройки",

      method2Title: "🔍 Метод 2: Визуальный Осмотр",
      signsOfNonOriginal: "Признаки Неоригинального Экрана:",
      sign1: "• Плохая точность цветопередачи или выцветшие цвета",
      sign2: "• Более низкая яркость по сравнению с оригиналом",
      sign3: "• Проблемы с откликом касания или мертвые зоны",
      sign4: "• True Tone не работает или отсутствует",
      sign5: "• Night Shift ведет себя иначе",
      sign6: "• Видимая утечка света по краям",
      sign7: "• Экран не идеально прилегает к рамке",
      sign8: "• Другая текстура стекла или отражение",

      method3Title: "✅ Метод 3: Тест True Tone",
      method3Step1: "1. Перейдите в {{settings}} → {{displayBrightness}}",
      method3Step2: "2. Проверьте наличие опции {{trueTone}}",
      method3Step3: "3. Включите/выключите, чтобы увидеть изменения цвета",
      displayBrightness: "Дисплей и Яркость",
      trueTone: "True Tone",
      trueToneTip:
        "💡 Оригинальные экраны всегда имеют True Tone (iPhone 8 и новее). Сторонние экраны часто не имеют этой функции.",

      method4Title: "🏪 Метод 4: Диагностика Apple",
      mostReliableMethod: "Самый Надежный Метод:",
      method4Item1:
        "• Посетите Apple Store или Авторизованного Сервис-Провайдера",
      method4Item2: "• У них есть официальные диагностические инструменты",
      method4Item3: "• Могут проверить все компоненты, включая экран",
      method4Item4: "• Проверить историю ремонта вашего устройства",

      whyCantDetectTitle: "❓ Почему Это Приложение Не Может Определить?",
      whyCantDetect:
        "iOS не позволяет приложениям получать доступ к информации на уровне оборудования, такой как:",
      whyCantItem1: "• Серийные номера экрана",
      whyCantItem2: "• ID производителя компонентов",
      whyCantItem3: "• Данные аутентификации оборудования",
      whyCantItem4: "• Детали датчика True Tone",
      privacyNote:
        "Это сделано для вашей конфиденциальности и безопасности. Только проверки на уровне системы iOS могут проверить оригинальные детали.",

      whatAppCanDoTitle: "🔧 Что Это Приложение МОЖЕТ Делать",
      whatAppCanDo:
        "Это приложение помогает выявить {{qualityIssues}}, которые могут указывать на неоригинальный или неисправный экран:",
      qualityIssues: "проблемы с качеством",
      canDo1: "✓ Мертвые или застрявшие пиксели",
      canDo2: "✓ Проблемы с откликом касания",
      canDo3: "✓ Проблемы с точностью цветопередачи",
      canDo4: "✓ Выгорание или остаточное изображение",
      canDo5: "✓ Проблемы с однородностью экрана",
      canDo6: "✓ Точность отслеживания касаний",

      disclaimerTitle: "⚖️ Важное Примечание",
      disclaimerText:
        "Даже если экран проходит все тесты в этом приложении, это не гарантирует, что это оригинальный экран Apple. Аналогично, качественные сторонние экраны могут хорошо работать в этих тестах. Для окончательной проверки обратитесь непосредственно в Apple.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode || "en", // Get device language
  fallbackLng: "en",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
