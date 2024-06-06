import MarkdownIt from 'markdown-it'

class MessageFormatter {
  constructor() {
    this.md = new MarkdownIt()
  }

  renderMarkdown(content) {
    if (this.isCodeBlock(content)) {
      content = this.stripCodeBlockMarkers(content)
    }
    return this.md.render(content)
  }
  isCodeBlock(content) {
    if (typeof content !== 'string') {
      return false
    }
    return content.trim().startsWith('```')
  }
  stripCodeBlockMarkers(content) {
    // 假设所有代码块都用```包围
    return content.replace(/^```|```$/g, '')
  }
}

const messageFormatter = new MessageFormatter()
export default messageFormatter
