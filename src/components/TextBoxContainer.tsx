import { Button, List, ListItem, Table, TableBody} from "@mui/material";
import { useEffect, useState } from "react";
import CopyPastableTextBox from "./CopyPastableTextBox";
import humanizeDuration from "humanize-duration";
import { Campaign, NotStarted, PauseCircle, PlayCircle, RestartAlt, CheckCircle, DeleteForever } from "@mui/icons-material";
import { DataContext, INITIAL_DATA } from "../context";

const TextBoxContainer = () => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [data, setData] = useState(INITIAL_DATA);
    const [finished, setFinished] = useState(false)
    const [history, setHistory] = useState<Array<string>>([]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timerRunning) {
                setSecondsElapsed((prev) => prev + 1);
            }
            const formattedDate = new Date().toUTCString().substring(5);
            setData({
                time: formattedDate.substring(0, formattedDate.length - 4),
                timeElapsed: humanizeDuration(secondsElapsed * 1000),
            })
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timerRunning, secondsElapsed]);

    const start = () => {
        setTimerRunning(true);
        return true;
    };
    const startDisabled = timerRunning || secondsElapsed > 0;
    const pause = () => {
        if (!timerRunning) {
            alert("The timer is not running.");
            return false;
        }
        setTimerRunning(false);
        return true;
    };
    const pauseDisabled = !timerRunning || secondsElapsed == 0;
    const resume = () => {
        setTimerRunning(true);
        return true;
    };
    const resumeDisabled = timerRunning || secondsElapsed == 0 || finished;
    const finish = () => {
        if (!timerRunning) {
            alert("The timer is not running.");
            return false;
        }
        setTimerRunning(false);
        setFinished(true);
        return true;
    }
    const reset = () => {
        if (confirm("Are you sure you want to reset your leeching session?")) {
            setTimerRunning(false);
            setSecondsElapsed(0);
            setFinished(false);
            return true;
        }
        return false;
    }
    const resetDisabled = secondsElapsed == 0;
    const updateDisabled = secondsElapsed == 0 || finished;
    const appendHistory = (text: string) => {
        setHistory((prev) => [...prev, text]);
    };
    const clearHistory = () => {
        if (confirm("Are you sure you want to clear the event history?")) {
            setHistory([]);
        }
    }
    return (<div>
        <h1>Leech Events</h1>
        <Table>
            <TableBody>
                <DataContext.Provider value={{data: data, appendHistory: appendHistory}}>
                    <CopyPastableTextBox
                        label="Start"
                        icon={<PlayCircle/>}
                        onCopy={start}
                        textTemplate={`Started at {time}.`}
                        disabled={startDisabled}
                    />
                    <CopyPastableTextBox
                        label="Pause"
                        icon={<PauseCircle/>}
                        onCopy={pause}
                        textTemplate={`Paused at {time}.`}
                        disabled={pauseDisabled}
                    />
                    <CopyPastableTextBox
                        label="Resume"
                        icon={<NotStarted/>}
                        onCopy={resume}
                        textTemplate={`Resumed at {time}.`}
                        disabled={resumeDisabled}
                    />
                    <CopyPastableTextBox
                        label="Finish"
                        icon={<CheckCircle/>}
                        onCopy={finish}
                        textTemplate={`Done at {time} after {timeElapsed}.`}
                        disabled={pauseDisabled}
                    />
                    <CopyPastableTextBox
                        label="Update"
                        icon={<Campaign/>}
                        textTemplate={`{timeElapsed} elapsed.`}
                        disabled={updateDisabled}
                    />
                    <CopyPastableTextBox
                        label="Reset"
                        icon={<RestartAlt/>}
                        onCopy={reset}
                        textTemplate={`Timers reset.`}
                        disabled={resetDisabled}
                    />
                </DataContext.Provider>
            </TableBody>
        </Table>
        <h1>
            History
            &nbsp;
            <Button variant="outlined" startIcon={<DeleteForever/>} onClick={clearHistory} disabled={history.length == 0 || !finished}>
                Clear
            </Button>
        </h1>
        {history.length == 0 ? <ListItem>No Events Yet</ListItem> :
            <List>
                {history.map((entry)=> (
                    <ListItem>
                        {entry}
                    </ListItem>
                ))}
            </List>
        }
    </div>);
}

export default TextBoxContainer;