<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { PhCornersOut, PhX } from '@phosphor-icons/vue'
import { gsap } from 'gsap'
import { site } from '../site.config.js'
import AccountId from './components/AccountId.vue'

const qrDialog = ref(null)
const pageRoot = ref(null)
const qrFrame = ref(null)
const copyrightYear = ref(__BUILD_YEAR__)
const descriptionBreak = site.description.indexOf('，') + 1
let media
let dialogMotion

onMounted(() => {
  copyrightYear.value = new Date().getFullYear()

  media = gsap.matchMedia()
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    hover: '(hover: hover) and (pointer: fine)',
  }, (context) => {
    if (!context.conditions.motion) return

    const clearProps = 'transform,opacity,visibility'
    gsap.timeline({ defaults: { duration: 0.55, ease: 'power3.out', clearProps } })
      .from('.follow-content', { autoAlpha: 0, y: 18, scale: 0.985, duration: 0.68 }, 0)
      .from('.account-logo', { autoAlpha: 0, y: 8 }, 0.06)
      .from('.account-name, .account-description', { autoAlpha: 0, y: 9, stagger: 0.06 }, 0.12)
      .from('.qr-section', { autoAlpha: 0, y: 10 }, 0.2)
      .from('.site-header, .site-footer', { autoAlpha: 0, duration: 0.4 }, 0.08)

    dialogMotion = gsap.fromTo(qrDialog.value,
      { autoAlpha: 0, y: 8, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: 'power3.out', paused: true, immediateRender: false },
    )

    let enter
    let leave
    const frame = qrFrame.value
    if (context.conditions.hover) {
      const hoverMotion = gsap.to(frame, { y: -3, scale: 1.012, duration: 0.28, ease: 'power2.out', paused: true })
      enter = () => hoverMotion.play()
      leave = () => hoverMotion.reverse()
      frame.addEventListener('pointerenter', enter)
      frame.addEventListener('pointerleave', leave)
    }

    return () => {
      if (enter) frame.removeEventListener('pointerenter', enter)
      if (leave) frame.removeEventListener('pointerleave', leave)
      dialogMotion = undefined
    }
  }, pageRoot.value)
})

onUnmounted(() => media?.revert())

function openQr() {
  if (!qrDialog.value.open) qrDialog.value.showModal()
  if (dialogMotion) {
    dialogMotion.eventCallback('onReverseComplete', null)
    dialogMotion.play()
  }
}

function closeQr() {
  if (!dialogMotion || dialogMotion.progress() === 0) {
    dialogMotion?.pause(0)
    qrDialog.value.close()
    return
  }
  dialogMotion.eventCallback('onReverseComplete', () => qrDialog.value?.close())
  dialogMotion.reverse()
}

function closeFromBackdrop(event) {
  if (event.target !== qrDialog.value) return
  const bounds = qrDialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    closeQr()
  }
}
</script>

<template>
  <div ref="pageRoot" class="site-shell" data-page="ciktab">
    <div class="page-background" aria-hidden="true"><div class="background-flow background-flow-blue"></div><div class="background-flow background-flow-cool"></div></div>
    <a class="skip-link" href="#main">跳转到主要内容</a>

    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="CikTab 首页">
          <span class="brand-mark" aria-hidden="true"><img :src="site.logoMark" alt="" width="36" height="36" /></span>
          <span>CikTab</span>
        </a>
        <span class="header-label"><img class="wechat-icon" src="/img/wechat.svg" alt="" width="19" height="19" /> 微信公众号</span>
      </div>
    </header>

    <main id="main" class="main-content">
      <section class="follow-content" aria-labelledby="account-title">
        <div class="account-intro">
          <div class="account-heading">
            <span class="account-logo" aria-hidden="true"><img :src="site.logoMark" alt="" width="80" height="80" /></span>
            <div class="account-name"><h1 id="account-title">{{ site.name }}<span aria-hidden="true">.</span></h1></div>
          </div>
          <p class="account-description"><span>{{ site.description.slice(0, descriptionBreak) }}</span><span>{{ site.description.slice(descriptionBreak) }}</span></p>
        </div>

        <div class="qr-section">
          <button ref="qrFrame" class="qr-frame" type="button" @click="openQr" aria-label="放大 CikTab 微信公众号二维码" aria-haspopup="dialog">
            <img :src="site.qrImage" class="qr-image" alt="CikTab 微信公众号二维码，使用微信扫一扫即可关注" width="258" height="258" fetchpriority="high" />
            <span class="qr-expand" aria-hidden="true"><PhCornersOut :size="16" /></span>
          </button>
          <p class="scan-caption">微信扫一扫，关注 CikTab</p>
          <AccountId :account-id="site.accountId" />
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-line">
        <p class="copyright">© {{ copyrightYear }} {{ site.name }}. All rights reserved.</p>
        <span class="filing-divider copyright-divider" aria-hidden="true"></span>
        <div class="filing-links">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">{{ site.icp }}</a>
          <span class="filing-divider" aria-hidden="true"></span>
          <a :href="`https://beian.mps.gov.cn/#/query/webSearch?code=${site.policeCode}`" target="_blank" rel="noopener noreferrer"><img class="police-icon" src="/img/beian.png" alt="" width="14" height="16" />{{ site.police }}</a>
        </div>
      </div>
    </footer>

    <dialog ref="qrDialog" class="qr-dialog" aria-labelledby="qr-dialog-title" @click="closeFromBackdrop" @cancel.prevent="closeQr">
      <button class="dialog-close" type="button" aria-label="关闭二维码" @click="closeQr"><PhX :size="20" aria-hidden="true" /></button>
      <div class="dialog-account"><img :src="site.logoMark" alt="" width="32" height="32" /><h2 id="qr-dialog-title">{{ site.name }}</h2></div>
      <img :src="site.qrImage" alt="CikTab 微信公众号二维码，使用微信扫码关注" width="258" height="258" />
      <p class="scan-caption">微信扫一扫，或长按图片识别</p>
      <AccountId :account-id="site.accountId" />
    </dialog>
  </div>
</template>
