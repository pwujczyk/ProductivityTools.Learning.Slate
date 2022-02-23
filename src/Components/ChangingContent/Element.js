
export const Element = (props) =>{

    const {attributes, children, element} = props;
    
    switch(element.type){
        case 'headingOne':
            return <h1 {...attributes}>{children}</h1>;
        
        default :
            return <p {...attributes}>{children}</p>
    }
}

