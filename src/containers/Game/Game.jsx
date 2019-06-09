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
        else if (this.state.isCanPullFromDeck) {
            let newDeck = [...this.state.deck];
            let newPlayerDeck = [...this.state.playerDeck];

            let index = Math.floor(Math.random() * newDeck.length);
            let tile = newDeck[index];
            newPlayerDeck.push(tile);
            newDeck.splice(index, 1);

            let newPlayerValues = this.setPlayerValues(newPlayerDeck);
            let newScore = this.setScore(newPlayerValues);

            this.setState((prevState) => ({
                selectedTile: "",
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

        newPlayerDeck.splice(index, 1);

        let newEnds = [];

        const tileEnd1 = {
            name: id.charAt(0),
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };

        const tileEnd2 = {
            name: id.charAt(1),
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        newEnds.push(tileEnd1, tileEnd2);
        if (tileEnd1.name === tileEnd2.name) {
            const tileEnd3 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos,
                direction: "up"
            };

            const tileEnd4 = {
                name: id.charAt(0),
                xPos: xPos + 20,
                yPos: yPos + 40,
                direction: "down"
            };
            newEnds.push(tileEnd3, tileEnd4);
        }

        let newPlayerValues = this.setPlayerValues(newPlayerDeck);
        let newScore = this.setScore(newPlayerValues);

        this.setState({
            turns: 1,
            playgroundDeck: newPlaygroundDeck,
            playerDeck: newPlayerDeck,
            score: newScore,
            playerValues: newPlayerValues,
            ends: newEnds
        });
    }

    setPlayerValues = (newPlayerDeck) => {
        let newPlayerValues = [];
        for (let i = 0; i < newPlayerDeck.length; i++) {
            let tile = newPlayerDeck[i];
            let num = tile.charAt(0)
            newPlayerValues.push(num);
            num = tile.charAt(1)
            newPlayerValues.push(num);
        }
        return newPlayerValues;
    }

    setScore = (newPlayerValues) => {
        let newScore = 0;
        for (let i = 0; i < newPlayerValues.length; i++) {
            newScore += Number(newPlayerValues[i]);
        }
        return newScore;
    }

    setPossibleChoices = (selectedTile) => {
        const ends = [...this.state.ends];
        let firstNum = selectedTile.charAt(0);
        let secondNum = selectedTile.charAt(1);
        let newPossibleChoices = [];
        let tmpArray = [];
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

    updateIfCanPullFromDeck = () => {
        let ends = [...this.state.ends];
        let playerValues = [...this.state.playerValues];
        let result = true;
        for (let i = 0; i < playerValues.length; i++) {
            for (let j = 0; j < ends.length; j++) {
                if (playerValues[i] === ends[j].name) {
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
        setInterval(() => this.updateIfCanPullFromDeck(), 1000);
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

    placeHolderClickHandler = (event) => {
        let newPlayerDeck = [...this.state.playerDeck];
        let newEnds = [...this.state.ends];
        let newPlaygroundDeck = [...this.state.playgroundDeck];

        let xPos = Number(this.cutNumberFromString(event.target.style.left));
        let yPos = Number(this.cutNumberFromString(event.target.style.top));

        let classes = this.firstWordOfString(event.target.className);

        let newAddedTile = {
            name: this.state.selectedTile,
            xPos: xPos,
            yPos: yPos,
            classes: classes
        }

        newPlaygroundDeck.push(newAddedTile);

        let index;
        for (let i = 0; i < newPlayerDeck.length; i++) {
            if (newPlayerDeck[i] === this.state.selectedTile) {
                index = i;
                break;
            }
        }
        newPlayerDeck.splice(index, 1);

        let newPlayerValues = this.setPlayerValues(newPlayerDeck);
        let newScore = this.setScore(newPlayerValues);

        ///updateEnds
        for (let i = 0; i < newEnds.length; i++) {
            if ((Number(newEnds[i].yPos) === (yPos + 80)) && (Number(newEnds[i].xPos) === xPos)) {
                this.setEndUpSingle(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 80)) && (Number(newEnds[i].yPos) === yPos)) {
                this.setEndLeftSingle(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 20)) && (Number(newEnds[i].yPos) === (yPos + 40))) {
                this.setEndUpDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 20)) && (Number(newEnds[i].yPos) === yPos)) {
                this.setEndDownDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === (xPos + 40)) && (Number(newEnds[i].yPos) === (yPos + 20))) {
                this.setEndLeftDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].xPos) === xPos) && (Number(newEnds[i].yPos) === (yPos + 20))) {
                this.setEndRightDouble(xPos, yPos, i);
                break;
            }
            else if ((Number(newEnds[i].yPos) === yPos) && (Number(newEnds[i].xPos) === xPos)) {
                if (newEnds[i].direction === "down") {
                    this.setEndDownSingle(xPos, yPos, i);
                    break;
                }
                else if (newEnds[i].direction === "right") {
                    this.setEndRightSingle(xPos, yPos, i);
                    break;
                }
            }
        }

        this.setState((prevState, props) => ({
            possibleChoices: [],
            playgroundDeck: newPlaygroundDeck,
            turns: prevState.turns + 1,
            playerDeck: newPlayerDeck,
            playerValues: newPlayerValues,
            score: newScore,
            selectedTile: ""
        }));
    }

    setEndUpSingle = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        let newEndName;
        if (newEnds[index].name === this.state.selectedTile.charAt(1)) {
            newEndName = this.state.selectedTile.charAt(0);
        }
        else newEndName = this.state.selectedTile.charAt(1);
        if (yPos - 80 > 0 && this.isFreeSpace(xPos, yPos - 80, xPos + 40, yPos)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        this.setState({ ends: newEnds });
    }

    setEndDownSingle = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];

        let newEndName;
        if (newEnds[index].name === this.state.selectedTile.charAt(1)) {
            newEndName = this.state.selectedTile.charAt(0);
        }
        else newEndName = this.state.selectedTile.charAt(1);
        if (this.isFreeSpace(xPos, yPos + 80, xPos + 40, yPos + 160)) {
            newEnds[index].name = newEndName;
            newEnds[index].yPos = yPos + 80;
            newEnds[index].xPos = xPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        this.setState({ ends: newEnds });
    }

    setEndRightSingle = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        let newEndName;
        if (newEnds[index].name === this.state.selectedTile.charAt(1)) {
            newEndName = this.state.selectedTile.charAt(0);
        }
        else newEndName = this.state.selectedTile.charAt(1);
        if (this.isFreeSpace(xPos + 80, yPos, xPos + 160, yPos + 40)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos + 80;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }
        this.setState({ ends: newEnds });
    }

    setEndLeftSingle = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        let newEndName;
        if (newEnds[index].name === this.state.selectedTile.charAt(1)) {
            newEndName = this.state.selectedTile.charAt(0);
        }
        else newEndName = this.state.selectedTile.charAt(1);
        if (xPos - 80 > 0 && this.isFreeSpace(xPos - 80, yPos, xPos, yPos + 40)) {
            newEnds[index].name = newEndName;
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }
        this.setState({ ends: newEnds });
    }

    setEndUpDouble = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        const newEndName = this.state.selectedTile.charAt(0);
        console.log(newEndName);
        if (yPos - 80 > 0 && this.isFreeSpace(xPos + 20, yPos - 80, xPos + 60, yPos)) {
            newEnds[index].xPos = xPos + 20;
            newEnds[index].yPos = yPos;
        }
        else {
            newEnds.splice(index, 1);
        }

        const end1 = {
            name: newEndName,
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };

        if (this.isFreeSpace(end1.xPos + 80, end1.yPos, end1.xPos + 160, end1.yPos + 40)) {
            newEnds.push(end1);
        }

        if (end2.xPos - 80 > 0 && this.isFreeSpace(end2.xPos - 80, end2.yPos, end2.xPos, end2.yPos + 40)) {
            newEnds.push(end2);
        }

        this.setState({ ends: newEnds });
    }

    setEndDownDouble = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        const newEndName = this.state.selectedTile.charAt(0);
        if (this.isFreeSpace(xPos + 20, yPos + 40, xPos + 60, yPos + 120)) {
            newEnds[index].xPos = xPos + 20;
            newEnds[index].yPos = yPos + 40;
        }
        else {
            newEnds.splice(index, 1);
        }
        const end1 = {
            name: newEndName,
            xPos: xPos + 80,
            yPos: yPos,
            direction: "right"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "left"
        };
        if (this.isFreeSpace(end1.xPos, end1.yPos, end1.xPos + 80, end1.yPos + 40)) {
            newEnds.push(end1);
        }

        if (end2.xPos - 80 > 0 && this.isFreeSpace(end2.xPos - 80, end2.yPos, end2.xPos, end2.yPos + 40)) {
            newEnds.push(end2);
        }
        this.setState({ ends: newEnds });
    }

    setEndRightDouble = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        const newEndName = this.state.selectedTile.charAt(0);
        if (this.isFreeSpace(xPos + 40, yPos + 20, xPos + 120, yPos + 60)) {
            newEnds[index].xPos = xPos + 40;
            newEnds[index].yPos = yPos + 20;
        }
        else {
            newEnds.splice(index, 1);
        }

        const end1 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "up"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos + 80,
            direction: "down"
        };

        if (end1.yPos - 80 > 0 && this.isFreeSpace(end1.xPos, end1.yPos - 80, end1.xPos + 40, end2.yPos)) {
            newEnds.push(end1);
        }
        if (this.isFreeSpace(end2.xPos, end2.yPos, end2.xPos + 40, end2.yPos + 80)) {
            newEnds.push(end2);
        }

        this.setState({ ends: newEnds });
    }

    setEndLeftDouble = (xPos, yPos, index) => {
        let newEnds = [...this.state.ends];
        const newEndName = this.state.selectedTile.charAt(0);

        if (xPos - 80 > 0 && (this.isFreeSpace(xPos - 80, yPos + 20, xPos, yPos + 60))) {
            newEnds[index].xPos = xPos;
            newEnds[index].yPos = yPos + 20;
        }
        else {
            newEnds.splice(index, 1);
        }
        const end1 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos,
            direction: "up"
        };

        const end2 = {
            name: newEndName,
            xPos: xPos,
            yPos: yPos + 80,
            direction: "down"
        };

        if (end1.yPos - 80 > 0 && this.isFreeSpace(end1.xPos, end1.yPos - 80, end1.xPos + 40, end1.yPos)) {
            newEnds.push(end1);
        }
        if (this.isFreeSpace(end2.xPos, end2.yPos, end2.xPos + 40, end2.yPos + 80)) {
            newEnds.push(end2);
        }

        this.setState({ ends: newEnds });
    }

    isFreeSpace = (xLT, yLT, xRB, yRB) => {
        const playground = [...this.state.playgroundDeck];
        let placeToCheck = {
            xRb: 0,
            xRT: 0,
            yRB: 0,
            yLB: 0
        }

        let result = true;
        for (let i = 0; i < playground.length; i++) {
            placeToCheck.xLT = playground[i].xPos;
            placeToCheck.yLT = playground[i].yPos;
            if (playground[i].classes === "Horizontal" ||
                playground[i].classes === "HorizontalInverted") {
                placeToCheck.xRB = Number(playground[i].xPos) + 80;
                placeToCheck.xRT = Number(playground[i].xPos) + 80;
                placeToCheck.yRB = Number(playground[i].yPos) + 40;
                placeToCheck.yLB = Number(playground[i].yPos) + 40;
            }
            else {
                placeToCheck.xRB = Number(playground[i].xPos) + 40;
                placeToCheck.xRT = Number(playground[i].xPos) + 40;
                placeToCheck.yRB = Number(playground[i].yPos) + 80;
                placeToCheck.yLB = Number(playground[i].yPos) + 80;
            }
            if (
                (placeToCheck.xRB >= xLT && placeToCheck.xRB <= xRB &&
                    placeToCheck.yRB >= yLT && placeToCheck.yRB <= yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xLT <= xRB &&
                    placeToCheck.yLB >= yLT && placeToCheck.yLB <= yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xLT <= xRB &&
                    placeToCheck.yLT >= yLT && placeToCheck.yLT <= yRB) ||
                (placeToCheck.xRT >> xLT && placeToCheck.xRT <= xRB &&
                    placeToCheck.yLT >= yLT && placeToCheck.yLT <= yRB) ||
                (xRB >= placeToCheck.xLT && xRB <= placeToCheck.xRB &&
                    yRB >> placeToCheck.yLT && yRB <= placeToCheck.yRB) ||
                (xLT >= placeToCheck.xLT && xLT <= placeToCheck.xRB &&
                    yLT >= placeToCheck.yLT && yLT <= placeToCheck.yRB) ||
                (xLT >= placeToCheck.xLT && xRB <= placeToCheck.xRB &&
                    yLT <= placeToCheck.yLT && yRB >= placeToCheck.yRB) ||
                (placeToCheck.xLT >= xLT && placeToCheck.xRB <= xRB &&
                    placeToCheck.yLT <= yLT && placeToCheck.yRB >= yRB)
            ) {
                result = false;
                break;
            }
        }

        return result;
    }

    firstWordOfString = (str) => {
        let index = str.indexOf(" ");
        let firstWord = str.substring(0, index);
        return firstWord;
    }

    cutNumberFromString = (str) => {
        let index = str.indexOf("px");
        let number = str.substring(0, index);
        return number;
    }

    render() {
        return (
            <Fragment>
                <Statistic
                    time={this.state.time}
                    turns={this.state.turns}
                    average={this.state.average}
                    drawFromStock={this.state.pulledFromDeck}
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
