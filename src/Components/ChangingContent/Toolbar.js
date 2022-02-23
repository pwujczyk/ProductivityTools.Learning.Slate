import React, { useEffect, useState } from "react";
import { useSlate } from "slate-react";

import Button from "./button.js";
import Icon from "./icon.js";
import {
    toggleBlock,
    toggleMark,
    isMarkActive,
    addMarkData,
    isBlockActive,
    activeMark
} from "./slateUtilityFunctions.js";


import defaultToolbarGroups from "./toolbarGroups.js";
import "./styles.css";

const Toolbar = () => {
    const editor = useSlate();
    const [toolbarGroups, setToolbarGroups] = useState(defaultToolbarGroups);
  
    const BlockButton = ({ format }) => {
        return (
            <Button
                active={isBlockActive(editor, format)}
                format={format}
                onMouseDown={(e) => {
                    e.preventDefault();
                    debugger;
                    toggleBlock(editor, format);
                }}
            >
                <Icon icon={format} />
            </Button>
        );
    };
      const changeMarkData = (event, format) => {
        event.preventDefault();
        const value = event.target.value;
        addMarkData(editor, { format, value });
    };

    return (
        <div className="toolbar">{toolbarGroups.map((group, index) => (

            <span key={index} className="toolbar-grp">
                {group.map((element) => {
                    switch (element.type) {
                        case "block":
                            return <BlockButton key={element.id} {...element} />;
                    }
                })}
            </span>
        ))}</div>
    )
}

export default Toolbar;