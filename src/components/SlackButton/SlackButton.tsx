import React, {FC} from 'react';
import {STATUS} from "@/src/constants";
import {clsx} from "clsx";
import SlackIcon from '@/src/assets/slack-logo.svg?react';
import classes from './SlackButton.module.scss';

interface SlackButtonProps {
    onStart: () => void;
    onClear: () => void;
    status: STATUS;
}

export const SlackButton: FC<SlackButtonProps> = ({ onStart, onClear, status }) => {
    return (
        <button
            className={clsx(classes.slackButton, classes[status])}
            onMouseDown={onStart}
            onMouseUp={onClear}
            onMouseLeave={onClear}
            disabled={status === STATUS.LOADING || status === STATUS.SUCCESS || status === STATUS.ERROR}
        >
            <span className={classes.label}>Send to</span>
            <SlackIcon className={classes.slackLogo} />
            <div className={classes.spinner} />
            <span className={clsx(classes.overlay, classes.success)}>Sent ✅</span>
            <span className={clsx(classes.overlay, classes.error)}>Error ❌</span>
        </button>
    );
};