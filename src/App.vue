<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { updateDocumentTitle } from './router'
const { locale } = useI18n()
const route = useRoute()
watch([locale,()=>route.fullPath],()=>updateDocumentTitle(route),{immediate:true})
</script>
<template><SiteHeader/><RouterView/><SiteFooter/></template>
