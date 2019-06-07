import React from 'react';
import Tile from '../Tile/Tile';
import './Deck.css';

const deck = (props) => (
        !props.isEmpty ?
                <div className="Deck">
                        <Tile styles={""} click={props.clicked} />
                </div> : null
);

export default deck;