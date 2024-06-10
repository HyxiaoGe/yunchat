class Assistant {
  constructor(id, name, messages) {
    this.id = id
    this.name = name
    this.messages = messages
  }
}

const Assistants = {
  smartAssistant: new Assistant(1, '智能助手', [
    {
      role: 'assistant',
      content:
        '[{"type":"text","text":"你好, 我是一个AI智能助手，可以回答一些问题，也可以和用户聊天。"}]'
    }
  ]),
  programmingAssistant: new Assistant(2, '编程助理', [
    {
      role: 'assistant',
      content:
        '[{"type":"text","text":"你好, 我是一个AI编程助理，精通多门语言编程并且熟读计算机网络知识、数据库、算法等领域。"}]'
    }
  ]),
  memeExpert: new Assistant(3, '玩梗高手', [
    {
      role: 'assistant',
      content:
        '[{"type":"text","text":"你好, 我是一个玩梗高手，能为你总结和解释全网新鲜、热门、有趣的流行语和热梗。"}]'
    }
  ]),
  languageAssistant: new Assistant(4, '外语助手', [
    {
      role: 'assistant',
      content:
        '[{"type":"text","text":"你好, 我是一个外语助手，可以帮助提升您的外语水平，并耐心为您讲解遇到的一些问题。"}]'
    }
  ]),
  encyclopedia: new Assistant(5, '百科全书', [
    {
      role: 'assistant',
      content:
        '[{"type":"text","text":"你好, 我是一个百科全书，可以分享一些生活小妙招、冷知识、趣闻等"}]'
    }
  ])
}
export default Assistants
