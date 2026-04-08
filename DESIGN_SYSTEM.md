# SafeDeal Design System — Wildberries Style

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#E6007E` | Main brand, buttons, prices, highlights, active states |
| Primary Hover | `#C5006B` | Hover state for primary |
| Secondary/Orange | `#FF6B2B` | Accent, special elements |
| Blue Accent | `#0075FF` | Search button, trust icons, interactive elements |
| Blue Hover | `#005FCC` | Hover for blue accent |
| Background | `#FFFFFF` | Main page background |
| Card BG | `#FFFFFF` | Card surfaces |
| Input BG | `#F8FAFC` | Input backgrounds, secondary surfaces |
| Text Primary | `#0F172A` | Headings, body text |
| Text Secondary | `#64748B` | Muted body text |
| Text Muted | `#94A3B8` | Captions, tertiary text |
| Border | `#E2E8F0` | Light borders |
| Navbar BG | `#212121` | Main navbar |
| Categories BG | `#282829` | Categories sub-bar |
| Footer BG | `#1C1C1D` | Footer background |
| Success | `#10b981` / `#22c55e` | Success, verified |
| Danger | `#ef4444` | Error states, red badges |
| Warning | `#f59e0b` | Warnings, amber |
| Stars | `#FFB400` | Rating stars |

## Typography

- **Primary Font:** Manrope (300, 400, 500, 600, 700, 800)
- **Secondary Font:** Inter (navbar accents, footer)
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### Size Scale
- Hero Title: 36px / weight 900 / letter-spacing -0.6px
- Section Title: 19px / weight 800
- Card Title: 13px / weight 600
- Body: 13-14px / weight 400-500
- Small: 10-11px / weight 400-600
- Price Large: 16px / weight 800
- Price Small: 11px / weight 700

## Navbar

- Height: `60px`, sticky top
- Background: `#212121` with `backdrop-filter: blur(24px)`
- Logo: "Safe" (white) + "Deal" (#E6007E), 19px, weight 700
- Search: White bg, border-radius 9px, blue submit button (#0075FF)
- Icons: 36x36px, color rgba(255,255,255,0.75), hover bg #2C2C2C
- Categories bar: bg #282829, horizontal scroll, 12px font

## Footer

- Background: `#1C1C1D`
- Trust bar icons: `#0075FF` (blue)
- Grid: 1.6fr 1fr 1fr 1fr
- Social icons: 32x32, bg #282829, border rgba(255,255,255,0.08)
- Payment chips: bg #282829, 11px
- Link color: rgba(255,255,255,0.5)
- Bottom text: #3A3A3C

## Product Card

- Border-radius: `12px`
- Image aspect ratio: `3/4`
- Image border-radius: `12px`
- Favorite: #E6007E outline heart, drop-shadow, 28x28
- Discount badge: bottom-left, bg #E6007E, white text
- Title: 13px, weight 600, 2-line clamp
- Category: 10px, uppercase, color #E6007E
- Price: 16px, weight 800, color #E6007E, with wallet icon
- Buy button: full width, bg #E6007E, 12px, weight 700, radius 8px
- Hover: shadow 0 4px 20px rgba(0,0,0,0.08), translateY(-2px)

## Product Grid

- Desktop (1440px+): `repeat(6, 1fr)`, gap 12px
- 1200px: `repeat(5, 1fr)`
- 1000px: `repeat(4, 1fr)`
- 768px: `repeat(3, 1fr)`, gap 10px
- 500px: `repeat(2, 1fr)`

## Container

- Max-width: `1440px`
- Padding: 24px (desktop), 16px (tablet), 10px (mobile)

## Buttons

- Primary: bg #E6007E, color #fff, radius 10px, weight 700
- Outline: bg #fff, border 2px solid #E6007E, color #E6007E
- Hover: primary darkens to #C5006B, outline gets bg #fce4ec
- Tab/pill: bg #F1F5F9, color #64748B, active: bg #E6007E color #fff

## Feature Cards

- Display: flex, gap 12px
- Padding: 14px 16px
- Background: #F8FAFC
- Border-radius: 12px
- Icon: 38x38, bg rgba(230,0,126,0.08), radius 9px, color #E6007E

## Category Card Gradients (12 categories)

1. Videojuegos: `linear-gradient(135deg, #0f0c29, #302b63)` / accent #9b8df8
2. Gift Cards: `linear-gradient(135deg, #1c1c3a, #2d1b5e)` / accent #c77dff
3. Software: `linear-gradient(135deg, #0a1628, #0d2e4a)` / accent #4ea8de
4. Streaming: `linear-gradient(135deg, #1a0533, #3b0764)` / accent #d084ff
5. IA/AI: `linear-gradient(135deg, #050510, #0d0d30)` / accent #4cc9f0
6. Trading: `linear-gradient(135deg, #071410, #0f3320)` / accent #52b788
7. Desarrollo: `linear-gradient(135deg, #0d1117, #161b22)` / accent #79c0ff
8. Cripto: `linear-gradient(135deg, #1a0a00, #3d1c00)` / accent #f7931a
9. Cursos: `linear-gradient(135deg, #080830, #12125e)` / accent #6495ed
10. Cuentas: `linear-gradient(135deg, #0d1b2a, #162742)` / accent #5cabf2
11. Servicios: `linear-gradient(135deg, #141414, #2d2d3a)` / accent #aaaaaa
12. Productos Digitales: `linear-gradient(135deg, #111827, #1f2937)` / accent #9ca3af

## Shadows

- Subtle: `0 1px 3px rgba(0,0,0,0.08)`
- Card hover: `0 4px 20px rgba(0,0,0,0.08)`
- Medium: `0 12px 40px rgba(0,0,0,0.18)`
- Modal: `0 24px 80px rgba(0,0,0,0.45)`

## Border Radius Scale

- Small: 6px (badges, small elements)
- Medium: 8-10px (buttons, inputs, icons)
- Large: 12-14px (cards)
- XL: 16-22px (banners, modals, sections)
