/* ==========================================================================
   FOLDER THEMES CONFIG — "Skibidi Industrial / Cómic Grunge"
   ==========================================================================
   CÓMO AGREGAR UN NUEVO MODELO / TEMA:
   1. Copia cualquiera de los objetos dentro de `FOLDER_THEMES` abajo.
   2. Ponle un `id` único (ej: 'shrek'), palabras clave en `keywords` (sin acentos
      y en minúsculas; el detector ignora mayúsculas, acentos y letras repetidas
      como "MAKUIIN" -> "makuin").
   3. Agrega tu imagen PNG en `./assets/themes/tu-modelo.png` (fondo transparente
      recomendado para el efecto pop-out). Si aún no existe el PNG, se muestra
      automáticamente el `fallbackSvg` temático.
   4. (Opcional) Personaliza colores y fuente en `styles.css` bajo `.theme-tu-id`
      o usa las variables CSS inline (`accent`, `countColor`, `fontFamily`).
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

    // --- BANDERAS A CUADROS (MAKUIN) ---
    checkeredFlagLeft: `
        <svg class="title-deco-flag flag-left" viewBox="0 0 28 22" fill="none" aria-hidden="true">
            <g transform="skewX(-12)">
                <rect x="4" y="2" width="20" height="16" rx="1.5" fill="#f8fafc" stroke="#111" stroke-width="1.8"/>
                <rect x="4" y="2" width="5" height="5" fill="#111"/>
                <rect x="14" y="2" width="5" height="5" fill="#111"/>
                <rect x="9" y="7" width="5" height="5" fill="#111"/>
                <rect x="19" y="7" width="5" height="5" fill="#111"/>
                <rect x="4" y="12" width="5" height="5" fill="#111"/>
                <rect x="14" y="12" width="5" height="5" fill="#111"/>
            </g>
        </svg>`,

    checkeredFlagRight: `
        <svg class="title-deco-flag flag-right" viewBox="0 0 28 22" fill="none" aria-hidden="true">
            <g transform="skewX(-12)">
                <rect x="4" y="2" width="20" height="16" rx="1.5" fill="#f8fafc" stroke="#111" stroke-width="1.8"/>
                <rect x="9" y="2" width="5" height="5" fill="#111"/>
                <rect x="19" y="2" width="5" height="5" fill="#111"/>
                <rect x="4" y="7" width="5" height="5" fill="#111"/>
                <rect x="14" y="7" width="5" height="5" fill="#111"/>
                <rect x="9" y="12" width="5" height="5" fill="#111"/>
                <rect x="19" y="12" width="5" height="5" fill="#111"/>
            </g>
        </svg>`,

    // --- DESTELLOS SPARKLES (BARBI) ---
    sparkle: `
        <svg class="title-deco-sparkle" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" fill="#fdf2f8"/>
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

    // --- ILUSTRACIONES SVG DE RESPALDO (si aún no colocas el PNG en ./assets/themes/) ---
    fallbackMakuin: `
        <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <path d="M10 26L22 18L18 32L28 24" stroke="#facc15" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M84 26L72 18L76 32L66 24" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="16" y="22" width="18" height="32" rx="4" fill="#dc2626" stroke="#1e293b" stroke-width="3"/>
            <path d="M28 50H80C80 68 68 78 54 78C40 78 28 68 28 50Z" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
            <path d="M36 62L66 56L56 68L72 64" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M38 76H70L74 88H34L38 76Z" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
            <circle cx="54" cy="34" r="14" fill="#e0a97d" stroke="#1e293b" stroke-width="3"/>
            <circle cx="49" cy="31" r="2.2" fill="#111"/>
            <circle cx="59" cy="31" r="2.2" fill="#111"/>
            <path d="M46 38C50 43 58 43 62 38" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,

    fallbackMaikra: `
        <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <rect x="14" y="20" width="20" height="34" fill="#cbd5e1" stroke="#0f172a" stroke-width="3"/>
            <rect x="28" y="48" width="52" height="26" fill="#e2e8f0" stroke="#0f172a" stroke-width="3"/>
            <rect x="38" y="74" width="32" height="14" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
            <rect x="38" y="16" width="32" height="32" fill="#22c55e" stroke="#052e16" stroke-width="3"/>
            <rect x="44" y="24" width="6" height="6" fill="#052e16"/>
            <rect x="58" y="24" width="6" height="6" fill="#052e16"/>
            <rect x="50" y="30" width="8" height="10" fill="#052e16"/>
            <rect x="46" y="34" width="4" height="10" fill="#052e16"/>
            <rect x="58" y="34" width="4" height="10" fill="#052e16"/>
            <rect x="8" y="64" width="8" height="8" fill="#4ade80"/>
            <rect x="80" y="14" width="8" height="8" fill="#4ade80"/>
        </svg>`,

    fallbackBarbi: `
        <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <rect x="14" y="24" width="18" height="32" rx="4" fill="#f472b6" stroke="#831843" stroke-width="3"/>
            <path d="M26 52H80C80 70 68 80 53 80C38 80 26 70 26 52Z" fill="#f9a8d4" stroke="#831843" stroke-width="3"/>
            <path d="M38 78H68L72 89H34L38 78Z" fill="#ec4899" stroke="#831843" stroke-width="3"/>
            <circle cx="53" cy="35" r="14" fill="#fde68a" stroke="#831843" stroke-width="2.6"/>
            <circle cx="53" cy="37" r="11" fill="#f5c29b"/>
            <rect x="43" y="32" width="9" height="6" rx="3" fill="#be185d" stroke="#fdf2f8" stroke-width="1.6"/>
            <rect x="54" y="32" width="9" height="6" rx="3" fill="#be185d" stroke="#fdf2f8" stroke-width="1.6"/>
            <path d="M46 18L53 23L60 18L58 26H48L46 18Z" fill="#ec4899" stroke="#831843" stroke-width="2"/>
            <path d="M16 14L18 19L23 21L18 23L16 28L14 23L9 21L14 19L16 14Z" fill="#fdf2f8"/>
        </svg>`,

    fallbackDefault: `
        <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <rect x="16" y="22" width="18" height="34" rx="4" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
            <path d="M28 50H80C80 68 68 78 54 78C40 78 28 68 28 50Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="3"/>
            <path d="M38 76H70L74 88H34L38 76Z" fill="#cbd5e1" stroke="#0f172a" stroke-width="3"/>
            <circle cx="54" cy="34" r="14" fill="#e0a97d" stroke="#0f172a" stroke-width="3"/>
            <circle cx="49" cy="32" r="2.2" fill="#0f172a"/>
            <circle cx="59" cy="32" r="2.2" fill="#0f172a"/>
            <path d="M47 39C51 43 57 43 61 39" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="76" cy="24" r="5" fill="#38e8ff" fill-opacity="0.7"/>
        </svg>`
};

/**
 * Diccionario extensible de temas por carpeta.
 * Agrega aquí cualquier modelo nuevo sin tocar la lógica de app.js.
 */
const FOLDER_THEMES = {
    makuin: {
        id: 'makuin',
        keywords: ['makuin', 'mcqueen', 'rayo', 'cars'],
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
        keywords: ['maikra', 'minecraft', 'steve', 'creeper'],
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
        keywords: ['barbi', 'barbie', 'rosa'],
        image: './assets/themes/barbi.png',
        fallbackSvg: FOLDER_THEME_SVGS.fallbackBarbi,
        cornerGadget: FOLDER_THEME_SVGS.speaker,
        titleLeftDeco: FOLDER_THEME_SVGS.sparkle,
        titleRightDeco: FOLDER_THEME_SVGS.sparkle,
        editIcon: FOLDER_THEME_SVGS.editPencil,
        deleteIcon: FOLDER_THEME_SVGS.deleteSkull,
        hasBurst: true
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

/**
 * Normaliza un texto para comparar palabras clave sin importar
 * mayúsculas, acentos ni letras estiradas (ej: "MAKUIIN" -> "makuin").
 */
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
