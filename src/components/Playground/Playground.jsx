import React from 'react';
import './Playground.css';
import Board from '../../containers/Board/Board';

const playground = (props) => (
    <div className="Playground" >
        <Board
            board={props.board}
            placeHolders={props.placeHolders}
        />
    </div>
);

export default playground;