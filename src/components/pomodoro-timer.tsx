import React, { useEffect, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { secondsToTime } from "../utils/secondsToTime";
import { Button } from "./button";
import { Timer } from "./timer";
const bellStart = require("../sounds/bell-start.mp3");
const bellFinish = require("../sounds/bell-finish.mp3");

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  PomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.PomodoroTime);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(
    new Array(props.cycles - 1).fill(true)
  );

  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setfullWorkingTime] = React.useState(0);
  const [numberOfPomodoro, setNumberOfPomodoro] = React.useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if(working) setfullWorkingTime(fullWorkingTime + 1); 
    },
    timeCounting ? 1000 : null
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.PomodoroTime);
    audioStartWorking.play();
  }, [
      setTimeCounting, 
      setWorking, 
      setResting, 
      setMainTime, 
      props.PomodoroTime,
    ]);

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (long) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }

    audioStopWorking.play();
  }, [
      setTimeCounting, 
      setWorking, 
      setResting, 
      setMainTime, 
      props.longRestTime, 
      props.shortRestTime,
    ]);

  useEffect(() => {
    if (working) document.body.classList.add("working");
    if (resting) document.body.classList.remove("working");

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoro(numberOfPomodoro + 1);
    if (resting) configureWork();
  }, [
      working, 
      resting, 
      mainTime, 
      cyclesQtdManager,
      numberOfPomodoro,
      completedCycles,
      configureRest, 
      setCyclesQtdManager, 
      configureWork,
      props.cycles,
    ]);

  return (
    <div className="pomodoro">
      <h2>Você está: {working ?'Trabalhando' : 'Descansando' }</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? "hidden" : ""}
          text={timeCounting ? "pause" : "Play"}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles} </p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)} </p>
        <p>Pomodoros concluídos: {numberOfPomodoro} </p>
      </div>
    </div>
  );
}
