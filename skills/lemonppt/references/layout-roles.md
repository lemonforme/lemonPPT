# lemonPPT 版式角色速查表

> 本文件由 `scripts/gen-layout-roles-md.mjs` 自动生成，供 AI Agent 选页参考。
> 每页必须有一个 `role`；每个 `role` 下会列出各主题可用的版式及其必填字段。

## 角色总览

- `cover`
- `tableOfContents`
- `metric`
- `stats`
- `chart`
- `comparison`
- `pricing`
- `process`
- `timeline`
- `roadmap`
- `quote`
- `testimonial`
- `content`
- `faq`
- `feature`
- `team`
- `partners`
- `image`
- `gallery`
- `bento`
- `table`
- `tags`
- `filmstrip`
- `swot`
- `pest`
- `closing`

---

## cover

### theme01

- **`theme01_cover_v1`** — Theme 01 封面
  - 描述：弥散渐变背景 + 玻璃质感内容区
  - 媒体槽：封面影像 (image)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `image`: image
- **`theme01_cover_v2`** — Theme 01 封面 V2
  - 描述：双栏编辑式布局 + 玻璃质感内容区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `image`: image
- **`theme01_cover_v3`** — Theme 01 封面 V3
  - 描述：Bento 网格玻璃卡片封面
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `presenter`: text
- **`theme01_cover_v4`** — Theme 01 封面 V4
  - 描述：杂志刊头式封面 + 弥散渐变
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `edition`: text

### theme02

- **`theme02_cover_v1`** — Theme 02 霓虹封面
  - 描述：深色背景 + 霓虹光晕标题 + 装饰光球
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `image`: image
- **`theme02_cover_v2`** — Theme 02 全屏冲击封面
  - 描述：全屏大字号标题 + 动态霓虹背景渐变 + 光球装饰
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `image`: image
- **`theme02_cover_v3`** — Theme 02 霓虹封面 B
  - 描述：居中标题式封面，上下光晕对称
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `date`: text

### theme03

- **`theme03_cover_v1`** — Theme 03 编辑风封面
  - 描述：深色代码编辑风封面，顶部 mono 标签，标题局部强调，右侧大数字，底部元数据
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `metricValue`: text, `metricUnit`: text, `metricLabel`: text, `metricDescription`: textarea, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text, `image`: image
- **`theme03_cover_v2`** — Theme 03 编辑风封面 v2
  - 描述：全宽背景图 + 左侧玻璃卡片封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `image`: image, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_cover_v3`** — Theme 03 编辑风封面 v3
  - 描述：Bento 网格玻璃卡片封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `presenter`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_cover_v4`** — Theme 03 编辑风封面 v4
  - 描述：杂志刊头式封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `date`: text, `edition`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_cover_v1`** — Theme 04 玻璃糖果封面
  - 描述：深色玻璃底 + 糖果色胶囊高光的居中主题封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_cover_index_v1`** — Theme 04 索引导读封面
  - 描述：左侧大标题 + 右侧四列彩色目录卡片封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_cover_ghost_v1`** — Theme 04 幽灵数字封面
  - 描述：超大幽灵数字背景 + 前景标题的糖果风封面
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `ghostNumber`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_cover_bento_v1`** — Theme 04 Bento 封面
  - 描述：居中主题封面 + 底部 2x2 Bento 数据网格
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_cover_magazine_v1`** — Theme 04 杂志封面
  - 描述：杂志风封面：左半区大标题与元数据，右半区焦点图片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `image`: image, `caption`: text, `metadata`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_cover_hero_v1`** — Theme 04 大图英雄封面
  - 描述：全幅背景图 + 渐变遮罩 + 居中杂志化标题的封面变体
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `caption`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme05

- **`theme05_cover_v1`** — Theme 05 光谱封面
  - 描述：编辑感封面：大标题 + 光谱色带 + 右侧关键指标
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme05_cover_ex_v1`** — Theme 05 封面 左文右数
  - 描述：左侧大标题 + 右侧 2×2 数据卡片网格
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme05_cover_ex_v2`** — Theme 05 封面 底部大标题
  - 描述：底部大标题 + 背景幽灵数字 + 顶部色块高亮
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `backgroundNumber`: text, `highlights`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme05_cover_hero_v1`** — Theme 05 封面 大图主视觉
  - 描述：全屏大图背景 + 渐变遮罩 + 底部大标题
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `image`: image, `overlayScheme`: select, `footnoteLeft`: text, `footnoteRight`: text

### theme06

- **`theme06_cover_v1`** — Theme 06 图谱封面
  - 描述：深色图谱封面：左侧大标题 + 右侧封面图片占位区 + 2×2 数据节点卡 + 底部霓虹装饰线
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme06_cover_product_v1`** — Theme 06 产品发布封面
  - 描述：居中大标题 + 霓虹徽章 + 底部 KPI 卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `hero`: text, `title`: text, `subtitle`: textarea, `kpis`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme06_cover_business_v1`** — Theme 06 商业计划封面
  - 描述：左侧标题 + 右侧进度条 KPI 卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `title`: text, `subtitle`: textarea, `bars`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme06_cover_manufacturing_v1`** — Theme 06 精益智造封面
  - 描述：左侧大标题 + 右侧智能制造指标卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `headline`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme06_cover_brand_v1`** — Theme 06 品牌营销封面
  - 描述：品牌标语 + 整合营销渠道环形展示
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `headline`: text, `title`: text, `subtitle`: textarea, `channels`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme07

- **`theme07_cover_v1`** — Theme 07 调研封面
  - 描述：冷白调研封面：左侧衬线大标题 + 右侧封面图 + 2×2 指标卡 + 底部条码装饰
  - 媒体槽：无
  - 字段：`tag`: text, `enTag`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `metrics`: array, `tags`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme07_cover_lean_v1`** — Theme 07 精简封面
  - 描述：左侧标题 + 底部指标卡，结构更紧凑
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `headline`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme07_cover_supply_chain_v1`** — Theme 07 供应链封面
  - 描述：左侧标题 + 右侧供应链节点卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `headline`: text, `title`: text, `subtitle`: textarea, `channels`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme07_cover_retail_trend_v1`** — Theme 07 零售趋势封面
  - 描述：右侧封面图 + 2×2 指标卡，适合消费/零售主题
  - 媒体槽：无
  - 字段：`tag`: text, `enTag`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `metrics`: array, `tags`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme07_cover_supply_strategy_v1`** — Theme 07 供应链战略封面
  - 描述：居中 Hero + 底部 KPI 卡，适合战略主题
  - 媒体槽：无
  - 字段：`imageUrl`: image, `badge`: text, `hero`: text, `title`: text, `subtitle`: textarea, `kpis`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme08

- **`theme08_cover_v1`** — Theme 08 黑金封面
  - 描述：黑金实验封面：左侧大标题 + 荧光金指标卡 + 右侧主视觉图 + 手绘装饰
  - 媒体槽：无
  - 字段：`tag`: text, `enTag`: text, `title`: text, `subtitle`: textarea, `accent`: boolean, `imageUrl`: image, `metrics`: array, `tags`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_cover_v2`** — 黑金封面·居中
  - 描述：黑金实验封面：居中大标题 + 荧光金指标墙
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `tag`: text, `title`: text, `subtitle`: textarea, `stats`: array
- **`theme08_cover_v3`** — 黑金封面·极简
  - 描述：黑金实验封面：底部极简标题 + 手绘装饰
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `tag`: text, `title`: text, `subtitle`: textarea, `stats`: array
- **`theme08_cover_v4`** — 黑金封面·左右
  - 描述：黑金实验封面：左文右视觉的左右分栏
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `tag`: text, `title`: text, `subtitle`: textarea, `stats`: array
- **`theme08_cover_v5`** — 黑金封面·指标墙
  - 描述：黑金实验封面：整页荧光金指标墙
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `tag`: text, `title`: text, `subtitle`: textarea, `stats`: array

### theme09

- **`theme09_cover_masthead_v1`** — Theme 09 刊头封面
  - 描述：报头式刊名 + 期号栏线 + 双栏导语 + 专色色标条，适合特刊/年度报告开篇
  - 媒体槽：无
  - 字段：`title`: text, `issueEn`: text, `issue`: text, `strapline`: text, `straplineEn`: text, `kick`: textarea, `lead`: textarea, `items`: array, `sign`: text
- **`theme09_cover_bleed_v1`** — Theme 09 出血斜切封面
  - 描述：专色斜切出血块 + 竖排刊名 + 大字标题，视觉冲击最强的封面变体
  - 媒体槽：无
  - 字段：`railTop`: text, `vertical`: text, `railFoot`: text, `title`: textarea, `subtitle`: textarea, `metaItems`: array
- **`theme09_cover_dossier_v1`** — Theme 09 卷宗封面
  - 描述：档案袋质感封面：装订孔 + 密级章 + 归档字段 + 手写批注，适合调研/立项文件
  - 媒体槽：无
  - 字段：`classif`: text, `stampNote`: text, `title`: text, `subtitle`: textarea, `fields`: array, `memo`: textarea, `chop`: text, `metaLines`: array
- **`theme09_cover_colorbar_v1`** — Theme 09 色标封面
  - 描述：印刷色标阵列 + 大字明朝体标题 + 规格表，适合设计年鉴/品牌手册
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `specs`: array, `footLeft`: text, `footRight`: text
- **`theme09_cover_aperture_v1`** — Theme 09 圆窗封面
  - 描述：圆形开窗影像 + 网点渐变扩散 + 专色细环，适合人物专访/产品特写开篇
  - 媒体槽：圆窗影像 (imageUrl)
  - 字段：`tag`: text, `title`: textarea, `subtitle`: textarea, `tags`: array, `imageUrl`: image
- **`theme09_cover_colophon_v1`** — Theme 09 版本页封面
  - 描述：版权页式四栏密排信息 + 双线标题带，适合需要交代出品方/参与人的正式文件
  - 媒体槽：无
  - 字段：`title`: text, `titleEn`: text, `cols`: array, `footLeft`: text
- **`theme09_cover_photo_v1`** — Theme 09 影像封面
  - 描述：满版出血影像 + 专色栏目条 + 沉底大字标题，最通用的图片型封面
  - 媒体槽：满版影像 (imageUrl)
  - 字段：`strip`: text, `title`: textarea, `subtitle`: textarea, `metaItems`: array, `imageUrl`: image

### theme10

- **`theme10_cover_dusk_v1`** — Theme 10 暮光对角封面
  - 描述：对角金线切分 + 巨型 mono 标题 + 顶部行情带
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: textarea, `subtitle`: textarea, `ticker`: array, `mood`: select
- **`theme10_cover_field_v1`** — Theme 10 色场分栏封面
  - 描述：左文右渐变色场 + 中缝金线
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: textarea, `subtitle`: textarea, `fieldNo`: text, `fieldLabel`: text, `mood`: select
- **`theme10_cover_atmos_v1`** — Theme 10 满版渐变大字封面
  - 描述：满版大字标题出血 + 英文副标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: textarea, `en`: text, `mood`: select
- **`theme10_cover_horizon_v1`** — Theme 10 地平线封面
  - 描述：地平线渐变 + 底部金线 + 期号
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: textarea, `subtitle`: textarea, `issue`: text, `mood`: select
- **`theme10_cover_standard_v1`** — Theme 10 标准封面
  - 描述：行情带 + 主副标 + 来源戳
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: textarea, `subtitle`: textarea, `stamp`: text, `ticker`: array, `mood`: select
- **`theme10_cover_dawn_v1`** — Theme 10 晨光卡封面
  - 描述：晨光卡 + 角嵌影像
  - 媒体槽：角嵌影像 (imageUrl)
  - 字段：`kicker`: text, `title`: textarea, `subtitle`: textarea, `imageUrl`: image, `mood`: select

## tableOfContents

### theme01

- **`theme01_table_of_contents_v1`** — Theme 01 目录
  - 描述：玻璃卡片目录，带编号与弥散背景
  - 媒体槽：无
  - 字段：`title`: text, `items`: array
- **`theme01_table_of_contents_v2`** — Theme 01 目录 V2
  - 描述：卡片网格目录，带编号与弥散背景
  - 媒体槽：无
  - 字段：`title`: text, `items`: array

### theme02

- **`theme02_table_of_contents_v1`** — Theme 02 霓虹目录
  - 描述：章节导航 + 霓虹编号 + 玻璃卡片
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `items`: array

### theme03

- **`theme03_table_of_contents_v1`** — Theme 03 编辑风目录
  - 描述：深色代码编辑风目录页，章节条目 + 页码
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_table_of_contents_v2`** — Theme 03 编辑风目录 v2
  - 描述：编号列表式目录
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_table_of_contents_v1`** — Theme 04 糖果目录页
  - 描述：左侧标题 + 右侧编号列表，玻璃卡片目录
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: text, `items`: array
- **`theme04_agenda_v1`** — Theme 04 研究框架议程
  - 描述：顶部标题 + 四列彩色 Part 卡片，适合报告框架/议程
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `badge`: text, `items`: array, `footnote`: textarea

### theme05

- **`theme05_table_of_contents_v1`** — Theme 05 光谱目录
  - 描述：网格目录：章节卡片 + 编号
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `items`: array
- **`theme05_table_of_contents_v2`** — Theme 05 编号目录 V2
  - 描述：左侧大标题 + 右侧 01-06 纵向条目
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `items`: array

### theme06

- **`theme06_table_of_contents_v1`** — Theme 06 目录导航
  - 描述：双列目录卡片，章节编号 + 标题 + 页码
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array

### theme07

- **`theme07_table_of_contents_v1`** — Theme 07 调研目录
  - 描述：衬线目录标题 + 2 列大卡片章节条目，卡片带半透明数字水印
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `entries`: array, `footnote`: textarea

### theme08

- **`theme08_contents_v1`** — Theme 08 结构目录
  - 描述：编号目录列表，双列排布，适合议程/结构页
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_contents_v1`** — Theme 09 目录
  - 描述：杂志目录：双栏条目 + 引导点 + 页码骑缝对齐 + 专色当前章高亮
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## metric

### theme01

- **`theme01_metric_big`** — Theme 01 大数字页
  - 描述：核心指标 + 上下文 + 底部指标卡
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: text, `kicker`: text, `value`: text, `unit`: text, `context`: text, `metrics`: array, `footnote`: text
- **`theme01_metric_triptych`** — Theme 01 三指标总览
  - 描述：2~3 个带迷你图表的指标面板
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `panels`: array, `footnote`: text
- **`theme01_metric_v1`** — Theme 01 数据页
  - 描述：超大数字 + 玻璃描述卡片
  - 媒体槽：无
  - 字段：`value`: text, `unit`: text, `description`: textarea
- **`theme01_metric_v2`** — Theme 01 多指标网格
  - 描述：多指标玻璃卡片网格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `metrics`: array
- **`theme01_metric_v3`** — Theme 01 图标大数字
  - 描述：图标 + 大数字 + 说明
  - 媒体槽：无
  - 字段：`value`: text, `unit`: text, `icon`: text, `description`: textarea
- **`theme01_scorecard_v1`** — Theme 01 评分卡
  - 描述：多维度评分卡 + 进度条
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array

### theme02

- **`theme02_metric_big`** — Theme 02 大数字页
  - 描述：霓虹大数字 + 上下文 + 底部指标卡
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: text, `kicker`: text, `value`: text, `unit`: text, `context`: text, `metrics`: array, `footnote`: text, `showInsight`: boolean, `insight`: object
- **`theme02_number_showcase_v1`** — Theme 02 数字秀
  - 描述：单个大数字霓虹发光 + 标题与解读
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `value`: text, `unit`: text, `description`: textarea, `footnote`: text
- **`theme02_delta_v1`** — Theme 02 今昔对照
  - 描述：霓虹数据对比卡，展示关键指标的前后变化
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: text, `items`: array, `footnote`: text, `showInsight`: boolean, `insight`: object
- **`theme02_progress_v1`** — Theme 02 达成度
  - 描述：霓虹进度条组合，展示多项指标的完成度
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: text, `items`: array

### theme03

- **`theme03_metric_big`** — Theme 03 编辑风大数字
  - 描述：深色代码编辑风核心数据页，巨型数字 + insight 面板 + 底部指标
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `value`: text, `unit`: text, `suffix`: text, `label`: text, `description`: textarea, `showInsight`: boolean, `insight`: object, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_ranking_v1`** — Theme 03 编辑风排名
  - 描述：深色代码编辑风排名页，序号 + 名称 + 类别 + 横向进度条 + 数值
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `insightLabel`: text, `insightText`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_number_showcase_v1`** — Theme 03 编辑风数字秀
  - 描述：深色代码编辑风单个大数字秀，光环脉冲装饰
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `description`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_progress_v1`** — Theme 03 编辑风进度条
  - 描述：深色代码编辑风 OKR 进度条，霓虹进度 + 百分比 mono 数字
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_metric_v1`** — Theme 03 编辑风单指标
  - 描述：深色代码编辑风超大单数字指标页
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `value`: text, `unit`: text, `description`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_metric_v2`** — Theme 03 编辑风多指标网格
  - 描述：深色代码编辑风多指标卡片网格
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_metric_v3`** — Theme 03 编辑风图标大数字
  - 描述：深色代码编辑风图标 + 大数字 + 说明
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `value`: text, `unit`: text, `icon`: text, `description`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_metric_triptych`** — Theme 03 编辑风三指标总览
  - 描述：深色代码编辑风 2~3 个带迷你图表的指标面板
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: text, `panels`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_scorecard_v1`** — Theme 03 编辑风评分卡
  - 描述：深色代码编辑风多维度评分卡 + 进度条
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_metric_v1`** — Theme 04 大数字指标页
  - 描述：糖果色主数值 + 玻璃卡片辅助指标网格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `label`: text, `metrics`: array
- **`theme04_metric_big`** — Theme 04 糖果超大指标
  - 描述：玻璃糖果风核心数据页，巨型数字 + insight 面板 + 底部指标
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `value`: text, `unit`: text, `suffix`: text, `label`: text, `description`: textarea, `showInsight`: boolean, `insight`: object, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_ranking_v1`** — Theme 04 头部玩家排名
  - 描述：横向条形图排名，前 N 名带糖果色编号徽章
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme04_gauges_v1`** — Theme 04 三重仪表盘
  - 描述：三个半圆弧形仪表盘，展示集中度/完成度类指标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `gauges`: array
- **`theme04_delta_v1`** — Theme 04 增长指标页
  - 描述：大字号核心数值 + 增长箭头/百分比 + 说明
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `label`: text, `delta`: text, `deltaLabel`: text, `tone`: select
- **`theme04_versus_v1`** — Theme 04 双数对比页
  - 描述：左右大数值对比，中间 VS 徽章
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `left.value`: text, `left.unit`: text, `left.label`: text, `left.tone`: select, `right.value`: text, `right.unit`: text, `right.label`: text, `right.tone`: select, `footnote`: text
- **`theme04_scorecards_v1`** — Theme 04 资本计分卡
  - 描述：多卡计分板，展示核心资本的多个维度
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array, `footnote`: text

### theme05

- **`theme05_metric_v1`** — Theme 05 大数字指标页
  - 描述：主指标 + 4 个辅助指标卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `metrics`: array
- **`theme05_scorecards_v1`** — Theme 05 资本计分卡
  - 描述：顶部标题 + 下方 3-4 个横向计分卡，左侧色条、中间标签、右侧数值与变化
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array
- **`theme05_metric_hero_v1`** — Theme 05 指标 Hero 大数字
  - 描述：全屏居中大数字 + 变化标签 + 副标题
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `change`: text, `changeLabel`: text
- **`theme05_metric_delta_v1`** — Theme 05 增长 Delta 页
  - 描述：当前值 vs 对比值 + 增长标签 + 趋势小图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `currentValue`: text, `currentUnit`: text, `currentLabel`: text, `previousValue`: text, `previousUnit`: text, `previousLabel`: text, `delta`: text, `deltaLabel`: text, `labels`: array, `data`: array
- **`theme05_metric_capacity_v1`** — Theme 05 产能/容量进度
  - 描述：多个进度条展示产能、容量或完成度
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array

### theme06

- **`theme06_metric_hero_v1`** — Theme 06 指标 Hero 大数字
  - 描述：全屏居中大数字 + 霓虹变化徽章 + 副标题
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `change`: text, `changeLabel`: text
- **`theme06_vertical_bar_v1`** — Theme 06 高客单价分段条形页
  - 描述：左侧大数字与支撑指标 + 右侧水平分段条形图，适合垂直赛道/高客单价分析
  - 媒体槽：无
  - 字段：`imageUrl`: image, `topLeftLabel`: text, `topRightLabel`: text, `title`: text, `badge`: text, `value`: text, `unit`: text, `valueLabel`: text, `metrics`: array, `segmentTitle`: text, `segments`: array, `insight`: textarea, `footnote`: text
- **`theme06_metric_grid_v1`** — Theme 06 指标网格
  - 描述：2×2 指标网格卡：数值 + 单位 + 标签 + 变化徽章
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `metrics`: array
- **`theme06_metric_showcase_v1`** — Theme 06 大数字展示
  - 描述：中央超大数字页，适合展示核心里程碑或关键指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `change`: text, `changeLabel`: text, `supporting`: array
- **`theme06_big_number_v1`** — Theme 06 大数字页
  - 描述：超大核心数字 + 解读与支撑指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `number`: text, `unit`: text, `label`: text, `description`: textarea, `supporting`: array

### theme07

- **`theme07_cold_start_v1`** — Theme 07 冷启动指标
  - 描述：超大核心数字 + 解读与支撑指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `number`: text, `unit`: text, `label`: text, `description`: textarea, `supporting`: array
- **`theme07_accelerate_v1`** — Theme 07 加速指标
  - 描述：居中 Hero 大数字 + 变化徽章
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `value`: text, `unit`: text, `change`: text, `changeLabel`: text

### theme08

- **`theme08_metrics_v1`** — Theme 08 指标四宫格
  - 描述：四张指标卡，主指标荧光金高亮，适合业绩/概览
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_metric_big_v1`** — Theme 08 大数字
  - 描述：超大荧光金数字 + 标题解读，强视觉冲击
  - 媒体槽：无
  - 字段：`kicker`: text, `value`: text, `unit`: text, `title`: text, `desc`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_ranking_v1`** — Theme 08 排名列表
  - 描述：纵向排名条目 + 序号 + 数值，适合榜单/排行
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_scorecard_v1`** — Theme 08 记分卡
  - 描述：2×2 指标记分卡，大数字 + 变化箭头 + 描述，主指标荧光金高亮
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_gauge_v1`** — Theme 08 仪表盘
  - 描述：居中大圆环进度 + 中心数字 + 分解指标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `year`: text, `value`: text, `unit`: text, `desc`: textarea, `breakdown`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_gauge_v1`** — 景气仪表
  - 描述：半环仪表盘 + 红黄绿区间色带 + 中心读数，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `value`: number, `min`: number, `max`: number, `ranges`: array, `unit`: text, `readingLabel`: text, `footnoteLeft`: text, `footnoteRight`: text

## stats

### theme01

- **`theme01_stats_v1`** — Theme 01 多指标页
  - 描述：玻璃卡片多指标数据展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `stats`: array

### theme02

- **`theme02_metrics_v1`** — Theme 02 霓虹指标墙
  - 描述：多指标卡片网格 + 霓虹强调
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array, `showInsight`: boolean, `insight`: object
- **`theme02_stats_v1`** — Theme 02 霓虹多指标
  - 描述：深色背景 + 霓虹发光多指标数据卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array, `showInsight`: boolean, `insight`: object
- **`theme02_stat_grid_v1`** — Theme 02 指标网格
  - 描述：数字指标卡片网格，含数值 / 单位 / 标签 / 涨跌
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array
- **`theme02_kpi_strip_v1`** — Theme 02 KPI 条
  - 描述：横向指标卡片条
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `items`: array
- **`theme02_big_stat_v1`** — Theme 02 巨型数字
  - 描述：单一主数据重点展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `value`: text, `unit`: text, `label`: text, `delta`: text, `footnote`: text

### theme03

- **`theme03_metrics_v1`** — Theme 03 编辑风数据墙
  - 描述：深色代码编辑风多指标数据墙，2x2 或横向卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_stats_v1`** — Theme 03 编辑风多指标
  - 描述：深色代码编辑风多指标数据卡片展示
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_stats_v1`** — Theme 04 三联大数字
  - 描述：三列糖果色超大数字指标，适合年度总结关键数据
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnote`: textarea

### theme08

- **`theme08_overview_v1`** — Theme 08 摘要总览
  - 描述：顶部标题 + 三栏数字摘要卡，适合开篇概览
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_radar_v1`** — Theme 08 雷达图
  - 描述：五边形雷达图 + 右侧指标条，适合多维能力对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `axes`: array, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_waterfall_v1`** — Theme 08 瀑布图
  - 描述：浮动累计瀑布图 + 汇总卡片，适合贡献拆分
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `bars`: array, `totalValue`: text, `totalLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_bubble_v1`** — Theme 08 气泡图
  - 描述：按金额区间分组的融资气泡图 + 图例
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `groups`: array, `legend`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_heatmap_v1`** — Theme 08 热力图
  - 描述：12 个月度热力格 + 色阶渐变条
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cells`: array, `scaleMin`: text, `scaleMax`: text, `scaleUnit`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme10

- **`theme10_kpis_v1`** — Theme 10 指标卡
  - 描述：2×2 KPI 大数字指标卡
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_metric_hero_v1`** — Theme 10 英雄指标
  - 描述：单一超大指标 + 涨跌 + 语境
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `label`: text, `value`: text, `unit`: text, `delta`: text, `context`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_scorecard_v1`** — Theme 10 记分卡
  - 描述：多指标评分卡 + 评语
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_comparison_stat_v1`** — Theme 10 对比指标
  - 描述：左右两组大指标对比
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `versus`: text, `left`: object, `right`: object, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_stat_strip_v1`** — Theme 10 指标长条
  - 描述：横向紧凑指标条
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_index_board_v1`** — Theme 10 指数看板
  - 描述：多行指数行情看板
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `lead`: textarea, `rows`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## chart

### theme01

- **`theme01_chart_bar3d`** — Theme 01 3D 柱状图
  - 描述：伪 3D 柱状图，使用光影渐变营造立体冲击感
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `labels`: array, `data`: array
- **`theme01_chart_donut`** — Theme 01 环形图拆解
  - 描述：环形图 + 中心合计 + 右侧分类解读
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: text, `total`: object, `segments`: array, `footnote`: text
- **`theme01_chart_funnel`** — Theme 01 漏斗图
  - 描述：ECharts 漏斗图，适合展示转化漏斗
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `data`: array, `subtitle`: text, `showInsight`: boolean, `insight`: object, `footnote`: text
- **`theme01_chart_gauge`** — Theme 01 仪表盘
  - 描述：ECharts 仪表盘，适合展示完成率、健康度等单一指标
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `value`: number, `min`: number, `max`: number, `unit`: text
- **`theme01_chart_graph`** — Theme 01 关系图
  - 描述：ECharts 关系图，适合展示实体间的关联网络
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `nodes`: array, `links`: array, `categories`: array
- **`theme01_chart_heatmap`** — Theme 01 热力图
  - 描述：ECharts 热力图，适合展示矩阵密度或相关性
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `xAxis`: array, `yAxis`: array, `data`: array
- **`theme01_chart_radar`** — Theme 01 雷达图
  - 描述：ECharts 雷达图，适合展示多维度能力对比
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `indicators`: array, `data`: array
- **`theme01_chart_sankey`** — Theme 01 桑基图
  - 描述：ECharts 桑基图，适合展示流量、资金或转化路径
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `data`: array
- **`theme01_chart_sunburst`** — Theme 01 旭日图
  - 描述：ECharts 旭日图，适合展示层级占比关系
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `data`: array
- **`theme01_chart_treemap`** — Theme 01 矩形树图
  - 描述：ECharts 矩形树图，适合展示赛道/资金流向占比
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `unit`: text, `data`: array
- **`theme01_chart_v1`** — Theme 01 图表页
  - 描述：玻璃卡片 + SVG 图表（柱状/折线/饼图）
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `type`: select, `labels`: array, `data`: array, `unit`: text, `subtitle`: text, `showInsight`: boolean, `insight`: object, `footnote`: text
- **`theme01_chart_wordcloud`** — Theme 01 词云
  - 描述：SVG 词云，适合展示关键词权重分布
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `words`: array, `shape`: text, `colors`: array
- **`theme01_ranking_v1`** — Theme 01 排名条形图
  - 描述：横向条形排名 + 序号 + 数值
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `unit`: text
- **`theme01_trend_v1`** — Theme 01 趋势图
  - 描述：多系列折线/面积趋势图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `series`: array

### theme02

- **`theme02_chart_v1`** — Theme 02 图表页
  - 描述：霓虹图表 + 洞察面板
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `type`: select, `labels`: array, `data`: array, `unit`: text, `subtitle`: text, `showInsight`: boolean, `insight`: object, `footnote`: text
- **`theme02_chart_funnel`** — Theme 02 漏斗图
  - 描述：霓虹漏斗图，适合展示层级收敛与资金集中度
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: text, `data`: array, `showInsight`: boolean, `insight`: object, `footnote`: text
- **`theme02_chart_donut`** — Theme 02 环形图拆解
  - 描述：霓虹环形图 + 中心合计 + 右侧分类解读
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: text, `total`: object, `segments`: array, `showInsight`: boolean, `insight`: object, `footnote`: text
- **`theme02_chart_heatmap`** — Theme 02 热力图
  - 描述：霓虹热力图，适合展示矩阵密度或时间分布
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `xAxis`: array, `yAxis`: array, `data`: array, `showInsight`: boolean, `insight`: object
- **`theme02_chart_radar`** — Theme 02 雷达图
  - 描述：霓虹雷达图，适合展示多维度能力对比
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `indicators`: array, `data`: array, `showInsight`: boolean, `insight`: object
- **`theme02_chart_gauge`** — Theme 02 仪表盘
  - 描述：霓虹仪表盘，适合展示完成率、健康度等单一指标
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `value`: number, `min`: number, `max`: number, `unit`: text, `showInsight`: boolean, `insight`: object
- **`theme02_chart_bar_v1`** — Theme 02 分组柱状图
  - 描述：多系列分组垂直柱状图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `unit`: text, `labels`: array, `series`: array
- **`theme02_chart_line_v1`** — Theme 02 折线图
  - 描述：多系列折线图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `unit`: text, `labels`: array, `series`: array
- **`theme02_chart_area_v1`** — Theme 02 堆叠面积图
  - 描述：多系列堆叠面积图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `unit`: text, `labels`: array, `series`: array
- **`theme02_chart_stack_v1`** — Theme 02 百分比堆叠条
  - 描述：100% 堆叠水平条形图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `unit`: text, `labels`: array, `series`: array

### theme03

- **`theme03_chart_donut`** — Theme 03 编辑风环形图
  - 描述：中性灰阶环形图 + 强调色榜首 + 中心合计 + 右侧图例与洞察
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `total`: object, `segments`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_bar`** — Theme 03 编辑风柱状图
  - 描述：中性灰阶柱状图 + 强调色峰值 + 坐标轴标签 + 右侧洞察
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `unit`: text, `bars`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_v1`** — Theme 03 编辑风通用图表
  - 描述：可切换柱状/折线/面积/饼图的中性灰阶图表
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `data`: array, `unit`: text, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_trend_v1`** — Theme 03 编辑风趋势图
  - 描述：多系列折线/面积趋势图，强调色为首条序列
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `type`: select, `series`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_radar`** — Theme 03 编辑风雷达图
  - 描述：多维度能力对比雷达图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `indicators`: array, `data`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_funnel`** — Theme 03 编辑风漏斗图
  - 描述：转化漏斗 + 可选右侧洞察面板
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `data`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_gauge`** — Theme 03 编辑风仪表盘
  - 描述：单一指标完成率/健康度仪表盘
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `value`: number, `min`: number, `max`: number, `unit`: text, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_heatmap`** — Theme 03 编辑风热力图
  - 描述：矩阵密度或相关性热力图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `xAxis`: array, `yAxis`: array, `data`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_treemap`** — Theme 03 编辑风矩形树图
  - 描述：层级占比矩形树图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `data`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_wordcloud`** — Theme 03 编辑风词云
  - 描述：关键词权重分布（使用水平柱状图回退渲染）
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `words`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_bar3d`** — Theme 03 编辑风 3D 柱状图
  - 描述：伪 3D 柱状图，使用堆叠柱状图营造立体冲击感
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `bars`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_graph`** — Theme 03 编辑风关系图
  - 描述：实体关联网络关系图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `categories`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_sankey`** — Theme 03 编辑风桑基图
  - 描述：流量、资金或转化路径桑基图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `data`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chart_sunburst`** — Theme 03 编辑风旭日图
  - 描述：层级占比旭日图
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `data`: array, `unit`: text, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_chart_v1`** — Theme 04 糖果图表页
  - 描述：柱状/折线图表 + 可选重点强调面板
  - 媒体槽：无
  - 字段：`kicker`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `data`: array, `unit`: text, `showInsight`: boolean, `insight`: object
- **`theme04_chart_donut`** — Theme 04 糖果环形图
  - 描述：糖果色环形图 + 中心合计 + 右侧图例与洞察面板
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `total`: object, `segments`: array, `showInsight`: boolean, `insight`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_radar_v1`** — Theme 04 多维雷达图
  - 描述：糖果色雷达图，适合多维能力对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `datasets`: array, `footnote`: text
- **`theme04_heatmap_v1`** — Theme 04 资金热力矩阵
  - 描述：糖果色热力矩阵，适合资金强度/关注度矩阵展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xLabels`: array, `yLabels`: array, `cells`: array, `colorTone`: select, `footnote`: text
- **`theme04_treemap_v1`** — Theme 04 资金版图树状图
  - 描述：矩形树状图展示赛道/地区/公司资金分布
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme04_groupbars_v1`** — Theme 04 分组柱状图
  - 描述：多系列分组柱状图，对比不同维度数据
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `labels`: array, `series`: array
- **`theme04_scatter_v1`** — Theme 04 估值散点图
  - 描述：散点图展示公司估值与增长率/融资规模的关系
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `unit`: text, `items`: array
- **`theme04_slope_v1`** — Theme 04 排名变迁斜率图
  - 描述：斜率图展示对象在两个时间点的排名变化
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `previousLabel`: text, `currentLabel`: text, `items`: array
- **`theme04_waterfall_v1`** — Theme 04 资金瀑布图
  - 描述：瀑布图展示资金从起点到终点的增减过程
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `startLabel`: text, `startValue`: number, `endLabel`: text, `unit`: text, `items`: array
- **`theme04_region_v1`** — Theme 04 地区分布图
  - 描述：横向条形图展示不同地区/区域的数值分布
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme04_valuechart_v1`** — Theme 04 估值三级跳
  - 描述：三阶段估值跳跃式展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `name`: text, `stages`: array, `footnote`: text
- **`theme04_dumbbell_v1`** — Theme 04 估值跃迁
  - 描述：水平哑铃图展示对象在两个时点的估值/数值跃迁
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `startLabel`: text, `endLabel`: text, `unit`: text, `items`: array
- **`theme04_pyramid_v1`** — Theme 04 估值金字塔
  - 描述：漏斗/金字塔图展示分层估值或筛选漏斗
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme04_monthchart_v1`** — Theme 04 月度趋势图
  - 描述：月度柱状/折线趋势图，适合展示全年走势
  - 媒体槽：无
  - 字段：`kicker`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `data`: array, `unit`: text, `showInsight`: boolean, `insight`: object
- **`theme04_stacked_v1`** — Theme 04 季度资本构成堆叠图
  - 描述：多系列堆叠柱状图，展示季度资本构成变化
  - 媒体槽：无
  - 字段：`kicker`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `labels`: array, `series`: array, `unit`: text, `showInsight`: boolean, `insight`: object
- **`theme04_calendar_v1`** — Theme 04 资本月历
  - 描述：12 个月份网格，展示关键事件与数值标记
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `year`: text, `events`: array, `footnote`: text
- **`theme04_spread_v1`** — Theme 04 资金消长图
  - 描述：双向条形图，展示增减对比或资金流动方向
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `unit`: text, `footnote`: text

### theme05

- **`theme05_chart_v1`** — Theme 05 光谱图表页
  - 描述：柱状/折线趋势图 + 右侧结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusion`: object
- **`theme05_bubble_v1`** — Theme 05 气泡分布图
  - 描述：气泡图展示估值与增速/融资规模的多维关系
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `unit`: text, `items`: array
- **`theme05_map_v1`** — Theme 05 区域分布图
  - 描述：横向条形图展示不同地区/区域的数值分布
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme05_heatmap_v1`** — Theme 05 月度热力矩阵
  - 描述：月度热力矩阵 + 峰值洞察
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `months`: array, `values`: array, `peakLabel`: text
- **`theme05_waterfall_v1`** — Theme 05 瀑布图
  - 描述：瀑布图 + 贡献明细列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `totalLabel`: text
- **`theme05_donut_v1`** — Theme 05 光谱环形图
  - 描述：环形图 + 右侧图例与结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme05_treemap_v1`** — Theme 05 光谱树图
  - 描述：全屏矩形树图展示资金或赛道版图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme05_radar_v1`** — Theme 05 光谱雷达图
  - 描述：雷达图展示多维能力评估
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `indicators`: array, `series`: array
- **`theme05_chart_share_v1`** — Theme 05 占比饼图
  - 描述：饼图 + 底部图例 + 结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_stacked_v1`** — Theme 05 堆叠图
  - 描述：堆叠柱状/面积图 + 右侧结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `series`: array, `unit`: text, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_curve_v1`** — Theme 05 曲线图
  - 描述：平滑曲线图 + 面积填充 + 结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `smooth`: boolean, `showArea`: boolean, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_peak_v1`** — Theme 05 峰值标注图
  - 描述：柱状图 + 峰值高亮标注 + 结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `peakIndex`: number, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_peaktrough_v1`** — Theme 05 峰谷对比图
  - 描述：折线图 + 峰值/谷值标注 + 结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `peakIndex`: number, `troughIndex`: number, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_cumulative_v1`** — Theme 05 累积图
  - 描述：累积面积图 + 当前总计 + 结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_funnel_v1`** — Theme 05 漏斗图
  - 描述：漏斗图展示逐层转化，右侧结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `stages`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme05_chart_gauge_v1`** — Theme 05 环形仪表盘
  - 描述：单个 KPI 完成度/饱和度，中心显示数值
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `value`: number, `min`: number, `max`: number, `unit`: text, `label`: text, `scheme`: select

### theme06

- **`theme06_chart_v1`** — Theme 06 图谱图表页
  - 描述：柱状/折线趋势图 + 右侧洞察卡
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `type`: select, `labels`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusion`: object
- **`theme06_rank_v1`** — Theme 06 Top N 排名
  - 描述：Top N 横向排名列表：序号 + 名称 + 数值 + 变化徽章
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `focusIndex`: slider
- **`theme06_chart_radar_v1`** — Theme 06 雷达图
  - 描述：多维度雷达图 + 右侧洞察卡
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `indicators`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme06_chart_waterfall_v1`** — Theme 06 瀑布图
  - 描述：瀑布图展示增减构成，适合财务/指标拆解
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `values`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme06_chart_peak_v1`** — Theme 06 峰值/峰谷图
  - 描述：折线图峰值/峰谷标注，适合趋势转折点分析
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `showTrough`: boolean, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme06_chart_graph_v1`** — Theme 06 关系图谱
  - 描述：力导向关系网络，展示节点与连接
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `categories`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme06_map_v1`** — Theme 06 区域分布
  - 描述：横向条形图展示不同地区/区域的数值分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array
- **`theme06_chart_heatmap_v1`** — Theme 06 热力图
  - 描述：矩阵热力图，适合展示密度、相关性或强度分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxis`: array, `yAxis`: array, `data`: array
- **`theme06_geo_distribution_v1`** — Theme 06 地理分布
  - 描述：城市/区域分布横向条形图
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `totalLabel`: text
- **`theme06_geo_heatmap_v1`** — Theme 06 地理热力
  - 描述：区域 × 指标热力图
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxis`: array, `yAxis`: array, `data`: array
- **`theme06_ecosystem_graph_v1`** — Theme 06 生态图谱
  - 描述：力导向网络图，展示生态或资本关系
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `categories`: array, `nodes`: array, `links`: array, `conclusion`: textarea
- **`theme06_trend_v1`** — Theme 06 趋势曲线页
  - 描述：折线趋势图 + 底部关键事件标注
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `labels`: array, `data`: array, `events`: array
- **`theme06_cumulative_v1`** — Theme 06 累积面积图页
  - 描述：累积面积图 + 右侧结论卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `labels`: array, `data`: array, `conclusion`: object
- **`theme06_agent_v1`** — Theme 06 Agent 能力图谱
  - 描述：关系网络图 + 右侧图例与结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `categories`: array, `nodes`: array, `links`: array, `conclusion`: object
- **`theme06_quarter_q1_v1`** — Theme 06 Q1 季度分析
  - 描述：Q1 数据图表 + 关键事件与结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `highlight`: text, `conclusion`: textarea
- **`theme06_quarter_q2_v1`** — Theme 06 Q2 季度分析
  - 描述：Q2 数据图表 + 关键事件与结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `highlight`: text, `conclusion`: textarea
- **`theme06_quarter_q3_v1`** — Theme 06 Q3 季度分析
  - 描述：Q3 数据图表 + 关键事件与结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `highlight`: text, `conclusion`: textarea
- **`theme06_quarter_q4_v1`** — Theme 06 Q4 季度分析
  - 描述：Q4 数据图表 + 关键事件与结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `highlight`: text, `conclusion`: textarea
- **`theme06_deal_map_v1`** — Theme 06 交易地图
  - 描述：网络图展示交易关系或资本连接
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `conclusion`: textarea
- **`theme06_size_split_v1`** — Theme 06 规模拆分
  - 描述：玫瑰饼图展示规模结构或份额拆分
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `conclusion`: textarea
- **`theme06_capital_flow_v1`** — Theme 06 资本流向
  - 描述：桑基图展示资本从来源到去向的流向
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `conclusion`: textarea
- **`theme06_region_risk_v1`** — Theme 06 区域风险热力图
  - 描述：区域 × 风险维度的热力矩阵
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `regions`: array, `risks`: array, `items`: array, `conclusion`: textarea
- **`theme06_avg_ticket_v1`** — Theme 06 平均交易额
  - 描述：区间直方图展示交易规模/客单价分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intervals`: array, `values`: array, `unit`: text, `conclusion`: textarea

### theme07

- **`theme07_monthly_v1`** — Theme 07 月度趋势
  - 描述：时间序列折线图，支持多系列对比，适合月度/季度趋势展示
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `series`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme07_waterfall_v1`** — Theme 07 瀑布图
  - 描述：瀑布图展示增减构成，适合财务/指标拆解
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `values`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme07_peak_v1`** — Theme 07 峰值分析
  - 描述：折线图峰值标注，适合趋势转折点分析
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme07_cooldown_v1`** — Theme 07 降温趋势
  - 描述：面积折线图展示下行或回调趋势，支持关键事件标注
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `events`: array, `conclusion`: textarea, `focusIndex`: slider
- **`theme07_peak_trough_v1`** — Theme 07 峰谷分析
  - 描述：同时标注峰值与谷值的折线图，适合周期波动分析
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `labels`: array, `data`: array, `unit`: text, `showConclusion`: boolean, `conclusionValue`: text, `conclusionLabel`: text, `conclusionDescription`: textarea
- **`theme07_deal_size_v1`** — Theme 07 交易规模分布
  - 描述：玫瑰饼图展示交易规模或轮次分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `items`: array, `conclusion`: textarea
- **`theme07_avg_ticket_v1`** — Theme 07 平均交易额
  - 描述：区间直方图展示平均交易额或交易规模分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intervals`: array, `values`: array, `unit`: text, `conclusion`: textarea
- **`theme07_deal_map_v1`** — Theme 07 交易地图
  - 描述：网络图展示交易关系或资本连接
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `conclusion`: textarea
- **`theme07_concentration_v1`** — Theme 07 市场集中度
  - 描述：Top N 横向排名列表，展示资金或份额集中度
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `focusIndex`: slider

### theme08

- **`theme08_chart_bar_v1`** — Theme 08 柱状图
  - 描述：荧光金/玫红双色柱状图 + 数值标签，适合对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `bars`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_chart_donut_v1`** — Theme 08 环形图
  - 描述：多色环形图 + 中心总量 + 图例，适合占比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `centerNum`: text, `centerLabel`: text, `segments`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_dotmatrix_v1`** — 百点阵占比
  - 描述：100 点阵表达占比，专色填充 + 图例，杂志数据可视化语汇
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `percent`: number, `legend`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_market_overview_v1`** — 市场全景
  - 描述：四象限指标概览 + 底部趋势条，墨底专色象限
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `quadrants`: array, `points`: array, `trend`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_streamgraph_v1`** — 资金流带
  - 描述：流带堆叠图，专色主流 + 灰阶辅流，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `dates`: array, `series`: array, `matrix`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_chord_v1`** — 板块联投弦图
  - 描述：圆周弦图，弦用专色半透明叠印，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_sunburst_v1`** — 层级旭日
  - 描述：三层旭日，外圈标签走细体，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `data`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_ribbon_v1`** — 全幅比例带
  - 描述：通栏比例带 + 上下双向标注，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `segments`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_rounds_v1`** — 轮次结构
  - 描述：分组柱 + 轮次标签列，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `rounds`: array, `categories`: array, `matrix`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_ranking_v1`** — 排行榜
  - 描述：条形排行 + 名次徽章 + 涨跌箭头，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_bump_v1`** — 名次变迁
  - 描述：名次连线图，逐年名次穿插交错，首位用朱砂高亮，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `periods`: array, `lines`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_hero_number_v1`** — 核心数字
  - 描述：巨型数字 + 单位 + 三行注解，专色分隔线，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `unit`: text, `subtitle`: textarea, `footnote`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_versus_v1`** — 数字对决
  - 描述：左右巨数对决，中缝朱砂分隔，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `leftLabel`: text, `leftValue`: text, `leftUnit`: text, `rightLabel`: text, `rightValue`: text, `rightUnit`: text, `note`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_spiral_v1`** — 螺旋纪程
  - 描述：螺旋时间线，节点沿弧线由内向外摆放，最新节点用朱砂点亮，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `events`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_funnel_v1`** — 转化漏斗
  - 描述：分层漏斗 + 每层转化率挂栏，首层朱砂，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `stages`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_stat_grid_v1`** — 关键指标
  - 描述：四宫格指标卡，首格朱砂满铺强调，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_arc_v1`** — 弧线网络
  - 描述：单轴弧线连接图，节点排布于基线，弧线在上方跨接，枢纽用朱砂，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_network_v1`** — 关系网络
  - 描述：力导向节点网络，核心节点朱砂放大，卫星节点专色分族，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_area_v1`** — 面积趋势
  - 描述：面积趋势图 + 真值/指数双轴 + 右侧洞察栏，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `dates`: array, `seriesA`: array, `seriesB`: array, `seriesAName`: text, `seriesBName`: text, `insight`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_mega_number_v1`** — 数字海报
  - 描述：单个超巨数字铺满版面，上引语下注解，专色单位，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `unit`: text, `subtitle`: text, `caption`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_radar_v1`** — 多维雷达
  - 描述：六维雷达图，双序列对照，朱砂与青碧叠印，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `indicators`: array, `seriesA`: array, `seriesB`: array, `seriesAName`: text, `seriesBName`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_radialbar_v1`** — 径向条
  - 描述：径向条形图（SVG 扇区），圆心挂汇总数，首项朱砂，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `centerTotal`: text, `centerLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_honeycomb_v1`** — 蜂巢分布
  - 描述：六边形蜂巢矩阵，朱砂浓度分级表示密度，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `cells`: array, `legendLow`: text, `legendHigh`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_tornado_v1`** — 同比对望
  - 描述：左右对称龙卷风条形，去年与今年在零轴两侧对望，纸底专色
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `leftLabel`: text, `rightLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_matrix_v1`** — 估值矩阵
  - 描述：二维矩阵散点 + 四象限底色标签，零轴十字分割，纸底专色
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `xName`: text, `yName`: text, `quadrant1`: text, `quadrant2`: text, `quadrant3`: text, `quadrant4`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_quadrant_v1`** — 定位四象限
  - 描述：四象限气泡定位 + 轴端说明，专色高亮主角标的，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `axisLeft`: text, `axisRight`: text, `axisTop`: text, `axisBottom`: text, `quadrant1`: text, `quadrant2`: text, `quadrant3`: text, `quadrant4`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_bubble_v1`** — 体量聚类
  - 描述：力导向气泡聚类，尺寸映射体量，专色分组，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_marimekko_v1`** — 市占矩形
  - 描述：Marimekko 双维矩形：条带厚度映射盘子大小，内部专色分层占比，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `segments`: array, `rows`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_meter_v1`** — 计量条
  - 描述：多行计量条 + 刻度尺，圆头专色条，首行朱砂高亮，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_parallel_v1`** — 平行坐标
  - 描述：平行坐标多维画像，专色折线穿轴，首个对象朱砂加粗，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `dimensions`: array, `profiles`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_grade_v1`** — 评级矩阵
  - 描述：评级色块矩阵 + 图例，A 级朱砂实心、B/C 专色淡染，纯 HTML 网格，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array, `rows`: array, `legendA`: text, `legendB`: text, `legendC`: text, `legendD`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_slope_v1`** — 斜率对比
  - 描述：两期斜率图 + 端点标签，涨幅最大者朱砂加粗，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `periods`: array, `entities`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_dumbbell_v1`** — 区间哑铃
  - 描述：哑铃图区间对比：期初期末双点 + 连杆 + 差值标注，纸底专色
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `startLabel`: text, `endLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_crosstab_v1`** — 交叉透视
  - 描述：交叉表 + 单元格网点浓度表强弱，细栏线排布，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `corner`: text, `cols`: array, `rows`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_tier_v1`** — 梯队分层
  - 描述：三层梯队金字塔 + 每层成员标签，专色分层，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `tiers`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_ledger_v1`** — 数据台账
  - 描述：账簿式表格：细栏线 + 隔行网点 + 合计行，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `header`: array, `rows`: array, `total`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_alloc_v1`** — 资金用途
  - 描述：环形占比 + 右侧明细列，专色分段，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_venn_v1`** — 交集视图
  - 描述：三圆交集，交叠处专色叠印，纯 SVG 绘制，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `sets`: array, `centerLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_treemap_v1`** — 版图矩形树
  - 描述：矩形树图，面积映射规模，专色分区，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `data`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_icicle_v1`** — 层级冰柱
  - 描述：冰柱层级图，横向展开逐层收束，专色分层，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `data`: array, `levelNames`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_waterfall_v1`** — 资金瀑布
  - 描述：瀑布图 + 增减双色 + 连接虚线，末列为合计，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_heatmap_v1`** — 月度热力
  - 描述：12×N 热力网格，网点浓度映射强弱，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_flow_v1`** — 资金流向
  - 描述：Sankey 流向图 + 左右端标签 + 专色渐变流带，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `nodes`: array, `links`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_trend_v1`** — 季度走势
  - 描述：季度折线 + 同比副轴双 Y 轴，专色主线 + 灰色对比线，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `quarters`: array, `mainSeries`: array, `yoySeries`: array, `mainName`: text, `yoyName`: text, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_histogram_v1`** — 分布直方
  - 描述：无间隙直方分布 + 均值/分位标线 + 正态参考曲线，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `bins`: array, `mean`: number, `quartiles`: array, `showCurve`: boolean, `unit`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_forecast_fan_v1`** — 预测扇形
  - 描述：历史实线 + 预测置信区间扇形渐变 + 右侧影像远景底，墨底
  - 媒体槽：远景影像 (image)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `subtitle`: textarea, `historical`: array, `forecast`: array, `image`: image, `unit`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_stacked_v1`** — 结构演变
  - 描述：百分比堆叠柱状图 + 多期结构对比 + 转折点箭头标注，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `periods`: array, `categories`: array, `series`: array, `annotations`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_score_v1`** — 赛道评分
  - 描述：评分条列 + 权重标注 + 加权总分自动折算，纯 CSS 条形，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `criteria`: array, `totalScore`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme10

- **`theme10_bar_v1`** — Theme 10 柱状图
  - 描述：竖向柱状图（单序列峰值高亮 / 多序列分组）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_hbar_v1`** — Theme 10 排名条
  - 描述：横向排名条形图（降序）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_line_v1`** — Theme 10 折线图
  - 描述：多序列折线趋势图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_area_v1`** — Theme 10 面积图
  - 描述：单序列面积图（渐变填充）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_grouped_v1`** — Theme 10 分组柱状图
  - 描述：多序列簇状柱状图（柱顶数值）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_stack_v1`** — Theme 10 堆叠柱状图
  - 描述：多序列堆叠柱状图（柱顶合计）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_donut_v1`** — Theme 10 环形图
  - 描述：单序列占比环形图（圆心合计）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `centerLabel`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_pie_v1`** — Theme 10 饼图
  - 描述：单序列占比饼图（全扇区）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_waterfall_v1`** — Theme 10 瀑布图
  - 描述：浮动柱瀑布图（增减累积）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_scatter_v1`** — Theme 10 散点图
  - 描述：多序列散点分布（x/y 数值轴）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `xLabel`: text, `yLabel`: text, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_bubble_v1`** — Theme 10 气泡图
  - 描述：三维气泡（x/y/尺寸）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `xLabel`: text, `yLabel`: text, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_radar_v1`** — Theme 10 雷达图
  - 描述：多维度雷达（多边形）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `axes`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_radial_v1`** — Theme 10 径向图
  - 描述：径向雷达（半径编码数值）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_heat_v1`** — Theme 10 热力图
  - 描述：行×列矩阵热力
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `rows`: array, `cols`: array, `values`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_trend_v1`** — Theme 10 趋势
  - 描述：时间序列趋势（面积+折线）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `series`: array, `unit`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_range_v1`** — Theme 10 区间
  - 描述：浮动区间带（低-高-中）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `items`: array, `unit`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_candlestick_v1`** — Theme 10 K线
  - 描述：OHLC 蜡烛图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `categories`: array, `items`: array, `unit`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_ridgeline_v1`** — Theme 10 山脊线
  - 描述：叠加密度曲线（joyplot）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `axis`: array, `series`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_calendar_v1`** — Theme 10 日历热力
  - 描述：GitHub 式贡献日历
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `year`: number, `weeks`: number, `values`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_funnel_v1`** — Theme 10 漏斗图
  - 描述：逐层收窄的转化漏斗（层宽 ∝ 数值）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_gauge_v1`** — Theme 10 仪表盘
  - 描述：单值 KPI 仪表盘
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `value`: number, `unit`: text, `gaugeLabel`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_bullet_v1`** — Theme 10 子弹图
  - 描述：实际值条 + 目标刻度线（绩效 vs 目标）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_box_v1`** — Theme 10 箱线图
  - 描述：箱线图（最小/四分位/中位/最大）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_treemap_v1`** — Theme 10 矩形树图
  - 描述：矩形树图（面积 ∝ 数值）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_sankey_v1`** — Theme 10 桑基流图
  - 描述：多阶段流向与转化
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `links`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_dumbbell_v1`** — Theme 10 哑铃对比图
  - 描述：两项指标的哑铃对照
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `startLabel`: text, `endLabel`: text, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_histogram_v1`** — Theme 10 直方图
  - 描述：已分箱频次分布
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `xLabel`: text, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_slope_v1`** — Theme 10 斜率图
  - 描述：两时点变化的斜率对照
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `beforeLabel`: text, `afterLabel`: text, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_waffle_v1`** — Theme 10 华夫百分比图
  - 描述：占比的方块网格（一格=1%）
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_gantt_v1`** — Theme 10 甘特排期图
  - 描述：任务工期排期甘特图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `tasks`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_bump_v1`** — Theme 10 排名变迁图
  - 描述：名次随时间变化的凹凸图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `periodLabels`: array, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_rose_v1`** — Theme 10 南丁格尔玫瑰图
  - 描述：等角变半径的极坐标面积图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_dotplot_v1`** — Theme 10 点阵分布图
  - 描述：单变量点分布对照
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_timeline_v1`** — Theme 10 里程碑时间轴
  - 描述：关键节点时间轴
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `events`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_orgchart_v1`** — Theme 10 组织层级图
  - 描述：层级结构组织图
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `rootName`: text, `rootRole`: text, `children`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_parallel_v1`** — Theme 10 平行坐标图
  - 描述：多变量平行坐标
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `axes`: array, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_circlepack_v1`** — Theme 10 圆填充图
  - 描述：按面积编码的圆形占比
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_cscatter_v1`** — Theme 10 连接散点图
  - 描述：有序连接的散点路径
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `xLabel`: text, `yLabel`: text, `points`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_marimekko_v1`** — Theme 10 马赛克图
  - 描述：宽度×高度的双变量马赛克
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `lead`: textarea, `items`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_small_multiples_v1`** — Theme 10 小多图
  - 描述：迷你图表网格（多 echarts 实例）
  - 媒体槽：无
  - 字段：`section`: text, `title`: text, `lead`: textarea, `panels`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## comparison

### theme01

- **`theme01_comparison_v1`** — Theme 01 左右对比
  - 描述：玻璃卡片左右两栏对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `leftTitle`: text, `leftPoints`: array, `rightTitle`: text, `rightPoints`: array
- **`theme01_comparison_v2`** — Theme 01 评分卡对比
  - 描述：多维度评分卡并排对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `cards`: array
- **`theme01_comparison_v3`** — Theme 01 横向对比表
  - 描述：玻璃卡片横向逐项对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `leftTitle`: text, `rightTitle`: text, `rows`: array
- **`theme01_diptych_contrast`** — Theme 01 双联对比
  - 描述：左右双区对比 + 中央结论卡
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `left`: object, `right`: object, `centerCard`: object, `footnote`: text
- **`theme01_quadrant_v1`** — Theme 01 四象限分析
  - 描述：2x2 矩阵四象限分析
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `xAxis`: text, `yAxis`: text, `quadrants`: array

### theme02

- **`theme02_comparison_v1`** — Theme 02 霓虹对比
  - 描述：左右双栏对比 + 霓虹强调
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `rightTitle`: text, `leftItems`: array, `rightItems`: array
- **`theme02_comparison_v2`** — Theme 02 双栏对比
  - 描述：左右两栏对照，每栏带要点列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array
- **`theme02_matrix_v1`** — Theme 02 四象限矩阵
  - 描述：2x2 象限矩阵，带坐标轴标签
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `axisX`: text, `axisY`: text, `quadrants`: array

### theme03

- **`theme03_comparison_v1`** — Theme 03 编辑风对比
  - 描述：深色代码编辑风左右双栏对比页
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `rightTitle`: text, `leftItems`: array, `rightItems`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_quadrant_v1`** — Theme 03 编辑风象限
  - 描述：深色代码编辑风 2×2 战略象限，scheme 三色区分
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `xAxis`: text, `yAxis`: text, `quadrants`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_diptych_contrast`** — Theme 03 编辑风双联对比
  - 描述：深色代码编辑风左右双区对比 + 中央结论卡
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `left`: object, `right`: object, `centerCard`: object, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_comparison_v2`** — Theme 03 编辑风评分卡对比
  - 描述：多维度评分卡并排对比
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_comparison_v3`** — Theme 03 编辑风横向对比表
  - 描述：横向逐项对比表
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `rightTitle`: text, `rows`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_comparison_v1`** — Theme 04 双栏策略对比
  - 描述：左右两栏糖果色玻璃卡片，适合投资策略/优劣对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `sides`: array
- **`theme04_quadrant_v1`** — Theme 04 选题四象限
  - 描述：2×2 玻璃糖果色象限矩阵，适合定位/策略分析
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `xAxisLabels`: array, `yAxisLabel`: text, `yAxisLabels`: array, `quadrants`: array

### theme05

- **`theme05_versus_v1`** — Theme 05 双数对比页
  - 描述：左右大数值对比，中间 VS 徽章，光谱色卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `left.value`: text, `left.unit`: text, `left.label`: text, `left.scheme`: select, `right.value`: text, `right.unit`: text, `right.label`: text, `right.scheme`: select, `footnote`: text
- **`theme05_quadrant_v1`** — Theme 05 选题四象限
  - 描述：2×2 光谱色象限矩阵，适合定位/策略分析
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `xAxisLabels`: array, `yAxisLabel`: text, `yAxisLabels`: array, `quadrants`: array, `footnote`: text
- **`theme05_comparison_v1`** — Theme 05 左右对比
  - 描述：左右双栏 A/B 对比，顶部不同 scheme 色条，中间 VS 徽章
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `leftItems`: array, `leftScheme`: select, `rightTitle`: text, `rightItems`: array, `rightScheme`: select, `vsLabel`: text

### theme06

- **`theme06_company_comparison_v1`** — Theme 06 多公司对比
  - 描述：多公司在关键维度上的横向对比表
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `dimensions`: array, `companies`: array

### theme08

- **`theme08_compare_v1`** — Theme 08 双栏对比
  - 描述：左右两栏对照，荧光金/玫红区分，适合对比/权衡
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_range_v1`** — Theme 08 范围图
  - 描述：哑铃/范围图，每行展示单笔规模低值与高值区间及跨度倍数，适合分化/对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `midLabel`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_cross_perspective_v1`** — 横向透视
  - 描述：多维横向对照条 + 右侧结论侧栏，专色分维，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `dimensions`: array, `conclusion`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme09_plans_v1`** — 方案对照
  - 描述：三方案对照卡 + 要点列表 + 推荐项专色描边 + 底部结论栏，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `plans`: array, `conclusion`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_compare_v1`** — 多维对比
  - 描述：双列对比 + 两处顶部影像 + 逐维对照行 + 占优侧专色高亮，纸底
  - 媒体槽：左侧影像 (leftImage), 右侧影像 (rightImage)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `leftTitle`: text, `rightTitle`: text, `leftImage`: image, `rightImage`: image, `dimensions`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_compareimg_v1`** — Theme 10 对照双图
  - 描述：左右双图对照 + 角标图注
  - 媒体槽：对照图 1 (images.0.url), 对照图 2 (images.1.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## pricing

### theme01

- **`theme01_pricing_v1`** — Theme 01 价格方案
  - 描述：玻璃质感三列价格方案对比，突出推荐方案
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `tiers`: array

### theme02

- **`theme02_pricing_v1`** — Theme 02 霓虹定价
  - 描述：深色背景 + 霓虹边框三列价格方案对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `tiers`: array

### theme03

- **`theme03_pricing_v1`** — Theme 03 编辑风定价
  - 描述：深色代码编辑风定价页，三列/四列套餐卡片对比
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `tiers`: array, `footnoteLeft`: text, `footnoteRight`: text

## process

### theme01

- **`theme01_process_v1`** — Theme 01 横向流程
  - 描述：玻璃卡片横向步骤流程
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `steps`: array

### theme02

- **`theme02_process_v1`** — Theme 02 霓虹流程
  - 描述：横向步骤流程 + 霓虹节点与连线
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array
- **`theme02_steps_v1`** — Theme 02 编号步骤
  - 描述：横向编号步骤条，带连接线与序号光环
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array
- **`theme02_cycle_v1`** — Theme 02 循环图
  - 描述：环形循环流程
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `steps`: array
- **`theme02_swimlane_v1`** — Theme 02 泳道图
  - 描述：阶段 × 泳道矩阵
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `phases`: array, `lanes`: array
- **`theme02_flow_v1`** — Theme 02 横向流程
  - 描述：步骤卡片水平流向
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `steps`: array

### theme03

- **`theme03_process_v1`** — Theme 03 编辑风流程
  - 描述：横向步骤流程 + mono 编号节点 + 连接线 + 底部页脚
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_process_v1`** — Theme 04 糖果流程页
  - 描述：横向步骤流程 + 糖果色编号节点 + 连接线 + 底部页脚
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_layers_v1`** — Theme 04 分层架构
  - 描述：金字塔/分层架构图，展示层级关系
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `layers`: array, `footnote`: text
- **`theme04_riskchain_v1`** — Theme 04 风险传导链
  - 描述：横向风险节点链，展示风险传导路径与影响等级
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `risks`: array, `footnote`: text
- **`theme04_metro_v1`** — Theme 04 资本地铁线
  - 描述：地铁线路式流程图，展示关键站点与阶段目标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `lineLabel`: text, `stops`: array, `footnote`: text
- **`theme04_chainflow_v1`** — Theme 04 产业链流向
  - 描述：横向节点+箭头连接，展示产业链各环节流向
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: text

### theme05

- **`theme05_process_v1`** — Theme 05 流程步骤页
  - 描述：横向步骤流程 + 光谱编号节点 + 连接线 + 底部页脚
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme05_roadmap_v1`** — Theme 05 路线图
  - 描述：横向时间轴式路线图，3-4 个光谱阶段节点
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array
- **`theme05_process_v2`** — Theme 05 垂直流程 V2
  - 描述：4-6 步垂直卡片流程，步骤间用箭头连接
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array

### theme06

- **`theme06_process_v1`** — Theme 06 流程步骤
  - 描述：横向霓虹步骤流程，适合实施路径与方法论展示
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: text
- **`theme06_chain_flow_v1`** — Theme 06 产业链流向
  - 描述：横向节点链，适合展示产业链、资本流或流程阶段
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: textarea
- **`theme06_search_v1`** — Theme 06 检索流程图
  - 描述：检索流程步骤 + 输入输出标签
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array

### theme08

- **`theme08_process_v1`** — Theme 08 流程步骤
  - 描述：横向流程步骤 + 箭头连接，适合方法论/管线
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_thesis_v1`** — 论点推演
  - 描述：论点→论据→结论三段推演，编号圆章 + 专色箭头衔接，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `steps`: array, `conclusion`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_value_chain_v1`** — 产业链分层
  - 描述：上中下游三列环节卡 + 列间专色箭头串联，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `upstreamLabel`: text, `midstreamLabel`: text, `downstreamLabel`: text, `upstream`: array, `midstream`: array, `downstream`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_stair_v1`** — 阶梯递进
  - 描述：左下到右上的阶梯台阶 + 步骤名与描述 + 可选图标，纯 CSS，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `steps`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_process_v1`** — 实施路径
  - 描述：五步流程横向排列 + 步间箭头衔接 + 起步影像圆窗，纸底
  - 媒体槽：起步影像 (startImage)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `steps`: array, `startImage`: image, `startCaption`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## timeline

### theme01

- **`theme01_gantt_v1`** — Theme 01 甘特图
  - 描述：横向时间条甘特排期
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `phases`: array, `tasks`: array
- **`theme01_timeline_v1`** — Theme 01 时间轴
  - 描述：横向玻璃卡片时间轴
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `events`: array

### theme02

- **`theme02_timeline_v1`** — Theme 02 霓虹时间轴
  - 描述：横向时间轴 + 霓虹节点 + 玻璃卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `milestones`: array

### theme03

- **`theme03_timeline_v1`** — Theme 03 编辑风时间轴
  - 描述：横向时间轴 + mono 日期节点 + 上下交错卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `milestones`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_gantt_v1`** — Theme 03 编辑风甘特图
  - 描述：深色代码编辑风横向时间条甘特排期
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `phases`: array, `tasks`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_timeline_v1`** — Theme 04 阶段策略时间线
  - 描述：顶部时间轴节点 + 三列玻璃卡片，适合阶段策略
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array

### theme05

- **`theme05_timeline_v1`** — Theme 05 阶段策略时间线
  - 描述：顶部时间轴节点 + 三列数据卡片，适合阶段策略
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array, `footnote`: text

### theme06

- **`theme06_timeline_v1`** — Theme 06 阶段时间线
  - 描述：横向时间轴 + 阶段卡片，适合里程碑与策略节奏
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array, `footnote`: text
- **`theme06_milestone_v1`** — Theme 06 里程碑时间轴
  - 描述：横向里程碑时间轴，适合 IPO、融资或产品路线图
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `milestones`: array
- **`theme06_company_rounds_v1`** — Theme 06 公司融资轮次时间轴
  - 描述：公司名 + 标语 + 融资轮次时间轴
  - 媒体槽：无
  - 字段：`imageUrl`: image, `company`: text, `tagline`: textarea, `rounds`: array

### theme07

- **`theme07_repricing_v1`** — Theme 07 重定价时间线
  - 描述：横向时间线展示估值重定价或周期阶段
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array, `footnote`: textarea, `focusIndex`: slider
- **`theme07_active_capital_v1`** — Theme 07 活跃资本轮次
  - 描述：展示典型公司或赛道的融资轮次时间轴
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `company`: text, `tagline`: text, `rounds`: array, `focusIndex`: slider

### theme08

- **`theme08_timeline_v1`** — Theme 08 时间轴
  - 描述：纵向年度时间轴 + 节点卡片，适合历程/里程碑
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_timeline_photo_v1`** — Theme 09 影像编年
  - 描述：左侧年份主轴 + 右侧四段影像卡片，大事记 / 里程碑栏
  - 媒体槽：影像 1 (images.0.url), 影像 2 (images.1.url), 影像 3 (images.2.url), 影像 4 (images.3.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_journey_v1`** — Theme 09 影像纪程
  - 描述：弧线路径串起影像节点 + 底部时间轴，纪程 / 资本之年栏
  - 媒体槽：节点影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `nodes`: text, `images`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_orbit_v1`** — 环形纪程
  - 描述：同心环时间线 + 环上节点年份标注 + 环心主题，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `centerText`: text, `events`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_calendar_v1`** — 投资日历
  - 描述：月历网格 + 事件圆点标记 + 类别图例，纯 CSS grid，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `year`: number, `month`: number, `events`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_era_v1`** — 编年纪事
  - 描述：年代分栏纵向时间线 + 每栏 2–4 条事件 + 两处影像插图位，墨底
  - 媒体槽：年代影像 1 (eras.0.image), 年代影像 2 (eras.2.image)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `eras`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## roadmap

### theme01

- **`theme01_roadmap_v1`** — Theme 01 路线图
  - 描述：分阶段玻璃卡片路线图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `phases`: array

### theme02

- **`theme02_roadmap_v1`** — Theme 02 霓虹路线
  - 描述：分阶段玻璃卡片路线图 + 霓虹时间轴
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `phases`: array

### theme03

- **`theme03_roadmap_v1`** — Theme 03 编辑风路线图
  - 描述：分阶段横向路线图 + mono 编号节点 + 子项清单
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `phases`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_roadmap_v1`** — Theme 04 资本三段式路线图
  - 描述：三个阶梯上升的彩色卡片，适合资本节奏/阶段路线
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: textarea
- **`theme04_gantt_v1`** — Theme 04 泳道甘特
  - 描述：横向泳道甘特图，适合项目计划与资本节奏
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `periods`: array, `lanes`: array, `footnote`: text

### theme08

- **`theme08_roadmap_v1`** — Theme 08 路线图
  - 描述：四阶段路线图 + 目标 + 要点列表，适合规划
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_phases_v1`** — 阶段时序
  - 描述：横向阶段条时间线 + 菱形里程碑节点 + 时间范围标注，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `phases`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_roadmap_v1`** — 布局路线
  - 描述：横向路线图分期节点 + 阶段状态标签 + 终点影像圆窗，纸底
  - 媒体槽：终点影像 (endImage)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `stages`: array, `endImage`: image, `endCaption`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## quote

### theme01

- **`theme01_quote_v1`** — Theme 01 引用页
  - 描述：居中引用 + 玻璃卡片
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text
- **`theme01_quote_v2`** — Theme 01 引述卡片
  - 描述：左侧大引号 + 右侧玻璃卡片内容
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text, `role`: text, `source`: text
- **`theme01_quote_v3`** — Theme 01 大字金句
  - 描述：全屏大字引用 + 底部作者信息
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text, `role`: text

### theme02

- **`theme02_quote_v1`** — Theme 02 霓虹金句
  - 描述：大号引用 + 头像署名 + 霓虹引号
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text, `role`: text, `avatar`: image
- **`theme02_quote_v2`** — Theme 02 霓虹引述
  - 描述：居中名言 + 霓虹引号装饰 + 玻璃卡片
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text, `role`: text, `source`: text

### theme03

- **`theme03_quote_v1`** — Theme 03 编辑风金句页
  - 描述：深色代码编辑风金句页，几何引号装饰 + 局部强调色
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `quote`: textarea, `author`: text, `title`: text, `source`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_quote_v2`** — Theme 03 编辑风引述卡片
  - 描述：左侧大引号 + 右侧玻璃卡片内容
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `quote`: textarea, `author`: text, `role`: text, `source`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_quote_v3`** — Theme 03 编辑风大字金句
  - 描述：全屏大字引用 + 底部作者信息
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `quote`: textarea, `author`: text, `role`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_quote_v1`** — Theme 04 糖果金句页
  - 描述：大号引号装饰 + 人物信息 + 焦点图片
  - 媒体槽：无
  - 字段：`kicker`: text, `quote`: textarea, `author`: text, `role`: text, `image`: image
- **`theme04_image_quote_v1`** — Theme 04 图文金句/论断印章
  - 描述：左侧大段引用文字 + 右侧圆形印章数字
  - 媒体槽：无
  - 字段：`kicker`: text, `quote`: textarea, `source`: textarea, `author`: text, `value`: text, `unit`: text, `valueLabel`: text, `footnote`: text
- **`theme04_voices_v1`** — Theme 04 投资人说
  - 描述：2-3 段并列引用，展示多方观点与共识
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `voices`: array, `footnote`: text

### theme05

- **`theme05_quote_v1`** — Theme 05 金句页
  - 描述：左侧光谱竖条 + 引用文字
  - 媒体槽：无
  - 字段：`quote`: textarea, `source`: text
- **`theme05_quote_v2`** — Theme 05 主张页 V2
  - 描述：大引号装饰 + 关键论断 + 作者/来源
  - 媒体槽：无
  - 字段：`quote`: textarea, `author`: text, `source`: text, `accentScheme`: select

### theme06

- **`theme06_quote_v1`** — Theme 06 金句页
  - 描述：左侧霓虹竖条 + 引言 + 来源
  - 媒体槽：无
  - 字段：`imageUrl`: image, `quote`: textarea, `source`: text

### theme08

- **`theme08_quote_v1`** — Theme 08 金句主张
  - 描述：超大主张文字 + 署名，荧光金强调，适合金句/价值观页
  - 媒体槽：无
  - 字段：`kicker`: text, `text`: textarea, `author`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_quote_statement_v1`** — 金句·主张
  - 描述：金句页：一句话强主张
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `kicker`: text, `quote`: textarea, `fieldA`: textarea, `cite`: text
- **`theme08_quote_resources_v1`** — 金句·资源
  - 描述：金句页：资源向主张
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `kicker`: text, `quote`: textarea, `fieldA`: textarea, `cite`: text
- **`theme08_quote_verdict_v1`** — 金句·结论
  - 描述：金句页：结论型主张
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `kicker`: text, `quote`: textarea, `fieldA`: textarea, `cite`: text
- **`theme08_quote_twofield_v1`** — 金句·双栏
  - 描述：金句页：左右双栏对照
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `kicker`: text, `quote`: textarea, `fieldA`: textarea, `cite`: text
- **`theme08_quote_manifesto_v1`** — 金句·宣言
  - 描述：金句页：宣言式多行主张
  - 媒体槽：无
  - 字段：`footerLeft`: text, `footerRight`: text, `kicker`: text, `quote`: textarea, `fieldA`: textarea, `cite`: text

### theme09

- **`theme09_photo_quote_v1`** — Theme 09 影像金句
  - 描述：满版影像 + 整面压暗蒙版 + 大字引文与出处，人物引述 / 观点页
  - 媒体槽：金句影像 (imageUrl)
  - 字段：`quote`: textarea, `attribution`: text, `attributionEn`: text, `metaItems`: array, `imageUrl`: image
- **`theme09_epigraph_v1`** — Theme 09 卷首题词
  - 描述：纯文字卷首题词，大字衬线引文 + 首字下沉 + 出处，章节题词页
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `quote`: textarea, `attribution`: text, `attributionEn`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_quote_portrait_v1`** — Theme 09 人物引述
  - 描述：左肖像出血 + 右侧巨型引号与引语
  - 媒体槽：人物肖像 (images)
  - 字段：`mark`: text, `quote`: textarea, `attribution`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_typeriver_v1`** — Theme 09 字流版面
  - 描述：巨字层叠字流 + 专色高亮关键词，标语字阵 / 关键词云栏
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: textarea, `lines`: text, `highlights`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_statement_v1`** — Theme 10 声明金句
  - 描述：满版金句 + mono 落款
  - 媒体槽：无
  - 字段：`word`: textarea, `sign`: text, `mood`: select
- **`theme10_quote_v1`** — Theme 10 引言
  - 描述：巨型引号 + mono 署名
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `quote`: textarea, `sign`: text, `source`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_quoteimg_v1`** — Theme 10 引言图
  - 描述：满版影像 + 居中大引述
  - 媒体槽：引言底图 (imageUrl)
  - 字段：`section`: text, `mark`: text, `quote`: textarea, `attribution`: text, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_quote_stat_v1`** — Theme 10 金句指标
  - 描述：金句 + 嵌入式高亮指标
  - 媒体槽：无
  - 字段：`section`: text, `quote`: textarea, `sign`: text, `statLabel`: text, `statValue`: text, `statUnit`: text, `statDelta`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## testimonial

### theme01

- **`theme01_testimonial_v1`** — Theme 01 客户评价
  - 描述：玻璃质感大字引用配头像与作者信息
  - 媒体槽：无
  - 字段：`kicker`: text, `quote`: textarea, `author`: text, `role`: text, `company`: text, `avatarUrl`: image

### theme02

- **`theme02_testimonial_v1`** — Theme 02 霓虹金句
  - 描述：深色背景 + 霓虹大字引用配头像
  - 媒体槽：无
  - 字段：`kicker`: text, `quote`: textarea, `author`: text, `role`: text, `company`: text, `avatarUrl`: image

### theme03

- **`theme03_testimonial_v1`** — Theme 03 编辑风证言
  - 描述：深色代码编辑风客户证言，大引号 + 头像 + mono 身份线
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `quote`: textarea, `author`: text, `role`: text, `company`: text, `avatarUrl`: image, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_testimonial_v1`** — Theme 09 人物证言
  - 描述：网点半调肖像 + 大字证言 + 署名职务，用户之声 / 访谈栏
  - 媒体槽：人物肖像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `quote`: textarea, `name`: text, `role`: text, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_testimonials_v1`** — Theme 10 引述清单
  - 描述：主引述卡（头像）+ 三联短引述
  - 媒体槽：主引述头像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `quote`: textarea, `name`: text, `title`: text, `source`: text, `imageUrl`: image, `quotes`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## content

### theme01

- **`theme01_appendix_v1`** — Theme 01 附录页
  - 描述：数据来源与参考资料列表
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `sources`: array
- **`theme01_bento_v1`** — Theme 01 Bento 网格
  - 描述：大小不一的玻璃卡片 Bento 布局
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array
- **`theme01_chapter_v1`** — Theme 01 章节页
  - 描述：弥散渐变章节过渡页
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea
- **`theme01_chapter_v2`** — Theme 01 章节页 v2
  - 描述：左侧大编号 + 右侧标题的章节过渡页
  - 媒体槽：无
  - 字段：`number`: text, `kicker`: text, `title`: text, `subtitle`: textarea
- **`theme01_chapter_v3`** — Theme 01 章节页 V3
  - 描述：全宽背景图 + 玻璃卡片标题
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `imageAlt`: image
- **`theme01_case_study`** — Theme 01 案例详情
  - 描述：案例标题 + 简介 + 融资时间线 + 引用
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: text, `kicker`: text, `intro`: textarea, `rounds`: array, `quote`: textarea, `quoteAuthor`: text, `footnote`: text
- **`theme01_content_v1`** — Theme 01 内容页
  - 描述：玻璃卡片 + 圆点列表
  - 媒体槽：无
  - 字段：`title`: text, `bullets`: array
- **`theme01_content_v2`** — Theme 01 双栏内容
  - 描述：玻璃卡片双栏要点展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `leftPoints`: array, `rightPoints`: array
- **`theme01_content_v3`** — Theme 01 三栏内容
  - 描述：玻璃卡片三栏内容展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `columns`: array
- **`theme01_content_v4`** — Theme 01 大字主张
  - 描述：全屏大字主张页 + 玻璃卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea
- **`theme01_outlook_v1`** — Theme 01 投资展望
  - 描述：标题 + 趋势判断 + 行动建议
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array
- **`theme01_region_v1`** — Theme 01 地区/市场分布
  - 描述：多地区数据卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `regions`: array
- **`theme01_risk_v1`** — Theme 01 风险研判
  - 描述：风险列表 + 影响程度 + 应对策略
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array
- **`theme01_spotlight_grid`** — Theme 01 主题聚焦网格
  - 描述：2~4 列并列展示主题、案例或分论点
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `columns`: array, `footnote`: text
- **`theme01_components_v1`** — Theme 01 设计系统
  - 描述：暖炭暗色编辑风 · 组件与版式系统总览（基底 / 强调 / 标签 / 聚光 / 卡片 / 图表）
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text

### theme02

- **`theme02_chapter_v1`** — Theme 02 章节页
  - 描述：大号章节序号 + 霓虹分隔线 + 深色背景
  - 媒体槽：无
  - 字段：`kicker`: text, `number`: text, `title`: text, `subtitle`: textarea
- **`theme02_chapter_v2`** — Theme 02 霓虹章节页
  - 描述：全屏霓虹描边章节号 + 居中标题
  - 媒体槽：无
  - 字段：`number`: text, `kicker`: text, `title`: text, `subtitle`: textarea
- **`theme02_content_v1`** — Theme 02 内容页
  - 描述：霓虹标题 + 发光 bullet 列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `bullets`: array
- **`theme02_checklist_v1`** — Theme 02 行动清单
  - 描述：带勾选标记的待办 / 行动项列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme02_card_grid_v1`** — Theme 02 通用卡片网格
  - 描述：自适应卡片网格，每张卡含标签 + 标题 + 描述
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array
- **`theme02_highlight_v1`** — Theme 02 关键结论
  - 描述：居中大字号关键结论 / 金句卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `statement`: textarea, `footnote`: text
- **`theme02_pyramid_v1`** — Theme 02 金字塔
  - 描述：分层金字塔结构
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `levels`: array
- **`theme02_org_chart_v1`** — Theme 02 组织结构图
  - 描述：根节点 + 子节点树形结构
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `root`: object, `children`: array
- **`theme02_chapter_v3`** — Theme 02 章节页 (描边数字)
  - 描述：大号描边数字 + 分隔线章节
  - 媒体槽：无
  - 字段：`kicker`: text, `number`: text, `title`: text, `subtitle`: text
- **`theme02_section_divider_v1`** — Theme 02 分隔条
  - 描述：横向分隔条 + 发光规则线
  - 媒体槽：无
  - 字段：`kicker`: text, `index`: text, `title`: text, `subtitle`: text

### theme03

- **`theme03_chapter_v1`** — Theme 03 编辑风章节页
  - 描述：深色代码编辑风章节页，超大章节号 + 竖排英文 + 本章导航
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `number`: text, `numberEnglish`: text, `title`: text, `description`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text, `image`: image
- **`theme03_content_v1`** — Theme 03 编辑风内容页
  - 描述：深色代码编辑风内容页，顶部标签 + 多栏要点
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `columns`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_case_v1`** — Theme 03 编辑风案例页
  - 描述：深色代码编辑风案例页，左图右文 + 时间线里程碑
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: text, `description`: textarea, `image`: image, `milestones`: array, `footnote`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_appendix_v1`** — Theme 03 编辑风附录页
  - 描述：深色代码编辑风数据来源与参考资料列表
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `sources`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_case_study`** — Theme 03 编辑风案例详情
  - 描述：深色代码编辑风案例标题 + 简介 + 融资时间线 + 引用
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: text, `intro`: textarea, `rounds`: array, `quote`: textarea, `quoteAuthor`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_outlook_v1`** — Theme 03 编辑风投资展望
  - 描述：深色代码编辑风标题 + 趋势判断 + 行动建议
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_region_v1`** — Theme 03 编辑风地区/市场分布
  - 描述：深色代码编辑风多地区数据卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `regions`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_risk_v1`** — Theme 03 编辑风风险研判
  - 描述：深色代码编辑风风险列表 + 影响程度 + 应对策略
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_spotlight_grid`** — Theme 03 编辑风主题聚焦网格
  - 描述：深色代码编辑风 2~4 列并列展示主题、案例或分论点
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `columns`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chapter_v2`** — Theme 03 编辑风章节 v2
  - 描述：左侧超大章节号 + 右侧标签与标题的章节过渡页
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `number`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_chapter_v3`** — Theme 03 编辑风章节 v3
  - 描述：全宽背景图 + 深色遮罩 + 玻璃卡片标题
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `imageAlt`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_content_v2`** — Theme 03 编辑风双栏内容
  - 描述：双栏要点并排展示
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `leftPoints`: array, `rightPoints`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_content_v3`** — Theme 03 编辑风三栏内容
  - 描述：三栏内容卡片并排展示
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_content_v4`** — Theme 03 编辑风大字主张
  - 描述：全屏大字主张页
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_chapter_v1`** — Theme 04 糖果章节页
  - 描述：大号描边章节号 + 糖果色装饰，用于章节过渡
  - 媒体槽：无
  - 字段：`tag`: text, `number`: text, `title`: text, `subtitle`: textarea
- **`theme04_content_v1`** — Theme 04 胶囊高亮内容页
  - 描述：左侧标题含胶囊高亮，右侧玻璃卡片要点列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme04_case_v1`** — Theme 04 典型案例时间线
  - 描述：左侧案例标题+引言+图片，右侧时间线里程碑
  - 媒体槽：案例配图 (imageUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `badge`: text, `imageUrl`: image, `quote`: textarea, `author`: text, `milestones`: array
- **`theme04_chapter_v2`** — Theme 04 分屏章节大字页
  - 描述：超大数字/字母 + 章节标题 + 分屏排版
  - 媒体槽：无
  - 字段：`number`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea
- **`theme04_editorial_v1`** — Theme 04 杂志跨页
  - 描述：左侧大图+引言，右侧玻璃卡片列表，杂志化跨页排版
  - 媒体槽：主视觉图 (imageUrl)
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `quote`: textarea, `author`: text, `imageUrl`: image, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_chapter_split_v1`** — Theme 04 分屏章节页
  - 描述：左图右文分屏章节过渡页，图片占 60%
  - 媒体槽：无
  - 字段：`image`: image, `number`: text, `title`: text, `subtitle`: textarea
- **`theme04_chapter_numbered_v1`** — Theme 04 编号章节页
  - 描述：超大编号 + 小标签与标题的极简章节页
  - 媒体槽：无
  - 字段：`tag`: text, `number`: text, `title`: text, `subtitle`: textarea
- **`theme04_trio_v1`** — Theme 04 三强卡片页
  - 描述：三个 contender/产品/人物卡片，含图片、名称与描述
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnote`: text
- **`theme04_matrix_v1`** — Theme 04 矩阵网格
  - 描述：2×2 四象限矩阵，展示分类与定位
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxis.low`: text, `xAxis.high`: text, `yAxis.low`: text, `yAxis.high`: text, `items`: array, `footnote`: text
- **`theme04_diptych_v1`** — Theme 04 叙事对兑现
  - 描述：左侧观点陈述，右侧图文证据，形成叙事与兑现的对开页
  - 媒体槽：证据图 (imageUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `statement`: textarea, `imageUrl`: image, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme05

- **`theme05_chapter_v1`** — Theme 05 光谱章节页
  - 描述：大号章节号 + 底部光谱色带，用于章节过渡
  - 媒体槽：无
  - 字段：`tag`: text, `number`: text, `title`: text, `subtitle`: textarea
- **`theme05_content_v1`** — Theme 05 要点内容页
  - 描述：左文右要点：标题下划线 + 彩色要点列表 + 可选结论区
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `bullets`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme05_matrix_v1`** — Theme 05 矩阵网格
  - 描述：2×2 四象限矩阵，展示分类与定位
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `xAxis.low`: text, `xAxis.high`: text, `yAxis.low`: text, `yAxis.high`: text, `items`: array, `footnote`: text
- **`theme05_risk_v1`** — Theme 05 风险研判
  - 描述：风险列表 + 影响程度 + 应对策略，光谱色卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnote`: text
- **`theme05_profile_v1`** — Theme 05 人物档案卡
  - 描述：左侧头像占位 + 右侧人物信息、引言、关键事实
  - 媒体槽：头像 (avatarUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `name`: text, `role`: text, `company`: text, `quote`: textarea, `facts`: array, `avatarUrl`: image
- **`theme05_case_v1`** — Theme 05 典型案例
  - 描述：顶部标题 + 案例公司名称 + 大指标 + 三段式（挑战/方案/成果）
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `company`: text, `metric`: object, `challenge`: textarea, `solution`: textarea, `result`: textarea
- **`theme05_bento_v1`** — Theme 05 一图速览
  - 描述：Bento Grid 布局，2x3 或 3x2 卡片网格，每个卡片展示一个数据亮点
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme05_chapter_big_v1`** — Theme 05 章节 大字标题
  - 描述：全屏超大章节标题 + 光谱色带
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea
- **`theme05_chapter_split_v1`** — Theme 05 章节 分屏
  - 描述：左侧色块章节号 + 右侧标题副标题
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea
- **`theme05_chapter_numbered_v1`** — Theme 05 章节 极简编号
  - 描述：顶部小编号 + 居中大标题 + 副标题
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea
- **`theme05_chapter_image_v1`** — Theme 05 章节 图背
  - 描述：全屏图片背景 + 渐变遮罩 + 章节标题
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea, `image`: image

### theme06

- **`theme06_chapter_v1`** — Theme 06 图谱章节页
  - 描述：超大实心章节号 + 顶部双标签 + 底部要点标签按钮 + 可选背景图
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `topLeftLabel`: text, `topRightLabel`: text, `number`: text, `title`: text, `subtitle`: textarea, `enSubtitle`: textarea, `tags`: array, `nextHint`: text
- **`theme06_content_v1`** — Theme 06 要点内容页
  - 描述：左文右要点：霓虹标题下划线 + 发光要点列表 + 可选结论面板
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `bullets`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme06_content_numbered_v1`** — Theme 06 编号卡片内容页
  - 描述：左侧标题 + 右侧 01/02/03/04 编号卡片列表，支持高亮当前项
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `titleAccent`: text, `subtitle`: textarea, `items`: array, `footnote`: text
- **`theme06_matrix_v1`** — Theme 06 战略矩阵
  - 描述：2×2 战略四象限矩阵，支持坐标轴标签与焦点高亮
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `cells`: array, `focusIndex`: slider
- **`theme06_case_v1`** — Theme 06 典型案例
  - 描述：案例公司 + 关键指标 + 挑战/方案/成果三段式
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `company`: text, `tagline`: textarea, `metrics`: array, `challenge`: textarea, `solution`: textarea, `result`: textarea
- **`theme06_case_v2`** — Theme 06 典型案例 v2
  - 描述：左侧编号案例卡片 + 右侧 DROP IMAGE 占位区与公司/传导说明
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `company`: text, `tagline`: textarea, `items`: array, `insight`: textarea, `footnote`: text
- **`theme06_risk_v1`** — Theme 06 风险研判
  - 描述：2×2 风险矩阵，按等级着色并给出应对策略
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnote`: text
- **`theme06_risk_v2`** — Theme 06 风险研判 v2
  - 描述：左侧编号风险卡片 + 右侧 DROP IMAGE 占位区与传导说明
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `insight`: textarea, `footnote`: text
- **`theme06_summary_v1`** — Theme 06 结论摘要
  - 描述：左侧要点列表 + 右侧高亮结论面板
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `value`: text, `valueLabel`: text, `valueDescription`: textarea
- **`theme06_sources_v1`** — Theme 06 数据来源
  - 描述：数据来源与参考资料列表，适合报告附录
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `sources`: array
- **`theme06_bento_v1`** — Theme 06 Bento 网格
  - 描述：模块化数据卡片网格，适合多维度概览
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme06_comparison_v1`** — Theme 06 对比分析
  - 描述：左右双栏对比，突出优劣势差异
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `rightTitle`: text, `points`: array, `leftSummary`: textarea, `rightSummary`: textarea
- **`theme06_sector_spotlight_v1`** — Theme 06 行业专题
  - 描述：行业或技术专题页，左栏要点右栏指标卡
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `takeaways`: array, `highlights`: array, `insight`: object
- **`theme06_tech_landscape_v1`** — Theme 06 技术全景
  - 描述：3 列 Bento 网格展示技术栈或能力全景
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `topics`: array
- **`theme06_company_profile_v1`** — Theme 06 公司案例
  - 描述：公司案例页，展示公司概况、关键事实与叙事
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `company`: text, `tagline`: textarea, `facts`: array, `metrics`: array, `narrative`: object
- **`theme06_quarter_table_v1`** — Theme 06 季度数据表
  - 描述：季度 Q1-Q4 数据对比表，适合财报或运营回顾
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array, `rows`: array, `summary`: object
- **`theme06_risk_matrix_v1`** — Theme 06 风险矩阵
  - 描述：2×2 风险矩阵，展示风险等级与应对策略
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `cells`: array
- **`theme06_sector_comparison_v1`** — Theme 06 行业方案对比
  - 描述：左右双栏行业方案对比，标注优势方
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `leftTitle`: text, `rightTitle`: text, `points`: array, `leftSummary`: textarea, `rightSummary`: textarea
- **`theme06_chapter_numbered_v1`** — Theme 06 大号章节号
  - 描述：大号实心章节号 + 标题
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `number`: text, `title`: text, `subtitle`: textarea
- **`theme06_chapter_split_v1`** — Theme 06 分栏章节页
  - 描述：左侧章节标题 + 右侧 2×2 数据卡片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `number`: text, `title`: text, `subtitle`: textarea, `visualLabel`: text, `visualItems`: array
- **`theme06_quadrant_v1`** — Theme 06 2×2 气泡矩阵
  - 描述：象限气泡图 + 右侧图例
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `bubbles`: array
- **`theme06_outlook_v1`** — Theme 06 展望下一步
  - 描述：左侧要点 + 右侧下一步时间轴
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `steps`: array
- **`theme06_recap_v1`** — Theme 06 回顾总结
  - 描述：左侧要点清单 + 右侧大数字结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `value`: text, `valueLabel`: text, `valueDescription`: textarea
- **`theme06_company_investors_v1`** — Theme 06 投资机构网格
  - 描述：头部投资机构网格展示
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `investors`: array
- **`theme06_geo_cities_v1`** — Theme 06 多城市指标对比
  - 描述：城市徽章 + 指标值 + 涨跌幅
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `cities`: array
- **`theme06_method_v1`** — Theme 06 研究方法
  - 描述：编号步骤卡片展示研究/分析框架
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array
- **`theme06_chapter_focus_v1`** — Theme 06 聚焦章节页
  - 描述：中央大数字指标 + 章节标题，强调核心数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `number`: text, `title`: text, `subtitle`: textarea, `focusValue`: text, `focusUnit`: text, `focusLabel`: text
- **`theme06_chapter_image_v1`** — Theme 06 图文章节页
  - 描述：左侧全高图片 + 右侧章节标题与副标题
  - 媒体槽：无
  - 字段：`tag`: text, `number`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image
- **`theme06_chapter_minimal_v1`** — Theme 06 极简章节页
  - 描述：纯文字极简章节页，仅标题与细线装饰
  - 媒体槽：无
  - 字段：`imageUrl`: image, `tag`: text, `title`: text, `subtitle`: textarea
- **`theme06_triad_v1`** — Theme 06 三元对比
  - 描述：三列卡片展示三种方案、维度或阶段
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme06_legal_v1`** — Theme 06 法律合规框架
  - 描述：编号步骤展示法律/合规/监管要点
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `conclusion`: textarea
- **`theme06_open_risk_v1`** — Theme 06 开放风险
  - 描述：不确定性时间轴与情景影响评估
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `uncertainties`: array, `conclusion`: textarea
- **`theme06_revenue_risk_v1`** — Theme 06 收入风险
  - 描述：收入风险项列表 + 总体风险敞口
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `risks`: array, `totalExposure`: text, `exposureLabel`: text
- **`theme06_industry_vertical_v1`** — Theme 06 垂直行业专题
  - 描述：针对垂直行业（医疗、金融、零售等）的落地场景与关键指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `industry`: text, `useCases`: array, `highlights`: array, `insight`: textarea
- **`theme06_industry_infrastructure_v1`** — Theme 06 基础设施专题
  - 描述：展示 AI 基础设施/数据基础设施/开发者工具等底层能力板块
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `segments`: array, `metrics`: array, `insight`: textarea
- **`theme06_industry_finance_v1`** — Theme 06 金融行业专题
  - 描述：展示金融场景落地与关键业务指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `industry`: text, `useCases`: array, `highlights`: array, `insight`: textarea
- **`theme06_industry_growth_v1`** — Theme 06 增长专题
  - 描述：展示增长阶段、关键杠杆与成果指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `stages`: array, `levers`: array, `insight`: textarea
- **`theme06_industry_safety_v1`** — Theme 06 安全合规专题
  - 描述：展示安全风险类别、等级与对应控制措施
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `risks`: array, `controls`: array, `insight`: textarea
- **`theme06_company_spotlight_v1`** — Theme 06 公司 Spotlight
  - 描述：单一公司案例 spotlight：大标题、核心指标与亮点叙事
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `company`: text, `tagline`: text, `description`: textarea, `stage`: text, `location`: text, `founded`: text, `metrics`: array, `highlights`: array
- **`theme06_ipo_watch_v1`** — Theme 06 IPO 观察
  - 描述：IPO 候选公司观察清单与关键信息表
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `companies`: array, `conclusion`: textarea
- **`theme06_statement_v1`** — Theme 06 核心主张
  - 描述：大字号核心主张 + 支撑论点与来源署名
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text
- **`theme06_alliance_v1`** — Theme 06 联盟与资源
  - 描述：展示战略联盟中的参与方、资源互补与合作成果
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `partners`: array, `resources`: array, `outcomes`: array, `insight`: textarea
- **`theme06_compute_v1`** — Theme 06 算力专题
  - 描述：展示 AI 算力基础设施的层级与关键指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `layers`: array, `metrics`: array, `insight`: textarea
- **`theme06_deal_structure_v1`** — Theme 06 交易结构
  - 描述：展示并购/交易的关键参与方、对价结构与核心条款
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `dealName`: text, `buyer`: text, `target`: text, `value`: text, `valuation`: text, `structure`: array, `parties`: array, `highlights`: array, `insight`: textarea
- **`theme06_megadeals_v1`** — Theme 06 大额交易
  - 描述：展示市场中的重磅交易与背后的战略逻辑
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `heroValue`: text, `heroLabel`: text, `deals`: array, `insight`: textarea

### theme07

- **`theme07_chapter_v1`** — Theme 07 调研章节页
  - 描述：深色章节页：超大空心数字水印 + 衬线标题 + 英文标签 + 底部要点
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea, `enSubtitle`: textarea, `tags`: array, `nextHint`: text
- **`theme07_chapter_capital_v1`** — Theme 07 资本专题章节页
  - 描述：深色章节页变体：资本交易专题，强调资金流转与交易结构
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea, `enSubtitle`: textarea, `tags`: array, `nextHint`: text
- **`theme07_chapter_risk_v1`** — Theme 07 风险专题章节页
  - 描述：深色章节页变体：风险研判专题，强调风险识别与应对框架
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea, `enSubtitle`: textarea, `tags`: array, `nextHint`: text
- **`theme07_chapter_appendix_v1`** — Theme 07 附录章节页
  - 描述：深色章节页变体：附录与数据来源，强调资料索引与方法论
  - 媒体槽：无
  - 字段：`number`: text, `title`: text, `subtitle`: textarea, `enSubtitle`: textarea, `tags`: array, `nextHint`: text
- **`theme07_content_v1`** — Theme 07 调研内容页
  - 描述：左文右要点：衬线标题 + 编号要点列表 + 可选结论面板 + 背景图
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `showConclusion`: boolean, `conclusion`: object
- **`theme07_summary_v1`** — Theme 07 调研摘要
  - 描述：左侧要点列表 + 右侧数据指标卡 + 结论面板，适合报告摘要
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `metrics`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_ranking_v1`** — Theme 07 调研排名
  - 描述：衬线标题 + 纵向排名条目，每条带进度条/数值/说明/图例
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `unit`: text, `entries`: array, `legend`: array, `footnote`: textarea, `focusIndex`: slider
- **`theme07_case_v1`** — Theme 07 调研案例
  - 描述：三列案例卡片：顶部纹理 + 公司名 + 标签 + 关键指标
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `cards`: array, `footnote`: textarea, `imageRatio`: select
- **`theme07_case_grid_v1`** — Theme 07 调研案例（三列）
  - 描述：三列并排案例卡片：公司名 + 图片 + 标签 + 关键指标，对齐大师案例页网格
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `cards`: array, `footnote`: textarea, `imageRatio`: select
- **`theme07_sources_v1`** — Theme 07 数据来源
  - 描述：数据来源页：标题 + 来源条目（可信度条）+ 处理流程 + 脚注
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `sampleSize`: object, `entries`: array, `process`: array, `footnote`: textarea
- **`theme07_method_v1`** — Theme 07 研究方法
  - 描述：编号步骤卡片展示研究/分析框架，适合调研报告方法论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: textarea
- **`theme07_matrix_v1`** — Theme 07 战略矩阵
  - 描述：2×2 战略四象限矩阵，支持坐标轴标签与焦点高亮
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `xAxisLabel`: text, `yAxisLabel`: text, `cells`: array, `focusIndex`: slider
- **`theme07_risk_v1`** — Theme 07 风险研判
  - 描述：风险列表页：风险项、影响等级与应对策略
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnote`: textarea, `focusIndex`: number
- **`theme07_outlook_v1`** — Theme 07 展望下一步
  - 描述：左侧要点 + 右侧下一步时间轴
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `points`: array, `steps`: array, `focusIndex`: slider
- **`theme07_investor_v1`** — Theme 07 资本关系网络
  - 描述：中央资本枢纽 + 环形投资机构节点，连线呈现出资关系图谱
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `hubLabel`: text, `hubNote`: text, `investors`: array, `showLabels`: boolean, `showAnchor`: boolean, `focusIndex`: slider
- **`theme07_syndicate_v1`** — Theme 07 财团联合投资
  - 描述：核心主张 + 要点论证 + 来源
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text
- **`theme07_knowledge_v1`** — Theme 07 知识管理赛道
  - 描述：知识管理赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_legal_v1`** — Theme 07 法律科技赛道
  - 描述：法律科技赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_healthcare_v1`** — Theme 07 医疗健康赛道
  - 描述：医疗健康赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_finance_v1`** — Theme 07 金融科技赛道
  - 描述：金融科技赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_compute_v1`** — Theme 07 算力集群气泡
  - 描述：算力细分赛道聚簇气泡图：气泡尺寸表示份额，底部指标芯片
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `clusters`: array, `metrics`: array, `gridDensity`: slider, `showSplit`: boolean, `splitLabelLeft`: text, `splitLabelRight`: text, `focusIndex`: slider
- **`theme07_chip_v1`** — Theme 07 AI 芯片赛道
  - 描述：AI 芯片赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_robotics_v1`** — Theme 07 具身智能赛道
  - 描述：具身智能赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_autonomy_v1`** — Theme 07 自动驾驶赛道
  - 描述：自动驾驶赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_safety_v1`** — Theme 07 AI 安全赛道
  - 描述：AI 安全赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_content_gen_v1`** — Theme 07 内容生成赛道
  - 描述：内容生成赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_education_v1`** — Theme 07 教育科技赛道
  - 描述：教育科技赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_support_v1`** — Theme 07 客户服务赛道
  - 描述：客户服务赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_sales_v1`** — Theme 07 销售科技赛道
  - 描述：销售科技赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_low_code_v1`** — Theme 07 低代码赛道
  - 描述：低代码赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_open_source_v1`** — Theme 07 开源生态赛道
  - 描述：开源生态赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_alignment_v1`** — Theme 07 对齐研究赛道
  - 描述：对齐研究赛道专题页，左文右数据
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `description`: textarea, `bullets`: array, `metrics`: array, `chartType`: text, `chartOption`: object, `showInsight`: boolean, `insight`: object, `footnote`: textarea, `imageLabel`: text, `imageRatio`: select
- **`theme07_early_stage_v1`** — Theme 07 早期轮信号看板
  - 描述：交易流信号行：气泡表示金额量级 + 主题标签 + 信号指示灯
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `showBubble`: boolean, `showThemes`: boolean, `showSignal`: boolean, `focusIndex`: slider
- **`theme07_deal_structure_v1`** — Theme 07 交易结构堆叠
  - 描述：横向堆叠结构条：披露/未披露/战略/其他分段占比与调用统计
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `segments`: array, `showStats`: boolean, `axisLabel`: text, `focusIndex`: slider
- **`theme07_investor_mix_v1`** — Theme 07 投资人结构
  - 描述：财务投资人与战略方在不同轮次的分布
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_resource_v1`** — Theme 07 资源配置矩阵
  - 描述：资本、算力与人才在不同赛道的配置
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_alliance_v1`** — Theme 07 产业联盟环
  - 描述：中央生态联盟枢纽 + 环形云厂商节点，圆弧连线携带数值标签
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `centerLabel`: text, `centerNote`: text, `providers`: array, `showLoop`: boolean, `showValues`: boolean, `focusIndex`: slider
- **`theme07_ecosystem_v1`** — Theme 07 资本生态系统
  - 描述：基金、企业与政府资本共同塑造的融资环境
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_geo_center_v1`** — Theme 07 地理核心
  - 描述：AI 融资与创新的全球核心城市
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `regions`: array, `mapLabel`: text, `footnote`: textarea
- **`theme07_region_cluster_v1`** — Theme 07 区域集群
  - 描述：资本聚集形成的区域创新集群
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `regions`: array, `mapLabel`: text, `footnote`: textarea
- **`theme07_resource_triad_v1`** — Theme 07 资源三角
  - 描述：人才 / 资本 / 算力三支柱等边三角结构，中心引述与来源行
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `pillars`: array, `centerText`: textarea, `source`: text, `showPillars`: boolean, `showQuoteMark`: boolean, `showSource`: boolean, `focusIndex`: slider
- **`theme07_company_openai_v1`** — Theme 07 OpenAI 案例
  - 描述：通用大模型与 AI 平台的代表，持续引领生成式 AI 的技术与商业化进程。
  - 媒体槽：无
  - 字段：`imageUrl`: image, `imageTag`: text, `kicker`: text, `name`: text, `tagline`: text, `description`: textarea, `tags`: array, `metrics`: array, `quote`: textarea, `author`: text, `footnote`: textarea, `imageRatio`: select
- **`theme07_company_figure_v1`** — Theme 07 Figure AI 案例
  - 描述：具身智能与人形机器人领域的先锋，探索 AI 在物理世界中的落地边界。
  - 媒体槽：无
  - 字段：`imageUrl`: image, `imageTag`: text, `kicker`: text, `name`: text, `tagline`: text, `description`: textarea, `tags`: array, `metrics`: array, `quote`: textarea, `author`: text, `footnote`: textarea, `imageRatio`: select
- **`theme07_company_ssi_v1`** — Theme 07 SSI 案例
  - 描述：安全超级智能研究公司，专注于构建安全、可扩展的超级智能系统。
  - 媒体槽：无
  - 字段：`imageUrl`: image, `imageTag`: text, `kicker`: text, `name`: text, `tagline`: text, `description`: textarea, `tags`: array, `metrics`: array, `quote`: textarea, `author`: text, `footnote`: textarea, `imageRatio`: select
- **`theme07_revenue_v1`** — Theme 07 收入模式风险
  - 描述：Scaling 收入与单位经济模型的可持续性挑战
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_compliance_v1`** — Theme 07 合规监管风险
  - 描述：全球监管框架快速演进带来的合规成本
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_margin_v1`** — Theme 07 利润率巨号数字
  - 描述：超大利润率数字 + 仪表环 + 辅助指标芯片，呈现算力成本挤压
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `number`: text, `unit`: text, `label`: text, `gaugeValue`: slider, `gaugeLabel`: text, `aux`: array, `note`: textarea, `numberSlant`: boolean, `showGauge`: boolean, `showNote`: boolean, `showLens`: boolean
- **`theme07_moat_v1`** — Theme 07 壁垒压力带
  - 描述：三条水平压力带，带宽自左向右收窄表达壁垒被压缩的程度
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `bands`: array, `showBand`: boolean, `axisStart`: text, `axisEnd`: text, `focusIndex`: slider
- **`theme07_strategy_infra_v1`** — Theme 07 基础设施策略
  - 描述：算力、数据与工具链的前瞻布局
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_strategy_vertical_v1`** — Theme 07 垂直场景策略
  - 描述：从通用能力到行业Know-how的落地路径
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `intro`: textarea, `headers`: array, `rows`: array, `conclusion`: textarea, `footnote`: textarea
- **`theme07_forward_v1`** — Theme 07 前瞻斜率图
  - 描述：多指标斜率图：左右两期数值端点连线，上升区叠加渐变带
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `axisStart`: text, `axisEnd`: text, `lines`: array, `showBand`: boolean, `footnote`: text, `focusIndex`: slider
- **`theme07_stat_hero_v1`** — Theme 07 单数字 Hero
  - 描述：整页聚焦单个超大数字：巨号数值 + 单位 + 说明文案，用于强调唯一核心结论
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `number`: text, `unit`: text, `caption`: textarea, `numberSlant`: boolean, `showRule`: boolean, `showLens`: boolean
- **`theme07_stat_row_v1`** — Theme 07 多数字并列
  - 描述：2–4 组大数字横向并列，配单位、标签与补充说明，用于一屏交代多个关键量级
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `stats`: array, `footnote`: text, `showDividers`: boolean, `showNotes`: boolean, `focusIndex`: slider
- **`theme07_stat_chart_v1`** — Theme 07 数字 + 图表
  - 描述：左侧巨号结论数字，右侧支撑该结论的柱状序列与趋势线，形成「论点 + 证据」结构
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `number`: text, `unit`: text, `label`: textarea, `series`: array, `chartCaption`: text, `showTrend`: boolean, `showValues`: boolean, `showLens`: boolean, `focusIndex`: slider
- **`theme07_stat_compare_v1`** — Theme 07 数字对比
  - 描述：左右两个巨号数字对峙，中间以差值徽标衔接，用于前后期或两方案的量级对照
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `title`: text, `subtitle`: textarea, `left`: object, `right`: object, `delta`: text, `deltaLabel`: text, `caption`: textarea, `showDelta`: boolean, `showAxis`: boolean, `focusSide`: select

### theme08

- **`theme08_chapter_v1`** — Theme 08 章节过渡
  - 描述：黑金大号章节序号 + 标题 + 副标题，强发布会章节感
  - 媒体槽：无
  - 字段：`index`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_content_v1`** — Theme 08 内容要点
  - 描述：左要点列表 + 右数字侧栏，适合论据/洞察页
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `stats`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_case_v1`** — Theme 08 案例卡
  - 描述：左侧品牌标识 + 右侧要点与三项指标，适合公司/案例展示
  - 媒体槽：无
  - 字段：`kicker`: text, `logoText`: text, `name`: text, `tag`: text, `desc`: textarea, `metrics`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_chain_v1`** — Theme 08 产业链
  - 描述：上游/中游/下游三层堆叠卡片 + 手绘箭头连接，突出中游
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `layers`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_funding_v1`** — Theme 08 投资阶段
  - 描述：早期轮（Seed/A）事件数、平均金额、代表主题与信号强度一览
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array, `summaryPct`: text, `summaryLabel`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_workflow_v1`** — Theme 08 工作流
  - 描述：横向步骤卡片 + 底部时间轴，适合管线/工作流嵌入
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `timelineLabels`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_hero_split_v1`** — Theme 08 跨页分割
  - 描述：左右对半分割，深黑叙事 vs 浅色机会的强对比
  - 媒体槽：无
  - 字段：`leftKicker`: text, `leftTitle`: text, `leftDesc`: textarea, `rightKicker`: text, `rightTitle`: text, `rightDesc`: textarea, `watermarkNumber`: text, `accent`: boolean, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_abstract_v1`** — Theme 09 卷首摘要
  - 描述：首字下沉双栏摘要 + 专色关键数字挂栏，适合报告开篇提要
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `standfirst`: textarea, `figures`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_section_v1`** — Theme 09 篇章扉页
  - 描述：巨型专色数字出血 + 竖排中文章节名，墨底重音页，用于章节切换
  - 媒体槽：无
  - 字段：`num`: text, `nameEn`: text, `name`: text, `lede`: textarea, `points`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_section_card_v1`** — Theme 09 篇章卡
  - 描述：折页角卡片 + 本章要点列表，纸底轻量篇章页，可与篇章扉页交替使用
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `num`: text, `name`: text, `nameEn`: text, `points`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_specimen_v1`** — Theme 09 设计系统标本
  - 描述：一页展示墨韵专色主题的全部印刷原语：刊头/骑缝/色标/影像位/导语/规线/装订线/折角
  - 媒体槽：影像位 A (imgA), 影像位 B（圆窗） (imgB)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `lead`: textarea, `imgA`: image, `imgB`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_manifesto_v1`** — Theme 09 金句主张
  - 描述：全版专色主张，逐行错位对齐
  - 媒体槽：无
  - 字段：`kicker`: text, `lines`: array, `footnote`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_annotated_v1`** — Theme 09 批注精读
  - 描述：正文段落 + 右侧手写体批注挂栏 + 引出线
  - 媒体槽：配图 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `body`: textarea, `notes`: array, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_case_folio_v1`** — Theme 09 案例对开
  - 描述：装订线居中的对开版式，左文右图三案例
  - 媒体槽：案例影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `standfirst`: textarea, `cases`: array, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_zine_spread_v1`** — Theme 09 杂志跨页
  - 描述：跨页大版：左三栏文字右出血图 + 底部小图组，杂志跨页 / 报道栏
  - 媒体槽：主影像 (imageUrl), 辅图 (subImages)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: textarea, `titleEn`: text, `standfirst`: textarea, `body`: textarea, `pullquote`: textarea, `imageUrl`: image, `subImages`: text, `figLabel`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_spotlight_v1`** — Theme 09 专题洞察
  - 描述：聚光式渐晕 + 洞察句分段加粗 + 底部指标条，Spotlight / 专题栏
  - 媒体槽：配图 (imageUrl), 辅图 (subImageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `kicker`: text, `subtitle`: text, `body`: textarea, `imageUrl`: image, `subImageUrl`: image, `metrics`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_outlook_v1`** — 投资展望
  - 描述：三条纵向展望 + 趋势箭头 + 右侧影像窄栏，墨底
  - 媒体槽：展望影像 (image)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `outlooks`: array, `image`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_conclusion_v1`** — 核心结论
  - 描述：顶部通栏色标带 + 编号结论列（3–5 条），纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `conclusions`: array, `showBand`: boolean, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_bracket_v1`** — 归纳括弧
  - 描述：多项并列词条 + 巨型括弧收拢 + 一句归纳，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `items`: array, `summary`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_takeaway_v1`** — 核心要点
  - 描述：编号要点列表（3–5 条）+ 大号编号 + 右侧窄条影像，墨底
  - 媒体槽：要点影像 (image)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `points`: array, `image`: image, `imageCaption`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_chapter_v1`** — Theme 10 章节索引
  - 描述：巨型序号 + 章节名 + 账本细线分组
  - 媒体槽：无
  - 字段：`no`: text, `name`: text, `items`: array, `mood`: select
- **`theme10_divider_v1`** — Theme 10 序号分章
  - 描述：居中序号 + 金线分隔
  - 媒体槽：无
  - 字段：`no`: text, `name`: text, `mood`: select
- **`theme10_statement_section_v1`** — Theme 10 宣言章节
  - 描述：左宣言右索引 + 中缝
  - 媒体槽：无
  - 字段：`quote`: textarea, `items`: array, `mood`: select
- **`theme10_principles_v1`** — Theme 10 投资原则
  - 描述：编号原则 + 刻度尺
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_editorial_v1`** — Theme 10 编排图文
  - 描述：三栏文字 + 右出血图
  - 媒体槽：右出血图 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `body`: array, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_steps_v1`** — Theme 10 运作机制
  - 描述：步骤链 + 箭头连接
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `lead`: textarea, `items`: array, `mood`: select
- **`theme10_cycle_v1`** — Theme 10 循环流程
  - 描述：环形节点 + 顺时针箭头
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_swimlane_v1`** — Theme 10 泳道流程
  - 描述：横向阶段泳道 + 任务卡
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_checklist_v1`** — Theme 10 核查清单
  - 描述：双栏勾选清单
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_plans_v1`** — Theme 10 方案对比
  - 描述：2–3 列方案卡 + 要点对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_journey_v1`** — Theme 10 客户旅程
  - 描述：阶段 + 情绪曲线
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_goals_v1`** — Theme 10 目标进度
  - 描述：目标卡 + 进度条
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_glossary_v1`** — Theme 10 术语表
  - 描述：术语 + 释义双栏列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_faq_v1`** — Theme 10 问答
  - 描述：问题 + 答案列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_isotype_v1`** — Theme 10 象形图
  - 描述：单位符号重复象形图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select
- **`theme10_venn_v1`** — Theme 10 韦恩图
  - 描述：三集合韦恩图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array, `mood`: select

## faq

### theme01

- **`theme01_faq_v1`** — Theme 01 FAQ 页
  - 描述：玻璃卡片问答列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `items`: array

### theme02

- **`theme02_faq_v1`** — Theme 02 霓虹 FAQ
  - 描述：深色背景 + 霓虹问答卡片列表
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array

### theme03

- **`theme03_faq_v1`** — Theme 03 编辑风 FAQ
  - 描述：深色代码编辑风问答页，Q/A 卡片列表
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_faq_v1`** — 关键问答
  - 描述：Q/A 双栏列表 + 专色圆角问句徽章 + 原生折叠展开，纸底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `faqs`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## feature

### theme01

- **`theme01_feature_v1`** — Theme 01 产品特性
  - 描述：玻璃卡片三列特性展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `features`: array
- **`theme01_feature_v2`** — Theme 01 案例与竞争力
  - 描述：左侧固定图片区 + 右侧编号要点卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `imageAlt`: text, `items`: array, `footer`: text

### theme02

- **`theme02_feature_v1`** — Theme 02 霓虹特性
  - 描述：深色背景 + 霓虹编号卡片三列特性展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `features`: array
- **`theme02_feature_v2`** — Theme 02 图标特性网格
  - 描述：霓虹卡片网格，每项带图标 + 标题 + 描述
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `features`: array
- **`theme02_image_split_v1`** — Theme 02 图文分栏
  - 描述：左文右图分栏布局
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `bullets`: array, `image`: image

### theme03

- **`theme03_feature_v1`** — Theme 03 编辑风特性
  - 描述：深色代码编辑风特性页，编号卡片 + 标题 + 描述
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `features`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_feature_v2`** — Theme 03 编辑风案例与竞争力
  - 描述：左侧固定图片区 + 右侧编号要点卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `imageAlt`: text, `items`: array, `footer`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_feature_v1`** — Theme 04 糖果特性页
  - 描述：顶部标题 + 三列糖果色特性卡片
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme04_cards_v1`** — Theme 04 行业赛道卡片
  - 描述：横向 3-4 列行业赛道卡片，顶部彩色标签与数据指标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cards`: array

### theme08

- **`theme08_feature_v1`** — Theme 08 三栏特性
  - 描述：标题 + 三栏图标卡片，适合能力/优势展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_strategy_v1`** — Theme 08 策略卡
  - 描述：标题 + 三栏策略卡（带序号徽标），适合打法/策略
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_ecosystem_v1`** — Theme 08 生态圈
  - 描述：中心 hub + 四周节点辐射，虚线椭圆轨道连接，适合生态/平台关系
  - 媒体槽：无
  - 字段：`kicker`: text, `hubName`: text, `hubValue`: text, `hubUnit`: text, `hubSub`: text, `nodes`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_photo_feature_v1`** — Theme 09 影像专题
  - 描述：满版影像 + 左侧纸面板标题导语，专题开篇的影像叙事版式
  - 媒体槽：专题影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: textarea, `standfirst`: textarea, `caption`: text, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_vertical_v1`** — 应用落地
  - 描述：三条垂直行业卡 + 影像位 + 落地描述，等宽三列，纸底
  - 媒体槽：行业影像 1 (cards.0.image), 行业影像 2 (cards.1.image), 行业影像 3 (cards.2.image)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `cards`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_profile_v1`** — Theme 10 人物特写
  - 描述：左肖像出血 + 右 mono 履历条
  - 媒体槽：人物肖像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `name`: text, `title`: text, `en`: text, `role`: text, `years`: text, `focus`: text, `bio`: textarea, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_magazine_v1`** — Theme 10 杂志图文
  - 描述：杂志跨页大版（左大图 + 右文 + 右下小图）
  - 媒体槽：跨页大图 (images.0.url), 引文小图 (images.1.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `pull`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_feature_v1`** — Theme 10 图文特写
  - 描述：左大图出血 + 右图文 + 引出线批注
  - 媒体槽：特写大图 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `imageUrl`: image, `notes`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## team

### theme01

- **`theme01_team_v1`** — Theme 01 团队页
  - 描述：玻璃卡片团队成员展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `members`: array
- **`theme01_team_v2`** — Theme 01 团队页 v2
  - 描述：横向大卡片团队成员展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `members`: array

### theme02

- **`theme02_team_v1`** — Theme 02 霓虹团队
  - 描述：团队成员卡片 + 霓虹头像光晕
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `members`: array

### theme03

- **`theme03_team_v1`** — Theme 03 编辑风团队
  - 描述：深色代码编辑风团队页，头像 + 姓名 + 职位 + 简介卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `members`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_team_v2`** — Theme 03 编辑风团队 v2
  - 描述：横向大卡片团队成员展示
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `members`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_team_v1`** — Theme 04 糖果团队页
  - 描述：玻璃糖果风团队页，头像 + 姓名 + 职位 + 简介卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `members`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme08

- **`theme08_team_v1`** — Theme 08 团队
  - 描述：头像 + 姓名 + 角色的四宫格，适合团队/人物
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_team_v1`** — Theme 09 研究团队
  - 描述：2×3 网点半调肖像卡 + 姓名职务，团队 / 主创栏
  - 媒体槽：成员 1 (images.0.url), 成员 2 (images.1.url), 成员 3 (images.2.url), 成员 4 (images.3.url), 成员 5 (images.4.url), 成员 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_profile_v1`** — Theme 09 关于我们
  - 描述：左侧机构简介三栏 + 右侧建筑影像出血，About / 关于我们栏
  - 媒体槽：建筑影像 (imageUrl)
  - 字段：`orgName`: text, `orgNameEn`: text, `tagline`: text, `projects`: text, `imageUrl`: image, `sideCards`: text, `tags`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## partners

### theme01

- **`theme01_partners_v1`** — Theme 01 合作伙伴墙
  - 描述：玻璃卡片网格展示合作伙伴 Logo
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `partners`: array

### theme02

- **`theme02_partners_v1`** — Theme 02 霓虹伙伴墙
  - 描述：深色背景 + 霓虹边框合作伙伴网格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `partners`: array
- **`theme02_logo_wall_v1`** — Theme 02 合作伙伴墙
  - 描述：合作伙伴 / 客户 logo 网格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `logos`: array

### theme03

- **`theme03_partners_v1`** — Theme 03 编辑风伙伴墙
  - 描述：深色代码编辑风合作伙伴/客户 Logo 墙
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `partners`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme08

- **`theme08_partners_v1`** — Theme 08 合作伙伴
  - 描述：logo 墙网格，适合生态/合作展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

## image

### theme01

- **`theme01_image_v1`** — Theme 01 全屏图片
  - 描述：全屏背景图配居中玻璃质感标题
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `imageUrl`: image, `imageAlt`: image

### theme02

- **`theme02_image_v1`** — Theme 02 霓虹大图
  - 描述：全幅图片展示 + 霓虹文字叠加
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `image`: image, `caption`: text
- **`theme02_spotlight_v1`** — Theme 02 聚光大图
  - 描述：全幅图片 + 文字叠加
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `image`: image, `caption`: text

### theme03

- **`theme03_image_v1`** — Theme 03 编辑风全图页
  - 描述：深色代码编辑风全图/架构图页，顶部标题 + 大图 + 图注
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `image`: image, `caption`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_image_v1`** — Theme 04 图文焦点页
  - 描述：半幅大图 + 文字叠加，杂志化排版
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `image`: image, `caption`: text
- **`theme04_annotated_v1`** — Theme 04 标注特写
  - 描述：大幅图片配合位置标注点与说明，适合产品/场景特写
  - 媒体槽：特写图 (imageUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `annotations`: array, `footnote`: text
- **`theme04_imagestory_v1`** — Theme 04 图片故事
  - 描述：横向时间轴图片故事，展示关键节点与连续叙事
  - 媒体槽：步骤图 1 (steps.0.image)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `steps`: array, `footnote`: text
- **`theme04_showcase_v1`** — Theme 04 焦点机位
  - 描述：大幅中心图片展示，配合聚光灯效果与图注
  - 媒体槽：焦点图 (imageUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `caption`: textarea, `footnote`: text

### theme05

- **`theme05_image_v1`** — Theme 05 图文页
  - 描述：半幅图片 + 数据标注
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `image`: image, `annotation`: object
- **`theme05_gallery_v1`** — Theme 05 图片画廊
  - 描述：3-4 张图片横向排列的画廊，每张图片下方可编辑说明
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array
- **`theme05_editorial_v1`** — Theme 05 杂志跨页
  - 描述：左图右文或右图左文的大图跨页布局，含正文与可选引言
  - 媒体槽：主视觉图 (imageUrl)
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `imageSide`: select, `body`: textarea, `pullQuote`: textarea

### theme08

- **`theme08_region_v1`** — Theme 08 地理分布
  - 描述：左侧点阵地图 + 右侧城市列表，适合区域布局
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `regions`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_photo_duo_v1`** — Theme 09 对开双图
  - 描述：左图右图对开 + 中缝装订线 + 图注编号，适合对比 / 前后 / 双视角
  - 媒体槽：左图 (images.0.url), 右图 (images.1.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_photo_panorama_v1`** — Theme 09 全幅横影
  - 描述：满版横幅影像 + 底部压暗蒙版 + 大字标题图注，跨页大图 / 卷首跨页栏
  - 媒体槽：横幅影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: textarea, `titleEn`: text, `caption`: text, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_photo_stage_v1`** — Theme 09 焦点舞台
  - 描述：单幅焦点影像居中装裱陈列，上标题下圖注，焦点 / 单图大图栏
  - 媒体槽：焦点影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `caption`: text, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_divider_photo_v1`** — Theme 09 影像分隔
  - 描述：满版影像 + 巨型半透明章节序号，作为篇章之间的呼吸页
  - 媒体槽：章节影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `number`: text, `title`: text, `standfirst`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_coverstory_v1`** — Theme 09 封面故事
  - 描述：杂志封面故事版：竖排标题压图 + 导语块
  - 媒体槽：封面影像 (images)
  - 字段：`kicker`: text, `title`: text, `lead`: textarea, `meta`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_diptych_v1`** — Theme 09 双联对照
  - 描述：左右双联影像，中缝装订线，下方对照说明
  - 媒体槽：双联影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `note`: textarea, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_split_diagonal_v1`** — Theme 09 斜切分屏
  - 描述：专色斜切把版面切成文/图两半，切口做叠印
  - 媒体槽：影像 (images)
  - 字段：`kicker`: text, `title`: text, `body`: textarea, `accentText`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_photo_scene_v1`** — Theme 09 场景通栏
  - 描述：通栏场景图 + 标签云 + 侧边导轨，场景通栏 / 视觉栏
  - 媒体槽：场景影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: textarea, `titleEn`: text, `tags`: text, `caption`: textarea, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_team_v1`** — Theme 10 内容墙 / 团队
  - 描述：等高 3×2 网格 + 每图展签
  - 媒体槽：成员 1 (images.0.url), 成员 2 (images.1.url), 成员 3 (images.2.url), 成员 4 (images.3.url), 成员 5 (images.4.url), 成员 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_triptych_v1`** — Theme 10 三联影像
  - 描述：三联等高影像 + 图注条
  - 媒体槽：三联图 1 (images.0.url), 三联图 2 (images.1.url), 三联图 3 (images.2.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_strata_v1`** — Theme 10 横向影像带
  - 描述：满宽四联影像带 + 图注
  - 媒体槽：影像带 1 (images.0.url), 影像带 2 (images.1.url), 影像带 3 (images.2.url), 影像带 4 (images.3.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_inset_v1`** — Theme 10 满版内嵌
  - 描述：满版出血影像 + 内嵌文字卡
  - 媒体槽：满版影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `imageUrl`: image, `notes`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_poster_v1`** — Theme 10 海报
  - 描述：满版影像 + 底部压字大标题
  - 媒体槽：海报影像 (imageUrl)
  - 字段：`section`: text, `mark`: text, `title`: text, `tagline`: textarea, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_annotated_v1`** — Theme 10 注解图
  - 描述：底图 + 编号注解列表
  - 媒体槽：注解底图 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `imageUrl`: image, `annotations`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_exhibit_v1`** — Theme 10 陈列展
  - 描述：带框展品 + 展签文本
  - 媒体槽：展品影像 (imageUrl)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `meta`: text, `desc`: textarea, `imageUrl`: image, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## gallery

### theme01

- **`theme01_filmstrip_v1`** — Theme 01 影像长卷
  - 描述：横向长卷式图片故事展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `images`: array
- **`theme01_gallery_v1`** — Theme 01 图片掠影
  - 描述：杂志风格图片网格展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `images`: array

### theme02

- **`theme02_gallery_v1`** — Theme 02 霓虹图集
  - 描述：深色背景 + 霓虹边框图片网格展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `images`: array
- **`theme02_filmstrip_v1`** — Theme 02 霓虹影像长卷
  - 描述：深色背景 + 霓虹边框横向长卷图片故事
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `images`: array
- **`theme02_image_grid_v2`** — Theme 02 图片网格
  - 描述：2x2 图片网格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `images`: array, `captions`: array

### theme03

- **`theme03_gallery_v1`** — Theme 03 编辑风图集
  - 描述：深色代码编辑风图片网格墙，mono 编号 + 霓虹细边框
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `images`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_filmstrip_v1`** — Theme 03 编辑风影像长卷
  - 描述：深色代码编辑风横向长卷式图片故事展示
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `images`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_gallery_v1`** — Theme 04 糖果图集页
  - 描述：玻璃糖果风图片网格墙，糖果色编号 + 圆角卡片
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `images`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_triptych_v1`** — Theme 04 全幅三联
  - 描述：三张大图全幅并列，适合案例三联/产品三件套展示
  - 媒体槽：左图 (panels.0.imageUrl), 中图 (panels.1.imageUrl), 右图 (panels.2.imageUrl)
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `panels`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme04_polaroid_v1`** — Theme 04 拍立得拼贴
  - 描述：3-4 张拍立得风格卡片，轻微旋转错落排列
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `images`: array, `footnote`: text
- **`theme04_filmstrip_v1`** — Theme 04 胶片印样画廊
  - 描述：横向胶片式图片长卷，展示连续画面
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `images`: array

### theme08

- **`theme08_gallery_v1`** — Theme 08 照片墙
  - 描述：三列图片网格 + 标题，适合作品/场景展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_collage_v1`** — Theme 08 拼贴照片
  - 描述：左侧标题+右侧倾斜拼贴照片墙，适合封面变体/品牌展示
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `desc`: textarea, `photos`: array, `bigNumber`: text, `bigNumberLabel`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_photo_grid_v1`** — Theme 09 影像九宫格
  - 描述：2×2 影像矩阵 + 图注 + 专色焦点描边，适合图辑 / 现场栏
  - 媒体槽：影像 1 (images.0.url), 影像 2 (images.1.url), 影像 3 (images.2.url), 影像 4 (images.3.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_storyboard_v1`** — Theme 09 分镜格
  - 描述：2×3 分镜网格 + 编号图注，流程 / 步骤 / 现场记录栏
  - 媒体槽：分镜 1 (images.0.url), 分镜 2 (images.1.url), 分镜 3 (images.2.url), 分镜 4 (images.3.url), 分镜 5 (images.4.url), 分镜 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_snapshot_tape_v1`** — Theme 09 胶带速写
  - 描述：三栏速写照片 + 胶带斜贴 + 手写批注，花絮 / 随拍栏
  - 媒体槽：速写 1 (images.0.url), 速写 2 (images.1.url), 速写 3 (images.2.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_mosaic_v1`** — Theme 09 影像拼贴
  - 描述：3×3 影像拼贴墙 + 胶带斜贴，影像墙 / 现场全景栏
  - 媒体槽：影像 1 (images.0.url), 影像 2 (images.1.url), 影像 3 (images.2.url), 影像 4 (images.3.url), 影像 5 (images.4.url), 影像 6 (images.5.url), 影像 7 (images.6.url), 影像 8 (images.7.url), 影像 9 (images.8.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_photo_ring_v1`** — Theme 09 圆窗影像
  - 描述：墨底三扇圆形镜头窗 + 中央悬浮标题，三视角 / 季度栏
  - 媒体槽：圆窗 1 (images.0.url), 圆窗 2 (images.1.url), 圆窗 3 (images.2.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_exhibit_wall_v1`** — Theme 09 陈列墙
  - 描述：展墙式等高排列 + 每图展签编号标题，展览 / 陈列栏
  - 媒体槽：展品影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `items`: text, `images`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_masonry_v1`** — Theme 09 瀑布影像
  - 描述：瀑布流不等高排列 + 专色卡片穿插，群像墙 / 视觉墙栏
  - 媒体槽：瀑布影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `items`: text, `images`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_photo_cards_v1`** — Theme 09 影像卡集
  - 描述：四张折页角图文卡 + 大字标题描述，赛道掠影 / 卡片集栏
  - 媒体槽：卡片影像 (images)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `cards`: text, `images`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme09_gallery_wall_v1`** — Theme 09 企业掠影
  - 描述：九宫掠影墙 + 底部说明 + 标签云，Company Gallery / 掠影栏
  - 媒体槽：掠影图片 (images)
  - 字段：`section`: text, `sectionEn`: text, `title`: text, `titleEn`: text, `caption`: textarea, `images`: text, `tags`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_spark_v1`** — Theme 10 持仓小图集
  - 描述：2×3 持仓小图集 + 刻度 sparkline
  - 媒体槽：持仓 1 (images.0.url), 持仓 2 (images.1.url), 持仓 3 (images.2.url), 持仓 4 (images.3.url), 持仓 5 (images.4.url), 持仓 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_pinboard_v1`** — Theme 10 钉板九宫格
  - 描述：3×3 影像钉板 + 图注
  - 媒体槽：钉图 1 (images.0.url), 钉图 2 (images.1.url), 钉图 3 (images.2.url), 钉图 4 (images.3.url), 钉图 5 (images.4.url), 钉图 6 (images.5.url), 钉图 7 (images.6.url), 钉图 8 (images.7.url), 钉图 9 (images.8.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_gallery2_v1`** — Theme 10 画廊六格
  - 描述：3×2 纯影像画廊 + 图注
  - 媒体槽：作品 1 (images.0.url), 作品 2 (images.1.url), 作品 3 (images.2.url), 作品 4 (images.3.url), 作品 5 (images.4.url), 作品 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_mosaic_v1`** — Theme 10 马赛克拼贴
  - 描述：不规则 3×3 视觉索引 + 图注
  - 媒体槽：图块 1 (images.0.url), 图块 2 (images.1.url), 图块 3 (images.2.url), 图块 4 (images.3.url), 图块 5 (images.4.url), 图块 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_collage_v1`** — Theme 10 自由拼贴
  - 描述：大图 + 三图竖叠 + 金线图签
  - 媒体槽：图块 1 (images.0.url), 图块 2 (images.1.url), 图块 3 (images.2.url), 图块 4 (images.3.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_captioned_v1`** — Theme 10 图注组
  - 描述：三联大图 + 标题/说明图注
  - 媒体槽：图 1 (images.0.url), 图 2 (images.1.url), 图 3 (images.2.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_showcase_v1`** — Theme 10 陈列橱窗
  - 描述：主图 + 2×2 缩略陈列
  - 媒体槽：主图 (images.0.url), 缩略 1 (images.1.url), 缩略 2 (images.2.url), 缩略 3 (images.3.url), 缩略 4 (images.4.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_quilt_v1`** — Theme 10 拼布
  - 描述：4×2 紧凑影像拼布
  - 媒体槽：图块 1 (images.0.url), 图块 2 (images.1.url), 图块 3 (images.2.url), 图块 4 (images.3.url), 图块 5 (images.4.url), 图块 6 (images.5.url), 图块 7 (images.6.url), 图块 8 (images.7.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text
- **`theme10_medallions_v1`** — Theme 10 徽章墙
  - 描述：3×2 圆形徽章 + 标签
  - 媒体槽：徽章 1 (images.0.url), 徽章 2 (images.1.url), 徽章 3 (images.2.url), 徽章 4 (images.3.url), 徽章 5 (images.4.url), 徽章 6 (images.5.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## bento

### theme02

- **`theme02_bento_v1`** — Theme 02 霓虹 Bento
  - 描述：不规则数据卡片网格 + 霓虹强调
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `showInsight`: boolean, `insight`: object

### theme03

- **`theme03_bento_v1`** — Theme 03 编辑风 Bento
  - 描述：深色代码编辑风模块化数据卡片网格
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_bento_v1`** — Theme 04 糖果 Bento
  - 描述：杂志化 Bento 数据网格，支持大小卡片与糖果色调
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_photo_bento_v1`** — Theme 09 影像便当
  - 描述：非对称便当网格 1 大图 + 4 小图，图辑 / 概览栏
  - 媒体槽：影像 1 (images.0.url), 影像 2 (images.1.url), 影像 3 (images.2.url), 影像 4 (images.3.url), 影像 5 (images.4.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `titleEn`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## table

### theme01

- **`theme01_table_data`** — Theme 01 数据表格
  - 描述：表头 + 行数据 + 高亮行的排行表格
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: text, `kicker`: text, `columns`: array, `rows`: array, `highlightRow`: slider, `footnote`: text
- **`theme01_table_v1`** — Theme 01 表格页
  - 描述：玻璃卡片表格数据展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `headers`: array, `rows`: array, `highlightFirstColumn`: boolean

### theme02

- **`theme02_table_v1`** — Theme 02 霓虹表格
  - 描述：深色背景 + 霓虹表头表格数据展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `headers`: array, `rows`: array, `highlightFirstColumn`: boolean
- **`theme02_table_v2`** — Theme 02 数据表
  - 描述：紧凑数据表格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: text, `columns`: array, `rows`: array

### theme03

- **`theme03_table_v1`** — Theme 03 编辑风表格
  - 描述：深色代码编辑风数据表格，终端风格表头 + 分隔线
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `headers`: array, `rows`: array, `highlightFirstColumn`: boolean, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_table_data`** — Theme 03 编辑风数据表格
  - 描述：深色代码编辑风数据表格，终端风格表头 + 高亮行
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `columns`: array, `rows`: array, `highlightRow`: slider, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_table_v1`** — Theme 04 轮次结构表
  - 描述：带进度条的玻璃卡片表格，适合轮次/结构对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array, `rows`: array, `summary`: object
- **`theme04_scoreboard_v1`** — Theme 04 头部玩家对照表
  - 描述：多维度排名对照表，展示头部玩家关键指标
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `metrics`: array, `rows`: array, `footnote`: text
- **`theme04_quartertable_v1`** — Theme 04 季度走势表
  - 描述：季度指标对比表，带变化标签与汇总行
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `columns`: array, `rows`: array, `summary`: object
- **`theme04_chaintable_v1`** — Theme 04 产业链分层表
  - 描述：产业链各层及代表企业/环节的玻璃卡片表格
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `tiers`: array, `footnote`: text
- **`theme04_ledger_v1`** — Theme 04 投资人出手榜
  - 描述：投资人排行榜样式，带排名、出手次数、金额与趋势箭头
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `investors`: array, `footnote`: text

### theme05

- **`theme05_rank_v1`** — Theme 05 排名表
  - 描述：色条排名 + 数值 + 变化标签
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `rows`: array

### theme08

- **`theme08_table_v1`** — Theme 08 数据表
  - 描述：四列数据表，荧光金表头，适合明细/对比
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `headers`: array, `rows`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_scoreboard_v1`** — 年度计分榜
  - 描述：表格式计分板 + 轮次列 + 合计列 + 冠军行专色高亮，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `headers`: array, `rows`: array, `highlightRow`: text, `totalLabel`: text, `footnoteLeft`: text, `footnoteRight`: text

## tags

### theme01

- **`theme01_tags_v1`** — Theme 01 标签墙
  - 描述：关键词标签云墙展示
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `tags`: array, `label`: text, `value`: number, `tone`: text

### theme02

- **`theme02_tags_v1`** — Theme 02 霓虹标签墙
  - 描述：深色背景 + 霓虹发光关键词标签云
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `tags`: array

### theme03

- **`theme03_tags_v1`** — Theme 03 编辑风标签云
  - 描述：深色代码编辑风关键词标签云，代码风 mono 编号
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `tags`: array, `footnoteLeft`: text, `footnoteRight`: text

## filmstrip

### theme09

- **`theme09_filmstrip_v1`** — Theme 09 影像长卷
  - 描述：横向胶片长卷 7 帧 + 齿孔边 + 编号，影像连载 / 长图故事栏
  - 媒体槽：帧 1 (images.0.url), 帧 2 (images.1.url), 帧 3 (images.2.url), 帧 4 (images.3.url), 帧 5 (images.4.url), 帧 6 (images.5.url), 帧 7 (images.6.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

### theme10

- **`theme10_filmstrip_v1`** — Theme 10 横向胶片条
  - 描述：满宽七联胶片条 + 帧号
  - 媒体槽：帧 1 (images.0.url), 帧 2 (images.1.url), 帧 3 (images.2.url), 帧 4 (images.3.url), 帧 5 (images.4.url), 帧 6 (images.5.url), 帧 7 (images.6.url)
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `lead`: textarea, `images`: array, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## swot

### theme01

- **`theme01_swot_v1`** — Theme 01 SWOT 分析
  - 描述：玻璃质感 2x2 SWOT 分析矩阵
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `strength`: text, `weakness`: text, `opportunity`: text, `threat`: text

### theme02

- **`theme02_swot_v1`** — Theme 02 霓虹 SWOT
  - 描述：深色背景 + 霓虹四象限 SWOT 分析矩阵
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: textarea, `strength`: textarea, `weakness`: textarea, `opportunity`: textarea, `threat`: textarea

### theme03

- **`theme03_swot_v1`** — Theme 03 编辑风 SWOT
  - 描述：顶部标签 + 2×2 矩阵 + mono 象限标签
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `strength`: textarea, `weakness`: textarea, `opportunity`: textarea, `threat`: textarea, `footnoteLeft`: text, `footnoteRight`: text

### theme08

- **`theme08_quadrant_v1`** — Theme 08 四象限
  - 描述：2x2 象限矩阵 + 十字分隔，适合定位/分类
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `items`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme08_matrix_v1`** — Theme 08 场景矩阵
  - 描述：2×2 场景矩阵，区分叙事泡沫 / 明星兑现 / 等待验证 / 隐形价值
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cells`: array, `xAxisLabel`: text, `yAxisLabel`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_risk_v1`** — 风险研判
  - 描述：影响×概率四象限风险矩阵 + 等级徽章 + 应对措施，墨底
  - 媒体槽：无
  - 字段：`section`: text, `sectionEn`: text, `mark`: text, `title`: text, `risks`: array, `axisImpact`: text, `axisProbability`: text, `folioLeft`: text, `folioPage`: text, `folioRight`: text

## pest

### theme01

- **`theme01_pest_v1`** — Theme 01 PEST 分析
  - 描述：玻璃质感 2x2 PEST 宏观环境分析矩阵
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `political`: text, `economic`: text, `social`: text, `technological`: text

### theme02

- **`theme02_pest_v1`** — Theme 02 霓虹 PEST
  - 描述：深色背景 + 霓虹 2x2 PEST 宏观环境矩阵
  - 媒体槽：无
  - 字段：`title`: text, `kicker`: text, `subtitle`: textarea, `political`: textarea, `economic`: textarea, `social`: textarea, `technological`: textarea

### theme03

- **`theme03_pest_v1`** — Theme 03 编辑风 PEST
  - 描述：深色代码编辑风 2x2 PEST 宏观环境分析矩阵
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `political`: textarea, `economic`: textarea, `social`: textarea, `technological`: textarea, `footnoteLeft`: text, `footnoteRight`: text

## closing

### theme01

- **`theme01_closing_v2`** — Theme 01 结尾页
  - 描述：居中标题 + 可选 CTA 与联系信息
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cta`: text, `contact`: text, `email`: text, `link`: text
- **`theme01_conclusion_v1`** — Theme 01 结论页
  - 描述：标题 + 核心结论卡片
  - 媒体槽：无
  - 字段：`title`: text, `subtitle`: textarea, `points`: array

### theme02

- **`theme02_closing_v1`** — Theme 02 结尾页
  - 描述：霓虹标题 + CTA 按钮 + 联系信息
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cta`: text, `contact`: text, `email`: text, `link`: text
- **`theme02_closing_v2`** — Theme 02 收尾 B
  - 描述：居中收尾页，大标题 + 行动号召
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `cta`: text

### theme03

- **`theme03_closing_v1`** — Theme 03 编辑风封底
  - 描述：深色代码编辑风封底，左侧大标题 + 右侧数据来源/研究提示分栏
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `leftColumnTitle`: text, `leftColumnItems`: array, `rightColumnTitle`: text, `rightColumnItems`: array, `contact`: text, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_conclusion_v1`** — Theme 03 编辑风结论
  - 描述：深色代码编辑风结论页，顶部标签 + 结论卡片矩阵
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `title`: text, `subtitle`: textarea, `points`: array, `footnoteLeft`: text, `footnoteRight`: text
- **`theme03_closing_v2`** — Theme 03 编辑风结尾 v2
  - 描述：居中标题 + CTA + 联系信息
  - 媒体槽：无
  - 字段：`tag`: text, `tagLabel`: text, `topRightMeta`: text, `kicker`: text, `title`: text, `subtitle`: textarea, `cta`: text, `contact`: text, `email`: text, `link`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme04

- **`theme04_closing_v1`** — Theme 04 糖果结尾页
  - 描述：居中大标题 + CTA 胶囊按钮，用于核心结论或结尾
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `cta`: text, `contact`: text
- **`theme04_verdict_v1`** — Theme 04 结论印章页
  - 描述：大标题 + 结论词 + 圆形印章装饰的结尾页
  - 媒体槽：无
  - 字段：`tag`: text, `title`: text, `subtitle`: textarea, `verdict`: text, `verdictLabel`: text, `cta`: text, `contact`: text

### theme05

- **`theme05_closing_v1`** — Theme 05 结论页
  - 描述：核心论断 + 3 个数据要点
  - 媒体槽：无
  - 字段：`kicker`: text, `claim`: textarea, `points`: array, `footnoteLeft`: text, `footnoteRight`: text

### theme06

- **`theme06_closing_v1`** — Theme 06 封底致谢
  - 描述：大标题 + 副标题 + 联系信息卡片 + CTA，支持可选背景图
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `imageUrl`: image, `links`: array, `cta`: text

### theme07

- **`theme07_quote_v1`** — Theme 07 金句页
  - 描述：金句页，用于报告收尾
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text, `footnoteLeft`: text, `footnoteRight`: text, `images`: array, `imageRatio`: select
- **`theme07_closing_v1`** — Theme 07 结束页
  - 描述：结束页，用于报告收尾
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text, `footnoteLeft`: text, `footnoteRight`: text, `images`: array, `imageRatio`: select
- **`theme07_closing_quote_v1`** — Theme 07 结束页（引语）
  - 描述：引语风格结束页：居中大引语 + 引号装饰 + 关键词高亮，覆盖编辑型收尾场景
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text, `footnoteLeft`: text, `footnoteRight`: text, `images`: array, `imageRatio`: select
- **`theme07_about_lab_v1`** — Theme 07 关于实验室
  - 描述：关于实验室，用于报告收尾
  - 媒体槽：无
  - 字段：`imageUrl`: image, `kicker`: text, `statement`: textarea, `subtitle`: textarea, `points`: array, `source`: text, `footnoteLeft`: text, `footnoteRight`: text, `images`: array, `imageRatio`: select

### theme08

- **`theme08_closing_v1`** — Theme 08 结尾致谢
  - 描述：居中大标题 + 标签 + 联系方式，适合收尾
  - 媒体槽：无
  - 字段：`kicker`: text, `title`: text, `subtitle`: textarea, `tags`: array, `contact`: text, `footnoteLeft`: text, `footnoteRight`: text

### theme09

- **`theme09_closing_v1`** — Theme 09 封底结语
  - 描述：满版影像压暗 + 居中明朝体结语 + 版本信息 colophon
  - 媒体槽：封底影像 (imageUrl)
  - 字段：`mark`: text, `word`: textarea, `subtitle`: textarea, `colophon`: array, `imageUrl`: image

### theme10

- **`theme10_closing_v1`** — Theme 10 封底结语
  - 描述：满版影像压暗 + 居中结语 + 版本信息 colophon
  - 媒体槽：封底影像 (imageUrl)
  - 字段：`mark`: text, `word`: textarea, `subtitle`: textarea, `colophon`: array, `imageUrl`: image, `mood`: select
