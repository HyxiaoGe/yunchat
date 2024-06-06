class WebSocketService {
  constructor() {
    this.websocket = null
    this.reconnectInterval = null
    this.reconnectAttempts = 0
    this.messageHandlers = new Set()
  }

  initializeWebSocket(url) {
    this.websocket = new WebSocket(url)
    this.websocket.onmessage = (event) => {
      this.notifyMessageHandlers(event.data)
    }
    this.websocket.onopen = this.handleWebSocketOpen.bind(this)
    this.websocket.onerror = this.handleWebSocketError.bind(this)
    this.websocket.onclose = this.handleWebSocketClose.bind(this)
  }

  registerMessageHandler(handler) {
    this.messageHandlers.add(handler)
  }

  unregisterMessageHandler(handler) {
    this.messageHandlers.delete(handler)
  }

  notifyMessageHandlers(data) {
    this.messageHandlers.forEach((handler) => handler(data))
  }

  handleWebSocketOpen() {
    console.log('Connected to the WebSocket server')
    this.reconnectAttempts = 0
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval)
      this.reconnectInterval = null
    }
  }

  handleWebSocketError(error) {
    console.error('WebSocket Error:', error)
  }

  handleWebSocketClose(event) {
    console.log('WebSocket is closed now:', event)
    if (!this.reconnectInterval) {
      this.reconnectWebSocket()
    }
  }

  reconnectWebSocket() {
    const MAX_RECONNECT_ATTEMPTS = 10
    const RECONNECT_INTERVAL_BASE = 1000
    const RECONNECT_INTERVAL_MAX = 30000

    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      let reconnectDelay = Math.min(
        RECONNECT_INTERVAL_BASE * Math.pow(2, this.reconnectAttempts),
        RECONNECT_INTERVAL_MAX
      )
      setTimeout(() => {
        console.log(`Attempting to reconnect... (Attempt: ${this.reconnectAttempts + 1})`)
        this.initializeWebSocket()
      }, reconnectDelay)
      this.reconnectAttempts++
    } else {
      console.error('Max WebSocket reconnect attempts reached.')
    }
  }

  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message)
    } else {
      console.error('WebSocket is not open. Message not sent:', message)
    }
  }
  closeWebSocket() {
    if (this.websocket) {
      this.websocket.close()
    }
  }

  getReadyState() {
    return this.websocket ? this.websocket.readyState : WebSocket.CLOSED
  }
}

const webSocketService = new WebSocketService()
export default webSocketService
