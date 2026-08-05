# Dashi PPT theme04 设计 Token 与页面组件分析

> 仅作研究参考。theme04 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme04/metadata.js`
> - `skills/dashi-ppt/project/dist/theme-runtime/theme04.module.mjs`
> - 运行时渲染截图 `output/theme04-all/screenshots/`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 玻璃糖果风 |
| **英文名风格** | Glass Candy / Editorial Pop |
| **适用场景** | 年轻化品牌、消费产品、创意提案、社媒感内容 |
| **目标受众** | 品牌团队、设计师、内容创作者、消费品团队 |
| **视觉关键词** | 玻璃拟态、糖果色、胶囊高亮、杂志感排版、圆润卡片、高饱和渐变 |
| **总页数** | 74 页 |
| **布局数量** | 74 个独立 slot（每页一种） |
| **配色方案** | green / yellow / blue / pink 四种强调色调 |

---

## 二、设计 Token 系统（从 metadata 与运行时观察）

### 2.1 颜色 Token

theme04 的色调围绕「玻璃糖果」质感构建，强调色可在绿、黄、蓝、粉之间切换。背景以浅米/奶白为主，文字以深炭色为主。

#### 基础色（从渲染 HTML 中提取的 UI 变量参考）

| Token | 色值 | 用途 |
|---|---|---|
| `--paper` | `#fafaf8` | 页面纸面/浅背景 |
| `--ink` | `#0a0a0a` | 主文字 |
| `--sans` | `Inter, Noto Sans SC, ...` | 主无衬线字体 |
| `--mono` | `Space Mono, JetBrains Mono, ...` | 等宽字体 |

#### 强调色方案

通过 `accentTone` 控制，常见取值：

- `green`（默认）：糖果绿 / 薄荷绿系
- `yellow`：柠檬黄 / 暖黄系
- `blue`：天空蓝 / 冰蓝系
- `pink`：糖果粉 / 玫粉系

具体色值未在 metadata 中明文列出，运行时通过 CSS 变量注入到每页 slide。

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| 主标题 sans | `Inter`, `Noto Sans SC`, system-ui, sans-serif |
| 等宽标签 mono | `Space Mono`, `JetBrains Mono`, ui-monospace, monospace |

### 2.3 核心控件变量

每页通过 controls 声明可配置项，高频主题级控件如下：

| 控件 key | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `accentTone` | radio | `green` | 页面主色调：green / yellow / blue / pink |
| `hlStyle` | radio | `glass` | 关键词高亮样式：glass / pill / underline / text |
| `hlTilt` | slider | `2` | 高亮胶囊旋转角度（0~4） |
| `showDecorations` | toggle | `true` | 星芒等装饰元素显隐 |
| `focusEnabled` | toggle | `false` | 是否高亮某一元素 |
| `focusIndex` | slider | - | 被高亮元素序号 |
| `mediaCount` | slider | - | 媒体/图片数量 |
| `statCount` | slider | - | 指标卡片数量 |
| `itemCount` | slider | - | 列表/条目数量 |
| `chartVariant` | radio | `donut` | 图表变体：donut / bar |
| `imageSide` | radio | `left` | 图片位置：left / right |
| `textAlign` | radio | `center` | 文字对齐：center / left |
| `backgroundMode` | radio | `unicorn` | 背景模式：unicorn / media |
| `unicornScene` | radio | `tech` | 动态背景场景：tech / automations / moving / goey |

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：74 页
- **独立 slot 数**：74 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由组件内 CSS/控件控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page001 | coverHero | 居中主题封面 | 居中主题封面 |
| page002 | coverIndex | 索引导读封面 | 索引导读封面 |
| page003 | coverGhost | 幽灵数字封面 | 幽灵数字封面 |
| page004 | coverBento | 糖果速览封面 | 糖果速览封面 |
| page044 | cover | 杂志封面 | 杂志封面 |
| page055 | hero | 大图封面 | 大图封面 |

#### 目录 / 导航类（2 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page005 | agenda | 研究框架 |
| page006 | contents | 图文目录 |

#### 研究方法 / 文本类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page007 | method | 研究方法 |

#### 章节过渡类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page008 | section | 章节页 |
| page035 | chapter | 章节大字 |
| page061 | split | 分屏章节 |
| page069 | numbered | 极简编号章节 |

#### 市场 / 赛道分布类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page009 | cards | 行业赛道 |
| page010 | donut | 赛道占比 |
| page013 | treemap | 资金版图 |

#### 排名 / 头部玩家类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | scatter | 估值散点 |
| page012 | slope | 排名变迁 |
| page036 | ranking | 头部玩家 |
| page026 | scoreboard | 头部玩家对照表 |

#### 数据 / 指标类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page029 | bignumber | 大数字 |
| page030 | stattrio | 三联大数字 |
| page031 | deltahero | 增长大数字 |
| page032 | scorecards | 资本计分卡 |
| page033 | versus | 对比双数字 |
| page020 | gauges | 三重集中 |
| page021 | heatmap | 资金热力矩阵 |
| page028 | matrix | 能力对照矩阵 |

#### 时间序列 / 节奏类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page017 | charts | 融资趋势 |
| page018 | monthchart | 月度趋势 |
| page019 | stacked | 季度资本构成 |
| page022 | calendar | 资本月历 |
| page023 | quartertable | 季度走势表 |
| page025 | spread | 资金消长 |
| page014 | waterfall | 资金瀑布 |

#### 轮次 / 结构类（2 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page015 | groupbars | 半年对比柱 |
| page024 | table | 轮次结构表 |

#### 产业链 / 分层类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page037 | layers | 产业链分层 |
| page038 | chaintable | 产业链分层表 |
| page039 | chainflow | 产业链分层·流向 |

#### 地理 / 画廊类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page040 | region | 地区分布 |
| page041 | gallery | 地区画廊 |
| page042 | filmstrip | 胶片印样 |

#### 矩阵 / 决策类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page016 | bento | 一图速览 |
| page043 | quadrant | 选题四象限 |
| page049 | radar | 多维雷达 |

#### 估值类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page052 | valuechart | 估值三级跳 |
| page053 | dumbbell | 估值跃迁 |
| page054 | pyramid | 估值金字塔 |

#### 图文 / 案例类（10 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page027 | ledger | 投资人出手榜 |
| page046 | trio | 三强争霸 |
| page047 | editorial | 杂志式跨页 |
| page048 | triptych | 全幅三联 |
| page050 | case | 典型案例 |
| page051 | profile | 人物档案卡 |
| page056 | annotated | 标注特写 |
| page057 | imagestory | 图片故事 |
| page058 | spotlight | 焦点特写 |
| page059 | showcase | 焦点机位 |
| page060 | polaroid | 拍立得拼贴 |

#### 策略 / 结论类（10 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page045 | coversection | 图背章节页 |
| page062 | compare | 投资策略 |
| page063 | diptych | 叙事对兑现 |
| page064 | riskchain | 风险传导 |
| page065 | roadmap | 资本三段式 |
| page066 | gantt | 泳道甘特 |
| page067 | metro | 资本地铁线 |
| page068 | timeline | 阶段策略 |
| page070 | voices | 投资人说 |
| page071 | manifesto | 宣言金句 |
| page072 | verdict | 论断印章 |
| page073 | quoteimage | 图文金句 |
| page074 | statement | 核心结论 |

---

## 四、关键设计特征

### 4.1 玻璃糖果质感

- 关键词高亮使用玻璃/胶囊/下划线/纯文字四种样式
- 胶囊高亮支持旋转倾斜（`hlTilt`），增加活泼感
- 背景常见玻璃拟态、毛玻璃、弥散渐变

### 4.2 多色强调方案

- 提供 green / yellow / blue / pink 四套强调色
- 通过 `accentTone` 单选切换，整页色调联动变化

### 4.3 杂志感排版

- 大量跨页、三联、对开、拍立得拼贴等杂志化布局
- 图文混排比例大胆，图片可占半幅或全幅
- 支持 `imageSide` 切换图片左右位置

### 4.4 动态背景

- `backgroundMode: unicorn` 时提供 tech / automations / moving / goey 等动态场景
- 部分页面支持背景媒体（media）替代动态场景

### 4.5 模块化控件

- 每页控件数量丰富（共 625 个控件实例，148 个唯一 key）
- 高频控件：装饰显隐、高亮样式、高亮倾斜、焦点高亮、媒体数量

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **多色主题切换**：提供 3~4 套糖果色强调方案，一键切换整体氛围。
2. **高亮关键词系统**：用玻璃/胶囊/下划线等多种形式突出标题关键词。
3. **杂志化图文排版**：跨页、三联、拍立得拼贴适合品牌/创意提案。
4. **动态背景可选**：提供纯色/动态/媒体三种背景模式。
5. **圆润卡片与毛玻璃**：年轻品牌感的核心视觉语言。
6. **控件化页面配置**：通过少量高频控件（色调、高亮、数量）快速变体。

### 5.2 不能复用的东西

- theme04 的具体色值与渐变定义
- theme04 的 slot 命名与 74 个布局结构
- 运行时模块中的 CSS 类名与动画
- Dashi PPT 的字体、图标、装饰图片资产
- 中文标签文案与默认演示文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「玻璃糖果/年轻品牌」主题，建议：

1. 重新设计一套原创糖果色板（例如薄荷绿+珊瑚粉+奶油黄）。
2. 使用 Inter / Space Grotesk + Noto Sans SC + Space Mono 字体组合。
3. 建立自己的 Token 前缀（例如 `--lp-`）。
4. 先做 5~8 个通用布局：居中封面、杂志跨页、数据卡片、图文金句、三段式结论。
5. 支持 2~3 套强调色切换，默认一套即可。
6. 简化动态背景：先提供静态渐变/图片背景。

---

## 六、与 theme01、theme02、theme03 的对比

| 维度 | theme01（轻拟态风） | theme02（炫光紫绿风） | theme03（深浅代码风） | theme04（玻璃糖果风） |
|---|---|---|---|---|
| **整体亮度** | 浅色底、亮背景 | 深色底、霓虹光 | 深色/浅色双模式 | 浅色底、糖果色 |
| **主色调** | 多色柔和弥散 | 绿/紫高饱和霓虹 | 电光蓝 + 荧光绿 | 绿/黄/蓝/粉糖果色 |
| **质感** | 玻璃拟态、毛玻璃 | 发光边框、科技光晕 | 编辑式、粗体字重、高对比 | 玻璃糖果、圆润卡片、杂志感 |
| **字体** | Noto Sans SC + Space Mono | Noto Sans SC + Space Grotesk + Space Mono | Archivo + Noto Sans SC + Space Mono | Inter + Noto Sans SC + Space Mono |
| **适用场景** | 企业汇报、融资报告 | 科技发布会、路演 | 技术方案、开发者大会、投研报告 | 年轻化品牌、创意提案、消费品 |
| **页数** | 84 页 | 74 页 | 77 页 | 74 页 |
| **配色方案** | 单一主题 | green / violet 双方案 | light/dark 双模式 + blue/lime 双强调 | green/yellow/blue/pink 四套强调 |
| **装饰元素** | 弥散渐变、玻璃卡片 | 光晕、旋转光边、3D 球体 | 3D 像素风装饰图、mono 标签 | 星芒、糖果胶囊、玻璃碎片 |

---

## 七、红线提醒

- ❌ 不能复制 `theme04` 运行时模块代码
- ❌ 不能复用 theme04 具体色值与渐变
- ❌ 不能复用 theme04 类名体系
- ❌ 不能复用 74 个 slot 的具体实现
- ❌ 不能复用 Dashi PPT 字体、图标、装饰图片资产

✅ 可以学习的是：**多色主题切换机制**、**关键词高亮系统**、**杂志化图文排版**、**玻璃拟态视觉语言**、**控件化页面配置**。

---

## 八、生成的预览资产

本次分析同步生成了 theme04 全部 74 页的截图画廊：

- **画廊 HTML**：[output/theme04-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme04-all/gallery.html)
- **截图目录**：[output/theme04-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme04-all/screenshots/)
- **主 deck 预览**：[output/theme04-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme04-all/ppt/index.html)
- **分析文档**：[dashi-theme04-analysis.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/dashi-theme04-analysis.md)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
