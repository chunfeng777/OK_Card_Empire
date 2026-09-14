<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="container foot-grid">
      <div><RouterLink to="/" class="foot-brand">OK Kard Empire</RouterLink><p>{{t('footer.intro')}}</p><div class="social">◎ ◉ ◇</div></div>
      <div><h4>{{t('footer.about')}}</h4><a>{{t('footer.story')}}</a><a>{{t('footer.license')}}</a><a>{{t('footer.rational')}}</a></div>
      <div><h4>{{t('footer.support')}}</h4><RouterLink to="/faq">{{t('footer.faq')}}</RouterLink><a>{{t('footer.shipping')}}</a><RouterLink to="/contact">{{t('footer.contact')}}</RouterLink></div>
      <div class="company-info"><h4>{{t('footer.company')}}</h4><strong class="company-name">{{t('legal.company')}}</strong><p>⌖ {{t('legal.address')}}</p><a href="tel:13042038404">☎ 13042038404</a><a href="mailto:cfppdsa001@outlook.com">✉ cfppdsa001@outlook.com</a></div>
    </div>
    <div class="container copyright"><span>{{t('footer.rights')}}</span><span>{{t('footer.privacy')}}</span></div>
  </footer>
</template>

<style scoped>
.footer{background:#102f42;color:#dce7eb;padding:58px 0 24px}.foot-grid{display:grid;grid-template-columns:minmax(240px,1.35fr) repeat(2,minmax(130px,.72fr)) minmax(280px,1.15fr);gap:48px;align-items:start}.foot-grid>div{min-width:0}.foot-brand{display:inline-block;color:#fff;font-size:20px;font-weight:900;margin-bottom:12px}.foot-grid p{color:#aebfc7;font-size:13px;line-height:1.75;margin:0 0 16px}.foot-grid h4{color:#fff;font-size:14px;margin:3px 0 18px}.foot-grid a{display:block;width:max-content;max-width:100%;color:#b9c9d0;font-size:13px;line-height:1.55;margin:0 0 11px;overflow-wrap:anywhere}.foot-grid a:hover{color:var(--gold)}.social{color:var(--gold);letter-spacing:8px}.company-info .company-name{display:block;color:#fff;font-size:13px;line-height:1.55;margin-bottom:11px}.company-info p{margin-bottom:11px}.copyright{display:flex;justify-content:space-between;gap:32px;margin-top:38px;padding-top:22px;border-top:1px solid rgba(255,255,255,.15);color:#829ba6;font-size:11px;line-height:1.6}.copyright span:last-child{text-align:right}
@media(max-width:980px){.foot-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 48px}}
@media(max-width:600px){.footer{padding-top:40px}.foot-grid{grid-template-columns:1fr;gap:28px}.copyright{display:grid;gap:8px;margin-top:28px}.copyright span:last-child{text-align:left}}
</style>
