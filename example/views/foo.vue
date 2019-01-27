<template>
  <div>
    <h1>page - foo</h1>
    <h2>Hi there</h2>
    <router-link to="/">to home</router-link>
    <ul>
      <li v-for="i in 10" :key="i">{{ Math.random() }}</li>
    </ul>
  </div>
</template>
