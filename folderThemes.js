/* ==========================================================================
   FOLDER THEMES CONFIG — "Skibidi Industrial / Cómic Grunge" (19 Temas)
   ==========================================================================
   CÓMO AGREGAR UN NUEVO MODELO / TEMA:
   1. Agrega un nuevo bloque dentro de `FOLDER_THEMES` con su `id`, `keywords`,
      `image` (`./assets/themes/tu-id.png`), `fallbackSvg`, `cornerGadget`,
      `editIcon` y `deleteIcon`.
   2. El detector ignora mayúsculas, acentos y letras repetidas
      (ej: "MAKUIIN" -> "makuin", "BAAATMAN" -> "batman").
   3. Si colocas un PNG en `./assets/themes/<id>.png`, se usa automáticamente;
      si no existe, se muestra el SVG temático con la taza y personaje disfrazado.
   ========================================================================== */

const FOLDER_THEME_SVGS = {
    // --- GADGETS DE ESQUINA SUPERIOR DERECHA ---
    cctv: `
        <svg class="corner-gadget-svg gadget-cctv" viewBox="0 0 56 42" fill="none" aria-hidden="true">
            <path d="M8 12L40 4L46 21L15 29L8 12Z" fill="#94a3b8" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M12 14L38 8L41 18L15 24L12 14Z" fill="#64748b"/>
            <rect x="42" y="9" width="9" height="10" rx="2" transform="rotate(-14 42 9)" fill="#38e8ff" stroke="#0c4a6e" stroke-width="2"/>
            <circle cx="47" cy="14" r="2.6" fill="#e0f2fe"/>
            <path d="M22 27L16 38H6" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6" cy="38" r="3.2" fill="#94a3b8" stroke="#0f172a" stroke-width="1.6"/>
        </svg>`,

    speaker: `
        <svg class="corner-gadget-svg gadget-speaker" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="8" y="6" width="32" height="36" rx="5" fill="#334155" stroke="#0f172a" stroke-width="2.6"/>
            <rect x="12" y="10" width="24" height="28" rx="3" fill="#1e293b"/>
            <circle cx="24" cy="28" r="9" fill="#0f172a" stroke="#64748b" stroke-width="2.2"/>
            <circle cx="24" cy="28" r="3.8" fill="#94a3b8"/>
            <circle cx="24" cy="15" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.8"/>
            <path d="M2 16L6 19M1 24H6M2 32L6 29" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    batSignal: `
        <svg class="corner-gadget-svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="#facc15" stroke="#111" stroke-width="3"/>
            <path d="M9 24C12 18 16 17 19 20L21 15L24 19L27 15L29 20C32 17 36 18 39 24C35 24 33 27 31 30C29 26 26 26 24 31C22 26 19 26 17 30C15 27 13 24 9 24Z" fill="#111"/>
        </svg>`,

    // --- DECORACIONES DE TÍTULO ---
    checkeredFlagLeft: `
        <svg class="title-deco-flag flag-left" viewBox="0 0 28 22" fill="none" aria-hidden="true">
            <g transform="skewX(-12)">
                <rect x="4" y="2" width="20" height="16" rx="1.5" fill="#f8fafc" stroke="#111" stroke-width="1.8"/>
                <rect x="4" y="2" width="5" height="5" fill="#111"/><rect x="14" y="2" width="5" height="5" fill="#111"/>
                <rect x="9" y="7" width="5" height="5" fill="#111"/><rect x="19" y="7" width="5" height="5" fill="#111"/>
                <rect x="4" y="12" width="5" height="5" fill="#111"/><rect x="14" y="12" width="5" height="5" fill="#111"/>
            </g>
        </svg>`,

    checkeredFlagRight: `
        <svg class="title-deco-flag flag-right" viewBox="0 0 28 22" fill="none" aria-hidden="true">
            <g transform="skewX(-12)">
                <rect x="4" y="2" width="20" height="16" rx="1.5" fill="#f8fafc" stroke="#111" stroke-width="1.8"/>
                <rect x="9" y="2" width="5" height="5" fill="#111"/><rect x="19" y="2" width="5" height="5" fill="#111"/>
                <rect x="4" y="7" width="5" height="5" fill="#111"/><rect x="14" y="7" width="5" height="5" fill="#111"/>
                <rect x="9" y="12" width="5" height="5" fill="#111"/><rect x="19" y="12" width="5" height="5" fill="#111"/>
            </g>
        </svg>`,

    sparkle: `
        <svg class="title-deco-sparkle" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" fill="#fdf2f8"/>
        </svg>`,

    bolt: `
        <svg class="title-deco-sparkle" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2L4 14h7l-1 8 10-12h-7l0-8z" fill="#facc15" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>`,

    // --- ICONOS DE BOTONES 3D ARCADE ---
    editWrench: `
        <svg class="f-btn-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.7" stroke-linejoin="round"/>
        </svg>`,

    editPencil: `
        <svg class="f-btn-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20l4.5-1.2L19.6 7.7a2.1 2.1 0 0 0-3-3L5.5 15.8 4 20z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.7" stroke-linejoin="round"/>
            <path d="M14.5 6.8l3 3" stroke="#0f172a" stroke-width="1.7"/>
        </svg>`,

    deletePlunger: `
        <svg class="f-btn-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v9" stroke="#d97706" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M6 17c0-3.3 2.7-6 6-6s6 2.7 6 6H6z" fill="#ef4444" stroke="#450a0a" stroke-width="1.8" stroke-linejoin="round"/>
            <rect x="4.5" y="17" width="15" height="3" rx="1.5" fill="#991b1b" stroke="#450a0a" stroke-width="1.4"/>
        </svg>`,

    deleteTnt: `
        <svg class="f-btn-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="7" width="16" height="14" rx="2" fill="#dc2626" stroke="#450a0a" stroke-width="1.7"/>
            <rect x="4" y="11" width="16" height="6" fill="#f8fafc"/>
            <path d="M12 7V4M12 4L15 2" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
            <circle cx="15.5" cy="2" r="1.5" fill="#fde047"/>
            <path d="M7 13h2m1.5 0v2.5m0-2.5l2 2.5V13m2.5 0h2m-1 0v2.5" stroke="#111" stroke-width="1.2" stroke-linecap="round"/>
        </svg>`,

    deleteSkull: `
        <svg class="f-btn-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3C7.6 3 4.5 6 4.5 10c0 2.5 1.3 4.6 3.2 5.7V19a1.5 1.5 0 0 0 1.5 1.5h5.6a1.5 1.5 0 0 0 1.5-1.5v-3.3c1.9-1.1 3.2-3.2 3.2-5.7C19.5 6 16.4 3 12 3z" fill="#fdf2f8" stroke="#831843" stroke-width="1.7"/>
            <circle cx="9.2" cy="10.5" r="1.6" fill="#831843"/>
            <circle cx="14.8" cy="10.5" r="1.6" fill="#831843"/>
            <path d="M10 17v3.5M14 17v3.5" stroke="#831843" stroke-width="1.5"/>
        </svg>`,

    // ======================================================================
    // ILUSTRACIONES SVG DE PERSONAJES SKIBIDI DISFRAZADOS + TAZA TEMÁTICA
    // ======================================================================

    // 1. MAKUIN (Rayo McQueen — taza roja racing con rayo 95 y lentes/casco)
    fallbackMakuin: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d="M8 28L20 20L16 33L26 25" stroke="#facc15" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M90 28L78 20L82 33L72 25" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="14" y="24" width="18" height="32" rx="4" fill="#dc2626" stroke="#111" stroke-width="2.8"/>
            <rect x="12" y="21" width="22" height="6" rx="2" fill="#facc15" stroke="#111" stroke-width="2.2"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#dc2626" stroke="#111" stroke-width="2.8"/>
            <path d="M34 62L58 56L52 67L74 62" stroke="#facc15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#991b1b" stroke="#111" stroke-width="2.8"/>
            <circle cx="54" cy="35" r="15" fill="#e5ae82" stroke="#111" stroke-width="2.8"/>
            <path d="M39 30C42 20 66 20 69 30Z" fill="#dc2626" stroke="#111" stroke-width="2.4"/>
            <rect x="43" y="29" width="22" height="7" rx="3" fill="#111827" stroke="#facc15" stroke-width="1.6"/>
            <circle cx="49" cy="32.5" r="1.8" fill="#fef08a"/><circle cx="59" cy="32.5" r="1.8" fill="#fef08a"/>
            <path d="M46 41C50 46 58 46 62 41" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>
        </svg>`,

    // 2. MAIKRA (Minecraft — taza pixelada + Creeper)
    fallbackMaikra: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="22" width="20" height="34" fill="#cbd5e1" stroke="#0f172a" stroke-width="3"/>
            <rect x="28" y="50" width="54" height="26" fill="#e2e8f0" stroke="#0f172a" stroke-width="3"/>
            <rect x="34" y="56" width="12" height="12" fill="#4ade80" fill-opacity="0.35"/>
            <rect x="58" y="58" width="14" height="10" fill="#22c55e" fill-opacity="0.35"/>
            <rect x="38" y="76" width="34" height="14" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
            <rect x="39" y="16" width="32" height="34" fill="#22c55e" stroke="#052e16" stroke-width="3"/>
            <rect x="45" y="24" width="6" height="6" fill="#052e16"/><rect x="59" y="24" width="6" height="6" fill="#052e16"/>
            <rect x="51" y="30" width="8" height="10" fill="#052e16"/>
            <rect x="47" y="34" width="4" height="10" fill="#052e16"/><rect x="59" y="34" width="4" height="10" fill="#052e16"/>
            <rect x="8" y="66" width="8" height="8" fill="#4ade80"/><rect x="84" y="16" width="8" height="8" fill="#4ade80"/>
        </svg>`,

    // 3. BARBI (Barbie — taza rosa glam + lentes rosas + moño)
    fallbackBarbi: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="24" width="18" height="32" rx="4" fill="#f472b6" stroke="#831843" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#f9a8d4" stroke="#831843" stroke-width="2.8"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#ec4899" stroke="#831843" stroke-width="2.8"/>
            <circle cx="54" cy="34" r="16" fill="#fde047" stroke="#831843" stroke-width="2.6"/>
            <circle cx="54" cy="37" r="12" fill="#f5c29b"/>
            <rect x="43" y="32" width="10" height="6.5" rx="3" fill="#be185d" stroke="#fdf2f8" stroke-width="1.6"/>
            <rect x="55" y="32" width="10" height="6.5" rx="3" fill="#be185d" stroke="#fdf2f8" stroke-width="1.6"/>
            <path d="M49 42C52 45 56 45 59 42" stroke="#be185d" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M44 16L54 22L64 16L61 25H47L44 16Z" fill="#ec4899" stroke="#831843" stroke-width="2.2"/>
            <path d="M14 14L16 19L21 21L16 23L14 28L12 23L7 21L12 19L14 14Z" fill="#fdf2f8"/>
        </svg>`,

    // 4. BATMAN (taza negra con Bat-logo amarillo + máscara negra con orejas y ojos blancos)
    fallbackBatman: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="26" width="18" height="32" rx="3" fill="#1f2937" stroke="#090d12" stroke-width="2.8"/>
            <rect x="12" y="23" width="22" height="5" rx="2" fill="#374151" stroke="#090d12" stroke-width="2"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#1e242b" stroke="#090d12" stroke-width="2.8"/>
            <ellipse cx="54" cy="65" rx="14" ry="8" fill="#facc15" stroke="#090d12" stroke-width="2"/>
            <path d="M44 65C47 61 50 61 52 63L54 59L56 63C58 61 61 61 64 65C61 65 59 67 58 69C56 66 55 66 54 70C53 66 52 66 50 69C49 67 47 65 44 65Z" fill="#090d12"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#111827" stroke="#090d12" stroke-width="2.8"/>
            <!-- Cabeza con máscara de Batman y orejas puntiagudas -->
            <path d="M39 36V14L47 24H61L69 14V36C69 45 62 50 54 50C46 50 39 45 39 36Z" fill="#111827" stroke="#000" stroke-width="2.8" stroke-linejoin="round"/>
            <path d="M43 39H65C64 46 60 49 54 49C48 49 44 46 43 39Z" fill="#e5ae82"/>
            <path d="M43 31L51 33L44 35Z" fill="#ffffff"/>
            <path d="M65 31L57 33L64 35Z" fill="#ffffff"/>
            <path d="M48 43H60" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>
        </svg>`,

    // 5. SPIDER-MAN (taza roja/azul con telaraña + máscara roja con ojos blancos grandes)
    fallbackSpiderman: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#1d4ed8" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#dc2626" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M54 52V80M34 62H74M38 55L70 74M70 55L38 74" stroke="#111827" stroke-width="1.4" stroke-opacity="0.7"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="2.8"/>
            <!-- Cabeza con máscara de Spider-Man -->
            <ellipse cx="54" cy="34" rx="15" ry="16" fill="#dc2626" stroke="#111" stroke-width="2.8"/>
            <path d="M54 18V50M39 34H69M43 23L65 45M65 23L43 45" stroke="#111" stroke-width="1.2" stroke-opacity="0.65"/>
            <path d="M42 29C45 27 50 30 51 35C47 37 42 34 42 29Z" fill="#ffffff" stroke="#111" stroke-width="2.4"/>
            <path d="M66 29C63 27 58 30 57 35C61 37 66 34 66 29Z" fill="#ffffff" stroke="#111" stroke-width="2.4"/>
        </svg>`,

    // 6. SHREK (taza pantano madera/lodo + ogro verde con orejas de trompeta)
    fallbackShrek: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="3" fill="#78502b" stroke="#271a0c" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#926239" stroke="#271a0c" stroke-width="2.8"/>
            <path d="M30 54C38 62 46 56 54 64C62 56 70 62 78 54" stroke="#65a30d" stroke-width="5" stroke-linecap="round"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#5c3d22" stroke="#271a0c" stroke-width="2.8"/>
            <!-- Orejas de trompeta de Shrek -->
            <path d="M40 31L28 21L33 17L43 26Z" fill="#84cc16" stroke="#1a2e05" stroke-width="2.4"/>
            <path d="M68 31L80 21L75 17L65 26Z" fill="#84cc16" stroke="#1a2e05" stroke-width="2.4"/>
            <circle cx="54" cy="35" r="15" fill="#84cc16" stroke="#1a2e05" stroke-width="2.8"/>
            <circle cx="48" cy="32" r="2.3" fill="#1a2e05"/><circle cx="60" cy="32" r="2.3" fill="#1a2e05"/>
            <ellipse cx="54" cy="36" rx="4" ry="2.5" fill="#65a30d"/>
            <path d="M45 42C50 47 58 47 63 42" stroke="#1a2e05" stroke-width="2.6" stroke-linecap="round"/>
        </svg>`,

    // 7. STITCH (taza azul tropical + Stitch con orejotas azules/rosas)
    fallbackStitch: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="26" width="18" height="32" rx="4" fill="#1d4ed8" stroke="#0c1e4a" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#3b82f6" stroke="#0c1e4a" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="6" fill="#f472b6"/><circle cx="54" cy="65" r="2.5" fill="#fef08a"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#1e40af" stroke="#0c1e4a" stroke-width="2.8"/>
            <!-- Orejotas de Stitch -->
            <path d="M41 32C28 24 24 14 31 12C38 10 44 20 46 27Z" fill="#2563eb" stroke="#0c1e4a" stroke-width="2.6"/>
            <path d="M39 28C32 23 30 16 33 15C37 14 41 21 43 26Z" fill="#f472b6"/>
            <path d="M67 32C80 24 84 14 77 12C70 10 64 20 62 27Z" fill="#2563eb" stroke="#0c1e4a" stroke-width="2.6"/>
            <path d="M69 28C76 23 78 16 75 15C71 14 67 21 65 26Z" fill="#f472b6"/>
            <ellipse cx="54" cy="36" rx="15" ry="13" fill="#3b82f6" stroke="#0c1e4a" stroke-width="2.8"/>
            <ellipse cx="47" cy="34" rx="4.5" ry="5.5" fill="#93c5fd"/><circle cx="47" cy="34" r="3" fill="#0f172a"/>
            <ellipse cx="61" cy="34" rx="4.5" ry="5.5" fill="#93c5fd"/><circle cx="61" cy="34" r="3" fill="#0f172a"/>
            <ellipse cx="54" cy="38" rx="4" ry="2.8" fill="#1e3a8a"/>
            <path d="M46 43C51 47 57 47 62 43" stroke="#0c1e4a" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    // 8. HELLO KITTY / SANRIO (taza blanca/rosa + orejitas de gatita, bigotes y moño rojo)
    fallbackKitty: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#fbcfe8" stroke="#831843" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#ffffff" stroke="#831843" stroke-width="2.8"/>
            <path d="M46 63L54 67L62 63V70L54 67L46 70Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.6"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#f9a8d4" stroke="#831843" stroke-width="2.8"/>
            <!-- Cabeza Hello Kitty -->
            <path d="M40 31L39 17L49 23H59L69 17L68 31C71 39 65 48 54 48C43 48 37 39 40 31Z" fill="#ffffff" stroke="#111" stroke-width="2.8" stroke-linejoin="round"/>
            <circle cx="46" cy="36" r="2.2" fill="#111"/><circle cx="62" cy="36" r="2.2" fill="#111"/>
            <ellipse cx="54" cy="39" rx="3" ry="2" fill="#facc15" stroke="#111" stroke-width="1.4"/>
            <path d="M33 35H40M34 39H40M68 35H75M68 39H74" stroke="#111" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="66" cy="23" r="4.5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.8"/>
            <circle cx="61" cy="21" r="3" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
        </svg>`,

    // 9. MARIO BROS (taza tubería verde + bloque ? + gorra roja con M y bigote)
    fallbackMario: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="3" fill="#16a34a" stroke="#052e16" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#22c55e" stroke="#052e16" stroke-width="2.8"/>
            <rect x="24" y="48" width="60" height="8" rx="3" fill="#4ade80" stroke="#052e16" stroke-width="2.5"/>
            <rect x="46" y="60" width="16" height="14" rx="2" fill="#facc15" stroke="#713f12" stroke-width="2"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#15803d" stroke="#052e16" stroke-width="2.8"/>
            <!-- Cabeza Mario con gorra roja y bigote -->
            <circle cx="54" cy="36" r="14" fill="#f5c29b" stroke="#111" stroke-width="2.8"/>
            <path d="M38 30C40 18 68 18 70 30H38Z" fill="#dc2626" stroke="#111" stroke-width="2.6"/>
            <rect x="37" y="28" width="34" height="5" rx="2.5" fill="#b91c1c" stroke="#111" stroke-width="2"/>
            <circle cx="54" cy="24" r="4.5" fill="#ffffff"/>
            <path d="M51.5 26V22L54 24.5L56.5 22V26" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="49" cy="35" r="2" fill="#111"/><circle cx="59" cy="35" r="2" fill="#111"/>
            <path d="M45 41C48 39 60 39 63 41C61 45 47 45 45 41Z" fill="#451a03"/>
        </svg>`,

    // 10. PIKACHU / POKÉMON (taza Pokébola + orejas amarillas con punta negra y mejillas rojas)
    fallbackPokemon: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#ef4444" stroke="#111" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
            <path d="M26 52H82C82 60 76 64 54 64C32 64 26 60 26 52Z" fill="#ef4444" stroke="#111" stroke-width="2.6"/>
            <circle cx="54" cy="64" r="6" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
            <circle cx="54" cy="64" r="2.2" fill="#cbd5e1"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#e2e8f0" stroke="#111" stroke-width="2.8"/>
            <!-- Orejas Pikachu -->
            <path d="M43 27L31 10L41 13L49 24Z" fill="#facc15" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M31 10L37 12L35 16Z" fill="#111"/>
            <path d="M65 27L77 10L67 13L59 24Z" fill="#facc15" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M77 10L71 12L73 16Z" fill="#111"/>
            <circle cx="54" cy="36" r="14.5" fill="#facc15" stroke="#111" stroke-width="2.8"/>
            <circle cx="48" cy="34" r="2.4" fill="#111"/><circle cx="60" cy="34" r="2.4" fill="#111"/>
            <circle cx="44" cy="40" r="3.2" fill="#ef4444"/><circle cx="64" cy="40" r="3.2" fill="#ef4444"/>
            <path d="M50 40C52 43 56 43 58 40" stroke="#111" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

    // 11. BOB ESPONJA (taza amarilla con poros y corbata roja + cara cuadrada)
    fallbackBob: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#facc15" stroke="#422006" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#fef08a" stroke="#422006" stroke-width="2.8"/>
            <path d="M49 52H59L56 67L54 71L52 67L49 52Z" fill="#dc2626" stroke="#450a0a" stroke-width="1.6"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#92400e" stroke="#422006" stroke-width="2.8"/>
            <!-- Cabeza Bob Esponja -->
            <rect x="39" y="18" width="30" height="32" rx="4" fill="#fde047" stroke="#422006" stroke-width="2.8"/>
            <circle cx="44" cy="23" r="2" fill="#ca8a04"/><circle cx="64" cy="24" r="2.2" fill="#ca8a04"/>
            <circle cx="48" cy="32" r="4.5" fill="#fff" stroke="#111" stroke-width="1.8"/><circle cx="48" cy="32" r="2" fill="#38bdf8"/>
            <circle cx="60" cy="32" r="4.5" fill="#fff" stroke="#111" stroke-width="1.8"/><circle cx="60" cy="32" r="2" fill="#38bdf8"/>
            <path d="M45 41C50 46 58 46 63 41" stroke="#422006" stroke-width="2.2" stroke-linecap="round"/>
            <rect x="50" y="42" width="3.5" height="4" fill="#fff" stroke="#111" stroke-width="1.2"/>
            <rect x="55" y="42" width="3.5" height="4" fill="#fff" stroke="#111" stroke-width="1.2"/>
        </svg>`,

    // 12. NARUTO (taza negra/naranja Akatsuki + banda ninja metálica y bigotes)
    fallbackNaruto: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#18181b" stroke="#000" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#f97316" stroke="#18181b" stroke-width="2.8"/>
            <ellipse cx="54" cy="65" rx="11" ry="6" fill="#dc2626" stroke="#fff" stroke-width="1.6"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#18181b" stroke="#000" stroke-width="2.8"/>
            <!-- Pelo puntiagudo rubio + banda ninja -->
            <path d="M37 28L42 12L49 21L54 10L59 21L66 12L71 28Z" fill="#facc15" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/>
            <circle cx="54" cy="36" r="14" fill="#f5c29b" stroke="#111" stroke-width="2.8"/>
            <rect x="40" y="25" width="28" height="6.5" rx="2" fill="#1e293b" stroke="#000" stroke-width="1.8"/>
            <rect x="47" y="26" width="14" height="4.5" rx="1" fill="#cbd5e1"/>
            <circle cx="49" cy="36" r="2" fill="#2563eb"/><circle cx="59" cy="36" r="2" fill="#2563eb"/>
            <path d="M41 39H46M41 42H46M62 39H67M62 42H67" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M49 44C52 47 56 47 59 44" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    // 13. DRAGON BALL / GOKU (taza naranja/azul con esfera del dragón + pelo Super Saiyajin)
    fallbackDragonball: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#1d4ed8" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#f97316" stroke="#0f172a" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="8" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
            <circle cx="51" cy="63" r="1.4" fill="#dc2626"/><circle cx="57" cy="63" r="1.4" fill="#dc2626"/>
            <circle cx="54" cy="67" r="1.4" fill="#dc2626"/><circle cx="54" cy="61" r="1.4" fill="#dc2626"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="2.8"/>
            <!-- Pelo Super Saiyajin dorado -->
            <path d="M36 30L39 10L48 20L54 6L60 20L69 10L72 30Z" fill="#fde047" stroke="#854d0e" stroke-width="2.4" stroke-linejoin="round"/>
            <circle cx="54" cy="36" r="13.5" fill="#f5c29b" stroke="#111" stroke-width="2.8"/>
            <path d="M45 33L52 35M63 33L56 35" stroke="#854d0e" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="49" cy="37" r="2" fill="#10b981"/><circle cx="59" cy="37" r="2" fill="#10b981"/>
            <path d="M48 44C52 46 56 46 60 44" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    // 14. DEADPOOL (taza roja/negra con katanas + máscara roja con parches negros)
    fallbackDeadpool: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d="M30 14L76 58M78 14L32 58" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round"/>
            <rect x="14" y="26" width="18" height="32" rx="4" fill="#18181b" stroke="#000" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#b91c1c" stroke="#000" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="8" fill="#111" stroke="#ef4444" stroke-width="2"/>
            <path d="M54 57V73" stroke="#ef4444" stroke-width="2.4"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#18181b" stroke="#000" stroke-width="2.8"/>
            <!-- Máscara Deadpool -->
            <ellipse cx="54" cy="34" rx="15" ry="16" fill="#dc2626" stroke="#000" stroke-width="2.8"/>
            <ellipse cx="47" cy="34" rx="5" ry="7.5" fill="#111"/>
            <ellipse cx="61" cy="34" rx="5" ry="7.5" fill="#111"/>
            <ellipse cx="47" cy="34" rx="2.6" ry="1.8" fill="#ffffff"/>
            <ellipse cx="61" cy="34" rx="2.6" ry="1.8" fill="#ffffff"/>
        </svg>`,

    // 15. IRON MAN / MARVEL (taza rojo/dorado con reactor Arc + casco Iron Man)
    fallbackIronman: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#b91c1c" stroke="#450a0a" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#dc2626" stroke="#450a0a" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="7.5" fill="#38e8ff" stroke="#e0f2fe" stroke-width="2.4"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#eab308" stroke="#450a0a" stroke-width="2.8"/>
            <!-- Casco Iron Man -->
            <rect x="39" y="18" width="30" height="32" rx="9" fill="#dc2626" stroke="#450a0a" stroke-width="2.8"/>
            <path d="M43 22H65L63 46H45L43 22Z" fill="#facc15" stroke="#450a0a" stroke-width="2"/>
            <rect x="44" y="31" width="8" height="3.5" rx="1.5" fill="#e0f2fe"/>
            <rect x="56" y="31" width="8" height="3.5" rx="1.5" fill="#e0f2fe"/>
            <path d="M48 42H60" stroke="#450a0a" stroke-width="2.2"/>
        </svg>`,

    // 16. TOY STORY (taza vaquero/nubes + sombrero de Woody)
    fallbackToystory: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="26" width="18" height="32" rx="4" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#facc15" stroke="#713f12" stroke-width="2.8"/>
            <circle cx="44" cy="64" r="4" fill="#111"/><circle cx="64" cy="61" r="5" fill="#111"/><circle cx="55" cy="72" r="3.5" fill="#111"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2.8"/>
            <!-- Sombrero de vaquero Woody -->
            <circle cx="54" cy="38" r="13.5" fill="#f5c29b" stroke="#111" stroke-width="2.8"/>
            <path d="M32 27C44 23 64 23 76 27C66 32 42 32 32 27Z" fill="#92400e" stroke="#451a03" stroke-width="2.4"/>
            <path d="M42 26L46 13L54 17L62 13L66 26Z" fill="#b45309" stroke="#451a03" stroke-width="2.4" stroke-linejoin="round"/>
            <circle cx="49" cy="37" r="2" fill="#111"/><circle cx="59" cy="37" r="2" fill="#111"/>
            <path d="M47 43C51 47 57 47 61 43" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    // 17. SONIC (taza azul con anillo dorado + púas azules de Sonic)
    fallbackSonic: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#1d4ed8" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#2563eb" stroke="#0f172a" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="8" stroke="#facc15" stroke-width="4"/>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#dc2626" stroke="#0f172a" stroke-width="2.8"/>
            <!-- Cabeza Sonic con púas -->
            <path d="M36 30L22 22L38 20L32 10L50 18L68 18L76 28L68 42H40Z" fill="#2563eb" stroke="#0f172a" stroke-width="2.6" stroke-linejoin="round"/>
            <ellipse cx="55" cy="37" rx="13" ry="11" fill="#f5c29b" stroke="#0f172a" stroke-width="2"/>
            <ellipse cx="50" cy="32" rx="4.5" ry="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <ellipse cx="59" cy="32" rx="4.5" ry="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
            <circle cx="51" cy="33" r="2.2" fill="#16a34a"/><circle cx="60" cy="33" r="2.2" fill="#16a34a"/>
            <path d="M49 42C53 45 58 45 61 42" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

    // 18. MINIONS (taza overol azul + cabeza amarilla con goggles plateados)
    fallbackMinion: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="14" y="25" width="18" height="32" rx="4" fill="#facc15" stroke="#422006" stroke-width="2.8"/>
            <path d="M26 52H82C82 70 70 80 54 80C38 80 26 70 26 52Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2.8"/>
            <circle cx="54" cy="65" r="6" fill="#111"/><text x="54" y="68" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">G</text>
            <path d="M38 78H70L74 90H34L38 78Z" fill="#1e3a8a" stroke="#0f172a" stroke-width="2.8"/>
            <!-- Cabeza Minion con goggles -->
            <rect x="40" y="18" width="28" height="32" rx="14" fill="#facc15" stroke="#422006" stroke-width="2.8"/>
            <rect x="39" y="29" width="30" height="5" fill="#1f2937"/>
            <circle cx="48" cy="31" r="6.5" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
            <circle cx="60" cy="31" r="6.5" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
            <circle cx="48" cy="31" r="2.5" fill="#451a03"/><circle cx="60" cy="31" r="2.5" fill="#451a03"/>
            <path d="M48 42C52 45 56 45 60 42" stroke="#422006" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`,

    // 19. DEFAULT (Skibidi Industrial clásico)
    fallbackDefault: `
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="16" y="24" width="18" height="34" rx="4" fill="#94a3b8" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M28 52H82C82 70 70 80 55 80C40 80 28 70 28 52Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="2.8"/>
            <path d="M38 78H72L76 90H34L38 78Z" fill="#cbd5e1" stroke="#0f172a" stroke-width="2.8"/>
            <circle cx="55" cy="35" r="14.5" fill="#e0a97d" stroke="#0f172a" stroke-width="2.8"/>
            <circle cx="50" cy="33" r="2.2" fill="#0f172a"/><circle cx="60" cy="33" r="2.2" fill="#0f172a"/>
            <path d="M47 40C51 45 59 45 63 40" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round"/>
            <circle cx="78" cy="24" r="5" fill="#38e8ff" fill-opacity="0.75"/>
        </svg>`
};

/**
 * Diccionario extensible de temas por carpeta (18 personajes + default).
 */
const FOLDER_THEMES = {
    makuin: {
        id: 'makuin',
        keywords: ['makuin', 'mcqueen', 'rayo', 'cars', 'mate'],
        image: './assets/themes/makuin.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackMakuin,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: FOLDER_THEME_SVGS.checkeredFlagLeft,
        titleRightDeco: FOLDER_THEME_SVGS.checkeredFlagRight,
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: true
    },
    maikra: {
        id: 'maikra',
        keywords: ['maikra', 'minecraft', 'steve', 'creeper', 'enderman'],
        image: './assets/themes/maikra.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackMaikra,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteTnt,
        hasBurst: true
    },
    barbi: {
        id: 'barbi',
        keywords: ['barbi', 'barbie', 'rosa', 'ken'],
        image: './assets/themes/barbi.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackBarbi,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.sparkle,
        titleRightDeco: FOLDER_THEME_SVGS.sparkle,
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deleteSkull,
        hasBurst: true
    },
    batman: {
        id: 'batman',
        keywords: ['batman', 'bat', 'gotham', 'murcielago', 'joker', 'batmovil'],
        image: './assets/themes/batman.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackBatman,
        cornerGadget: FOLDER_THEME_SVGS.batSignal,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteSkull,
        hasBurst: true
    },
    spiderman: {
        id: 'spiderman',
        keywords: ['spider', 'spiderman', 'arana', 'spidey', 'venom', 'miles'],
        image: './assets/themes/spiderman.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackSpiderman,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: true
    },
    shrek: {
        id: 'shrek',
        keywords: ['shrek', 'ogro', 'pantano', 'burro', 'fiona'],
        image: './assets/themes/shrek.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackShrek,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: true
    },
    stitch: {
        id: 'stitch',
        keywords: ['stitch', 'stich', 'lilo', 'angel'],
        image: './assets/themes/stitch.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackStitch,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.sparkle,
        titleRightDeco: FOLDER_THEME_SVGS.sparkle,
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: false
    },
    kitty: {
        id: 'kitty',
        keywords: ['kitty', 'hello', 'sanrio', 'kuromi', 'melody', 'cinnamoroll', 'gatita'],
        image: './assets/themes/kitty.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackKitty,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.sparkle,
        titleRightDeco: FOLDER_THEME_SVGS.sparkle,
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deleteSkull,
        hasBurst: false
    },
    mario: {
        id: 'mario',
        keywords: ['mario', 'luigi', 'nintendo', 'bros', 'bowser', 'yoshi', 'peach'],
        image: './assets/themes/mario.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackMario,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteTnt,
        hasBurst: true
    },
    pokemon: {
        id: 'pokemon',
        keywords: ['pokemon', 'pikachu', 'pika', 'charizard', 'gengar', 'pokebola', 'eevee'],
        image: './assets/themes/pokemon.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackPokemon,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.bolt,
        titleRightDeco: FOLDER_THEME_SVGS.bolt,
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: true
    },
    bob: {
        id: 'bob',
        keywords: ['bob', 'esponja', 'spongebob', 'patricio', 'calamardo'],
        image: './assets/themes/bob.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackBob,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: false
    },
    naruto: {
        id: 'naruto',
        keywords: ['naruto', 'akatsuki', 'sasuke', 'konoha', 'itachi', 'ninja'],
        image: './assets/themes/naruto.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackNaruto,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteTnt,
        hasBurst: true
    },
    dragonball: {
        id: 'dragonball',
        keywords: ['goku', 'dragon', 'dbz', 'vegeta', 'saiyajin', 'broly', 'gohan'],
        image: './assets/themes/dragonball.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackDragonball,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.bolt,
        titleRightDeco: FOLDER_THEME_SVGS.bolt,
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteTnt,
        hasBurst: true
    },
    deadpool: {
        id: 'deadpool',
        keywords: ['deadpool', 'wolverine'],
        image: './assets/themes/deadpool.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackDeadpool,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteSkull,
        hasBurst: true
    },
    ironman: {
        id: 'ironman',
        keywords: ['iron', 'ironman', 'stark', 'avengers', 'marvel', 'vengadores'],
        image: './assets/themes/ironman.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackIronman,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deleteTnt,
        hasBurst: true
    },
    toystory: {
        id: 'toystory',
        keywords: ['toy', 'woody', 'buzz', 'vaquero', 'lotso', 'rex', 'alien'],
        image: './assets/themes/toystory.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackToystory,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: false
    },
    sonic: {
        id: 'sonic',
        keywords: ['sonic', 'shadow', 'knuckles', 'tails', 'erizo'],
        image: './assets/themes/sonic.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackSonic,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: FOLDER_THEME_SVGS.bolt,
        titleRightDeco: FOLDER_THEME_SVGS.bolt,
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: true
    },
    minion: {
        id: 'minion',
        keywords: ['minion', 'minions', 'gru', 'banana'],
        image: './assets/themes/minion.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackMinion,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: false
    },
    default: {
        id: 'default',
        keywords: [],
        image: './assets/themes/default.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackDefault,
        cornerGadget: FOLDER_THEME_SVGS.cctv,
        titleLeftDeco: '',
        titleRightDeco: '',
        editIcon: FOLDER_THEME_SVGS.editWrench,
        deleteIcon: FOLDER_THEME_SVGS.deletePlunger,
        hasBurst: false
    }
};

function normalizeThemeKey(str) {
    return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function getFolderTheme(folderName) {
    const clean = normalizeThemeKey(folderName);
    const collapsed = clean.replace(/(.)\1+/g, '$1');

    for (const key of Object.keys(FOLDER_THEMES)) {
        if (key === 'default') continue;
        const theme = FOLDER_THEMES[key];
        const matched = theme.keywords.some(kw => {
            const normKw = normalizeThemeKey(kw);
            const colKw = normKw.replace(/(.)\1+/g, '$1');
            return clean.includes(normKw) || collapsed.includes(colKw);
        });
        if (matched) return theme;
    }

    return FOLDER_THEMES.default;
}
