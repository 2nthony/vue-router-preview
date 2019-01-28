function installRouterPreview(
  Vue,
  {
    componentName = 'RouterLink',
    delay = 0,
    preview = true,
    style = {},
    scale = '0.25'
  } = {}
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

  // Set Preview Wrapper transform
  PreviewWrapper.style.transform = `scale(${scale})`

  // Set Preview Wrapper user style
  Object.keys(style).forEach(k => {
    PreviewWrapper.style[k] = style[k]
  })

  const togglePreview = behavior =>
    PreviewWrapper.classList[behavior]('PreviewWrapper__isActive')

  const offsetPreview = ({ target: el }) => {
    if (
      el.offsetLeft + el.offsetWidth >=
      window.innerWidth - window.innerWidth * scale
    ) {
      PreviewWrapper.classList.add('PreviewWrapper__showInLeft')
    } else {
      PreviewWrapper.classList.remove('PreviewWrapper__showInLeft')
    }
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
      }
    },

    watch: {
      $route() {
        this.removePreview()
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
        offsetPreview(MouseEvent)
        this.cleanPreview()

        showTimer = setTimeout(() => {
          this.apply()
        }, openDelay)
      },
      onMouseLeave() {
        clearTimeout(showTimer)
        this.removePreview()
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

        this.appendPreview($el)
      },
      appendPreview(html) {
        if (!document.body.contains(PreviewWrapper)) {
          document.body.append(PreviewWrapper)
        }

        togglePreview('add')
        PreviewWrapper.append(html)
      },
      removePreview() {
        togglePreview('remove')
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
