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

bierig.subscribe((bierig) => {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
        if (button.innerText === 'Send' || button.innerText === 'Senden') {
            button.disabled = bierig;
        }
    }
    if (bierig) {
        document.addEventListener('keydown', interceptSend, true);
        document.addEventListener('keyup', interceptSend, true);
        document.addEventListener('keypress', interceptSend, true);
    } else {
        document.removeEventListener('keydown', interceptSend);
        document.removeEventListener('keyup', interceptSend);
        document.removeEventListener('keypress', interceptSend);
    }
});

const naughtyWords = ['freibier', 'bier', 'beer'];

function matchesFreibier(content: string): boolean {
    const words = content.split(/\s/).filter((w) => w.length > 0);
    for (const word of words) {
        for (const naughtyWord of naughtyWords) {
            if (levenshtein.get(word, naughtyWord) < Math.ceil(naughtyWord.length / 2)) {
                return true;
            }
        }
    }
    return false;
}

function checkElement(element: any) {
    return matchesFreibier(((element as HTMLElement).innerText || (element as HTMLInputElement).value).toLowerCase());
}

function handleInput(each: (input: Element) => void) {
    const inputs = document.querySelectorAll('.allowTextSelection[role=textbox]');
    let freibier = false;
    for (const input of inputs) {
        freibier ||= checkElement(input);
        each(input);
    }
    bierig.set(freibier);
}

function handleInputEvent() {
    handleInput(() => {});
}

function registerSendHandler() {
    handleInput((input) => {
        input.removeEventListener('input', handleInputEvent);
        input.addEventListener('input', handleInputEvent);
        input.removeEventListener('change', handleInputEvent);
        input.addEventListener('change', handleInputEvent);
    });
}

const observer = new MutationObserver(registerSendHandler);
observer.observe(document,
    {
        childList: true, subtree: true
    });

registerSendHandler();

