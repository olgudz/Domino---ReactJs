import React from 'react';
import StatisticItem from './StatisticItem/StatisticItem';
import './StatisticItems.css';

const statisticItems = (props) => {
    const minutes =  Math.floor(props.time / 60);
    const seconds = Math.floor(props.time % 60);
    const updatedTime = minutes +":"+seconds;
    return (
        <ul className="StatisticItems">
            <div>Statistic</div>
            <StatisticItem value={updatedTime}>Time: </StatisticItem>
            <StatisticItem value={props.turns}>Turns: </StatisticItem>
            <StatisticItem value={props.average.toFixed(2)}>Average Time: </StatisticItem>
            <StatisticItem value={props.drawFromStock}>Draw from stock: </StatisticItem>
            <StatisticItem value={props.score}>Score: </StatisticItem>
        </ul>
    );
};

export default statisticItems;