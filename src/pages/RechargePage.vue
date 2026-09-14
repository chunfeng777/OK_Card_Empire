<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const { t } = useI18n()
const packages = [
  { usd: 100, coin: 11500, label: 'value' },
  { usd: 500, coin: 59500, label: 'premium' },
  { usd: 1000, coin: 120000, label: 'flagship' },
  { usd: 5000, coin: 550000, label: 'large' },
  { usd: 10000, coin: 1100000, label: 'highest' },
]
const selected = ref(100)
const custom = ref<number | null>(null)
const payment = ref<'card' | 'alipay' | 'usdt'>('card')
const amount = computed(() => custom.value && custom.value > 0 ? custom.value : selected.value)
const coins = computed(() => packages.find(item => item.usd === amount.value && !custom.value)?.coin ?? Math.floor(amount.value * 110))
const paymentNames = computed(() => ({ card: 'Visa / Mastercard', alipay: t('recharge.alipay'), usdt: 'USDT' }))

function choose(usd: number) {
  selected.value = usd
  custom.value = null
}
function useCustom() {
  selected.value = 0
}
function submit() {
  if (!amount.value || amount.value < 1) return store.toast(t('recharge.invalid'))
  store.toast(t('recharge.orderCreated', { amount: amount.value.toLocaleString(), payment: paymentNames.value[payment.value] }))
}
</script>

<template>
  <main class="page">
    <section class="container recharge-page">
      <header class="center">
        <span class="eyebrow">{{ t('recharge.title') }}</span>
        <h1>{{ t('recharge.title') }}</h1>
        <p class="muted">{{ t('recharge.subtitle') }}</p>
      </header>

      <div class="recharge-grid">
        <button v-for="item in packages" :key="item.usd" type="button" class="card package" :class="{ selected: selected === item.usd && !custom }" @click="choose(item.usd)">
          <span class="pill gold">{{ t(`recharge.labels.${item.label}`) }}</span>
          <b>${{ item.usd.toLocaleString() }}</b>
          <strong>{{ item.coin.toLocaleString() }} Coin</strong>
          <i aria-hidden="true">✓</i>
        </button>
        <div class="card package custom-package" :class="{ selected: selected === 0 }" role="button" tabindex="0" @click="useCustom" @keydown.enter="useCustom">
          <span class="pill gold">{{ t('recharge.labels.flexible') }}</span>
          <b>{{ t('recharge.custom') }}</b>
          <label @click.stop>
            <span>$</span>
            <input v-model.number="custom" type="number" min="1" max="10000" step="1" :placeholder="t('recharge.enterAmount')" :aria-label="t('recharge.enterAmount')" @focus="useCustom" @input="useCustom">
          </label>
          <strong v-if="custom && custom > 0">{{ t('recharge.approximate', { coins: coins.toLocaleString() }) }}</strong>
          <strong v-else>{{ t('recharge.customRange') }}</strong>
          <i aria-hidden="true">✓</i>
        </div>
      </div>

      <section class="pay card">
        <div class="pay-head"><div><span class="eyebrow">{{ t('eyebrow.payment') }}</span><h2>{{ t('recharge.payment') }}</h2></div><div><small>{{ t('recharge.current') }}</small><strong>${{ amount.toLocaleString() }}</strong></div></div>
        <div class="payment-list">
          <label :class="{ selected: payment === 'card' }"><input v-model="payment" type="radio" value="card"><span class="pay-icon">▣</span><b>Visa / Mastercard</b><small>{{ t('recharge.cardDetail') }}</small></label>
          <label :class="{ selected: payment === 'alipay' }"><input v-model="payment" type="radio" value="alipay"><span class="pay-icon">支</span><b>{{ t('recharge.alipay') }}</b><small>{{ t('recharge.alipayDetail') }}</small></label>
          <label :class="{ selected: payment === 'usdt' }"><input v-model="payment" type="radio" value="usdt"><span class="pay-icon usdt">₮</span><b>USDT</b><small>{{ t('recharge.usdtDetail') }}</small></label>
        </div>
        <div class="order-summary"><span>{{ t('recharge.received') }}</span><strong>{{ coins.toLocaleString() }} OK Coin</strong></div>
        <div class="notice">{{ t('recharge.notice') }}</div>
        <button class="btn btn-primary submit" @click="submit">{{ t('recharge.continue', { amount: amount.toLocaleString() }) }}</button>
      </section>
    </section>
  </main>
</template>

<style scoped>
.recharge-page{padding-bottom:40px}.center{text-align:center}.center h1{font-size:38px;margin:8px 0}.recharge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:42px 0 24px}.package{position:relative;min-height:176px;padding:24px;text-align:left;overflow:hidden;transition:border-color .2s,transform .2s,box-shadow .2s}.package:hover{transform:translateY(-2px);box-shadow:var(--shadow)}.package.selected{border-color:#b69b00;box-shadow:0 0 0 3px rgba(255,215,0,.18)}.package b{display:block;margin:18px 0 5px;font-size:36px}.package strong{color:var(--brown)}.package i{position:absolute;right:15px;top:15px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--gold);font-style:normal;font-weight:900;opacity:0;transform:scale(.7);transition:.2s}.package.selected i{opacity:1;transform:scale(1)}.custom-package{cursor:pointer}.custom-package label{height:42px;display:flex;align-items:center;margin:7px 0 9px;border:1px solid #d9d5bd;border-radius:9px;background:#fff;overflow:hidden;cursor:text}.custom-package label span{padding-left:13px;font-size:20px;font-weight:800}.custom-package input{width:100%;height:100%;border:0;outline:0;padding:0 10px;font-size:18px;font-weight:800;background:transparent;-moz-appearance:textfield}.custom-package input::-webkit-inner-spin-button,.custom-package input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.custom-package b{margin-bottom:2px;font-size:30px}.custom-package strong{display:block;font-size:14px}.pay{max-width:760px;margin:auto;padding:30px}.pay-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:18px}.pay-head h2{margin:5px 0 0}.pay-head>div:last-child{text-align:right}.pay-head small{display:block;color:var(--muted)}.pay-head strong{font-size:25px;color:var(--brown)}.payment-list{display:grid;gap:10px}.payment-list label{display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:auto auto;column-gap:12px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:14px 16px;cursor:pointer;transition:.2s}.payment-list label.selected{border-color:#b69b00;background:#fffdf0;box-shadow:0 0 0 2px rgba(255,215,0,.12)}.payment-list input{grid-row:1/3}.pay-icon{grid-row:1/3;width:36px;height:36px;border-radius:9px;display:grid;place-items:center;background:#f1f0ea;color:#4d4b42;font-weight:900}.pay-icon.usdt{border-radius:50%;background:#e3f8f1;color:#159b73;font-size:21px}.payment-list b{align-self:end}.payment-list small{grid-column:3;color:var(--muted)}.order-summary{display:flex;justify-content:space-between;margin-top:18px;padding:15px 17px;border-radius:10px;background:#f5f5f1}.order-summary strong{color:var(--brown)}.notice{background:#fff9db;padding:13px;border-radius:9px;font-size:12px;line-height:1.6;margin:16px 0}.submit{width:100%}
@media(max-width:900px){.recharge-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.recharge-grid{margin-top:30px}.package{min-height:155px;padding:19px}.package b{font-size:30px}.pay{padding:22px}.center h1{font-size:32px}}
@media(max-width:420px){.recharge-grid{grid-template-columns:1fr}.pay-head{align-items:start}.pay-head strong{font-size:21px}}
</style>
