<template>
  <div class="welcome">
    <h1>Welcome to the XiaoHub</h1>
    <p>Select a feature to get started:</p>
    <div class="nav-buttons">
      <router-link to="/chat" class="nav-button">Chat</router-link>
      <router-link to="/draw" class="nav-button">Draw</router-link>
      <router-link to="/video" class="nav-button">Video</router-link>
    </div>
  </div>
</template>

<script setup>
// TheWelcome.vue 无需额外的脚本代码，因为它只用来显示信息和导航链接。
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
}

h1 {
  color: #35495e;
  margin-bottom: 0.5em;
}

p {
  color: #626262;
  margin-bottom: 1em;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.nav-button {
  padding: 0.5em 1em;
  border: 1px solid #ccc;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-button:hover {
  border-color: #42b983;
  color: #42b983;
}
</style>
