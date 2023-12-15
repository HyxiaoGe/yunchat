<script>
export default {
  name: 'Chat',
  data() {
    return {
      message: '',
      messages: [] // 存储用户消息的数组
    }
  },
  methods: {
    sendMessage() {
      const trimmedMessage = this.message.trim()
      if (trimmedMessage) {
        const timestamp = new Date() //  获取当前时间戳
        this.messages.push({
          text: trimmedMessage,
          time: timestamp
        }) // 添加消息到数组
        console.log(`发送消息: ${trimmedMessage} at ${timestamp}`)
        this.message = ''
      }
    },
    formatTime(date) {
      return date.toLocaleTimeString()
    }
  }
}
</script>

<template>
  <div class="chat-container">
    <!-- 打招呼的文本 -->
    <div class="greeting" v-if="!messages.length">你好！有什么可以帮助你的吗？</div>

    <!-- 消息列表的占位符 -->
    <div class="messages">
      <div class="message-container right" v-for="(msg, index) in messages" :key="index">
        <div class="message">{{ msg.text }}</div>
        <div class="timestamp">
          {{ formatTime(msg.time) }}
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-area">
      <textarea
        type="text"
        v-model="message"
        placeholder="请输入文本"
        @keyup.enter.exact="sendMessage"
      ></textarea>
      <button :disabled="!message.trim()" @click="sendMessage" class="send-button">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #121212; /* 背景色与页面背景一致 */
  justify-content: space-between; /* 子元素之间的间隔均匀分布 */
}

.greeting {
  margin: 450px auto 0 auto; /* 上：450px，右：自动，下：0，左：自动 */
  color: #fff;
  font-size: 30px;
}

.input-area {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding-bottom: 20px; /* 底部留出一些空间 */
}

.input-area textarea {
  width: 750px; /* 输入框宽度保持不变 */
  min-height: 50px; /* 最小高度 */
  max-height: 220px; /* 最大高度 */
  margin-right: 10px; /* 输入框与发送按钮的距离 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  resize: none; /* 禁止调整大小 */
  overflow-y: auto; /* 允许垂直滚动 */
}

.input-area button.send-button {
  padding: 10px;
  background-color: transparent; /* 使按钮透明 */
  border: none;
  cursor: pointer;
}

.input-area button:disabled {
  background-color: #ccc; /* 置灰的按钮背景色 */
  cursor: not-allowed; /* 鼠标悬停时显示禁用的标志 */
}

/* Font Awesome 图标的样式 */
.input-area .fa-paper-plane {
  color: #28a745; /* 图标颜色 */
  font-size: 24px; /* 图标大小 */
}

.message-container {
  display: flex;
  flex-direction: column; /* 设置flex方向为列，使得时间戳在消息框下面 */
  align-items: flex-end; /* 保持子元素向右对齐 */
  max-width: calc(750px - 30px); /* 与输入框宽度一致 */
  margin-top: 5px;
  margin-bottom: 5px;
}

.message {
  background-color: #007bff;
  color: white;
  border-radius: 12px;
  padding: 10px 15px;
  max-width: 100%; /* 设置消息框最大宽度为容器宽度 */
  word-wrap: break-word; /* 防止消息过长时溢出 */
}

.timestamp {
  color: #cccccc;
  font-size: 0.75rem;
  text-align: right; /* 时间戳右对齐 */
  padding-right: 15px; /* 与消息文本右侧对齐，根据需要调整 */
  margin-top: 2px; /* 时间戳与消息文本的间距，根据需要调整 */
}

.messages {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 保证消息容器在右侧 */
  overflow-y: auto;
  margin: 0 10px 10px 10px;
  padding-right: 20px;
}

.input-area button.button-disabled {
  background-color: #ccc; /* 置灰的按钮背景色 */
  cursor: not-allowed; /* 鼠标悬停时显示禁用的标志 */
}
</style>
