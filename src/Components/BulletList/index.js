import React, { useCallback, useMemo, useState } from 'react'


// Import the Slate editor factory.
import {Editor, createEditor, Transforms , Element as SlateElement} from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './components'


// Import the Slate components and React plugin.
import { Slate, Editable, useSlate, withReact } from 'slate-react'

const LIST_TYPES = ['numbered-list', 'bulleted-list']

function BulletList() {

  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph1.' }],
    },
  ])

  const renderElement = useCallback(props => <Element {...props} />, [])

  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={value => { setValue(value); }}>
      <Toolbar>
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        placeholder="Enter some plain text..." />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }

  const isBlockActive = (editor, format) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
      })
    )

    return !!match
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

  export default BulletList