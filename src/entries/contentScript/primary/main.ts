import renderContent from "../renderContent";
import App from "./App.svelte";
import levenshtein from 'fast-levenshtein';
import { bierig } from "./bierig";

renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    new App({
        target: appRoot,
    });
});

function interceptSend(e: KeyboardEvent) {
    if ((e.target as HTMLElement).matches('.allowTextSelection[role=textbox]') && e.key === 'Enter' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
    }
}

function disableSend(disabled: boolean = true) {
    const buttons = document.querySelectorAll('button');
    bierig.set(disabled);
    for (const button of buttons) {
        if (button.innerText === 'Send' || button.innerText === 'Senden') {
            console.log(button);
            button.disabled = disabled;
        }
    }
    if (disabled) {
        document.addEventListener('keydown', interceptSend, true);
        document.addEventListener('keyup', interceptSend, true);
        document.addEventListener('keypress', interceptSend, true);
    } else {
        document.removeEventListener('keydown', interceptSend);
        document.removeEventListener('keyup', interceptSend);
        document.removeEventListener('keypress', interceptSend);
    }
}

const naughtyWords = ['freibier', 'bier', 'beer'];

function matchesFreibier(content: string): boolean {
    const words = content.split(/\s/).filter((w) => w.length > 0);
    for (const word of words) {
        for (const naughtyWord of naughtyWords) {
            console.log(naughtyWord);
            if (levenshtein.get(word, naughtyWord) < Math.ceil(naughtyWord.length / 2)) {
                return true;
            }
        }
    }
    return false;
}

function handleInput(e: InputEvent) {
    const content = (e.target as HTMLElement).innerText;
    const freibier = matchesFreibier(content.toLowerCase());
    disableSend(freibier);
}

function registerSendHandler() {
    const inputs = document.querySelectorAll('.allowTextSelection[role=textbox]');
    let freibier = false;
    for (const input of inputs) {
        input.removeEventListener('input', handleInput);
        input.addEventListener('input', handleInput);
        input.removeEventListener('change', handleInput);
        input.addEventListener('change', handleInput);
        freibier ||= matchesFreibier((input as HTMLElement).innerText.toLowerCase());
    }
    disableSend(freibier);
}

const observer = new MutationObserver(registerSendHandler);
observer.observe(document,
    {
        childList: true, subtree: true
    });

registerSendHandler();

