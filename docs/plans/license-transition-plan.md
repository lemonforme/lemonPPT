# lemonPPT 协议切换与合规自查方案

> 本文档为 lemonPPT 内部规划文档，保存在 `docs/` 目录下，**不对外公开上传**。
> 本方案基于 [`docs/analysis/dashi-ppt-license-analysis.md`](./../analysis/dashi-ppt-license-analysis.md) 的分析结果制定。

---

## 一、目标

将 lemonPPT 从 **MIT License** 切换为 **AGPL-3.0**，并完成合规自查，确保项目独立、干净、可长期开源。

---

## 二、决策结论

| 事项 | 决策 | 理由 |
|---|---|---|
| 主协议 | 改为 **AGPL-3.0** | 与 Dashi PPT 对齐，符合“开源 AI Skill”定位，防止闭源 SaaS 白嫖 |
| 外部 PR | **暂时不接受** | 等待 CLA 和协议治理文档完善后再开放 |
| 导出引擎 | 继续使用 `pptxgenjs`（MIT） | 不碰 Dashi 的专有导出引擎，安全 |
| 依赖审计 | 必须完成 | 确认无 GPL/AGPL 不兼容依赖 |
| 资产来源 | 必须自查 | 字体、图标、图片、动态背景均需合法来源 |

---

## 三、执行步骤

### Step 1：依赖协议扫描

- 运行 `npx license-checker --summary`
- 输出完整依赖协议清单
- 识别是否存在 copyleft 或专有依赖
- 处理不兼容依赖（替换、移除或隔离）

### Step 2：资产来源自查

| 资产类型 | 检查点 | 处理方式 |
|---|---|---|
| 字体 | 是否来自 Google Fonts / Fontshare | 保留 LICENSE 文件 |
| 图标 | 是否原创或来自 MIT/SIL 图标库 | 禁止复制 Dashi SVG |
| 图片 | 是否可商用或自己生成 | 替换可疑来源 |
| 动态背景 | 是否原创 JSON / CSS / Canvas | 禁止复制 Unicorn JSON |
| 主题 CSS | 是否独立编写 | 与 Dashi 主题做差异化检查 |

### Step 3：代码独立性确认

- 扫描 `packages/` 下所有源码
- 确认无 Dashi 项目代码、结构、命名痕迹
- 确认 Prompt、版式、主题为原创或合法来源

### Step 4：切换协议文件

- 替换根目录 `LICENSE` 为 AGPL-3.0 全文
- 更新根 `package.json` 的 `license` 字段
- 更新所有 `packages/*/package.json` 的 `license` 字段
- 更新 `README.md` 和 `SKILL.md` 的协议声明

### Step 5：源码加 SPDX 协议头

- 为 `packages/*/src/**/*.ts`、`.tsx`、`.mjs` 等文件批量添加：

```ts
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
```

-  exempt: 第三方代码、自动生成文件、配置文件

### Step 6：建立协议治理文档

- 新增 `docs/LEGAL.md`
- 包含：整体协议、依赖清单、资产来源、独立性声明、贡献者协议说明

### Step 7：设置 PR 策略

- 在 `README.md` 和 `CONTRIBUTING.md` 中注明：
  - 当前阶段**暂时不接受外部 Pull Request**
  - 可通过 Issue 提交建议
  - 正式开放贡献时会提前公告 CLA 流程

### Step 8：版本发布

- 完成以上步骤后，发布新版本（如 `0.1.6`）
- 在 Release Note 中明确说明协议变更

---

## 四、风险提示

1. **AGPL 网络服务条款**：部署 lemonPPT 服务的人需要向最终用户公开源代码。Agent 调用场景的法律解释存在灰色地带，建议在 `docs/LEGAL.md` 中做明确使用说明。
2. **外部贡献版权**：改协议前已有的外部贡献（如有），需要确认版权归属或获得授权。
3. **字体合规**：部分字体即使免费，也需要保留 OFL 版权声明。

---

## 五、时间节点（建议）

| 阶段 | 预计时间 | 产出 |
|---|---|---|
| 依赖扫描 + 资产自查 | 1~2 天 | 合规检查清单 |
| 协议切换 + 文件更新 | 半天 | 新 LICENSE、package.json 更新 |
| 源码加协议头 + 治理文档 | 1 天 | `docs/LEGAL.md`、SPDX 头 |
| 发布新版本 | 半天 | `v0.1.6` Release |

---

## 六、执行状态

| 步骤 | 状态 | 备注 |
|---|---|---|
| Step 1 依赖协议扫描 | ✅ 已完成 | `pnpm licenses list --prod` 扫描通过，依赖均为 MIT/Apache-2.0/ISC/BSD-3-Clause/MPL-2.0，jszip 按 MIT 使用 |
| Step 2 资产来源自查 | ✅ 已完成 | 无字体/图标/图片文件入仓，主题 CSS 为原创；无 Unicorn Studio 场景或 Dashi 资产 |
| Step 3 代码独立性确认 | ✅ 已完成 | `packages/` 源码无 Dashi 项目代码、结构或命名痕迹 |
| Step 4 切换协议文件 | ✅ 已完成 | `LICENSE` 已替换为 AGPL-3.0 全文；所有 `package.json` 的 `license` 字段已更新 |
| Step 5 源码加 SPDX 头 | ✅ 已完成 | 87 个源码/CSS 文件已添加 SPDX 头 |
| Step 6 协议治理文档 | ✅ 已完成 | `docs/LEGAL.md` 已创建 |
| Step 7 设置 PR 策略 | ✅ 已完成 | `README.md`、`SKILL.md`、`CONTRIBUTING.md` 已注明暂不接受外部 PR |
| Step 8 版本发布 | ✅ 已完成 | 已发布 `v0.1.6`，所有 8 个包端到端验证通过 |

## 七、备注

- 本方案文档仅用于内部执行参考。
- 最终对外展示的协议信息以根目录 `LICENSE`、`README.md`、`SKILL.md` 为准。
- 本文件不随 npm 包发布，也不写入 GitHub Release 附件。
- 开放外部 PR 前，必须先完成 CLA 流程并更新 `CONTRIBUTING.md`。
