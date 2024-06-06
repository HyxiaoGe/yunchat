class SessionService {
  constructor() {
    this.sessions = [{ id: 1, name: '默认会话', messages: [] }]
  }

  load() {
    return JSON.parse(localStorage.getItem('sessions')) || []
  }

  save(sessions) {
    console.log('sessions', sessions)
    localStorage.setItem('sessions', JSON.stringify(sessions))
  }

  get(item) {
    return localStorage.getItem(item)
  }

  findSessionById(sessions, id) {
    return sessions.find((session) => session.id === id)
  }

  create(sessionId) {
    const newSession = {
      id: sessionId,
      name: `新会话`,
      messages: []
    }
    return newSession
  }

  update(id, session) {
    const sessionIndex = this.sessions.findIndex((session) => session.id === id)
    if (sessionIndex === -1) {
      this.sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...session }
      this.save()
    }
  }

  delete(sessionId) {
    this.sessions = this.sessions.filter((session) => session.id !== sessionId)
    this.save()
  }

  clear(item) {
    localStorage.removeItem(item)
  }
}

const sessionService = new SessionService()
export default sessionService
