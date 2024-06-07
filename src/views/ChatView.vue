<script>
import SidebarView from './SidebarView.vue'
import WebSocketService from '@/services/WebSocketService'
import SessionService from '@/services/SessionService'
import MessageFormatter from '@/services/MessageFormatter'

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
      showScrollButton: false,
      isVerified: false,
      sessions: [{ id: 1, name: '默认会话', messages: [] }],
      activeSessionId: 1,
      nextSessionId: 2
    }
  },
  created() {
    WebSocketService.initializeWebSocket('ws://localhost:8808/ws')
    WebSocketService.registerMessageHandler(this.handleWebSocketMessage)
    this.isVerified = SessionService.get('isVerified') === 'true'
    this.loadActiveSession()
    this.loadSessionsFromLocalStorage()
    this.scrollToBottom()
  },
  methods: {
    loadSessionsFromLocalStorage() {
      const savedSessions = SessionService.get('sessions')
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
    renderMarkdown(content) {
      return MessageFormatter.renderMarkdown(content)
    },
    isCodeBlock(content) {
      return MessageFormatter.isCodeBlock(content)
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
        SessionService.save(this.sessions)
      }
    },
    loadActiveSession() {
      const activeSessionId = SessionService.get('activeSessionId')
      if (activeSessionId !== null) {
        this.activeSessionId = activeSessionId ? parseInt(activeSessionId, 10) : this.sessions[0].id
      }
    },
    setActiveSession(sessionId) {
      // 保存当前会话的消息到sessions
      const currentSession = SessionService.findSessionById(this.sessions, this.activeSessionId)
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

      SessionService.save(this.sessions)
    },
    saveCurrentSessionMessages() {
      // 找到当前活动会话，并保存消息
      const currentSession = SessionService.findSessionById(this.sessions, this.activeSessionId)
      if (currentSession) {
        currentSession.messages = [...this.conversation]
      }
    },
    addNewSession() {
      // 直接创建一个新会话，不需要复制当前对话内容
      const newSession = SessionService.create(this.nextSessionId++)
      this.sessions.push(newSession)
      SessionService.save(this.sessions)
    },
    loadActiveSessionMessages() {
      const activeSession = SessionService.findSessionById(this.sessions, this.activeSessionId)
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
      SessionService.save(this.sessions)
    },
    clearConversation() {
      if (confirm('确定要清空聊天记录吗？')) {
        this.conversation = [] // 清空聊天数组
        SessionService.clear('conversation')
      }
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
          const activeSession = this.sessions.find((session) => session.id === this.activeSessionId)
          if (activeSession) {
            activeSession.messages = [...this.conversation]
            SessionService.save(this.sessions)
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
      <div class="greeting" v-if="!conversation.length && isVerified">
        您好！有什么可以帮助你的吗？
      </div>
      <div v-if="!isVerified" class="verification-area">
        <input v-model="verificationKey" placeholder="请输入密钥进行验证" />
        <button @click="verifyKey">验证</button>
      </div>
      <div class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in conversation" :key="index" :class="['message', msg.role]">
          <i
            :class="['icon', msg.role === 'user' ? 'fa-solid fa-user-tie' : 'fa-solid fa-robot']"
          ></i>
          <div
            v-if="isCodeBlock(msg.content)"
            class="code-block"
            v-html="renderMarkdown(msg.content)"
          ></div>
          <div v-else class="text" v-html="renderMarkdown(msg.content)"></div>
          <div class="timestamp" v-if="msg.role === 'user'">{{ formatTime(msg.time) }}</div>
        </div>
        <button v-show="showScrollButton" @click="scrollToBottom" class="scroll-to-bottom">
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
      <div v-if="isVerified">
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
          <button @click="clearConversation" class="clear-conversation">
            <i class="fas fa-eraser"></i> 清空对话
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/chat.css"></style>
