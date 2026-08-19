# Cursor 安装 lemonPPT Skill

Cursor 没有官方「skill 目录」机制，但可以通过以下两种方式接入 lemonPPT。

## 方式一：Cursor Composer / Agent 系统提示

1. 复制 `SKILL.md` 全文到 Cursor Settings → AI Rules → User Rules。
2. 在 `.cursorrules` 文件中加入：

```markdown
当用户要求生成 PPT 时，使用 lemonPPT：
1. 构造 goal.json（可用 themePack、省略 pageCount 和 role）
2. 运行 lemonppt validate-goal-spec ./goal.json
3. 运行 lemonppt render ./goal.json --out ./output
4. 运行 lemonppt validate-deck ./output --goal ./goal.json
5. 运行 lemonppt validate-copy ./goal.json ./output
6. 导出：lemonppt export ./goal.json --pptx ./deck.pptx
```

## 方式二：本地 CLI + Composer 终端

```bash
cd /path/to/lemonPPT
COREPACK_INTEGRITY_KEYS=0 corepack pnpm install
corepack pnpm -r build
```

然后在 Cursor Composer 终端中直接调用：

```bash
node packages/cli/dist/cli.js generate "AI 产品发布" --pages 10 --theme theme02 --out ./goal.json
node packages/cli/dist/cli.js render ./goal.json --out ./output
node packages/cli/dist/cli.js export ./goal.json --pptx ./deck.pptx
```

## HTTP API 方式

也可以先启动服务，再让 Cursor 的 Composer 通过 HTTP 调用：

```bash
node packages/cli/dist/cli.js serve --port 3456
```

常用端点：

- `POST /api/render`
- `POST /api/export/pptx`
- `POST /api/render-editor`
- `POST /api/stage-media`
