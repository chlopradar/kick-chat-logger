// ==UserScript==
// @name         Kick Chat Logger - pełny zapis z emotkami i sekundami
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Loguje czat z Kick z emotkami i sekundami, eksport do pliku
// @match        https://kick.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const chatContainerSelector = '#chatroom-messages';
    const messages = [];

    function createDownloadButton() {
        const btn = document.createElement('button');
        btn.innerText = 'Download chat';
        btn.style.position = 'fixed';
        btn.style.bottom = '10px';
        btn.style.right = '170px';
        btn.style.zIndex = 1000;
        btn.onclick = () => {
            const blob = new Blob([messages.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_kick_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        document.body.appendChild(btn);
    }

    function extractTextAndEmotes(elem) {
        let result = '';
        elem.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG' && node.alt) {
                    result += node.alt; // np. :OMEGALUL:
                } else {
                    result += extractTextAndEmotes(node);
                }
            }
        });
        return result;
    }

    function formatTime(date) {
        return `[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]`;
    }

    function initObserver() {
        const chatContainer = document.querySelector(chatContainerSelector);
        if (!chatContainer) {
            console.log("Kick Chat Logger - szuka kontenera...");
            setTimeout(initObserver, 2000);
            return;
        }

        console.log("Kick Chat Logger - aktywne");

        createDownloadButton();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const msgElem = node.querySelector('span.font-normal.leading-\\[1\\.55\\]');
                        if (!msgElem) return;

                        const content = extractTextAndEmotes(msgElem).trim();
                        if (!content) return;

                        const timestamp = formatTime(new Date());
                        const line = `${timestamp} ${content}`;
                        messages.push(line);
                        console.log(line);
                    }
                });
            });
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    initObserver();
})();
