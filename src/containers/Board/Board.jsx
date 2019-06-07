import React from 'react';
import './Board.css';
import Tile from '../../components/Tile/Tile';

const board = (props) => {
    let array = [...props.board];
    let tiles = [];
    let placeHolders = [...props.placeHolders];
    console.log(placeHolders);
    for (let i = 0; i < array.length; i++) {
        tiles[i] = 
            <Tile
                key={array[i].name}
                tileName={array[i].name}  
                xPos={array[i].xPos}
                yPos={array[i].yPos}
                classes={array[i].classes}
            />;
    }
    return (
        <div className="Board" >
            {tiles}
        </div>
    );
}

export default board;