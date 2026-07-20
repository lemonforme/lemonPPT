# lemonPPT 贡献指南

感谢你关注 lemonPPT！

## 当前贡献政策

**lemonPPT 现已接受外部 Pull Request，但需先完成 CLA 签署流程。**

在提交 PR 之前，请先阅读本指南、行为准则和贡献者许可协议：

- [CLA.md](CLA.md) — 贡献者许可协议
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — 社区行为准则

## 贡献流程

1. **Fork 仓库** 并在你的分支上进行修改。
2. **先开 Issue 讨论** 重大改动或新增版式/主题，避免重复劳动。
3. **本地验证**：
   - `corepack pnpm -r build`
   - `corepack pnpm test`
   - `corepack pnpm agent:test`
   - `corepack pnpm audit:layouts`
4. **提交 Pull Request**，并在 PR 描述中勾选 CLA 协议选项。
5. **等待审查**：维护者会审查代码、测试和 CLA 状态。

## 开发规范

- 所有代码文件必须包含 AGPL-3.0 SPDX 协议头。
- 提交信息应简洁说明 "为什么" 而非 "做了什么"。
- 新增版式请使用 `node scripts/create-layout.mjs <name>` 脚手架，并补充测试。
- 暂不新增主题；聚焦版式、Agent 体验和导出质量。

## 代码风格

- TypeScript：严格模式
- 测试：使用 Vitest
- 版式组件：使用 CSS 变量和 `lp-` 前缀类名，避免全局样式污染

## 协议

lemonPPT 采用 [AGPL-3.0](LICENSE) 协议。任何未来被合并的代码都必须兼容该协议。

---

*最后更新：2026-07-20*
