// 这个行业的分类体系：类别、标签词表、机构与事务所名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（实务、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "ipo", label: "IPO", feedLabel: "IPO 与上市", section: "IPO 与上市", guide: "企业上市的整条流程：IPO 受理与问询、审核问询函与回复、上市委审议、注册与批文、发行承销与定价、上市首日表现、终止撤回与撤单，以及再融资（定增、可转债）的审核。一级市场的融资事件（PE/VC 轮次）属于公司产业经营，不归这一类。" },
  { key: "regulation", label: "监管", feedLabel: "监管与处罚", section: "监管与处罚", guide: "监管机构的动作与后果：证监会及派出机构的行政处罚、市场禁入、立案调查、行政监管措施；交易所的纪律处分、监管问询与公开谴责；退市决定与风险警示；对会计师事务所、券商、律所等中介机构的处罚与执业质量检查；财务造假、审计失败被追责的案件。" },
  { key: "audit", label: "审计", feedLabel: "审计与财务", section: "审计与财务", guide: "审计与财务会计本身：审计准则与执业规范、审计技术与函证/存货监盘等程序、事务所的组织变动与人事、财报编制与会计准则解释、会计政策变更、内控评价、舞弊识别与财报质量分析。公司披露了业绩数字本身属于公司产业经营，对被披露数字的会计处理与审计问题才归这一类。" },
  { key: "market", label: "行情", feedLabel: "市场行情", section: "市场与行情", guide: "二级市场的价格与交易：指数与板块涨跌、资金流向、成交与两融、个股异动、新股与次新股表现、债券与商品价格。宏观数据发布本身归宏观与政策，市场对数据的反应归这一类。个股的基本面经营变化归公司产业。" },
  { key: "industry", label: "产业", feedLabel: "公司与产业", section: "公司与产业", guide: "企业的经营活动与产业格局：上市公司和拟上市公司的业绩预告与财报、并购重组、股权与人事变动、诉讼仲裁、业务扩张与收缩、行业竞争格局，以及一级市场的融资并购。IPO 审核与发行归 IPO，被监管处罚归监管。" },
  { key: "macro", label: "宏观", feedLabel: "宏观与政策", section: "宏观与政策", guide: "经济与政策环境：货币政策与央行操作、财政与产业政策、金融监管制度与法规修订、经济数据（GDP、CPI、PPI、社融、进出口）、汇率与跨境资金、海外宏观（美联储、主要经济体）与地缘政治对市场的影响。" },
  { key: "tip", label: "实务", section: "实务与观点", guide: "从业者可以直接照着用的做法：审计与财务实务技巧、底稿与函证方法、Excel 与数据处理、财报分析框架、投研方法与工具。重点是可复用的做法；只有判断和预测而没有做法归观点。", commentary: true },
  { key: "opinion", label: "观点", section: "实务与观点", guide: "重点是作者的解释、判断、主张、预测或访谈观点：对监管政策、市场走势、行业格局的评价。讨论某只股票不自动归观点，谈论某位名人也不自动归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 这个行业没有这样一类集中的“发布”，设为 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = [
  "ipo", "a股", "h股", "科创板", "创业板", "北交所", "上交所", "深交所", "证监会", "中注协", "财政部", "央行",
  "审计", "会计", "年报", "季报", "市盈率", "pe", "pb", "gdp", "cpi", "ppi", "lpr", "mlf", "社融",
];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = [
  "ipo_event", "regulatory_action", "audit_financial", "market_move", "company_event", "macro_policy", "opinion_analysis", "practical_guide",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "IPO/上市", "监管/处罚", "审计/财务", "市场/行情", "公司/产业", "宏观/政策", "观点/解读", "实务/方法", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "IPO问询", "北交所", "科创板", "创业板", "主板", "退市", "并购重组", "再融资", "财务造假", "审计失败", "内控", "会计准则",
  "舞弊识别", "会计师事务所", "券商", "公募基金", "私募/创投", "货币政策", "财政政策", "美联储", "汇率", "债券", "大宗商品", "房地产", "银行保险", "科技股",
] as const;

/** 可选的实体标签（机构、交易所、事务所）。 */
export const ENTITY_TAGS = [
  "证监会", "上交所", "深交所", "北交所", "中注协", "财政部", "中国人民银行", "金融监管总局",
  "普华永道", "德勤", "安永", "毕马威", "立信", "天健", "信永中和",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  监管: "监管/处罚", 处罚: "监管/处罚", 问询: "监管/处罚", 警示函: "监管/处罚", 退市: "监管/处罚", 立案: "监管/处罚", 律师函: "监管/处罚",
  审核问询: "IPO/上市", 上市: "IPO/上市", 新股: "IPO/上市", 打新: "IPO/上市", 发行: "IPO/上市", 注册制: "IPO/上市",
  审计: "审计/财务", 财务: "审计/财务", 会计: "审计/财务", 财报: "审计/财务", 造假: "审计/财务", 舞弊: "审计/财务", 内控: "审计/财务",
  行情: "市场/行情", 股市: "市场/行情", 大盘: "市场/行情", 指数: "市场/行情", 板块: "市场/行情", 资金: "市场/行情", 市场: "市场/行情",
  公司: "公司/产业", 产业: "公司/产业", 并购: "公司/产业", 重组: "公司/产业", 融资: "公司/产业", 业绩: "公司/产业", 人事: "公司/产业",
  宏观: "宏观/政策", 政策: "宏观/政策", 数据: "宏观/政策", 央行: "宏观/政策", 货币: "宏观/政策", 财政: "宏观/政策",
  观点: "观点/解读", 评论: "观点/解读", 解读: "观点/解读", 访谈: "观点/解读", 分析师: "观点/解读",
  实务: "实务/方法", 教程: "实务/方法", 技巧: "实务/方法", 指南: "实务/方法", 方法: "实务/方法",
  上市问询: "IPO问询", 招股书: "IPO问询", 问询函: "IPO问询",
  会计师事务所: "会计师事务所", 事务所: "会计师事务所", 四大: "会计师事务所",
  造假识别: "舞弊识别", 审计失败案例: "审计失败",
  货币政策: "货币政策", 降息: "货币政策", 降准: "货币政策", 加息: "货币政策", 利率: "货币政策",
  减税: "财政政策", 政府债: "财政政策",
  美债: "美联储", 鲍威尔: "美联储", 联储: "美联储",
  人民币: "汇率", 外汇: "汇率", 汇率: "汇率", 美元: "汇率",
  房地产: "房地产", 楼市: "房地产",
};

// ── 机构与事务所 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是机构自己的其他称呼（官网名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  csrc: { name: "中国证监会", displayTag: "证监会", aliases: ["中国证监会", "证监会", "CSRC"], otherNames: ["证券监管机构", "中国证券监督管理委员会"] },
  sse: { name: "上海证券交易所", displayTag: "上交所", aliases: ["上海证券交易所", "上交所", "SSE"] },
  szse: { name: "深圳证券交易所", displayTag: "深交所", aliases: ["深圳证券交易所", "深交所", "SZSE"] },
  bse: { name: "北京证券交易所", displayTag: "北交所", aliases: ["北京证券交易所", "北交所", "BSE"] },
  cicpa: { name: "中国注册会计师协会", displayTag: "中注协", aliases: ["中国注册会计师协会", "中注协", "CICPA"], otherNames: ["中国注册会计师协会官网"] },
  mof: { name: "财政部", displayTag: "财政部", aliases: ["财政部", "中国财政部", "MOF"] },
  pbc: { name: "中国人民银行", displayTag: "央行", aliases: ["中国人民银行", "央行", "人民银行", "PBOC"], otherNames: ["国家外汇管理局"] },
  nfra: { name: "国家金融监督管理总局", displayTag: "金融监管总局", aliases: ["国家金融监督管理总局", "金融监管总局", "银保监会", "NFRA"] },
  pwc: { name: "普华永道", displayTag: "普华永道", aliases: ["普华永道", "PwC", "PricewaterhouseCoopers", "罗兵咸永道"], otherNames: ["普华永道中天", "普华永道中国"] },
  deloitte: { name: "德勤", displayTag: "德勤", aliases: ["德勤", "Deloitte"], otherNames: ["德勤华永", "德勤中国"] },
  ey: { name: "安永", displayTag: "安永", aliases: ["安永", "EY", "Ernst & Young"], otherNames: ["安永华明", "安永中国"] },
  kpmg: { name: "毕马威", displayTag: "毕马威", aliases: ["毕马威", "KPMG"], otherNames: ["毕马威华振", "毕马威中国"] },
  bdo: { name: "立信会计师事务所", displayTag: "立信", aliases: ["立信", "立信会计师事务所", "BDO"], otherNames: ["立信会计师事务所（特殊普通合伙）"] },
  panchina: { name: "天健会计师事务所", displayTag: "天健", aliases: ["天健", "天健会计师事务所", "Pan-China"], otherNames: ["天健会计师事务所（特殊普通合伙）"] },
  shinewing: { name: "信永中和", displayTag: "信永中和", aliases: ["信永中和", "ShineWing"], otherNames: ["信永中和会计师事务所"] },
};

/**
 * 身份词典：摘要和标题里出现的机构，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "csrc", name: "中国证监会", patterns: [/证监会|证监局的?|中国证券监督管理委员会|\bCSRC\b/] },
  { id: "sse", name: "上海证券交易所", patterns: [/上海证券交易所|上交所/] },
  { id: "szse", name: "深圳证券交易所", patterns: [/深圳证券交易所|深交所/] },
  { id: "bse", name: "北京证券交易所", patterns: [/北京证券交易所|北交所/] },
  { id: "cicpa", name: "中国注册会计师协会", patterns: [/中国注册会计师协会|中注协|注册会计师协会/] },
  { id: "pbc", name: "中国人民银行", patterns: [/中国人民银行|央行|人民银行|\bPBOC\b/] },
  { id: "nfra", name: "国家金融监督管理总局", patterns: [/国家金融监督管理总局|金融监管总局|银保监会|\bNFRA\b/] },
  { id: "pwc", name: "普华永道", patterns: [/普华永道|\bPwC\b|PricewaterhouseCoopers|罗兵咸永道/i] },
  { id: "deloitte", name: "德勤", patterns: [/德勤|\bDeloitte\b/i] },
  { id: "ey", name: "安永", patterns: [/安永|\bEY\b|Ernst\s*&\s*Young/i] },
  { id: "kpmg", name: "毕马威", patterns: [/毕马威|\bKPMG\b/i] },
];

/** 这些域名上的文章，发布方就是对应的机构（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "csrc", domains: ["csrc.gov.cn"] },
  { entityId: "sse", domains: ["sse.com.cn"] },
  { entityId: "szse", domains: ["szse.cn"] },
  { entityId: "bse", domains: ["bse.cn"] },
  { entityId: "cicpa", domains: ["cicpa.org.cn"] },
  { entityId: "mof", domains: ["mof.gov.cn"] },
  { entityId: "pbc", domains: ["pbc.gov.cn"] },
  { entityId: "nfra", domains: ["nfra.gov.cn"] },
  { entityId: "pwc", domains: ["pwccn.com", "pwc.com"] },
  { entityId: "deloitte", domains: ["deloitte.com.cn", "deloitte.com"] },
  { entityId: "ey", domains: ["ey.com"] },
  { entityId: "kpmg", domains: ["kpmg.com"] },
];

/** 原文里的这些写法也算提到了对应机构。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "pwc", pattern: /普华永道中天/ },
  { entityId: "deloitte", pattern: /德勤华永/ },
  { entityId: "ey", pattern: /安永华明/ },
  { entityId: "kpmg", pattern: /毕马威华振/ },
];