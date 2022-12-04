import { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react'
import ReactMarkdown from 'react-markdown'
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter'
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/230#issuecomment-1133934152
// @ts-ignore
import docco from 'react-syntax-highlighter/dist/cjs/styles/hljs/docco'
import Textarea from 'react-textarea-autosize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

import 'katex/dist/katex.min.css'
import s from "./Editor.module.scss"

interface Props {
  editing: boolean
  content: string[]
  setContent: Dispatch<SetStateAction<string[]>>
}

export default function Editor({ editing, content, setContent }: Props) {

  const handleBlockInput = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setContent(oldContent => {
      const newContent = [...oldContent]
      newContent[index] = e.target.value
      return newContent
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    // @ts-ignore
    if (e.key === "Backspace" && e.target.value === "") {
      removeBlock(index)
      e.preventDefault() // prevents the "onChange" event from executing
    } else if (e.shiftKey && e.key === "Enter") {
      addBlock(index)
      e.preventDefault()
    } else if (e.shiftKey && e.key === "Backspace") {
      removeBlock(index)
      e.preventDefault()
    }
  }

  const removeBlock = (index: number) => {
    setContent(oldContent => {
      const newContent = [...oldContent]
      newContent.splice(index, 1)
      return newContent
    })
  }

  const addBlock = (index: number) => {
    setContent(oldContent => {
      const newContent = [...oldContent]
      newContent.splice(index+1, 0, "")
      return newContent
    })
  }

  return (
    <div className={s.container} style={editing ? {} : { gridTemplateColumns: "1fr", width: "50%", marginInline: "auto" } }>
      { editing &&
        <div className={s.blocks}>
          {content.map((block, index) => (
            // FIXME: using index as key is not recommended, since we are constantly reordering / deleting / adding new blocks in between
            <div key={index} className={s.block}>
              <button onClick={() => addBlock(index)}>+</button>
              <Textarea placeholder={content.length === 1 ? "Type something..." : ""} value={block} onKeyDown={(e) => handleKeyDown(e, index)} onChange={(e) => handleBlockInput(e, index)} />
              <span className={s.lineNum}>{index}</span>
            </div>
          ))}
        </div>
      }

      <div className={s.preview}>
        {content.map((block, index) => (
          // add image captions: https://jeffchen.dev/posts/Markdown-Image-Captions/
          <ReactMarkdown
            children={block}
            key={index}
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={docco}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        ))}
      </div>
    </div>
  )

}
