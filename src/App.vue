<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
  html,body{
    padding: 0;
    margin: 0;
  }
  #app {
    font-family: 'Microsoft YaHei','微软雅黑','黑体',"思源黑体",'黑体','Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
