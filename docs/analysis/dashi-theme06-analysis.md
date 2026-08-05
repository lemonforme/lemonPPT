# Dashi PPT theme06 设计 Token 与页面组件分析

> 仅作研究参考。theme06 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme06/metadata.js`
> - `skills/dashi-ppt/project/dist/theme-runtime/theme06.module.mjs`
> - 运行时渲染截图 `output/theme06-all/screenshots/`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 深色图谱风 |
| **英文名风格** | Dark Atlas / Strategic Data Atlas |
| **适用场景** | 高密度数据展示、战略分析、科技/金融/产业报告 |
| **目标受众** | 战略团队、投资人、产业研究团队、高管汇报者 |
| **视觉关键词** | 深色底、霓虹强调、节点图谱、数据网格、战略地图、高密度信息 |
| **总页数** | 83 页 |
| **布局数量** | 83 个独立 slot（每页一种） |
| **配色方案** | 4 色强调板 + 深色/发光/面板三种背景模式 |

---

## 二、设计 Token 系统（从 metadata 提取）

### 2.1 颜色 Token

theme06 以深色为底，通过高饱和强调色点亮关键数据与节点。

#### 强调色板（`accent`）

| 色值 | 观感 |
|---|---|
| `#d2fb30` | 荧光黄绿 |
| `#ff5a3c` | 霓虹珊瑚 |
| `#3ca0ff` | 电光蓝 |
| `#ffd23c` | 亮金黄 |

#### 背景模式（`background`）

| Token | 值 | 说明 |
|---|---|---|
| `background` | `glow` / `solid` / `panel` | 发光背景 / 纯色背景 / 面板背景 |

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| 主字体 | `Inter`, `Noto Sans SC`, system-ui, sans-serif（推断） |
| 等宽 | `Space Mono`, `JetBrains Mono`, ui-monospace, monospace（推断） |

### 2.3 核心控件变量

每页控件数量较多（共 614 个控件实例，91 个唯一 key），高频主题级控件如下：

| 控件 key | 类型 | 出现次数 | 说明 |
|---|---|---|---|
| `accent` | color | 83 | 强调色，4 色可选 |
| `focusEnabled` | toggle | 68 | 是否高亮某一元素 |
| `focusIndex` | number | 68 | 被高亮元素序号 |
| `mediaSlotCount` | number | 39 | 媒体/图片插槽数量 |
| `metricCount` | number | 39 | 指标数量 |
| `chartType` | select | 21 | 图表类型：bars / stack / dots |
| `showTagBadge` | toggle | 20 | 标签徽章显隐 |
| `showWatermark` | toggle | 19 | 水印显隐 |
| `layout` | select | 18 | 布局变体：rows / grid |
| `showValueLabels` | toggle | 17 | 数值标签显隐 |
| `tagCount` | number | 14 | 标签数量 |
| `showCaseIndex` | toggle | 11 | 案例索引显隐 |
| `align` | select | 10 | 对齐：left / center |
| `showHero` | toggle | 10 | 主视觉显隐 |
| `showIndex` | toggle | 9 | 索引显隐 |
| `cardCount` | number | 7 | 卡片数量 |
| `showNote` | toggle | 7 | 注释显隐 |
| `background` | select | 6 | 背景模式：glow / solid / panel |
| `keywordCount` | number | 6 | 关键词数量 |
| `showBadge` | toggle | 6 | 徽章显隐 |

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：83 页
- **独立 slot 数**：83 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由组件内 CSS/控件控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | coverA | 封面A · 智联万物 / PRODUCT LAUNCH |
| page002 | coverB | 封面B · 新机遇 / BUSINESS PLAN |
| page003 | coverC | 封面C · 精益智造 / LEAN MFG |
| page004 | coverD | 封面D · 品牌整合营销 / BRAND MKT |
| page005 | cover | 01 · 封面 / COVER |

#### 目录 / 导航类（2 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | summary | 摘要/总结 |
| page007 | contents | 目录 |

#### 研究方法 / 框架类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page008 | method | 研究方法 |

#### 章节过渡类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page010 | chapter | 章节页 |
| page021 | ch | 章节页 |
| page041 | ch | 章节页 |
| page064 | ch | 章节页 |
| page073 | ch | 章节页 |
| page080 | ch | 章节页 |

#### 市场 / 趋势 / 周期类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page009 | trend | 趋势 |
| page012 | q | 季度分析 Q1 |
| page013 | q | 季度分析 Q2 |
| page014 | q | 季度分析 Q3 |
| page015 | q | 季度分析 Q4 |
| page016 | peaktrough | 峰谷 |
| page017 | waterfall | 瀑布 |
| page020 | cumulative | 累积 |

#### 规模 / 结构类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | dealmap | 交易地图 |
| page018 | sizesplit | 规模拆分 |
| page019 | avgticket | 平均交易额 |

#### 排名 / 矩阵 / 风险类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page022 | radar | 雷达 |
| page026 | ranking | 排名 |
| page029 | quadrant | 四象限 |
| page030 | risk | 风险 |
| page065 | revrisk | 收入风险 |
| page066 | regrisk | 区域风险 |
| page068 | openrisk | 开放风险 |

#### 产业链 / 生态类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page023 | agent | Agent |
| page024 | search | 搜索 |
| page025 | legal | 法律 |
| page027 | chain | 产业链 |
| page081 | capflow | 资本流向 |

#### 行业专题类（9 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page033 | health | 健康 |
| page034 | finance | 金融 |
| page035 | dev | 开发 |
| page036 | datainfra | 数据基础设施 |
| page037 | growth | 增长 |
| page038 | lowcode | 低代码 |
| page039 | opensource | 开源 |
| page040 | safety | 安全 |
| page069 | infra | 基础设施 |
| page070 | vertical | 垂直应用 |

#### 公司案例类（11 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page028 | cases | 案例 |
| page042 | rounds | 轮次 |
| page043 | dealstruct | 交易结构 |
| page044 | investor | 投资人 |
| page045 | resource | 资源 |
| page046 | alliance | 联盟 |
| page054 | openai | OpenAI |
| page055 | anthropic | Anthropic |
| page056 | xai | xAI |
| page057 | coreweave | CoreWeave |
| page058 | scaleai | Scale AI |
| page059 | perplexity | Perplexity |
| page060 | databricks | Databricks |
| page061 | glean | Glean |
| page062 | figure | Figure |
| page063 | ssi | SSI |

#### 地理分布类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page047 | gpu | GPU |
| page048 | bay | 湾区 |
| page049 | nyc | 纽约 |
| page050 | seattle | 西雅图 |
| page051 | boston | 波士顿 |
| page052 | other | 其他 |

#### 结论 / 金句 / 收尾类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page031 | outlook | 展望 |
| page032 | big | 大数字 |
| page053 | triad | 三元 |
| page071 | quote | 引语 |
| page072 | ipowatch | IPO 观察 |
| page077 | recap | 回顾 |
| page078 | sources | 来源 |
| page079 | closing | 结尾 |
| page082 | statement | 主张 |
| page083 | milestones | 里程碑 |

#### 其他数据图表页

| 页码 | Slot | 中文标签 |
|---|---|---|
| page067 | compute | 计算 |
| page074 | heatmap | 热力图 |
| page075 | megadeals | 大额交易 |
| page076 | megabig | 超大数字 |

---

## 四、关键设计特征

### 4.1 深色图谱底

- 默认深色背景，强调色以荧光黄绿、珊瑚、电光蓝、金黄为主
- `background` 支持 glow（发光）、solid（纯色）、panel（面板）三种模式

### 4.2 节点与连接

- 大量使用节点、连线、网络图、产业链图谱
- `showConnectors` 控制连接线显隐
- 案例页常以公司 logo/节点形式排列

### 4.3 高密度数据卡片

- 每页承载大量指标、标签、徽章
- `tagCount`、`cardCount`、`metricCount` 控制信息密度
- `focusEnabled` + `focusIndex` 可在复杂图谱中高亮单一节点

### 4.4 季度与章节结构

- 4 个 `q` 季度页 + 6 个 `ch` 章节页
- 整体报告结构感强，适合长周期产业研究报告

### 4.5 媒体插槽丰富

- `mediaSlotCount` 高频出现
- 大量页面支持插入图片/视频/公司 logo

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **深色数据图谱**：深色底 + 霓虹强调色，适合高密度战略/产业报告。
2. **节点高亮系统**：在复杂图谱中通过 `focusIndex` 聚焦单一节点。
3. **背景模式切换**：glow / solid / panel 三种模式控制氛围。
4. **信息密度控件**：通过 tag/card/metric count 控制每页承载量。
5. **章节+季度结构**：用章节页和季度页构建长报告骨架。
6. **公司案例页模板化**：为每个案例提供统一但可独立配置的页面。

### 5.2 不能复用的东西

- theme06 的具体色值（如 `#d2fb30`、`#ff5a3c` 等）
- 83 个 slot 的命名和结构
- 运行时模块中的 CSS 类名与图谱动画
- Dashi PPT 的字体、图标、装饰图片资产
- 中文标签文案与默认演示文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「深色战略图谱」主题，建议：

1. 重新设计深色底 + 3~4 套霓虹强调色（例如深空蓝 + 电光青 + 熔岩橙）。
2. 建立自己的 Token 前缀（例如 `--lp-`）。
3. 先做 6~8 个核心布局：封面、章节页、产业链图谱、案例节点、雷达图、地理分布、大数字。
4. 节点高亮系统先做静态聚焦，再做交互动画。
5. 限制背景模式为 2 种（发光/纯色），降低实现复杂度。
6. 案例页使用统一组件，通过 props 传入公司名、logo、关键数据。

---

## 六、与 theme01~05 的对比

| 维度 | theme01 | theme02 | theme03 | theme04 | theme05 | theme06 |
|---|---|---|---|---|---|---|
| **主题名** | 轻拟态风 | 炫光紫绿风 | 深浅代码风 | 玻璃糖果风 | 色谱图表风 | 深色图谱风 |
| **整体亮度** | 浅色底 | 深色底 | 深浅双模式 | 浅色底 | 深色/纸白 | 深色底 |
| **主色调** | 多色柔和 | 绿/紫霓虹 | 蓝/绿高对比 | 绿/黄/蓝/粉糖果色 | 5 色强调板 | 荧光黄绿/珊瑚/蓝/金黄 |
| **核心质感** | 玻璃拟态 | 科技光晕 | 编辑式粗体 | 玻璃糖果 | 数据色谱 | 深色图谱 |
| **适用场景** | 企业汇报 | 科技发布会 | 技术方案 | 年轻品牌 | 数据分析 | 战略/产业研究 |
| **页数** | 84 | 74 | 77 | 74 | 94 | 83 |
| **信息密度** | 中 | 中 | 高 | 中 | 极高 | 极高 |
| **核心视觉** | 弥散渐变 | 旋转光边 | 等宽标签 | 糖果胶囊 | 色谱图表 | 节点图谱 |

---

## 七、红线提醒

- ❌ 不能复制 `theme06` 运行时模块代码
- ❌ 不能复用 theme06 具体色值与图谱动画
- ❌ 不能复用 theme06 类名体系
- ❌ 不能复用 83 个 slot 的具体实现
- ❌ 不能复用 Dashi PPT 字体、图标、装饰图片资产

✅ 可以学习的是：**深色图谱视觉系统**、**节点聚焦机制**、**背景模式切换**、**高密度信息架构**、**章节+季度报告骨架**。

---

## 八、生成的预览资产

本次分析同步生成了 theme06 全部 83 页的截图画廊：

- **画廊 HTML**：[output/theme06-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme06-all/gallery.html)
- **截图目录**：[output/theme06-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme06-all/screenshots/)
- **主 deck 预览**：[output/theme06-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme06-all/ppt/index.html)
- **分析文档**：[dashi-theme06-analysis.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/dashi-theme06-analysis.md)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
