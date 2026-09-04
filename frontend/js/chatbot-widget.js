/**
 * QalamAid Scholarship Assistant — Chat Widget
 * Include this file on any page with:
 *   <script src="/chatbot-widget.js"></script>
 * It self-injects a floating chat bubble + window and talks to /api/chatbot.
 */
(function () {
    const API_URL = '/api/chatbot'; // relative — works on same origin as backend

    // ── Styles ──────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #qa-chat-bubble {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #065f46;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            z-index: 9999;
            border: none;
            transition: transform 0.2s ease;
        }
        #qa-chat-bubble:hover { transform: scale(1.08); }

        #qa-chat-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 340px;
            max-width: 90vw;
            height: 460px;
            max-height: 70vh;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        #qa-chat-window.qa-open { display: flex; }

        #qa-chat-header {
            background: #065f46;
            color: #fff;
            padding: 14px 16px;
            font-weight: 700;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #qa-chat-close {
            cursor: pointer;
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            line-height: 1;
        }

        #qa-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .qa-msg {
            max-width: 80%;
            padding: 10px 13px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            white-space: pre-wrap;
        }
        .qa-msg-bot {
            background: #e6f4ef;
            color: #0f172a;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }
        .qa-msg-user {
            background: #065f46;
            color: #fff;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }
        .qa-msg-typing {
            background: #e6f4ef;
            color: #64748b;
            align-self: flex-start;
            font-style: italic;
        }

        #qa-chat-input-row {
            display: flex;
            border-top: 1px solid #e2e8f0;
            padding: 10px;
            gap: 8px;
        }
        #qa-chat-input {
            flex: 1;
            border: 1px solid #cbd5e1;
            border-radius: 20px;
            padding: 9px 14px;
            font-size: 14px;
            outline: none;
        }
        #qa-chat-input:focus { border-color: #065f46; }

        #qa-chat-send {
            background: #065f46;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 0 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        #qa-chat-send:disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // ── Markup ──────────────────────────────────────────────
    const bubble = document.createElement('button');
    bubble.id = 'qa-chat-bubble';
    bubble.setAttribute('aria-label', 'Open scholarship assistant chat');
    bubble.textContent = '💬';

    const win = document.createElement('div');
    win.id = 'qa-chat-window';
    win.innerHTML = `
        <div id="qa-chat-header">
            <span>Qalam Aid Assistant</span>
            <button id="qa-chat-close" aria-label="Close chat">✕</button>
        </div>
        <div id="qa-chat-messages"></div>
        <div id="qa-chat-input-row">
            <input id="qa-chat-input" type="text" placeholder="Ask about scholarships..." autocomplete="off" />
            <button id="qa-chat-send">Send</button>
        </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    const messagesEl = win.querySelector('#qa-chat-messages');
    const inputEl = win.querySelector('#qa-chat-input');
    const sendBtn = win.querySelector('#qa-chat-send');
    const closeBtn = win.querySelector('#qa-chat-close');

    let greeted = false;

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = 'qa-msg ' + (sender === 'user' ? 'qa-msg-user' : 'qa-msg-bot');
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function addTyping() {
        const div = document.createElement('div');
        div.className = 'qa-msg qa-msg-typing';
        div.textContent = 'Typing...';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputEl.value = '';
        sendBtn.disabled = true;

        const typingEl = addTyping();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();

            typingEl.remove();

            if (res.ok && data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage(data.message || 'Sorry, something went wrong. Please try again.', 'bot');
            }
        } catch (err) {
            typingEl.remove();
            addMessage('Connection error. Please check your internet and try again.', 'bot');
        } finally {
            sendBtn.disabled = false;
            inputEl.focus();
        }
    }

    bubble.addEventListener('click', () => {
        win.classList.toggle('qa-open');
        if (win.classList.contains('qa-open')) {
            inputEl.focus();
            if (!greeted) {
                greeted = true;
                addMessage("Hi! I'm the Qalam Aid scholarship assistant. Ask me anything about applying, verification, or donations.", 'bot');
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        win.classList.remove('qa-open');
    });

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();