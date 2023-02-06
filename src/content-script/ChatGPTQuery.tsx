import { useEffect, useState } from 'preact/hooks'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '../messaging'
import ChatGPTFeedback from './ChatGPTFeedback'
import './highlight.scss'
import { promptSettings } from './prompt-configs.js'

interface Props {
  question: string,
  type: string,
  onClickClose: () => void,
}

function ChatGPTQuery(props: Props) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg: any) => {
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error) {
        setError(msg.error)
      } else if (msg.event === 'DONE') {
        setDone(true)

        // Add copy button to code blocks
        document.querySelectorAll<HTMLElement>('#answer pre code').forEach((block) => {
          const button = document.createElement('button')
          button.className = 'chatgpt-copy-button chatgpt-button'
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" style = "padding-top:2px;"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>'
          button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.innerText);
          });
          if (block.parentNode) {
            block.parentNode.appendChild(button);
          }
        });
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question, retry])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  if (answer) {
    const prompt = promptSettings[props.type]
    return (
      <div id="answer" className="markdown-body gpt-inner" dir="auto">
        <div className="gpt-header">
          <p>{prompt.title}</p>
          <ChatGPTFeedback
            messageId={answer.messageId}
            conversationId={answer.conversationId}
            onClickClose={() => { props.onClickClose() }}
          />
        </div>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
      </div>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className="gpt-inner">
        Please login and pass Cloudflare check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer" style={{ color: "#106ba3" }}>
          chat.openai.com
        </a>
        {retry > 0 && (
          <span>
            <br />
            Still not working? Please open an issue on the{' '}
            <a href="https://github.com/LinXueyuanStdio/chatgpt-review-rebuttal-extension" target="_blank" rel="noreferrer">
              GitHub Repository
            </a>. Thanks!
          </span>
        )}
      </p>
    )
  }
  if (error) {
    return (
      <p className="gpt-inner">
        Failed to load response from ChatGPT:
        <br /> {error}
      </p>
    )
  }

  return <p className="gpt-loading gpt-inner">Waiting for ChatGPT response...</p>
}

export default memo(ChatGPTQuery)
