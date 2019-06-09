import React from 'react';
import './Header.css';
import Logo from '../../../components/Logo/Logo';
import Button from '../Button/Button';

const header = (props) => {

    return (
        props.active ?
            <header className="Header withButtons">
                <Logo />
                <div >{props.win}</div>  
                <Button
                    btnType={"Success"}
                    click={props.prevClickHandler}>
                    PREV
                </Button>
                <Button
                    btnType={"Success"}
                    click={props.nextClickHandler}>
                    NEXT
                </Button>
                <Button
                    btnType={"Danger"}
                    click={props.startGame}>
                    NEW GAME
                    </Button>
            </header> :
            <header className="Header">
                <Logo />
            </header>
    );
}

export default header;