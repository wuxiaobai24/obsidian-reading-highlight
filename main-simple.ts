import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

interface ReadingHighlightSettings {
	highlightColor: string;
	enableMobileTouch: boolean;
	highlightOpacity: number;
	showHighlightButton: boolean;
	iconStyle: 'star' | 'pen' | 'highlighter' | 'brush';
}

const DEFAULT_SETTINGS: ReadingHighlightSettings = {
	highlightColor: '#ffeb3b',
	enableMobileTouch: true,
	highlightOpacity: 0.3,
	showHighlightButton: true,
	iconStyle: 'star'
};

export default class ReadingHighlightPlugin extends Plugin {
	settings: ReadingHighlightSettings;
	private isMobile: boolean = false;
	private activeHighlights: Map<string, HTMLElement> = new Map();

	async onload() {
		await this.loadSettings();
		this.detectMobile();

		console.log('Reading Highlight: 插件加载成功');

		// 简化：直接设置全局事件监听
		this.setupGlobalHighlighting();

		this.addSettingTab(new ReadingHighlightSettingTab(this.app, this));

		// 延迟设置，确保DOM完全加载
		setTimeout(() => {
			this.setupHighlightButton();
		}, 1000);
	}

	onunload() {
		this.clearAllHighlights();
	}

	detectMobile() {
		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	setupGlobalHighlighting() {
		// 全局鼠标事件监听
		document.addEventListener('mouseup', (e) => {
			if (!this.isMobile) {
				setTimeout(() => {
					const selection = window.getSelection();
					if (selection && selection.toString().trim().length > 0) {
						this.handleTextSelection(selection, e);
					}
				}, 100);
			}
		}, true);

		// 移动端触摸事件
		if (this.settings.enableMobileTouch && this.isMobile) {
			document.addEventListener('touchend', (e) => {
				setTimeout(() => {
					const selection = window.getSelection();
					if (selection && selection.toString().trim().length > 0) {
						this.handleTextSelection(selection, e);
					}
				}, 100);
			}, { passive: true, capture: true });
		}
	}

	setupMobileListeners() {
		document.addEventListener('touchend', (e) => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				this.handleTextSelection(selection, e);
			}
		}, { passive: true });
	}

	setupHighlighting(leaf: WorkspaceLeaf) {
		const view = leaf.view;
		const container = view.containerEl;

		console.log('Reading Highlight: 设置高亮功能', { container: container.className });

		container.addEventListener('mouseup', (e) => {
			console.log('Reading Highlight: mouseup 事件触发');
			if (!this.isMobile) {
				const selection = window.getSelection();
				console.log('Reading Highlight: 选中文本:', selection?.toString());
				if (selection && selection.toString().trim().length > 0) {
					this.handleTextSelection(selection, e);
				}
			}
		});

		if (this.settings.showHighlightButton) {
			this.setupHighlightButton(container);
		}
	}

	getHighlightIcon(): string {
		const { iconStyle } = this.settings;

		switch (iconStyle) {
			case 'pen':
				return `
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 19L19 12L22 15L15 22L12 19Z" fill="currentColor" opacity="0.8"/>
						<path d="M3 17L12 8L16 12L7 21L3 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M16 12L19 9L20.5 7.5C21.5 6.5 21.5 5 20.5 4L16 12Z" fill="currentColor" opacity="0.6"/>
					</svg>
				`;
			case 'highlighter':
				return `
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M2 12L5 9L15 19L12 22L2 12Z" fill="currentColor" opacity="0.8"/>
						<rect x="5" y="3" width="4" height="12" rx="2" transform="rotate(45 7 9)" fill="currentColor" opacity="0.6"/>
						<path d="M9 19L15 13L17 15L11 21L9 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					</svg>
				`;
			case 'brush':
				return `
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z" fill="currentColor" opacity="0.8"/>
						<path d="M12 6C10.5 6 9 7.5 9 9C9 10.5 10.5 12 12 12C13.5 12 15 10.5 15 9C15 7.5 13.5 6 12 6Z" fill="currentColor"/>
					</svg>
				`;
			case 'star':
			default:
				return `
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 2L14.09 8.26L21 9L15.5 14.74L16.18 22L12 19L7.82 22L8.5 14.74L3 9L9.91 8.26L12 2Z"
							  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 13L12 18L17 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					</svg>
				`;
		}
	}

	setupHighlightButton() {
		// 移除现有按钮
		const existingButton = document.querySelector('.reading-highlight-btn');
		if (existingButton) {
			existingButton.remove();
		}

		const button = document.createElement('button');
		button.className = 'reading-highlight-btn';
		button.innerHTML = this.getHighlightIcon();
		button.style.cssText = `
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 1000;
			width: 48px;
			height: 48px;
			border-radius: 16px;
			border: none;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			cursor: pointer;
			box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
			display: none;
			align-items: center;
			justify-content: center;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		`;

		button.addEventListener('click', () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				this.highlightSelection(selection);
			}
		});

		document.body.appendChild(button);

		// 全局选择变化监听
		document.addEventListener('selectionchange', () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				button.style.display = 'flex';
				button.classList.add('show');
				setTimeout(() => button.classList.remove('show'), 400);
			} else {
				button.style.display = 'none';
			}
		});
	}

	handleTextSelection(selection: Selection, event: Event) {
		// 直接高亮，简化逻辑
		if (this.settings.showHighlightButton) {
			// 如果显示按钮，让用户点击按钮高亮
			return;
		} else {
			// 如果不显示按钮，直接高亮
			this.highlightSelection(selection);
		}
	}

	showMobileHighlightMenu(selection: Selection, event: Event) {
		const existingMenu = document.querySelector('.reading-highlight-menu');
		if (existingMenu) {
			existingMenu.remove();
		}

		const menu = document.createElement('div');
		menu.className = 'reading-highlight-menu';
		menu.style.cssText = `
			position: fixed;
			background: white;
			border: 1px solid #ccc;
			border-radius: 8px;
			padding: 10px;
			box-shadow: 0 2px 10px rgba(0,0,0,0.2);
			z-index: 1001;
			font-family: sans-serif;
		`;

	 const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		let left = rect.left + rect.width / 2 - 50;
		let top = rect.bottom + 5;

		if (left < 10) left = 10;
		if (left + 100 > window.innerWidth) left = window.innerWidth - 110;
		if (top + 50 > window.innerHeight) top = rect.top - 55;

		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;

		const highlightBtn = document.createElement('button');
		highlightBtn.textContent = '高亮';
		highlightBtn.style.cssText = `
			background: ${this.settings.highlightColor};
			border: none;
			padding: 8px 16px;
			border-radius: 4px;
			cursor: pointer;
			margin: 0 5px;
		`;

		highlightBtn.addEventListener('click', () => {
			this.highlightSelection(selection);
			menu.remove();
		});

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = '取消';
		cancelBtn.style.cssText = `
			background: #f0f0f0;
			border: none;
			padding: 8px 16px;
			border-radius: 4px;
			cursor: pointer;
			margin: 0 5px;
		`;

		cancelBtn.addEventListener('click', () => {
			menu.remove();
		});

		menu.appendChild(highlightBtn);
		menu.appendChild(cancelBtn);
		document.body.appendChild(menu);

		setTimeout(() => {
			document.addEventListener('click', () => {
				menu.remove();
			}, { once: true });
		}, 100);
	}

	highlightSelection(selection: Selection) {
		console.log('Reading Highlight: 开始高亮选中文本');

		if (selection.rangeCount === 0) {
			console.log('Reading Highlight: 没有选择范围');
			return;
		}

		const range = selection.getRangeAt(0);
		const selectedText = selection.toString().trim();

		console.log('Reading Highlight: 选中的文本:', selectedText);

		if (selectedText.length === 0) {
			console.log('Reading Highlight: 选中文本为空');
			return;
		}

		const span = document.createElement('span');
		span.className = 'reading-highlight';
		span.style.cssText = `
			background-color: ${this.settings.highlightColor};
			opacity: ${this.settings.highlightOpacity};
			border-radius: 2px;
			padding: 1px 2px;
		`;

		try {
			range.surroundContents(span);
			const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			span.dataset.highlightId = highlightId;
			this.activeHighlights.set(highlightId, span);

			console.log('Reading Highlight: 高亮创建成功, ID:', highlightId);

			span.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.removeHighlight(highlightId);
			});

			selection.removeAllRanges();
		} catch (error) {
			console.warn('无法高亮选中文本:', error);
		}
	}

	removeHighlight(highlightId: string) {
		const highlight = this.activeHighlights.get(highlightId);
		if (highlight) {
			const parent = highlight.parentNode;
			if (parent) {
				while (highlight.firstChild) {
					parent.insertBefore(highlight.firstChild, highlight);
				}
				parent.removeChild(highlight);
			}
			this.activeHighlights.delete(highlightId);
		}
	}

	clearAllHighlights() {
		this.activeHighlights.forEach((highlight, id) => {
			this.removeHighlight(id);
		});
		this.activeHighlights.clear();
	}

	async loadSettings() {
		try {
			const data = await this.loadData();
			this.settings = Object.assign({}, DEFAULT_SETTINGS, data?.settings || {});
		} catch (error) {
			console.warn('加载设置失败，使用默认设置:', error);
			this.settings = Object.assign({}, DEFAULT_SETTINGS);
		}
	}

	async saveSettings() {
		try {
			await this.saveData({ settings: this.settings });
		} catch (error) {
			console.error('保存设置失败:', error);
		}
	}
}

class ReadingHighlightSettingTab extends PluginSettingTab {
	plugin: ReadingHighlightPlugin;

	constructor(app: App, plugin: ReadingHighlightPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: '阅读高亮设置' });

		new Setting(containerEl)
			.setName('高亮颜色')
			.setDesc('选择高亮文本的颜色')
			.addColorPicker(picker => picker
				.setValue(this.plugin.settings.highlightColor)
				.onChange(async (value) => {
					this.plugin.settings.highlightColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('高亮透明度')
			.setDesc('调整高亮的透明度 (0.1-1.0)')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.plugin.settings.highlightOpacity * 10)
				.onChange(async (value) => {
					this.plugin.settings.highlightOpacity = value / 10;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('启用移动端触摸支持')
			.setDesc('在移动设备上启用触摸选择高亮')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableMobileTouch)
				.onChange(async (value) => {
					this.plugin.settings.enableMobileTouch = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('显示高亮按钮')
			.setDesc('在桌面端显示浮动高亮按钮')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showHighlightButton)
				.onChange(async (value) => {
					this.plugin.settings.showHighlightButton = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('图标样式')
			.setDesc('选择高亮按钮的图标风格')
			.addDropdown(dropdown => dropdown
				.addOption('star', '⭐ 星星')
				.addOption('pen', '🖊️ 钢笔')
				.addOption('highlighter', '🖍️ 荧光笔')
				.addOption('brush', '🖌️ 画笔')
				.setValue(this.plugin.settings.iconStyle)
				.onChange(async (value) => {
					this.plugin.settings.iconStyle = value as ReadingHighlightSettings['iconStyle'];
					await this.plugin.saveSettings();
				}));
	}
}