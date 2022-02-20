// Import React dependencies.
import React, { useState, useCallback, useMemo } from 'react'
// Import the Slate editor factory.
import { withHistory } from 'slate-history'

import {
    Transforms,
    createEditor,
    Text,
    Node,
    Editor,
    Element as SlateElement,
    Descendant,
} from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'


const withLayout = editor => {
    const { normalizeNode } = editor

    editor.normalizeNode = ([node, path]) => {
        
        if (path.length === 0) {
            if (editor.children.length < 1) {
                const title = {
                    type: 'title',
                    children: [{ text: 'Untitled' }],
                }
                Transforms.insertNodes(editor, title, { at: path.concat(0) })
            }

            if (editor.children.length < 2) {
                const paragraph = {
                    type: 'paragraph',
                    children: [{ text: '' }],
                }
                Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
            }

            for (const [child, childPath] of Node.children(editor, path)) {
                const slateIndex = childPath[0]
                const enforceType = type => {
                    if (SlateElement.isElement(child) && child.type !== type) {
                        const newProperties = { type }
                        Transforms.setNodes(editor, newProperties, {
                            at: childPath,
                        })
                    }
                }

                let type = '';
                switch (slateIndex) {
                    case 0:
                        type = 'title'
                        enforceType(type)
                        break
                    case 1:
                        type = 'paragraph'
                        enforceType(type)
                    default:
                        break
                }
            }
        }

        return normalizeNode([node, path])
    }

    return editor
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'title':
            return <h2 {...attributes}>{children}</h2>
        case 'paragraph':
            return <p {...attributes}>{children}</p>
    }
}

const ForcedLayoutExample = () => {
    const editor = useMemo(
        () => withLayout(withHistory(withReact(createEditor()))),
        []
    )

    const renderElement = useCallback(props => <Element {...props} />, [])
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ])

    const [title,setTitle]=useState();

    const getTitle = () => {
       setTitle(editor.children[0].children[0].text);
    }

    return (
        <div>
            <Slate editor={editor} value={value} onChange={value => { setValue(value); getTitle(); }}>
                <Editable
                    renderElement={renderElement}
                    placeholder="Enter a title…"
                    spellCheck
                    autoFocus
                />
            </Slate>
            <button onClick={getTitle}>Get Title</button>
            <div>{title}</div>
        </div>
    )
}

export default ForcedLayoutExample