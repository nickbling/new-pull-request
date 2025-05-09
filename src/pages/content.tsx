import React, {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SlackButton} from '@/src/components/SlackButton';
import {HEADER_CLASS, STATUS, TITLE_CLASS} from "@/src/constants";

const App = () => {
    const [status, setStatus] = useState<STATUS>(STATUS.STALE);
    const timer = useRef<number>();

    function start() {
        setStatus(STATUS.PRESSING);

        timer.current = window.setTimeout(() => {
            setStatus(STATUS.LOADING);

            setTimeout(async () => {
                try {
                    const title = document.querySelector<HTMLHeadingElement>(TITLE_CLASS)?.innerText.trim() || '';
                    const url = location.href;

                    const res = await chrome.runtime.sendMessage({
                        type: 'sendToSlack',
                        payload: `<${url}|${title}>`
                    });

                    setStatus(res.success ? STATUS.SUCCESS : STATUS.ERROR);

                    setTimeout(() => {
                        setStatus(STATUS.STALE);
                    }, 3000);
                } catch {
                    setStatus(STATUS.ERROR);

                    setTimeout(() => {
                        setStatus(STATUS.STALE);
                    }, 3000);
                }
            }, 750);
        }, 1500);
    }

    function clear() {
        switch (status) {
            case STATUS.LOADING:
            case STATUS.SUCCESS:
            case STATUS.ERROR:
                return;
            default:
                clearTimeout(timer.current);
                setStatus(STATUS.STALE);
        }
    }

    return <SlackButton onStart={start} onClear={clear} status={status} />;
};

const header = document.querySelector(HEADER_CLASS);

if (header instanceof HTMLElement) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.order = '3';
    header.appendChild(container);
    createRoot(container).render(<App />);
}