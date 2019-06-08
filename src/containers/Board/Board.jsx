import React from 'react';
import './Board.css';
import Tile from '../../components/Tile/Tile';
import Placeholder from '../../components/Placeholder/Placeholder';

const board = (props) => {
    let board = [...props.board];
    let tiles = [];
    let possibleChoices = [...props.possibleChoices];
    let choices = [];

    for (let i = 0; i < board.length; i++) {
        tiles[i] = 
            <Tile
                key={board[i].name}
                tileName={board[i].name}  
                xPos={board[i].xPos}
                yPos={board[i].yPos}
                classes={board[i].classes}
            />;
    }
    
    for (let i = 0; i < possibleChoices.length; i++) {
        choices[i] = 
            <Placeholder
                key={possibleChoices[i].name + "" + possibleChoices[i].direction} 
                name = {possibleChoices[i].name}
                xPos={possibleChoices[i].xPos}
                yPos={possibleChoices[i].yPos}
                classes={possibleChoices[i].classes}
                click={props.click}
            />;
    }
    return (
        <div className="Board" >
            {tiles}
            {choices}
        </div>
    );
}

export default board;