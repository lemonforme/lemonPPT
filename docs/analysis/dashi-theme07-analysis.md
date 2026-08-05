# Dashi PPT theme07 设计 Token 与页面组件分析

> 仅作研究参考。theme07 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme07/metadata.js`
> - `skills/dashi-ppt/project/dist/theme-runtime/theme07.module.mjs`
> - 运行时渲染截图 `output/theme07-all/screenshots/`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 冷白调研风 |
| **英文名风格** | Cold White Research / Institutional Whitepaper |
| **适用场景** | 调研报告、白皮书、竞品分析、学术/政策型表达 |
| **目标受众** | 研究机构、咨询团队、政府/高校/智库、B2B 团队 |
| **视觉关键词** | 冷白背景、深墨文字、克制用色、结构化数据、学术感、低饱和强调 |
| **总页数** | 71 页 |
| **布局数量** | 71 个独立 slot（每页一种） |
| **配色方案** | 5 色强调板 + gradient/solid/dark 三种背景变体 |

---

## 二、设计 Token 系统（从 metadata 提取）

### 2.1 颜色 Token

theme07 以冷白/浅灰为底，强调色饱和度较低，整体呈现机构报告的克制感。

#### 强调色板（`accentColor`）

| 色值 | 观感 |
|---|---|
| `#8FD400` | 草绿 |
| `#23C76A` | 薄荷绿 |
| `#2F7BFF` | 冷蓝 |
| `#F2A93B` | 暖黄 |
| `#0D100A` | 近黑（高对比文字/块） |

#### 背景变体（`backgroundVariant`）

| Token | 值 | 说明 |
|---|---|---|
| `backgroundVariant` | `gradient` / `solid` / `dark` | 渐变背景 / 纯色背景 / 深色背景 |

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| 主字体 | `Inter`, `Noto Sans SC`, system-ui, sans-serif（推断） |
| 等宽 | `Space Mono`, `JetBrains Mono`, ui-monospace, monospace（推断） |

### 2.3 核心控件变量

每页控件数量适中（共 541 个控件实例，110 个唯一 key），高频主题级控件如下：

| 控件 key | 类型 | 出现次数 | 说明 |
|---|---|---|---|
| `accentColor` | color | 71 | 强调色，5 色可选 |
| `showDecorations` | toggle | 67 | 装饰元素显隐 |
| `focusEnabled` | toggle | 55 | 是否高亮某一元素 |
| `focusIndex` | slider | 54 | 被高亮元素序号 |
| `imageCount` | slider | 21 | 图片数量 |
| `imageRatio` | radio | 18 | 图片比例：portrait / landscape / square / auto |
| `chartType` | radio | 17 | 图表类型：bars / donut |
| `showValues` | toggle | 16 | 数值显隐 |
| `metricCount` | slider | 13 | 指标数量 |
| `rowCount` | slider | 11 | 行数 |
| `segmentCount` | slider | 11 | 分段数量 |
| `cardCount` | slider | 9 | 卡片数量 |
| `backgroundVariant` | radio | 6 | 背景变体：gradient / solid / dark |
| `numberSlant` | slider | 6 | 数字倾斜度 |
| `showTags` | toggle | 5 | 标签显隐 |
| `layout` | radio | 5 | 布局：stack / row |
| `auxCount` | slider | 5 | 辅助项数量 |
| `showNote` | toggle | 5 | 注释显隐 |
| `showLens` | toggle | 5 | 镜头/聚焦效果显隐 |

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：71 页
- **独立 slot 数**：71 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由组件内 CSS/控件控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | cover-lean-page | 封面 精益智造 |
| page002 | cover-supply-chain-page | 封面 链通全国 |
| page003 | cover-retail-trend-page | 封面 把握趋势 |
| page004 | cover-supply-strategy-page | 封面 供应链战略 |
| page005 | cover-page | 封面 Cover |

#### 目录 / 摘要 / 研究方法类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | summary-page | 摘要 |
| page007 | contents-page | 目录 |
| page008 | method-page | 研究方法 |

#### 章节过渡类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page016 | chapter-page | 章节页 |
| page046 | capital-chapter-page | 资本章节 |
| page059 | risk-chapter-page | 风险章节 |
| page068 | appendix-chapter-page | 附录章节 |

#### 案例 / 金句 / 收尾类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page009 | case-page | 案例 |
| page015 | quote-page | 引语 |
| page067 | closing-page | 结尾 |
| page069 | forward-page | 展望 |
| page071 | about-lab-page | 关于实验室 |

#### 市场 / 趋势 / 周期类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page010 | monthly-page | 月度 |
| page020 | peak-page | 峰值 |
| page021 | cooldown-page | 降温 |
| page022 | peak-trough-page | 峰谷 |
| page023 | waterfall-page | 瀑布 |
| page024 | deal-size-page | 交易规模 |

#### 排名 / 矩阵 / 风险类（5 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | ranking-page | 排名 |
| page012 | matrix-page | 矩阵 |
| page013 | risk-page | 风险 |
| page014 | outlook-page | 展望 |
| page066 | repricing-page | 重新定价 |

#### 资本 / 交易结构类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page017 | deal-map-page | 交易地图 |
| page018 | cold-start-page | 冷启动 |
| page019 | accelerate-page | 加速 |
| page025 | avg-ticket-page | 平均交易额 |
| page026 | investor-page | 投资人 |
| page027 | active-capital-page | 活跃资本 |
| page028 | concentration-page | 集中度 |
| page029 | syndicate-page | 财团 |

#### 行业 / 技术专题类（14 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page030 | knowledge-page | 知识 |
| page031 | legal-page | 法律 |
| page032 | healthcare-page | 医疗 |
| page033 | finance-page | 金融 |
| page034 | compute-page | 计算 |
| page035 | chip-page | 芯片 |
| page036 | robotics-page | 机器人 |
| page037 | autonomy-page | 自动驾驶 |
| page038 | safety-page | 安全 |
| page039 | content-gen-page | 内容生成 |
| page040 | education-page | 教育 |
| page041 | support-page | 客户支持 |
| page042 | sales-page | 销售 |
| page043 | low-code-page | 低代码 |
| page044 | open-source-page | 开源 |
| page045 | alignment-page | 对齐 |

#### 资本生态 / 地理分布类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page047 | early-stage-page | 早期阶段 |
| page048 | deal-structure-page | 交易结构 |
| page049 | investor-mix-page | 投资人构成 |
| page050 | resource-page | 资源 |
| page051 | alliance-page | 联盟 |
| page052 | ecosystem-page | 生态 |
| page053 | geo-center-page | 地理中心 |
| page054 | region-cluster-page | 区域集群 |
| page055 | resource-triad-page | 资源三元 |

#### 公司案例类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page056 | open-aicase-page | OpenAI 案例 |
| page057 | figure-case-page | Figure 案例 |
| page058 | ssicase-page | SSI 案例 |

#### 风险细分 / 策略类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page060 | revenue-page | 收入 |
| page061 | compliance-page | 合规 |
| page062 | margin-page | 利润 |
| page063 | moat-page | 护城河 |
| page064 | strategy-infra-page | 基础设施战略 |
| page065 | strategy-vertical-page | 垂直战略 |

#### 数据来源类（1 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page070 | sources-page | 来源 |

---

## 四、关键设计特征

### 4.1 冷白机构感

- 以白色/浅灰为底，近黑文字，视觉极度克制
- 强调色饱和度低，主要用于图表、标签、数字
- 与 theme05 的色谱风形成鲜明对比：一个克制，一个张扬

### 4.2 结构化数据呈现

- 大量使用表格、矩阵、排名、瀑布、峰谷图
- 页面布局规整，适合承载大量调研数据

### 4.3 章节驱动叙事

- 4 个明确的章节页 + 1 个附录章节
- 每章内部按「概述 → 数据 → 案例 → 风险/策略」推进

### 4.4 聚焦与镜头效果

- `focusEnabled` / `focusIndex` 用于高亮关键数据点
- `showLens` 提供镜头/放大效果，增强阅读引导

### 4.5 图片比例控制

- `imageRatio` 控制图片为 portrait / landscape / square / auto
- 适合白皮书/调研报告中多样的图文混排

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **冷白机构视觉**：白底深字 + 低饱和强调色，适合智库/咨询/白皮书。
2. **章节驱动结构**：用章节页明确划分报告结构，每章内部数据递进。
3. **聚焦高亮系统**：在密集数据页中聚焦单一数字或节点。
4. **图片比例预设**：为不同内容类型提供固定图片比例，保持排版一致。
5. **背景变体切换**：gradient / solid / dark 三种模式控制页面情绪。
6. **克制图表用色**：避免多色竞争，让单一强调色突出关键信息。

### 5.2 不能复用的东西

- theme07 的具体色值（如 `#8FD400`、`#2F7BFF` 等）
- 71 个 slot 的命名和结构
- 运行时模块中的 CSS 类名与版式
- Dashi PPT 的字体、图标、装饰图片资产
- 中文标签文案与默认演示文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「冷白调研/白皮书」主题，建议：

1. 重新设计一套低饱和色板（例如深靛蓝 + 鼠尾草绿 + 暖灰）。
2. 建立自己的 Token 前缀（例如 `--lp-`）。
3. 先做 6~8 个核心布局：封面、目录、章节页、数据表格、矩阵、案例页、来源页。
4. 聚焦系统先静态后动态，优先保证数据可读性。
5. 图片比例限制在 2~3 种，避免作者自由拖拽破坏网格。
6. 章节页与内容页在版式上有明显区分，建立清晰的阅读节奏。

---

## 六、与 theme01~06 的对比

| 维度 | theme01 | theme02 | theme03 | theme04 | theme05 | theme06 | theme07 |
|---|---|---|---|---|---|---|---|
| **主题名** | 轻拟态风 | 炫光紫绿风 | 深浅代码风 | 玻璃糖果风 | 色谱图表风 | 深色图谱风 | 冷白调研风 |
| **整体亮度** | 浅色底 | 深色底 | 深浅双模式 | 浅色底 | 深色/纸白 | 深色底 | 冷白底 |
| **主色调** | 多色柔和 | 绿/紫霓虹 | 蓝/绿高对比 | 绿/黄/蓝/粉糖果色 | 5 色强调板 | 荧光黄绿/珊瑚/蓝/金黄 | 低饱和绿/蓝/黄 |
| **核心质感** | 玻璃拟态 | 科技光晕 | 编辑式粗体 | 玻璃糖果 | 数据色谱 | 深色图谱 | 冷白机构 |
| **适用场景** | 企业汇报 | 科技发布会 | 技术方案 | 年轻品牌 | 数据分析 | 战略/产业研究 | 白皮书/调研 |
| **页数** | 84 | 74 | 77 | 74 | 94 | 83 | 71 |
| **视觉密度** | 中 | 中 | 高 | 中 | 极高 | 极高 | 高 |
| **核心视觉** | 弥散渐变 | 旋转光边 | 等宽标签 | 糖果胶囊 | 色谱图表 | 节点图谱 | 结构化数据 |

---

## 七、红线提醒

- ❌ 不能复制 `theme07` 运行时模块代码
- ❌ 不能复用 theme07 具体色值与版式
- ❌ 不能复用 theme07 类名体系
- ❌ 不能复用 71 个 slot 的具体实现
- ❌ 不能复用 Dashi PPT 字体、图标、装饰图片资产

✅ 可以学习的是：**冷白机构视觉系统**、**章节驱动叙事**、**数据聚焦机制**、**图片比例控制**、**背景变体切换**。

---

## 八、生成的预览资产

本次分析同步生成了 theme07 全部 71 页的截图画廊：

- **画廊 HTML**：[output/theme07-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme07-all/gallery.html)
- **截图目录**：[output/theme07-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme07-all/screenshots/)
- **主 deck 预览**：[output/theme07-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme07-all/ppt/index.html)
- **分析文档**：[dashi-theme07-analysis.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/dashi-theme07-analysis.md)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
