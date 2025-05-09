import React, {useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client';
import classes from './options.module.scss';

const Options = () => {
    const [url, setUrl] = useState('');
    const [saved, setSaved] = useState(false);

    function save()  {
        chrome.runtime.sendMessage({ type: 'setSlackWebhook', webhook: url }, () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        });
    }

    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'getSlackWebhook' }, (res) => {
            if (res?.webhook) setUrl(res.webhook);
        });
    }, []);

    return (
        <form className={classes.form} onSubmit={(e) => { e.preventDefault(); save(); }}>
            <label htmlFor="webhook">Slack Webhook URL</label>
            <input
                id="webhook"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <button type="submit">Save</button>
            {saved && <span>✓ Saved!</span>}
        </form>
    );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<Options />);