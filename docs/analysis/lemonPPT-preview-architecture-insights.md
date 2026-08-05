# lemonPPT 预览器丝滑交互技术分析

> 基于 Dashi PPT 预览实现的技术观察，为 lemonPPT 预览/编辑面板设计提供参考。
>
> 本文件只描述技术机制与可借鉴思路，不涉及 Dashi 具体代码复用（其主题运行时受 AGPL-3.0 约束）。

---

## 1. 用户感知到的现象

在 Dashi PPT 预览页中：

- 右侧控制面板开关、滑块、选项切换时，左侧幻灯片内容**即时变化**。
- 没有白屏、没有整页刷新、没有 DOM 闪烁。
- 动画效果（呼吸光、磁吸、流光）过渡自然。

核心问题：**为什么右侧调参不会让左侧“刷屏”？**

---

## 2. 根本原因：不是刷新页面，而是局部更新

### 2.1 单页应用，无 iframe

预览器结构位于同一个 HTML 页面中：

- 左侧幻灯片区域：`#deck`
- 右侧面板：`#preview-panel`
- 两者共用同一个 `window`、同一个 JS 运行时、同一套状态。

没有 iframe 隔离，也就不存在 iframe `src` 重载或跨窗口通信延迟。

### 2.2 控件只修改当前 slide 的 props

右侧每个控件对应主题 `metadata.js` 中定义的 `controls` 条目。当用户操作时，执行流程：

```text
用户拖动滑块/切换开关
    ↓
applyPropValues(slide, values)
    ↓
合并默认值 + 源 props + 用户新值
    ↓
viewModel.setProps(slideId, nextProps)   // 状态持久化
    ↓
window.__renderRuntimeSlide(slide, nextProps)   // 只重渲染当前 slide
```

关键点：它**只改当前这一页**的 props，不动其他 slide，也不重建整个 deck。

### 2.3 React 原地 reconcile 单个 slide

渲染函数找到当前 slide 内部的 `.imported-theme-root` 容器，使用 React `createRoot` 对其做原地 render：

```js
const root = slide.querySelector('.imported-theme-root');
createRoot(root).render(<Component {...mergedProps} />);
```

React 的 diff 算法会：

- 复用未变化的 DOM 节点；
- 只更新真正变化的文本、class、style、CSS 变量；
- 不销毁/重建整个 slide。

### 2.4 视觉效果尽量走 CSS 变量

theme02 的“内光呼吸感”“磁吸悬停”“渐变流光”等特效，很多由 CSS custom properties 控制，例如：

```css
.ticket {
  --breath-intensity: var(--user-breath, 0.55);
  animation: breathe 3s ease-in-out infinite;
}
```

React 重渲染后，可能只是改了容器上的 `--user-breath` 变量，浏览器合成层立刻生效，无需重新布局或重绘大段内容。

### 2.5 避免重复播放入场动画

控件调参属于“属性微调”，不是 slide 切换。代码里会传 `skipMotion: true`，防止每次调参都重新播放一次主题入场动效：

```js
window.__syncActiveEffects?.(slide, { skipMotion: true });
```

这保证了：拖动滑块时，只有数值相关的视觉在动，整体结构保持稳定。

### 2.6 同步渲染，响应跟手

使用 `flushSync` 让 props 变更在同一帧内提交到 DOM：

```js
flushSync(() => {
  getRootApi(root).render(...);
});
```

对于滑块连续拖动这种高频输入，不会出现“拖完才更新”的滞后感。

---

## 3. 技术流程图

```
┌─────────────────┐      ┌─────────────────┐
│  右侧控制面板    │      │  左侧幻灯片      │
│  (preview-panel)│      │  (#deck .slide) │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │  1. 用户操作控件        │
         ▼                        │
  applyPropValues(slide, values)  │
         │                        │
         │  2. 合并 + setProps    │
         ▼                        │
  window.__renderRuntimeSlide      │
         │                        │
         │  3. 找到 .imported-theme-root
         │───────────────────────▶│
         │                        │
         │  4. React createRoot(root).render(<Component {...props} />)
         │                        │
         │  5. React diff，只更新变化的部分
         │                        │
         │  6. CSS 变量/类立即生效，skipMotion 避免重播入场动画
         │                        │
         │                        ▼
         │              视觉即时、平滑更新
```

---

## 4. 对 lemonPPT 的借鉴点

| Dashi 做法 | lemonPPT 可采用的策略 |
|---|---|
| 预览器和编辑器在同一页，无 iframe | lemonPPT 编辑器/预览器也采用 SPA 架构，避免 iframe 重载 |
| 每页 slide 内部有独立的 React root | 每页组件化，支持按 `slideId` 单独 re-render |
| 控件只改当前 slide 的 props | 状态按 slide 维度拆分，避免整份 deck 重建 |
| 视觉变量用 CSS custom properties | Token 系统（颜色、间距、动效）优先用 CSS 变量，React 只改变量名/值 |
| `skipMotion` 区分“切换 slide”和“调参” | 设计两种更新模式：切页时播放入场动画，调参时只做属性过渡 |
| `flushSync` 保证滑块跟手 | 对高频输入（slider、color picker）使用同步/批量提交策略 |
| 主题 `controls` 元数据驱动右侧面板 | lemonPPT 主题声明 `controls` schema，预览器自动生成对应表单 |

---

## 5. 需要避免的问题

1. **不要整页替换 HTML**：如果右侧一调参就重写整个 `#deck` innerHTML，会导致所有 slide 重新创建、字体重新加载、动画重新计算，产生闪烁。
2. **不要把每页做成 iframe**：iframe 间通信和重载会带来明显延迟。
3. **不要所有状态都放顶层 Context**：顶层状态更新会触发整棵组件树重渲染。应按 slide 维度隔离状态。
4. **不要把动画时长和控件数值绑定过死**：例如“呼吸速度”应该只改 CSS animation-duration，而不是销毁元素重新挂载。

---

## 6. 结论

Dashi 预览器“丝滑”的本质是：**最小化更新范围 + React reconcile + CSS 变量驱动 + 同步提交**。

对 lemonPPT 来说，不需要复制 Dashi 的代码，但应借鉴这套交互范式：

- 单页预览器；
- slide 级组件化与局部重渲染；
- Token 与动效走 CSS 变量；
- 控件 schema 化，自动生成面板；
- 区分“切换 slide”与“属性微调”的动画策略。

这样可以实现同等平滑、不刷屏的编辑体验，同时保持 lemonPPT 自身的 MIT/Apache-2.0 独立实现。
