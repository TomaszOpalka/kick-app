# kick-app
prosta apka, gdzie scrapowany jest chat po komendzie "bw:"  

pomysł to zautomatyzowanie tworzenia listy w wirtualnych bezwartościowych zakładach między widownią na kick
w którym skrót BW odnosi się do sformułowania bid wounded / brutally wounded, gdzie użytkownicy chatu obstawiają
kiedy będzie miała miejsce taka sytuacja podając godzinę z minutami. ( w małym community wystarczające )


# Jak użyć? 
po pobraniu  odpalić  na power shellu plik główny, node server.js
następnie na osobnym power shellu \frontent  npm start
konieczne jest pobranie wtyczki tampermonkey  i wklejenie tego banalnego skryptu co jest podany poniżej 

pozdrawiam dohu_ja

PS: skopiuj wszystko  UserScript do dołu 

// ==UserScript==
// @name         Kick BW Tracker (DEBUG)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  DEBUG wersja: loguje wszystko i wysyła typy na backend
// @match        https://kick.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const SERVER_URL = 'http://localhost:3001/bw';

    function sendBW(user, value) {
  // //    console.log('🔥 DEBUG - Próba wysłania:', { user, value });
  // //     console.log(`📤 Wysyłam: ${user} => ${value}`);
        fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, value })
        })
        .then(res => res.json())
        .then(data => console.log('✅ Odpowiedź z backendu:', data))
        .catch(err => console.error('❌ Błąd wysyłania:', err));
    }

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.innerText) {
                    const text = node.innerText.trim();
                    console.log('💬 Nowa wiadomość:', text);
                    const match = text.match(/^([^\n:]+)(?:\n|:).*bw\s*[:]?\s*([^\n]+)/i);
                    if (match) {
                        const user = match[1].trim();
                        const value = match[2].trim();
           /////    //         console.log(`🔍 Dopasowano: ${user} - "${value}"`);
                        sendBW(user, value);
                    }
                }
            }
        }
    });

    function waitForChat() {
        const chat = document.querySelector("#chatroom-messages");
        if (chat) {
            console.log('✅ Chat znaleziony, start obserwatora');
            observer.observe(chat, { childList: true, subtree: true });
        } else {
            console.log('⏳ Szukam czatu...');
            setTimeout(waitForChat, 1000);
        }
    }

    waitForChat();
})();

