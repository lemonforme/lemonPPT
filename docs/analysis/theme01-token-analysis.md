# theme01 设计 Token


## 一、颜色 Token

| Token | 色值 | 用途 |
|---|---|---|
| `ink` | `#2b2b30` | 主标题、正文文字 |
| `ink2` | `#56565c` | 次要文字 |
| `ink3` | `#9a9ba4` | 弱化文字、mono 字体 |
| `red` | `#e8503a` | 红色标签、下降/警告 |
| `blue` | `#5b8def` | 蓝色标签、主色之一 |
| `green` | `#46b083` | 绿色标签、增长/正向 |
| `amber` | `#e0a23a` | 琥珀色标签 |
| `violet` | `#7a5ae0` | 紫色标签 |
| `series` | `['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0']` | 图表配色序列 |

### 背景渐变

`theme01` 不是纯深色主题，而是**浅色系 + 弥散渐变背景**：

- `aip-bg-a`：冷色调渐变基底，带蓝/粉/绿/黄的径向光晕
- `aip-bg-b`：暖色调渐变基底，带橙/蓝/粉/青的径向光晕

整体视觉关键词：**轻拟态、玻璃质感、柔和弥散光**。

---

## 二、字体 Token

| Token | 字体 | 用途 |
|---|---|---|
| 主字体 | `'Noto Sans SC', system-ui, sans-serif` | 中文标题、正文 |
| 等宽/英文 | `'Space Mono', monospace` | 英文大写、页码、数据标签 |

### 字号阶梯

| Token | 字号 | 用途 |
|---|---|---|
| `display` | `128px` | 超大展示数字/标题 |
| `title` | `78px` | 页面主标题 |
| `subtitle` | `42px` | 副标题、中文说明 |
| `body` | `30px` | 正文 |
| `small` | `24px` | 小标签、辅助文字 |
| `mono` | `24px` | 等宽数据、页码 |
| `en` | `28px` | 英文大写装饰文字（letter-spacing: 0.16em） |

### 字重与样式

- 标题：`font-weight: 900`，`letter-spacing: 0.012em`
- 副标题：`font-weight: 700`，颜色 `#7e7f8a`
- 英文装饰：`text-transform: uppercase`，`letter-spacing: 0.16em`，颜色 `#aaabb4`
- `-webkit-font-smoothing: antialiased`

---

## 三、间距与布局 Token

| Token | 数值 | 用途 |
|---|---|---|
| `pad-x` | `108px` | 左右页边距 |
| `pad-top` | `92px` | 顶部页边距 |
| `pad-bottom` | `84px` | 底部页边距 |
| `gap` | `40px` | 模块间距 |

### 组件间距

- `.aip-head` 标题块：`gap: 14px`
- `.aip-sub` 副标题行：`gap: 20px`
- `.aip-mono` 顶部间距：`margin-top: 34px`

---

## 四、效果 Token

### 4.1 玻璃拟态卡片

```css
background: rgba(255, 255, 255, .5);
backdrop-filter: blur(28px) saturate(140%);
border: 1px solid rgba(255, 255, 255, .7);
border-radius: 24px;
box-shadow:
  0 1px 0 rgba(255, 255, 255, .75) inset,
  0 24px 60px rgba(70, 72, 100, .13);
```

### 4.2 标签 Pills

```css
padding: 5px 15px;
border-radius: 9px;
font-weight: 700;
font-size: 24px;
letter-spacing: .04em;
line-height: 1.3;
color: #fff;
```

### 4.3 入场动画

```css
animation: aip-rise .55s both;
@keyframes aip-rise {
  from { transform: translateY(14px); }
  to { transform: none; }
}
```

- 仅当 `prefers-reduced-motion: no-preference` 时生效
- 子元素依次延迟：`0s, 0.05s, 0.1s, 0.15s`

---

## 五、主题特征总结

| 维度 | theme01 特点 |
|---|---|
| **整体风格** | 轻拟态 / 玻璃质感 / 柔和弥散渐变 |
| **色相** | 浅色底 + 蓝/粉/绿/黄/橙的柔和光晕 |
| **文字** | 深色（#2b2b30），强对比 |
| **字体** | Noto Sans SC + Space Mono |
| **装饰** | 大写英文、圆角标签、玻璃卡片 |
| **动效** | 轻微上浮入场（14px，0.55s） |

---

## 六、为什么不能直接复用

1. **AGPL-3.0 保护**：theme01 的全部代码（包括这些 Token）都在 AGPL 项目内。
2. **原创设计资产**：配色组合、玻璃效果参数、字体搭配属于 Dashi 的原创表达。
3. **lemonPPT 目标协议冲突**：lemonPPT 计划 MIT/Apache-2.0，不能直接继承 AGPL 设计资产。

### 参考时可以学什么

- 设计系统组织方式：颜色、字体、间距、效果分 Token 管理。
- 视觉层次：超大 display 字号 + 玻璃卡片 + 弥散背景的组合逻辑。
- 动效策略：用 CSS transform 做入场，支持 `prefers-reduced-motion`。



lemonPPT 的 minimal 主题 Token 可参考：
[`lemonPPT-minimal-design-tokens.md`](file:///Users/apple/Downloads/dashi-ppt-skill-main/lemonPPT-minimal-design-tokens.md)
