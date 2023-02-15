import React, { useCallback, useMemo, useState } from 'react'

// Import the Slate editor factory.
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './components'


// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

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


export default BulletList