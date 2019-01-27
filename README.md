# vue-router-preview

![NPM](https://badgen.net/npm/v/vue-router-preview?icon=npm)
![NPM DOWNLOADS](https://badgen.net/npm/dm/vue-router-preview)

## Features

- Preview link content when hovering over the link.
- You don't need to change your code base to make it work.
- Mini-size.

## Install

```sh
yarn add vue-router-preview
```

## Usage

You need to use this plugin after `vue-router`:

```js
import Vue from 'vue'
import Router from 'vue-router'
import RouterPreview from 'vue-router-preview'
import 'vue-router-preview/dist/index.css'

Vue.use(Router)
Vue.use(RouterPreview)
```

Then you can use `<router-link>` without any changes.

You can also register it as a new component instead of overriding `<router-link>`:

```js
Vue.use(RouterPreview, {
  componentName: 'PreviewLink'
})
```

Now you can use it as `<preview-link>` in your app.

## Browser Support

- Evergreen browser.

## API

```js
Vue.use(RouterPreview, options: object)
```

### preview

- Type: `boolean`
- Default: `true`

Whether to preview the hovering route component.

### style

- Type: `object`

Override the preview style.

### delay

- Type: `number` `string`
- Default: `0`
- Unit: `ms`

Delay to fetch and show preview.

## Props

All [props](https://router.vuejs.org/api/#router-link-props) are still available, additional props are listed below.

### preview

Independent prop: preview in current component.

### delay

Independent prop: delay in current component.

## Author

**vue-router-preview** © evillt, release under the [MIT](./LICENSE) License.

Authored and maintained by evillt with help from contributors ([list](https://github.com/evillt/vue-router-preview/contributors)).

> [Homepage](https://evila.me) • GitHub [@evillt](https://github.com/evillt)
