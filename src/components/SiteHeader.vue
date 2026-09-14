<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { localeOptions, type AppLocale } from '../i18n'
import { useAppStore } from '../stores/app'

const route = useRoute()
const store = useAppStore()
const open = ref(false)
const { locale, t } = useI18n()
const nav = computed(() => [
  ['/', t('nav.home')],
  ['/blind-boxes', t('nav.boxes')],
  ['/faq', t('nav.faq')],
  ['/contact', t('nav.contact')],
])

function changeLocale(event: Event) {
  locale.value = (event.target as HTMLSelectElement).value as AppLocale
}

watch(locale, value => {
  localStorage.setItem('ok-kard-locale', value)
  document.documentElement.lang = value
}, { immediate: true })
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand"><span class="brandmark">◈</span><span>OK Kard<br class="mobile-only"> Empire</span></RouterLink>
      <nav :class="['main-nav',{open}]">
        <RouterLink v-for="n in nav" :key="n[0]" :to="n[0]" :class="{active:route.path===n[0]}" @click="open=false">{{n[1]}}</RouterLink>
      </nav>
      <div class="header-actions">
        <RouterLink to="/recharge" class="coin" :aria-label="t('nav.balance')"><span>◉</span><b>{{store.balance.toLocaleString()}}</b><i>+</i></RouterLink>
        <label class="language-switch" :title="t('nav.language')">
          <span aria-hidden="true">文</span>
          <select :value="locale" :aria-label="t('nav.language')" @change="changeLocale">
            <option v-for="option in localeOptions" :key="option.value" :value="option.value">{{option.label}}</option>
          </select>
        </label>
        <RouterLink to="/account" class="account-link"><span class="avatar">A</span><span class="desktop-only">{{t('nav.account')}}</span></RouterLink>
        <button class="menu mobile-only" @click="open=!open" :aria-expanded="open" :aria-label="t('nav.menu')">☰</button>
      </div>
    </div>
  </header>
  <Transition name="fade"><div v-if="store.notice" class="toast">{{store.notice}}</div></Transition>
</template>

<style scoped>
.site-header{height:72px;background:rgba(255,255,255,.95);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:50;backdrop-filter:blur(10px)}.header-inner{height:100%;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;font-weight:800;color:var(--brown);line-height:1.05}.brandmark{width:34px;height:34px;border-radius:8px;background:var(--brown);color:var(--gold);display:grid;place-items:center;font-size:20px}.main-nav{display:flex;align-items:center;gap:34px;font-size:14px}.main-nav a{height:72px;display:flex;align-items:center;border-bottom:2px solid transparent}.main-nav a:hover,.main-nav a.active{color:var(--brown);border-color:var(--brown)}.header-actions,.coin,.account-link{display:flex;align-items:center;gap:10px}.coin{font-size:13px}.coin i{width:22px;height:22px;background:var(--gold);border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:900}.language-switch{height:34px;display:flex;align-items:center;gap:5px;padding:0 8px;border:1px solid var(--line);border-radius:18px;background:#fff;color:var(--brown);transition:.2s}.language-switch:hover,.language-switch:focus-within{border-color:#b69b00;box-shadow:0 0 0 2px rgba(255,215,0,.13)}.language-switch span{font-size:12px;font-weight:900}.language-switch select{max-width:88px;border:0;outline:0;background:transparent;color:inherit;font-size:12px;font-weight:700;cursor:pointer}.avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#252516;color:var(--gold);font-weight:800}.menu{border:0;background:transparent;font-size:22px}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}
@media(max-width:980px){.main-nav{gap:18px}.language-switch select{width:34px}}
@media(max-width:767px){.site-header{height:64px}.main-nav{display:none;position:absolute;top:64px;left:0;right:0;background:white;border-bottom:1px solid var(--line);padding:10px 20px;box-shadow:var(--shadow)}.main-nav.open{display:grid}.main-nav a{height:44px}.coin b{font-size:12px}.header-actions{gap:6px}.brand{font-size:13px}.brandmark{width:30px;height:30px}.language-switch{padding:0 6px}.language-switch span{display:none}}
</style>
