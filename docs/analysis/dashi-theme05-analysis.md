# Dashi PPT theme05 设计 Token 与页面组件分析

> 仅作研究参考。theme05 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme05/metadata.js`
> - `skills/dashi-ppt/project/dist/theme-runtime/theme05.module.mjs`
> - 运行时渲染截图 `output/theme05-all/screenshots/`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 色谱图表风 |
| **英文名风格** | Data Chromatic / Editorial Charts |
| **适用场景** | 数据报告、市场分析、KPI 复盘、行业研究 |
| **目标受众** | 数据分析师、咨询顾问、研究员、业务负责人 |
| **视觉关键词** | 高饱和色谱、卡片式图表、深色/纸白双底、数据驱动、模块化 |
| **总页数** | 94 页 |
| **布局数量** | 94 个独立 slot（每页一种） |
| **配色方案** | 5 色强调板 + 7 色背景板，支持 category/accent/mono 多种图表着色模式 |

---

## 二、设计 Token 系统（从 metadata 提取）

### 2.1 颜色 Token

theme05 的色彩系统非常开放，几乎每个页面都允许作者通过控件直接指定颜色。

#### 强调色板（`accentColor`）

| 色值 | 观感 |
|---|---|
| `#E0301E` | 鲜红 |
| `#E8741C` | 橙红 |
| `#F2C00C` | 明黄 |
| `#2F9450` | 翠绿 |
| `#2742C2` | 深蓝 |

#### 背景色板（`bgColor`）

| 色值 | 观感 |
|---|---|
| `#d8402e` | 砖红 |
| `#e2742c` | 橘橙 |
| `#efbe2e` | 金黄 |
| `#3c9a52` | 草绿 |
| `#4da0c6` | 天青 |
| `#2c44a0` | 靛蓝 |
| `#7a3c90` | 紫罗兰 |

#### 页面底色（`theme` / `cardTheme`）

| Token | 值 | 说明 |
|---|---|---|
| `theme` | `paper` / `dark` | 页面整体底色：纸白 / 深色 |
| `cardTheme` | `color` / `dark` / `paper` | 卡片底色：彩色 / 深色 / 纸白 |

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| 主字体 | `Inter`, `Noto Sans SC`, system-ui, sans-serif（推断） |
| 等宽 | `Space Mono`, `JetBrains Mono`, ui-monospace, monospace（推断） |

### 2.3 核心控件变量

每页控件数量极多（共 989 个控件实例，230 个唯一 key），高频主题级控件如下：

| 控件 key | 类型 | 出现次数 | 说明 |
|---|---|---|---|
| `accentColor` | color | 92 | 强调色，5 色可选 |
| `showSheetLabel` | toggle | 87 | 工作表/页脚标签显隐 |
| `showConclusion` | toggle | 71 | 结论区显隐 |
| `focusEnabled` | toggle | 67 | 是否高亮某一数据点 |
| `focusIndex` | slider | 65 | 被高亮数据点序号 |
| `imageCount` | slider | 32 | 图片数量 |
| `metricCount` | slider | 26 | 指标数量 |
| `showLead` | toggle | 26 | 引导文字显隐 |
| `imageSide` | radio | 22 | 图片位置：right / left |
| `showGalleryCaption` | toggle | 16 | 画廊说明显隐 |
| `showValue` | toggle | 16 | 数值标签显隐 |
| `cardTheme` | radio | 16 | 卡片主题：color / dark / paper |
| `showColorBand` | toggle | 15 | 彩色条带显隐 |
| `chartType` | radio | 15 | 图表类型：bar / cells |
| `theme` | radio | 10 | 页面底色：paper / dark |
| `colorMode` | radio | 7 | 图表着色模式：category / accent / mono |
| `bgColor` | color | 9 | 页面背景色，7 色可选 |

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：94 页
- **独立 slot 数**：94 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由组件内 CSS/控件控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | excover1 | 封面 精益智造 |
| page002 | excover2 | 封面 创意破圈 |
| page003 | excover3 | 封面 链通全国 |
| page004 | excover4 | 封面 把握消费趋势 |
| page005 | cover | 封面 Cover |

#### 目录 / 导航类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | spec | 研究框架 / 目录 |

#### 章节过渡类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page019 | chapter | 章节页 |
| page030 | chapter | 章节页 |
| page053 | chapter | 章节页 |
| page076 | chapter | 章节页 |

#### 市场全景 / 趋势类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page007 | grid | 网格概览 |
| page008 | split | 分栏概览 |
| page009 | trend | 趋势 |
| page010 | share | 占比 |
| page013 | heat | 热力矩阵 |
| page024 | curve | 曲线 |

#### 产业链 / 赛道类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | chain | 产业链 |
| page035 | breakdown | 结构拆解 |
| page038 | flow | 流向 |

#### 案例 / 聚焦类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page012 | cases | 案例 |
| page021 | snapshot | 快照 |
| page033 | spotlight | 聚焦 |
| page043 | showcase | 展示 |
| page050 | hero | 大图主视觉 |

#### 排名 / 矩阵类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page014 | rank | 排名 |
| page015 | quad | 四象限 |
| page031 | radar | 雷达 |
| page034 | matrix | 矩阵 |
| page066 | benchmark | 基准对比 |

#### 数据 / 指标类（10 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page020 | bubble | 气泡 |
| page022 | delta | 增长 |
| page023 | peak | 峰值 |
| page025 | peaktrough | 峰谷 |
| page026 | waterfall | 瀑布 |
| page027 | stacked | 堆叠 |
| page028 | bignumber | 大数字 |
| page029 | cumulative | 累积 |
| page032 | segment | 分段 |
| page041 | capacity | 产能 |

#### 时间 / 流程类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page036 | scene | 场景 |
| page039 | diagram | 图解 |
| page047 | path | 路径 |
| page051 | flux | 流向 |
| page058 | loop | 循环 |
| page059 | orbit | 轨道 |
| page065 | triad | 三元 |
| page077 | ladder | 阶梯 |

#### 地理 / 分布类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page044 | atlas | 图集 |
| page061 | region | 地区 |
| page062 | locale | 地域 |
| page088 | mosaic | 马赛克 |

#### 风险 / 策略类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page016 | risk | 风险 |
| page017 | outlook | 展望 |
| page045 | gate | 关口 |
| page052 | shield | 护盾 |
| page054 | signal | 信号 |
| page078 | register | 登记册 |

#### 结论 / 金句类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page018 | quote | 引语 |
| page037 | statement | 主张 |
| page056 | source | 来源 |
| page071 | gateway | 门户 |
| page083 | beacon | 灯塔 |
| page084 | verdict | 论断 |
| page092 | lede | 导语 |
| page094 | endcap | 结尾 |

#### 其他图表与模块化页面（约 34 页）

包括但不限于：grid、split、share、rank、quad、bubble、snapshot、delta、peak、curve、peaktrough、waterfall、stacked、bignumber、cumulative、radar、segment、spotlight、matrix、breakdown、scene、statement、flow、diagram、mix、capacity、ledger、showcase、atlas、gate、catalog、path、meter、funnel、flux、shield、signal、composite、resource、loop、orbit、dominance、region、locale、profile、spread、triad、benchmark、dossier、nexus、foundry、process、gateway、stack、index、monolith、horizon、ladder、register、ceiling、squeeze、slate、embed、beacon、verdict、slope、scorecard、era、mosaic、plate、mekko、versus、lede、colophon、endcap 等。

---

## 四、关键设计特征

### 4.1 色谱驱动的数据表达

- 每个图表/卡片可直接通过 `accentColor` / `bgColor` 指定颜色
- 支持 `colorMode` 切换：category（分类色）/ accent（强调色）/ mono（单色）
- 背景色与卡片主题可独立控制（`theme` + `cardTheme`）

### 4.2 强调色高对比

- 深色底 + 高饱和强调色，或纸白底 + 彩色卡片
- 红色/橙色常用于警示/风险，绿色常用于增长/正向，蓝色用于科技/稳定

### 4.3 模块化数据卡片

- 大量使用卡片、色块、条带、标签来承载数据
- 每张卡片可通过 `cardTheme` 在 color / dark / paper 之间切换

### 4.4 丰富的图表类型

- bar、cells、bubble、radar、waterfall、stacked、curve、peaktrough、mosaic、mekko、funnel、orbit、loop 等
- 通过 `chartType`、`chartVariant` 等控件切换

### 4.5 结论区与页脚标签

- 高频出现 `showConclusion` 和 `showSheetLabel` 控件
- 每页通常配有结论摘要和数据来源/工作表标签

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **色谱控件化**：让作者直接选择强调色/背景色，快速匹配品牌色。
2. **图表着色模式**：category / accent / mono 三种模式覆盖不同叙事需求。
3. **卡片主题独立**：卡片底色与页面底色解耦，增强层次感。
4. **结论区标准化**：每页预留结论/洞察区域，强化数据故事的闭环。
5. **数据标签显隐**：通过 `showValue`、`showLegend` 等控件控制信息密度。

### 5.2 不能复用的东西

- theme05 的具体色值（如 `#E0301E`、`#2742C2` 等）
- 94 个 slot 的命名和结构
- 运行时模块中的 CSS 类名与图表动画
- Dashi PPT 的字体、图标、装饰图片资产
- 中文标签文案与默认演示文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「数据/色谱图表」主题，建议：

1. 重新设计一套数据友好的色板（例如靛蓝+青绿+珊瑚橙，或自定义品牌色）。
2. 建立自己的 Token 前缀（例如 `--lp-`）。
3. 先做 6~8 个核心图表布局：趋势折线、占比环形、排名条形、四象限、大数字、瀑布图。
4. 支持图表着色模式切换，但默认使用强调色模式减少噪音。
5. 结论区作为可选模块，不强制每页出现。
6. 颜色选择器限制在品牌色板内，避免作者随意配色破坏一致性。

---

## 六、与 theme01~04 的对比

| 维度 | theme01 | theme02 | theme03 | theme04 | theme05 |
|---|---|---|---|---|---|
| **主题名** | 轻拟态风 | 炫光紫绿风 | 深浅代码风 | 玻璃糖果风 | 色谱图表风 |
| **整体亮度** | 浅色底 | 深色底 | 深浅双模式 | 浅色底 | 深色/纸白切换 |
| **主色调** | 多色柔和 | 绿/紫霓虹 | 蓝/绿高对比 | 绿/黄/蓝/粉糖果色 | 5 色强调板 |
| **核心质感** | 玻璃拟态 | 科技光晕 | 编辑式粗体 | 玻璃糖果 | 数据色谱 |
| **适用场景** | 企业汇报 | 科技发布会 | 技术方案 | 年轻品牌 | 数据分析 |
| **页数** | 84 | 74 | 77 | 74 | 94 |
| **配色控制** | 固定主题 | green/violet | light/dark + blue/lime | 4 套强调 | 5 强调 + 7 背景 + 着色模式 |
| **图表丰富度** | 中 | 中 | 高 | 中 | 极高 |

---

## 七、红线提醒

- ❌ 不能复制 `theme05` 运行时模块代码
- ❌ 不能复用 theme05 具体色值与图表配置
- ❌ 不能复用 theme05 类名体系
- ❌ 不能复用 94 个 slot 的具体实现
- ❌ 不能复用 Dashi PPT 字体、图标、装饰图片资产

✅ 可以学习的是：**色谱控件化思路**、**图表着色模式**、**卡片主题解耦**、**结论区标准化**、**数据密度控制**。

---

## 八、生成的预览资产

本次分析同步生成了 theme05 全部 94 页的截图画廊：

- **画廊 HTML**：[output/theme05-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme05-all/gallery.html)
- **截图目录**：[output/theme05-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme05-all/screenshots/)
- **主 deck 预览**：[output/theme05-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme05-all/ppt/index.html)
- **分析文档**：[dashi-theme05-analysis.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/dashi-theme05-analysis.md)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
