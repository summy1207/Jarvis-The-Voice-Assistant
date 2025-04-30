const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let initialized = false; // Flag to track initialization status

function speak(text, lang = 'en-US') {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.lang = lang;
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
        speak("Initializing JARVIS..");
        wishMe();
        initialized = true; // Set initialized to true after initialization
    }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

function playExactSong(song) {
    const songUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`;
    window.open(songUrl, "_blank");
    speak(`Playing ${song} on YouTube...`);
}

function getWeather(city) {
    const apiKey = 'YOUR_API_KEY'; // Replace 'YOUR_API_KEY' with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const description = data.weather[0].description;
            const temp = Math.round(data.main.temp);
            speak(`The weather in ${city} is ${description} with a temperature of ${temp} degrees Celsius.`);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            speak("Sorry, I couldn't retrieve the weather information.");
        });
}

function getCurrentDateTime() {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    speak(`Today's date is ${currentDate} and the current time is ${currentTime}`);
}

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString();
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString();
        speak("Today's date is " + date);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    } else if (message.includes('weather in')) {
        const city = message.replace("weather in", "").trim();
        getWeather(city);
    } else if (message.includes('date and time')) {
        getCurrentDateTime();
    } else if (message.includes('play')) {
        const song = message.replace("play", "").trim();
        playExactSong(song);
    } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("I found some information for " + message + " on Google");
    }
}
