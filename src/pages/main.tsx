import React from 'react';
import { createRoot } from 'react-dom/client';
import { SlackButton } from '@/src/components/SlackButton';
import { HEADER_CLASS } from '@/src/constants';
import { useSlackButton } from "@/src/hooks/useSlackButton";

const Main = () => {
    const {status, start, clear} = useSlackButton()
    return <SlackButton onStart={start} onClear={clear} status={status} />;
};

function mountSlackButton(header: Element) {
    if (header.querySelector('[data-slack-button="true"]')) return;

    const container = document.createElement('div');
    container.setAttribute('data-slack-button', 'true');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.order = '3';
    header.appendChild(container);

    createRoot(container).render(<Main />);
}

function observeDomAndInject() {
    const observer = new MutationObserver(() => {
        const header = document.querySelector(HEADER_CLASS);
        if (header && !header.querySelector('[data-slack-button="true"]')) {
            mountSlackButton(header);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    const initialHeader = document.querySelector(HEADER_CLASS);
    if (initialHeader) {
        mountSlackButton(initialHeader);
    }
}

observeDomAndInject();