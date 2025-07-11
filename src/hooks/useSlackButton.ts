import {useRef, useState} from "react";
import {STATUS, TITLE_CLASS} from "@/src/constants";

export const useSlackButton = () => {
    const [status, setStatus] = useState<STATUS>(STATUS.STALE);
    const timer = useRef<number>();

    function start() {
        setStatus(STATUS.PRESSING);

        timer.current = window.setTimeout(() => {
            setStatus(STATUS.LOADING);

            const loadingMinTime = new Promise(resolve => setTimeout(resolve, 1000));

            (async () => {
                try {
                    const title = document.querySelector<HTMLHeadingElement>(TITLE_CLASS)?.innerText.trim() || 'Untitled PR';

                    const prMatch = location.href.match(/(https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+)/);
                    const prUrl = prMatch ? prMatch[1] : location.href;

                    const authorLink = document.querySelector<HTMLAnchorElement>('a.author');
                    const authorName = authorLink?.innerText || 'unknown';
                    const authorProfileUrl = authorLink?.href || '#';

                    const slackMessage = `<${prUrl}|${title}> by <${authorProfileUrl}|${authorName}>`;

                    const resPromise = chrome.runtime.sendMessage({
                        type: 'sendToSlack',
                        payload: slackMessage
                    });

                    const [res] = await Promise.all([resPromise, loadingMinTime]);

                    setStatus(res.success ? STATUS.SUCCESS : STATUS.ERROR);
                } catch {
                    await loadingMinTime;
                    setStatus(STATUS.ERROR);
                } finally {
                    setTimeout(() => {
                        setStatus(STATUS.STALE);
                    }, 3000);
                }
            })();
        }, 1500);
    }

    function clear() {
        if ([STATUS.LOADING, STATUS.SUCCESS, STATUS.ERROR].includes(status)) return;
        clearTimeout(timer.current);
        setStatus(STATUS.STALE);
    }

    return { status, start, clear };
}