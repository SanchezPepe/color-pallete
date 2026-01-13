// Color Palette Picker Application

class ColorPalette {
    constructor() {
        this.colors = [];
        this.container = document.getElementById('palette-container');
        this.toast = document.getElementById('toast');
        this.modal = document.getElementById('export-modal');
        this.exportOutput = document.getElementById('export-output');
        this.categorySelect = document.getElementById('category-select');
        this.presetSelect = document.getElementById('preset-select');
        this.currentExportFormat = 'hex';
        this.draggedElement = null;

        // Preset color palettes
        this.presetPalettes = {
            // Design Systems
            material: ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3'],
            tailwind: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            bootstrap: ['#0D6EFD', '#6610F2', '#D63384', '#FD7E14', '#20C997'],
            // Editor Themes
            nord: ['#5E81AC', '#81A1C1', '#88C0D0', '#8FBCBB', '#B48EAD'],
            dracula: ['#FF79C6', '#BD93F9', '#8BE9FD', '#50FA7B', '#FFB86C'],
            monokai: ['#F92672', '#FD971F', '#E6DB74', '#A6E22E', '#66D9EF'],
            solarized: ['#B58900', '#CB4B16', '#DC322F', '#D33682', '#6C71C4'],
            // Nature
            sunset: ['#FF6B6B', '#FFA06D', '#FFD93D', '#C9B037', '#6BCB77'],
            ocean: ['#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'],
            forest: ['#2D5A27', '#4A7C59', '#6B8E23', '#8FBC8F', '#A8D5BA'],
            autumn: ['#8B4513', '#CD853F', '#DAA520', '#B8860B', '#D2691E'],
            // Trendy
            synthwave: ['#FF00FF', '#00FFFF', '#FF1493', '#9400D3', '#FF6347'],
            coffee: ['#4A3728', '#6F4E37', '#A67B5B', '#C4A484', '#E8D4B8'],
            candy: ['#FF69B4', '#FF85A2', '#FFA3B5', '#FFB6C1', '#FFC0CB']
        };

        // Category color generation rules (HSL ranges)
        this.categoryRules = {
            random: null, // Uses pure random generation
            professional: {
                hueRanges: [[200, 230], [0, 20], [220, 250]], // Blues, burgundy, navy
                saturation: [20, 45],
                lightness: [25, 55]
            },
            vibrant: {
                hueRanges: [[0, 360]], // Full spectrum
                saturation: [70, 100],
                lightness: [45, 60]
            },
            pastel: {
                hueRanges: [[0, 360]], // Full spectrum
                saturation: [40, 70],
                lightness: [75, 90]
            },
            warm: {
                hueRanges: [[0, 60], [340, 360]], // Reds, oranges, yellows
                saturation: [50, 85],
                lightness: [40, 65]
            },
            cool: {
                hueRanges: [[180, 280]], // Cyan, blue, purple
                saturation: [40, 75],
                lightness: [35, 60]
            },
            earthy: {
                hueRanges: [[20, 50], [80, 140]], // Browns, greens, olives
                saturation: [25, 55],
                lightness: [30, 55]
            },
            neon: {
                hueRanges: [[280, 320], [160, 190], [50, 70]], // Magenta, cyan, lime
                saturation: [90, 100],
                lightness: [50, 65]
            }
        };

        this.init();
    }

    init() {
        // Generate initial palette
        this.generatePalette(5);

        // Bind event listeners
        this.bindEvents();

        // Load saved palette from localStorage if exists
        this.loadFromStorage();
    }

    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.generateNewColors();
            }
        });

        // Toolbar buttons
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateNewColors();
        });

        document.getElementById('add-color-btn').addEventListener('click', () => {
            this.addColor();
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            this.showExportModal();
        });

        // Preset palette selector
        this.presetSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.applyPreset(e.target.value);
                e.target.value = ''; // Reset to "Presets" label
            }
        });

        // Modal events
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideExportModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideExportModal();
            }
        });

        // Export format buttons
        document.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.export-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentExportFormat = btn.dataset.format;
                this.updateExportOutput();
            });
        });

        document.getElementById('copy-export').addEventListener('click', () => {
            this.copyExportOutput();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideExportModal();
            }
        });
    }

    generatePalette(count) {
        this.colors = [];
        for (let i = 0; i < count; i++) {
            this.colors.push({
                hex: this.generateRandomColor(),
                locked: false,
                id: this.generateId()
            });
        }
        this.render();
        this.saveToStorage();
    }

    generateNewColors() {
        this.colors = this.colors.map(color => {
            if (color.locked) {
                return color;
            }
            return {
                ...color,
                hex: this.generateRandomColor()
            };
        });
        this.render();
        this.saveToStorage();
    }

    applyPreset(presetName) {
        const preset = this.presetPalettes[presetName];
        if (!preset) return;

        this.colors = preset.map(hex => ({
            hex: hex.toUpperCase(),
            locked: false,
            id: this.generateId()
        }));
        this.render();
        this.saveToStorage();
        this.showToast(`Applied ${presetName} palette`);
    }

    generateRandomColor() {
        const category = this.categorySelect?.value || 'random';
        const rules = this.categoryRules[category];

        if (!rules) {
            // Pure random generation
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Category-based generation using HSL
        const hueRange = rules.hueRanges[Math.floor(Math.random() * rules.hueRanges.length)];
        const h = this.randomInRange(hueRange[0], hueRange[1]);
        const s = this.randomInRange(rules.saturation[0], rules.saturation[1]);
        const l = this.randomInRange(rules.lightness[0], rules.lightness[1]);

        return this.hslToHex(h, s, l);
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else if (h >= 300 && h < 360) {
            r = c; g = 0; b = x;
        }

        const toHex = (n) => {
            const hex = Math.round((n + m) * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    addColor() {
        if (this.colors.length >= 10) {
            this.showToast('Maximum 10 colors allowed');
            return;
        }
        this.colors.push({
            hex: this.generateRandomColor(),
            locked: false,
            id: this.generateId()
        });
        this.render();
        this.saveToStorage();
    }

    removeColor(id) {
        if (this.colors.length <= 2) {
            this.showToast('Minimum 2 colors required');
            return;
        }
        this.colors = this.colors.filter(c => c.id !== id);
        this.render();
        this.saveToStorage();
    }

    toggleLock(id) {
        this.colors = this.colors.map(color => {
            if (color.id === id) {
                return { ...color, locked: !color.locked };
            }
            return color;
        });
        this.render();
        this.saveToStorage();
    }

    updateColor(id, hex) {
        this.colors = this.colors.map(color => {
            if (color.id === id) {
                return { ...color, hex: hex.toUpperCase() };
            }
            return color;
        });
        this.render();
        this.saveToStorage();
    }

    copyColor(hex) {
        navigator.clipboard.writeText(hex).then(() => {
            this.showToast(`Copied ${hex}`);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = hex;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast(`Copied ${hex}`);
        });
    }

    getContrastColor(hex) {
        // Remove # if present
        const color = hex.replace('#', '');

        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
    }

    getColorName(hex) {
        // Simple color name approximation based on hue
        const color = hex.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        // Convert to HSL
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const l = (max + min) / 2;
        const d = max - min;

        if (d === 0) {
            if (l < 0.2) return 'Black';
            if (l > 0.8) return 'White';
            return 'Gray';
        }

        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        let h;
        if (max === rNorm) {
            h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        } else if (max === gNorm) {
            h = ((bNorm - rNorm) / d + 2) / 6;
        } else {
            h = ((rNorm - gNorm) / d + 4) / 6;
        }

        const hue = h * 360;

        // Determine color name based on hue, saturation, and lightness
        if (s < 0.1) {
            if (l < 0.2) return 'Black';
            if (l > 0.8) return 'White';
            return 'Gray';
        }

        if (l < 0.2) return 'Dark';
        if (l > 0.85) return 'Light';

        // Color names based on hue
        if (hue < 15) return l < 0.5 ? 'Maroon' : 'Red';
        if (hue < 45) return l < 0.5 ? 'Brown' : 'Orange';
        if (hue < 70) return l < 0.5 ? 'Olive' : 'Yellow';
        if (hue < 150) return l < 0.5 ? 'Forest' : 'Green';
        if (hue < 190) return l < 0.5 ? 'Teal' : 'Cyan';
        if (hue < 260) return l < 0.5 ? 'Navy' : 'Blue';
        if (hue < 290) return l < 0.5 ? 'Indigo' : 'Purple';
        if (hue < 330) return l < 0.5 ? 'Plum' : 'Pink';
        return l < 0.5 ? 'Maroon' : 'Red';
    }

    render() {
        this.container.innerHTML = '';

        this.colors.forEach((color, index) => {
            const colorBar = document.createElement('div');
            colorBar.className = `color-bar${color.locked ? ' locked' : ''}`;
            colorBar.style.backgroundColor = color.hex;
            colorBar.dataset.id = color.id;
            colorBar.draggable = true;

            const textColor = this.getContrastColor(color.hex);
            colorBar.style.color = textColor;

            colorBar.innerHTML = `
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="color-actions">
                    <button class="color-action-btn copy-btn" title="Copy hex code">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="color-action-btn lock-btn ${color.locked ? 'locked' : ''}" title="${color.locked ? 'Unlock' : 'Lock'} color">
                        <i class="fas fa-${color.locked ? 'lock' : 'lock-open'}"></i>
                    </button>
                    <button class="color-action-btn delete-btn" title="Remove color">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="color-picker-wrapper">
                    <input type="color" class="color-picker" value="${color.hex}" title="Pick a color">
                </div>
                <div class="color-info">
                    <div class="color-hex">${color.hex.replace('#', '')}</div>
                    <div class="color-name">${this.getColorName(color.hex)}</div>
                </div>
            `;

            // Event listeners for this color bar
            colorBar.querySelector('.copy-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyColor(color.hex);
            });

            colorBar.querySelector('.lock-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLock(color.id);
            });

            colorBar.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeColor(color.id);
            });

            colorBar.querySelector('.color-picker').addEventListener('input', (e) => {
                this.updateColor(color.id, e.target.value);
            });

            colorBar.querySelector('.color-picker').addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Click on color bar to copy
            colorBar.addEventListener('click', () => {
                this.copyColor(color.hex);
            });

            // Drag and drop
            colorBar.addEventListener('dragstart', (e) => {
                this.draggedElement = colorBar;
                colorBar.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            colorBar.addEventListener('dragend', () => {
                colorBar.classList.remove('dragging');
                this.draggedElement = null;
            });

            colorBar.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            colorBar.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedElement && this.draggedElement !== colorBar) {
                    const draggedId = this.draggedElement.dataset.id;
                    const targetId = colorBar.dataset.id;
                    this.swapColors(draggedId, targetId);
                }
            });

            this.container.appendChild(colorBar);
        });
    }

    swapColors(id1, id2) {
        const index1 = this.colors.findIndex(c => c.id === id1);
        const index2 = this.colors.findIndex(c => c.id === id2);

        if (index1 !== -1 && index2 !== -1) {
            [this.colors[index1], this.colors[index2]] = [this.colors[index2], this.colors[index1]];
            this.render();
            this.saveToStorage();
        }
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }

    showExportModal() {
        // Set first format as active by default
        document.querySelector('.export-option').classList.add('active');
        this.currentExportFormat = 'hex';
        this.updateExportOutput();
        this.modal.classList.add('show');
    }

    hideExportModal() {
        this.modal.classList.remove('show');
    }

    updateExportOutput() {
        let output = '';

        switch (this.currentExportFormat) {
            case 'hex':
                output = this.colors.map(c => c.hex).join('\n');
                break;
            case 'rgb':
                output = this.colors.map(c => {
                    const hex = c.hex.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    return `rgb(${r}, ${g}, ${b})`;
                }).join('\n');
                break;
            case 'css':
                output = `:root {\n${this.colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
                break;
            case 'json':
                output = JSON.stringify({
                    palette: this.colors.map(c => ({
                        hex: c.hex,
                        name: this.getColorName(c.hex)
                    }))
                }, null, 2);
                break;
        }

        this.exportOutput.value = output;
    }

    copyExportOutput() {
        this.exportOutput.select();
        navigator.clipboard.writeText(this.exportOutput.value).then(() => {
            this.showToast('Copied to clipboard');
        });
    }

    saveToStorage() {
        localStorage.setItem('colorPalette', JSON.stringify(this.colors));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('colorPalette');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.colors = parsed;
                    this.render();
                }
            } catch (e) {
                console.error('Failed to load saved palette');
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ColorPalette();
});
