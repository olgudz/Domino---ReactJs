import React from 'react';
import StaticticItems from './StaticticItems/StatisticItems';

import './Statistic.css';

const statistic = (props) => (
    <div className="Statistic">
        <StaticticItems
            time={props.time}
            turns={props.turns}
            average={props.average}
            drawFromStock={props.drawFromStock}
            score={props.score} />
    </div>
);

export default statistic;