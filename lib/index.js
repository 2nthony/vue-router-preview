function installRouterPreview(
  Vue,
  {
    componentName = 'RouterLink',
    style = {},
    preview = true,
    delay = 0,
    scale = '0.25',
    safetyOffset = 20,
    store = true
  } = {}
) {
  if (Vue.prototype.$isServer) return

  const RouterLink = Vue.component('RouterLink') || Vue.component('router-link')

  if (process.env.NODE_ENV === 'development' && !RouterLink) {
    console.error(
      '[vue-router-preview]: You need to call `Vue.use(VueRouter)` before this plugin!'
    )
  }

  /**
   * Create Preview Wrapper
   */
  const PreviewWrapper = document.createElement('div')
  PreviewWrapper.id = 'PreviewWrapper'
  PreviewWrapper.className = 'PreviewWrapper'

  /**
   * Set Preview Wrapper default transform-scale
   */
  PreviewWrapper.style.transform = `scale(${scale})`

  /**
   * Set Preview Wrapper user style
   */
  Object.keys(style).forEach(k => {
    PreviewWrapper.style[k] = style[k]
  })

  /**
   * Handle Preview Wrapper DOM
   */
  const appendPreview = html => {
    if (!document.body.contains(PreviewWrapper)) {
      document.body.append(PreviewWrapper)
    }

    togglePreview('add')
    PreviewWrapper.append(html)
  }

  const removePreview = () => {
    togglePreview('remove')
  }

  const togglePreview = behavior => {
    PreviewWrapper.classList[behavior]('PreviewWrapper__isActive')
  }

  const offsetPreview = ({ target: el }, _scale, _safetyOffset) => {
    if (
      el.offsetLeft + el.offsetWidth + _safetyOffset >=
        window.innerWidth - window.innerWidth * _scale &&
      el.offsetTop + el.offsetHeight - _safetyOffset <
        el.offsetHeight + window.innerHeight * _scale
    ) {
      PreviewWrapper.classList.add('PreviewWrapper__showInLeft')
      return
    }

    PreviewWrapper.classList.remove('PreviewWrapper__showInLeft')
  }

  const cleanPreview = () => {
    PreviewWrapper.innerHTML = ''
  }

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
      },
      scale: {
        type: String,
        default: scale
      },
      safetyOffset: {
        type: Number,
        default: safetyOffset
      },
      store: {
        type: Boolean,
        default: store
      }
    },

    watch: {
      $route() {
        clearTimeout(showTimer)
        removePreview()
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
      onMouseEnter(MouseEvent) {
        if (this.to === this.$route.path) return
        const openDelay = Number(this.delay || delay)

        clearTimeout(showTimer)
        offsetPreview(MouseEvent, this.scale, this.safetyOffset)
        cleanPreview()

        showTimer = setTimeout(() => {
          this.apply()
        }, openDelay)
      },
      onMouseLeave() {
        clearTimeout(showTimer)
        removePreview()
      },
      apply() {
        const Component = this.getComponent()

        // eslint-disable-next-line new-cap
        if (typeof Component === 'function' && Component() instanceof Promise) {
          // eslint-disable-next-line new-cap
          Component().then(m => this.appendComponent(m.default || m))
          return
        }

        this.appendComponent(Component)
      },
      appendComponent(Component) {
        const PreviewCtor = Vue.extend(Component)
        const { $el } = new PreviewCtor({
          router: this.$router
        }).$mount()

        appendPreview($el)
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
