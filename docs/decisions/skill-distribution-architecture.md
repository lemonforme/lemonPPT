# 决策记录：Skill 分发架构

> 日期：2026-07-20
> 状态：已决策
> 决策：继续采用 CLI 内置 `install-skill`，暂不提供独立的 `@lemonppt/skill` 包

---

## 背景

`docs/plans/skill-distribution.md` 提出两种分发形态：

1. **CLI 内置安装器**：`npx @lemonppt/cli install-skill`
2. **独立 Skill 包**：`npx @lemonppt/skill`

当前已实现方案 1，且已发布到 npm `0.1.3`。

---

## 评估

| 维度 | CLI 内置（B1） | 独立 Skill 包（B2） |
|---|---|---|
| 当前状态 | 已实现，验证通过 | 需新建包、调整路径、额外发布 |
| 维护成本 | 低（与 CLI 同版本） | 中（多一个包，需同步版本） |
| 用户体验 | `npx @lemonppt/cli install-skill`，统一 | `npx @lemonppt/skill`，多一个命令 |
| 平台兼容性 | 已覆盖 Claude/Codex/Cursor | 理论上更好，但当前无明确需求 |
| 与 Dashi 对标 | 不完全一致 | 更接近 Dashi 的 `npx dashi-ppt-skill` |
| 演进灵活性 | 可随时拆分出独立包 | 一旦拆分，CLI 端需决定是否保留 |

---

## 决策理由

1. **当前方案已够用**：`lemonppt install-skill` 成功安装到 Claude/Codex/Cursor 的技能目录，SKILL.md 能随 CLI 版本自动更新。
2. **避免过度设计**：独立 skill 包在没有明确平台兼容需求时，只是增加维护负担。
3. **保留未来拆分可能**：如果未来某平台要求独立的 skill 包结构，可以再新建 `@lemonppt/skill`，CLI 端继续保留安装器作为兼容入口。
4. **版本一致性**：SKILL.md 与 CLI 行为强相关，放在同一个包里能避免版本错配。

---

## 结论

- **继续用 CLI 内置 `install-skill` 作为唯一官方 Skill 分发入口**。
- `scripts/install.mjs` 保留作为本地开发兼容入口。
- 不新建 `@lemonppt/skill` 包，直到有明确的外部需求。

---

## 后续行动

- 在 `README.md` 和 `SKILL.md` 中统一使用 `npx @lemonppt/cli install-skill` 作为安装方式。
- 如果未来收到特定平台（如某 Agent 平台只接受独立 skill 包）的需求，再启动 B2 方案。
