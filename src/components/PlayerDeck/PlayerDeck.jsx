import React from 'react';
import './PlayerDeck.css';
import Tile from '../Tile/Tile';

const playerDeck = (props) => {
    const deck = [...props.deck];
    let cards = [];
    let styles = "";
    let isActive = "";
    for (let i = 0; i < deck.length; i++) {
        if (props.active === deck[i]) {
            isActive = "Active";
        }
        else {
            isActive = "";
        }
        cards.push(
            <Tile
                isActive={isActive}
                styles={styles}
                key={deck[i]}
                tileName={deck[i]}
                click={props.click} />);
    }
    return (
        <div className="PlayerDeck">
            {cards}
        </div>
    );
}

export default playerDeck;