import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import BlindBoxesPage from './pages/BlindBoxesPage.vue'
import BlindBoxDetailPage from './pages/BlindBoxDetailPage.vue'
import AccountHomePage from './pages/AccountHomePage.vue'
import OrdersPage from './pages/OrdersPage.vue'
import ShippingOrdersPage from './pages/ShippingOrdersPage.vue'
import AddressesPage from './pages/AddressesPage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import SimplePages from './pages/SimplePages.vue'

const router=createRouter({history:createWebHistory(),scrollBehavior:()=>({top:0}),routes:[
 {path:'/',component:HomePage,meta:{title:'首页'}},
 {path:'/blind-boxes',component:BlindBoxesPage,meta:{title:'盲盒专区'}},
 {path:'/blind-boxes/:slug',component:BlindBoxDetailPage,meta:{title:'盲盒详情'}},
 {path:'/account',component:AccountHomePage,meta:{title:'个人中心',noindex:true}},
 {path:'/account/blind-box-orders',component:OrdersPage,meta:{title:'盲盒订单',noindex:true}},
 {path:'/account/shipping-orders',component:ShippingOrdersPage,meta:{title:'物流订单',noindex:true}},
 {path:'/account/addresses',component:AddressesPage,meta:{title:'地址簿',noindex:true}},
 {path:'/account/settings',component:SettingsPage,meta:{title:'个人设置',noindex:true}},
 {path:'/account/payment-methods',component:SimplePages,meta:{title:'支付方式',noindex:true}},
 {path:'/account/transactions',component:SimplePages,meta:{title:'交易明细',noindex:true}},
 {path:'/:page(faq|contact|recharge|login|register|forgot-password|reset-password|account-activation)',component:SimplePages},
 {path:'/:pathMatch(.*)*',redirect:'/'}
]})
router.afterEach(to=>{document.title=`${String(to.meta.title||'OK Card Empire')} · OK Card Empire`;let tag=document.querySelector('meta[name="robots"]');if(!tag){tag=document.createElement('meta');tag.setAttribute('name','robots');document.head.appendChild(tag)}tag.setAttribute('content',to.meta.noindex?'noindex,nofollow':'index,follow')})
export default router
