// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

// 仅保留共享 LpEChart 组件的 re-export，ECharts 初始化逻辑已按主题拆分到
// packages/templates/src/echarts/theme*-init.ts，实现按主题按需加载。
export { LpEChart, type LpEChartProps, type LpEChartType } from '../../echarts/shared-chart.js';
