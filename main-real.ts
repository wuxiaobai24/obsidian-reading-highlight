import { App, Plugin, PluginSettingTab, Setting, setIcon } from 'obsidian';

interface ReadingHighlightSettings {
	highlightColor: string;
	highlightOpacity: number;
	showHighlightButton: boolean;
	iconStyle: 'highlighter' | 'highlighter-circle' | 'pen-tool' | 'marker' | 'star' | 'bookmark' | 'emoji';
}

const DEFAULT_SETTINGS: ReadingHighlightSettings = {
	highlightColor: '#ffeb3b',
	highlightOpacity: 0.3,
	showHighlightButton: true,
	iconStyle: 'highlighter'
};

export default class ReadingHighlightPlugin extends Plugin {
	settings: ReadingHighlightSettings;

	async onload() {
		await this.loadSettings();
		console.log('Reading Highlight: 插件已加载');

		this.setupHighlightButton();
		this.setupTextSelection();
		this.addSettingTab(new ReadingHighlightSettingTab(this.app, this));
	}

	setupTextSelection() {
		// 桌面端鼠标事件
		document.addEventListener('mouseup', () => {
			setTimeout(() => {
				const selection = window.getSelection();
				if (selection && selection.toString().trim().length > 0) {
					console.log('检测到文本选择:', selection.toString());
					if (!this.settings.showHighlightButton) {
						this.highlightText(selection);
					}
				}
			}, 100);
		}, true);

		// 移动端触摸事件
		document.addEventListener('touchend', (e) => {
			setTimeout(() => {
				const selection = window.getSelection();
				if (selection && selection.toString().trim().length > 0) {
					console.log('移动端检测到文本选择:', selection.toString());
					this.showMobileHighlightMenu(selection, e);
				}
			}, 100);
		}, { passive: true });
	}

	setupHighlightButton() {
		const button = document.createElement('button');
		this.updateButtonIcon(button);
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
				this.highlightText(selection);
			}
		});

		document.body.appendChild(button);

		document.addEventListener('selectionchange', () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim().length > 0) {
				button.style.display = 'flex';
			} else {
				button.style.display = 'none';
			}
		});
	}

	async highlightText(selection: Selection) {
		console.log('开始高亮文本:', selection.toString());

		if (selection.rangeCount === 0) return;

		const selectedText = selection.toString().trim();
		if (selectedText.length === 0) return;

		try {
			// 获取当前活动文件
			const activeFile = this.app.workspace.getActiveFile();
			if (!activeFile) {
				console.warn('没有活动的文件');
				return;
			}

			console.log('当前文件:', activeFile.path);

			// 读取文件内容
			const fileContent = await this.app.vault.read(activeFile);
			console.log('原始文件内容:', fileContent);

			// 检查是否已经是高亮文本
			if (selectedText.includes('==')) {
				console.warn('文本已经是高亮格式');
				return;
			}

			// 用 == 包围文本
			const highlightedText = `==${selectedText}==`;

			// 替换文件内容中的文本
			const newContent = fileContent.replace(
				new RegExp(this.escapeRegExp(selectedText), 'g'),
				highlightedText
			);

			console.log('新文件内容:', newContent);

			// 如果内容有变化，写入文件
			if (newContent !== fileContent) {
				await this.app.vault.modify(activeFile, newContent);
				console.log('高亮保存成功');

				// 清除选择
				selection.removeAllRanges();
			} else {
				console.log('内容没有变化');
			}

		} catch (error) {
			console.error('高亮失败:', error);
		}
	}

	showMobileHighlightMenu(selection: Selection, event: TouchEvent) {
		// 移除现有菜单
		const existingMenu = document.querySelector('.reading-highlight-menu');
		if (existingMenu) {
			existingMenu.remove();
		}

		const menu = document.createElement('div');
		menu.className = 'reading-highlight-menu';

		// 获取选择区域的位置
		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		// 计算菜单位置（确保在屏幕内）
		const menuWidth = 200;
		const menuHeight = 60;

		let left = rect.left + rect.width / 2 - menuWidth / 2;
		let top = rect.bottom + 10;

		// 边界检查
		if (left < 10) left = 10;
		if (left + menuWidth > window.innerWidth - 10) {
			left = window.innerWidth - menuWidth - 10;
		}
		if (top + menuHeight > window.innerHeight - 10) {
			top = rect.top - menuHeight - 10;
		}

		menu.style.cssText = `
			position: fixed;
			left: ${left}px;
			top: ${top}px;
			background: white;
			border: 1px solid #ddd;
			border-radius: 12px;
			padding: 15px;
			box-shadow: 0 4px 20px rgba(0,0,0,0.15);
			z-index: 10000;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			animation: slideIn 0.2s ease-out;
		`;

		// 高亮按钮
		const highlightBtn = document.createElement('button');
		highlightBtn.textContent = '高亮';
		highlightBtn.style.cssText = `
			background: #4CAF50;
			color: white;
			border: none;
			padding: 12px 20px;
			border-radius: 8px;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			margin: 0 5px;
			min-width: 70px;
			touch-action: manipulation;
		`;

		highlightBtn.addEventListener('click', () => {
			this.highlightText(selection);
			menu.remove();
		});

		// 取消按钮
		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = '取消';
		cancelBtn.style.cssText = `
			background: #f5f5f5;
			color: #333;
			border: none;
			padding: 12px 20px;
			border-radius: 8px;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			margin: 0 5px;
			min-width: 70px;
			touch-action: manipulation;
		`;

		cancelBtn.addEventListener('click', () => {
			menu.remove();
		});

		menu.appendChild(highlightBtn);
		menu.appendChild(cancelBtn);
		document.body.appendChild(menu);

		// 点击其他地方关闭菜单
		setTimeout(() => {
			const closeMenu = (e: Event) => {
				if (!menu.contains(e.target as Node)) {
					menu.remove();
					document.removeEventListener('click', closeMenu);
					document.removeEventListener('touchend', closeMenu);
				}
			};
			document.addEventListener('click', closeMenu);
			document.addEventListener('touchend', closeMenu);
		}, 100);
	}

	updateButtonIcon(button: HTMLButtonElement) {
		const { iconStyle } = this.settings;

		if (iconStyle === 'emoji') {
			button.innerHTML = '🖍️';
			button.style.fontSize = '20px';
		} else {
			// 清除原有内容并使用 Obsidian 内置图标
			button.innerHTML = '';
			button.style.fontSize = '24px';

			// 使用 Obsidian 的 setIcon 函数
			try {
				setIcon(button, iconStyle);
			} catch (error) {
				console.warn('Failed to set icon:', error);
				// 备用方案：显示图标名称作为占位符
				button.innerHTML = `<span style="font-size: 12px; color: #666;">${iconStyle}</span>`;
			}
		}
	}

	escapeRegExp(string: string): string {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	async removeHighlight(highlightedText: string) {
		try {
			const activeFile = this.app.workspace.getActiveFile();
			if (!activeFile) return;

			const fileContent = await this.app.vault.read(activeFile);

			// 移除 == 符号
			const normalText = highlightedText.replace(/^==|==$/g, '');

			// 替换回普通文本
			const newContent = fileContent.replace(
				new RegExp(this.escapeRegExp(highlightedText), 'g'),
				normalText
			);

			if (newContent !== fileContent) {
				await this.app.vault.modify(activeFile, newContent);
				console.log('移除高亮成功');
			}
		} catch (error) {
			console.error('移除高亮失败:', error);
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
			.setDesc('选择高亮文本的颜色（在阅读模式下显示）')
			.addColorPicker(picker => picker
				.setValue(this.plugin.settings.highlightColor)
				.onChange(async (value) => {
					this.plugin.settings.highlightColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('高亮透明度')
			.setDesc('调整高亮的透明度（在阅读模式下显示）')
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

		new Setting(containerEl)
			.setName('图标样式')
			.setDesc('选择高亮按钮的图标样式')
			.addDropdown(dropdown => dropdown
				.addOption('highlighter', '🖍️ 荧光笔')
				.addOption('highlighter-circle', '⭕ 圆形荧光笔')
				.addOption('pen-tool', '🖊️ 画笔工具')
				.addOption('marker', '📍 标记笔')
				.addOption('star', '⭐ 星星')
				.addOption('bookmark', '🔖 书签')
				.addOption('emoji', '😊 表情符号')
				.setValue(this.plugin.settings.iconStyle)
				.onChange(async (value) => {
					this.plugin.settings.iconStyle = value as ReadingHighlightSettings['iconStyle'];
					await this.plugin.saveSettings();

					// 刷新按钮图标
					const button = document.querySelector('button[style*="position: fixed"]') as HTMLButtonElement;
					if (button) {
						this.plugin.updateButtonIcon(button);
					}
				}));

		// 添加说明
		const infoDiv = containerEl.createDiv();
		infoDiv.innerHTML = `
			<p><strong>使用说明：</strong></p>
			<ul>
				<li>在阅读模式下选择文本</li>
				<li>点击高亮按钮或直接高亮</li>
				<li>高亮会以 ==文本== 格式保存到文件中</li>
				<li>切换到源码模式可以看到高亮标记</li>
				<li>Obsidian原生支持 ==文本== 高亮语法</li>
			</ul>
		`;
		infoDiv.style.cssText = 'margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 14px;';
	}
}