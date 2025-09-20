var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main-real.ts
var main_real_exports = {};
__export(main_real_exports, {
  default: () => ReadingHighlightPlugin
});
module.exports = __toCommonJS(main_real_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  highlightColor: "#ffeb3b",
  highlightOpacity: 0.3,
  showHighlightButton: true,
  iconStyle: "highlighter"
};
var ReadingHighlightPlugin = class extends import_obsidian.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      console.log("Reading Highlight: \u63D2\u4EF6\u5DF2\u52A0\u8F7D");
      this.setupHighlightButton();
      this.setupTextSelection();
      this.addSettingTab(new ReadingHighlightSettingTab(this.app, this));
    });
  }
  setupTextSelection() {
    document.addEventListener("mouseup", () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          console.log("\u68C0\u6D4B\u5230\u6587\u672C\u9009\u62E9:", selection.toString());
          if (!this.settings.showHighlightButton) {
            this.highlightText(selection);
          }
        }
      }, 100);
    }, true);
    document.addEventListener("touchend", (e) => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          console.log("\u79FB\u52A8\u7AEF\u68C0\u6D4B\u5230\u6587\u672C\u9009\u62E9:", selection.toString());
          this.showMobileHighlightMenu(selection, e);
        }
      }, 100);
    }, { passive: true });
  }
  setupHighlightButton() {
    const button = document.createElement("button");
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
    button.addEventListener("click", () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        this.highlightText(selection);
      }
    });
    document.body.appendChild(button);
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        button.style.display = "flex";
      } else {
        button.style.display = "none";
      }
    });
  }
  highlightText(selection) {
    return __async(this, null, function* () {
      console.log("\u5F00\u59CB\u9AD8\u4EAE\u6587\u672C:", selection.toString());
      if (selection.rangeCount === 0)
        return;
      const selectedText = selection.toString().trim();
      if (selectedText.length === 0)
        return;
      try {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
          console.warn("\u6CA1\u6709\u6D3B\u52A8\u7684\u6587\u4EF6");
          return;
        }
        console.log("\u5F53\u524D\u6587\u4EF6:", activeFile.path);
        const fileContent = yield this.app.vault.read(activeFile);
        console.log("\u539F\u59CB\u6587\u4EF6\u5185\u5BB9:", fileContent);
        if (selectedText.includes("==")) {
          console.warn("\u6587\u672C\u5DF2\u7ECF\u662F\u9AD8\u4EAE\u683C\u5F0F");
          return;
        }
        const highlightedText = `==${selectedText}==`;
        const newContent = fileContent.replace(
          new RegExp(this.escapeRegExp(selectedText), "g"),
          highlightedText
        );
        console.log("\u65B0\u6587\u4EF6\u5185\u5BB9:", newContent);
        if (newContent !== fileContent) {
          yield this.app.vault.modify(activeFile, newContent);
          console.log("\u9AD8\u4EAE\u4FDD\u5B58\u6210\u529F");
          selection.removeAllRanges();
        } else {
          console.log("\u5185\u5BB9\u6CA1\u6709\u53D8\u5316");
        }
      } catch (error) {
        console.error("\u9AD8\u4EAE\u5931\u8D25:", error);
      }
    });
  }
  showMobileHighlightMenu(selection, event) {
    const existingMenu = document.querySelector(".reading-highlight-menu");
    if (existingMenu) {
      existingMenu.remove();
    }
    const menu = document.createElement("div");
    menu.className = "reading-highlight-menu";
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const menuWidth = 200;
    const menuHeight = 60;
    let left = rect.left + rect.width / 2 - menuWidth / 2;
    let top = rect.bottom + 10;
    if (left < 10)
      left = 10;
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
    const highlightBtn = document.createElement("button");
    highlightBtn.textContent = "\u9AD8\u4EAE";
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
    highlightBtn.addEventListener("click", () => {
      this.highlightText(selection);
      menu.remove();
    });
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "\u53D6\u6D88";
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
    cancelBtn.addEventListener("click", () => {
      menu.remove();
    });
    menu.appendChild(highlightBtn);
    menu.appendChild(cancelBtn);
    document.body.appendChild(menu);
    setTimeout(() => {
      const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
          document.removeEventListener("touchend", closeMenu);
        }
      };
      document.addEventListener("click", closeMenu);
      document.addEventListener("touchend", closeMenu);
    }, 100);
  }
  updateButtonIcon(button) {
    const { iconStyle } = this.settings;
    if (iconStyle === "emoji") {
      button.innerHTML = "\u{1F58D}\uFE0F";
      button.style.fontSize = "20px";
    } else {
      button.innerHTML = "";
      button.style.fontSize = "24px";
      try {
        (0, import_obsidian.setIcon)(button, iconStyle);
      } catch (error) {
        console.warn("Failed to set icon:", error);
        button.innerHTML = `<span style="font-size: 12px; color: #666;">${iconStyle}</span>`;
      }
    }
  }
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  removeHighlight(highlightedText) {
    return __async(this, null, function* () {
      try {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile)
          return;
        const fileContent = yield this.app.vault.read(activeFile);
        const normalText = highlightedText.replace(/^==|==$/g, "");
        const newContent = fileContent.replace(
          new RegExp(this.escapeRegExp(highlightedText), "g"),
          normalText
        );
        if (newContent !== fileContent) {
          yield this.app.vault.modify(activeFile, newContent);
          console.log("\u79FB\u9664\u9AD8\u4EAE\u6210\u529F");
        }
      } catch (error) {
        console.error("\u79FB\u9664\u9AD8\u4EAE\u5931\u8D25:", error);
      }
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      try {
        const data = yield this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
      } catch (error) {
        this.settings = Object.assign({}, DEFAULT_SETTINGS);
      }
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
var ReadingHighlightSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u9605\u8BFB\u9AD8\u4EAE\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u9AD8\u4EAE\u989C\u8272").setDesc("\u9009\u62E9\u9AD8\u4EAE\u6587\u672C\u7684\u989C\u8272\uFF08\u5728\u9605\u8BFB\u6A21\u5F0F\u4E0B\u663E\u793A\uFF09").addColorPicker((picker) => picker.setValue(this.plugin.settings.highlightColor).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.highlightColor = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("\u9AD8\u4EAE\u900F\u660E\u5EA6").setDesc("\u8C03\u6574\u9AD8\u4EAE\u7684\u900F\u660E\u5EA6\uFF08\u5728\u9605\u8BFB\u6A21\u5F0F\u4E0B\u663E\u793A\uFF09").addSlider((slider) => slider.setLimits(1, 10, 1).setValue(this.plugin.settings.highlightOpacity * 10).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.highlightOpacity = value / 10;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("\u663E\u793A\u9AD8\u4EAE\u6309\u94AE").setDesc("\u542F\u7528\u540E\u9700\u8981\u70B9\u51FB\u6309\u94AE\u624D\u80FD\u9AD8\u4EAE\u6587\u672C").addToggle((toggle) => toggle.setValue(this.plugin.settings.showHighlightButton).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.showHighlightButton = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("\u56FE\u6807\u6837\u5F0F").setDesc("\u9009\u62E9\u9AD8\u4EAE\u6309\u94AE\u7684\u56FE\u6807\u6837\u5F0F").addDropdown((dropdown) => dropdown.addOption("highlighter", "\u{1F58D}\uFE0F \u8367\u5149\u7B14").addOption("highlighter-circle", "\u2B55 \u5706\u5F62\u8367\u5149\u7B14").addOption("pen-tool", "\u{1F58A}\uFE0F \u753B\u7B14\u5DE5\u5177").addOption("marker", "\u{1F4CD} \u6807\u8BB0\u7B14").addOption("star", "\u2B50 \u661F\u661F").addOption("bookmark", "\u{1F516} \u4E66\u7B7E").addOption("emoji", "\u{1F60A} \u8868\u60C5\u7B26\u53F7").setValue(this.plugin.settings.iconStyle).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.iconStyle = value;
      yield this.plugin.saveSettings();
      const button = document.querySelector('button[style*="position: fixed"]');
      if (button) {
        this.plugin.updateButtonIcon(button);
      }
    })));
    const infoDiv = containerEl.createDiv();
    infoDiv.innerHTML = `
			<p><strong>\u4F7F\u7528\u8BF4\u660E\uFF1A</strong></p>
			<ul>
				<li>\u5728\u9605\u8BFB\u6A21\u5F0F\u4E0B\u9009\u62E9\u6587\u672C</li>
				<li>\u70B9\u51FB\u9AD8\u4EAE\u6309\u94AE\u6216\u76F4\u63A5\u9AD8\u4EAE</li>
				<li>\u9AD8\u4EAE\u4F1A\u4EE5 ==\u6587\u672C== \u683C\u5F0F\u4FDD\u5B58\u5230\u6587\u4EF6\u4E2D</li>
				<li>\u5207\u6362\u5230\u6E90\u7801\u6A21\u5F0F\u53EF\u4EE5\u770B\u5230\u9AD8\u4EAE\u6807\u8BB0</li>
				<li>Obsidian\u539F\u751F\u652F\u6301 ==\u6587\u672C== \u9AD8\u4EAE\u8BED\u6CD5</li>
			</ul>
		`;
    infoDiv.style.cssText = "margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 14px;";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
