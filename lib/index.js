function installRouterPreview(
  Vue,
  { componentName = 'RouterLink', delay = 0, preview = true, style = {} } = {}
) {
  if (Vue.prototype.$isServer) return

  const RouterLink = Vue.component('RouterLink') || Vue.component('router-link')

  if (process.env.NODE_ENV === 'development' && !RouterLink) {
    console.error(
      '[vue-router-preview]: You need to call `Vue.use(VueRouter)` before this plugin!'
    )
  }

  // Insert Preview Wrapper
  const PreviewWrapper = document.createElement('div')
  PreviewWrapper.id = 'PreviewWrapper'
  PreviewWrapper.className = 'PreviewWrapper'

  // Set Preview wrapper style
  Object.keys(style).forEach(k => {
    PreviewWrapper.style[k] = style[k]
  })

  const togglePreview = behavior =>
    PreviewWrapper.classList[behavior]('isActive')

  const addEvent = (el, event, fn) => el.addEventListener(event, fn)
  const removeEvent = (el, event, fn) => el.removeEventListener(event, fn)

  let showTimer

  const Link = {
    name: componentName,

    extends: RouterLink,

    props: {
      preview: {
        type: Boolean,
        default: preview
      },
      delay: {
        type: [Number, String],
        default: delay
      }
    },

    mounted() {
      if (!this.preview) return
      addEvent(this.$el, 'mouseenter', this.onMouseEnter)
      addEvent(this.$el, 'mouseleave', this.onMouseLeave)
    },

    beforeDestroy() {
      removeEvent(this.$el, 'mouseenter', this.onMouseEnter)
      removeEvent(this.$el, 'mouseleave', this.onMouseLeave)
    },

    methods: {
      onMouseEnter() {
        if (this.to === this.$route.path) return
        const openDelay = Number(this.delay || delay)

        togglePreview('add')
        this.cleanPreview()
        clearTimeout(showTimer)

        showTimer = setTimeout(() => {
          this.apply()
        }, openDelay)
      },
      onMouseLeave() {
        clearTimeout(showTimer)
        this.removePreviewWrapper()
      },
      apply() {
        const Component = this.getComponent()

        // eslint-disable-next-line new-cap
        if (typeof Component === 'function' && Component() instanceof Promise) {
          // eslint-disable-next-line new-cap
          Component().then(m => this.appendComponent(m.default))
          return
        }

        this.appendComponent(Component)
      },
      appendComponent(Component) {
        const PreviewCtor = Vue.extend(Component)
        const { $el } = new PreviewCtor({
          router: this.$router
        }).$mount()

        this.appendPreviewWrapper($el)
      },
      appendPreviewWrapper(html) {
        PreviewWrapper.title = this.to
        PreviewWrapper.append(html)
        this.$el.append(PreviewWrapper)
      },
      removePreviewWrapper() {
        if (this.$el.contains(PreviewWrapper)) {
          this.$el.removeChild(PreviewWrapper)
        }
      },
      cleanPreview() {
        PreviewWrapper.innerHTML = ''
      },
      getComponent() {
        const [routeComponent] = this.$router.getMatchedComponents(this.to)
        return routeComponent
      }
    }
  }

  Vue.component(Link.name, Link)
}

export { installRouterPreview as install }

export default installRouterPreview
