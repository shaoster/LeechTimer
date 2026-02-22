import { List, ListItem, Table, TableBody} from "@mui/material";
import { useEffect, useState } from "react";
import CopyPastableTextBox from "./CopyPastableTextBox";
import humanizeDuration from "humanize-duration";
import { Campaign, NotStarted, PauseCircle, PlayCircle, StopCircle } from "@mui/icons-material";
import { DataContext, INITIAL_DATA } from "../context";

const TextBoxContainer = () => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [data, setData] = useState(INITIAL_DATA);
    const [history, setHistory] = useState<Array<string>>([]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timerRunning) {
                setSecondsElapsed((prev) => prev + 1);
            }
            setData({
                time: new Date().toUTCString(),
                timeElapsed: humanizeDuration(secondsElapsed * 1000),
            })
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timerRunning, secondsElapsed]);

    const start = () => {
        if (timerRunning || secondsElapsed > 0) {
            alert("Please stop the timer first before restarting.");
            return false;
        }
        setTimerRunning(true);
        return true;
    };
    const pause = () => {
        if (!timerRunning) {
            alert("The timer is not running.");
            return false;
        }
        setTimerRunning(false);
        return true;
    };
    const resume = () => {
        if (timerRunning) {
            alert("The timer is running.");
            return false;
        }
        setTimerRunning(true);
        return true;
    };
    const stop = () => {
        if (!timerRunning) {
            alert("The timer is not running.");
            return false;
        }
        setTimerRunning(false);
        setSecondsElapsed(0);
        return true;
    };
    const appendHistory = (text: string) => {
        setHistory((prev) => [...prev, text]);
    };

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
                    />
                    <CopyPastableTextBox
                        label="Pause"
                        icon={<PauseCircle/>}
                        onCopy={pause}
                        textTemplate={`Paused at {time}.`}
                    />
                    <CopyPastableTextBox
                        label="Resume"
                        icon={<NotStarted/>}
                        onCopy={resume}
                        textTemplate={`Resumed at {time}.`}
                    />
                    <CopyPastableTextBox
                        label="Stop"
                        icon={<StopCircle/>}
                        onCopy={stop}
                        textTemplate={`Ended at {time}. {timeElapsed} completed.`}
                    />
                    <CopyPastableTextBox
                        label="Update"
                        icon={<Campaign/>}
                        textTemplate={`{timeElapsed} elapsed.`}
                    />
                </DataContext.Provider>
            </TableBody>
        </Table>
        <h1>History</h1>
        <List>
            {history.map((entry)=> (
                <ListItem>
                    {entry}
                </ListItem>
            ))}
        </List>
    </div>);
}

export default TextBoxContainer;