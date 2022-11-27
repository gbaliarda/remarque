import { ChangeEvent, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/230#issuecomment-1133934152
import docco from 'react-syntax-highlighter/dist/cjs/styles/hljs/docco'

const INITIAL_CONTENT = [
  "# Probando el titulo de la nota",
  "Un parrafo tranqui con `inline code`",
  "- Un bullet",
  "- Y otro mas",
  "Un poquito de codigo para cerrar",
  '```js\n console.log("Hello world")\n db.find({ id: 1 }) \n ```'
]

export default function Editor() {
  const [content, setContent] = useState(INITIAL_CONTENT)

  const handleBlockInput = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setContent(oldContent => {
      const newContent = [...oldContent]
      newContent[index] = e.target.value
      return newContent
    })
  }

  return (
    <div>
      {/* FIXME: using index as key won't work ok if we reorder / delete / add blocks in the middle of the array */}
      {content.map((block, index) => (
        <textarea key={index} cols={30} rows={10} value={block} onChange={(e) => handleBlockInput(e, index)} />
      ))}

      {content.map((block, index) => (
        <ReactMarkdown
          children={block}
          key={index}
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
  )

}
