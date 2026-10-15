<script setup>
import { onUnmounted, ref } from 'vue'
import { PhCheck, PhCopy } from '@phosphor-icons/vue'

const props = defineProps({ accountId: { type: String, required: true } })
const copyRegion = ref(null)
const copyState = ref('idle')
let resetTimer
let copying = false

// HTTP IP addresses do not expose the Clipboard API. Keep copying available
// on the local network through a temporary selection within the user action.
function copyFromSelection() {
  const previousFocus = document.activeElement
  const selection = document.getSelection()
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : []
  const field = document.createElement('textarea')
  field.value = props.accountId
  field.readOnly = true
  field.tabIndex = -1
  field.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px'
  copyRegion.value.append(field)
  try {
    field.select()
    field.setSelectionRange(0, field.value.length)
    return document.execCommand('copy')
  } finally {
    field.remove()
    previousFocus?.focus({ preventScroll: true })
    if (selection) {
      selection.removeAllRanges()
      ranges.forEach(range => selection.addRange(range))
    }
  }
}

async function copyId() {
  if (copying) return
  copying = true
  clearTimeout(resetTimer)
  let copied = false
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(props.accountId)
        copied = true
      } catch {
        copied = copyFromSelection()
      }
    } else {
      copied = copyFromSelection()
    }
  } catch {
    copied = false
  } finally {
    copying = false
  }
  copyState.value = copied ? 'copied' : 'failed'
  if (copied) resetTimer = setTimeout(() => { copyState.value = 'idle' }, 2200)
}

onUnmounted(() => clearTimeout(resetTimer))
</script>

<template>
  <div ref="copyRegion" class="account-id-region">
    <button class="account-id" :class="{ 'is-copied': copyState === 'copied' }" type="button" :title="`复制公众号 ID：${accountId}`" @click="copyId">
      <span class="id-label">公众号 ID</span>
      <span class="id-value">{{ accountId }}</span>
      <span class="id-copy-icon" aria-hidden="true"><PhCheck v-if="copyState === 'copied'" :size="17" :weight="'bold'" /><PhCopy v-else :size="17" /></span>
      <span class="visually-hidden">，点击复制</span>
    </button>
    <p class="copy-status" :class="{ 'visually-hidden': copyState !== 'failed' }" role="status" aria-live="polite" aria-atomic="true">{{ copyState === 'copied' ? '公众号 ID 已复制' : copyState === 'failed' ? '复制未完成，请长按或选中 ID 复制' : '' }}</p>
  </div>
</template>
