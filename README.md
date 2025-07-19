# Kick Chat Logger

A simple Tampermonkey script that adds a button below the chat on [kick.com](https://kick.com).

## What does it do?

- Collects all live chat messages.
- Displays them in the browser console (Developer Mode).
- Adds a "Download chat" button to download the entire chat log as a text file.

## How to use?

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Add the Kick Chat Logger script to Tampermonkey (via raw URL or manually).
3. When you enter a stream on kick.com, refresh the page so the script can initialize correctly.
4. A "Download chat" button will appear below the chat.
5. You can also watch the logs live in the browser console (F12 → Console tab).

## Notes

- The script only starts working after the page and chat are fully loaded, so refreshing the page is necessary for proper initialization.
- It supports emojis displayed as text.

