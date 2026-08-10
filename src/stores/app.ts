import { defineStore } from 'pinia'
export const useAppStore=defineStore('app',{state:()=>({balance:12450,loggedIn:true,drawer:false,notice:'',reducedMotion:false}),actions:{toast(v:string){this.notice=v;window.setTimeout(()=>this.notice='',2400)},spend(amount:number){if(this.balance<amount)return false;this.balance-=amount;return true}}})
