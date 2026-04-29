# 个人作品集网站

这是一个可直接打开的静态个人网站，风格参考你提供的暗色科技感作品集。主要内容集中在 `js/site-data.js`，后期替换文字、头像、作品图、社交链接时优先改这个文件。

## 文件结构

- `index.html`：页面结构。
- `css/styles.css`：视觉样式、响应式布局、按钮动画、作品滑动动画、光标样式。
- `js/site-data.js`：姓名、介绍、经历、技能、作品列表、联系方式等可编辑数据。
- `js/main.js`：动态背景、作品滑动渲染、点击预览、移动端菜单、滚动动画。
- `assets/profile-placeholder.png`：个人头像占位图。
- `assets/works/work-01.png` 到 `work-50.png`：作品占位图。
- `scripts/generate-assets.mjs`：重新生成占位图的脚本。

## 常见替换

头像：把新头像放到 `assets/`，然后修改 `js/site-data.js` 里的 `person.portrait`。

作品：替换 `assets/works/` 里的图片，或修改 `works` 数组中的 `image`、`title`、`type`、`year`、`description`。

文字：修改 `person`、`hero`、`about`、`experience`、`skillGroups`、`contact` 等字段。

打开网站：直接双击 `index.html`，或在浏览器里打开这个文件。
