<template>
  <div class="sidebar-container">
    <button class="add-session" @click="addSession">
      <i class="fa-solid fa-plus"></i>
    </button>
    <div class="toggle-icon" @click="toggleSidebar">
      <!-- <i
        class="fa-solid"
        :class="isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'"
      ></i> -->
    </div>
    <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <ul class="session-list">
        <li
          v-for="session in sessions"
          :key="session.id"
          @click="selectSession(session.id)"
          :class="{ active: session.id === activeSessionId }"
        >
          {{ session.name }}
          <span
            v-if="session.id !== 1"
            class="delete-icon"
            @click="deleteSession(session.id, $event)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sessions: {
      type: Array,
      default: () => []
    },
    activeSessionId: Number
  },
  data() {
    return {
      hover: false,
      isCollapsed: false // 默认为展开状态
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    },
    selectSession(sessionId) {
      this.$emit('set-active-session', sessionId)
    },
    addSession() {
      this.$emit('add-new-session')
    },
    deleteSession(sessionId, event) {
      event.stopPropagation()
      if (window.confirm('确定要删除这个会话吗？')) {
        this.$emit('delete-session', sessionId)
      }
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

.active {
  outline: 2px solid #2c3e50; /* 选中项的样式 */
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
  cursor: pointer;
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

/* 设置选中会话的样式 */
.session-list li.active {
  background-color: #34495e; /* 选中项的背景颜色 */
  color: white; /* 选中项的文字颜色 */
  border-left: 4px solid #4caf50;
  padding-left: 16px;
}

.add-session {
  padding: 10px;
  margin-left: 43%;
  background-color: transparent; /* 使按钮透明 */
  border: none;
  cursor: pointer;
  color: #fff; /* 或其他颜色 */
}

.add-session:hover {
  color: #3ce767; /* 鼠标悬停时的颜色 */
}

.delete-icon {
  cursor: pointer;
  margin-left: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 确保图标对齐 */
.session-list li {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 左侧会话名称和右侧删除图标分布在两侧 */
}

.session-list li:hover .delete-icon {
  opacity: 1;
}
</style>
