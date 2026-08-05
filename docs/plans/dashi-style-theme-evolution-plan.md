<!-- lemonPPT - AI-powered presentation generation -->
<!-- Copyright (c) 2026 lemonforme -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# 走向 Dashi PPT 模式的主题扩展方案

> 本文档分析如果 lemonPPT 采用类似 Dashi PPT 的「每主题大量独立 slot、独立数据结构」模式，需要在架构、编辑器、Agent、导出层做哪些改造。
> 方案借鉴的是 Dashi 的**主题生产工业化思路**，不复制其具体代码、Token、类名、slot 命名或动效算法。

---

## 一、Dashi 模式的核心特征

| 特征 | 说明 |
|---|---|
| **每主题独立组件池** | 每个主题拥有自己完整的版式组件集合，主题间不共享组件。 |
| **一页一组件** | 每个 slot 对应一个独立 `layoutId` 和独立的 `props` 结构。 |
| **高视觉上限** | 同一 `role` 在不同主题下可以有完全不同的 DOM 结构、动效、装饰。 |
| **强编辑器支持** | 每个 slot 都有对应的自定义属性面板，支持复杂数据绑定。 |
| **高维护成本** | 版式数量 = 主题数 × 每主题 slot 数，组件和测试量同步增长。 |

Dashi theme02 有 74 个独立 slot；如果 lemonPPT 未来做 3 个主题，每个 50-70 slot，总版式数将达到 150-210 个。

---

## 二、当前 lemonPPT 与 Dashi 模式的差距

### 2.1 版式数量与结构

- 当前 theme01：64 个版式，按 `role` 组织，同 role 内 props 结构高度相似。
- Dashi 模式：每主题 50-100+ slot，很多 slot 的 props 结构是独特的。

### 2.2 编辑器属性面板

- 当前：基于 `slide.props` 的**通用推断表单**。
  - 依赖全局 `FIELD_LABELS`、`inferFieldType`、`getEmptyItemDefault`。
  - 无法按 `layoutId` 定义字段标签、控件类型、默认值、数组项结构。
- Dashi 模式需要：每个 slot 的**专属属性面板**。

### 2.3 Agent 选页协议

- 当前：`composer` 按 `role` 选页，再随机或规则化选择具体变体。
- Dashi 模式需要：`composer` 能感知每个 slot 的**语义标签、适用场景、内容形状**，才能精准匹配用户需求。

### 2.4 PPTX 导出映射

- 当前：按 `(role, theme)` 注册 PPTX 渲染器。
- Dashi 模式需要：按 `layoutId` 注册渲染器，因为同 role 不同 slot 的 DOM 结构差异很大。

---

## 三、必须建立的四大基础设施

### 3.1 Props Schema 注册表

每个版式在注册时附带 `propsSchema`，描述该版式的可编辑字段。

```ts
// packages/core/src/types.ts
export interface PropsField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'image' | 'color' | 'array' | 'object';
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
  /** 是否支持在画布上直接编辑（如简单文本） */
  inlineEditable?: boolean;
  /** 字段分组 */
  group?: string;
}

export interface PropsSchema {
  fields: PropsField[];
}
```

### 3.2 版式级属性面板

`editor-script.ts` 不再根据字段名推断控件，而是读取当前 `slide.layout` 对应的 `schema`，按 schema 渲染：

```ts
const layout = getLayout(slide.layout);
const schema = layout?.schema;
schema?.fields.forEach(field => {
  renderField(field, getProp(slide.props, field.key));
});
```

控件库需要扩展：
- `text` / `textarea` / `number` / `boolean` / `select`
- `image`（URL + 本地上传）
- `color`（颜色选择器）
- `array`（数组增删改，支持字符串数组和对象数组）
- `object`（嵌套对象展开）
- `chart-data`（图表数据表格）
- `table-data`（表格数据编辑）

### 3.3 画布与面板联动

明确分工：

| 编辑方式 | 适用场景 |
|---|---|
| **画布直接编辑** | 简单文本字段（`title`、`subtitle`、`kicker`、`quote` 等） |
| **右侧面板编辑** | 图片 URL/上传、图表数据、数组项、颜色、布尔开关、枚举选择 |
| **联动** | 点击画布中的某个元素，右侧面板高亮并滚动到对应字段 |

实现方式：
- 保留 `EditableField`，用于画布直接编辑简单文本。
- 给复杂元素加 `data-lp-prop` 和 `data-lp-field-type`，点击后在右侧面板聚焦。
- 给右侧面板字段加 `data-lp-target-selector`，修改后同步高亮画布元素。

### 3.4 Agent 选页协议升级

每个 slot 增加语义描述，供 Agent 选择：

```ts
export interface LayoutMeta {
  id: LayoutId;
  theme: ThemeId;
  role: SlideRole;
  displayName: string;
  description?: string;
  needsMedia: boolean;
  mediaSlots?: MediaSlot[];
  // 新增
  tags?: string[];            // 语义标签，如 ['hero', 'video-bg', 'data-heavy']
  contentShape?: string;      // 内容形状描述，如 'single-stat', '3-column-cards'
  minItems?: number;          // 最少需要的数据项
  maxItems?: number;          // 最多支持的数据项
}
```

`composer` 根据用户意图 + slot 标签选择最合适的 layout。

---

## 四、具体改造方案

### 4.1 core 类型扩展

在 `packages/core/src/types.ts` 中新增 `PropsField` 和 `PropsSchema`：

```ts
export interface PropsField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'image' | 'color' | 'array' | 'object';
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
  inlineEditable?: boolean;
  group?: string;
  /** 数组项的 schema，仅 type === 'array' 时有效 */
  itemSchema?: PropsField[];
}

export interface PropsSchema {
  fields: PropsField[];
}
```

### 4.2 registry 改造

在 `packages/templates/src/registry.tsx` 中扩展 `RegisteredLayout`：

```ts
export interface RegisteredLayout<P extends Record<string, unknown>> {
  meta: LayoutMeta;
  component: ComponentType<P>;
  schema?: PropsSchema;
}

export function getLayoutSchema(id: string): PropsSchema | undefined {
  return registryById.get(id)?.schema;
}
```

注册示例：

```ts
registerLayout<Theme02CoverV1Props>({
  meta: theme02CoverV1Meta,
  component: Theme02CoverV1,
  schema: theme02CoverV1Schema,
});
```

### 4.3 组件改造

每个版式组件文件导出三部分：

```ts
// packages/templates/src/themes/theme02/cover-v1.tsx
export const theme02CoverV1Meta: LayoutMeta = { ... };

export const theme02CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'headline', label: '主标题', type: 'text', inlineEditable: true },
    { key: 'tagline', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'event', label: '活动名称', type: 'text' },
    { key: 'backgroundVideo', label: '背景视频', type: 'image' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#00e0b8' },
  ],
};

export function Theme02CoverV1(props: Theme02CoverV1Props): ReactNode { ... }
```

### 4.4 editor-script.ts 改造

1. **渲染属性面板时优先使用 schema**：

```ts
function renderSlidePanel() {
  const slide = goal.slides[selectedSlideIdx];
  const layout = getLayout(slide.layout);
  const schema = layout?.schema;

  if (schema) {
    renderSchemaFields(schema, slide.props);
  } else {
    renderSlideFieldsLegacy(slide.props);
  }
}
```

2. **新增按 schema 渲染的控件函数**：

```ts
function renderSchemaField(field: PropsField, value: unknown, path: string) {
  switch (field.type) {
    case 'text': return createTextField(field.label, value, ...);
    case 'image': return createImageField(field.label, value, ...);
    case 'array': return createArraySectionFromSchema(field, value, path);
    case 'object': return createObjectSectionFromSchema(field, value, path);
    // ...
  }
}
```

3. **画布点击联动**：

```ts
editableEls.forEach(el => {
  el.addEventListener('click', () => {
    const prop = el.getAttribute('data-lp-prop');
    focusPropertyField(prop);
  });
});
```

### 4.5 PPTX 导出改造

当前按 `(role, theme)` 注册渲染器，在 Dashi 模式下应改为按 `layoutId` 注册：

```ts
// 新增
export function registerPptxLayoutRenderer(layoutId: string, renderFn: RenderFn): void {
  pptxRenderersByLayout.set(layoutId, renderFn);
}

// 解析时优先按 layoutId
export function getPptxRenderer(slide: Slide): RenderFn | undefined {
  return pptxRenderersByLayout.get(slide.layout)
    ?? pptxRenderersByRoleTheme.get(slide.role)?.get(slide.theme);
}
```

这样每个 slot 可以有独立的 PPTX 渲染逻辑。

### 4.6 CLI 与渲染层

- `render.tsx` 已按 `goal.theme` 加载 CSS，无需大改。
- `copyThemeAssets` 已按 theme 复制 `styles.css`，无需大改。
- `buildAddSlideModalMarkup` 已按 theme 过滤 `listLayouts()`，无需大改。

---

## 五、实施路线图

### 阶段 1：基础设施（2-3 天）

- 在 `core` 新增 `PropsSchema`、`PropsField` 类型。
- 改造 `registry.tsx`，支持 `schema` 字段和 `getLayoutSchema()`。
- 改造 `editor-script.ts`，实现按 schema 渲染属性面板。
- 保留 legacy fallback，避免一次性改完所有版式。

### 阶段 2：theme01 schema 迁移（3-5 天）

- 为 theme01 的 64 个版式补充 `schema`。
- 优先覆盖高频 role：cover、metric、content、chart、comparison、timeline、team、pricing。
- 验证编辑器、PPTX 导出、渲染全链路正常。

### 阶段 3：theme02 Dashi 式 MVP（5-7 天）

- 设计 theme02 的 15-20 个独立 slot，每个 slot 有独立 props 结构。
- 每个 slot 都带 `schema`。
- 每个 slot 都注册 PPTX 渲染器。
- 跑通生成 → 预览 → 编辑 → 导出全链路。

### 阶段 4：theme02 完整化（10-15 天）

- 将 theme02 扩展到 50-70 个 slot。
- 覆盖发布会/路演常见场景：封面变体、数据大屏、产品展示、人物金句、时间轴、架构图、风险分析等。
- 补齐 Agent prompt 和 composer 的 slot 标签体系。

### 阶段 5：工具链与维护（持续）

- `gallery` 脚本支持按 theme 和 slot 分类展示。
- `snapshot` 脚本为每个 slot 生成渲染快照。
- `audit-layouts` 扩展为检查 schema 覆盖率。
- 建立 theme 贡献指南，规范 slot 命名、schema 编写、PPTX 渲染器注册。

---

## 六、成本与收益分析

### 收益

| 收益 | 说明 |
|---|---|
| **视觉上限高** | 每个 slot 都能为特定内容量身定制，不受通用结构限制。 |
| **品牌差异化强** | theme02 可以完全不同于 theme01，适合高端定制。 |
| **AI 生成空间大** | Agent 可以针对 slot 标签精准选页，生成更具设计感的 deck。 |
| **商业化潜力** | 可售卖/订阅高级主题，社区可投稿主题。 |

### 成本

| 成本 | 说明 |
|---|---|
| **组件数量爆炸** | 3 主题 × 60 slot = 180 个组件，加上测试和快照。 |
| **编辑器成本** | 每个 slot 都需要 schema，复杂 slot 需要定制控件。 |
| **PPTX 导出成本** | 每个 slot 都需要独立的 PPTX 渲染器或通用渲染回退。 |
| **Agent 训练成本** | 需要为每个 slot 写描述、标签、示例，提示词变长。 |
| **维护成本** | 同一 bug 可能在多个 slot 重复出现，更新设计系统时需批量修改。 |
| **设计资产成本** | 每个主题都需要完整的设计稿和设计系统。 |

---

## 七、风险与红线

- ❌ **不能复制 Dashi PPT 的具体代码**：包括 `gxnTheme.js`、slot 实现、CSS 算法。
- ❌ **不能复用 Dashi 的 Token 和类名**：包括 `--gxn-`、`.gxn-theme`、具体色值。
- ❌ **不能复用 Dashi 的 slot 命名和文案**：需要原创命名和中文标签。
- ✅ **可以借鉴的是**：主题工业化生产流程、每主题独立组件池、slot 级 schema 机制、Agent 标签选页思路。
- ⚠️ **性能风险**：版式数量过多会增加构建时间、包体积和运行时内存。
- ⚠️ **一致性风险**：多主题并行时，设计系统、动效节奏、字体规范需要严格把关。

---

## 八、关键决策点

在启动之前，建议先确定以下问题：

1. **主题数量目标**：先做 2 个（theme01 + theme02），还是直接规划 3-5 个？
2. **每主题 slot 数**：theme02 先做 20 个 MVP，还是直接目标 50+？
3. **是否保留 theme01 的共享结构**：theme01 改为全独立 slot，还是保持现状只让 theme02 走 Dashi 模式？
4. **PPTX 导出策略**：每个 slot 独立渲染器，还是为复杂 slot 提供通用几何渲染回退？
5. **Agent 选页精度**：是否愿意为每个 slot 写详细描述和标签？

如果确定走这条路，**阶段 1 的基础设施必须先做**，否则 theme02 会重复踩 theme01 的坑。
