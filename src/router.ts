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
import RechargePage from './pages/RechargePage.vue'
import { i18n } from './i18n'

const router=createRouter({history:createWebHistory(),scrollBehavior:()=>({top:0}),routes:[
 {path:'/pack-opening',component:()=>import('./pages/PackOpeningPreview.vue'),meta:{titleKey:'router.preview',noindex:true}},
 {path:'/',component:HomePage,meta:{titleKey:'router.home'}},
 {path:'/blind-boxes',component:BlindBoxesPage,meta:{titleKey:'router.boxes'}},
 {path:'/blind-boxes/:slug',component:BlindBoxDetailPage,meta:{titleKey:'router.detail'}},
 {path:'/account',component:AccountHomePage,meta:{titleKey:'router.account',noindex:true}},
 {path:'/account/blind-box-orders',component:OrdersPage,meta:{titleKey:'router.orders',noindex:true}},
 {path:'/account/shipping-orders',component:ShippingOrdersPage,meta:{titleKey:'router.shipping',noindex:true}},
 {path:'/account/addresses',component:AddressesPage,meta:{titleKey:'router.addresses',noindex:true}},
 {path:'/account/settings',component:SettingsPage,meta:{titleKey:'router.settings',noindex:true}},
 {path:'/account/payment-methods',component:SimplePages,meta:{titleKey:'router.payments',noindex:true}},
 {path:'/account/transactions',component:SimplePages,meta:{titleKey:'router.transactions',noindex:true}},
 {path:'/recharge',component:RechargePage,meta:{titleKey:'router.recharge'}},
 {path:'/:page(faq|contact|login|register|forgot-password|reset-password|account-activation)',component:SimplePages},
 {path:'/:pathMatch(.*)*',redirect:'/'}
]})
const simpleTitleKeys: Record<string,string> = { faq:'router.faq', contact:'router.contact', login:'router.login', register:'router.register', 'forgot-password':'router.forgot', 'reset-password':'router.reset', 'account-activation':'router.activation' }
export function updateDocumentTitle(to=router.currentRoute.value){
 const key=String(to.meta.titleKey||simpleTitleKeys[String(to.params.page)]||'router.home')
 document.title=`${i18n.global.t(key)} · OK Kard Empire`
}
router.afterEach(to=>{updateDocumentTitle(to);let tag=document.querySelector('meta[name="robots"]');if(!tag){tag=document.createElement('meta');tag.setAttribute('name','robots');document.head.appendChild(tag)}tag.setAttribute('content',to.meta.noindex?'noindex,nofollow':'index,follow')})
export default router
