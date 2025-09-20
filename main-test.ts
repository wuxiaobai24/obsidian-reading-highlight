import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface ReadingHighlightSettings {
	highlightColor: string;
	highlightOpacity: number;
	showHighlightButton: boolean;
}

const DEFAULT_SETTINGS: ReadingHighlightSettings = {
	highlightColor: '#ffeb3b',
	highlightOpacity: 0.3,
	showHighlightButton: true
};

export default class ReadingHighlightPlugin extends Plugin {
	settings: ReadingHighlightSettings;
	private activeHighlights: Map<string, HTMLElement> = new Map();

	async onload() {
		await this.loadSettings();
		console.log('Reading Highlight: 插件已加载');

		this.setupHighlightButton();
		this.setupTextSelection();
		this.addSettingTab(new ReadingHighlightSettingTab(this.app, this));
	}

	setupTextSelection() {
		// 监听鼠标释放事件
		document.addEventListener('mouseup', () => {
			setTimeout(() => {
				const selection = window.getSelection();
				if (selection && selection.toString().trim().length > 0) {
					console.log('检测到文本选择:', selection.toString());
					// 如果不显示按钮，直接高亮
					if (!this.settings.showHighlightButton) {
						this.highlightSelection(selection);
					}
				}
			}, 100);
		}, true);
	}

	setupHighlightButton() {
		// 创建高亮按钮
		const button = document.createElement('button');
		button.innerHTML = '🖍️';
		button.style.cssText = `
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 1000;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			border: none;
			background: #007bff;
			color: white;
			cursor: pointer;
			font-size: 20px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.3);
			display: none;
			align-items: center;
			justify-content: center;
		`;

		button.addEventListener('click', () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				this.highlightSelection(selection);
			}
		});

		document.body.appendChild(button);

		// 监听选择变化
		document.addEventListener('selectionchange', () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});
	}

	highlightSelection(selection: Selection) {
		console.log('开始高亮文本:', selection.toString());

		if (selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);
		const selectedText = selection.toString().trim();

		if (selectedText.length === 0) return;

		const span = document.createElement('span');
		span.style.cssText = `
			background-color: ${this.settings.highlightColor};
			opacity: ${this.settings.highlightOpacity};
			border-radius: 2px;
			padding: 1px 2px;
			cursor: pointer;
		`;

		try {
			range.surroundContents(span);
			const highlightId = `highlight-${Date.now()}`;
			span.dataset.highlightId = highlightId;
			this.activeHighlights.set(highlightId, span);

			span.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.removeHighlight(highlightId);
			});

			selection.removeAllRanges();
			console.log('高亮创建成功');
		} catch (error) {
			console.warn('高亮失败:', error);
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

	async loadSettings() {
		try {
			const data = await this.loadData();
			this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
		} catch (error) {
			this.settings = Object.assign({}, DEFAULT_SETTINGS);
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
			.setDesc('调整高亮的透明度')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.plugin.settings.highlightOpacity * 10)
				.onChange(async (value) => {
					this.plugin.settings.highlightOpacity = value / 10;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('显示高亮按钮')
			.setDesc('启用后需要点击按钮才能高亮文本')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showHighlightButton)
				.onChange(async (value) => {
					this.plugin.settings.showHighlightButton = value;
					await this.plugin.saveSettings();
				}));
	}
}