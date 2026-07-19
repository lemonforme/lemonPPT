# 贡献指南

感谢你对 lemonPPT 感兴趣！本指南帮助你快速贡献新主题、新版式或文档。

---

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/lemonforme/lemonPPT.git
cd lemonPPT

# 安装依赖
corepack pnpm install

# 构建所有包
corepack pnpm -r build

# 运行测试
corepack pnpm test
```

---

## 项目结构

```
lemonPPT/
├── apps/
│   └── server/              # 本地预览与导出服务
├── packages/
│   ├── core/                # goal.json 类型、schema、校验
│   ├── view-model/          # goal.json 规范化
│   ├── themes/              # 主题 token 与 CSS
│   ├── templates/           # React 版式组件
│   ├── composer/            # role → layout 编排
│   ├── renderer/            # HTML 渲染与 PPTX/PDF 导出
│   ├── agent-prompts/       # LLM prompt 与 fallback
│   └── cli/                 # 命令行工具
├── scripts/                 # 开发脚本与脚手架
└── docs/                    # 项目文档
```

---

## 新增版式

使用脚手架生成 boilerplate：

```bash
node scripts/create-layout.mjs <role> <name>

# 示例：新增一个客户评价卡片版式
node scripts/create-layout.mjs testimonial v2
```

脚手架会生成：
- `packages/templates/src/base/{role}-{name}.tsx`
- `packages/templates/src/base/{role}-{name}.test.tsx`

然后按提示完成手动注册：

1. `packages/templates/src/index.ts` — 添加 export
2. `packages/templates/src/registry.tsx` — 添加 import 与 `registerLayout`
3. `packages/renderer/src/export-pptx.ts` — 添加 `case` 与 `renderXxx` 函数
4. `packages/themes/src/base/styles.css`、`dark-tech/styles.css`、`warm-business/styles.css` — 添加 CSS
5. `packages/composer/src/index.ts` — 把新版式 ID 加入对应 role 的候选列表
6. `SKILL.md` — 更新可用版式表
7. 运行 `node packages/cli/scripts/copy-skill.mjs` 同步到 `packages/cli/SKILL.md`

### 版式开发规范

- `theme` 统一使用 `'base'`，表示通用版式
- `role` 必须是 `@lemonppt/core` 中定义的 `SlideRole` 之一
- props 字段名保持简洁，优先复用现有字段：`title`、`subtitle`、`kicker`、`items`、`points`、`stats`、`quote`、`author` 等
- 支持编辑的字段用 `<EditableField>` 包裹，并传入 `prop`、`slideIdx`、`editable`
- 图片元素添加 `data-lp-editable-image`、`data-lp-slide-idx`、`data-lp-prop`

---

## 新增主题

使用脚手架生成主题目录：

```bash
node scripts/create-theme.mjs <theme-id> "<display-name>"

# 示例
node scripts/create-theme.mjs neon "霓虹科技"
```

脚手架会生成：
- `packages/themes/src/{theme-id}/tokens.ts`
- `packages/themes/src/{theme-id}/styles.css`（从 base 复制）

然后完成：

1. `packages/themes/src/index.ts` — 导入并注册到 `themes` 数组
2. 编辑 `packages/themes/src/{theme-id}/styles.css` — 修改配色、字体、氛围
3. `README.md` / `SKILL.md` — 更新可用主题表
4. 运行 `node packages/cli/scripts/copy-skill.mjs` 同步 SKILL.md

### 主题开发规范

- 所有颜色使用 CSS 变量，变量前缀统一为 `--lp-`
- 必须覆盖的核心变量：
  - `--lp-bg`：背景色
  - `--lp-surface`：卡片/表面色
  - `--lp-text`：主文字色
  - `--lp-text-inverse`：反色文字
  - `--lp-primary`：主色
  - `--lp-secondary`：次要文字/辅助色
  - `--lp-accent`：强调色
  - `--lp-muted`：弱化色
  - `--lp-border`：边框色
- 字体栈优先使用系统字体，特殊字体需确认可商用/可开源

---

## 提交规范

使用以下前缀：

| 前缀 | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档更新 |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具/依赖 |

示例：

```bash
git commit -m "feat(templates): add testimonial_v2 layout with metric support"
```

---

## 发布流程

仅维护者执行：

```bash
# 1. 确认所有测试通过
corepack pnpm -r build && corepack pnpm test

# 2. 更新 8 个发布包的版本号
# 可手动修改或使用 scripts/bump-versions.mjs

# 3. 发布到 npm
corepack pnpm publish:packages --access public

# 4. 用 npx 验证
npx --yes @lemonppt/cli@<version> generate "测试" --pages 5 --out /tmp/test.json
npx --yes @lemonppt/cli@<version> export /tmp/test.json --pptx /tmp/test.pptx
```

---

## 需要帮助？

- 查看 [`docs/progress.md`](docs/progress.md) 了解当前进度
- 查看 [`docs/analysis/npm-publish-roadmap.md`](docs/analysis/npm-publish-roadmap.md) 了解发布路线
- 提交 issue 或 PR 前请先运行 `corepack pnpm test`
