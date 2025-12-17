;(function () {
    // UNIQUE CHAT ID - Persistent across sessions
    if (!window.chatSessionId) {
        window.chatSessionId =
            "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("chat_session_id", window.chatSessionId)
    }
    console.log("🆔 Chat Session ID:", window.chatSessionId)

    const WEBHOOK_URL =
        "https://5c55250bdb3c.ngrok-free.app/webhook/incoming-message"

    // Create floating AI button
    const aiBtn = document.createElement("div")
    aiBtn.innerHTML = "🤖"
    Object.assign(aiBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        cursor: "pointer",
        zIndex: "100000",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
        border: "2px solid rgba(255,255,255,0.2)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
    })

    // Hover animations
    aiBtn.addEventListener("mouseenter", () => {
        aiBtn.style.transform = "scale(1.1) rotate(5deg)"
        aiBtn.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.6)"
    })
    aiBtn.addEventListener("mouseleave", () => {
        aiBtn.style.transform = "scale(1)"
        aiBtn.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.4)"
    })

    // Main chat container
    const chatBox = document.createElement("div")
    Object.assign(chatBox.style, {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "360px",
        maxHeight: "500px",
        background: "rgba(255, 255, 255, 0.95)",
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
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    })

    // Header with close button
    const header = document.createElement("div")
    header.innerHTML = `
        <span style="font-weight: 600; font-size: 16px;">AI Assistant</span>
        <button id="closeChat" style="
            background: none; border: none; font-size: 20px; cursor: pointer;
            color: #aaa; float: right; padding: 4px; border-radius: 50%;
            width: 32px; height: 32px; display: flex; align-items: center;
            justify-content: center; transition: all 0.2s;
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

    // Messages container
    const messages = document.createElement("div")
    Object.assign(messages.style, {
        flex: "1",
        padding: "20px",
        overflowY: "auto",
        fontSize: "15px",
        maxHeight: "350px",
        scrollBehavior: "smooth",
    })
    messages.innerHTML = `
        <div class="message ai-message" style="
            background: linear-gradient(135deg, #f0f2ff 0%, #e8ecff 100%);
            padding: 12px 16px; border-radius: 18px; margin-bottom: 12px;
            max-width: 85%; border-bottom-right-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
            <span style="font-weight: 500; color: #4a5568;">AI</span>
            <div style="margin-top: 4px; color: #2d3748;">Hi 👋 How can I help you today?</div>
        </div>
    `

    // Input area
    const inputWrap = document.createElement("div")
    Object.assign(inputWrap.style, {
        display: "flex",
        padding: "16px 20px",
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
        background: "#fff",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    })

    input.addEventListener("focus", () => {
        input.style.borderColor = "#667eea"
        input.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
    })
    input.addEventListener("blur", () => {
        input.style.borderColor = "#e2e8f0"
        input.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)"
    })

    const sendBtn = document.createElement("button")
    sendBtn.innerHTML = "➤"
    Object.assign(sendBtn.style, {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        marginLeft: "12px",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    })

    sendBtn.addEventListener(
        "mouseenter",
        () => (sendBtn.style.transform = "scale(1.05)")
    )
    sendBtn.addEventListener(
        "mouseleave",
        () => (sendBtn.style.transform = "scale(1)")
    )

    // Assemble components
    inputWrap.append(input, sendBtn)
    chatBox.append(header, messages, inputWrap)
    document.body.append(aiBtn, chatBox)

    // Toggle functionality
    function toggleChat() {
        const isVisible = chatBox.style.display !== "none"
        chatBox.style.display = isVisible ? "none" : "flex"
        if (!isVisible)
            setTimeout(() => (messages.scrollTop = messages.scrollHeight), 100)
    }

    aiBtn.onclick = toggleChat
    header.querySelector("#closeChat").onclick = (e) => {
        e.stopPropagation()
        toggleChat()
    }

    // FIXED sendMessage function with chat_id
    async function sendMessage() {
        const text = input.value.trim()
        if (!text) return

        // Add user message
        const userMsg = document.createElement("div")
        userMsg.innerHTML = `
            <span style="font-weight: 500; color: #667eea;">You</span>
            <div style="margin-top: 4px; color: #2d3748;">${text}</div>
        `
        Object.assign(userMsg.style, {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "18px",
            marginBottom: "12px",
            maxWidth: "85%",
            marginLeft: "auto",
            borderBottomLeftRadius: "4px",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
        })
        messages.appendChild(userMsg)
        input.value = ""
        messages.scrollTop = messages.scrollHeight

        // Show typing indicator
        input.disabled = true
        sendBtn.style.opacity = "0.5"
        const typingIndicator = document.createElement("div")
        typingIndicator.innerHTML = `
            <span style="font-weight: 500; color: #4a5568;">AI</span>
            <div style="margin-top: 4px; color: #a0aec0; font-style: italic;">Typing...</div>
        `
        Object.assign(typingIndicator.style, {
            background: "rgba(240, 242, 255, 0.5)",
            padding: "12px 16px",
            borderRadius: "18px",
            marginBottom: "12px",
            maxWidth: "85%",
        })
        messages.appendChild(typingIndicator)
        messages.scrollTop = messages.scrollHeight

        try {
            const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    channel: "website",
                    timestamp: Date.now(),
                    chat_id: window.chatSessionId, // ✅ UNIQUE CHAT ID
                }),
            })

            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const data = await res.json()
            console.log("🔍 WEBHOOK RESPONSE:", data)

            const replyText =
                data.reply ||
                data.message ||
                data.text ||
                data.response ||
                JSON.stringify(data) ||
                "No response received"

            typingIndicator.remove()

            // Add AI response
            const aiMsg = document.createElement("div")
            aiMsg.innerHTML = `
                <span style="font-weight: 500; color: #4a5568;">AI</span>
                <div style="margin-top: 4px; color: #2d3748; line-height: 1.5;">${replyText}</div>
            `
            Object.assign(aiMsg.style, {
                background: "linear-gradient(135deg, #f0f2ff 0%, #e8ecff 100%)",
                padding: "12px 16px",
                borderRadius: "18px",
                marginBottom: "12px",
                maxWidth: "85%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            })
            messages.appendChild(aiMsg)
            messages.scrollTop = messages.scrollHeight
        } catch (err) {
            typingIndicator.remove()
            const errorMsg = document.createElement("div")
            errorMsg.innerHTML = `
                <span style="font-weight: 500; color: #e53e3e;">AI</span>
                <div style="margin-top: 4px; color: #e53e3e;">Error: ${err.message}</div>
            `
            Object.assign(errorMsg.style, {
                background: "rgba(253, 242, 248, 0.8)",
                padding: "12px 16px",
                borderRadius: "18px",
                marginBottom: "12px",
                maxWidth: "85%",
                borderLeft: "4px solid #e53e3e",
            })
            messages.appendChild(errorMsg)
            messages.scrollTop = messages.scrollHeight
        } finally {
            input.disabled = false
            sendBtn.style.opacity = "1"
            input.focus()
        }
    }

    // Event listeners
    sendBtn.onclick = sendMessage
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    })

    chatBox.addEventListener("transitionend", () => {
        if (chatBox.style.display !== "none") input.focus()
    })

    // Prevent body scroll
    chatBox.addEventListener(
        "mouseenter",
        () => (document.body.style.overflow = "hidden")
    )
    chatBox.addEventListener(
        "mouseleave",
        () => (document.body.style.overflow = "")
    )

    console.log(
        "✅ AI Chat Widget loaded with UNIQUE CHAT ID:",
        window.chatSessionId
    )
})()
