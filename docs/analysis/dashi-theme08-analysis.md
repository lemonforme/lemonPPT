# Dashi PPT theme08 设计 Token 与页面组件分析

> 仅作研究参考。theme08 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme08/metadata.js`
> - `skills/dashi-ppt/project/dist/theme-runtime/theme08.module.mjs`
> - 运行时渲染截图 `output/theme08-all/screenshots/`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 黑金实验风 |
| **英文名风格** | Black Gold Experimental |
| **适用场景** | 高端发布、品牌提案、实验性概念、奢华科技叙事 |
| **目标受众** | 高端品牌、创意总监、科技品牌、发布会策划团队 |
| **视觉关键词** | 深黑底、荧光金、玫红点缀、淡紫灰、 Anton 数字体、手绘箭头、拼贴照片 |
| **总页数** | 84 页 |
| **布局数量** | 84 个独立 slot |
| **配色方案** | 主色渐变 / 柔和淡紫灰 双背景主题 |

---

## 二、设计 Token 系统

### 2.1 颜色 Token

theme08 以 `--acl-` 为前缀定义核心设计 Token，从运行时模块提取如下：

| Token | 色值 | 用途 |
|---|---|---|
| `--acl-paper` | `#FBFAF4` | 纸白/高光背景 |
| `--acl-ink` | `#16150F` | 主文字/深色底 |
| `--acl-yellow` | `#ECEF35` | 主强调色（荧光金） |
| `--acl-pink` | `#FF3D97` | 次强调色（玫红） |
| `--acl-red` | `#E83B22` | 警示/对比色 |
| `--acl-blue` | `#8DBEEC` | 冷色点缀 |
| `--acl-lilac` | `#E7E6EE` | 淡紫灰 |

#### 背景双主题

| 主题 | 说明 |
|---|---|
| `primary` | 主色渐变背景，通常偏深黑 + 荧光金 |
| `muted` | 柔和淡紫灰底色，适合文字密集页 |

由 `backgroundTheme` 控件切换（每页都有，共 84 次出现）。

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| `--acl-font-cn` | `"Noto Sans SC", -apple-system, sans-serif` |
| `--acl-font-hand` | `"Noto Sans SC", -apple-system, sans-serif` |
| `--acl-font-mono` | `"Noto Sans SC", -apple-system, sans-serif` |
| `--acl-font-num` | `"Anton", "Noto Sans SC", sans-serif` |

核心特征：

- 中文主字体使用 `Noto Sans SC`
- 数字使用 `Anton`（高窄、装饰性强）
- 整体呈现黑金实验/发布会海报感

### 2.3 核心控件变量

theme08 控件类型分布：

| 类型 | 数量 | 说明 |
|---|---|---|
| `boolean` | 286 | 开关型控制 |
| `number` | 221 | 数值/计数型控制 |
| `enum` | 106 | 枚举选择 |

高频控件 key：

| 控件 key | 类型 | 出现次数 | 说明 |
|---|---|---|---|
| `backgroundTheme` | enum | 84 | 背景主题：primary / muted |
| `showDecor` | boolean | 84 | 装饰元素（手绘箭头、火花、批注文案） |
| `focusEnabled` | boolean | 71 | 是否高亮某一元素 |
| `focusIndex` | number | 71 | 被高亮元素序号 |
| `showValueLabels` | boolean | 35 | 数值标签显隐 |
| `mediaCount` | number | 34 | 图片/媒体槽数量 |
| `metricCount` | number | 33 | 指标数量 |
| `chartType` | enum | 18 | 图表类型：bars / donut |
| `segmentCount` | number | 13 | 分段数量 |
| `rowCount` | number | 10 | 行数 |
| `cardCount` | number | 7 | 卡片数量 |
| `showRating` | boolean | 7 | 评分显隐 |
| `showIndex` | boolean | 6 | 页码角标显隐 |
| `showBars` | boolean | 6 | 条形显隐 |
| `nodeCount` | number | 6 | 节点数量 |
| `stageCount` | number | 6 | 阶段数量 |
| `tagCount` | number | 6 | 标签数量 |
| `showDelta` | boolean | 5 | 差值显隐 |

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：84 页
- **独立 slot 数**：84 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由 `backgroundTheme` 和组件内 CSS 控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | sup1 | 补充封面-① 智联万物 |
| page002 | sup2 | 补充封面-② 深耕教学 |
| page003 | sup3 | 补充封面-③ 新机遇新赛道 |
| page004 | cv2c | 封面2-③ 链通全国 |
| page005 | p1 | ① 封面 · Cover |

#### 导览 / 摘要 / 结构类（2 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | p2 | ② 摘要 · Overview |
| page007 | p3 | ③ 结构 · Contents |

#### 市场 / 趋势 / 全景类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page008 | p5 | ⑤ 趋势 · Trend |
| page009 | p6 | ⑥ 透视 · Cross |
| page012 | p9 | ⑨ 热力 · Heatmap |
| page014 | p11 | ⑪ 象限 · Quadrant |
| page018 | p16 | ⑯ 气泡图 · Deal Map |
| page019 | p17 | ⑰ 季度聚焦 · Spotlight |
| page020 | p18 | ⑱ 指标对比 · Delta |

#### 周期 / 波动 / 时间序列类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page021 | p19 | ⑲ 峰值聚焦 · Peak |
| page022 | p20 | ⑳ 回落时间轴 · Pullback |
| page023 | p21 | ㉑ 峰谷对比 · Peak/Trough |
| page024 | p22 | ㉒ 贡献瀑布 · Waterfall |
| page027 | p25 | ㉕ 累计曲线 · Capital Curve |

#### 产业链 / 技术架构类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page010 | p7 | ⑦ 产业链 · Chain |
| page030 | p28 | ㉘ 赛道卡 · Segment |
| page032 | p30 | ㉚ 场景矩阵 · Matrix |
| page036 | p34 | ㉞ 数据底座 · Pipeline |
| page037 | p35 | ㉟ 架构 · Architecture |
| page038 | p36 | ㊱ 供应链 · Supply |
| page039 | p37 | ㊲ 算力网格 · Compute |
| page040 | p38 | ㊳ 芯片层级 · Chip Tiers |

#### 案例类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | p8 | ⑧ 案例 · Cases |
| page061 | p64 | (64) 案例卡 · xAI |
| page062 | p65 | (65) 案例卡 · CoreWeave |
| page063 | p66 | (66) 案例表 · Scale AI |
| page064 | p67 | (67) 案例卡 · Perplexity |
| page065 | p68 | (68) 案例卡 · Databricks |
| page066 | p69 | (69) 案例卡 · Glean |
| page067 | p71 | (71) 案例卡 · SSI |

#### 地理分布类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page055 | p56 | (56) 大数字 · Geo Anchor |
| page056 | p57 | (57) 地理卡 · New York |
| page057 | p58 | (58) 地理卡 · Seattle |
| page058 | p59 | (59) 地理卡 · Boston |
| page059 | p60 | (60) 点阵图 · Other Regions |

#### 章节过渡类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page017 | p15 | ⑮ 章节 · Chapter |
| page028 | p26 | ㉖ 章节 · Chapter |
| page049 | p49 | ㊾ 章节 · Chapter |
| （page005 兼具主封面） |  |  |

#### 金句 / 主张类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page016 | p14 | ⑭ 金句 · Quote |
| page035 | p33 | ㉝ 金句 · Statement |
| page060 | p61 | (61) 金句 · Resources |
| page074 | p80 | (80) 金句 · Verdict |
| page084 | p91 | (91) 金句 · Two-Field |

#### 技术专题 / 行业场景类（10 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page029 | p27 | ㉗ 雷达图 · Radar |
| page031 | p29 | ㉙ 知识入口 · Portal |
| page033 | p31 | ㉛ 分支三联 · Triptych |
| page034 | p32 | ㉜ 场景占比 · Scene Split |
| page041 | p39 | ㊴ 具身智能 · Embodied |
| page042 | p41 | ㊶ 安全防线 · Safety |
| page043 | p42 | ㊷ 内容生成 · Generative |
| page044 | p43 | ㊸ 学习路径 · Education |
| page045 | p44 | ㊹ 降本场景 · Support |
| page046 | p46 | ㊻ 流程嵌入 · Low Code |
| page047 | p47 | ㊼ 社区变现 · Open Source |
| page048 | p48 | ㊽ 安全对齐 · Alignment |

#### 资本 / 资源 / 生态类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page050 | p50 | ㊿ 早期轮 · Early Stage |
| page051 | p52 | (52) 资本来源 · Investor Mix |
| page052 | p53 | (53) 资源绑定 · Resource Map |
| page053 | p54 | (54) 算力闭环 · Closed Loop |
| page054 | p55 | (55) GPU 生态 · Ecosystem |

#### 风险 / 合规 / 壁垒类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page068 | p73 | (73) 收入兑现 · Revenue |
| page069 | p74 | (74) 合规台账 · Regulation |
| page070 | p76 | (76) 壁垒压缩 · Squeeze |

#### 策略 / 路线图 / 工具类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page015 | p13 | ⑬ 策略 · Strategy |
| page071 | p77 | (77) 策略卡 · Budget |
| page072 | p78 | (78) 嵌入流程 · Workflow |
| page073 | p79 | (79) 时间轴 · Repricing |
| page075 | p81 | (81) 展望主线 · Mainlines |
| page076 | p82 | (82) 迁移图 · Migration |
| page077 | p83 | (83) 样板 · Playbooks |
| page081 | p87 | (87) 路线图 · Roadmap |

#### 数据 / 图表 / 特殊版式类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page013 | p10 | ⑩ 排名 · Ranking |
| page025 | p23 | ㉓ 区间结构 · Size Split |
| page026 | p24 | ㉔ 大数字 · Big Number |
| page078 | p84 | (84) 大数字 · Gauge |
| page079 | p85 | (85) 跨页 · Hero Split |
| page080 | p86 | (86) 哑铃图 · Range |
| page082 | p88 | (88) 照片墙 · Photo Wall |
| page083 | p90 | (90) 记分卡 · Scorecard |

---

## 四、关键设计特征

### 4.1 黑金实验视觉

- 深黑/近黑背景 `#16150F` 为主，纸白 `#FBFAF4` 为辅
- 荧光金 `#ECEF35` 作为主强调色，形成强烈的发布会海报感
- 玫红 `#FF3D97` 和蓝色 `#8DBEEC` 作为点缀色
- 数字使用 `Anton` 字体，高窄、有冲击力和装饰性

### 4.2 双背景主题切换

- `primary`：主色渐变背景，适合封面、章节页、金句页
- `muted`：淡紫灰柔和背景，适合数据密集、文本密集页
- 由 `backgroundTheme` 控件统一控制

### 4.3 装饰元素系统

- `showDecor` 控件出现 84 次，每页都支持
- 装饰包括：手绘箭头、火花、批注文案
- 这是 theme08 区别于其他主题的重要视觉特征

### 4.4 媒体拼贴能力

- `mediaCount` 控制右侧拼贴照片槽数量（0–3）
- 适合品牌发布会、概念提案等需要大量视觉素材的场景

### 4.5 聚焦系统

- `focusEnabled` + `focusIndex` 高频出现
- 在复杂页面中高亮某一元素，引导视线

### 4.6 控件命名风格

- theme08 使用 `enum/number/boolean` 三类控件，而不是 `radio/slider/toggle`
- 控件 key 命名更简洁，如 `showDecor`、`mediaCount`、`showValueLabels`

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **黑金高对比配色**：深黑底 + 荧光强调色，适合发布会/高端品牌。
2. **双背景主题切换**：用单一控件切换页面情绪（primary/muted）。
3. **装饰元素层**：手绘箭头、火花、批注等装饰层独立控制，增强设计感。
4. **媒体拼贴**：通过 `mediaCount` 控制照片槽数量，灵活应对不同素材量。
5. **聚焦高亮系统**：在复杂数据/图表页中引导读者视线。
6. **数字字体差异化**：数字使用装饰性字体（如 Anton），标题使用无衬线，形成层级。
7. **图表类型二选一**：`chartType: bars / donut`，简化用户选择。

### 5.2 不能复用的东西

- theme08 的具体色值（`#ECEF35`、`#FF3D97`、`#16150F` 等）
- `--acl-` 前缀的 Token 命名
- 84 个 slot 的具体实现和命名
- Anton 字体（如需商用需确认授权）
- Dashi PPT 的装饰图片资产
- 中文标签文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「高端发布/黑金实验」主题，建议：

1. 重新设计一套原创配色（例如炭黑 + 电光琥珀 + 深绯红）。
2. 建立自己的 Token 前缀（例如 `--lp-`）。
3. 选择有商用授权的展示型数字字体（如 Bebas Neue / Oswald）。
4. 先做 5~8 个核心布局：主封面、章节页、大数字、案例卡、金句、路线图。
5. 支持装饰元素显隐开关，但默认克制。
6. 背景主题切换先只做 2 种（深色强调 / 浅色阅读）。

---

## 六、与 theme01~07 的对比

| 维度 | theme01 | theme02 | theme03 | theme04 | theme05 | theme06 | theme07 | theme08 |
|---|---|---|---|---|---|---|---|---|
| **主题名** | 轻拟态风 | 炫光紫绿风 | 深浅代码风 | 玻璃糖果风 | 色谱图表风 | 深色图谱风 | 冷白调研风 | 黑金实验风 |
| **整体亮度** | 浅色底 | 深色底 | 深浅双模式 | 浅色底 | 深色/纸白 | 深色底 | 冷白底 | 深黑底 |
| **主强调色** | 多色柔和 | 绿/紫霓虹 | 蓝/绿 | 糖果多色 | 5 色板 | 荧光黄绿/珊瑚 | 低饱和绿蓝 | 荧光金 |
| **点缀色** | 弥散渐变 | 发光边框 | 电光蓝/荧光绿 | 粉色/蓝色 | 多色色谱 | 珊瑚/蓝/金黄 | 暖黄/近黑 | 玫红/蓝色 |
| **核心质感** | 玻璃拟态 | 科技光晕 | 编辑式粗体 | 玻璃糖果 | 数据色谱 | 节点图谱 | 冷白机构 | 黑金实验 |
| **适用场景** | 企业汇报 | 科技发布会 | 技术方案 | 年轻品牌 | 数据分析 | 战略/产业研究 | 白皮书/调研 | 高端发布 |
| **页数** | 84 | 74 | 77 | 74 | 94 | 83 | 71 | 84 |
| **背景主题** | 单一 | 单一 | light/dark | 单一 | gradient/solid/dark | 深色为主 | gradient/solid/dark | primary/muted |
| **装饰系统** | 弥散渐变 | 光晕/3D 球 | 3D 像素装饰 | 玻璃糖果 | 图表装饰 | 节点连线 | 结构化数据 | 手绘箭头/火花 |

---

## 七、红线提醒

- ❌ 不能复制 `theme08` 运行时模块代码
- ❌ 不能复用 theme08 具体色值与 `--acl-` Token 前缀
- ❌ 不能复用 theme08 类名体系
- ❌ 不能复用 84 个 slot 的具体实现
- ❌ 不能复用 Dashi PPT 字体、图标、装饰图片资产

✅ 可以学习的是：**黑金高对比视觉系统**、**双背景主题切换机制**、**装饰元素独立控制**、**媒体拼贴策略**、**数字字体差异化**、**聚焦高亮系统**。

---

## 八、生成的预览资产

本次分析同步生成了 theme08 全部 84 页的截图画廊：

- **画廊 HTML**：[output/theme08-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme08-all/gallery.html)
- **截图目录**：[output/theme08-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme08-all/screenshots/)
- **主 deck 预览**：[output/theme08-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme08-all/ppt/index.html)
- **分析文档**：[dashi-theme08-analysis.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/dashi-theme08-analysis.md)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
