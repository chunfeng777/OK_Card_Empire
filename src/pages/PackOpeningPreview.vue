<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PackOpening from '../components/pack-opening/PackOpening.vue'
const router = useRouter()
const { t } = useI18n()
const results = computed(() => [{ name: t('cards.pikachu.name'), rarity: 'RARE', coin: 2000, image: '/images/pokemon/pikachu.png' }])
</script>
<template><PackOpening preview :title="t('opening.previewTitle')" :results="results" @close="router.push('/')"/></template>
