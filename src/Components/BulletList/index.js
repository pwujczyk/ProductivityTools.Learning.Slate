import React, { useCallback, useMemo, useState } from 'react'


// Import the Slate editor factory.
import {Editor, createEditor, Transforms , Element as SlateElement} from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './components'


// Import the Slate components and React plugin.
import { Slate, Editable, useSlate, withReact } from 'slate-react'
import { ListType, withLists,withListsReact,onKeyDown } from '@prezly/slate-lists';


const LIST_TYPES = ['numbered-list', 'bulleted-list']


function BulletList() {

  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph1.' }],
    },
  ])

  const renderElement = useCallback(props => <Element {...props} />, [])

  const editor = useMemo(() =>withListsReact(withListsPlugin(withHistory(withReact(createEditor())))), [])
  return (
    <Slate editor={editor} value={value} onChange={value => { setValue(value); }}>
      <Toolbar>
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
      <Editable
                onKeyDown={(event) => onKeyDown(editor, event)}

        renderElement={renderElement}
        placeholder="Enter some plain text..." />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Type ={
  PARAGRAPH : 'paragraph',
  ORDERED_LIST : 'ordered-list',
  UNORDERED_LIST : 'bulleted-list',
  LIST_ITEM :'list-item',
  LIST_ITEM_TEXT : 'list-item-text',
}


const withListsPlugin = withLists({
      isConvertibleToListTextNode(node) {
          return SlateElement.isElementType(node, Type.PARAGRAPH);
      },
      isDefaultTextNode(node) {
          return SlateElement.isElementType(node, Type.PARAGRAPH);
    },
      isListNode(node, type) {
          if (type) {
              return SlateElement.isElementType(node, type);
          }
          return (
            SlateElement.isElementType(node, Type.ORDERED_LIST) ||
            SlateElement.isElementType(node, Type.UNORDERED_LIST)
          );
      },
      isListItemNode(node) {
          return SlateElement.isElementType(node, Type.LIST_ITEM);
      },
      isListItemTextNode(node) {
          return SlateElement.isElementType(node, Type.LIST_ITEM_TEXT);
      },
      createDefaultTextNode(props = {}) {
          return { children: [{ text: '' }], ...props, type: Type.PARAGRAPH };
      },
      createListNode(type= ListType.UNORDERED, props = {}) {
          const nodeType = type === ListType.ORDERED ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
          return { children: [{ text: '' }], ...props, type: nodeType };
      },
      createListItemNode(props = {}) {
          return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM };
      },
      createListItemTextNode(props = {}) {
          return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM_TEXT };
      },
  });

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        
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