<script>
import MarkdownIt from 'markdown-it'
import SidebarView from './SidebarView.vue'
import WebSocketService from '@/services/WebSocketService'

export default {
  components: {
    SidebarView
  },
  name: 'ChatView',
  data() {
    return {
      userMessage: '',
      conversation: [], // 存储用户消息的数组
      currentAssistantMessage: '',
      verificationKey: '',
      reconnectAttempts: 0,
      reconnectInterval: null,
      showScrollButton: false,
      isVerified: false,
      sessions: [{ id: 1, name: '默认会话', messages: [] }],
      activeSessionId: 1,
      nextSessionId: 2,
      md: new MarkdownIt()
    }
  },
  created() {
    WebSocketService.initializeWebSocket('ws://localhost:8808/ws')
    WebSocketService.registerMessageHandler(this.handleWebSocketMessage)
    this.isVerified = localStorage.getItem('isVerified') === 'true'
    this.loadActiveSession()
    this.loadSessionsFromLocalStorage()
    this.scrollToBottom()
  },
  methods: {
    saveSessionsToLocalStorage() {
      localStorage.setItem('sessions', JSON.stringify(this.sessions))
    },
    loadSessionsFromLocalStorage() {
      const savedSessions = localStorage.getItem('sessions')
      if (savedSessions) {
        this.sessions = JSON.parse(savedSessions)
      }
      this.loadActiveSessionMessages()
    },
    onScroll() {
      const messagesContainer = this.$refs.messagesContainer
      const nearBottom =
        messagesContainer.scrollHeight -
          messagesContainer.scrollTop -
          messagesContainer.clientHeight <
        10
      this.showScrollButton = !nearBottom
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer
        messagesContainer.scrollTop = messagesContainer.scrollHeight
        this.onScroll()
      })
    },
    sendMessage() {
      if (!this.isVerified) {
        alert('请先验证密钥！')
        return
      }
      const trimmedMessage = this.userMessage.trim()
      if (trimmedMessage && WebSocketService.getReadyState()) {
        const activeSession = this.sessions.find((session) => session.id === this.activeSessionId)
        if (
          activeSession &&
          activeSession.name.startsWith('新会话') &&
          activeSession.messages.length === 0
        ) {
          activeSession.name = trimmedMessage.substring(0, 20)
        }

        // 保存用户发送的消息
        this.conversation.push({
          content: trimmedMessage,
          time: new Date(),
          role: 'user',
          done: true // 标记为完成
        })
        //  发送消息到服务器，对话上下文只支持最近5次对话
        const message = {
          action: 'session',
          conversation: this.conversation.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content
          }))
        }
        WebSocketService.sendMessage(JSON.stringify(message))
        this.userMessage = ''
        this.scrollToBottom()
        this.saveSessionsToLocalStorage()
      }
    },
    loadActiveSession() {
      const activeSessionId = localStorage.getItem('activeSessionId')
      if (activeSessionId !== null) {
        this.activeSessionId = activeSessionId ? parseInt(activeSessionId, 10) : this.sessions[0].id
      }
    },
    setActiveSession(sessionId) {
      // 保存当前会话的消息到sessions
      const currentSession = this.sessions.find((session) => session.id === this.activeSessionId)
      if (currentSession) {
        currentSession.messages = [...this.conversation]
      }

      // 更新活动会话ID
      this.activeSessionId = sessionId
      localStorage.setItem('activeSessionId', sessionId.toString())

      // 加载新会话的消息
      const newActiveSession = this.sessions.find((session) => session.id === sessionId)
      if (newActiveSession) {
        this.conversation = [...newActiveSession.messages]
      } else {
        this.conversation = []
      }

      this.saveSessionsToLocalStorage()
    },

    saveCurrentSessionMessages() {
      // 找到当前活动会话，并保存消息
      const currentSession = this.sessions.find((session) => session.id === this.activeSessionId)
      if (currentSession) {
        currentSession.messages = [...this.conversation]
      }
    },
    addNewSession() {
      // 直接创建一个新会话，不需要复制当前对话内容
      const newSession = {
        id: this.nextSessionId,
        name: `新会话`,
        messages: []
      }
      this.nextSessionId++
      this.sessions.push(newSession)
      this.saveSessionsToLocalStorage()
    },
    loadActiveSessionMessages() {
      const activeSession = this.sessions.find((session) => session.id === this.activeSessionId)
      if (activeSession) {
        this.conversation = [...activeSession.messages]
      } else {
        this.conversation = []
      }
    },
    deleteSession(sessionId) {
      if (sessionId === this.activeSessionId) {
        this.setActiveSession(1)
      }
      this.sessions = this.sessions.filter((session) => session.id !== sessionId)
      this.saveSessionsToLocalStorage()
    },
    clearConversation() {
      if (confirm('确定要清空聊天记录吗？')) {
        this.conversation = [] // 清空聊天数组
        localStorage.removeItem('conversation') // 如果你使用localStorage存储聊天记录的话
      }
    },
    renderMarkdown(content) {
      if (this.isCodeBlock(content)) {
        content = content.substring(3, content.length - 3)
      }
      return this.md.render(content)
    },
    isCodeBlock(content) {
      if (typeof content !== 'string') {
        return false
      }
      return content.trim().startsWith('```')
    },
    handleWebSocketMessage(data) {
      if (data === 'success') {
        localStorage.setItem('isVerified', 'true')
        this.isVerified = true
      } else if (data === 'failure') {
        alert('密钥错误，请重新输入！！！')
        this.verificationKey = ''
      } else {
        if (data === '[DONE]') {
          // 重置累积的消息
          console.log('session: ', this.sessions)
          const activeSession = this.sessions.find((session) => session.id === this.activeSessionId)
          if (activeSession) {
            activeSession.messages = [...this.conversation]
            this.saveSessionsToLocalStorage()
          }
          this.currentAssistantMessage = ''
          return
        } else {
          // 实时更新累积的消息
          this.currentAssistantMessage += data
          // 然后更新到对话中以实时渲染
          // 检查对话数组中最后一条消息是否属于助手且未完成
          if (
            this.conversation.length > 0 &&
            this.conversation[this.conversation.length - 1].role === 'assistant' &&
            !this.conversation[this.conversation.length - 1].done
          ) {
            // 更新最后一条消息的文本
            this.conversation[this.conversation.length - 1].content = this.currentAssistantMessage
          } else {
            // 否则，添加一个新的消息条目
            this.conversation.push({
              content: this.currentAssistantMessage,
              role: 'assistant',
              done: false
            })
          }
        }
        // 由于数组中对象的属性发生了变化，确保更新视图
        this.conversation = [...this.conversation]
        this.scrollToBottom()
      }
    },

    verifyKey() {
      if (this.verificationKey === '') {
        alert('密钥不能为空！！！')
        return
      }
      const message = {
        action: 'verify',
        secretKey: this.verificationKey
      }
      WebSocketService.sendMessage(JSON.stringify(message))
    },
    formatTime(date) {
      if (!(date instanceof Date)) {
        date = new Date(date)
      }
      //  格式化时间戳
      return date.toLocaleTimeString()
    }
  },
  mounted() {
    const messagesContainer = this.$refs.messagesContainer
    messagesContainer.addEventListener('scroll', this.onScroll)
    this.scrollToBottom()
  },
  beforeUnmount() {
    const messagesContainer = this.$refs.messagesContainer
    messagesContainer.removeEventListener('scroll', this.onScroll)
    WebSocketService.unregisterMessageHandler(this.handleWebSocketMessage)
    //  组件被销毁前关闭 WebSocket 连接
    WebSocketService.closeWebSocket()
  }
}
</script>

<template>
  <div class="chat-page">
    <SidebarView
      :sessions="sessions"
      :active-session-id="activeSessionId"
      @set-active-session="setActiveSession"
      @add-new-session="addNewSession"
      @delete-session="deleteSession"
    />
    <div class="chat-container">
      <!-- 打招呼的文本 -->
      <div class="greeting" v-if="!conversation.length && isVerified">
        您好！有什么可以帮助你的吗？
      </div>

      <!-- 验证输入框 -->
      <div v-if="!isVerified" class="verification-area">
        <input v-model="verificationKey" placeholder="请输入密钥进行验证" />
        <button @click="verifyKey">验证</button>
      </div>
      <div class="messages" ref="messagesContainer">
        <!-- 渲染整个对话 -->
        <div v-for="(msg, index) in conversation" :key="index" :class="['message', msg.role]">
          <i
            :class="['icon', msg.role === 'user' ? 'fa-solid fa-user-tie' : 'fa-solid fa-robot']"
          ></i>
          <!-- 代码区-->
          <div
            v-if="isCodeBlock(msg.content)"
            class="code-block"
            v-html="renderMarkdown(msg.content)"
          ></div>
          <!-- 文本区 -->
          <div v-else class="text" v-html="renderMarkdown(msg.content)"></div>
          <div class="timestamp" v-if="msg.role === 'user'">{{ formatTime(msg.time) }}</div>
        </div>
        <button v-show="showScrollButton" @click="scrollToBottom" class="scroll-to-bottom">
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
      <div v-if="isVerified">
        <!-- 输入区 -->
        <div class="input-area">
          <textarea
            type="text"
            v-model="userMessage"
            placeholder="请输入文本"
            @keyup.enter.exact="sendMessage"
          ></textarea>
          <button :disabled="!userMessage.trim()" @click="sendMessage" class="send-button">
            <i class="fas fa-paper-plane"></i>
          </button>
          <!-- 清空聊天按钮 -->
          <button @click="clearConversation" class="clear-conversation">
            <i class="fas fa-eraser"></i> 清空对话
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
}
.chat-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 80%;
  height: 100vh;
  background: #121212;
  justify-content: space-between;
  position: relative;
}

.greeting {
  margin: 450px auto 0 auto; /* 上：450px，右：自动，下：0，左：自动 */
  color: #fff;
  font-size: 30px;
}

.messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin: 0 10px;
}

.message {
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 10px;
  border-radius: 12px;
  color: white;
  word-wrap: break-word;
  position: relative;
  background: #f9f9f9;
}

.code-block {
  background: #282c34; /* 暗色背景，代码消息 */
  color: #abb2bf; /* 浅灰色文本，代码消息 */
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0; /* 上下边距 */
  font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  overflow-x: auto; /* 如果代码很长，需要滚动 */
}

.fa-user {
  margin-right: auto;
  font-size: 2em; /* 调整图标大小 */
}

.fa-robot {
  font-size: 2em; /* 调整图标大小 */
}

.assistant {
  max-width: 50%;
  justify-content: flex-start;
  align-self: flex-start;
  background-color: #007bff;
}

.user {
  max-width: 50%;
  justify-content: flex-end;
  align-self: flex-end;
  background-color: #28a745;
}

.assistant .icon,
.user .icon {
  order: -1;
  margin-right: 10px;
  font-size: 1.2em;
  align-self: flex-start;
}

.timestamp {
  position: absolute;
  bottom: -20px;
  right: 0;
  color: #cccccc;
  font-size: 0.75rem;
  text-align: right; /* 时间戳右对齐 */
  padding-right: 15px; /* 与消息文本右侧对齐，根据需要调整 */
  margin-top: 2px; /* 时间戳与消息文本的间距，根据需要调整 */
}

.input-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}

.input-area textarea {
  width: 750px;
  min-height: 50px;
  max-height: 220px;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  resize: none;
  overflow-y: auto;
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

.input-area button.clear-conversation {
  padding: 10px;
  background-color: transparent; /* 使按钮透明 */
  border: none;
  cursor: pointer;
  color: #fff; /* 或其他颜色 */
}

.input-area button.clear-conversation:hover {
  color: #e74c3c; /* 鼠标悬停时的颜色 */
}

.input-area .fa-paper-plane {
  color: #28a745; /* 图标颜色 */
  font-size: 24px; /* 图标大小 */
}

.input-area button.button-disabled {
  background-color: #ccc; /* 置灰的按钮背景色 */
  cursor: not-allowed; /* 鼠标悬停时显示禁用的标志 */
}

.scroll-to-bottom {
  position: fixed;
  right: 2em; /* 距离右侧2em */
  bottom: 2em; /* 距离底部2em */
  background-color: #28a745; /* 按钮背景颜色 */
  color: white; /* 图标颜色 */
  border: none; /* 无边框 */
  border-radius: 50%; /* 圆形按钮 */
  padding: 0.5em; /* 内边距 */
  cursor: pointer; /* 鼠标样式 */
  display: flex; /* 使用flex布局，方便居中图标 */
  justify-content: center; /* 水平居中图标 */
  align-items: center; /* 垂直居中图标 */
  z-index: 100; /* 确保按钮位于消息列表上方 */
}

.scroll-to-bottom i {
  font-size: 1.5em; /* 图标大小 */
}

.verification-area {
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(0%, 1250%);
  margin-bottom: 20px; /* 与消息区域的间距 */
}

.verification-area input {
  width: 20%; /* 输入框宽度 */
  margin-right: 10px; /* 输入框和按钮之间的间距 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}

.verification-area button {
  padding: 10px 15px;
  border-radius: 4px;
  background-color: #28a745; /* 按钮背景颜色 */
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 添加过渡效果 */
}

.verification-area button:hover {
  background-color: #1f7a2d; /* 鼠标悬停时的背景色 */
}
</style>
