// Color Palette Picker Application

class ColorPalette {
    constructor() {
        this.colors = [];
        this.container = document.getElementById('palette-container');
        this.toast = document.getElementById('toast');
        this.modal = document.getElementById('export-modal');
        this.exportOutput = document.getElementById('export-output');
        this.currentExportFormat = 'hex';
        this.draggedElement = null;

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

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
