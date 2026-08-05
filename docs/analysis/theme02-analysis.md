# Dashi PPT theme02 设计 Token 与页面组件分析

> 仅作研究参考。theme02 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme02/metadata.js`
> - `skills/dashi-ppt/project/src/components/themes/theme02/source/src/gxnTheme.js`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 炫光紫绿风 |
| **英文名风格** | Glow / Neon |
| **适用场景** | 科技发布会、AI/自动驾驶/机器人主题、增长故事、创新项目展示 |
| **目标受众** | 科技公司创始人、技术负责人、品牌市场团队、投资路演团队 |
| **视觉关键词** | 深色背景、霓虹光晕、赛博朋克、动态发光、科技感 |
| **总页数** | 74 页 |
| **布局数量** | 74 个独立 slot（每页一种） |

---

## 二、设计 Token 系统

### 2.1 颜色 Token

theme02 的 Token 以 `--gxn-` 为前缀，全部定义在 `.gxn-theme` 作用域内。

#### 基础颜色

| Token | 色值 | 用途 |
|---|---|---|
| `--gxn-bg` | `#07090b` | 页面背景（深黑蓝） |
| `--gxn-text` | `#eef3f1` | 主文字（冷白） |
| `--gxn-dim` | `rgba(238,243,241,0.58)` | 次要文字 |
| `--gxn-faint` | `rgba(238,243,241,0.34)` | 弱化信息 |
| `--gxn-line` | `rgba(255,255,255,0.09)` | 边框、分割线 |
| `--gxn-panel-a` | `rgba(255,255,255,0.055)` | 面板渐变起点 |
| `--gxn-panel-b` | `rgba(255,255,255,0.012)` | 面板渐变终点 |

#### 强调色

| Token | 色值 | 用途 |
|---|---|---|
| `--gxn-accent` | `#2fe07f` | 主强调色（霓虹绿） |
| `--gxn-accent-2` | `#b9f24a` | 次强调色（荧光青柠） |
| `--gxn-accent-cool` | `#4ea2ff` | 冷强调色（科技蓝） |
| `--gxn-glow` | `47, 224, 127` | 光晕 RGB（对应 accent） |

#### 图表配色板

```js
['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a']
```

#### 紫色方案（scheme: violet）

| Token | 色值 |
|---|---|
| `--gxn-bg` | `#08081c` |
| `--gxn-accent` | `#9b82ff` |
| `--gxn-accent-2` | `#c4b3ff` |
| `--gxn-accent-cool` | `#5aa0ff` |
| `--gxn-glow` | `150, 120, 255` |

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| `--gxn-font-display` | `'Space Grotesk', 'Noto Sans SC', -apple-system, sans-serif` |
| `--gxn-font-sans` | `'Noto Sans SC', 'Space Grotesk', -apple-system, sans-serif` |
| `--gxn-font-mono` | `'Space Mono', ui-monospace, 'SFMono-Regular', monospace` |

### 2.3 字号阶梯

| Token | 字号 | 用途 |
|---|---|---|
| `--gxn-fs-display` | `82px` | 展示标题 |
| `--gxn-fs-h1` | `58px` | 一级标题 |
| `--gxn-fs-h2` | `40px` | 二级标题 |
| `--gxn-fs-h3` | `32px` | 三级标题 |
| `--gxn-fs-body` | `28px` | 正文 |
| `--gxn-fs-label` | `24px` | 标签、小字 |
| `--gxn-fs-stat` | `112px` | 超大数字 |

### 2.4 间距 Token

| Token | 数值 | 用途 |
|---|---|---|
| `--gxn-px` | `108px` | 左右页边距 |
| `--gxn-py` | `88px` | 上下页边距 |
| `--gxn-gap` | `32px` | 模块间距 |
| `--gxn-radius` | `24px` | 卡片圆角 |

### 2.5 效果 Token

#### 背景效果

- 双层径向渐变光晕（右上绿、左下蓝）
- 38px 点阵网格纹理
- 渐变遮罩，中心亮、边缘暗

```css
background:
  radial-gradient(1200px 760px at 84% -14%, rgba(var(--gxn-glow),0.14), transparent 60%),
  radial-gradient(960px 680px at -8% 116%, rgba(78,162,255,0.10), transparent 60%),
  var(--gxn-bg);
```

#### 玻璃面板

- 径向渐变边缘发光
- 半透明线性渐变背景
- 内阴影 + 外阴影
- hover/focus 时增强光晕

#### 炫光票卡（ticket emphasis）

- inset box-shadow 内发光
- conic-gradient 旋转光边
- 呼吸动画（breath 参数控制）
- 磁吸悬停效果（magnet）

#### 极光文字（aurora text）

- 多色渐变裁剪到文字
- 背景位置动画产生流动效果
- 文字阴影光晕

#### 动态球体

- 渐变流动动画
- 7 秒循环

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：74 页
- **独立 slot 数**：74 个
- **每页一个独特布局**：是（与 theme01 相同）
- **背景类**：全部为 `(default)`，背景由组件内 CSS 控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | cover | 封面 · Cover |
| page002 | coverbeam | 封面 A · 居中聚光 |
| page003 | coverfigure | 封面 B · 大数主视觉 |
| page004 | coverposter | 封面 C · 满幅图海报 |
| page005 | coverpanel | 封面 D · 模块网格 |

#### 目录 / 导航类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page007 | agenda | 报告目录 · Agenda |

#### 内容 / 文本类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | method | 研究方法 · Method |
| page018 | chain | 产业链分层 · Chain |
| page059 | editorial | 杂志大图 · Editorial |

#### 章节 / 过渡类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page014 | section | 章节页 · Section |

#### 数据 / 指标类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page020 | metrics | 关键数字 · Metrics |
| page021 | bignumber | 巨型数字 · Big Number |
| page022 | delta | 今昔对照 · Delta |
| page023 | bento | 数据看板 · Bento |
| page040 | gauge | 达成率 · Gauge |
| page041 | progress | 达成度 · Progress |

#### 图表类（12 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page008 | trend | 市场全景 · Trend |
| page009 | heatmap | 月度热力 · Heatmap |
| page011 | ranking | 融资榜单 · Leaderboard |
| page015 | quadrant | 四象限 · Matrix |
| page016 | radar | 能力雷达 · Radar |
| page017 | matrix | 评级矩阵 · Rating |
| page019 | sankey | 资金流向 · Sankey |
| page037 | funnel | 资本漏斗 · Funnel |
| page039 | waterfall | 资本桥 · Waterfall |
| page054 | dumbbell | 差距图 · Dumbbell |
| page062 | treemap | 赛道版图 · Treemap |
| page064 | slope | 斜率图 · Slope |

#### 图文展示类（16 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page013 | showcase | 案例图景 · Showcase |
| page024 | spotlight | 案例聚焦 · Spotlight |
| page025 | feature | 沉浸大图 · Feature |
| page026 | poster | 主题海报 · Poster |
| page027 | cardgrid | 图文卡组 · Card Grid |
| page028 | zigzag | 交错图文 · Zigzag |
| page029 | gallery | 案例图集 · Gallery |
| page030 | logowall | 公司图谱 · Logo Wall |
| page031 | compare | 双图对比 · Compare |
| page033 | pictogram | 笔数分布 · Pictogram |
| page035 | region | 地区分布 · Region |
| page038 | scatter | 估值散点 · Scatter |
| page042 | portrait | 人物金句 · Portrait |
| page043 | voices | 声音墙 · Voices |
| page049 | mosaic | 案例拼贴 · Mosaic |
| page052 | profile | 公司档案 · Profile |

#### 对比 / 表格类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page034 | comparetable | 特性对照 · Compare Table |
| page036 | marimekko | 市场结构 · Marimekko |
| page050 | datatable | 明细表 · Data Table |
| page051 | versus | 多空对照 · Versus |

#### 流程 / 框架类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page012 | timeline | 时间轴 · Timeline |
| page032 | rounds | 轮次结构 · Rounds |
| page044 | process | 判断框架 · Process |
| page045 | takeaway | 核心结论 · Takeaways |
| page053 | storyboard | 进程图带 · Storyboard |
| page056 | roadmap | 策略路线 · Roadmap |
| page057 | bubbletl | 月度气泡 · Bubble TL |
| page067 | mindmap | 机会图谱 · Mindmap |

#### 特殊图表 / 视觉类（13 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page046 | risk | 风险研判 · Risk |
| page047 | quote | 结语金句 · Quote |
| page048 | stacked | 资本结构 · Stacked Bar |
| page055 | manifesto | 结论主张 · Manifesto |
| page058 | pyramid | 优先金字塔 · Pyramid |
| page060 | pareto | 集中度 · Pareto |
| page061 | rose | 节律玫瑰 · Rose |
| page063 | cyclewheel | 资本飞轮 · Cycle |
| page065 | orbit | 径向枢纽 · Orbit |
| page066 | spheres | 三球串联 · Spheres |
| page068 | sunburst | 资本去向 · Sunburst |
| page069 | bump | 名次变迁 · Bump |
| page070 | masonry | 瀑布流图墙 · Masonry |
| page071 | venn | 维恩交集 · Venn |
| page072 | stream | 主题河流 · Stream |
| page073 | histogram | 规模分布 · Distribution |

#### 封底类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page074 | closing | 封底结语 · Closing |

---

## 四、关键设计特征

### 4.1 双配色方案

theme02 支持两种全局配色：

- **green**：霓虹绿 + 科技蓝，适合增长、AI、自动驾驶
- **violet**：炫光紫 + 冷蓝，适合更高端、神秘感的发布会

通过 `scheme` 控制变量覆盖实现，而不是两套独立组件。

### 4.2 更强的动效系统

比 theme01 更复杂：

- 呼吸光晕（ticket focus）
- 旋转光边（conic gradient）
- 极光文字流动
- 磁吸悬停 3D 倾斜
- 球体渐变流动
- 入场上浮动画

### 4.3 更重的科技发布会定位

theme02 的封面、展示页、人物金句页更丰富，适合舞台演讲场景；而 theme01 更偏向数据报告。

### 4.4 同样是一页一组件

74 个独立 slot，没有通用模板复用。维护成本和 theme01 一样高。

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **双配色方案**：通过 CSS 变量覆盖实现主题变体，比做两套主题更轻量。
2. **动效分级**：基础样式 → hover 状态 → focus/ticket 强调 → 入场动画。
3. **深色 + 霓虹光晕**：很受科技类 PPT 欢迎，但**不要用这些具体色值**。
4. **字体搭配**：西文 display font + 中文无衬线 + 等宽字体，层次分明。

### 5.2 不能复用的东西

- 具体色值（`#2fe07f`、`#9b82ff` 等）
- `--gxn-` 前缀命名
- `.gxn-theme`、`.gxn-slide`、`.gxn-panel` 等类名
- 玻璃拟态、ticket focus、aurora text 的具体 CSS 实现
- 74 个 slot 的命名和结构
- 中文标签文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「深色霓虹科技」主题，建议：

1. 重新选一套原创配色（例如靛蓝 + 电光青 + 珊瑚橙）。
2. 重新命名 Token 前缀（例如 `--lp-`）。
3. 简化动效：先只做基础发光 + 入场动画。
4. 只做 5~8 个通用布局，不要 74 页。

---

## 六、与 theme01 的对比

| 维度 | theme01（轻拟态风） | theme02（炫光紫绿风） |
|---|---|---|
| **整体亮度** | 浅色底、亮背景 | 深色底、霓虹光 |
| **主色调** | 多色柔和弥散 | 绿/紫高饱和霓虹 |
| **质感** | 玻璃拟态、毛玻璃 | 发光边框、科技光晕 |
| **动效** | 简单上浮 | 呼吸、旋转光边、磁吸 |
| **适用场景** | 企业汇报、融资报告 | 科技发布会、路演 |
| **页数** | 84 页 | 74 页 |
| **配色方案** | 单一主题 | green / violet 双方案 |
| **字体** | Noto Sans SC + Space Mono | Noto Sans SC + Space Grotesk + Space Mono |

---

## 七、红线提醒

- ❌ 不能复制 `gxnTheme.js` 代码
- ❌ 不能复用 `--gxn-` Token 值
- ❌ 不能复用 `.gxn-theme` 类名体系
- ❌ 不能复用 74 个 slot 的具体实现
- ❌ 不能复用动态光效 CSS 算法

✅ 可以学习的是：**深色霓虹主题的设计逻辑**、**双配色方案实现思路**、**动效分层策略**。
