<template>
  <div class="sidebar-container">
    <div class="toggle-icon" @click="toggleSidebar">
      <i
        class="fa-solid"
        :class="isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'"
      ></i>
    </div>
    <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <ul class="session-list">
        <li v-for="session in sessions" :key="session.id">{{ session.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
      isCollapsed: false, // 默认为展开状态
      sessions: [
        { id: 1, name: '会话 1' },
        { id: 2, name: '会话 2' },
        { id: 3, name: '会话 3' }
        // ...更多会话
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  position: relative; /* 确保子元素的绝对定位以此为参照 */
  background-color: #3b4a5a;
}
.sidebar-container:hover .toggle-icon {
  opacity: 1;
}

.toggle-icon {
  position: absolute; /* 定位到sidebar的左侧 */
  top: 50%; /* 调整到适当位置 */
  left: 500; /* 当sidebar折叠时显示在侧边栏外侧 */
  z-index: 100; /* 确保图标在侧边栏之上 */
  width: 30px; /* 图标区域大小，确保有足够点击区域 */
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white; /* 图标颜色 */
  opacity: 0.2;
  transition: opacity 0.3s;
}
.sidebar.is-collapsed + .toggle-icon {
  left: 0; /* 当sidebar展开时不显示图标 */
}
.sidebar {
  width: 300px;
  background-color: #3b4a5a;
  color: white;
  transition: width 0.3s;
  overflow-x: hidden;
}
.is-collapsed {
  width: 0; /* 收起时宽度为0 */
}
.session-list {
  background-color: #2c3e50;
  list-style: none;
  padding: 0;
}
.session-list li {
  padding: 10px 20px;
  border-bottom: 1px solid #34495e;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}
.session-list li:hover {
  background-color: #34495e; /* 鼠标悬停时的背景色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 添加轮廓阴影效果 */
}
</style>
