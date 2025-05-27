import React from 'react';

export const Tag = ({text}) => {
    return <>
        <span style={{paddingLeft: '4px', paddingRight: '4px', backgroundColor: "gray", border: '1px solid #ccc'}}>{text}</span>
    </>
}