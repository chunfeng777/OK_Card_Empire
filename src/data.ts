export type BlindBox={id:string;name:string;subtitle:string;price:number;remaining:number;total:number;tags:string[];badge:string;image:string}
export const images={
 hero:'https://lh3.googleusercontent.com/aida-public/AB6AXuBs7hh5Xe0l4sEzqn74DbrTWBXAJRSS7vKI6fu7zzTfkgdDfITDuBVzE3nvhgH2sc1ctK7Ysk6ljkCsAE1YzfG4ehxPJYgFqz2m0ZqDZnzeI6tXhBCt9HNJOo-GYTpuxlyuVlH2JKKaX2CqNcCcdfSmXI9EKHzRM6eWiA_z-6sGcU_04zTi3id7K3XqIJPU0ONd1tks_kSnrVwEE1sARVn4cdc3bfV8Hsn_rnB5OlPo9NuwbZCU7FrG',
 box:'https://lh3.googleusercontent.com/aida-public/AB6AXuAKpPKHQaDeM3DnEWytqA3q1gjIxVmcqrB1RrByn_YxnUfkdbLjso9ZASrz2rNaUox6I2KRUfs_iacPSYxPoqVKPrpjtNIAncI6XANnFTu99S89qoIziPm3hCBl50u-3c6vjsaQqiHXKvrUdohi-As6uf2TL5qlv5xi74h9PhNVDiJXX8zHSxSAKlvQGLw24G_QM4xt4DBK5h5B7r2EMaA8_m0IWkSYHPmOXWTcSNqhINADPVZboIbV',
 card1:'https://lh3.googleusercontent.com/aida-public/AB6AXuATrs0CsDuQ9kf43dlhHcS_VSe0PiL0mX4jx_1qMOopXAqzctJZiszSnW3R5AgFmyGSs0mQdlCBH2eMpd2E3tpCZ973JyX-jRTl7XQeJDXSDYirm_hoaUIsGZ7WJAVXsml91QptZ0ET0fdIuANJM8v4sC6eEcT91YL4kSIeeS9WpngBlN-V1Fd0ryMn42eFwvBRC0JUuQtKWQiLcGs6lpqwB6nAd-UXYbwHlr8DpkiFSMnuWPE7FMCe',
 card2:'https://lh3.googleusercontent.com/aida-public/AB6AXuBhVesZZCSS87Ldhf2Obze7SWeij9TNNE55eUm043voK5l6Si9PMwudQbCaDh_v6sIoXefMIcu1ixqKFwos120L59HE6_tehytFEPdXudANsctQcl_LJAPcaiXm03Y20Z0eKMGOcdjwxC6o_SlEKFkZG9n3usAaCPIOOO3I3g2snQYxdu5X0CTDhZVebEZTXqZ6CKznZyb2Hqb8KD5BPeIqIlnxYuNodekxMUDFzjiEn8xcM-67HUxo',
 card3:'https://lh3.googleusercontent.com/aida-public/AB6AXuDl1Q_Ts2HD7EQWZkFz5iwpzG6ncLURQ_ltZBT4zRIXKqxgjNKG4RMUWCxVBCI-lBXDVaVXkyjdSm_XXMpIzqeucwaHQ81veVX4Zcc9foKGZaBvw61Q4jMrs8X7wovzLI4JfweeDYDC6T1a5r8K1JxOKbsk_49EF_VnSL8E4lWZ2fwxuEx5pbkU0gZmBDOl7zCfVeio5DT3NjhKudRKsaeiakeqnRMnfwFlpFAQYpQK6kfcRWq0C7zR'
}
export const boxes:BlindBox[]=[
 {id:'pokemon-starlight',name:'星辉皮卡丘限定卡池',subtitle:'电气鼠主题 · 官方授权',price:500,remaining:38,total:100,tags:['皮卡丘','限量版'],badge:'限量',image:images.box},
 {id:'eevee-evolution',name:'伊布进化收藏卡池',subtitle:'八种进化形态主题',price:450,remaining:12,total:80,tags:['伊布','热门'],badge:'热门',image:images.card2},
 {id:'charizard-legacy',name:'喷火龙传奇珍藏',subtitle:'火焰系经典卡牌',price:800,remaining:64,total:120,tags:['喷火龙','PSA'],badge:'新品',image:images.card1},
 {id:'mewtwo-genesis',name:'超梦起源典藏卡池',subtitle:'超能力系高端收藏',price:600,remaining:8,total:96,tags:['超梦','稀有'],badge:'即将售罄',image:images.card3},
 {id:'starter-gift',name:'新用户福利盲盒',subtitle:'激活后 24 小时内可开启',price:100,remaining:220,total:500,tags:['福利','新用户'],badge:'新人专享',image:images.card2},
 {id:'kanto-classic',name:'关都初代回忆卡池',subtitle:'初代 151 主题收藏',price:350,remaining:91,total:150,tags:['经典','妙蛙种子'],badge:'经典',image:images.card3},
 {id:'rayquaza-sky',name:'烈空坐苍穹卡池',subtitle:'龙系传说宝可梦主题',price:900,remaining:31,total:100,tags:['烈空坐','传说'],badge:'限定',image:images.card1},
 {id:'water-friends',name:'水系伙伴收藏卡池',subtitle:'杰尼龟与伙伴主题',price:300,remaining:0,total:80,tags:['杰尼龟','水系'],badge:'已售罄',image:images.card2}
]
export const cards=[
 {name:'皮卡丘 VMAX',tag:'PSA 10',coin:2000,image:images.card1,status:'保管中'},
 {name:'耿鬼 VMAX',tag:'PSA 9',coin:800,image:images.card2,status:'保管中'},
 {name:'超梦 GX',tag:'未评级',coin:800,image:images.card3,status:'保管中'},
 {name:'伊布限定版',tag:'限量版',coin:450,image:images.card1,status:'发货锁定'}
]
