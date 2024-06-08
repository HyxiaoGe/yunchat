class SessionService {
  load() {
    return JSON.parse(localStorage.getItem('sessions')) || []
  }

  save(sessions) {
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

  update(id, sessions) {
    const sessionIndex = sessions.findIndex((session) => session.id === id)
    if (sessionIndex === -1) {
      sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...sessions }
      this.save()
    }
  }

  delete(sessions, sessionId) {
    sessions = sessions.filter((session) => session.id !== sessionId)
    this.save(sessions)
  }

  clear(item) {
    localStorage.removeItem(item)
  }
}

const sessionService = new SessionService()
export default sessionService
