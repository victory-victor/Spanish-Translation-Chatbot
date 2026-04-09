// Initial Entrance Animation for the UI
window.onload = () => {
    gsap.to(".chat-container", {
        duration: 1,
        autoAlpha: 1,
        y: -20,
        ease: "power4.out"
    });
    
    // Animate the initial welcome message
    const welcomeMsg = document.querySelector(".bot");
    if(welcomeMsg) {
        gsap.from(welcomeMsg, {
            duration: 0.8,
            opacity: 0,
            x: -30,
            delay: 0.5,
            ease: "back.out(1.7)"
        });
    }
    // ✅ Speak welcome message ONCE when page loads
    speakSpanish(
        "¡Bienvenidos! Type any English phrase, and I'll translate it to Español—fast, easy, and fun. ¡Vamos!"
    );
};

// ✅ Add a message to chat box with GSAP animation
function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    
    msg.classList.add("message", sender);
    msg.innerText = text;

    chatBox.appendChild(msg);

    // Modern "Pop" animation using GSAP
    gsap.from(msg, {
        duration: 0.4,
        scale: 0.8,
        opacity: 0,
        y: 20,
        ease: "back.out(2)",
        onComplete: () => {
            chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll
        }
    });
}

// ✅ Handle Enter key
function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// ✅ Speak Spanish text using Web Speech API (robust version)
function speakSpanish(text) {
    if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported in this browser");
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES"; 
    utterance.rate = 1;        
    utterance.pitch = 1;       

    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
}

// ✅ Send message to backend and receive translation
async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message with animation
    addMessage(text, "user"); 
    input.value = "";

    try {
        // 2. Fetch from your Python/Flask backend
        const response = await fetch("https://spanish-translation-chatbot.onrender.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        const translated = data.translated || "❌ Error";

        // 3. Show bot message & Speak
        addMessage(translated, "bot");
        speakSpanish(translated);

    } catch (error) {
        console.error("Backend Error:", error);
        addMessage("⚠️ Cannot connect to server", "bot");
    }
}