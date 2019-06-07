import React from 'react';
import './Placeholder.css';

const placeholder = (props) => {
    let classes = [props.classes, "Placeholder"];
    let classesString = classes.join(" ");

    let styles = {
        position: "absolute",
        left: props.xPos,
        top: props.yPos
    };
    console.log("key " + props.key);
    return (
        <div
          key={props.key}
          className={classesString}
          style={styles}
          onClick={props.click}></div>
    );
};

export default placeholder;

/************** 
left: props.xPos,
top: props.yPos 
********** */