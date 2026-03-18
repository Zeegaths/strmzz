'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
    code: string
    language?: string
}

export default function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
    return (
        <div className="bg-[#1e1e1e] rounded-[8px] overflow-hidden">
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#1e1e1e',
                    fontSize: '0.875rem',
                }}
                showLineNumbers={false}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}
