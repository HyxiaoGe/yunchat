import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // 引入 highlight.js

class MessageFormatter {
  constructor() {
    this.md = new MarkdownIt({
      html: true,
      highlight: function (str, lang) {
        // 代码高亮配置函数
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
          } catch (_) {
            console.error('Highlighting failed:', _)
          }
        }

        // 无法识别的语言或不进行高亮的情况
        return `<pre class="hljs"><code>${MarkdownIt.utils.escapeHtml(str)}</code></pre>`
      }
    })
  }

  renderMarkdown(content) {
    if (this.isCodeBlock(content)) {
      content = this.stripCodeBlockMarkers(content)
    }
    return this.md.render(content)
  }
  isCodeBlock(content) {
    if (typeof content !== 'string') {
      return
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
