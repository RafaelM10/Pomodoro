import React from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/secondsToTime';
import { Button } from './button';
import { Timer } from './timer';

interface Props{
    PomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime] = React.useState(props.PomodoroTime);

    useInterval(() => {
        setMainTime(mainTime - 1);
    },1000);

    return (
        <div className="pomodoro">
            <h2>you are: working</h2>
            <Timer mainTime={mainTime} />

            <div className="controls">
            <Button text='teste' onClick={() => console.log(1)}></Button>
            <Button text='teste' onClick={() => console.log(1)}></Button>
            <Button text='teste' onClick={() => console.log(1)}></Button>
            </div> 

            <div className="details">
                <p>Testando: aodhwoufouwajd </p>
                <p>Testando: aodhwoufouwajd </p>
                <p>Testando: aodhwoufouwajd </p>
                <p>Testando: aodhwoufouwajd </p>
            </div> 
        </div>
    );
}