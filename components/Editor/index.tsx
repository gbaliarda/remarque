import { ChangeEvent, useState } from 'react'
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

const INITIAL_CONTENT = [
  "# Probando el titulo de la nota",
  "Un parrafo tranqui con `inline code`",
  "- Un bullet",
  "- Y otro mas",
  "Un poquito de codigo para cerrar",
  '```typescript\nconsole.log("Hello world")\ndb.find({ id: 1 })\nconst printName = (name: string) => {} \n ```',
  "![Redis](https://1000marcas.net/wp-content/uploads/2021/06/Redis-Logo.png)",
  "The lift coefficient ($C_L$) is a dimensionless coefficient.",
  "$$\nL = \\frac{1}{2} \\rho v^2 S C_L\n$$",
  `A paragraph with *emphasis* and **strong importance**.\n> A block quote with ~strikethrough~ and a URL: https://reactjs.org.\n
  * Tareas
  * [ ] todo
  * [x] done\n
  | Command | Description |
  | ---------- | ------------ |
  | git status | List all new or modified files |
  | git diff   | Show file differences that haven't been staged |
  `,
  "[React Website](https://reactjs.org/)"
]

export default function Editor() {
  const [content, setContent] = useState(INITIAL_CONTENT)

  // TODO: "enter" deberia crear un nuevo bloque, que en markdown es con doble enter, por lo que habria que sumar un \n manualmente
  // podriamos hacer que "shift+enter" inserte dos espacios y un \n, que es un linebreak normal en markdown
  const handleBlockInput = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setContent(oldContent => {
      const newContent = [...oldContent]
      newContent[index] = e.target.value
      return newContent
    })
  }

  return (
    <div className={s.container}>
      {/* FIXME: using index as key won't work ok if we reorder / delete / add blocks in the middle of the array */}
      <div className={s.blocks}>
        {content.map((block, index) => (
          <div key={index} className={s.block}>
            <button>+</button>
            <Textarea value={block} onChange={(e) => handleBlockInput(e, index)} />
            <span className={s.lineNum}>{index}</span>
          </div>
        ))}
      </div>

      <div className={s.preview}>
        {content.map((block, index) => (
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
