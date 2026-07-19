# lemonPPT Skill 分发与集成方案

> 分析 Dashi PPT 的 Agent/Skill 调用模式，并为 lemonPPT 制定同样的分发路线。

---

## 一、Dashi PPT 的部署形态

Dashi PPT 本质上是一个**本地运行的生成器 + 一份给 AI 看的说明书**，通过 Skill 机制被各种 AI Agent 调用。

### 1.1 物理结构

它发布到 npm 的包内部是这样的：

```text
dashi-ppt-skill/
├── skill/                    # 实际被安装到 Agent 技能目录的内容
│   ├── SKILL.md              # AI 的使用说明书
│   ├── project/              # 生成器本体（Node 项目）
│   │   ├── package.json
│   │   ├── src/              # React 渲染、主题、布局
│   │   └── scripts/          # 选页、渲染、校验、导出
│   └── scripts/              # Skill 级脚本
│       ├── render_goal_deck.sh
│       └── check_latest_version.mjs
└── install.mjs               # npx 安装器
```

用户运行：

```bash
npx dashi-ppt-skill@latest
```

安装器会把 `skill/` 目录复制到 AI Agent 的技能目录，例如：

- `~/.claude/skills/dashi-ppt/`
- `~/.codex/skills/dashi-ppt/`
- `~/.agents/skills/dashi-ppt/`

### 1.2 AI 怎么调用它

Agent 读到 `SKILL.md` 后，按里面的规则执行：

1. 解析用户需求 → 生成 `goal.json`
2. 调用 `<skill-root>/scripts/render_goal_deck.sh`
3. 启动本地预览服务器
4. 按需调用导出接口生成 PPTX/PDF

`SKILL.md` 就是 AI 和生成器之间的协议。

### 1.3 支持的平台

从 README 看，Dashi 已实测支持：

- Claude Code
- Codex
- 豆包
- Marvis / Workbuddy / Dumate / Qclaw
- Cursor / 其他本地 Agent

---

## 二、lemonPPT 能不能也这样

完全可以。lemonPPT 也可以打包成一个 **npm skill 包**，让用户通过 `npx lemonppt@latest` 安装到 AI Agent 里。

### 2.1 lemonPPT Skill 的 MVP 结构

```text
lemonppt-skill/
├── skill/
│   ├── SKILL.md              # 给 AI 看的规则
│   ├── project/              # 生成器
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── themes/       # 主题 Token
│   │   │   ├── layouts/      # React 页面组件
│   │   │   ├── renderer.tsx  # SSR 渲染
│   │   │   └── server.ts     # 预览/导出服务
│   │   └── scripts/
│   │       ├── render.mjs
│   │       └── export-pptx.mjs
│   └── assets/
│       └── skill-icon.png
├── install.mjs               # 复制 skill/ 到 Agent 技能目录
└── package.json
```

### 2.2 用户侧体验

安装：

```bash
npx lemonppt@latest
```

然后对 Agent 说：

> “帮我用 lemonppt 生成一份 8 页的产品发布 PPT，主题是 AI 助手。”

Agent 读 `SKILL.md` → 生成 `goal.json` → 调用渲染脚本 → 给预览链接或 PPTX 文件。

---

## 三、lemonPPT 需要自己做哪些事

### 1. 写一份好的 `SKILL.md`

这是核心。它需要告诉 AI：

- 你的 skill 是干什么的
- `goal.json` 长什么样
- 可选主题和布局
- 如何调用渲染脚本
- 如何导出 PPTX/PDF
- 注意事项和边界情况

### 2. 做一个 npm 安装器

参考 Dashi 的 `npm-dist/install.mjs`，实现：

- 探测常见 skill 目录
- 复制 `skill/` 到目标目录
- 处理更新和依赖缓存
- 支持国内镜像

### 3. 让生成器能被脚本调用

AI Agent 最终还是要执行本地命令。你的渲染流程要能被一行命令跑通：

```bash
<skill-root>/scripts/render.sh <goal.json> <output.html>
```

### 4. 多平台兼容

不同 Agent 的 skill 目录不同，但结构大同小异。安装器覆盖主流目录即可：

```text
~/.claude/skills/lemonppt/
~/.codex/skills/lemonppt/
~/.config/anthropic/skills/lemonppt/
~/.agents/skills/lemonppt/
```

---

## 四、一个关键区别

Dashi 目前是 **AGPL 开源 + 专有导出引擎**。lemonPPT 如果走 MIT/Apache-2.0 开源路线，会更适合被其他开发者二次集成：

- 其他项目可以直接引用你的包
- 社区可以贡献主题和布局
- 更容易被 AI Agent 平台官方收录

但这也意味着你必须把所有代码（包括导出引擎）都用宽松协议开源，不能像 Dashi 那样保留专有子包。

---

## 五、建议的 lemonPPT 发布路径

| 阶段 | 动作 |
|---|---|
| **Phase 1** | 本地能跑通：goal.json → HTML → PPTX |
| **Phase 2** | 写 `SKILL.md`，让 AI Agent 能调用 |
| **Phase 3** | 做 `install.mjs`，支持 `npx lemonppt@latest` |
| **Phase 4** | 发布到 npm，测试 Claude/Codex/Cursor 兼容性 |
| **Phase 5** | 开源仓库，接受社区主题贡献 |
