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
html, body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: "思源黑体", 'Microsoft YaHei', '微软雅黑', '黑体', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 1rem;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
