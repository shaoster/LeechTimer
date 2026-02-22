import { Button, TableCell, TableRow, TextareaAutosize} from "@mui/material";
import { useContext} from "react";
import type React from "react";
import { DataContext, type DataContextType } from "../context";

export type CopyPastableTextBoxInput = {
    label: string;
    icon: React.ReactNode;
    textTemplate: string;
    disabled?: boolean;
    onCopy?: () => boolean;
}

/* From Gemini */
/**
 * Fills a template string with values from an object.
 * Placeholders should be in the format ${key}.
 * 
 * @param template The template string, e.g., "Hello, ${name}!"
 * @param data The object containing the replacement values.
 * @returns The filled string.
 */
function fillTemplate<T extends Record<string, string | number>>(
    template: string, 
    data: T
): string {
    // Use the replace method with a regular expression to find placeholders.
    return template.replace(/{(.*?)}/g, (match, key) => {
        // Look up the key in the data object. 
        // If it exists, return the value as a string; otherwise, return the original placeholder.
        return data.hasOwnProperty(key) ? String(data[key]) : match;
    });
}

const CopyPastableTextBox = (props: CopyPastableTextBoxInput) => {
    const {
        icon,
        label,
        onCopy,
        textTemplate,
        disabled,
    } = props;
    const {
        data,
        appendHistory,
        setShowCopied,
    } = useContext<DataContextType>(DataContext);
    const renderedText = fillTemplate(textTemplate, data);
    console.log(renderedText);
    const onClick = () => {
        if (typeof onCopy !== "undefined") {
            if (!onCopy()) {
                return;
            }
        }
        navigator.clipboard.writeText(renderedText);
        setShowCopied(true);
        appendHistory(renderedText);
    };

    return (
        <TableRow>
            <TableCell>
                <Button variant="outlined" startIcon={icon} onClick={onClick} disabled={disabled}>
                    {label}
                </Button>
            </TableCell>
            <TableCell>
                <TextareaAutosize cols={80} value={renderedText} disabled />
            </TableCell>
        </TableRow>

    )
};

export default CopyPastableTextBox;