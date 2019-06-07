import React, { Component, Fragment } from 'react';
import Statistic from '../../components/Statistic/Statistic';
import Playground from '../../components/Playground/Playground';
import Deck from '../../components/Deck/Deck';
import PlayerDeck from '../../components/PlayerDeck/PlayerDeck';


class Game extends Component {
    state = {
        deck: [1],
        playerDeck: [],
        playerValues: [],
        playgroundDeck: [],
        isGameActive: false,
        isCanPullFromDeck: true,      //for pulling tile from deck
        time: 0,
        turns: 0,
        averageTime: 0,
        pulledFromDeck: 0,
        score: 0,
        selectedTile: "",    //for choosing tile
        states: [],            ///for prev/next. save PlayerDeck, time, turns, averageTime, score
        ends: [],          ///for saving ends tiles
        possibleChoices: []
    }

    clickDeckHandler = () => {
        if (!this.state.isGameActive) {
            this.createGame();
            this.setState({ isGameActive: true });
            this.startTimer();
        }
        else if (this.state.isCanPull) {
            let newDeck = [...this.state.deck];
            let newPlayerDeck = [...this.state.deck];
            let newPlayerValues = [...this.state.PlayerValues];
            let newScore = 0;
            let index = Math.floor(Math.random() * newDeck.length);
            let tile = newDeck[index];
            newPlayerDeck.push(tile);
            newDeck.splice(index, 1);
            let num = tile.charAt(0)
            newPlayerValues.push(num);
            num = tile.charAt(1)
            newPlayerValues.push(num);

            for (let i = 0; i < newPlayerValues.length; i++) {
                newScore += Number(newPlayerValues[i]);
            }
            this.updateIfCanPullFromDeck(newPlayerValues, []);
            this.setState((prevState) => ({
                deck: newDeck,
                playerDeck: newPlayerDeck,
                playerValues: newPlayerValues,
                turns: prevState.turns + 1,
                pulledFromDeck: prevState.pulledFromDeck + 1,
                score: newScore
            }));
        }
        else {
            alert("You can not pull from the deck.");
        };
    }

    clickPlayerTileHandler = (event) => {
        let newPlayerDeck = [...this.state.playerDeck];
        let index;
        for (let i = 0; i < newPlayerDeck.length; i++) {
            if (newPlayerDeck[i] === event.target.id) {
                index = i;
                break;
            }
        }
        if (!this.state.playgroundDeck.length) {
            this.firstClickPlayerTileHandler(newPlayerDeck, event.target.id, index);
            this.setPossibleChoices(event.target.id);
        } else {
            this.setPossibleChoices(event.target.id);
            this.setState({ selectedTile: event.target.id });
            console.log(this.state.setPossibleChoices);
        }
    }

    firstClickPlayerTileHandler = (playerDeck, id, index) => {
        let newPlayerDeck = [...playerDeck];
        const xPos = 500;
        const yPos = 300;
        const newPlaygroundDeck = [{
            name: id,
            xPos: xPos,
            yPos: yPos,
            classes: "Horizontal"
        }];

        let newPlayerValues = [];
        for (let i = 0; i < newPlayerDeck.length; i++) {
            let tile = newPlayerDeck[i];
            let num = tile.charAt(0)
            newPlayerValues.push(num);
            num = tile.charAt(1)
            newPlayerValues.push(num);
        }
        let newScore = 0;
        for (let i = 0; i < newPlayerValues.length; i++) {
            newScore += Number(newPlayerValues[i]);
        }

        newPlayerDeck.splice(index, 1);

        let newEnds = [];
        let tileEnd1 = {
            name: id.charAt(0),
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };
        let tileEnd2 = {
            name: id.charAt(1),
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };
        newEnds.push(tileEnd1, tileEnd2);
        if (tileEnd1.name === tileEnd2.name) {
            let tileEnd3 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos,
                direction: "up"
            };
            let tileEnd4 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos + 40,
                direction: "down"
            };
            newEnds.push(tileEnd3, tileEnd4);
        }
        this.updateIfCanPullFromDeck(newPlayerValues, [newEnds[0].name, newEnds[1].name]);

        this.setState({
            playgroundDeck: newPlaygroundDeck,
            playerDeck: newPlayerDeck,
            score: newScore,
            playerValues: newPlayerValues,
            ends: newEnds
        });
    }

    setPossibleChoices = (selectedTile) => {
        const ends = [...this.state.ends];
        let firstNum = selectedTile.charAt(0);
        let secondNum = selectedTile.charAt(1);
        let newPossibleChoices = [];
        let tmpArray = [];
        /******************************/
        for (let i = 0; i < ends.length; i++) {
            if (ends[i].name === firstNum && ends[i].name === secondNum) {    //mm,nn
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addToHorizontalTileDouble(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addToVerticalTileDouble(ends[i], selectedTile);
                }
                else { console.log("Error!"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else if (ends[i].name === firstNum) {  //m* , n*
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addToHorizontalTile_1(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addToVerticalTile_1(ends[i], selectedTile);
                }
                else { console.log("Error!"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else if (ends[i].name === secondNum) { //*m, *n
                if (ends[i].direction === "right" || ends[i].direction === "left") {
                    tmpArray = this.addToHorizontalTile_2(ends[i], selectedTile);
                }
                else if (ends[i].direction === "up" || ends[i].direction === "down") {
                    tmpArray = this.addToVerticalTile_2(ends[i], selectedTile);
                }
                else { console.log("Error!"); }
                newPossibleChoices = newPossibleChoices.concat(tmpArray);
            }
            else { }
        }

        this.setState({ possibleChoices: newPossibleChoices });
    }

    addToVerticalTile_1 = (end, name) => { //m*, n* 
        let xPos = end.xPos;
        let yPos;
        let classes;
        let direction;
        if (end.direction === "up") {   //m*
            yPos = end.yPos - 80;
            direction = "up";
            classes = "VerticalInverted";
        }
        else {                         //n*
            yPos = end.yPos;
            direction = "down";
            classes = "Vertical";
        }
        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    addToVerticalTile_2 = (end, name) => { //*m, *n
        let xPos = end.xPos;
        let yPos;
        let classes;
        let direction;

        if (end.direction === "up") {   //*m
            yPos = end.yPos - 80;
            direction = "up";
            classes = "Vertical";
        }
        else {                         //*n
            yPos = end.yPos;
            direction = "down";
            classes = "VerticalInverted";
        }

        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    addToHorizontalTile_1 = (end, name) => { //m*, n*
        let xPos;
        let yPos = end.yPos;
        let classes;
        let direction;

        if (end.direction === "left") {   //m*
            xPos = end.xPos - 80;
            direction = "left";
            classes = "HorizontalInverted";
        }
        else {                          //n*
            xPos = end.xPos;
            direction = "right";
            classes = "Horizontal";
        }

        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    addToHorizontalTile_2 = (end, name) => { //*m, *n
        let xPos;
        let yPos = end.yPos;
        let classes;
        let direction;

        if (end.direction === "left") {   //*m
            xPos = end.xPos - 80;
            direction = "left";
            classes = "Horizontal";
        }
        else {                            //*n
            xPos = end.xPos;
            direction = "right";
            classes = "HorizontalInverted";
        }

        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    addToVerticalTileDouble = (end, name) => { //mm, nn    
        let xPos = end.xPos - 20;
        let yPos;
        let classes = "Horizontal";
        let direction;
        if (end.direction === "up") {
            yPos = end.yPos - 40;
            direction = "left right up"
        }
        else {
            yPos = end.yPos;
            direction = "left right down"
        }
        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    addToHorizontalTileDouble = (end, name) => { //mm, nn    
        let xPos;
        let yPos = end.yPos - 20;
        let classes = "Vertical";
        let direction;

        if (end.direction === "left") { //mm
            xPos = end.xPos - 40;
            direction = "left up down";
        }
        else {                        //nn
            xPos = end.xPos;
            direction = "right up down";
        }
        let newPossibleChoices = [{
            name: name,
            xPos: xPos,
            yPos: yPos,
            classes: classes,
            direction: direction
        }];

        return newPossibleChoices;
    }

    updateIfCanPullFromDeck = (playerValues, ends) => {
        if (ends.length === 0) {
            ends = [...this.state.ends];
        }
        if (playerValues.length === 0) {
            playerValues = [...this.state.playerValues];
        }
        let result = true;
        for (let i = 0; i < playerValues.length; i++) {
            for (let j = 0; j < ends.length; j++) {
                if (playerValues[i] === ends[j]) {
                    result = false;
                    break;
                }
            }
        }

        this.setState({ isCanPullFromDeck: result });
    }

    startTimer = () => {
        setInterval(() => {
            this.setState((prevState) => ({ time: prevState.time + 1 }));
        }, 1000);
    }

    createGame = () => {
        const newDeck = [];
        let tileName;
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                tileName = i + "" + j;
                newDeck.push(tileName);
            }
        }

        let newPlayerDeck = [];
        let newPlayerValues = [];
        for (let i = 0; i < 6; i++) {
            let index = Math.floor(Math.random() * (28 - i));
            let tile = newDeck[index];
            newPlayerDeck.push(tile);
            let num = tile.charAt(0)
            newPlayerValues.push(num);
            num = tile.charAt(1)
            newPlayerValues.push(num);
            newDeck.splice(index, 1);
        }

        let sum = 0;
        for (let i = 0; i < newPlayerValues.length; i++) {
            sum += Number(newPlayerValues[i]);
        }

        this.setState({
            deck: newDeck,
            playerDeck: newPlayerDeck,
            playerValues: newPlayerValues,
            score: sum,
            isCanPullFromDeck: false
        });
    }

    saveState = (playerDeck, time, turns, averageTime, score) => {
        let newStates = [...this.state.states];
        let newState = {
            playerDeck: playerDeck,
            time: time,
            turns: turns,
            averageTime: averageTime,
            score: score
        };

        newStates.push(newState);
        this.setState({ states: newStates });
    }

    placeHolderClickHandler = () => {
        alert("placeholder clicked");
    }

    render() {
        return (
            <Fragment>
                <Statistic
                    time={this.state.time}
                    turns={this.state.turns}
                    average={this.state.average}
                    drawFromStock={this.state.pullFromStock}
                    score={this.state.score} />
                <Playground
                    board={this.state.playgroundDeck}
                    possibleChoices={this.state.possibleChoices}
                    click={this.placeHolderClickHandler} />
                <Deck
                    isEmpty={this.state.deck.length > 0 ? false : true}
                    clicked={this.clickDeckHandler} />
                <PlayerDeck
                    deck={this.state.playerDeck}
                    active={this.state.selectedTile}
                    click={this.clickPlayerTileHandler} />
            </Fragment>
        );
    }
}

export default Game;
