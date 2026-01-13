# Visual Identity Toolkit - Implementation Plan

A comprehensive application for creating complete visual identities for projects, expanding on the existing color palette picker.

## Project Overview

**Vision**: An all-in-one visual identity creation platform with AI assistance that generates cohesive brand guidelines including colors, typography, spacing, components, and exportable design tokens.

**Target Users**: Developers, designers, indie hackers, and startups who need to quickly establish a consistent visual identity.

---

## Technology Stack

### Current Stack (to migrate from)
- Vanilla JavaScript
- Plain CSS
- No build tooling

### Proposed Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | **Next.js 14** (App Router) | SSR, API routes, excellent DX |
| Language | **TypeScript** | Type safety, better tooling |
| Styling | **Tailwind CSS** | Utility-first, design tokens |
| UI Components | **shadcn/ui** | Customizable, accessible |
| State | **Zustand** | Lightweight, simple API |
| AI | **Anthropic Claude API** | Conversational assistant |
| Icons | **Lucide React** | Modern, consistent icons |
| Export | **JSZip** | Generate downloadable packages |
| Persistence | **localStorage + optional Supabase** | Free tier, future auth |

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Visual Identity Toolkit                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐ │
│  │   Colors    │  │ Typography  │  │   Spacing   │  │ Shadows│ │
│  │   Tool      │  │   Tool      │  │   Tool      │  │  Tool  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐ │
│  │ Components  │  │   Borders   │  │  Gradients  │  │ Motion │ │
│  │   Preview   │  │   Radius    │  │   Tool      │  │  Tool  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      AI Brand Assistant                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Conversational interface for generating complete identities ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                      Export & Preview                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │   CSS    │  │ Tailwind │  │   JSON   │  │ Figma Variables  ││
│  │ Tokens   │  │  Config  │  │  Tokens  │  │    (future)      ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Existing Color Palette Picker (To Migrate)

The current application is a fully functional vanilla JavaScript color palette picker. All features will be migrated to the new React/Next.js architecture.

### Current Features (All Will Be Preserved)

| Feature | Description | Status |
|---------|-------------|--------|
| **Random Generation** | Generate random color palettes with spacebar | Migrate |
| **Category-Based Generation** | 8 categories: Random, Professional, Vibrant, Pastel, Warm, Cool, Earthy, Neon | Migrate |
| **Lock/Unlock Colors** | Lock individual colors during regeneration | Migrate |
| **Preset Palettes** | 13 presets: Material, Tailwind, Bootstrap, Nord, Dracula, Monokai, Solarized, Sunset, Ocean, Forest, Autumn, Synthwave, Coffee, Candy | Migrate |
| **Drag & Drop Reorder** | Reorder colors by dragging | Migrate |
| **Add/Remove Colors** | Adjust palette size (2-10 colors) | Migrate |
| **Color Picker Edit** | Click to edit individual colors | Migrate |
| **Copy to Clipboard** | Click color bar to copy hex | Migrate |
| **Color Names** | Auto-generated approximate color names | Migrate |
| **Contrast Text** | Auto white/dark text based on luminance | Migrate |
| **Export Formats** | HEX, RGB, CSS Variables, JSON | Migrate & Expand |
| **localStorage Persistence** | Save/load palettes | Migrate |
| **Keyboard Shortcuts** | Spacebar to regenerate | Migrate & Expand |
| **Toast Notifications** | Feedback on copy/actions | Migrate |
| **Responsive Design** | Mobile/tablet support | Migrate |

### Current Code Structure

```
Current Files:
├── index.html      → Migrate to Next.js pages/components
├── script.js       → Refactor to React components + hooks
│   └── ColorPalette class with:
│       ├── generatePalette()      → useColorPalette hook
│       ├── generateRandomColor()  → lib/colors.ts
│       ├── hslToHex()            → lib/colors.ts
│       ├── getContrastColor()    → lib/colors.ts
│       ├── getColorName()        → lib/colors.ts
│       ├── render()              → React components
│       ├── updateExportOutput()  → lib/export.ts
│       └── saveToStorage()       → lib/storage.ts
└── styles.css      → Tailwind CSS classes
```

### Category Rules (HSL-Based)

These will be migrated to `lib/colors.ts`:

```typescript
const categoryRules = {
  random: { hue: [0, 360], saturation: [40, 90], lightness: [35, 65] },
  professional: { hue: [200, 240], saturation: [30, 60], lightness: [25, 55] },
  vibrant: { hue: [0, 360], saturation: [80, 100], lightness: [45, 60] },
  pastel: { hue: [0, 360], saturation: [40, 70], lightness: [75, 90] },
  warm: { hue: [0, 60], saturation: [60, 90], lightness: [40, 60] },
  cool: { hue: [180, 270], saturation: [50, 80], lightness: [40, 60] },
  earthy: { hue: [20, 50], saturation: [30, 60], lightness: [30, 50] },
  neon: { hue: [280, 340], saturation: [90, 100], lightness: [50, 60] },
};
```

### Preset Palettes (All 13)

These will be migrated as constants:

```typescript
const presetPalettes = {
  // Design Systems
  material: ['#F44336', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50'],
  tailwind: ['#0EA5E9', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
  bootstrap: ['#0D6EFD', '#6610F2', '#D63384', '#FFC107', '#198754'],

  // Editor Themes
  nord: ['#5E81AC', '#81A1C1', '#88C0D0', '#8FBCBB', '#A3BE8C'],
  dracula: ['#FF79C6', '#BD93F9', '#8BE9FD', '#50FA7B', '#FFB86C'],
  monokai: ['#F92672', '#A6E22E', '#FD971F', '#66D9EF', '#AE81FF'],
  solarized: ['#B58900', '#CB4B16', '#DC322F', '#D33682', '#6C71C4'],

  // Nature
  sunset: ['#FF6B6B', '#FFA07A', '#FFD93D', '#C9B037', '#6C5B7B'],
  ocean: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A'],
  forest: ['#2D5A27', '#3E8914', '#52B788', '#95D5B2', '#D8F3DC'],
  autumn: ['#9B2335', '#D35400', '#F39C12', '#E67E22', '#8E44AD'],

  // Trendy
  synthwave: ['#FF00FF', '#00FFFF', '#FF1493', '#8A2BE2', '#FFD700'],
  coffee: ['#4A2C2A', '#6F4E37', '#A67B5B', '#C4A484', '#ECE0D1'],
  candy: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
};
```

---

## Tools & Features

### 1. Color Tool (Enhanced)
**Status**: Migrate existing functionality + expand

**Features**:
- [x] Generate random palettes (existing - from current app)
- [x] Category-based generation (existing - 8 categories)
- [x] Lock/unlock colors (existing)
- [x] Preset palettes (existing - 13 presets)
- [x] Drag & drop reorder (existing)
- [x] Add/remove colors (existing)
- [x] Color picker edit (existing)
- [x] Copy to clipboard (existing)
- [x] Export HEX/RGB/CSS/JSON (existing)
- [ ] **Color roles**: Primary, secondary, accent, neutral, success, warning, error
- [ ] **Auto-generate shades**: 50-950 scale per color (like Tailwind)
- [ ] **Contrast checker**: WCAG AA/AAA compliance visualization
- [ ] **Color blindness simulator**: Preview for different vision types
- [ ] **Extract from image**: Upload image to extract palette
- [ ] **Color harmony modes**: Complementary, triadic, split-complementary, analogous

**Data Model**:
```typescript
interface ColorPalette {
  id: string;
  name: string;
  colors: {
    role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
    baseHex: string;
    shades: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;
  }[];
}
```

### 2. Typography Tool
**Purpose**: Select and pair fonts with size/weight scales

**Features**:
- [ ] **Font browser**: Search Google Fonts with live preview
- [ ] **Font pairing suggestions**: AI-recommended pairs (heading + body)
- [ ] **Type scale generator**: Major second, minor third, major third, perfect fourth, etc.
- [ ] **Font weights**: Select available weights per font
- [ ] **Line height calculator**: Optimal line-height per size
- [ ] **Letter spacing suggestions**: Based on font characteristics
- [ ] **Preview panel**: See fonts in realistic context (headings, paragraphs, UI)

**Data Model**:
```typescript
interface Typography {
  fonts: {
    role: 'heading' | 'body' | 'mono' | 'accent';
    family: string;
    weights: number[];
    fallback: string;
  }[];
  scale: {
    ratio: number; // e.g., 1.25 for major third
    baseSize: number; // e.g., 16
    sizes: {
      name: string; // 'xs', 'sm', 'base', 'lg', 'xl', '2xl', etc.
      size: number;
      lineHeight: number;
      letterSpacing: number;
    }[];
  };
}
```

### 3. Spacing & Layout Tool
**Purpose**: Define consistent spacing system

**Features**:
- [ ] **Spacing scale generator**: 4px base, 8px base, or custom
- [ ] **Visual spacing preview**: Interactive boxes showing scale
- [ ] **Container widths**: max-w presets
- [ ] **Breakpoints**: Define responsive breakpoints
- [ ] **Grid system**: Column count, gap sizing

**Data Model**:
```typescript
interface Spacing {
  baseUnit: number; // 4 or 8
  scale: Record<string, number>; // { '0': 0, '1': 4, '2': 8, ... }
  containers: Record<string, number>; // { 'sm': 640, 'md': 768, ... }
  breakpoints: Record<string, number>;
}
```

### 4. Border & Radius Tool
**Purpose**: Define border styles and corner radii

**Features**:
- [ ] **Radius scale**: none, sm, md, lg, xl, 2xl, full
- [ ] **Border widths**: 0, 1, 2, 4, 8
- [ ] **Border styles**: Solid, dashed, dotted
- [ ] **Visual preview**: Cards, buttons, inputs with applied styles

**Data Model**:
```typescript
interface Borders {
  radii: Record<string, number>; // { 'sm': 2, 'md': 4, 'lg': 8, ... }
  widths: number[];
  defaultRadius: string;
}
```

### 5. Shadow Tool
**Purpose**: Create consistent elevation system

**Features**:
- [ ] **Shadow scale**: sm, md, lg, xl, 2xl
- [ ] **Custom shadow builder**: Offset, blur, spread, color
- [ ] **Elevation preview**: Cards at different levels
- [ ] **Dark mode shadows**: Inverted/adjusted for dark backgrounds

**Data Model**:
```typescript
interface Shadows {
  scale: {
    name: string;
    value: string; // CSS shadow value
  }[];
}
```

### 6. Gradient Tool
**Purpose**: Create on-brand gradients

**Features**:
- [ ] **Gradient builder**: Start/end colors, direction, type (linear/radial)
- [ ] **Generate from palette**: Auto-create gradients from existing colors
- [ ] **Gradient presets**: Popular gradient patterns
- [ ] **CSS/Tailwind export**: Ready-to-use code

### 7. Motion/Animation Tool
**Purpose**: Define consistent animation patterns

**Features**:
- [ ] **Duration scale**: fast, normal, slow, slower
- [ ] **Easing presets**: ease-in, ease-out, ease-in-out, spring
- [ ] **Animation preview**: Interactive demos
- [ ] **Transition builder**: Property, duration, easing combos

**Data Model**:
```typescript
interface Motion {
  durations: Record<string, number>; // ms
  easings: Record<string, string>; // CSS timing functions
}
```

### 8. Component Preview
**Purpose**: See design tokens applied to real UI components

**Features**:
- [ ] **Live component library**: Buttons, inputs, cards, badges, alerts
- [ ] **Theme toggle**: Light/dark mode preview
- [ ] **Responsive preview**: Mobile, tablet, desktop
- [ ] **Code snippets**: Copy component code with applied tokens

---

## AI Brand Assistant

### Purpose
An intelligent assistant that guides users through creating a complete visual identity through conversation.

### Conversation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Project Context                                               │
│    "What type of project are you building?"                     │
│    → SaaS, Mobile App, E-commerce, Portfolio, Blog, etc.        │
├─────────────────────────────────────────────────────────────────┤
│ 2. Brand Personality                                             │
│    "How would you describe your brand's personality?"           │
│    → Professional, Playful, Minimal, Bold, Elegant, etc.        │
├─────────────────────────────────────────────────────────────────┤
│ 3. Industry/Niche                                                │
│    "What industry or niche is this for?"                        │
│    → Fintech, Healthcare, Gaming, Education, etc.               │
├─────────────────────────────────────────────────────────────────┤
│ 4. Target Audience                                               │
│    "Who is your target audience?"                               │
│    → Age, demographics, preferences                              │
├─────────────────────────────────────────────────────────────────┤
│ 5. Existing Preferences                                          │
│    "Do you have any colors, fonts, or styles in mind?"          │
│    → Starting points or constraints                              │
├─────────────────────────────────────────────────────────────────┤
│ 6. Inspiration                                                   │
│    "Any brands or websites you admire?"                         │
│    → Reference points                                            │
├─────────────────────────────────────────────────────────────────┤
│ 7. Generate Complete Identity                                    │
│    AI generates cohesive:                                        │
│    - Color palette with all roles                                │
│    - Font pairings                                               │
│    - Spacing & radius system                                     │
│    - Shadow scale                                                │
│    - Sample components                                           │
└─────────────────────────────────────────────────────────────────┘
```

### AI Features
- [ ] **Conversational UI**: Chat interface with markdown support
- [ ] **Contextual suggestions**: Based on industry/personality
- [ ] **Iterative refinement**: "Make it more vibrant" / "Try warmer colors"
- [ ] **Explanation**: AI explains why certain choices work together
- [ ] **Quick presets**: "Create a professional fintech identity"
- [ ] **Comparison mode**: Generate 2-3 variations to choose from

### API Integration
```typescript
// API route: /api/assistant
interface AssistantRequest {
  messages: Message[];
  currentIdentity?: VisualIdentity;
}

interface AssistantResponse {
  message: string;
  suggestions?: Partial<VisualIdentity>;
  questions?: string[];
}
```

---

## Export System

### Export Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| **CSS Variables** | `:root { --color-primary: ... }` | Any project |
| **Tailwind Config** | Full `tailwind.config.js` | Tailwind projects |
| **JSON Tokens** | Design token JSON | Token-based systems |
| **SCSS Variables** | `$color-primary: ...` | SCSS projects |
| **Style Dictionary** | Token format for SD | Enterprise design systems |
| **Figma Variables** | Figma API format | Design handoff |

### Export Package Contents
```
visual-identity-export/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   ├── shadows.json
│   └── motion.json
├── css/
│   ├── variables.css
│   └── utilities.css
├── tailwind/
│   └── tailwind.config.js
├── scss/
│   └── _variables.scss
├── preview/
│   └── index.html (standalone preview)
└── README.md (usage instructions)
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (dashboard)
│   ├── colors/
│   │   └── page.tsx
│   ├── typography/
│   │   └── page.tsx
│   ├── spacing/
│   │   └── page.tsx
│   ├── shadows/
│   │   └── page.tsx
│   ├── gradients/
│   │   └── page.tsx
│   ├── motion/
│   │   └── page.tsx
│   ├── preview/
│   │   └── page.tsx
│   ├── assistant/
│   │   └── page.tsx
│   ├── export/
│   │   └── page.tsx
│   └── api/
│       ├── assistant/
│       │   └── route.ts
│       └── fonts/
│           └── route.ts
├── components/
│   ├── ui/ (shadcn components)
│   ├── tools/
│   │   ├── ColorPicker.tsx
│   │   ├── ColorPalette.tsx
│   │   ├── ShadeGenerator.tsx
│   │   ├── FontBrowser.tsx
│   │   ├── TypeScalePreview.tsx
│   │   ├── SpacingScale.tsx
│   │   ├── ShadowBuilder.tsx
│   │   ├── GradientBuilder.tsx
│   │   └── MotionPreview.tsx
│   ├── preview/
│   │   ├── ComponentPreview.tsx
│   │   ├── ButtonPreview.tsx
│   │   ├── InputPreview.tsx
│   │   └── CardPreview.tsx
│   ├── assistant/
│   │   ├── ChatInterface.tsx
│   │   ├── Message.tsx
│   │   └── SuggestionCard.tsx
│   ├── export/
│   │   ├── ExportModal.tsx
│   │   └── FormatSelector.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── ThemeToggle.tsx
├── lib/
│   ├── colors.ts (color utilities)
│   ├── typography.ts (font/scale utilities)
│   ├── export.ts (export generators)
│   ├── ai.ts (AI client)
│   └── storage.ts (persistence)
├── store/
│   └── identity.ts (Zustand store)
├── types/
│   └── index.ts (TypeScript interfaces)
└── hooks/
    ├── useColorPalette.ts
    ├── useTypography.ts
    └── useExport.ts
```

---

## Implementation Phases

### Phase 1: Foundation & Migration
**Scope**: Set up new project, migrate color picker
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up project structure and routing
- [ ] Create Zustand store for visual identity state
- [ ] Migrate existing color picker functionality
  - [ ] Port `generateRandomColor()` with HSL logic
  - [ ] Port `hslToHex()` conversion
  - [ ] Port `getContrastColor()` for text visibility
  - [ ] Port `getColorName()` approximation
  - [ ] Port category-based generation (8 categories)
  - [ ] Port all 13 preset palettes
  - [ ] Port lock/unlock functionality
  - [ ] Port drag & drop reorder
  - [ ] Port add/remove colors (2-10 limit)
  - [ ] Port color picker edit
  - [ ] Port copy to clipboard with toast
  - [ ] Port localStorage persistence
  - [ ] Port keyboard shortcuts (spacebar)
- [ ] Add shade generation for colors (50-950 scale)
- [ ] Implement color roles (primary, secondary, accent, neutral, success, warning, error)
- [ ] Add basic export (CSS variables)
- [ ] Create app shell with sidebar navigation

**Deliverables**:
- [ ] Working color tool with all existing features
- [ ] Basic app shell with navigation
- [ ] Enhanced features (shades, roles)

---

### Phase 2: Typography & Spacing
**Scope**: Add typography and spacing tools
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Typography Tool
  - [ ] Integrate Google Fonts API
  - [ ] Build font browser with search functionality
  - [ ] Add live font preview
  - [ ] Implement type scale generator (ratios: minor second through perfect fifth)
  - [ ] Create font pairing suggestions
  - [ ] Add font weight selector
  - [ ] Calculate optimal line-height per size
  - [ ] Add letter-spacing recommendations
  - [ ] Build typography preview panel
- [ ] Spacing Tool
  - [ ] Build spacing scale generator (4px or 8px base)
  - [ ] Create visual spacing preview (interactive boxes)
  - [ ] Add container width configuration
  - [ ] Define responsive breakpoints
  - [ ] Add grid system settings (columns, gaps)

**Deliverables**:
- [ ] Functional typography tool with Google Fonts
- [ ] Functional spacing tool with visual preview

---

### Phase 3: Visual Polish Tools
**Scope**: Add shadows, borders, gradients, motion
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Shadow Tool
  - [ ] Build shadow scale generator (sm, md, lg, xl, 2xl)
  - [ ] Create custom shadow builder (offset, blur, spread, color)
  - [ ] Add elevation preview with cards
  - [ ] Support dark mode shadow adjustments
- [ ] Border & Radius Tool
  - [ ] Build radius scale (none through full)
  - [ ] Add border width options (0, 1, 2, 4, 8)
  - [ ] Support border style variants
  - [ ] Create visual preview with shapes
- [ ] Gradient Tool
  - [ ] Build gradient creator (linear/radial)
  - [ ] Auto-generate gradients from palette colors
  - [ ] Add gradient presets
  - [ ] Export to CSS/Tailwind
- [ ] Motion Tool
  - [ ] Define duration scale (fast, normal, slow)
  - [ ] Add easing presets
  - [ ] Create interactive animation preview
  - [ ] Build transition builder

**Deliverables**:
- [ ] Complete set of design token tools
- [ ] Visual previews for each tool

---

### Phase 4: Component Preview
**Scope**: Live component preview with applied tokens
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Build preview component system
  - [ ] Button component (all variants: primary, secondary, outline, ghost)
  - [ ] Input components (text, select, checkbox, radio)
  - [ ] Card component (with header, body, footer)
  - [ ] Alert/notification components
  - [ ] Badge components
  - [ ] Modal/dialog preview
- [ ] Add preview features
  - [ ] Responsive preview mode (mobile, tablet, desktop)
  - [ ] Theme toggle (light/dark mode)
  - [ ] Code snippet copy for each component
  - [ ] Side-by-side light/dark comparison

**Deliverables**:
- [ ] Interactive component preview page
- [ ] All common UI components styled with tokens

---

### Phase 5: AI Assistant
**Scope**: Conversational AI for identity generation
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Backend Setup
  - [ ] Set up Anthropic Claude API integration
  - [ ] Create `/api/assistant` route
  - [ ] Design system prompts for brand identity generation
  - [ ] Implement structured output parsing for identity tokens
- [ ] Frontend Chat Interface
  - [ ] Build chat UI component
  - [ ] Add message history display
  - [ ] Implement streaming responses
  - [ ] Add typing indicator
- [ ] AI Features
  - [ ] Implement conversation flow (project type → personality → industry → audience)
  - [ ] Add iterative refinement ("make it warmer", "more professional")
  - [ ] Create quick-start presets ("fintech identity", "playful startup")
  - [ ] Generate comparison mode (2-3 variations)
  - [ ] Add explanation feature (why choices work together)
- [ ] Integration
  - [ ] Apply AI suggestions to identity state
  - [ ] Allow partial application (just colors, just fonts)
  - [ ] Save conversation history

**Deliverables**:
- [ ] Working AI assistant
- [ ] Complete identity generation from conversation
- [ ] Iterative refinement capability

---

### Phase 6: Export & Polish
**Scope**: Complete export system and final polish
**Status**: [ ] Not Started / [ ] In Progress / [ ] Complete

**Tasks**:
- [ ] Export System
  - [ ] CSS Variables export (`:root { ... }`)
  - [ ] Tailwind config export (`tailwind.config.js`)
  - [ ] JSON tokens export
  - [ ] SCSS variables export
  - [ ] Style Dictionary format export
  - [ ] Build export modal with format selection
  - [ ] Create downloadable ZIP package with all formats
  - [ ] Add standalone HTML preview in export
- [ ] Project Management
  - [ ] Add project saving/loading
  - [ ] Implement multiple project support
  - [ ] Add project naming and metadata
- [ ] UX Polish
  - [ ] Implement undo/redo across all tools
  - [ ] Add comprehensive keyboard shortcuts
  - [ ] Polish transitions and animations
  - [ ] Ensure consistent styling across all tools
  - [ ] Add loading states and error handling
  - [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Documentation
  - [ ] Write user guide
  - [ ] Add contextual help tooltips
  - [ ] Create onboarding flow for new users

**Deliverables**:
- [ ] Production-ready application
- [ ] All export formats working
- [ ] Polished, accessible UI

---

## Data Persistence

### Local Storage Structure
```typescript
interface StoredIdentity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borders: Borders;
  shadows: Shadows;
  gradients: Gradient[];
  motion: Motion;
}
```

### Future: Cloud Sync (Optional)
- Supabase for auth and storage
- Share identities via link
- Team collaboration

---

## UI/UX Design Principles

1. **Tool-first navigation**: Each tool is a focused page
2. **Live preview**: Changes immediately visible
3. **Contextual help**: Tooltips explaining design concepts
4. **Keyboard friendly**: Spacebar to regenerate, shortcuts for common actions
5. **Dark mode native**: Both light and dark themes
6. **Mobile responsive**: Usable on tablet (primarily desktop app)
7. **Undo support**: Revert any change

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/assistant` | POST | AI chat completion |
| `/api/fonts` | GET | Proxy Google Fonts API |
| `/api/export` | POST | Generate export package |
| `/api/extract-colors` | POST | Extract palette from image |

---

## Environment Variables

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Google Fonts (optional, for extended API access)
GOOGLE_FONTS_API_KEY=...

# Future: Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Getting Started

```bash
# Create new Next.js project
npx create-next-app@latest visual-identity-toolkit --typescript --tailwind --app --src-dir

# Install dependencies
npm install zustand lucide-react jszip color

# Install shadcn/ui
npx shadcn@latest init

# Add shadcn components
npx shadcn@latest add button input card dialog tabs slider select

# Set up Anthropic SDK
npm install @anthropic-ai/sdk

# Run development server
npm run dev
```

---

## Success Metrics

- [ ] User can create a complete visual identity in under 5 minutes with AI
- [ ] Export generates valid, usable code for all formats
- [ ] Color accessibility (WCAG) warnings work correctly
- [ ] Typography previews render correctly with Google Fonts
- [ ] All tools work cohesively with shared state

---

## Future Enhancements

- **Logo suggestions**: AI-generated logo concepts
- **Icon set recommendations**: Match icons to brand style
- **Brand voice**: Copywriting tone suggestions
- **Figma plugin**: Sync tokens directly to Figma
- **VS Code extension**: Access tokens in editor
- **Team workspaces**: Collaborate on identities
- **Version history**: Track changes over time
- **Template library**: Start from industry-specific templates
