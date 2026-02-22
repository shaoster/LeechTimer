import { Alert, Button, Fade, List, ListItem, Snackbar, Table, TableBody} from "@mui/material";
import { useEffect, useState } from "react";
import CopyPastableTextBox from "./CopyPastableTextBox";
import humanizeDuration from "humanize-duration";
import { Campaign, NotStarted, PauseCircle, PlayCircle, RestartAlt, CheckCircle, DeleteForever } from "@mui/icons-material";
import { DataContext, INITIAL_DATA } from "../context";
import { TransitionGroup } from "react-transition-group";

const TextBoxContainer = () => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [data, setData] = useState(INITIAL_DATA);
    const [finished, setFinished] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [history, setHistory] = useState<Array<string>>([]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timerRunning) {
                setSecondsElapsed((prev) => prev + 1);
            }
            const formattedDate = new Date().toUTCString().slice(5, -4);
            setData({
                time: formattedDate,
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
    const resetDisabled = !finished;
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
        <h1>
            Leech Events
            &nbsp;
            <Button variant="outlined" startIcon={<RestartAlt/>} onClick={reset} disabled={resetDisabled}>
                Reset Leech
            </Button>

        </h1>
        <Table>
            <TableBody>
                <DataContext.Provider value={{data: data, appendHistory: appendHistory, setShowCopied: setShowCopied}}>
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
                </DataContext.Provider>
            </TableBody>
        </Table>
        <h1>
            History
            &nbsp;
            <Button variant="outlined" startIcon={<DeleteForever/>} onClick={clearHistory} disabled={history.length == 0 || secondsElapsed != 0}>
                Clear
            </Button>
        </h1>
        {history.length == 0 ? <ListItem>No Events Yet</ListItem> :
            <List>
                <TransitionGroup>
                    {history.map((entry, index)=> (
                        <Fade key={index} timeout={500}>
                            <ListItem>
                                {entry}
                            </ListItem>
                        </Fade>
                    ))}
                </TransitionGroup>
            </List>
        }
        <Snackbar
            open={showCopied}
            autoHideDuration={2000}
            onClose={()=>setShowCopied(false)}
        >
            <Alert
                onClose={()=>setShowCopied(false)}
                severity="success"
                variant="filled"
                sx={{ width: '100%'}}
            >
                Copied to clipboard!
            </Alert>
        </Snackbar>
    </div>);
}

export default TextBoxContainer;