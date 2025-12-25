<script>
;(function () {
    // UNIQUE CHAT ID - Persistent across sessions
    if (!window.chatSessionId) {
        window.chatSessionId =
            "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("chat_session_id", window.chatSessionId)
    }
    console.log("🆔 Chat Session ID:", window.chatSessionId)

    const WEBHOOK_URL =
        "https://mpwebautomations.app.n8n.cloud/webhook-test/incoming-messages"

    // ==============================
    // FLOATING AI BUTTON (WHITE + ORANGE)
    // ==============================
    const aiBtn = document.createElement("div")
    aiBtn.innerHTML = "AI"
    Object.assign(aiBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        background: "#ffffff", // ✅ white background
        color: "#f97316", // ✅ orange text
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "700",
        cursor: "pointer",
        zIndex: "100000",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        border: "3px solid #f97316", // ✅ orange border
        transition: "all 0.3s ease",
    })

    aiBtn.addEventListener("mouseenter", () => {
        aiBtn.style.transform = "scale(1.08)"
        aiBtn.style.boxShadow = "0 12px 32px rgba(249,115,22,0.4)"
    })

    aiBtn.addEventListener("mouseleave", () => {
        aiBtn.style.transform = "scale(1)"
        aiBtn.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"
    })

    // ==============================
    // CHAT CONTAINER
    // ==============================
    const chatBox = document.createElement("div")
    Object.assign(chatBox.style, {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "360px",
        maxHeight: "500px",
        background: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: "100000",
        border: "1px solid rgba(255,255,255,0.2)",
    })

    // ==============================
    // HEADER
    // ==============================
    const header = document.createElement("div")
    header.innerHTML = `
        <span style="font-weight:600;font-size:16px;">AI Assistant</span>
        <button id="closeChat" style="
            background:none;
            border:none;
            font-size:20px;
            cursor:pointer;
            color:#fff;
        ">×</button>
    `
    Object.assign(header.style, {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    })

    // ==============================
    // MESSAGES
    // ==============================
    const messages = document.createElement("div")
    Object.assign(messages.style, {
        flex: "1",
        padding: "20px",
        overflowY: "auto",
        fontSize: "15px",
        maxHeight: "350px",
    })

    messages.innerHTML = `
        <div style="
            background:#f0f2ff;
            padding:12px 16px;
            border-radius:18px;
            margin-bottom:12px;
            max-width:85%;
        ">
            <strong>AI</strong>
            <div style="margin-top:4px;">
                Hi 👋 How can I help you today?
            </div>
        </div>
    `

    // ==============================
    // INPUT AREA
    // ==============================
    const inputWrap = document.createElement("div")
    Object.assign(inputWrap.style, {
        display: "flex",
        padding: "16px",
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
    })

    const input = document.createElement("input")
    input.placeholder = "Type your message..."
    Object.assign(input.style, {
        flex: "1",
        padding: "12px 16px",
        border: "2px solid #e2e8f0",
        borderRadius: "24px",
        outline: "none",
        fontSize: "15px",
    })

    const sendBtn = document.createElement("button")
    sendBtn.innerHTML = "➤"
    Object.assign(sendBtn.style, {
        background: "#667eea",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        marginLeft: "10px",
        cursor: "pointer",
        fontSize: "18px",
    })

    inputWrap.append(input, sendBtn)
    chatBox.append(header, messages, inputWrap)
    document.body.append(aiBtn, chatBox)

    // ==============================
    // TOGGLE
    // ==============================
    function toggleChat() {
        chatBox.style.display =
            chatBox.style.display === "none" ? "flex" : "none"
    }

    aiBtn.onclick = toggleChat
    header.querySelector("#closeChat").onclick = toggleChat

    // ==============================
    // SEND MESSAGE
    // ==============================
    async function sendMessage() {
        const text = input.value.trim()
        if (!text) return

        const userMsg = document.createElement("div")
        userMsg.innerHTML = `<strong>You</strong><div>${text}</div>`
        Object.assign(userMsg.style, {
            background: "#667eea",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "18px",
            marginBottom: "12px",
            maxWidth: "85%",
            marginLeft: "auto",
        })
        messages.appendChild(userMsg)
        input.value = ""

        try {
            const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    chat_id: window.chatSessionId,
                    channel: "website",
                }),
            })

            const data = await res.json()
            const reply = data.reply || "Thanks! We’ll get back to you."

            const aiMsg = document.createElement("div")
            aiMsg.innerHTML = `<strong>AI</strong><div>${reply}</div>`
            Object.assign(aiMsg.style, {
                background: "#f0f2ff",
                padding: "12px 16px",
                borderRadius: "18px",
                marginBottom: "12px",
                maxWidth: "85%",
            })
            messages.appendChild(aiMsg)
        } catch (err) {
            alert("Error sending message")
        }

        messages.scrollTop = messages.scrollHeight
    }

    sendBtn.onclick = sendMessage
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage()
    })

    console.log("✅ AI Chat Widget Loaded")
})()
</script>

