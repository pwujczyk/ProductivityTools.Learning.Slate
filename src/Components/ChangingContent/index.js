// Import React dependencies.
import React, { useState, useCallback, useMemo, useEffect } from 'react'
// Import the Slate editor factory.
import { withHistory } from 'slate-history'
import Toolbar from './Toolbar'
import {
    Transforms,
    createEditor,
    Text,
    Node,
    Editor,
    Element as SlateElement,
    Descendant,
} from 'slate'
import { Element } from './Element'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'


const ChaningContent = () => {
    const [newContent, setNewContent] = useState('d');//used to store content from editable field
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'A line of x in a paragraph.' }],
        },
    ])

    const editor = useMemo(
        () => withHistory(withReact(createEditor())),
        []
    )

    useEffect(() => {
        changeContent();
    }, [newContent])

    const changeContent = () => {
        debugger;
        let x = [{
            type: 'paragraph',
            children: [{ text: newContent }],
        }];
        let totalNodes = editor.children.length

        // No saved content, don't delete anything to prevent errors
        if (value.length <= 0) {
            return
        }

        // Remove every node except the last one
        // Otherwise SlateJS will return error as there's no content
        for (let i = 0; i < totalNodes - 1; i++) {
            console.log(i)
            Transforms.removeNodes(editor, {
                at: [i],
            })
        }

        // Add content to SlateJS
        for (const v1 of x) {
            Transforms.insertNodes(editor, v1, {
                at: [editor.children.length],
            })
        }

        // Remove the last node that was leftover from before
        Transforms.removeNodes(editor, {
            at: [0],
        })
    }

    const renderElement = useCallback(props => <Element {...props} />, [])


    const onTextAreaChange = (e) => {
        console.log(e.target.value);
        setNewContent(e.target.value);
    }

    return (
        <div>
            <Slate editor={editor} value={value} onChange={value => { setValue(value); }}>
                <Toolbar />
                <Editable renderElement={renderElement} />
            </Slate>
            <p>---===slate above===---</p>
            <button onClick={changeContent}>Set content</button>
            <textarea type='text' value={newContent} onChange={onTextAreaChange}></textarea >
            <p>{newContent}</p>
        </div>
    )
}

export default ChaningContent