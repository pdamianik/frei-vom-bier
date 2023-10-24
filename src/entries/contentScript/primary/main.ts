import renderContent from "../renderContent";
import App from "./App.svelte";
import levenshtein from 'fast-levenshtein';
import { bierig } from "./bierig";

renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    new App({
        target: appRoot,
    });
});

function disableSend(disabled: boolean = true) {
    const buttons = document.querySelectorAll('button');
    bierig.set(disabled);
    for (const button of buttons) {
        if (button.innerText === 'Send') {
            console.log(button);
            button.disabled = disabled;
        }
    }
}

function matchesFreibier(content: string): boolean {
    const words = content.split(/\s/).filter((w) => w.length > 0);
    for (const word of words) {
        if (levenshtein.get(word, 'freibier') < 4) {
            return true;
        }
    }
    return false;
}

function handleInput(e: InputEvent) {
    if (matchesFreibier(e.target.innerText.toLowerCase())) {
        e.stopImmediatePropagation();
        e.preventDefault();
        disableSend(true);
        return;
    }
    disableSend(false);
}

function registerSendHandler() {
    const inputs = document.querySelectorAll('.allowTextSelection[role=textbox]');
    for (const input of inputs) {
        input.removeEventListener('input', handleInput);
        input.addEventListener('input', handleInput);
        input.removeEventListener('change', handleInput);
        input.addEventListener('change', handleInput);
    }
}

const observer = new MutationObserver(registerSendHandler);
observer.observe(document,
    {
        childList: true, subtree: true
    });

registerSendHandler();

