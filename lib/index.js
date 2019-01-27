import style from './style.module.css'

function installRouterPreview(Vue, { componentName = 'RouterLink', delay = 0 }= {}) {
  const RouterLink = Vue.component('RouterLink') || Vue.component('router-link')

  // Insert Preview Wrapper
  const PreviewWrapper = document.createElement('div')
  PreviewWrapper.id = 'PreviewWrapper'
  PreviewWrapper.className = style.PreviewWrapper

  const togglePreview = behavior => PreviewWrapper.classList[behavior](style.isActive)

  const addEvent = (el, event, fn) => el.addEventListener(event, fn)
  const removeEvent = (el, event, fn) => el.removeEventListener(event, fn)

  const Link = {
    name: componentName,

    extends: RouterLink,

    props: {
      preview: {
        type: Boolean,
        default() {
          return !(this.$options._componentTag === 'router-link')
        }
      }
    },

    mounted() {
      if (!this.preview) return
      this.$el.style.position = 'relative'
      // this.$el.appendChild(PreviewWrapper)
      addEvent(this.$el, 'mouseenter', this.onMouseEnter)
      addEvent(this.$el, 'mouseleave', this.onMouseLeave)
    },

    beforeDestroy() {
      removeEvent(this.$el, 'mouseenter', this.onMouseEnter)
      removeEvent(this.$el, 'mouseleave', this.onMouseLeave)
    },

    methods: {
      async onMouseEnter() {
        if (this.to === this.$route.path) return
        this.cleanHTML()
        togglePreview('add')

        const [ LinkComponent ] = this.getComponent(this.to)
        let previewComponent

        if (typeof LinkComponent === 'function' && LinkComponent() instanceof Promise) {
          previewComponent = (await LinkComponent()).default
        } else {
          previewComponent = LinkComponent
        }

        const PreviewCtor = Vue.extend(previewComponent)
        const { $el } = new PreviewCtor().$mount()
        this.$el.appendChild(PreviewWrapper)
        PreviewWrapper.appendChild($el)
      },
      onMouseLeave() {
        // togglePreview('remove')
        this.$el.removeChild(PreviewWrapper)
        return
        // no need loop event to remove childs, because it always have single child
        if (PreviewWrapper.hasChildNodes()) {
          // togglePreview('remove')

          PreviewWrapper.removeChild(PreviewWrapper.firstChild)
        }
      },
      cleanHTML() {
        PreviewWrapper.innerHTML = ''
      },
      getComponent() {
        return this.$router.getMatchedComponents(this.to)
      }
    }
  }

  Vue.component(Link.name, Link)
}

export {
  installRouterPreview as install
}

export default installRouterPreview
