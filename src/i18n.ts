import { createI18n } from 'vue-i18n'
import { extendedMessages } from './locales/extended'
import { supplementalMessages } from './locales/supplemental'

export type AppLocale = 'zh-CN' | 'zh-TW' | 'ja-JP' | 'en-US'
export const localeOptions: { value: AppLocale; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'en-US', label: 'English' },
]

const messages = {
  'zh-CN': {
    nav: { home: '首页', boxes: '盲盒专区', faq: '常见问题', contact: '联系我们', account: '个人中心', balance: 'OK Coin 余额与充值', menu: '打开导航', language: '切换语言' },
    blindBoxes: { licensed: '宝可梦官方授权', title: '精品盲盒专区', subtitle: '探索真实有限的收藏卡池，每次开启必得一张卡牌。', search: '搜索盲盒或卡牌', searchPlaceholder: '搜索名称…', activity: '活动', all: '全部', newcomer: '新用户福利', hot: '热门', pokemonIp: '宝可梦 IP', clear: '清除全部条件', count: '{count} 个盲盒', sort: { recommended: '推荐', popular: '热度', newest: '最新上架', low: '价格从低到高', high: '价格从高到低', stock: '剩余库存' }, empty: '没有找到符合条件的盲盒', emptyHint: '尝试清除筛选或更换搜索关键词。', clearShort: '清除条件', load: '加载更多', ip: { pikachu: '皮卡丘', eevee: '伊布', charizard: '喷火龙', mewtwo: '超梦', squirtle: '杰尼龟', rayquaza: '烈空坐' } },
    boxCard: { drawPrice: '单次抽取', stock: '剩余库存', single: '单抽', ten: '十连抽', insufficient: '库存不足 10，暂不可十连抽' },
    boxes: {
      'pokemon-starlight': { name:'星辉皮卡丘限定卡池', subtitle:'电气鼠主题 · 官方授权', tags:['皮卡丘','限量版'], badge:'限量' },
      'eevee-evolution': { name:'伊布进化收藏卡池', subtitle:'八种进化形态主题', tags:['伊布','热门'], badge:'热门' },
      'charizard-legacy': { name:'喷火龙传奇珍藏', subtitle:'火焰系经典卡牌', tags:['喷火龙','PSA'], badge:'新品' },
      'mewtwo-genesis': { name:'超梦起源典藏卡池', subtitle:'超能力系高端收藏', tags:['超梦','稀有'], badge:'即将售罄' },
      'starter-gift': { name:'新用户福利盲盒', subtitle:'激活后 24 小时内可开启', tags:['福利','新用户'], badge:'新人专享' },
      'kanto-classic': { name:'关都初代回忆卡池', subtitle:'初代 151 主题收藏', tags:['经典','妙蛙种子'], badge:'经典' },
      'rayquaza-sky': { name:'烈空坐苍穹卡池', subtitle:'龙系传说宝可梦主题', tags:['烈空坐','传说'], badge:'限定' },
      'water-friends': { name:'水系伙伴收藏卡池', subtitle:'杰尼龟与伙伴主题', tags:['杰尼龟','水系'], badge:'已售罄' }
    },
    home: { hero: ['收藏热爱，每次开启都有惊喜', '星辉皮卡丘限定卡池', '伊布进化收藏卡池'], explore: '立即探索', heroAria: '精选盲盒轮播图', previous: '上一张轮播图', next: '下一张轮播图', chooseSlide: '选择轮播图', viewSlide: '查看第 {number} 张轮播图', live: '最新抽取动态', won: '抽到了', trending: '热门必抢盲盒', viewAll: '查看全部盲盒', trustTitle: '放心收藏，透明体验', trust: [['官方授权','宝可梦官方授权卡牌，商品信息清晰可追溯。'],['概率透明','公开初始库存、剩余库存与实时动态概率。'],['灵活回收','保管中的卡牌可按页面锁定 Coin 进行回收。'],['实物配送','卡牌合计达到 2,000 Coin 即可申请标准包邮。']], faqTitle: '收藏之前，\n你可能想知道', moreQuestions: '查看更多问题', faqs: ['如何保证卡池概率透明？','新用户 100 Coin 如何领取？','抽中的卡牌如何回收？','何时可以申请实物发货？','十连抽是否有额外保底？','OK Coin 是否可以提现？'], faqAnswer: '所有规则均以当前页面展示和订单最终状态为准。如需进一步帮助，可提交客服工单。' },
    recharge: { title: '充值中心', subtitle: '美元充值获得 OK Coin。OK Coin 不可提现、转账或赠送。', labels: { value: '高性价比', premium: '尊享档位', flagship: '旗舰档位', large: '大额充值', highest: '最高档位', flexible: '灵活充值' }, custom: '自定义', enterAmount: '输入金额', customRange: '1–10,000 美元', approximate: '约 {coins} Coin', payment: '选择支付方式', current: '本次充值', cardDetail: '信用卡或借记卡', alipay: '支付宝', alipayDetail: '使用支付宝安全付款', usdtDetail: '支持 TRC20 / ERC20 网络', received: '到账数量', notice: '首次充值前，请确认你已年满 18 周岁并理解理性消费提示。使用 USDT 时请仔细核对所选网络与收款地址。', continue: '继续支付 · ${amount}', invalid: '请输入有效的充值金额', orderCreated: '已创建 ${amount} 的 {payment} 支付订单' },
    footer: { intro: '面向成年收藏用户的宝可梦官方授权卡牌盲盒平台。', about: '关于我们', story: '品牌故事', license: '官方授权说明', rational: '理性消费提示', support: '客户支持', faq: '常见问题', shipping: '配送说明', contact: '联系客服', company: '公司信息', rights: '© 2026 深圳百川云创技术有限公司. All Rights Reserved.', privacy: '本网站不涉及个人隐私数据收集，仅用于展示公司业务及咨询。' }
  },
  'zh-TW': {
    nav: { home: '首頁', boxes: '盲盒專區', faq: '常見問題', contact: '聯絡我們', account: '個人中心', balance: 'OK Coin 餘額與儲值', menu: '開啟導覽', language: '切換語言' },
    blindBoxes: { licensed: '寶可夢官方授權', title: '精品盲盒專區', subtitle: '探索真實有限的收藏卡池，每次開啟必得一張卡牌。', search: '搜尋盲盒或卡牌', searchPlaceholder: '搜尋名稱…', activity: '活動', all: '全部', newcomer: '新用戶福利', hot: '熱門', pokemonIp: '寶可夢 IP', clear: '清除全部條件', count: '{count} 個盲盒', sort: { recommended: '推薦', popular: '熱度', newest: '最新上架', low: '價格由低至高', high: '價格由高至低', stock: '剩餘庫存' }, empty: '找不到符合條件的盲盒', emptyHint: '請嘗試清除篩選或更換搜尋關鍵字。', clearShort: '清除條件', load: '載入更多', ip: { pikachu: '皮卡丘', eevee: '伊布', charizard: '噴火龍', mewtwo: '超夢', squirtle: '傑尼龜', rayquaza: '烈空坐' } },
    boxCard: { drawPrice: '單次抽取', stock: '剩餘庫存', single: '單抽', ten: '十連抽', insufficient: '庫存不足 10，暫不可十連抽' },
    boxes: {
      'pokemon-starlight': { name:'星輝皮卡丘限定卡池', subtitle:'電氣鼠主題 · 官方授權', tags:['皮卡丘','限量版'], badge:'限量' },
      'eevee-evolution': { name:'伊布進化收藏卡池', subtitle:'八種進化形態主題', tags:['伊布','熱門'], badge:'熱門' },
      'charizard-legacy': { name:'噴火龍傳奇珍藏', subtitle:'火焰系經典卡牌', tags:['噴火龍','PSA'], badge:'新品' },
      'mewtwo-genesis': { name:'超夢起源典藏卡池', subtitle:'超能力系高端收藏', tags:['超夢','稀有'], badge:'即將售罄' },
      'starter-gift': { name:'新用戶福利盲盒', subtitle:'啟用後 24 小時內可開啟', tags:['福利','新用戶'], badge:'新人專享' },
      'kanto-classic': { name:'關都初代回憶卡池', subtitle:'初代 151 主題收藏', tags:['經典','妙蛙種子'], badge:'經典' },
      'rayquaza-sky': { name:'烈空坐蒼穹卡池', subtitle:'龍系傳說寶可夢主題', tags:['烈空坐','傳說'], badge:'限定' },
      'water-friends': { name:'水系夥伴收藏卡池', subtitle:'傑尼龜與夥伴主題', tags:['傑尼龜','水系'], badge:'已售罄' }
    },
    home: { hero: ['收藏熱愛，每次開啟都有驚喜', '星輝皮卡丘限定卡池', '伊布進化收藏卡池'], explore: '立即探索', heroAria: '精選盲盒輪播圖', previous: '上一張輪播圖', next: '下一張輪播圖', chooseSlide: '選擇輪播圖', viewSlide: '查看第 {number} 張輪播圖', live: '最新抽取動態', won: '抽到了', trending: '熱門必搶盲盒', viewAll: '查看全部盲盒', trustTitle: '放心收藏，透明體驗', trust: [['官方授權','寶可夢官方授權卡牌，商品資訊清晰可追溯。'],['機率透明','公開初始庫存、剩餘庫存與即時動態機率。'],['彈性回收','保管中的卡牌可按頁面鎖定 Coin 進行回收。'],['實物配送','卡牌合計達到 2,000 Coin 即可申請標準免運。']], faqTitle: '收藏之前，\n你可能想知道', moreQuestions: '查看更多問題', faqs: ['如何保證卡池機率透明？','新用戶 100 Coin 如何領取？','抽中的卡牌如何回收？','何時可以申請實物配送？','十連抽是否有額外保底？','OK Coin 是否可以提領？'], faqAnswer: '所有規則均以目前頁面展示和訂單最終狀態為準。如需進一步協助，可提交客服工單。' },
    recharge: { title: '儲值中心', subtitle: '使用美元儲值取得 OK Coin。OK Coin 不可提領、轉帳或贈送。', labels: { value: '高性價比', premium: '尊享方案', flagship: '旗艦方案', large: '大額儲值', highest: '最高方案', flexible: '彈性儲值' }, custom: '自訂', enterAmount: '輸入金額', customRange: '1–10,000 美元', approximate: '約 {coins} Coin', payment: '選擇付款方式', current: '本次儲值', cardDetail: '信用卡或簽帳金融卡', alipay: '支付寶', alipayDetail: '使用支付寶安全付款', usdtDetail: '支援 TRC20 / ERC20 網路', received: '到帳數量', notice: '首次儲值前，請確認你已年滿 18 歲並理解理性消費提示。使用 USDT 時請仔細核對所選網路與收款地址。', continue: '繼續付款 · ${amount}', invalid: '請輸入有效的儲值金額', orderCreated: '已建立 ${amount} 的 {payment} 付款訂單' },
    footer: { intro: '面向成年收藏用戶的寶可夢官方授權卡牌盲盒平台。', about: '關於我們', story: '品牌故事', license: '官方授權說明', rational: '理性消費提示', support: '客戶支援', faq: '常見問題', shipping: '配送說明', contact: '聯絡客服', company: '公司資訊', rights: '© 2026 深圳百川雲創技術有限公司. All Rights Reserved.', privacy: '本網站不涉及個人隱私資料收集，僅用於展示公司業務及諮詢。' }
  },
  'ja-JP': {
    nav: { home: 'ホーム', boxes: 'ブラインドボックス', faq: 'よくある質問', contact: 'お問い合わせ', account: 'マイページ', balance: 'OK Coin 残高・チャージ', menu: 'メニューを開く', language: '言語を切り替える' },
    blindBoxes: { licensed: 'ポケモン公式ライセンス', title: 'プレミアムボックス', subtitle: '数量限定のカードプールを探索。開封ごとにカードを1枚獲得できます。', search: 'ボックスまたはカードを検索', searchPlaceholder: '名前で検索…', activity: 'キャンペーン', all: 'すべて', newcomer: '新規ユーザー', hot: '人気', pokemonIp: 'ポケモン', clear: '条件をすべてクリア', count: '{count} ボックス', sort: { recommended: 'おすすめ', popular: '人気順', newest: '新着順', low: '価格の安い順', high: '価格の高い順', stock: '残り在庫' }, empty: '条件に一致するボックスがありません', emptyHint: 'フィルターを解除するか、別のキーワードで検索してください。', clearShort: '条件をクリア', load: 'さらに読み込む', ip: { pikachu: 'ピカチュウ', eevee: 'イーブイ', charizard: 'リザードン', mewtwo: 'ミュウツー', squirtle: 'ゼニガメ', rayquaza: 'レックウザ' } },
    boxCard: { drawPrice: '1回の価格', stock: '残り在庫', single: '1回引く', ten: '10回引く', insufficient: '在庫が10未満のため、10回引きは利用できません' },
    boxes: {
      'pokemon-starlight': { name:'スターライト・ピカチュウ限定プール', subtitle:'でんきタイプ · 公式ライセンス', tags:['ピカチュウ','限定版'], badge:'限定' },
      'eevee-evolution': { name:'イーブイ進化コレクション', subtitle:'8種類の進化形テーマ', tags:['イーブイ','人気'], badge:'人気' },
      'charizard-legacy': { name:'リザードン・レジェンド', subtitle:'ほのおタイプのクラシックカード', tags:['リザードン','PSA'], badge:'新着' },
      'mewtwo-genesis': { name:'ミュウツー・ジェネシス', subtitle:'エスパータイプのプレミアムコレクション', tags:['ミュウツー','レア'], badge:'残りわずか' },
      'starter-gift': { name:'新規ユーザー限定ボックス', subtitle:'有効化後24時間以内に開封可能', tags:['特典','新規'], badge:'新規限定' },
      'kanto-classic': { name:'カントー151メモリーズ', subtitle:'初代151テーマコレクション', tags:['クラシック','フシギダネ'], badge:'クラシック' },
      'rayquaza-sky': { name:'レックウザ・スカイプール', subtitle:'伝説のドラゴンタイプテーマ', tags:['レックウザ','伝説'], badge:'限定' },
      'water-friends': { name:'みずタイプ仲間コレクション', subtitle:'ゼニガメと仲間たち', tags:['ゼニガメ','みず'], badge:'売り切れ' }
    },
    home: { hero: ['コレクションを楽しむ、開けるたびに驚きを', 'スターライト・ピカチュウ限定プール', 'イーブイ進化コレクション'], explore: '今すぐ見る', heroAria: 'おすすめブラインドボックス', previous: '前のスライド', next: '次のスライド', chooseSlide: 'スライドを選択', viewSlide: '{number}枚目を見る', live: '最新の抽選結果', won: 'を獲得', trending: '人気のブラインドボックス', viewAll: 'すべて見る', trustTitle: '安心で透明なコレクション体験', trust: [['公式ライセンス','ポケモン公式ライセンスカード。商品情報を明確に追跡できます。'],['確率を公開','初期在庫、残り在庫、リアルタイム確率を公開します。'],['柔軟な買取','保管中のカードは表示された Coin 価格で買取できます。'],['現物配送','カード合計が 2,000 Coin 以上で通常配送料無料を申請できます。']], faqTitle: 'コレクションを始める前に\n知っておきたいこと', moreQuestions: '質問をもっと見る', faqs: ['カードプールの確率は透明ですか？','新規ユーザーの 100 Coin はどう受け取りますか？','獲得したカードはどう売却しますか？','現物配送はいつ申請できますか？','10連に追加保証はありますか？','OK Coin は出金できますか？'], faqAnswer: 'すべてのルールは現在のページ表示と注文の最終状態に準じます。さらにサポートが必要な場合は、お問い合わせください。' },
    recharge: { title: 'チャージセンター', subtitle: '米ドルでチャージすると OK Coin を獲得できます。OK Coin の出金、送金、譲渡はできません。', labels: { value: 'おすすめ', premium: 'プレミアム', flagship: 'フラッグシップ', large: '高額チャージ', highest: '最大プラン', flexible: '自由入力' }, custom: 'カスタム', enterAmount: '金額を入力', customRange: '1〜10,000 米ドル', approximate: '約 {coins} Coin', payment: 'お支払い方法', current: '今回のチャージ', cardDetail: 'クレジット／デビットカード', alipay: 'Alipay', alipayDetail: 'Alipay で安全に支払う', usdtDetail: 'TRC20 / ERC20 ネットワーク対応', received: '受取数量', notice: '初回チャージの前に、18歳以上であることと適切な消費に関する注意事項をご確認ください。USDT を使用する際は、ネットワークと受取アドレスを必ずご確認ください。', continue: '支払いへ進む · ${amount}', invalid: '有効なチャージ金額を入力してください', orderCreated: '${amount} の {payment} 支払い注文を作成しました' },
    footer: { intro: '成人コレクター向けのポケモン公式ライセンスカード・ブラインドボックスプラットフォーム。', about: '私たちについて', story: 'ブランドストーリー', license: '公式ライセンス', rational: '適切な消費について', support: 'サポート', faq: 'よくある質問', shipping: '配送について', contact: 'お問い合わせ', company: '会社情報', rights: '© 2026 深圳百川雲創技術有限公司. All Rights Reserved.', privacy: '本サイトは個人情報を収集せず、会社の事業紹介とお問い合わせのためにのみ使用されます。' }
  },
  'en-US': {
    nav: { home: 'Home', boxes: 'Blind Boxes', faq: 'FAQ', contact: 'Contact', account: 'My Account', balance: 'OK Coin balance and recharge', menu: 'Open navigation', language: 'Change language' },
    blindBoxes: { licensed: 'Officially Licensed Pokémon', title: 'Premium Blind Boxes', subtitle: 'Explore genuine limited card pools. Every opening awards one card.', search: 'Search boxes or cards', searchPlaceholder: 'Search by name…', activity: 'Offers', all: 'All', newcomer: 'New User', hot: 'Popular', pokemonIp: 'Pokémon', clear: 'Clear All Filters', count: '{count} boxes', sort: { recommended: 'Recommended', popular: 'Popularity', newest: 'Newest', low: 'Price: Low to High', high: 'Price: High to Low', stock: 'Remaining Stock' }, empty: 'No matching blind boxes found', emptyHint: 'Try clearing filters or using a different search term.', clearShort: 'Clear Filters', load: 'Load More', ip: { pikachu: 'Pikachu', eevee: 'Eevee', charizard: 'Charizard', mewtwo: 'Mewtwo', squirtle: 'Squirtle', rayquaza: 'Rayquaza' } },
    boxCard: { drawPrice: 'Single Draw', stock: 'Remaining Stock', single: 'Draw Once', ten: 'Draw 10', insufficient: 'Fewer than 10 remain; Draw 10 is unavailable' },
    boxes: {
      'pokemon-starlight': { name:'Starlight Pikachu Limited Pool', subtitle:'Electric Mouse Theme · Officially Licensed', tags:['Pikachu','Limited'], badge:'Limited' },
      'eevee-evolution': { name:'Eevee Evolution Collection', subtitle:'Eight Evolution Forms', tags:['Eevee','Popular'], badge:'Popular' },
      'charizard-legacy': { name:'Charizard Legendary Collection', subtitle:'Classic Fire-Type Cards', tags:['Charizard','PSA'], badge:'New' },
      'mewtwo-genesis': { name:'Mewtwo Genesis Collection', subtitle:'Premium Psychic-Type Collection', tags:['Mewtwo','Rare'], badge:'Almost Gone' },
      'starter-gift': { name:'New User Welcome Box', subtitle:'Open within 24 hours of activation', tags:['Bonus','New User'], badge:'New User' },
      'kanto-classic': { name:'Kanto 151 Memories', subtitle:'Original 151 Collection', tags:['Classic','Bulbasaur'], badge:'Classic' },
      'rayquaza-sky': { name:'Rayquaza Sky Pool', subtitle:'Legendary Dragon-Type Theme', tags:['Rayquaza','Legendary'], badge:'Limited' },
      'water-friends': { name:'Water Friends Collection', subtitle:'Squirtle and Friends', tags:['Squirtle','Water'], badge:'Sold Out' }
    },
    home: { hero: ['Collect what you love. Find a surprise in every pack.', 'Starlight Pikachu Limited Pool', 'Eevee Evolution Collection'], explore: 'Explore Now', heroAria: 'Featured blind box carousel', previous: 'Previous slide', next: 'Next slide', chooseSlide: 'Choose a slide', viewSlide: 'View slide {number}', live: 'Latest draw activity', won: 'pulled', trending: 'Trending Blind Boxes', viewAll: 'View All Blind Boxes', trustTitle: 'Collect with Confidence and Transparency', trust: [['Officially Licensed','Officially licensed Pokémon cards with clear, traceable product details.'],['Transparent Odds','Initial inventory, remaining inventory, and live odds are disclosed.'],['Flexible Buyback','Stored cards can be exchanged at the displayed locked Coin value.'],['Physical Delivery','Standard free shipping is available once selected cards total 2,000 Coin.']], faqTitle: 'Before You Collect,\nYou May Want to Know', moreQuestions: 'View More Questions', faqs: ['How are card pool odds kept transparent?','How do new users claim 100 Coin?','How do I exchange a card I pulled?','When can I request physical delivery?','Does a 10-pack draw include an extra guarantee?','Can OK Coin be withdrawn?'], faqAnswer: 'All rules are subject to the current page and the final order status. Contact support if you need more help.' },
    recharge: { title: 'Recharge Center', subtitle: 'Recharge in USD to receive OK Coin. OK Coin cannot be withdrawn, transferred, or gifted.', labels: { value: 'Best Value', premium: 'Premium', flagship: 'Flagship', large: 'Large Recharge', highest: 'Top Tier', flexible: 'Flexible' }, custom: 'Custom', enterAmount: 'Enter amount', customRange: 'USD 1–10,000', approximate: 'Approx. {coins} Coin', payment: 'Payment Method', current: 'Recharge Amount', cardDetail: 'Credit or debit card', alipay: 'Alipay', alipayDetail: 'Pay securely with Alipay', usdtDetail: 'TRC20 / ERC20 supported', received: 'Coins Received', notice: 'Before your first recharge, confirm that you are at least 18 years old and understand the responsible spending notice. For USDT, carefully verify the network and receiving address.', continue: 'Continue · ${amount}', invalid: 'Enter a valid recharge amount', orderCreated: 'Created a {payment} payment order for ${amount}' },
    footer: { intro: 'An officially licensed Pokémon card blind-box platform for adult collectors.', about: 'About Us', story: 'Our Story', license: 'Official Licensing', rational: 'Responsible Spending', support: 'Support', faq: 'FAQ', shipping: 'Shipping', contact: 'Contact Support', company: 'Company', rights: '© 2026 Shenzhen Baichuan Yunchuang Technology Co., Ltd. All Rights Reserved.', privacy: 'This website does not collect personal data and is used only to present company services and handle inquiries.' }
  }
}

const stored = localStorage.getItem('ok-kard-locale') as AppLocale | null
const initialLocale = localeOptions.some(option => option.value === stored) ? stored! : 'zh-CN'
for (const option of localeOptions) {
  const target = messages[option.value] as Record<string, any>
  Object.assign(target, extendedMessages[option.value], supplementalMessages[option.value])
  Object.assign(target.opening, { previewTitle: supplementalMessages[option.value].openingExtra.previewTitle })
}
export const i18n = createI18n({ legacy: false, locale: initialLocale, fallbackLocale: 'zh-CN', messages })
