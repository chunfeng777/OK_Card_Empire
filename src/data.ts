export type BlindBox={id:string;name:string;subtitle:string;price:number;remaining:number;total:number;tags:string[];badge:string;image:string}
export const images={
 pikachu:'/images/pokemon/pikachu.png',
 eevee:'/images/pokemon/eevee.png',
 charizard:'/images/pokemon/charizard.png',
 mewtwo:'/images/pokemon/mewtwo.png',
 bulbasaur:'/images/pokemon/bulbasaur.png',
 rayquaza:'/images/pokemon/rayquaza.png',
 squirtle:'/images/pokemon/squirtle.png',
 gengar:'/images/pokemon/gengar.png',
}
export const boxes:BlindBox[]=[
 {id:'pokemon-starlight',name:'星辉皮卡丘限定卡池',subtitle:'电气鼠主题 · 官方授权',price:500,remaining:38,total:100,tags:['皮卡丘','限量版'],badge:'限量',image:images.pikachu},
 {id:'eevee-evolution',name:'伊布进化收藏卡池',subtitle:'八种进化形态主题',price:450,remaining:12,total:80,tags:['伊布','热门'],badge:'热门',image:images.eevee},
 {id:'charizard-legacy',name:'喷火龙传奇珍藏',subtitle:'火焰系经典卡牌',price:800,remaining:64,total:120,tags:['喷火龙','PSA'],badge:'新品',image:images.charizard},
 {id:'mewtwo-genesis',name:'超梦起源典藏卡池',subtitle:'超能力系高端收藏',price:600,remaining:8,total:96,tags:['超梦','稀有'],badge:'即将售罄',image:images.mewtwo},
 {id:'starter-gift',name:'新用户福利盲盒',subtitle:'激活后 24 小时内可开启',price:100,remaining:220,total:500,tags:['福利','新用户'],badge:'新人专享',image:images.gengar},
 {id:'kanto-classic',name:'关都初代回忆卡池',subtitle:'初代 151 主题收藏',price:350,remaining:91,total:150,tags:['经典','妙蛙种子'],badge:'经典',image:images.bulbasaur},
 {id:'rayquaza-sky',name:'烈空坐苍穹卡池',subtitle:'龙系传说宝可梦主题',price:900,remaining:31,total:100,tags:['烈空坐','传说'],badge:'限定',image:images.rayquaza},
 {id:'water-friends',name:'水系伙伴收藏卡池',subtitle:'杰尼龟与伙伴主题',price:300,remaining:0,total:80,tags:['杰尼龟','水系'],badge:'已售罄',image:images.squirtle}
]
export const cards=[
 {name:'皮卡丘 VMAX',tag:'PSA 10',coin:2000,image:images.pikachu,status:'保管中'},
 {name:'耿鬼 VMAX',tag:'PSA 9',coin:800,image:images.gengar,status:'保管中'},
 {name:'超梦 GX',tag:'未评级',coin:800,image:images.mewtwo,status:'保管中'},
 {name:'伊布限定版',tag:'限量版',coin:450,image:images.eevee,status:'发货锁定'}
]
