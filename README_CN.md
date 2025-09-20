# Reading Highlight for Obsidian - 中文版

一个功能强大的 Obsidian 文本高亮插件，在阅读模式和源码模式间无缝工作。在阅读模式中选择任何文本并应用持久高亮，直接保存到你的 Markdown 文件中，使用 Obsidian 原生的 `==文本==` 语法。

## ✨ 功能特性

### 📝 持久化高亮
- **文件级存储**：高亮直接保存到 Markdown 文件中，使用 `==高亮文本==` 格式
- **跨模式同步**：高亮在阅读模式和源码模式中无缝显示
- **Obsidian 原生语法**：使用标准 Obsidian 高亮语法，支持所有平台

### 🖥️ 桌面体验
- **浮动高亮按钮**：选择文本时出现的现代化按钮
- **一键高亮**：选择文本并点击即可立即高亮
- **键盘友好**：完整的键盘导航支持

### 📱 移动端优化
- **触摸优化界面**：智能弹出菜单，定位在文本选择附近
- **大触摸目标**：按钮大小适合舒适的移动端交互
- **响应式设计**：完美适配不同屏幕尺寸
- **手势支持**：自然的触摸交互体验

### 🎨 可定制外观
- **颜色自定义**：选择任何符合你风格的高亮颜色
- **透明度控制**：调整透明度到你的偏好（0.1-1.0）
- **专业样式**：现代化、简洁的设计，流畅的动画效果

### 🔧 灵活配置
- **按钮可见性切换**：选择自动高亮或按钮激活模式
- **移动端检测**：自动为移动设备适配界面
- **设置同步**：偏好设置保存并在设备间同步

## 🚀 安装

### 从 Obsidian 社区插件（推荐）
1. 打开 Obsidian
2. 进入 **设置** → **社区插件**
3. 点击 **浏览** 并搜索 "Reading Highlight"
4. 点击 **安装** 然后 **启用**

### 使用 BRAT 测试版安装
1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 按 `Ctrl+P` 打开命令面板
3. 选择 "BRAT: Add a beta plugin for testing"
4. 输入仓库地址：`wuxiaobai24/obsidian-reading-highlight`
5. 启用 "Reading Highlight" 插件

### 手动安装
1. 从 [GitHub Releases](https://github.com/wuxiaobai24/obsidian-reading-highlight/releases) 下载最新版本
2. 解压下载的 zip 文件
3. 将 `obsidian-reading-highlight` 文件夹复制到你的 Obsidian 仓库的 `.obsidian/plugins/` 目录
4. 在 **设置** → **社区插件** 中启用插件

## 📖 使用指南

### 桌面端使用

#### 自动高亮（默认）
1. 在 **阅读模式** 中打开任何 Markdown 文件
2. 用鼠标选择文本
3. 文本自动高亮！✨

#### 按钮激活高亮
1. 在插件设置中启用"显示高亮按钮"
2. 在阅读模式中选择文本
3. 点击出现的浮动高亮按钮 🖍️
4. 你选择的文本将被高亮

### 移动端使用

#### 触摸高亮
1. 在 **阅读模式** 中打开任何 Markdown 文件
2. 长按并拖动选择文本
3. 选择附近出现弹出菜单
4. 点击 **"高亮"** 应用高亮
5. 点击 **"取消"** 关闭菜单

#### 移动端技巧
- **菜单定位**：弹出菜单自动定位以保持屏幕可见
- **触摸目标**：所有按钮大小都适合舒适的触摸交互
- **手势支持**：类似原生应用的自然触摸交互

### 移除高亮

#### 在阅读模式
- **桌面端**：直接点击任何高亮文本即可移除
- **移动端**：点击高亮文本即可移除

#### 在源码模式
- 直接编辑 `==高亮文本==` 标记
- 移除文本周围的 `==` 符号

## ⚙️ 设置

通过 **设置** → **社区插件** → **Reading Highlight** → **选项** 访问设置

### 高亮颜色
- 为你的高亮选择任何颜色
- 默认：暖黄色 (#ffeb3b)
- 支持完整颜色选择器，带预览

### 高亮透明度
- 调整透明度从 10% 到 100%
- 默认：30% (0.3)
- 帮助高亮与你的主题融合

### 显示高亮按钮
- **启用**：需要点击按钮来高亮（更多控制）
- **禁用**：文本选择时自动高亮（更快的工作流）
- 默认：启用

## 🛠️ 开发

### 前置要求
- Node.js (v14 或更高)
- npm 或 yarn
- 安装 Obsidian 用于测试

### 设置
```bash
# 克隆仓库
git clone https://github.com/wuxiaobai24/obsidian-reading-highlight.git
cd obsidian-reading-highlight

# 安装依赖
npm install

# 构建插件
npm run build

# 复制到 Obsidian 仓库（或使用 npm run dev 进行开发）
npm run copy
```

### 开发命令
```bash
npm run dev        # 启动开发模式，文件监听
npm run build      # 构建插件
npm run lint       # 运行代码质量检查
npm run format     # 使用 Prettier 格式化代码
npm run copy       # 复制构建的插件到 Obsidian
```

### 测试
1. 运行 `npm run dev` 启动文件监听
2. 复制文件到你的 Obsidian 仓库的插件目录
3. 在 Obsidian 设置中启用插件
4. 在桌面和移动设备上测试

## 🏗️ 架构

### 核心组件
- **ReadingHighlightPlugin**：处理所有功能的主插件类
- **ReadingHighlightSettingTab**：带实时预览的设置界面
- **移动端检测**：自动设备检测和 UI 适配
- **事件管理**：跨平台事件处理（鼠标 + 触摸）

### 技术实现
- **基于文件的持久化**：使用 Obsidian 仓库 API 直接修改 Markdown 文件
- **跨模式同步**：使用 Obsidian 原生 `==文本==` 高亮语法
- **移动端优化**：触摸事件、响应式设计、智能定位
- **性能优化**：最少的 DOM 操作，高效的文件操作

## 📁 项目结构

### 核心文件
- **`main.ts`** → 主插件实现（符号链接到 main-real.ts）
- **`main-real.ts`** → 完整插件，包含持久化存储和移动端优化
- **`main.js`** → 构建的插件输出（从 TypeScript 编译）
- **`manifest.json`** → 插件元数据和配置
- **`styles.css`** → 移动端响应式样式和动画

### 开发文件
- **`main-simple.ts`** → 用于调试和测试的简化版本
- **`main-test.ts`** → 基础测试版本，功能最小化
- **`test-simple.js/.ts`** → 测试工具和脚本
- **`dev.js`** → 开发服务器和部署工具
- **`tsconfig.json`** → TypeScript 编译器配置

### 配置文件
- **`package.json`** → Node.js 依赖和构建脚本
- **`package-lock.json`** → 依赖版本锁定文件
- **`CLAUDE.md`** → Claude Code 的技术文档
- **`simple-test-manifest.json`** → 开发测试配置

### 资源文件
- **`icons/`** → 插件界面的 SVG 图标文件
  - `highlighter-flat.svg` → 扁平设计高亮图标
  - `highlighter-gradient.svg` → 现代渐变高亮图标
  - `marker-minimal.svg` → 极简标记图标
  - `star-highlight.svg` → 星形高亮图标

### 按文件划分的关键功能
- **main-real.ts**：核心高亮逻辑、文件持久化、跨模式同步
- **styles.css**：触摸优化 UI、响应式设计、动画
- **dev.js**：开发期间自动部署到 Obsidian 仓库
- **manifest.json**：插件 ID、版本、兼容性设置
- **icons/**：移动端和桌面界面的专业矢量图形

## 📱 移动端体验

### 触摸优化
- **智能弹出菜单**：定位在文本选择附近，自动调整到屏幕边界
- **大触摸目标**：最小 44px 高度，适合舒适的点击
- **手势支持**：自然的触摸交互，带视觉反馈
- **性能**：流畅的动画和响应式交互

### 响应式设计
- **自适应布局**：移动端和桌面端不同的按钮大小和间距
- **屏幕边界检测**：菜单自动重新定位以保持可见
- **主题兼容**：支持亮色和暗色主题

## 🤝 贡献

我们欢迎贡献！请随时提交问题和拉取请求。

### 开发指南
- 遵循 TypeScript 最佳实践
- 在桌面和移动设备上测试
- 使用 Prettier 进行代码格式化
- 为公共方法添加 JSDoc 注释
- 为新功能包含测试

### 报告问题
请包括：
- Obsidian 版本
- 插件版本
- 操作系统和设备
- 复现问题的步骤
- 期望与实际行为

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 使用 [Obsidian API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) 构建
- 灵感来源于无缝阅读到编辑工作流的需求
- 感谢 Obsidian 社区的反馈和建议

## 🔄 更新日志

### v1.1.0 (当前版本)
- ✅ **持久化高亮**：高亮现在直接保存到 Markdown 文件
- 🎨 **现代图标**：专业的 SVG 图标替换简单表情符号
- 📱 **移动端优化**：完整的触摸优化界面
- ⚙️ **设置改进**：更直观的配置选项
- 🐛 **错误修复**：解决了加载和功能问题

### v1.0.0
- 🎉 初始发布
- 📝 基本文本高亮功能
- 🖥️ 带浮动按钮的桌面端支持

---

**用 ❤️ 为 Obsidian 社区制作**

如有问题、建议或反馈，请访问我们的 [GitHub 仓库](https://github.com/wuxiaobai24/obsidian-reading-highlight)。