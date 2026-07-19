# lemonPPT

根据一句话主题或需求，自动生成精美 PPT（goal.json/HTML/PPTX/PDF）。

## 能力

- 接受用户输入（主题、目标页数、主题风格、语言）
- 生成结构化演示文稿规划（goal.json）
- 渲染为可浏览的 HTML
- 导出为 PPTX 或 PDF

## 使用流程

用户说"帮我做一份 PPT"时，按以下三步执行：

### 1. 生成 goal.json

```bash
lemonppt generate "<主题>" --pages <页数> --theme <主题> --language zh --out ./goal.json
```

- `--pages`：页数，建议 6~20 页
- `--theme`：主题 ID，可选 `minimal`、`dark-tech`、`warm-business`
- `--language`：`zh` 或 `en`
- `--api-key`：可选，OpenAI 兼容 API Key；不传则使用内置 fallback 示例

### 2. 导出 PPTX / PDF

```bash
lemonppt export ./goal.json --pptx ./deck.pptx --pdf ./deck.pdf
```

至少传 `--pptx` 或 `--pdf` 之一。

### 3. 交付文件

把生成的 `goal.json`、`deck.pptx`、`deck.pdf` 以及 `output/index.html` 展示给用户。

如果用户只需要文件，交付 PPTX/PDF；如果用户想在线预览，交付 HTML。

## goal.json 格式

```json
{
  "title": "演示文稿标题",
  "goal": "演示目标",
  "audience": "目标受众",
  "owner": "汇报人",
  "theme": "minimal",
  "language": "zh",
  "pageCount": 8,
  "randomSeed": "可选种子",
  "slides": [
    {
      "role": "cover",
      "layout": "cover_v1",
      "props": {
        "title": "标题",
        "subtitle": "副标题",
        "date": "2026-07-18"
      }
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | PPT 标题 |
| `goal` | 是 | 演示目标/背景 |
| `audience` | 是 | 受众描述 |
| `owner` | 否 | 汇报人 |
| `theme` | 是 | 主题 ID |
| `language` | 否 | `zh` 或 `en`，默认 `zh` |
| `pageCount` | 是 | 总页数，必须等于 `slides.length` |
| `randomSeed` | 否 | 随机种子，保证结果可复现 |
| `slides` | 是 | 幻灯片数组 |

每个 slide：

| 字段 | 必填 | 说明 |
|---|---|---|
| `role` | 是 | 页面角色，见下方角色表 |
| `layout` | 否 | 具体版式 ID；留空时系统按 role 自动选择 |
| `props` | 是 | 该版式所需数据 |

## 可用主题

| 主题 ID | 风格 |
|---|---|
| `minimal` | 极简商务 |
| `dark-tech` | 深色科技 |
| `warm-business` | 温暖商务 |

## 页面角色与版式

Agent 选页时只需指定 `role`，系统会根据角色自动挑选合适版式。只有在明确需要某一款版式时才填 `layout`。

| role | 用途 | 可用版式 |
|---|---|---|
| `cover` | 封面 | `cover_v1` |
| `tableOfContents` | 目录 | `table_of_contents_v1` |
| `metric` | 关键指标 | `metric_v1`, `metric_v2` |
| `stats` | 2x2 统计网格 | `stats_v1` |
| `chart` | 图表 | `chart_v1` |
| `comparison` | 对比 | `comparison_v1`, `comparison_v2` |
| `pricing` | 价格方案 | `pricing_v1` |
| `process` | 流程步骤 | `process_v1`, `process_v2` |
| `timeline` | 时间线 | `timeline_v1` |
| `roadmap` | 路线图 | `roadmap_v1` |
| `quote` | 金句引用 | `quote_v1`, `quote_v2` |
| `testimonial` | 客户评价 | `testimonial_v1` |
| `content` | 内容页 | `content_v1`, `content_v2`, `content_v3`, `split_v1` |
| `faq` | 问答 | `faq_v1` |
| `feature` | 产品特性 | `feature_v1` |
| `team` | 团队介绍 | `team_v1` |
| `partners` | 合作伙伴墙 | `partners_v1` |
| `image` | 全屏图片 | `image_v1` |
| `gallery` | 图片画廊 | `gallery_v1` |
| `swot` | SWOT 分析 | `swot_v1` |
| `pest` | PEST 分析 | `pest_v1` |
| `closing` | 结尾页 | `closing_v1`, `closing_v2` |

## 常见 props 字段

- `title`：页面主标题
- `kicker`：小标题/标签
- `subtitle`：副标题
- `items`：列表项数组
- `points`：要点数组
- `stats`：指标数组，元素含 `label`、`value`、`unit`、`change`
- `image` / `imageUrl`：图片 URL（远程 URL 在 PPTX 中可能显示占位符）
- `cta` / `contact` / `email` / `link`：结尾页联系方式

## 常见错误处理

1. **没有 API Key**：`lemonppt generate` 会 fallback 到内置示例内容，仍可生成完整文件。
2. **页数太少**：建议封面 + 目录 + 3~5 页内容 + 结尾，最少 5 页。
3. **远程图片在 PPTX 中不显示**：PPTX 导出优先使用本地图片或 base64；远程 URL 会显示占位符。
4. **生成失败**：检查 JSON 是否合法、`slides.length` 是否等于 `pageCount`。

## 完整示例

```bash
lemonppt generate "AI 助手产品发布会" --pages 8 --theme dark-tech --language zh --out ./ai-launch.json
lemonppt render ./ai-launch.json --out ./output
lemonppt export ./ai-launch.json --pptx ./ai-launch.pptx --pdf ./ai-launch.pdf
```

## 注意事项

- 不要手动指定每个 slide 的 `layout`，优先只写 `role`。
- `goal.json` 是核心协议，生成后可以直接交给用户修改再导出。
- 所有命令在 lemonPPT 项目根目录执行；CLI 入口为 `packages/cli/dist/cli.js` 或安装后的 `lemonppt`。
