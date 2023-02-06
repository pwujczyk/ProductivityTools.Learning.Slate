import React, { useMemo, useState } from 'react'

// Import the Slate editor factory.
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'


// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

function BulletList() {

    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value}  onChange={value => { setValue(value); }}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

export default BulletList