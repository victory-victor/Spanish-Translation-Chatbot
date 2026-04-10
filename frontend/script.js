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
    if (welcomeMsg) {
        gsap.from(welcomeMsg, {
            duration: 0.8,
            opacity: 0,
            x: -30,
            delay: 0.5,
            ease: "back.out(1.7)"
        });
    }
};

document.addEventListener("click", () => {
    speakText("Hola Bonjour Hallo नमस्ते مرحبا こんにちは 你好! Transform your English into a powerful global voice — translate instantly into Español, Français, Deutsch, हिन्दी, العربية, 日本語, and 中文, and connect, share, and be understood everywhere, effortlessly! ¡Vamos!");
}, { once: true });

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
function speakText(text, language) {
    if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported");
        return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Language mapping
    const langMap = {
        Hindi: "hi-IN",
        Urdu: "ur-PK",
        Chinese: "zh-CN",
        Japanese: "ja-JP",
        Spanish: "es-ES",
        French: "fr-FR",
        German: "de-DE",
        Portuguese: "pt-PT",
        Russian: "ru-RU",
        Arabic: "ar-SA",
        English: "en-US"
    };

    utterance.lang = langMap[language] || "es-ES";
    utterance.rate = 1;
    utterance.pitch = 1;

    // Small delay for smoother speech
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
}

// ✅ Send message to backend and receive translation
async function sendMessage() {

    const fromLang = document.getElementById("from-lang").value;
    const toLang = document.getElementById("to-lang").value;
    
    const input = document.getElementById("user-input");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message with animation
    addMessage(text, "user");
    input.value = "";

    try {
        const response = await fetch("https://spanish-translation-chatbot.onrender.com/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                fromLang,
                toLang
            })
        });

        const data = await response.json();
        const translated = data.translated || "❌ Error";

        // 3. Show bot message & Speak
        addMessage(translated, "bot");
        speakText(translated, toLang);

    } catch (error) {
        console.error("Backend Error:", error);
        addMessage("⚠️ Cannot connect to server", "bot");
    }
}