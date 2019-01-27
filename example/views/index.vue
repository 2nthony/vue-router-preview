<template>
  <div>
    <router-link to="/">preview-/</router-link>

    <router-link to="/foo">preview-foo</router-link>
    <router-link to="/foo/hero">preview-foo-hero</router-link>
    <router-link to="/foo/hero1" :delay="1000" preview>404</router-link>

    <router-link to="/foo">preview-foo</router-link>
    <router-link to="/foo/hero">preview-foo-hero</router-link>
    <router-link to="/foo/hero1" preview>404</router-link>

    <router-link to="/foo">preview-foo</router-link>
    <router-link to="/foo/hero">preview-foo-hero</router-link>
    <router-link to="/foo/hero1" preview>404</router-link>
  </div>
</template>
