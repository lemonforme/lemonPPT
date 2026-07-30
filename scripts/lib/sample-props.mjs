#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

function sampleProps(meta) {
  const role = meta.role;
  const layoutId = meta.id;
  const base = { title: `${role} 示例标题`, kicker: '示例标签' };

  // theme02 MVP 版式使用更贴合的示例数据
  if (layoutId === 'theme02_cover_v1') {
    return {
      kicker: '霓虹主题演示',
      title: 'Neon Pitch',
      subtitle: '深色背景 + 双配色方案 + 科技感版式',
      date: '2026.07'
    };
  }
  if (layoutId === 'theme02_chapter_v1') {
    return { kicker: '章节', number: '01', title: '核心发现', subtitle: '从数据到洞察的关键转折' };
  }
  if (layoutId === 'theme02_metric_big') {
    return {
      kicker: '核心指标',
      title: '年度融资总额',
      subtitle: '全年大额融资事件汇总',
      value: '970',
      unit: '亿美元',
      context: '创历史新高，占全美风险投资近三分之一',
      metrics: [
        { value: '97', label: '事件笔数', accent: false },
        { value: '≈10 亿', label: '平均单笔', accent: false },
        { value: '+41%', label: 'Q4 环比', accent: true },
        { value: 'Q2-Q3', label: '高峰区间', accent: false }
      ]
    };
  }
  if (layoutId === 'theme02_chart_v1') {
    return {
      title: '季度营收增长',
      kicker: '霓虹图表',
      subtitle: '全年四个季度持续上扬',
      type: 'bar',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [1800, 2450, 3200, 4150],
      unit: '万元',
      showInsight: true,
      insight: {
        headline: '11,600',
        subheadline: 'FULL-YEAR TOTAL',
        items: [
          { label: 'Q4 环比', value: '+30%' },
          { label: '平均季度', value: '2,900' }
        ],
        badge: { text: 'Q4 增长最快', tone: 'accent' }
      }
    };
  }
  if (layoutId === 'theme02_chart_funnel') {
    return {
      title: '资金集中度',
      kicker: '霓虹漏斗',
      subtitle: '资本如何向头部收敛',
      data: [
        { name: '全市场', value: 970 },
        { name: '头部 10 家', value: 232 },
        { name: 'Top 3', value: 181 },
        { name: '单笔最大', value: 66 }
      ],
      showInsight: true,
      insight: {
        value: '24%',
        label: '头部 10 家 = 全市场近 1/4',
        description: '少数独角兽反复获得巨额追加投资，头部格局已然确立。'
      },
      footnote: '数据来源：lemonPPT 内部统计 · 2026'
    };
  }
  if (layoutId === 'theme02_chart_donut') {
    return {
      title: '赛道分布',
      kicker: '霓虹环形',
      subtitle: '融资额占比',
      total: { value: '970 亿美元', label: '全年合计' },
      segments: [
        { label: '通用大模型', labelEn: 'General LLM', value: '420', percent: '43.3%', color: 'var(--lp-accent)' },
        { label: '垂直应用', labelEn: 'Vertical Apps', value: '245', percent: '25.3%', color: 'var(--lp-accent-cool)' },
        { label: 'AI 基础设施', labelEn: 'AI Infra', value: '198', percent: '20.4%', color: 'var(--lp-accent-2)' },
        { label: 'AI 芯片', labelEn: 'AI Chips', value: '97', percent: '10.0%', color: 'var(--lp-violet)' },
        { label: '其他', labelEn: 'Others', value: '10', percent: '1.0%', color: 'var(--lp-cyan)' }
      ],
      footnote: '数据来源：lemonPPT 内部统计 · 2026'
    };
  }
  if (layoutId === 'theme02_chart_heatmap') {
    return {
      title: '用户活跃度热力',
      kicker: '霓虹热力',
      xAxis: ['周一', '周二', '周三', '周四', '周五'],
      yAxis: ['00:00', '06:00', '12:00', '18:00'],
      data: [
        ['周一', '00:00', 120], ['周一', '06:00', 80], ['周一', '12:00', 320], ['周一', '18:00', 280],
        ['周二', '00:00', 90], ['周二', '06:00', 60], ['周二', '12:00', 350], ['周二', '18:00', 300],
        ['周三', '00:00', 100], ['周三', '06:00', 70], ['周三', '12:00', 380], ['周三', '18:00', 340],
        ['周四', '00:00', 110], ['周四', '06:00', 75], ['周四', '12:00', 360], ['周四', '18:00', 310],
        ['周五', '00:00', 130], ['周五', '06:00', 85], ['周五', '12:00', 400], ['周五', '18:00', 360]
      ]
    };
  }
  if (layoutId === 'theme02_chart_radar') {
    return {
      title: '能力雷达对比',
      kicker: '霓虹雷达',
      indicators: [
        { name: '性能', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '易用性', max: 100 },
        { name: '扩展性', max: 100 },
        { name: '安全性', max: 100 }
      ],
      data: [
        { name: '当前', value: [85, 90, 78, 88, 82] },
        { name: '目标', value: [95, 95, 90, 92, 95] }
      ]
    };
  }
  if (layoutId === 'theme02_chart_gauge') {
    return {
      title: '年度目标达成率',
      kicker: '霓虹仪表',
      value: 78,
      min: 0,
      max: 100,
      unit: '%'
    };
  }
  if (layoutId === 'theme02_progress_v1') {
    return {
      kicker: '达成度',
      title: '年度目标完成进度',
      subtitle: '关键 OKR 当前完成度',
      items: [
        { label: 'ARR 营收目标', value: 8400, max: 12000, unit: '万元' },
        { label: '企业客户签约', value: 320, max: 500, unit: '家' },
        { label: '产品 NPS', value: 72, max: 100, unit: '分' },
        { label: '团队规模', value: 86, max: 120, unit: '人' }
      ]
    };
  }
  if (layoutId === 'theme02_delta_v1') {
    return {
      kicker: '今昔对照',
      title: '关键指标变化',
      subtitle: '去年同期 vs 当前表现',
      items: [
        { label: 'ARR 营收', previous: 4200, current: 8400, unit: '万元' },
        { label: '企业客户', previous: 120, current: 320, unit: '家' },
        { label: '产品 NPS', previous: 58, current: 72, unit: '分' },
        { label: '团队规模', previous: 45, current: 86, unit: '人' }
      ],
      footnote: '数据来源：公司财务与运营系统 · 2026'
    };
  }
  if (layoutId === 'theme02_content_v1') {
    return {
      kicker: '要点总结',
      title: '内容标题',
      subtitle: '用霓虹 bullet 列表突出关键信息',
      bullets: [
        '全栈 AI 演示生成，从大纲到成稿一键完成',
        '双配色方案自由切换，适配不同品牌调性',
        'SVG 图表 + 洞察面板，数据表达更聚焦'
      ]
    };
  }
  if (layoutId === 'theme02_closing_v1') {
    return {
      kicker: '感谢观看',
      title: "Let's Build Neon",
      subtitle: '用深色霓虹风格点亮下一场演示',
      cta: '开始使用',
      contact: '柠檬团队',
      email: 'hello@lemonppt.dev',
      link: 'lemonppt.dev'
    };
  }

  // theme02 非 MVP 版式示例数据
  if (layoutId === 'theme02_table_of_contents_v1') {
    return {
      title: '目录',
      subtitle: 'CONTENTS',
      items: [
        { title: '市场背景与机会', page: '02' },
        { title: '产品方案与优势', page: '04' },
        { title: '商业模式与增长', page: '06' },
        { title: '团队与融资计划', page: '08' }
      ]
    };
  }
  if (layoutId === 'theme02_metrics_v1') {
    return {
      kicker: '数据墙',
      title: '核心指标一览',
      subtitle: '用霓虹卡片呈现关键业务数据',
      stats: [
        { label: '年度营收', value: '1.2', unit: '亿元', tone: 'accent' },
        { label: '用户增长', value: '+320', unit: '%', tone: 'cool' },
        { label: '客户满意度', value: '98', unit: '%', tone: 'accent2' },
        { label: '团队规模', value: '86', unit: '人', tone: 'default' }
      ]
    };
  }
  if (layoutId === 'theme02_team_v1') {
    return {
      kicker: '核心团队',
      title: '我们是谁',
      subtitle: '一支相信技术与设计能改变演示的团队',
      members: [
        { name: '李雷', role: 'CEO', bio: '连续创业者，前头部 SaaS 产品负责人。' },
        { name: '韩梅梅', role: 'CTO', bio: '全栈工程师，专注 AI 与渲染引擎。' },
        { name: '林涛', role: '设计总监', bio: '十年品牌设计经验，深耕视觉系统。' },
        { name: '吉姆', role: '增长负责人', bio: '数据驱动增长，擅长 B2B 规模化获客。' }
      ]
    };
  }
  if (layoutId === 'theme02_image_v1') {
    return {
      kicker: '视觉呈现',
      title: '一张图讲清产品价值',
      subtitle: '上传高清大图，用霓虹渐变叠加打造科技感封面。',
      image: '',
      caption: '图注：产品界面示意图'
    };
  }
  if (layoutId === 'theme02_bento_v1') {
    return {
      kicker: 'Bento',
      title: '模块化数据展示',
      subtitle: '用不规则网格突出关键数字',
      items: [
        { label: '年度营收', value: '1.2', unit: '亿元', size: 'large' },
        { label: '用户增长', value: '+320', unit: '%', size: 'medium' },
        { label: 'NPS', value: '72', unit: '分', size: 'small' },
        { label: '付费客户', value: '1,200', unit: '+', size: 'small' },
        { label: '模板数', value: '150', unit: '+', size: 'small' }
      ]
    };
  }
  if (layoutId === 'theme02_feature_v1') {
    return {
      kicker: '产品特性',
      title: '为什么选择柠檬 PPT',
      subtitle: '从生成到交付，每个环节都更高效',
      features: [
        { title: 'AI 一键生成', description: '基于大模型自动理解需求，生成完整大纲与页面。' },
        { title: '主题系统', description: '深色霓虹、浅色玻璃等多种风格，全局一键切换。' },
        { title: '数据可视化', description: '内置 SVG 图表与洞察面板，数据表达更聚焦。' }
      ]
    };
  }
  if (layoutId === 'theme02_process_v1') {
    return {
      kicker: '实施路径',
      title: '四步上线',
      subtitle: '从需求到交付的标准化流程',
      steps: [
        { title: '需求梳理', description: '明确受众、目标与核心信息。' },
        { title: 'AI 生成', description: '输入主题，自动生成大纲与版式。' },
        { title: '视觉调优', description: '切换配色、替换图片、微调文案。' },
        { title: '导出交付', description: '一键导出 PPTX / PDF / 图片。' }
      ]
    };
  }
  if (layoutId === 'theme02_roadmap_v1') {
    return {
      kicker: '产品路线',
      title: '未来 12 个月规划',
      subtitle: '从基础能力到生态开放的清晰节奏',
      phases: [
        { phase: 'Q1 基础能力', items: ['编辑器内核重构', '主题系统 2.0', 'PPTX 导出优化'] },
        { phase: 'Q2 智能升级', items: ['AI 多轮对话生成', '自动配图与数据联动', '协作评论'] },
        { phase: 'Q3 企业场景', items: ['品牌资产中心', '权限与版本管理', '私有部署'] },
        { phase: 'Q4 生态开放', items: ['模板市场', '开发者 SDK', '开放主题协议'] }
      ]
    };
  }
  if (layoutId === 'theme02_pricing_v1') {
    return {
      kicker: '定价方案',
      title: '选择适合你的方案',
      subtitle: '从个人创作者到企业团队，灵活扩展',
      tiers: [
        { name: '免费版', price: '¥0', period: '/ 月', features: ['每月 10 次生成', '3 种基础主题', 'PNG 导出'], cta: '开始使用', highlight: false },
        { name: '专业版', price: '¥99', period: '/ 月', features: ['无限次生成', '全部主题与版式', 'PPTX / PDF 导出', '优先客服'], cta: '立即升级', highlight: true },
        { name: '团队版', price: '¥399', period: '/ 月', features: ['5 人协作', '品牌资产中心', 'API 接入', '专属客户成功'], cta: '联系销售', highlight: false }
      ]
    };
  }
  if (layoutId === 'theme02_gallery_v1') {
    return {
      kicker: '图集',
      title: '精选图片',
      subtitle: '用霓虹边框网格展示产品场景',
      images: [
        { url: '', caption: '图片说明 1' },
        { url: '', caption: '图片说明 2' },
        { url: '', caption: '图片说明 3' },
        { url: '', caption: '图片说明 4' }
      ]
    };
  }
  if (layoutId === 'theme02_swot_v1') {
    return {
      kicker: '战略分析',
      title: 'SWOT 分析',
      subtitle: '看清内外部环境，制定下一步策略',
      strength: 'AI 生成能力领先，主题系统可扩展，社区活跃度高。',
      weakness: '品牌知名度仍在建立，部分高级版式依赖人工设计。',
      opportunity: '企业数字化汇报需求增长，AI 工具接受度提升。',
      threat: '大厂同类产品布局加速，用户审美要求持续提高。'
    };
  }
  if (layoutId === 'theme02_faq_v1') {
    return {
      kicker: '常见问题',
      title: '你可能想知道的',
      subtitle: '快速了解柠檬 PPT 的核心能力与使用方式',
      items: [
        { q: '柠檬 PPT 适合什么场景？', a: '融资路演、产品发布、季度汇报、培训课件等需要高质量演示的场合。' },
        { q: '生成后能否继续编辑？', a: '可以。编辑器支持直接修改文字、替换图片、调整配色与版式。' },
        { q: '导出格式有哪些？', a: '支持 PPTX、PDF 和高清图片导出，满足不同分发需求。' }
      ]
    };
  }
  if (layoutId === 'theme02_partners_v1') {
    return {
      kicker: '合作伙伴',
      title: '他们都在使用',
      subtitle: '与领先企业共同推动演示方式升级',
      partners: [
        { name: '云智科技', logoUrl: '' },
        { name: '未来资本', logoUrl: '' },
        { name: '星辰数据', logoUrl: '' },
        { name: '蓝海传媒', logoUrl: '' },
        { name: '红石咨询', logoUrl: '' },
        { name: '极光设计', logoUrl: '' },
        { name: '万象集团', logoUrl: '' },
        { name: '银河创投', logoUrl: '' }
      ]
    };
  }
  if (layoutId === 'theme02_testimonial_v1') {
    return {
      kicker: '客户评价',
      quote: '柠檬 PPT 帮助我们把汇报制作时间从 2 天缩短到 2 小时，团队可以把更多精力放在业务思考上。',
      author: '陈晓明',
      role: '产品总监',
      company: '未来科技有限公司',
      avatarUrl: ''
    };
  }
  if (layoutId === 'theme02_pest_v1') {
    return {
      kicker: '宏观分析',
      title: 'PEST 分析',
      subtitle: '从政策、经济、社会、技术四维度洞察环境',
      political: 'AI 内容生成监管框架逐步完善，合规化成为产品准入门槛。',
      economic: '企业降本增效需求强烈，数字化工具预算占比持续提升。',
      social: '远程协作常态化，对轻量化、可分享演示内容的需求激增。',
      technological: '大模型多模态能力快速进步，文本到幻灯片的生成质量显著提高。'
    };
  }
  if (layoutId === 'theme02_table_v1') {
    return {
      kicker: '数据表',
      title: '方案对比一览',
      subtitle: '多维度评估，辅助决策',
      headers: ['维度', '传统方式', '柠檬 PPT'],
      rows: [
        ['制作时间', '2-3 天', '10 分钟'],
        ['风格一致性', '依赖设计师', '主题系统保证'],
        ['数据更新', '手动修改', '联动刷新'],
        ['协作效率', '版本混乱', '实时协作'],
        ['导出格式', '单一', 'PPTX / PDF / 图片']
      ],
      highlightFirstColumn: true
    };
  }
  if (layoutId === 'theme02_tags_v1') {
    return {
      kicker: '标签墙',
      title: '关键词云',
      subtitle: '一眼看懂用户最关心的能力',
      tags: [
        { label: 'AI', value: 98, tone: 'accent' },
        { label: '自动化', value: 85, tone: 'positive' },
        { label: '可视化', value: 72 },
        { label: '协作', value: 60 },
        { label: '云端', value: 55 },
        { label: '效率', value: 80, tone: 'positive' },
        { label: '设计', value: 45 },
        { label: '品牌', value: 38 },
        { label: 'PPTX', value: 65, tone: 'accent' },
        { label: '智能生成', value: 70 }
      ]
    };
  }
  if (layoutId === 'theme02_filmstrip_v1') {
    return {
      kicker: '影像长卷',
      title: '产品故事',
      subtitle: '用连续画面讲述关键历程',
      images: [
        { url: '', caption: '阶段一' },
        { url: '', caption: '阶段二' },
        { url: '', caption: '阶段三' },
        { url: '', caption: '阶段四' },
        { url: '', caption: '阶段五' }
      ]
    };
  }
  if (layoutId === 'theme02_stats_v1') {
    return {
      kicker: '核心指标',
      title: '增长数据一览',
      subtitle: '用霓虹数字卡片突出关键成果',
      stats: [
        { label: '注册用户', value: '120K', unit: '+' },
        { label: '月活跃用户', value: '45K', unit: '+' },
        { label: '付费转化率', value: '8.5', unit: '%' },
        { label: '客户续费率', value: '92', unit: '%' },
        { label: '模板使用量', value: '2.4M', unit: '+' },
        { label: 'NPS 评分', value: '72', unit: '' }
      ]
    };
  }

  // theme03 MVP 版式示例数据
  if (layoutId === 'theme03_cover_v1') {
    return {
      tag: '调研报告',
      tagLabel: '2024',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '2024 美国大额融资 {{AI}} 公司调研报告',
      subtitle: '2024 年是美国人工智能产业的「资本大年」。本报告聚焦单笔 ≥1 亿美元的大额融资事件。',
      metricValue: '970',
      metricUnit: '亿美元',
      metricLabel: '全年 AI 风险投资额',
      metricDescription: '占全美风险投资近 ⅓ · 97 笔大额融资事件',
      stats: [
        { value: '970', unit: '亿美元', label: '全年 AI 风险投资额' },
        { value: '97', unit: '笔', label: '单笔 ≥1 亿美元事件' },
        { value: '10', unit: '亿美元', label: '平均单笔融资额' }
      ],
      footnoteLeft: '编制 · 2026.06    口径 · ≥1 亿美元公开融资',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_chapter_v1') {
    return {
      tag: '章节',
      tagLabel: 'SECTION 01',
      topRightMeta: 'STRUCTURE // CHAPTER',
      number: '01',
      numberEnglish: 'CHAPTER ONE',
      title: '市场全景：{{资本}} 为何押注 AI',
      description: '从宏观融资额、头部机构出手频次到行业分布，全景式扫描 2024 年美国 AI 融资市场。',
      items: [
        { number: '01', title: '全年融资总额与趋势' },
        { number: '02', title: '行业分布与赛道热度' },
        { number: '03', title: '头部机构与轮次结构' }
      ]
    };
  }
  if (layoutId === 'theme03_content_v1') {
    return {
      tag: '研究方法',
      tagLabel: 'METHOD',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '横纵分析法：如何读懂 {{AI}} 融资地图',
      subtitle: '横向比较赛道热度，纵向追踪头部项目，从数据中提取结构性信号。',
      columns: [
        {
          title: '横向 · 赛道扫描',
          points: ['覆盖大模型、基础设施、应用层三大赛道', '统计各赛道融资金额、事件数与平均单笔', '识别赛道集中度与头部项目占比']
        },
        {
          title: '纵向 · 项目追踪',
          points: ['筛选单笔 ≥1 亿美元的大额融资事件', '追踪同一项目在不同轮次的估值变化', '分析投资人结构与出手逻辑']
        },
        {
          title: '交叉 · 结构判断',
          points: ['将金额、轮次、估值、投资人四维度交叉', '识别泡沫区间与真实增长区间', '输出可验证的投资假设']
        }
      ]
    };
  }
  if (layoutId === 'theme03_metric_big') {
    return {
      tag: '核心数据',
      tagLabel: 'KEY FIGURE',
      topRightMeta: '2024 · USA · AI VENTURE',
      value: '32',
      unit: '%',
      label: '2024 年美国 AI 吸纳的风险投资占比',
      description: 'AI 赛道以不到科技投资 10% 的事件数量，吸纳了近三分之一的资金。',
      showInsight: true,
      insight: {
        label: '集中度',
        value: 'TOP 10 项目',
        description: '占 AI 大额融资总额的 58%，头部效应显著，资本向基础设施与大模型倾斜。'
      },
      metrics: [
        { value: '970', unit: '亿美元', label: '全年 AI 风险投资额' },
        { value: '97', unit: '笔', label: '大额融资事件' },
        { value: '10', unit: '亿美元', label: '平均单笔融资额' }
      ]
    };
  }
  if (layoutId === 'theme03_ranking_v1') {
    return {
      tag: '横向透视',
      tagLabel: '04',
      topRightMeta: '单笔最大融资 · 单位：亿美元',
      title: '{{头部玩家}} 融资排名',
      subtitle: '2024 年美国 AI 领域单笔融资额最高的 6 个项目。',
      unit: '亿',
      items: [
        { rank: '01', name: 'OpenAI', category: '大模型', value: '66', maxValue: '66' },
        { rank: '02', name: 'Anthropic', category: '大模型', value: '40', maxValue: '66' },
        { rank: '03', name: 'Databricks', category: '数据平台', value: '10', maxValue: '66' },
        { rank: '04', name: 'xAI', category: '大模型', value: '9', maxValue: '66' },
        { rank: '05', name: 'CoreWeave', category: '算力', value: '7.5', maxValue: '66' },
        { rank: '06', name: 'Scale AI', category: '数据标注', value: '6.8', maxValue: '66' }
      ],
      insightLabel: '集中度',
      insightText: 'TOP 6 项目合计融资 139.3 亿美元，占全年 AI 大额融资总额的 14.4%。'
    };
  }
  if (layoutId === 'theme03_chart_donut') {
    return {
      tag: '场景分布',
      tagLabel: '05',
      topRightMeta: 'AI 编码助手使用场景 · 单位：%',
      title: '{{场景分布}}：开发者把 AI 助手用在哪里',
      subtitle: '基于受访工程师过去 30 天内的主力项目使用情况，按周活跃使用场景统计。',
      total: { value: '1,200', label: '受访工程师' },
      segments: [
        { label: '代码生成 / 补全', labelEn: 'Code Generation', value: '41', percent: '41%' },
        { label: '代码解释 / 重构', labelEn: 'Refactoring', value: '26', percent: '26%' },
        { label: '测试与调试', labelEn: 'Testing & Debug', value: '17', percent: '17%' },
        { label: '文档与注释', labelEn: 'Documentation', value: '10', percent: '10%' },
        { label: '其他', labelEn: 'Others', value: '6', percent: '6%' }
      ],
      showInsight: true,
      insight: {
        value: '41%',
        label: '代码生成场景占比最高',
        description: '代码生成与补全合计占开发者使用场景的 67%，是 AI 编码助手最核心的价值洼地。'
      }
    };
  }
  if (layoutId === 'theme03_chart_bar') {
    return {
      tag: '季度趋势',
      tagLabel: '06',
      topRightMeta: 'AI 编码助手收入 · 单位：百万美元',
      title: '{{季度增长}}：AI 助手商业化加速',
      subtitle: '基于公开财报与行业访谈整理的 2023-2024 年代表性 AI 编码助手商业化收入趋势。',
      unit: 'USD M',
      bars: [
        { label: 'Q1 23', labelEn: '2023 Q1', value: '120' },
        { label: 'Q2 23', labelEn: '2023 Q2', value: '185' },
        { label: 'Q3 23', labelEn: '2023 Q3', value: '290' },
        { label: 'Q4 23', labelEn: '2023 Q4', value: '420' },
        { label: 'Q1 24', labelEn: '2024 Q1', value: '580' },
        { label: 'Q2 24', labelEn: '2024 Q2', value: '760' }
      ],
      showInsight: true,
      insight: {
        value: '+127%',
        label: 'Q4 环比增长',
        description: '下半年企业客户采购推动收入连续两个季度翻倍，付费坐席渗透率达到 34%。'
      }
    };
  }
  if (layoutId === 'theme03_chart_v1') {
    return {
      tag: '数据概览',
      tagLabel: '04',
      topRightMeta: '年度指标 · 单位：件',
      title: '{{关键指标}}：全年核心数据回顾',
      subtitle: '展示全年四个季度的关键业务指标变化。',
      type: 'bar',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [1200, 1850, 2400, 3100],
      unit: '件',
      showInsight: true,
      insight: {
        value: '+38%',
        label: '年度同比增长',
        description: '核心指标连续四个季度保持双位数增长，Q4 受节日营销推动创下新高。'
      }
    };
  }
  if (layoutId === 'theme03_trend_v1') {
    return {
      tag: '增长趋势',
      tagLabel: '05',
      topRightMeta: '活跃用户 · 单位：千人',
      title: '{{用户增长}}：多产品线的月度活跃用户趋势',
      subtitle: '三条主要产品线在过去 6 个月的活跃用户走势。',
      type: 'line',
      series: [
        {
          name: 'AI 助手',
          data: [
            { label: '1月', value: 120 },
            { label: '2月', value: 145 },
            { label: '3月', value: 180 },
            { label: '4月', value: 220 },
            { label: '5月', value: 290 },
            { label: '6月', value: 360 }
          ]
        },
        {
          name: '模板库',
          data: [
            { label: '1月', value: 80 },
            { label: '2月', value: 95 },
            { label: '3月', value: 110 },
            { label: '4月', value: 135 },
            { label: '5月', value: 160 },
            { label: '6月', value: 190 }
          ]
        }
      ],
      unit: 'k'
    };
  }
  if (layoutId === 'theme03_chart_radar') {
    return {
      tag: '能力评估',
      tagLabel: '07',
      topRightMeta: '产品能力雷达 · 满分 100',
      title: '{{竞争力}}：核心产品维度对比',
      subtitle: '当前版本与目标版本在六个核心维度上的能力对比。',
      indicators: [
        { name: '性能', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '易用性', max: 100 },
        { name: '扩展性', max: 100 },
        { name: '安全性', max: 100 },
        { name: '生态', max: 100 }
      ],
      data: [
        { name: '当前', value: '85,90,78,88,82,75' },
        { name: '目标', value: '95,95,90,92,95,88' }
      ],
      showInsight: true,
      insight: {
        value: '+13%',
        label: '平均能力提升空间',
        description: '当前版本在性能与稳定性上表现较好，但生态与易用性仍与目标存在差距。'
      }
    };
  }
  if (layoutId === 'theme03_chart_funnel') {
    return {
      tag: '转化漏斗',
      tagLabel: '08',
      topRightMeta: '营销转化 · 单位：人',
      title: '{{漏斗}}：从曝光到成交的关键转化',
      subtitle: '某次营销活动的用户转化漏斗。',
      data: [
        { name: '曝光', value: '10000' },
        { name: '点击', value: '4500' },
        { name: '访问', value: '2800' },
        { name: '注册', value: '1200' },
        { name: '成交', value: '360' }
      ],
      showInsight: true,
      insight: {
        value: '68%',
        label: '点击到访问转化率',
        description: '落地页加载速度优化后，点击到访问的转化率提升至 68%，但注册环节仍有优化空间。'
      }
    };
  }
  if (layoutId === 'theme03_chart_gauge') {
    return {
      tag: '完成率',
      tagLabel: '09',
      topRightMeta: '季度目标 · 单位：%',
      title: '{{目标达成}}：Q3 核心 KPI 完成度',
      subtitle: '截至季度末，核心 KPI 的累计完成情况。',
      value: 78,
      min: 0,
      max: 100,
      unit: '%',
      showInsight: true,
      insight: {
        value: '78%',
        label: '目标达成率',
        description: 'Q3 核心 KPI 完成度良好，超出预期 3 个百分点。'
      }
    };
  }
  if (layoutId === 'theme03_chart_heatmap') {
    return {
      tag: '相关性',
      tagLabel: '10',
      topRightMeta: '模块依赖 · 密度得分',
      title: '{{依赖密度}}：核心模块调用热力分布',
      subtitle: '颜色越深表示模块间调用越频繁。',
      xAxis: ['渲染', '模板', 'AI', '存储', '导出'],
      yAxis: ['渲染', '模板', 'AI', '存储', '导出'],
      data: [
        { x: '渲染', y: '模板', value: 85 },
        { x: '渲染', y: 'AI', value: 62 },
        { x: '模板', y: '存储', value: 45 },
        { x: 'AI', y: '导出', value: 73 },
        { x: '存储', y: '导出', value: 58 }
      ]
    };
  }
  if (layoutId === 'theme03_chart_treemap') {
    return {
      tag: '占比分布',
      tagLabel: '11',
      topRightMeta: '业务板块 · 单位：百万',
      title: '{{板块占比}}：各业务线收入构成',
      subtitle: '按年度收入贡献划分的业务板块构成。',
      data: [
        { name: 'SaaS 订阅', value: 420 },
        { name: '企业服务', value: 280 },
        { name: '广告收入', value: 150 },
        { name: '增值服务', value: 90 }
      ],
      unit: 'USD M'
    };
  }
  if (layoutId === 'theme03_chart_wordcloud') {
    return {
      tag: '关键词',
      tagLabel: '12',
      topRightMeta: '搜索热词 · 单位：频次',
      title: '{{热词云}}：开发者最关注的技术话题',
      subtitle: '基于过去 30 天技术社区搜索与讨论热度。',
      words: [
        { name: 'AI 编程', value: '100' },
        { name: 'React', value: '85' },
        { name: 'TypeScript', value: '78' },
        { name: 'Node.js', value: '65' },
        { name: 'PPTX', value: '52' },
        { name: 'ECharts', value: '48' }
      ],
      unit: '次'
    };
  }
  if (layoutId === 'theme03_chart_bar3d') {
    return {
      tag: '立体对比',
      tagLabel: '13',
      topRightMeta: '季度营收 · 单位：百万美元',
      title: '{{3D 对比}}：各季度收入立体呈现',
      subtitle: '使用伪 3D 效果展示各季度收入对比。',
      bars: [
        { label: 'Q1', value: '120' },
        { label: 'Q2', value: '185' },
        { label: 'Q3', value: '290' },
        { label: 'Q4', value: '420' }
      ],
      unit: 'USD M'
    };
  }
  if (layoutId === 'theme03_chart_graph') {
    return {
      tag: '关系网络',
      tagLabel: '14',
      topRightMeta: '系统架构 · 节点关联',
      title: '{{关系图}}：核心模块调用关系',
      subtitle: '展示平台核心模块之间的依赖关系。',
      nodes: [
        { name: '平台', value: 80, category: 0 },
        { name: '用户端', value: 50, category: 1 },
        { name: '管理端', value: 45, category: 1 },
        { name: '数据中台', value: 60, category: 2 },
        { name: 'AI 引擎', value: 70, category: 2 }
      ],
      links: [
        { source: '平台', target: '用户端', value: 5 },
        { source: '平台', target: '管理端', value: 5 },
        { source: '平台', target: '数据中台', value: 8 },
        { source: '数据中台', target: 'AI 引擎', value: 6 }
      ],
      categories: [
        { name: '核心' },
        { name: '产品' },
        { name: '技术' }
      ],
      showInsight: true,
      insight: {
        value: '4',
        label: '核心模块数',
        description: '平台通过数据中台串联用户端、管理端与 AI 引擎，形成完整能力闭环。'
      }
    };
  }
  if (layoutId === 'theme03_chart_sankey') {
    return {
      tag: '流量路径',
      tagLabel: '15',
      topRightMeta: '用户旅程 · 单位：人',
      title: '{{桑基图}}：用户从访问到成交的流转',
      subtitle: '展示用户在关键步骤之间的流转规模。',
      data: [
        { source: '访问', target: '浏览', value: 10000 },
        { source: '浏览', target: '加购', value: 4500 },
        { source: '加购', target: '结算', value: 2200 },
        { source: '结算', target: '支付', value: 1800 },
        { source: '支付', target: '成交', value: 1600 }
      ],
      showInsight: true,
      insight: {
        value: '16%',
        label: '整体成交转化率',
        description: '从访问到成交的链路较长，支付到成交环节接近无流失，注册到支付仍有提升空间。'
      }
    };
  }
  if (layoutId === 'theme03_chart_sunburst') {
    return {
      tag: '层级占比',
      tagLabel: '16',
      topRightMeta: '组织架构 · 单位：人',
      title: '{{旭日图}}：团队层级与人员分布',
      subtitle: '按事业部与职能划分的团队人员分布。',
      data: [
        { name: '研发', value: 120, children: [{ name: '前端', value: 45 }, { name: '后端', value: 55 }, { name: 'AI', value: 20 }] },
        { name: '产品', value: 40, children: [{ name: '产品', value: 25 }, { name: '设计', value: 15 }] },
        { name: '运营', value: 30, children: [{ name: '市场', value: 18 }, { name: '销售', value: 12 }] }
      ],
      unit: '人',
      showInsight: true,
      insight: {
        value: '190',
        label: '团队总人数',
        description: '研发人员占比超过 60%，产品设计与运营团队规模相对精简，符合技术驱动型组织特征。'
      }
    };
  }
  if (layoutId === 'theme03_process_v1') {
    return {
      tag: '实施路径',
      tagLabel: '07',
      topRightMeta: 'AI 助手落地 · 四步闭环',
      title: '四步让 {{AI 助手}} 融入工作流',
      subtitle: '从试点到规模化落地，企业引入 AI 编码助手的关键路径。',
      steps: [
        { title: '试点选型', description: '在 1-2 个典型团队试用 2-3 款工具，评估补全率、接受率与开发者满意度。' },
        { title: '规则建立', description: '制定 AI 生成代码的审查规范、安全红线与知识产权声明流程。' },
        { title: '培训推广', description: '围绕提示工程、上下文管理与审查技巧开展内部培训，降低使用门槛。' },
        { title: '度量优化', description: '持续追踪任务完成速度、缺陷率与开发者 NPS，迭代工具配置与使用规范。' }
      ]
    };
  }
  if (layoutId === 'theme03_timeline_v1') {
    return {
      tag: '发展脉络',
      tagLabel: '08',
      topRightMeta: 'AI 编码助手演进 · 2019-2024',
      title: '{{六年}}：AI 助手从玩具到基础设施',
      subtitle: '从 GPT-2 时代的代码补全实验，到 2024 年企业级 AI 编码助手成为工程团队标配。',
      milestones: [
        { date: '2019', title: '代码补全实验', description: 'IDE 插件开始尝试基于统计语言的简单补全，接受率不足 15%。' },
        { date: '2021', title: '大模型涌现', description: 'GPT-3/Codex 展示跨语言生成能力，GitHub Copilot 进入技术预览。' },
        { date: '2022', title: '商业化起步', description: 'Copilot 正式发售，开发者付费意愿初显，企业开始试点。' },
        { date: '2023', title: '编辑器重构', description: 'Cursor、Codeium 等 AI-first 编辑器崛起，上下文感知成为新战场。' },
        { date: '2024', title: '企业标配', description: '超过 90% 的科技公司将 AI 编码助手纳入标准工具栈，治理框架成熟。' }
      ]
    };
  }
  if (layoutId === 'theme03_roadmap_v1') {
    return {
      tag: '产品路线',
      tagLabel: '09',
      topRightMeta: 'ROADMAP // 2025-2026',
      title: '{{未来 12 个月}}：从工具到平台',
      subtitle: 'AI 编码助手下一阶段的关键能力与商业化节奏。',
      phases: [
        {
          phase: 'Q1 基础能力',
          items: [
            { value: '多模型上下文感知补全' },
            { value: '企业级代码安全审查' },
            { value: '团队使用度量仪表盘' }
          ]
        },
        {
          phase: 'Q2 智能升级',
          items: [
            { value: 'Agent 式跨文件重构' },
            { value: '自然语言生成测试用例' },
            { value: 'CI/CD 缺陷预测联动' }
          ]
        },
        {
          phase: 'Q3 企业场景',
          items: [
            { value: '私有化部署与合规审计' },
            { value: '知识库与内部 SDK 对接' },
            { value: '权限治理与成本分摊' }
          ]
        },
        {
          phase: 'Q4 生态开放',
          items: [
            { value: '插件市场与 API 生态' },
            { value: '开发者社区与模板共享' },
            { value: '跨 IDE 统一体验' }
          ]
        }
      ]
    };
  }
  if (layoutId === 'theme03_quote_v1') {
    return {
      tag: '结论',
      tagLabel: 'QUOTE',
      topRightMeta: '2024 · USA · AI VENTURE',
      quote: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。',
      author: 'Sam Altman',
      title: 'CEO, OpenAI',
      source: 'AI Ascent 2024'
    };
  }
  if (layoutId === 'theme03_case_v1') {
    return {
      tag: '典型案例',
      tagLabel: 'CASE',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '{{Anthropic}}：从追赶到反超',
      subtitle: 'Claude 系列如何在大模型红海中撕开差异化缺口。',
      description: 'Anthropic 成立于 2021 年，由 OpenAI 前核心成员创立。凭借 Constitutional AI 与长上下文窗口，Claude 在企业级市场快速渗透。',
      milestones: [
        { date: '2021.05', title: '公司成立', description: 'Dario 与 Daniela Amodei 创立 Anthropic' },
        { date: '2023.03', title: 'Claude 发布', description: '首发即支持 100K token 上下文' },
        { date: '2024.06', title: '40 亿美元融资', description: '亚马逊、Google 等战略投资人加注' }
      ],
      footnote: 'Anthropic 2024 年收入预计突破 8.5 亿美元，企业客户占比持续提升。'
    };
  }
  if (layoutId === 'theme03_swot_v1') {
    return {
      tag: '战略分析',
      tagLabel: '10',
      topRightMeta: 'STRATEGY // SWOT',
      title: '{{SWOT}}：看清内外部环境',
      subtitle: '以 AI 编码助手市场为例，分析领先工具所处的竞争位置。',
      strength: '开发者接受度高，周活跃使用率超过 60%；头部工具已建立生态与品牌心智；企业付费意愿在 2024 年显著增强。',
      weakness: '代码安全与知识产权风险仍存争议；部分企业审查流程尚未适配 AI 生成代码；长尾语言与垂直场景覆盖不足。',
      opportunity: '企业级市场渗透率仅 34%，存在翻倍空间；多模态与 Agent 能力可扩展至代码审查、测试生成等高频场景。',
      threat: '大厂免费工具加剧价格战；开源模型降低进入门槛；监管与合规要求可能提高市场准入成本。'
    };
  }
  if (layoutId === 'theme03_closing_v1') {
    return {
      tag: '数据来源',
      tagLabel: 'COLOPHON',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '感谢阅读',
      subtitle: '本报告基于公开数据整理，不构成投资建议。',
      leftColumnTitle: '数据来源',
      leftColumnItems: ['PitchBook 风险投资数据库', 'Crunchbase 公开融资记录', '各公司官方新闻稿与 SEC 文件'],
      rightColumnTitle: '研究提示',
      rightColumnItems: ['口径为单笔 ≥1 亿美元公开融资', '汇率按披露时点折算', '部分估值为非公开市场估算'],
      contact: '反馈请联系：research@lemonppt.example'
    };
  }
  if (layoutId === 'theme03_table_of_contents_v1') {
    return {
      tag: '目录',
      tagLabel: 'CONTENTS',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '{{报告}}目录',
      subtitle: '本报告共 10 个章节，覆盖市场全景、赛道分布、典型案例与战略判断。',
      items: [
        { title: '市场全景：资本为何押注 AI', page: '03' },
        { title: '全年融资总额与趋势', page: '05' },
        { title: '赛道分布与场景洞察', page: '07' },
        { title: '典型案例：Anthropic 突围', page: '09' },
        { title: '战略判断与未来 12 个月', page: '11' }
      ],
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_metrics_v1') {
    return {
      tag: '关键指标',
      tagLabel: 'METRICS',
      topRightMeta: '2024 · USA · AI VENTURE',
      title: '{{全年}}核心数据一览',
      subtitle: '从融资总额、事件数量到头部集中度，快速把握 2024 年美国 AI 融资全貌。',
      stats: [
        { value: '970', unit: '亿美元', label: '全年 AI 风险投资额', change: '+23%' },
        { value: '97', unit: '笔', label: '单笔 ≥1 亿美元事件', change: '历史新高' },
        { value: '10', unit: '亿美元', label: '平均单笔融资额', change: '+18%' },
        { value: '58%', unit: '', label: 'TOP 10 项目金额占比', change: '头部集中' }
      ],
      footnoteLeft: '来源 · PitchBook / Crunchbase',
      footnoteRight: '口径 · ≥1 亿美元公开融资'
    };
  }
  if (layoutId === 'theme03_feature_v1') {
    return {
      tag: '核心能力',
      tagLabel: 'FEATURES',
      topRightMeta: 'AI 编码助手价值主张',
      title: '为什么团队选择 {{AI 编码助手}}',
      subtitle: '从代码生成到知识管理，AI 编码助手正在重塑开发者的工作方式。',
      features: [
        { number: '01', title: '上下文感知补全', description: '基于项目代码库与当前编辑位置，提供跨文件、跨函数的精准补全建议。' },
        { number: '02', title: '自然语言生成代码', description: '用一句话描述需求即可生成可运行代码块，并自动适配项目风格。' },
        { number: '03', title: '智能审查与重构', description: '自动识别潜在缺陷、安全漏洞与性能瓶颈，一键完成重构。' }
      ],
      footnoteLeft: '基于 1,200 名开发者调研',
      footnoteRight: '单位 · 周活跃使用率'
    };
  }
  if (layoutId === 'theme03_image_v1') {
    return {
      tag: '架构概览',
      tagLabel: 'ARCHITECTURE',
      topRightMeta: 'SYSTEM OVERVIEW',
      title: '{{lemonPPT}} 技术架构',
      subtitle: '从目标输入到版式渲染，AI 驱动的端到端演示生成流水线。',
      caption: '图：lemonPPT 核心系统架构与数据流',
      footnoteLeft: 'lemonPPT 技术白皮书',
      footnoteRight: 'v2.0'
    };
  }
  if (layoutId === 'theme03_team_v1') {
    return {
      tag: '团队',
      tagLabel: 'TEAM',
      topRightMeta: 'FOUNDING TEAM',
      title: '{{核心}}团队',
      subtitle: '一群相信 AI 能让演示更高效的工程师与设计师。',
      members: [
        { name: '张明', role: '创始人 / CEO', bio: '前字节跳动产品经理，连续创业者。' },
        { name: '李华', role: '联合创始人 / CTO', bio: '全栈工程师，开源社区活跃贡献者。' },
        { name: '王芳', role: '设计负责人', bio: '曾负责多个 B 端产品视觉体系。' },
        { name: '赵强', role: '算法负责人', bio: '专注于大模型应用与多模态生成。' }
      ],
      footnoteLeft: '联系我们 · hello@lemonppt.example',
      footnoteRight: '诚招英才'
    };
  }
  if (layoutId === 'theme03_partners_v1') {
    return {
      tag: '合作伙伴',
      tagLabel: 'PARTNERS',
      topRightMeta: 'TRUSTED BY',
      title: '他们都在{{使用}}',
      subtitle: '超过 200 家企业与机构选择 lemonPPT 作为演示生产力工具。',
      partners: [
        { name: 'CloudNative' },
        { name: 'DataMind' },
        { name: 'OpenFoundry' },
        { name: 'NeuralWorks' },
        { name: 'FinStack' },
        { name: 'DevGrid' },
        { name: 'AITools' },
        { name: 'SaaSBox' }
      ],
      footnoteLeft: '持续更新中',
      footnoteRight: '2026.07'
    };
  }
  if (layoutId === 'theme03_pricing_v1') {
    return {
      tag: '定价方案',
      tagLabel: 'PRICING',
      topRightMeta: 'PLANS & PACKAGES',
      title: '选择适合你的{{方案}}',
      subtitle: '从个人创作者到企业团队，lemonPPT 提供灵活的订阅选项。',
      tiers: [
        { name: '免费版', price: '¥0', period: '/月', features: ['每月 10 次 AI 生成', '3 套精选主题', 'PDF 导出'], cta: '开始使用' },
        { name: '专业版', price: '¥99', period: '/月', features: ['无限 AI 生成', '全部主题与版式', 'PPTX / PDF / HTML 导出', '优先客服支持'], cta: '立即升级', highlight: true },
        { name: '企业版', price: '¥299', period: '/月', features: ['私有化部署选项', '自定义品牌主题', 'SSO 与成员管理', '专属客户成功经理'], cta: '联系销售' }
      ],
      footnoteLeft: '所有方案均支持 14 天免费试用',
      footnoteRight: '年付可享 8 折优惠'
    };
  }
  if (layoutId === 'theme03_comparison_v1') {
    return {
      tag: '对比分析',
      tagLabel: 'COMPARE',
      topRightMeta: 'TRADITIONAL VS AI',
      title: '{{传统方案}} vs {{AI 方案}}',
      subtitle: '从构思到交付，AI 驱动的演示工具如何改变工作流。',
      leftTitle: '传统工具',
      rightTitle: 'lemonPPT',
      leftItems: ['手动梳理大纲与文案', '逐页调整排版与配色', '多人协作版本混乱', '导出格式受限'],
      rightItems: ['一句话生成完整大纲', 'AI 自动匹配版式与主题', '实时协作与版本管理', '一键导出 PPTX / PDF / HTML'],
      footnoteLeft: '基于典型用户工作流对比',
      footnoteRight: '单位 · 单次演示制作'
    };
  }
  if (layoutId === 'theme03_faq_v1') {
    return {
      tag: '常见问题',
      tagLabel: 'FAQ',
      topRightMeta: 'Q&A',
      title: '你还想{{了解}}什么',
      subtitle: '关于 lemonPPT 的使用、定价与开源协议的常见疑问。',
      items: [
        { q: '支持哪些导出格式？', a: '目前支持 PPTX、PDF 与可编辑 HTML，后续将增加 Keynote 与 Google Slides 兼容导出。' },
        { q: '是否支持自定义主题？', a: '专业版与企业版支持自定义品牌色、字体与版式规则，并可保存为团队共享主题。' },
        { q: '开源协议是什么？', a: 'lemonPPT 核心代码采用 AGPL-3.0 协议，外部贡献需签署 CLA。' },
        { q: '如何保证数据安全？', a: '企业版支持私有化部署，所有生成过程可在自有基础设施内完成。' }
      ],
      footnoteLeft: '更多问题请访问帮助中心',
      footnoteRight: 'hello@lemonppt.example'
    };
  }
  if (layoutId === 'theme03_gallery_v1') {
    return {
      tag: '图集',
      tagLabel: 'GALLERY',
      topRightMeta: 'PRODUCT SHOTS',
      title: '{{产品}}界面一览',
      subtitle: '从大纲编辑到版式渲染，lemonPPT 覆盖演示制作全流程。',
      images: [
        { url: '', caption: '大纲编辑器' },
        { url: '', caption: '版式选择器' },
        { url: '', caption: '导出面板' },
        { url: '', caption: '协作预览' }
      ],
      footnoteLeft: '截图 · lemonPPT v2.0',
      footnoteRight: '仅供示意'
    };
  }
  if (layoutId === 'theme03_number_showcase_v1') {
    return {
      tag: '核心指标',
      tagLabel: 'FIGURE',
      topRightMeta: '2024 · USA · AI VENTURE',
      title: '全年{{AI}}风险投资额',
      subtitle: '2024 年美国 AI 领域大额融资再创历史新高。',
      value: '970',
      unit: '亿美元',
      description: '占全美风险投资近三分之一，头部效应显著。',
      footnoteLeft: '来源 · PitchBook',
      footnoteRight: '口径 · ≥1 亿美元公开融资'
    };
  }
  if (layoutId === 'theme03_bento_v1') {
    return {
      tag: '数据看板',
      tagLabel: 'BENTO',
      topRightMeta: 'GROWTH ENGINE',
      title: '{{增长}}引擎一览',
      subtitle: '六项核心指标共同驱动 lemonPPT 产品增长。',
      items: [
        { label: '注册用户', value: '120K', unit: '+', size: 'large' },
        { label: '月活跃用户', value: '45K', unit: '+', size: 'medium' },
        { label: '付费转化率', value: '8.5', unit: '%', size: 'small' },
        { label: '客户续费率', value: '92', unit: '%', size: 'small' },
        { label: '模板使用量', value: '2.4M', unit: '+', size: 'medium' },
        { label: 'NPS 评分', value: '72', unit: '', size: 'small' }
      ],
      footnoteLeft: '数据截至 2026.07',
      footnoteRight: '来源 · 内部统计'
    };
  }
  if (layoutId === 'theme03_quadrant_v1') {
    return {
      tag: '战略分析',
      tagLabel: 'QUADRANT',
      topRightMeta: 'VALUE VS FEASIBILITY',
      title: '{{优先级}}象限：价值 vs 可行性',
      subtitle: '基于市场价值与实施可行性，对关键举措进行优先级排序。',
      xAxis: '可行性 →',
      yAxis: '↑ 价值',
      quadrants: [
        { label: '立即投入', items: ['企业级 SSO', '私有化部署', '实时协作'] },
        { label: '重点规划', items: ['AI 智能排版', '多语言生成', '插件市场'] },
        { label: '快速验证', items: ['社区模板', '导出优化', '快捷键支持'] },
        { label: '观察储备', items: ['3D 演示', '语音输入', 'VR 预览'] }
      ],
      footnoteLeft: '基于产品路线图整理',
      footnoteRight: '2026.07'
    };
  }
  if (layoutId === 'theme03_table_v1') {
    return {
      tag: '数据表',
      tagLabel: 'TABLE',
      topRightMeta: '赛道融资对比 · 单位：亿美元',
      title: '{{赛道}}融资对比',
      subtitle: '2024 年美国 AI 主要赛道融资金额与事件数对比。',
      headers: ['赛道', '融资金额', '事件数', '平均单笔'],
      rows: [
        ['大模型', '520', '18', '28.9'],
        ['基础设施', '310', '32', '9.7'],
        ['应用层', '140', '47', '3.0']
      ],
      highlightFirstColumn: true,
      footnoteLeft: '来源 · PitchBook / Crunchbase',
      footnoteRight: '口径 · ≥1 亿美元公开融资'
    };
  }
  if (layoutId === 'theme03_testimonial_v1') {
    return {
      tag: '客户证言',
      tagLabel: 'VOICE',
      topRightMeta: '2024 · USA · AI VENTURE',
      quote: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。',
      author: 'Sam Altman',
      role: 'CEO',
      company: 'OpenAI',
      footnoteLeft: 'AI Ascent 2024',
      footnoteRight: '公开演讲摘录'
    };
  }
  if (layoutId === 'theme03_tags_v1') {
    return {
      tag: '关键词',
      tagLabel: 'TAGS',
      topRightMeta: 'DEVELOPER SURVEY',
      title: '{{开发者}}关注什么',
      subtitle: '基于 1,200 名开发者调研的高频关注词。',
      tags: [
        { label: 'AI 生成', value: 342, tone: 'accent' },
        { label: '版式自动匹配', value: 287, tone: 'positive' },
        { label: '一键导出 PPTX', value: 256, tone: 'positive' },
        { label: '团队协作', value: 198 },
        { label: '品牌定制', value: 165 },
        { label: '数据安全', value: 154 },
        { label: '多语言', value: 132 },
        { label: 'API 集成', value: 121 },
        { label: '私有化部署', value: 98 },
        { label: '插件生态', value: 87 },
        { label: '实时预览', value: 76 },
        { label: '版本管理', value: 65 }
      ],
      footnoteLeft: '样本 · 1,200 名开发者',
      footnoteRight: '单位 · 提及次数'
    };
  }
  if (layoutId === 'theme03_progress_v1') {
    return {
      tag: '达成度',
      tagLabel: 'PROGRESS',
      topRightMeta: 'Q3 OKR',
      title: '{{Q3}} OKR 进度',
      subtitle: '截至 7 月底，关键目标完成情况一览。',
      items: [
        { label: '付费用户增长', value: 8500, max: 10000, unit: '人' },
        { label: '企业客户签约', value: 42, max: 60, unit: '家' },
        { label: '模板覆盖率', value: 46, max: 57, unit: '个' },
        { label: 'PPTX 导出成功率', value: 98.5, max: 99.9, unit: '%' },
        { label: '编辑器性能优化', value: 7, max: 10, unit: '项' }
      ],
      footnoteLeft: '数据截至 2026.07.28',
      footnoteRight: '来源 · 内部 OKR 系统'
    };
  }
  if (layoutId === 'theme03_metric_v1') {
    return {
      tag: '核心指标',
      tagLabel: 'FIGURE',
      topRightMeta: '2026 全年',
      title: '全年{{AI}}风险投资额',
      value: '970',
      unit: '亿美元',
      description: '创历史新高，占全美风险投资近三分之一。资金向头部大模型与基础设施高度集中。',
      footnoteLeft: '数据来源 · lemonPPT 内部统计',
      footnoteRight: '2026.07'
    };
  }
  if (layoutId === 'theme03_metric_v2') {
    return {
      tag: '数据墙',
      tagLabel: 'METRICS',
      topRightMeta: '核心指标一览',
      title: '{{核心}}指标一览',
      subtitle: '用深色编辑风卡片呈现关键业务数据',
      metrics: [
        { value: '970', unit: '亿美元', label: '全年融资额', change: '+24%' },
        { value: '97', unit: '笔', label: '大额融资事件', change: 'TOP 10%' },
        { value: '≈10', unit: '亿美元', label: '平均单笔', change: '持平' },
        { value: '+41%', unit: '', label: 'Q4 环比增长', change: '新高' },
        { value: 'Q2-Q3', unit: '', label: '高峰区间', change: '旺季' }
      ],
      footnoteLeft: '样本 · 2026 全年',
      footnoteRight: '来源 · 内部统计'
    };
  }
  if (layoutId === 'theme03_metric_v3') {
    return {
      tag: '核心指标',
      tagLabel: 'FIGURE',
      topRightMeta: '2026 全年',
      title: '全年{{AI}}风险投资额',
      value: '970',
      unit: '亿美元',
      icon: '01',
      description: '资金向通用大模型与 AI 基础设施高度集中，头部效应显著。',
      footnoteLeft: '数据来源 · lemonPPT 内部统计',
      footnoteRight: '2026.07'
    };
  }
  if (layoutId === 'theme03_metric_triptych') {
    return {
      tag: '指标总览',
      tagLabel: '03',
      topRightMeta: '核心指标三合一',
      title: '{{核心}}指标三合一',
      subtitle: '三个维度观察 AI 风险投资热度',
      panels: [
        { index: '01', title: '全年融资额', value: '970 亿美元', subtitle: '创历史新高', chartType: 'bar', chartData: [120, 240, 360, 480, 600, 970] },
        { index: '02', title: '大额事件数', value: '97 笔', subtitle: '头部 10 家占 24%', chartType: 'line', chartData: [40, 55, 70, 85, 90, 97] },
        { index: '03', title: 'Q4 环比增长', value: '+41%', subtitle: '全年最高季度增速', chartType: 'area', chartData: [8, 15, 22, 41] }
      ],
      footnoteLeft: '数据来源 · lemonPPT 内部统计',
      footnoteRight: '2026.07'
    };
  }
  if (layoutId === 'theme03_scorecard_v1') {
    return {
      tag: '评分卡',
      tagLabel: 'SCORE',
      topRightMeta: '多维度评估',
      title: '{{多维度}}评分卡',
      subtitle: '从技术、市场、团队、风险四个维度评估项目质量',
      items: [
        { label: '技术壁垒', score: 88, max: 100, note: '自研大模型与渲染引擎，技术护城河较深。' },
        { label: '市场空间', score: 92, max: 100, note: 'AI 演示生成赛道增速快，企业需求旺盛。' },
        { label: '团队能力', score: 85, max: 100, note: '创始团队兼具 AI 研究与产品工程经验。' },
        { label: '商业化', score: 76, max: 100, note: '付费转化与续费率仍有提升空间。' }
      ],
      footnoteLeft: '评估维度 · 4 项',
      footnoteRight: '综合 · 85.25 / 100'
    };
  }
  if (layoutId === 'theme03_appendix_v1') {
    return {
      tag: '附录',
      tagLabel: 'APPENDIX',
      topRightMeta: '数据来源',
      title: '{{附录}} / 数据来源',
      subtitle: '本报告引用数据与参考资料列表',
      sources: [
        { label: 'PitchBook', value: '2026 Q2 Global VC Report' },
        { label: 'Crunchbase', value: 'AI Funding Trends 2026' },
        { label: 'lemonPPT', value: '内部生成与标注数据' },
        { label: '公开财报', value: '各公司季度披露文件' }
      ],
      footnoteLeft: '最后更新 · 2026.07.28',
      footnoteRight: '来源 · 公开数据与内部统计'
    };
  }
  if (layoutId === 'theme03_case_study') {
    return {
      tag: '典型案例',
      tagLabel: 'CASE',
      topRightMeta: '案例研究',
      title: '{{Anthropic}}：从追赶到反超',
      subtitle: '安全优先的 AI 研究公司融资路径',
      intro: 'Anthropic 凭借 Constitutional AI 与 Claude 系列模型，在 2023-2026 年间完成多轮大额融资，成为 OpenAI 最强竞争对手之一。',
      rounds: [
        { date: '2023.05', round: 'C 轮', valuation: '估值 41 亿', amount: '4.5 亿' },
        { date: '2024.02', round: 'D 轮', valuation: '估值 150 亿', amount: '7.5 亿' },
        { date: '2025.11', round: 'E 轮', valuation: '估值 400 亿', amount: '35 亿' },
        { date: '2026.06', round: 'F 轮', valuation: '估值 615 亿', amount: '25 亿' }
      ],
      quote: '安全不是附加功能，而是产品核心。我们希望在能力提升的同时，始终对齐人类价值观。',
      quoteAuthor: 'Dario Amodei',
      footnoteLeft: '数据来源 · 公开融资记录',
      footnoteRight: '案例 · Anthropic'
    };
  }
  if (layoutId === 'theme03_outlook_v1') {
    return {
      tag: '展望',
      tagLabel: 'OUTLOOK',
      topRightMeta: '投资展望',
      title: '{{投资}}展望',
      subtitle: '基于当前市场数据的趋势判断与行动建议',
      items: [
        { title: '头部集中加剧', trend: '资金持续向 Top 10 大模型公司聚集', action: '优先关注已有收入规模的头部项目' },
        { title: '垂直应用崛起', trend: 'AI Agent 与行业解决方案需求爆发', action: '布局具备场景壁垒的垂直应用' },
        { title: '估值回归理性', trend: '二级市场调整传导至一级市场', action: '严格控制估值，关注单位经济模型' }
      ],
      footnoteLeft: '趋势判断 · 3 项',
      footnoteRight: '来源 · 内部研究'
    };
  }
  if (layoutId === 'theme03_region_v1') {
    return {
      tag: '市场',
      tagLabel: 'REGION',
      topRightMeta: '地区分布',
      title: '{{地区}}/市场分布',
      subtitle: 'AI 风险投资在全球主要市场的分布情况',
      regions: [
        { name: '北美', value: '620 亿', change: '+28%', note: '美国占据绝对主导，加拿大增速较快' },
        { name: '中国', value: '180 亿', change: '+15%', note: '大模型与应用层同步发力' },
        { name: '欧洲', value: '95 亿', change: '+22%', note: '伦敦、巴黎、柏林为三大中心' },
        { name: '其他', value: '75 亿', change: '+30%', note: '中东、东南亚与印度增长显著' }
      ],
      footnoteLeft: '数据 · 2026 全年',
      footnoteRight: '来源 · 内部统计'
    };
  }
  if (layoutId === 'theme03_risk_v1') {
    return {
      tag: '风险',
      tagLabel: 'RISK',
      topRightMeta: '风险研判',
      title: '{{风险}}研判',
      subtitle: 'AI 投资面临的潜在风险与应对策略',
      items: [
        { risk: '监管政策不确定性', impact: '高', response: '提前布局合规能力，关注欧盟 AI Act 与中国监管动态' },
        { risk: '估值泡沫与回调', impact: '中高', response: '严格估值纪律，优先收入可见性高的项目' },
        { risk: '技术路线迭代', impact: '中', response: '分散模型、芯片与应用层投资，降低单点风险' },
        { risk: '人才竞争激烈', impact: '中', response: '关注团队稳定性与长期激励机制' }
      ],
      footnoteLeft: '风险项 · 4 项',
      footnoteRight: '来源 · 内部研究'
    };
  }
  if (layoutId === 'theme03_spotlight_grid') {
    return {
      tag: '聚焦',
      tagLabel: 'SPOTLIGHT',
      topRightMeta: '主题聚焦',
      title: '{{主题}}聚焦网格',
      subtitle: '四个关键议题并列展示',
      columns: [
        { tag: '模型', title: '通用大模型', description: '资金占比最高，头部格局逐渐明朗。' },
        { tag: '应用', title: '垂直应用', description: 'Agent 与行业解决方案成为新增长点。' },
        { tag: '基础设施', title: 'AI Infra', description: '算力、数据与工具链需求持续高涨。' },
        { tag: '芯片', title: 'AI 芯片', description: '硬件层面的自主可控受到资本关注。' }
      ],
      footnoteLeft: '分类 · 4 大赛道',
      footnoteRight: '来源 · 内部统计'
    };
  }
  if (layoutId === 'theme03_conclusion_v1') {
    return {
      tag: '结论',
      tagLabel: 'CONCLUSION',
      topRightMeta: 'SUMMARY',
      title: '{{核心}}结论',
      subtitle: '本次分析的四点关键发现',
      points: [
        { item: 'AI 生成能力已成为演示工具的标配，差异化竞争转向垂直场景。' },
        { item: '主题系统与版式组件化是保持视觉一致性的核心基础设施。' },
        { item: '导出格式与编辑器的闭环体验直接影响用户留存与付费转化。' },
        { item: '深色代码风适合技术方案与投研报告，能强化专业感与信息密度。' }
      ],
      footnoteLeft: '结论 · 4 项',
      footnoteRight: '来源 · lemonPPT'
    };
  }
  if (layoutId === 'theme03_diptych_contrast') {
    return {
      tag: '对比分析',
      tagLabel: 'COMPARE',
      topRightMeta: 'VS',
      title: '{{传统方案}} vs {{AI 方案}}',
      subtitle: '从制作流程到最终交付的全面对照',
      left: { label: '传统制作', labelEn: 'TRADITIONAL', imageUrl: '' },
      right: { label: 'AI 生成', labelEn: 'AI-POWERED', imageUrl: '' },
      centerCard: {
        title: '关键差异',
        comparisons: [
          { leftValue: '2-3 天', leftLabel: '制作周期', rightValue: '10 分钟', rightLabel: '生成时间' },
          { leftValue: '依赖设计师', leftLabel: '风格一致性', rightValue: '主题系统保证', rightLabel: '全局统一' },
          { leftValue: '手动修改', leftLabel: '数据更新', rightValue: '联动刷新', rightLabel: '自动同步' }
        ],
        conclusion: 'AI 方案在效率、一致性和可维护性上均显著优于传统制作流程。'
      },
      footnoteLeft: '对比 · 3 个维度',
      footnoteRight: '来源 · 产品调研'
    };
  }
  if (layoutId === 'theme03_filmstrip_v1') {
    return {
      tag: '影像长卷',
      tagLabel: 'FILMSTRIP',
      topRightMeta: 'GALLERY',
      title: '{{产品}}故事长卷',
      subtitle: '用连续画面讲述关键用户旅程',
      images: [
        { url: '', caption: '需求输入' },
        { url: '', caption: 'AI 生成大纲' },
        { url: '', caption: '视觉自动适配' },
        { url: '', caption: '一键导出交付' }
      ],
      footnoteLeft: '步骤 · 4 张',
      footnoteRight: '来源 · 产品流程'
    };
  }
  if (layoutId === 'theme03_gantt_v1') {
    return {
      tag: '项目排期',
      tagLabel: 'GANTT',
      topRightMeta: 'SCHEDULE',
      title: '{{Q3}} 关键里程碑排期',
      subtitle: '核心功能上线与版本节奏',
      phases: ['7 月', '8 月', '9 月'],
      tasks: [
        { name: '主题系统重构', start: 0, end: 40, color: 'var(--lp-accent)' },
        { name: '编辑器性能优化', start: 20, end: 70, color: 'var(--lp-accent-2)' },
        { name: 'PPTX 导出增强', start: 50, end: 90, color: 'var(--lp-accent-cool)' },
        { name: 'QA 与回归测试', start: 75, end: 100, color: 'var(--lp-ink3)' }
      ],
      footnoteLeft: '周期 · Q3',
      footnoteRight: '来源 · 项目管理'
    };
  }
  if (layoutId === 'theme03_pest_v1') {
    return {
      tag: '宏观分析',
      tagLabel: 'PEST',
      topRightMeta: 'MACRO ANALYSIS',
      title: '{{PEST}}：看清外部环境',
      subtitle: '政策、经济、社会、技术四维度洞察',
      political: 'AI 内容生成监管框架逐步完善，合规化成为产品准入门槛。',
      economic: '企业降本增效需求强烈，数字化工具预算占比持续提升。',
      social: '远程协作常态化，对轻量化、可分享演示内容的需求激增。',
      technological: '大模型多模态能力快速进步，文本到幻灯片的生成质量显著提高。',
      footnoteLeft: '维度 · 4 个',
      footnoteRight: '来源 · 行业研究'
    };
  }
  if (layoutId === 'theme03_stats_v1') {
    return {
      tag: '核心指标',
      tagLabel: 'STATS',
      topRightMeta: 'DASHBOARD',
      title: '{{增长}}数据一览',
      subtitle: '过去一个季度的关键业务指标',
      stats: [
        { value: '1.2', unit: '亿元', label: '年度营收', change: '+38%' },
        { value: '320', unit: '%', label: '用户增长', change: 'YoY' },
        { value: '98', unit: '%', label: '客户满意度', change: 'NPS' },
        { value: '86', unit: '人', label: '团队规模', change: '+12' },
        { value: '150', unit: '+', label: '模板数量', change: '新增' },
        { value: '24', unit: 'h', label: '平均交付', change: '缩短' }
      ],
      footnoteLeft: '指标 · 6 项',
      footnoteRight: '来源 · 运营系统'
    };
  }
  if (layoutId === 'theme03_table_data') {
    return {
      tag: '数据表',
      tagLabel: 'TABLE',
      topRightMeta: 'RANKING',
      title: '{{AI 赛道}}融资排行',
      subtitle: '2026 年上半年大额融资事件',
      columns: [
        { key: 'rank', label: '排名', align: 'center' },
        { key: 'company', label: '公司', align: 'left' },
        { key: 'track', label: '赛道', align: 'left' },
        { key: 'amount', label: '融资额', align: 'right' }
      ],
      rows: [
        { rank: '01', company: '云智科技', track: '通用大模型', amount: '66 亿美元' },
        { rank: '02', company: '星辰数据', track: 'AI 基础设施', amount: '25 亿美元' },
        { rank: '03', company: '蓝海传媒', track: '垂直应用', amount: '12 亿美元' },
        { rank: '04', company: '极光设计', track: '设计工具', amount: '8 亿美元' },
        { rank: '05', company: '未来资本', track: '金融科技', amount: '5 亿美元' }
      ],
      highlightRow: 0,
      footnoteLeft: '样本 · 5 家公司',
      footnoteRight: '来源 · 公开数据'
    };
  }
  if (layoutId === 'theme03_chapter_v2') {
    return {
      tag: '章节',
      tagLabel: 'SECTION 02',
      topRightMeta: 'STRUCTURE // CHAPTER',
      number: '02',
      kicker: '市场结构',
      title: '{{市场}}结构与机会',
      subtitle: '从融资分布看 AI 赛道的结构性机会',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_chapter_v3') {
    return {
      tag: '章节',
      tagLabel: 'SECTION 03',
      topRightMeta: 'STRUCTURE // CHAPTER',
      kicker: '案例研究',
      title: '{{案例}}深度解析',
      subtitle: '通过典型项目理解融资逻辑与竞争壁垒',
      imageUrl: '',
      imageAlt: '章节配图',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_closing_v2') {
    return {
      tag: '感谢',
      tagLabel: 'CLOSING',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '结语',
      title: '感谢阅读',
      subtitle: '本报告基于公开数据整理，不构成投资建议。',
      cta: '下载完整报告',
      contact: 'lemonPPT Research',
      email: 'research@lemonppt.example',
      link: 'lemonppt.dev',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_comparison_v2') {
    return {
      tag: '对比分析',
      tagLabel: 'COMPARE',
      topRightMeta: 'SCORECARD // VS',
      kicker: '多维度评估',
      title: '{{传统}} vs {{AI}} 方案评分对比',
      subtitle: '从效率、一致性、可维护性等维度量化对比',
      cards: [
        { label: '制作效率', score: 92, max: 100, note: 'AI 生成将制作周期从数天缩短至分钟级。' },
        { label: '视觉一致性', score: 88, max: 100, note: '主题系统保证全局风格统一。' },
        { label: '协作友好度', score: 85, max: 100, note: '实时协作与版本管理减少沟通成本。' },
        { label: '可扩展性', score: 90, max: 100, note: '组件化版式便于后续复用与扩展。' }
      ],
      footnoteLeft: '评估 · 4 个维度',
      footnoteRight: '来源 · 产品调研'
    };
  }
  if (layoutId === 'theme03_comparison_v3') {
    return {
      tag: '对比分析',
      tagLabel: 'COMPARE',
      topRightMeta: 'TRADITIONAL VS AI',
      kicker: '横向逐项对比',
      title: '{{传统}} vs {{AI}} 横向对比',
      subtitle: '从制作流程到最终交付的全面对照',
      leftTitle: '传统方案',
      rightTitle: 'AI 方案',
      rows: [
        { feature: '制作周期', left: '2-3 天', right: '10 分钟' },
        { feature: '风格一致性', left: '依赖设计师', right: '主题系统保证' },
        { feature: '数据更新', left: '手动修改', right: '联动刷新' },
        { feature: '协作效率', left: '版本混乱', right: '实时协作' },
        { feature: '导出格式', left: '单一', right: 'PPTX / PDF / HTML' }
      ],
      footnoteLeft: '对比 · 5 个维度',
      footnoteRight: '来源 · 产品调研'
    };
  }
  if (layoutId === 'theme03_content_v2') {
    return {
      tag: '要点',
      tagLabel: 'TAKEAWAYS',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '关键发现',
      title: '双栏{{对比}}：关键发现',
      subtitle: '从数据中提取的两组核心结论',
      leftPoints: [
        '资本向头部大模型与基础设施高度集中',
        '全年 AI 风险投资额占全美近三分之一',
        '单笔平均融资额达到 10 亿美元'
      ],
      rightPoints: [
        '应用层融资事件多但单笔金额小',
        '垂直场景出现差异化竞争机会',
        '企业客户付费意愿在 2024 年显著提升'
      ],
      footnoteLeft: '来源 · PitchBook / Crunchbase',
      footnoteRight: '口径 · ≥1 亿美元公开融资'
    };
  }
  if (layoutId === 'theme03_content_v3') {
    return {
      tag: '框架',
      tagLabel: 'FRAMEWORK',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '分析框架',
      title: '三栏{{并行}}分析框架',
      subtitle: '从赛道、项目、结构三个维度理解市场',
      columns: [
        { title: '赛道扫描', text: '覆盖大模型、基础设施、应用层三大赛道，统计金额、事件数与平均单笔。' },
        { title: '项目追踪', text: '筛选单笔 ≥1 亿美元事件，追踪估值变化与投资人结构。' },
        { title: '结构判断', text: '将金额、轮次、估值、投资人交叉，识别泡沫与真实增长区间。' }
      ],
      footnoteLeft: '框架 · 3 个维度',
      footnoteRight: '来源 · 内部研究'
    };
  }
  if (layoutId === 'theme03_content_v4') {
    return {
      tag: '主张',
      tagLabel: 'STATEMENT',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '核心判断',
      title: '{{核心}}主张：叙事进入兑现阶段',
      subtitle: 'AI 产业正从资本叙事转向收入与产品能力的真实兑现。',
      footnoteLeft: '判断 · 1 项',
      footnoteRight: '来源 · 内部研究'
    };
  }
  if (layoutId === 'theme03_cover_v2') {
    return {
      tag: '调研报告',
      tagLabel: '2024',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '年度专题',
      title: '2024 美国大额融资 {{AI}} 公司调研报告',
      subtitle: '聚焦单笔 ≥1 亿美元的大额融资事件，解析资本流向与结构性机会。',
      date: '2026.06',
      image: '',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_cover_v3') {
    return {
      tag: '调研报告',
      tagLabel: '2024',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: '年度专题',
      title: '2024 美国大额融资 {{AI}} 公司调研报告',
      subtitle: '用模块化信息卡片呈现报告核心元数据',
      date: '2026.06',
      presenter: 'lemonPPT Research',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_cover_v4') {
    return {
      tag: 'FEATURED STORY',
      tagLabel: 'ED. 01',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      kicker: 'FEATURED STORY',
      title: '{{AI}} 融资格局重绘',
      subtitle: '2024 年美国大额融资 AI 公司全景扫描',
      date: '2026.06',
      edition: 'ED. 01',
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_feature_v2') {
    return {
      tag: '核心能力',
      tagLabel: 'FEATURES',
      topRightMeta: 'VALUE PROPOSITION',
      kicker: '产品价值',
      title: '为何选择 {{AI 编码助手}}',
      subtitle: '从代码生成到知识管理，AI 编码助手正在重塑开发者工作方式。',
      imageUrl: '',
      imageAlt: '产品界面示意图',
      items: [
        { title: '上下文感知补全', description: '基于项目代码库提供跨文件、跨函数的精准补全建议。' },
        { title: '自然语言生成代码', description: '用一句话描述需求即可生成可运行代码块。' },
        { title: '智能审查与重构', description: '自动识别潜在缺陷与安全漏洞，一键完成重构。' }
      ],
      footer: '基于 1,200 名开发者调研',
      footnoteLeft: '来源 · 开发者调研',
      footnoteRight: '单位 · 周活跃使用率'
    };
  }
  if (layoutId === 'theme03_quote_v2') {
    return {
      tag: '结论',
      tagLabel: 'QUOTE',
      topRightMeta: '2024 · USA · AI VENTURE',
      quote: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。',
      author: 'Sam Altman',
      role: 'CEO',
      source: 'AI Ascent 2024',
      footnoteLeft: 'AI Ascent 2024',
      footnoteRight: '公开演讲摘录'
    };
  }
  if (layoutId === 'theme03_quote_v3') {
    return {
      tag: '金句',
      tagLabel: 'QUOTE',
      topRightMeta: '2024 · USA · AI VENTURE',
      quote: '资本正在从叙事流向{{现金流}}。',
      author: '行业观察者',
      role: 'Venture Analyst',
      footnoteLeft: '观点 · 行业观察',
      footnoteRight: '来源 · 公开评论'
    };
  }
  if (layoutId === 'theme03_table_of_contents_v2') {
    return {
      tag: '目录',
      tagLabel: 'CONTENTS',
      topRightMeta: 'AI · VENTURE CAPITAL // USA',
      title: '{{报告}}目录',
      subtitle: '编号列表式目录，快速定位关键章节',
      items: [
        '市场全景：资本为何押注 AI',
        '全年融资总额与趋势',
        '赛道分布与场景洞察',
        '典型案例：Anthropic 突围',
        '战略判断与未来 12 个月'
      ],
      footnoteLeft: '编制 · 2026.06',
      footnoteRight: '仅供研究参考'
    };
  }
  if (layoutId === 'theme03_team_v2') {
    return {
      tag: '团队',
      tagLabel: 'TEAM',
      topRightMeta: 'FOUNDING TEAM',
      kicker: '核心成员',
      title: '核心{{团队}}',
      subtitle: '一群相信 AI 能让演示更高效的工程师与设计师',
      members: [
        { name: '张明', role: '创始人 / CEO', bio: '前字节跳动产品经理，连续创业者。', imageUrl: '' },
        { name: '李华', role: '联合创始人 / CTO', bio: '全栈工程师，开源社区活跃贡献者。', imageUrl: '' },
        { name: '王芳', role: '设计负责人', bio: '曾负责多个 B 端产品视觉体系。', imageUrl: '' }
      ],
      footnoteLeft: '联系我们 · hello@lemonppt.example',
      footnoteRight: '诚招英才'
    };
  }

  // theme04 MVP 版式示例数据
  if (layoutId === 'theme04_cover_v1') {
    return {
      tag: '年度报告',
      tagLabel: '2024',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '资本，正在{{重新分配}}',
      subtitle: '2024 全球 AI 大额融资 · 全景年鉴',
      metrics: [
        { value: '970', unit: '亿美元', label: '全年总额', tone: 'green' },
        { value: '97', unit: '笔', label: '大额事件', tone: 'blue' },
        { value: '×3', unit: '', label: '估值跃迁', tone: 'pink' }
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT'
    };
  }
  if (layoutId === 'theme04_chapter_v1') {
    return {
      tag: 'CHAPTER',
      number: '01',
      title: '核心发现',
      subtitle: '从数据到洞察的关键转折'
    };
  }
  if (layoutId === 'theme04_content_v1') {
    return {
      kicker: '研究框架',
      title: '{{方法论}}：如何解读资本流向',
      subtitle: '通过数据、案例与趋势三条主线，拆解 AI 产业的资本逻辑。',
      items: [
        { title: '数据筛选', description: '聚焦单笔 ≥1 亿美元的融资事件，排除债权与并购。' },
        { title: '赛道归类', description: '按通用大模型、垂直应用、AI 基础设施、芯片四条主线归类。' },
        { title: '趋势验证', description: '结合季度环比与估值变化，验证资本集中度假设。' }
      ]
    };
  }
  if (layoutId === 'theme04_metric_v1') {
    return {
      kicker: '核心指标',
      title: '年度融资总额',
      subtitle: '全年大额融资事件汇总',
      value: '970',
      unit: '亿美元',
      label: '全年 AI 风险投资额',
      metrics: [
        { value: '97', unit: '笔', label: '事件笔数' },
        { value: '≈10 亿', unit: '', label: '平均单笔' },
        { value: '+41%', unit: '', label: 'Q4 环比' },
        { value: 'Q2-Q3', unit: '', label: '高峰区间' }
      ]
    };
  }
  if (layoutId === 'theme04_chart_v1') {
    return {
      kicker: '数据趋势',
      topRightMeta: '单位：万元',
      title: '{{季度营收}}增长趋势',
      subtitle: '全年四个季度持续上扬',
      type: 'bar',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [1200, 1850, 2400, 3100],
      unit: '万元',
      showInsight: true,
      insight: {
        value: '+38%',
        label: '年度同比增长',
        description: '核心指标连续四个季度保持双位数增长，Q4 受节日营销推动创下新高。'
      }
    };
  }
  if (layoutId === 'theme04_quote_v1') {
    return {
      kicker: '金句',
      quote: 'AI 产业正在从「叙事驱动」进入{{兑现驱动}}的新阶段。',
      author: '李明远',
      role: 'lemonPPT 研究负责人'
    };
  }
  if (layoutId === 'theme04_image_v1') {
    return {
      kicker: '焦点特写',
      title: '{{算力基建}}：资本涌入的新战场',
      subtitle: '从芯片到云服务，基础设施层正在成为 AI 投资的最大吸金点。',
      caption: '数据来源：lemonPPT 内部统计 · 2026'
    };
  }
  if (layoutId === 'theme04_closing_v1') {
    return {
      tag: '结论',
      title: '资本正在{{重新分配}}',
      subtitle: 'AI 产业进入兑现驱动阶段，头部格局已然确立。',
      cta: '下载完整报告',
      contact: 'hello@lemonforme.com'
    };
  }
  if (layoutId === 'theme04_table_of_contents_v1') {
    return {
      title: '目录',
      subtitle: 'CONTENTS',
      items: [
        { title: '市场背景与机会', page: '02' },
        { title: '产品方案与优势', page: '04' },
        { title: '商业模式与增长', page: '06' },
        { title: '团队与融资计划', page: '08' },
      ],
    };
  }
  if (layoutId === 'theme04_feature_v1') {
    return {
      kicker: '产品特性',
      title: '为什么选择 {{柠檬 PPT}}',
      subtitle: '从生成到交付，每个环节都更高效',
      items: [
        { title: 'AI 一键生成', description: '基于大模型自动理解需求，生成完整大纲与页面。', tone: 'green' },
        { title: '主题系统', description: '深色霓虹、浅色玻璃等多种风格，全局一键切换。', tone: 'blue' },
        { title: '数据可视化', description: '内置 SVG 图表与洞察面板，数据表达更聚焦。', tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_bento_v1') {
    return {
      tag: '数据看板',
      tagLabel: 'BENTO',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '{{增长}}引擎一览',
      subtitle: '核心指标模块化呈现，快速定位关键数据',
      items: [
        { label: '年度总额', value: '970', unit: '亿美元', size: 'large', tone: 'green' },
        { label: '大额事件', value: '97', unit: '笔', size: 'medium', tone: 'blue' },
        { label: '平均单笔', value: '≈10', unit: '亿', size: 'medium', tone: 'pink' },
        { label: 'Q4 环比', value: '+41%', unit: '', size: 'small', tone: 'yellow' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_team_v1') {
    return {
      tag: '团队',
      tagLabel: 'TEAM',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '核心{{团队}}',
      subtitle: '来自产品、技术与设计的多元背景',
      members: [
        { name: '李明远', role: '研究负责人', bio: '负责行业洞察与数据解读。' },
        { name: '陈嘉树', role: '产品总监', bio: '主导 lemonPPT 产品体验与增长。' },
        { name: '王雨桐', role: '设计主管', bio: '把控视觉系统与主题设计语言。' },
        { name: '张一凡', role: '技术负责人', bio: '负责渲染引擎与导出管线。' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_chart_donut') {
    return {
      tag: '行业分布',
      tagLabel: '05',
      topRightMeta: 'AI 编码助手使用场景 · 单位：%',
      title: '{{场景分布}}：开发者把 AI 助手用在哪里',
      total: { value: '100%', label: '样本占比' },
      segments: [
        { label: '代码生成', labelEn: 'Code Gen', value: '41' },
        { label: '代码补全', labelEn: 'Completion', value: '26' },
        { label: '测试用例', labelEn: 'Testing', value: '18' },
        { label: '文档注释', labelEn: 'Docs', value: '10' },
        { label: '其他', labelEn: 'Others', value: '5' },
      ],
      showInsight: true,
      insight: {
        value: '41%',
        label: '代码生成场景占比最高',
        description: '代码生成与补全合计占开发者使用场景的 67%，是 AI 编码助手最核心的价值洼地。',
      },
    };
  }
  if (layoutId === 'theme04_metric_big') {
    return {
      tag: '核心数据',
      tagLabel: 'KEY FIGURE',
      topRightMeta: '2024 · AI VENTURE',
      value: '32',
      unit: '%',
      label: '2024 年美国 AI 吸纳的风险投资占比',
      showInsight: true,
      insight: {
        label: '关键洞察',
        value: '全球第一',
        description: '美国继续领跑全球 AI 风险投资，中国、欧洲紧随其后。',
      },
      metrics: [
        { value: '970', unit: '亿美元', label: '全年总额' },
        { value: '97', unit: '笔', label: '大额事件' },
        { value: '+41%', unit: '', label: 'Q4 环比' },
      ],
    };
  }
  if (layoutId === 'theme04_process_v1') {
    return {
      tag: '实施路径',
      tagLabel: '07',
      topRightMeta: 'AI 助手落地 · 四步闭环',
      title: '四步让 {{AI 助手}} 融入工作流',
      subtitle: '从需求识别到规模推广，构建可复用的落地路径',
      steps: [
        { title: '需求识别', description: '梳理高频、高价值的重复性工作场景。' },
        { title: '原型验证', description: '用小范围试点验证模型能力与提效空间。' },
        { title: '工具集成', description: '嵌入现有工作流，降低使用门槛。' },
        { title: '规模推广', description: '沉淀模板与最佳实践，复制到全团队。' },
      ],
    };
  }
  if (layoutId === 'theme04_gallery_v1') {
    return {
      tag: '图集',
      tagLabel: 'GALLERY',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '{{产品}}界面一览',
      subtitle: '从编辑到导出，每个环节都更高效',
      images: [
        { caption: 'AI 生成大纲' },
        { caption: '主题一键切换' },
        { caption: '数据可视化' },
        { caption: 'PPTX 导出' },
      ],
    };
  }
  if (layoutId === 'theme04_stats_v1') {
    return {
      kicker: '核心指标 · STATS',
      title: '全年{{AI}}融资关键数据',
      subtitle: '三个维度快速把握 2024 年美国 AI 大额融资全貌',
      stats: [
        { label: '全年总额 · Total', value: '970', unit: '亿美元', badge: '历史新高' },
        { label: '大额事件 · Deals', value: '97', unit: '笔', badge: '≥1 亿美元' },
        { label: '平均单笔 · Average', value: '≈10', unit: '亿美元', badge: '+18% YoY' },
      ],
      footnote: '数据来源：PitchBook / Crunchbase · 口径：单笔 ≥1 亿美元公开融资',
    };
  }
  if (layoutId === 'theme04_comparison_v1') {
    return {
      kicker: '策略对比 · COMPARISON',
      title: '叙事驱动 vs {{兑现驱动}}',
      subtitle: 'AI 投资逻辑正在从「为愿景下注」转向「看收入说话」',
      sides: [
        {
          label: '叙事驱动',
          title: '2023-2024 H1',
          icon: 'cross',
          items: [
            { title: '估值跑在收入前面', description: '收入尚未验证，估值已先翻倍' },
            { title: '资本为故事埋单', description: '模型能力、创始人背景成为定价核心' },
            { title: '亏损容忍度极高', description: '只要算力规模扩大，亏损被视为必要投入' },
          ],
        },
        {
          label: '兑现驱动',
          title: '2024 H2-2025',
          icon: 'check',
          items: [
            { title: 'ARR 成为核心指标', description: '企业客户付费与续费决定估值上限' },
            { title: '单位经济模型受关注', description: '推理成本、毛利率进入投资人必问清单' },
            { title: '头部集中度提升', description: '能把模型变成收入的公司才留在牌桌上' },
          ],
        },
      ],
    };
  }
  if (layoutId === 'theme04_table_v1') {
    return {
      kicker: '轮次结构 · TABLE',
      title: '2024 美国 AI 大额融资{{轮次分布}}',
      subtitle: '从天使到 F 轮，资金如何向后期轮次集中',
      columns: ['融资轮次', '事件笔数', '平均单笔', '规模对比'],
      rows: [
        { name: '种子/天使', count: '8', avg: '0.3', ratio: 3 },
        { name: 'A/B 轮', count: '18', avg: '1.2', ratio: 12 },
        { name: 'C/D 轮', count: '28', avg: '4.5', ratio: 45 },
        { name: 'E 轮及以后', count: '22', avg: '18.6', ratio: 100 },
        { name: '战略/并购', count: '21', avg: '9.4', ratio: 51 },
      ],
      summary: { label: '合计', count: '97', avg: '≈10' },
    };
  }
  if (layoutId === 'theme04_timeline_v1') {
    return {
      kicker: '阶段策略 · TIMELINE',
      title: '资本节奏{{三段式}}演进',
      subtitle: '从叙事驱动到兑现为王，资本重心逐级上移',
      phases: [
        { period: '2024 H1', title: '叙事驱动', badge: '愿景', description: '估值跑在收入前面，资本愿意为故事埋单。' },
        { period: '2024 H2', title: '算力卡位', badge: '基础设施', description: '资金大举涌入算力与云，谁锁住 GPU 谁掌握主动。' },
        { period: '2025 起', title: '兑现为王', badge: '收入', description: '能把模型变成真实收入的公司，才留在牌桌上。' },
      ],
    };
  }
  if (layoutId === 'theme04_roadmap_v1') {
    return {
      kicker: '资本节奏 · ROADMAP',
      title: '一年三步：从赌叙事，到{{看兑现}}',
      subtitle: '资本叙事的重心逐级上移',
      steps: [
        { period: '2024 H1', title: '叙事驱动', subtitle: '「为愿景下注」', description: '估值跑在收入前面，资本愿意为故事埋单。', tone: 'green' },
        { period: '2024 H2', title: '算力卡位', subtitle: '「卖铲子的赢」', description: '资金大举涌入算力与云，谁锁住 GPU 谁掌握主动。', tone: 'blue' },
        { period: '2025 起', title: '兑现为王', subtitle: '「看 ARR 说话」', description: '能把模型变成真实收入的公司，才留在牌桌上。', tone: 'yellow' },
      ],
      footnote: '资本叙事的重心逐级上移：愿景 → 算力 → 兑现。',
    };
  }
  if (layoutId === 'theme04_ranking_v1') {
    return {
      kicker: '头部玩家 · TOP 10 单笔融资排名',
      title: '三大模型公司{{霸榜前三}}',
      subtitle: '单位：亿美元 · 仅取各公司 2024 年最大单笔融资',
      unit: '亿美元',
      items: [
        { rank: 1, name: 'OpenAI', category: '通用大模型', value: '66', score: 100, tone: 'green' },
        { rank: 2, name: 'Anthropic', category: '通用大模型', value: '65', score: 98, tone: 'green' },
        { rank: 3, name: 'xAI', category: '通用大模型', value: '50', score: 76, tone: 'green' },
        { rank: 4, name: 'CoreWeave', category: 'AI 基础设施', value: '11', score: 17, tone: 'blue' },
        { rank: 5, name: 'Safe Superintelligence', category: '通用大模型', value: '10', score: 15, tone: 'green' },
        { rank: 6, name: 'Scale AI', category: 'AI 基础设施', value: '10', score: 15, tone: 'blue' },
      ],
    };
  }
  if (layoutId === 'theme04_case_v1') {
    return {
      kicker: '典型案例 · CASE STUDY',
      title: 'Anthropic',
      subtitle: '从追赶到反超 · 估值登顶',
      badge: '估值 9650 亿美元 · 全球最高',
      imageUrl: '',
      quote: '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
      author: '— Dario Amodei, CEO',
      milestones: [
        { date: '2024 · 5月', title: 'Series G', subtitle: '融资 280 亿 · 估值 600 亿', description: '', tone: 'green' },
        { date: '2024 · 8月', title: 'Series H 首轮', subtitle: '融资 180 亿 · 估值 830 亿', description: '', tone: 'green' },
        { date: '2024 · 11月', title: 'Series H 扩轮', subtitle: '融资 190 亿 · 估值 9650 亿', description: '', tone: 'green' },
        { date: '2026 · 6月', title: '递交 IPO 申请', subtitle: '估值登顶 · 预计年内上市', description: '', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_quadrant_v1') {
    return {
      kicker: '选题四象限 · 资本热度 × 商业兑现',
      title: '从「谁融得多」升级为{{「谁能兑现」}}',
      subtitle: '用 2×2 矩阵定位 AI 项目的资本位置',
      xAxisLabel: '商业兑现度',
      xAxisLabels: ['低 / 待验证', '高'],
      yAxisLabel: '资本热度',
      yAxisLabels: ['低', '高'],
      quadrants: [
        { title: '明星兑现区', description: '融资热度与收入确定性兼具，「卖铲子」逻辑成立。', tags: ['CoreWeave', 'Databricks', 'Scale AI'], tone: 'green' },
        { title: '叙事泡沫区', description: '巨额融资在手，商业兑现仍受成本与监管约束。', tags: ['OpenAI', 'Anthropic', 'xAI'], tone: 'yellow' },
        { title: '隐形价值区', description: '单笔不一定最大，但落地路径与留存更清晰。', tags: ['Glean', 'Perplexity'], tone: 'blue' },
        { title: '等待验证区', description: '概念成立、规模未证，作为风险与边缘变量观察。', tags: ['长尾工具链', 'AI 安全', '早期硬件'], tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_agenda_v1') {
    return {
      kicker: 'RESEARCH FRAMEWORK / 调研框架',
      title: '2024 美国大额融资 {{AI 公司}}',
      subtitle: '四部分拆解资本流向与结构性机会',
      badge: '调研报告',
      items: [
        { part: '<Part01>', title: '市场全景', description: '全年 970 亿美元 · 融资全景', tone: 'green' },
        { part: '<Part02>', title: '行业透视', description: '赛道 / 轮次 / 头部玩家', tone: 'yellow' },
        { part: '<Part03>', title: '产业链分层', description: '上 · 中 · 下游结构透视', tone: 'blue' },
        { part: '<Part04>', title: '品质涌现', description: '从「赌叙事」到「看兑现」', tone: 'pink' },
      ],
      footnote: '横纵分析法 · 在空间维度与时间维度交叉透视同一组数据',
    };
  }
  if (layoutId === 'theme04_cover_index_v1') {
    return {
      tag: '封面故事',
      tagLabel: 'COVER STORY',
      topRightMeta: 'NO. 04 2024 年刊',
      title: '谁在{{改写}}估值规则',
      subtitle: '头部玩家、资本流向与一年翻倍的独角兽流水线',
      items: [
        { number: '01', title: '算力霸权', description: '芯片 · 数据中心 · 谁卡住咽喉', tone: 'green' },
        { number: '02', title: '模型军备', description: '基础模型三强 · 烧钱与护城河', tone: 'blue' },
        { number: '03', title: '应用突围', description: '从 Demo 到收入 · 谁先跑通', tone: 'yellow' },
        { number: '04', title: '资本退潮', description: '热钱之后 · 谁会被留在沙滩上', tone: 'pink' },
      ],
      footnoteLeft: 'AI CAPITAL 资本观察 · 特别报告',
      footnoteRight: '',
    };
  }
  if (layoutId === 'theme04_chapter_v2') {
    return {
      number: '01',
      kicker: 'PART 01',
      title: '市场{{全景}}',
      subtitle: '全年 970 亿美元 AI 大额融资全景透视',
      description: '从单笔 ≥1 亿美元的融资事件出发，追踪资本在模型层、基础设施层与应用层之间的流动。',
    };
  }
  if (layoutId === 'theme04_image_quote_v1') {
    return {
      kicker: '终审判断 · THE VERDICT',
      quote: '这不是一次普通的风口，而是一场{{资本的总动员}}——钱、算力与共识，同时压向了同一个方向。',
      source: '970 亿美元在一年内涌入，把「AI 是否值得」的争论，直接改写成了「谁能上车」。',
      author: '—《2024 美国大额融资 AI 公司调研报告》· 总结',
      value: '970',
      unit: '亿美元',
      valueLabel: 'FUNDING YEAR · 2024',
      footnote: '',
    };
  }
  if (layoutId === 'theme04_editorial_v1') {
    return {
      tag: '深度特写',
      tagLabel: 'EDITORIAL',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '{{Anthropic}} 估值登顶之路',
      subtitle: '从追赶到反超，它如何在一年内把估值推向 6150 亿美元？',
      quote: '「安全可控」不是一句口号，而是打开机构付费意愿的钥匙。',
      author: '— 研究主编',
      imageUrl: '',
      items: [
        { label: '01', title: 'Constitutional AI', description: '用可解释约束替代黑盒对齐', tone: 'green' },
        { label: '02', title: '企业级渗透', description: '金融与医疗客户付费意愿最高', tone: 'blue' },
        { label: '03', title: '融资节奏', description: '一年内完成三轮大额融资', tone: 'yellow' },
        { label: '04', title: 'IPO 预期', description: '预计 2026 年递交上市申请', tone: 'pink' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: '案例研究',
    };
  }
  if (layoutId === 'theme04_triptych_v1') {
    return {
      tag: '全幅三联',
      tagLabel: 'TRIPTYCH',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '从{{数据}}到{{决策}}的三级跳',
      subtitle: '每一步都对应柠檬 PPT 的核心能力',
      panels: [
        { label: '01', title: 'AI 生成大纲', description: '输入一句话，自动生成完整大纲', tone: 'green' },
        { label: '02', title: '主题一键切换', description: '多主题实时预览，风格秒变', tone: 'blue' },
        { label: '03', title: 'PPTX 导出', description: '可编辑源文件，本地二次创作', tone: 'yellow' },
      ],
      footnoteLeft: 'lemonPPT 产品能力',
      footnoteRight: 'NO. 01',
    };
  }
  if (layoutId === 'theme04_gantt_v1') {
    return {
      kicker: '项目计划 · GANTT',
      title: '{{资本节奏}}全年排期',
      subtitle: '关键事件按季度铺排，便于对齐节奏',
      periods: ['Q1', 'Q2', 'Q3', 'Q4', '2026 H1'],
      lanes: [
        {
          name: '叙事驱动',
          tasks: [
            { name: '早期融资', start: 0, end: 1, tone: 'green' },
            { name: '估值爆发', start: 1, end: 2, tone: 'green' },
          ],
        },
        {
          name: '算力卡位',
          tasks: [
            { name: 'GPU 锁定', start: 1, end: 3, tone: 'blue' },
            { name: '云服务扩量', start: 2, end: 4, tone: 'blue' },
          ],
        },
        {
          name: '兑现为王',
          tasks: [
            { name: 'ARR 验证', start: 3, end: 4, tone: 'yellow' },
            { name: 'IPO 准备', start: 4, end: 5, tone: 'yellow' },
          ],
        },
      ],
      footnote: '横轴单位：季度 · 仅供参考',
    };
  }
  if (layoutId === 'theme04_radar_v1') {
    return {
      kicker: '多维能力 · RADAR',
      title: '三类玩家的{{能力象限}}对比',
      subtitle: '从融资规模、收入、技术、生态与可控性五个维度评估',
      labels: ['融资规模', '收入确定性', '技术领先', '生态广度', '可控安全'],
      datasets: [
        { name: 'OpenAI', data: [95, 70, 98, 92, 65], tone: 'green' },
        { name: 'Anthropic', data: [90, 60, 95, 70, 90], tone: 'pink' },
        { name: 'xAI', data: [85, 40, 88, 60, 55], tone: 'blue' },
      ],
      footnote: '满分 100 · 数据为示意',
    };
  }
  if (layoutId === 'theme04_heatmap_v1') {
    return {
      kicker: '资金热力 · HEATMAP',
      title: '{{季度}} × {{赛道}}资金热力',
      subtitle: '颜色越深代表该季度该赛道的大额融资越集中',
      xLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      yLabels: ['通用模型', '垂直应用', 'AI 基础设施', '芯片硬件'],
      cells: [
        { x: 0, y: 0, value: 85 }, { x: 1, y: 0, value: 62 }, { x: 2, y: 0, value: 90 }, { x: 3, y: 0, value: 78 },
        { x: 0, y: 1, value: 45 }, { x: 1, y: 1, value: 55 }, { x: 2, y: 1, value: 70 }, { x: 3, y: 1, value: 82 },
        { x: 0, y: 2, value: 70 }, { x: 1, y: 2, value: 88 }, { x: 2, y: 2, value: 95 }, { x: 3, y: 2, value: 91 },
        { x: 0, y: 3, value: 30 }, { x: 1, y: 3, value: 42 }, { x: 2, y: 3, value: 58 }, { x: 3, y: 3, value: 65 },
      ],
      colorTone: 'green',
      footnote: '颜色深浅 = 相对资金热度 · 满分 100',
    };
  }
  if (layoutId === 'theme04_cover_ghost_v1') {
    return {
      tag: '年度报告',
      tagLabel: '2024',
      topRightMeta: 'GLASS CANDY · EDITION 02',
      ghostNumber: '01',
      title: 'AI 产业{{新格局}}',
      subtitle: '从叙事驱动到兑现驱动的关键转折',
      metrics: [
        { value: '970', unit: '亿美元', label: '全年总额', tone: 'green' },
        { value: '97', unit: '笔', label: '大额事件', tone: 'blue' },
        { value: '+41%', unit: '', label: 'Q4 环比', tone: 'pink' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_cards_v1') {
    return {
      kicker: '行业赛道',
      title: '{{AI 投资}}的热门赛道',
      subtitle: '资本正在向基础设施与应用层集中',
      cards: [
        { title: '基础模型', description: '大模型研发与算力层，单笔融资规模最大。', value: '420', unit: '亿美元', tag: 'TOP1', tone: 'green' },
        { title: 'AI 基础设施', description: '云服务、数据标注、模型部署工具链。', value: '210', unit: '亿美元', tag: 'TOP2', tone: 'blue' },
        { title: '垂直应用', description: '医疗、金融、法律等行业 AI 应用。', value: '180', unit: '亿美元', tag: 'TOP3', tone: 'pink' },
        { title: '具身智能', description: '机器人、自动驾驶、智能硬件等新兴方向。', value: '85', unit: '亿美元', tag: '新兴', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_gauges_v1') {
    return {
      kicker: '集中度分析',
      title: '资金{{集中}}在头部',
      subtitle: 'TOP3 赛道与 TOP10 公司分别拿走大部分资金',
      gauges: [
        { label: '头部赛道占比', value: 68, unit: '%', tone: 'green' },
        { label: '头部公司集中度', value: 52, unit: '%', tone: 'blue' },
        { label: '晚期轮次占比', value: 74, unit: '%', tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_cover_bento_v1') {
    return {
      tag: '年度报告',
      tagLabel: '2024',
      topRightMeta: 'GLASS CANDY · EDITION 03',
      title: '资本，正在{{重新分配}}',
      subtitle: '2024 全球 AI 大额融资 · 全景年鉴',
      items: [
        { label: '全年总额', value: '970', unit: '亿美元', tone: 'green', size: 'large' },
        { label: '大额事件', value: '97', unit: '笔', tone: 'blue', size: 'medium' },
        { label: '平均单笔', value: '≈10', unit: '亿', tone: 'pink', size: 'medium' },
        { label: 'Q4 环比', value: '+41%', unit: '', tone: 'yellow', size: 'small' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_cover_magazine_v1') {
    return {
      tag: '封面故事',
      tagLabel: 'COVER',
      topRightMeta: 'GLASS CANDY · EDITION 04',
      title: 'AI 融资{{新格局}}',
      subtitle: '从叙事驱动到兑现驱动的关键转折',
      image: '',
      caption: '数据来源：lemonPPT 研究 · 2026',
      metadata: [
        { label: '报告期', value: '2024 全年' },
        { label: '样本量', value: '97 笔大额融资' },
        { label: '覆盖市场', value: '全球' },
        { label: '发布日期', value: '2026.07' },
      ],
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_chapter_split_v1') {
    return {
      number: '02',
      title: '核心发现',
      subtitle: '从数据到洞察的关键转折',
      image: '',
    };
  }
  if (layoutId === 'theme04_chapter_numbered_v1') {
    return {
      tag: 'CHAPTER',
      number: '02',
      title: '核心发现',
      subtitle: '从数据到洞察的关键转折',
    };
  }
  if (layoutId === 'theme04_delta_v1') {
    return {
      kicker: '增长指标',
      title: 'Q4 融资总额{{显著增长}}',
      subtitle: '环比增速创全年新高',
      value: '412',
      unit: '亿美元',
      label: 'Q4 季度总额',
      delta: '+41%',
      deltaLabel: '环比增长',
      tone: 'green',
    };
  }
  if (layoutId === 'theme04_versus_v1') {
    return {
      kicker: '横向对比',
      title: '{{基础设施}} vs 应用层',
      subtitle: '资金在两层之间的分布差异明显',
      left: { value: '420', unit: '亿美元', label: '基础设施层', tone: 'green' },
      right: { value: '180', unit: '亿美元', label: '应用层', tone: 'pink' },
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_trio_v1') {
    return {
      kicker: '头部玩家',
      title: '{{TOP 3}} 赛道领跑者',
      subtitle: '资本、技术与落地能力的三重较量',
      items: [
        { name: 'OpenAI', role: '基础模型', description: 'GPT 系列引领生成式 AI 浪潮，估值与融资规模均居首位。', tone: 'green' },
        { name: 'Anthropic', role: '安全对齐', description: '以 AI 安全为核心差异化，持续获得大额战略投资。', tone: 'blue' },
        { name: 'xAI', role: '新兴力量', description: '依托算力与数据优势快速扩张， late-stage 融资势头强劲。', tone: 'pink' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_polaroid_v1') {
    return {
      kicker: '瞬间',
      title: '{{高光}}时刻',
      subtitle: '那些决定格局的关键画面',
      images: [
        { caption: '产品发布' },
        { caption: '团队合影' },
        { caption: '用户增长' },
        { caption: '里程碑' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_verdict_v1') {
    return {
      tag: '最终结论',
      title: 'AI 产业已进入{{兑现驱动}}阶段',
      subtitle: '头部格局确立，资本正在向执行力倾斜。',
      verdict: 'YES',
      verdictLabel: 'VERDICT',
      cta: '下载完整报告',
      contact: 'hello@lemonforme.com',
    };
  }
  if (layoutId === 'theme04_treemap_v1') {
    return {
      kicker: '资金版图',
      title: '{{AI 融资}}的赛道分布',
      subtitle: '面积代表融资规模，颜色区分主要赛道',
      unit: '亿美元',
      items: [
        { name: '基础模型', value: 420, tone: 'green' },
        { name: 'AI 基础设施', value: 180, tone: 'blue' },
        { name: '应用层', value: 95, tone: 'pink' },
        { name: '机器人', value: 58, tone: 'yellow' },
        { name: '自动驾驶', value: 42, tone: 'green' },
        { name: '其他', value: 35, tone: 'blue' },
      ],
    };
  }
  if (layoutId === 'theme04_scoreboard_v1') {
    return {
      kicker: '头部玩家',
      title: '{{TOP 5}} 玩家多维对照',
      subtitle: '融资规模、估值与增速的综合排名',
      metrics: [
        { key: 'funding', label: '融资总额' },
        { key: 'valuation', label: '最新估值' },
        { key: 'growth', label: '增速' },
        { key: 'round', label: '轮次' },
      ],
      rows: [
        { rank: 1, name: 'OpenAI', values: ['970 亿', '1570 亿', '+41%', 'D+'], tone: 'green' },
        { rank: 2, name: 'Anthropic', values: ['77 亿', '184 亿', '+120%', 'D'], tone: 'blue' },
        { rank: 3, name: 'xAI', values: ['60 亿', '240 亿', '+300%', 'B'], tone: 'pink' },
        { rank: 4, name: 'Databricks', values: ['50 亿', '430 亿', '+25%', 'I'], tone: 'yellow' },
        { rank: 5, name: 'Stability AI', values: ['12 亿', '10 亿', '-15%', 'C'], tone: 'green' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_scorecards_v1') {
    return {
      kicker: '资本计分卡',
      title: '{{四维度}}看清资本风向',
      subtitle: '规模、增速、集中度与轮次结构',
      cards: [
        { title: '全年总额', value: '970', unit: '亿美元', subtitle: '同比 +23%', tone: 'green' },
        { title: '平均单笔', value: '≈10', unit: '亿', subtitle: '大额交易均值', tone: 'blue' },
        { title: '头部集中度', value: '68', unit: '%', subtitle: 'TOP3 赛道占比', tone: 'pink' },
        { title: '晚期轮次', value: '74', unit: '%', subtitle: 'C 轮及以后占比', tone: 'yellow' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_matrix_v1') {
    return {
      kicker: '定位矩阵',
      title: '{{赛道}}吸引力矩阵',
      subtitle: '按市场规模与竞争密度划分的四象限',
      xAxis: { low: '低规模', high: '高规模' },
      yAxis: { low: '低密度', high: '高密度' },
      items: [
        { title: '明星赛道', description: '规模大、竞争密度高，资本持续加注。', tone: 'green' },
        { title: '潜力赛道', description: '规模尚小但增速快，早期机会显著。', tone: 'blue' },
        { title: '成熟赛道', description: '规模大但格局稳定，增量空间有限。', tone: 'yellow' },
        { title: '观望赛道', description: '规模与密度均低，仍需验证。', tone: 'pink' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_layers_v1') {
    return {
      kicker: '技术栈',
      title: '{{AI 应用}}的完整技术分层',
      subtitle: '从基础设施到应用层的四层架构',
      layers: [
        { title: '应用层', items: ['聊天机器人', '编程助手', '搜索增强'], tone: 'green' },
        { title: '编排层', items: ['Agent 框架', 'RAG 管道', '提示工程'], tone: 'blue' },
        { title: '模型层', items: ['大语言模型', '多模态模型', '微调服务'], tone: 'pink' },
        { title: '基础设施层', items: ['算力集群', '向量数据库', '推理加速'], tone: 'yellow' },
      ],
      footnote: '数据来源：lemonPPT 研究 · 2026',
    };
  }
  if (layoutId === 'theme04_groupbars_v1') {
    return {
      kicker: '多维对比',
      title: '{{各赛道}}季度融资对比',
      subtitle: '基础设施、应用层与基础模型三赛道走势',
      unit: '亿美元',
      labels: [{ item: 'Q1' }, { item: 'Q2' }, { item: 'Q3' }, { item: 'Q4' }],
      series: [
        { name: '基础模型', data: [120, 150, 200, 280], tone: 'green' },
        { name: '基础设施', data: [80, 90, 110, 140], tone: 'blue' },
        { name: '应用层', data: [40, 55, 70, 95], tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_scatter_v1') {
    return {
      kicker: '估值分布',
      title: '{{AI 独角兽}}估值与增速分布',
      subtitle: '横轴为估值，纵轴为同比增速，气泡大小代表累计融资额',
      xAxisLabel: '估值（亿美元）',
      yAxisLabel: '同比增速（%）',
      unit: '亿美元',
      items: [
        { name: 'OpenAI', x: 1570, y: 41, value: 970, tone: 'green' },
        { name: 'Anthropic', x: 184, y: 120, value: 77, tone: 'blue' },
        { name: 'xAI', x: 240, y: 300, value: 60, tone: 'pink' },
        { name: 'Databricks', x: 430, y: 25, value: 50, tone: 'yellow' },
        { name: 'CoreWeave', x: 70, y: 180, value: 35, tone: 'green' },
        { name: 'Scale AI', x: 138, y: 60, value: 25, tone: 'blue' },
      ],
    };
  }
  if (layoutId === 'theme04_slope_v1') {
    return {
      kicker: '排名变迁',
      title: '{{头部项目}}排名两年变化',
      subtitle: '斜线向上表示排名上升，向下则表示下滑',
      previousLabel: '2024',
      currentLabel: '2026',
      items: [
        { name: 'OpenAI', previous: 1, current: 1, tone: 'green' },
        { name: 'Anthropic', previous: 4, current: 2, tone: 'blue' },
        { name: 'xAI', previous: 8, current: 3, tone: 'pink' },
        { name: 'Databricks', previous: 2, current: 4, tone: 'yellow' },
        { name: 'CoreWeave', previous: 12, current: 5, tone: 'green' },
        { name: 'Scale AI', previous: 5, current: 6, tone: 'blue' },
      ],
    };
  }
  if (layoutId === 'theme04_waterfall_v1') {
    return {
      kicker: '资金瀑布',
      title: '{{全年融资}}资金流动',
      subtitle: '从年初基数到全年总额，逐季度叠加/流失',
      startLabel: '年初基数',
      startValue: 1200,
      endLabel: '全年总额',
      unit: '亿美元',
      items: [
        { label: 'Q1 新增', value: 180, tone: 'green' },
        { label: 'Q2 新增', value: 220, tone: 'green' },
        { label: 'Q3 退出', value: -80, tone: 'pink' },
        { label: 'Q4 新增', value: 310, tone: 'green' },
      ],
    };
  }
  if (layoutId === 'theme04_region_v1') {
    return {
      kicker: '地区分布',
      title: '{{AI 融资}}的地区分布',
      subtitle: '按融资金额排序的主要地区',
      unit: '亿美元',
      items: [
        { name: '北美', value: 620, tone: 'green' },
        { name: '中国', value: 180, tone: 'blue' },
        { name: '欧洲', value: 95, tone: 'pink' },
        { name: '亚太其他', value: 48, tone: 'yellow' },
        { name: '中东', value: 18, tone: 'green' },
        { name: '拉美', value: 9, tone: 'blue' },
      ],
    };
  }
  if (layoutId === 'theme04_valuechart_v1') {
    return {
      kicker: '估值跃迁',
      title: '{{OpenAI}} 估值三级跳',
      subtitle: '从早期实验室到全球最高估值 AI 公司的跨越',
      name: 'OpenAI',
      stages: [
        { label: '2021', value: '200 亿', description: '由 Microsoft 领投，开启商业化探索', tone: 'green' },
        { label: '2023', value: '860 亿', description: 'ChatGPT 引爆市场，员工回购估值飙升', tone: 'blue' },
        { label: '2024', value: '1570 亿', description: '新一轮融资巩固龙头地位', tone: 'pink' },
      ],
      footnote: '数据来源：公开融资报道整理 · 2026',
    };
  }
  if (layoutId === 'theme04_filmstrip_v1') {
    return {
      kicker: '影像长卷',
      title: '{{产品故事}}胶片长卷',
      subtitle: '用连续画面讲述关键历程',
      images: [
        { image: '', caption: '阶段一' },
        { image: '', caption: '阶段二' },
        { image: '', caption: '阶段三' },
        { image: '', caption: '阶段四' },
        { image: '', caption: '阶段五' },
      ],
    };
  }
  if (layoutId === 'theme04_diptych_v1') {
    return {
      kicker: '叙事 · 对兑现',
      title: '{{钱正在}}重新定价风险',
      subtitle: '当融资规模与收入增速脱钩，市场开始用新的坐标系给 AI 公司估值。',
      statement: '「估值不是过去 12 个月收入的倍数，而是未来 36 个月共识的折现。」',
      items: [
        { label: '共识', description: '头部基金对 AI Infra 的偏好高度一致', tone: 'green' },
        { label: '折现', description: '远期现金流预期取代短期盈利指标', tone: 'blue' },
        { label: '风险', description: '未形成护城河的模型公司承受折价', tone: 'pink' },
        { label: '机会', description: '垂直场景应用获得超额估值溢价', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_voices_v1') {
    return {
      kicker: '投资人说',
      title: '{{市场}}正在形成新共识',
      subtitle: '来自不同视角的判断，指向同一个方向。',
      voices: [
        { quote: '这不是短期泡沫，而是生产力曲线的永久性抬升。', author: 'Sarah Chen', role: 'GP, Horizon Ventures', tone: 'green' },
        { quote: '我们愿意为有数据飞轮的公司支付明显溢价。', author: '李明远', role: '合伙人，光源资本', tone: 'blue' },
        { quote: '通用模型的窗口期正在关闭，垂直场景才刚开始。', author: 'Alex Rao', role: 'MD, Compound', tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_annotated_v1') {
    return {
      kicker: '标注特写',
      title: '{{产品}}关键细节拆解',
      subtitle: '每一处设计都对应一个用户价值假设。',
      annotations: [
        { x: 25, y: 30, label: '01', description: '极简接口降低首次使用门槛', tone: 'green' },
        { x: 72, y: 28, label: '02', description: '实时协作状态减少沟通成本', tone: 'blue' },
        { x: 55, y: 68, label: '03', description: '数据面板直接驱动决策', tone: 'pink' },
        { x: 18, y: 75, label: '04', description: '模块化架构支持快速扩展', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_imagestory_v1') {
    return {
      kicker: '图片故事',
      title: '{{从 0 到 1}}的四个关键帧',
      subtitle: '每个节点都是产品、团队与市场共振的结果。',
      steps: [
        { label: '2024 Q1', caption: 'MVP 验证，首批 100 家企业试用', tone: 'green' },
        { label: '2024 Q3', caption: '产品市场契合，ARR 突破百万', tone: 'blue' },
        { label: '2025 Q1', caption: '规模化获客，团队扩张至 80 人', tone: 'pink' },
        { label: '2025 Q4', caption: '品类领先，启动全球化布局', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_dumbbell_v1') {
    return {
      kicker: '估值跃迁',
      title: '{{AI 独角兽}}估值两年跃迁',
      subtitle: '起点为 2024 年初估值，终点为当前估值，展示估值扩张幅度。',
      startLabel: '2024',
      endLabel: '2026',
      unit: '亿美元',
      items: [
        { name: 'Anthropic', start: 180, end: 615, tone: 'green' },
        { name: 'OpenAI', start: 800, end: 1570, tone: 'blue' },
        { name: 'xAI', start: 120, end: 500, tone: 'pink' },
        { name: 'Perplexity', start: 5, end: 90, tone: 'yellow' },
        { name: 'Cohere', start: 22, end: 55, tone: 'green' },
      ],
    };
  }
  if (layoutId === 'theme04_pyramid_v1') {
    return {
      kicker: '估值金字塔',
      title: '{{从赛道}}到龙头的估值分层',
      subtitle: '越靠近金字塔顶端，估值倍数与确定性同时抬升。',
      unit: '亿美元',
      items: [
        { label: '全市场', value: 970, description: '所有 AI 公司合计', tone: 'green' },
        { label: '头部 10%', value: 420, description: '估值前 10% 公司', tone: 'blue' },
        { label: '独角兽', value: 180, description: '估值 10 亿美元以上', tone: 'pink' },
        { label: '超级独角兽', value: 66, description: '单轮融资最大额', tone: 'yellow' },
      ],
    };
  }
  if (layoutId === 'theme04_riskchain_v1') {
    return {
      kicker: '风险传导',
      title: '{{AI 投资}}的传导性风险',
      subtitle: '从估值泡沫到监管收紧，风险如何在产业链中逐级放大。',
      risks: [
        { label: '估值泡沫', description: '头部项目估值脱离基本面', impact: 'high', tone: 'pink' },
        { label: '算力紧缺', description: 'GPU 供应约束推高训练成本', impact: 'medium', tone: 'blue' },
        { label: '监管收紧', description: '数据合规与内容审核要求升级', impact: 'high', tone: 'pink' },
        { label: '人才流失', description: '核心研发团队被巨头挖角', impact: 'medium', tone: 'yellow' },
        { label: '商业化滞后', description: '产品收入无法覆盖高额投入', impact: 'high', tone: 'pink' },
      ],
    };
  }
  if (layoutId === 'theme04_metro_v1') {
    return {
      kicker: '融资路线',
      title: '{{资本}}流动的地铁图',
      subtitle: '从种子轮到 IPO，每一站都是价值验证的里程碑。',
      lineLabel: 'AI 独角兽专线',
      stops: [
        { label: '种子轮', description: '产品原型与早期用户验证', tone: 'green' },
        { label: 'A 轮', description: '商业模式验证，核心团队成型', tone: 'blue' },
        { label: 'B 轮', description: '规模化获客与收入高速增长', tone: 'pink' },
        { label: 'C 轮', description: '市场领导地位与生态布局', tone: 'yellow' },
        { label: 'IPO', description: '公开市场与全球化扩张', tone: 'green' },
      ],
    };
  }
  if (layoutId === 'theme04_showcase_v1') {
    return {
      kicker: '焦点机位',
      title: '{{这一刻}}，决定下一程',
      subtitle: '用一张核心画面定格产品价值。',
      caption: '图注：产品核心场景实拍，展示 AI 助手在会议中的实时协作能力。',
    };
  }
  if (layoutId === 'theme04_cover_hero_v1') {
    return {
      tag: '年度封面',
      tagLabel: '01',
      topRightMeta: 'GLASS CANDY · EDITION 01',
      title: '{{资本}}重新分配的开局之年',
      subtitle: '2024 全球 AI 大额融资全景年鉴',
      caption: '图片来源：lemonPPT 研究团队',
      footnoteLeft: 'lemonPPT 研究出品',
      footnoteRight: 'github.com/lemonforme/lemonPPT',
    };
  }
  if (layoutId === 'theme04_monthchart_v1') {
    return {
      kicker: '月度趋势',
      topRightMeta: '单位：亿元',
      title: '{{全年融资}}月度走势',
      subtitle: '下半年显著加速，年末达到峰值',
      type: 'bar',
      labels: [
        { item: '1月' }, { item: '2月' }, { item: '3月' }, { item: '4月' },
        { item: '5月' }, { item: '6月' }, { item: '7月' }, { item: '8月' },
        { item: '9月' }, { item: '10月' }, { item: '11月' }, { item: '12月' },
      ],
      data: [
        { item: 42 }, { item: 48 }, { item: 56 }, { item: 61 },
        { item: 58 }, { item: 72 }, { item: 85 }, { item: 91 },
        { item: 88 }, { item: 105 }, { item: 132 }, { item: 148 },
      ],
      unit: '亿元',
      showInsight: true,
      insight: {
        value: '+252%',
        label: '年末较年初增长',
        description: 'Q4 连续三月突破百亿，全年呈现前低后高的爆发态势。',
      },
    };
  }
  if (layoutId === 'theme04_stacked_v1') {
    return {
      kicker: '资本构成',
      topRightMeta: '单位：亿美元',
      title: '{{季度资本}}构成变化',
      subtitle: '基础设施层占比逐季扩大，应用层稳步增长',
      labels: [{ item: 'Q1' }, { item: 'Q2' }, { item: 'Q3' }, { item: 'Q4' }],
      series: [
        { name: '基础模型', data: [120, 150, 200, 280], tone: 'green' },
        { name: '基础设施', data: [80, 110, 160, 220], tone: 'blue' },
        { name: '应用层', data: [40, 60, 85, 120], tone: 'pink' },
      ],
      unit: '亿美元',
      showInsight: true,
      insight: {
        value: '68%',
        label: '基础设施层 Q4 占比',
        description: '算力与云服务等基建投资在年末占比接近七成，成为资本最密集赛道。',
      },
    };
  }
  if (layoutId === 'theme04_calendar_v1') {
    return {
      kicker: '资本月历',
      title: '{{全年大事}}一览',
      subtitle: '标注投融资、政策与行业里程碑的关键月份',
      year: '2024',
      events: [
        { month: 1, label: '算力补贴出台', value: '120亿', tone: 'blue' },
        { month: 3, label: '基础模型井喷', value: '8笔', tone: 'green' },
        { month: 5, label: '云厂商大额融资', value: '65亿', tone: 'blue' },
        { month: 6, label: '应用层爆发', value: '22笔', tone: 'pink' },
        { month: 9, label: '并购窗口打开', value: '4起', tone: 'yellow' },
        { month: 12, label: '年度收官峰值', value: '210亿', tone: 'green' },
      ],
      footnote: '数据来源：lemonPPT 研究整理',
    };
  }
  if (layoutId === 'theme04_quartertable_v1') {
    return {
      kicker: '季度走势 · QUARTERLY TREND',
      title: '{{逐季增长}}，Q4 全面提速',
      subtitle: '事件数、单笔均值与环比变化一览',
      columns: ['季度', '事件数', '单笔均值', '核心指标', '环比变化'],
      rows: [
        { quarter: 'Q1', metric1: '18笔', metric2: '6.2亿', metric3: '112亿', change: '+12%', tone: 'green' },
        { quarter: 'Q2', metric1: '22笔', metric2: '7.8亿', metric3: '172亿', change: '+54%', tone: 'green' },
        { quarter: 'Q3', metric1: '26笔', metric2: '8.5亿', metric3: '221亿', change: '+28%', tone: 'blue' },
        { quarter: 'Q4', metric1: '31笔', metric2: '11.4亿', metric3: '353亿', change: '+60%', tone: 'pink' },
      ],
      summary: { label: '全年合计', value: '858亿美元 · 97笔' },
    };
  }
  if (layoutId === 'theme04_spread_v1') {
    return {
      kicker: '资金消长',
      title: '{{增减对比}}：谁在流入，谁在流出',
      subtitle: '正值为资金流入，负值为资金流出或收缩',
      items: [
        { label: '基础模型', value: 320, tone: 'green' },
        { label: '云算力', value: 280, tone: 'blue' },
        { label: 'AI 应用', value: 150, tone: 'pink' },
        { label: '芯片硬件', value: 120, tone: 'yellow' },
        { label: '传统软件', value: -80, tone: 'pink' },
        { label: '消费互联网', value: -120, tone: 'blue' },
      ],
      unit: '亿美元',
      footnote: '数据来源：lemonPPT 研究整理',
    };
  }
  if (layoutId === 'theme04_chaintable_v1') {
    return {
      kicker: '产业链 · VALUE CHAIN',
      title: 'AI 产业链{{分层}}结构',
      subtitle: '从底层算力到上层应用，资本逐层向上传导',
      tiers: [
        { layer: '底层算力', items: [{ value: 'GPU / TPU' }, { value: '云服务' }, { value: '数据中心' }], value: '45%', tone: 'blue' },
        { layer: '基础模型', items: [{ value: '大语言模型' }, { value: '多模态模型' }, { value: '开源模型' }], value: '28%', tone: 'green' },
        { layer: '开发工具', items: [{ value: '模型训练平台' }, { value: '推理框架' }, { value: '数据标注' }], value: '15%', tone: 'yellow' },
        { layer: '应用层', items: [{ value: 'AI 助手' }, { value: '行业 SaaS' }, { value: '内容生成' }], value: '12%', tone: 'pink' },
      ],
      footnote: '数据来源：lemonPPT 研究整理',
    };
  }
  if (layoutId === 'theme04_chainflow_v1') {
    return {
      kicker: '产业链流向',
      title: 'AI 价值{{如何流动}}',
      subtitle: '从算力到应用，逐层放大商业价值',
      steps: [
        { label: '算力层', description: '芯片、云服务与数据中心', tone: 'blue' },
        { label: '模型层', description: '基础大模型与垂直模型', tone: 'green' },
        { label: '工具层', description: '训练、推理与部署工具链', tone: 'yellow' },
        { label: '应用层', description: '面向用户的最终产品', tone: 'pink' },
      ],
      footnote: '数据来源：lemonPPT 研究整理',
    };
  }
  if (layoutId === 'theme04_ledger_v1') {
    return {
      kicker: '投资人榜单 · INVESTOR LEDGER',
      title: '{{出手最多}}的投资机构',
      subtitle: '按年度出手次数排序，金额与趋势同步展示',
      investors: [
        { rank: '01', name: 'Global AI Capital', deals: '18笔', amount: '$42亿', trend: 'up', tone: 'green' },
        { rank: '02', name: 'Horizon Ventures', deals: '15笔', amount: '$31亿', trend: 'up', tone: 'blue' },
        { rank: '03', name: 'Neon Fund', deals: '12笔', amount: '$24亿', trend: 'flat', tone: 'yellow' },
        { rank: '04', name: 'Quantum Partners', deals: '10笔', amount: '$19亿', trend: 'down', tone: 'pink' },
        { rank: '05', name: 'Spark AI', deals: '9笔', amount: '$15亿', trend: 'up', tone: 'green' },
      ],
      footnote: '数据来源：lemonPPT 研究整理',
    };
  }

  switch (role) {
    case 'cover':
      return { title: '产品发布会', subtitle: '用 AI 快速生成专业 PPT', date: '2026.07' };
    case 'tableOfContents':
      return { title: '目录', items: ['产品概述', '市场分析', '技术架构', '路线图', '团队介绍'] };
    case 'metric':
      return { label: '月活跃用户', value: '128,000', unit: '人', description: '较去年同期增长 42%' };
    case 'stats':
      return {
        title: '核心数据',
        stats: [
          { label: '用户', value: '120K' },
          { label: '收入', value: '¥3.2M' },
          { label: '满意度', value: '96%' },
        ],
      };
    case 'chart':
      return {
        title: '季度增长',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{ label: '2025', data: [12, 19, 25, 32], color: '#3B82F6' }],
        unit: '万',
      };
    case 'comparison':
      return {
        title: '竞品对比',
        leftTitle: 'lemonPPT',
        rightTitle: '传统工具',
        leftItems: ['AI 生成', '一键导出', '开源可扩展'],
        rightItems: ['手动排版', '多步操作', '闭源受限'],
      };
    case 'pricing':
      return {
        title: '定价方案',
        tiers: [
          { name: '免费版', price: '¥0', period: '/月', features: ['每月 10 次生成', '3 套主题'], cta: '开始使用' },
          { name: '专业版', price: '¥99', period: '/月', features: ['无限生成', '全部主题'], cta: '立即升级' },
          { name: '企业版', price: '¥299', period: '/月', features: ['私有化部署', '专属客服'], cta: '联系销售' },
        ],
      };
    case 'process':
      return {
        title: '工作流程',
        steps: ['输入目标', 'AI 生成大纲', '选择主题', '导出 PPTX'],
      };
    case 'timeline':
      return {
        title: '发展历程',
        milestones: [
          { date: '2026 Q1', title: '立项', description: '确定产品方向' },
          { date: '2026 Q2', title: 'MVP', description: '完成核心功能' },
          { date: '2026 Q3', title: '公测', description: '收集用户反馈' },
        ],
      };
    case 'roadmap':
      return {
        title: '产品路线图',
        quarters: [
          { quarter: 'Q1', title: '基础版式', status: '已完成' },
          { quarter: 'Q2', title: '主题系统', status: '进行中' },
          { quarter: 'Q3', title: '社区贡献', status: '规划中' },
        ],
      };
    case 'quote':
      return { quote: '简单是终极的复杂。', author: '列奥纳多·达·芬奇', role: '艺术家' };
    case 'testimonial':
      return { quote: 'lemonPPT 让我们的汇报效率提升了 3 倍。', author: '张三', role: '产品经理' };
    case 'content':
      return { title: '内容页示例', bullets: ['要点一', '要点二', '要点三'] };
    case 'faq':
      return {
        title: '常见问题',
        items: [
          { question: '支持哪些格式？', answer: 'PPTX、PDF、HTML' },
          { question: '是否开源？', answer: '是，采用 AGPL-3.0 协议' },
        ],
      };
    case 'feature':
      return {
        title: '核心能力',
        features: [
          { title: 'AI 生成', description: '一句话生成完整大纲' },
          { title: '多主题', description: '一键切换视觉风格' },
        ],
      };
    case 'team':
      return {
        title: '团队介绍',
        members: [
          { name: '李四', role: '创始人' },
          { name: '王五', role: '技术负责人' },
        ],
      };
    case 'partners':
      return {
        title: '合作伙伴',
        partners: [
          { name: 'A 公司', logoUrl: '' },
          { name: 'B 公司', logoUrl: '' },
          { name: 'C 公司', logoUrl: '' },
          { name: 'D 公司', logoUrl: '' },
        ],
      };
    case 'image':
      return { title: '图片页示例', subtitle: '说明文字' };
    case 'gallery':
      return {
        title: '图片墙示例',
        images: [
          { url: '', caption: '图一' },
          { url: '', caption: '图二' },
          { url: '', caption: '图三' },
        ],
      };
    case 'swot':
      return {
        title: 'SWOT 分析',
        strength: '技术积累深厚，社区活跃度高。',
        weakness: '品牌知名度相对较低。',
        opportunity: 'AI 市场快速增长。',
        threat: '大厂加速入场。',
      };
    case 'pest':
      return {
        title: 'PEST 分析',
        political: '政策支持开源软件发展。',
        economic: '企业降本增效需求强烈。',
        social: '远程办公与协作常态化。',
        technological: '大模型技术日趋成熟。',
      };
    case 'closing':
      return { title: '感谢观看', subtitle: '让每一次演示都更有力量' };
    default:
      return base;
  }
}

export { sampleProps };
