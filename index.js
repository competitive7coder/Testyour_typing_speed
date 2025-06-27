document.addEventListener("DOMContentLoaded", () => {
  async function fetchTypingParagraph() {
    try {
      const response = await fetch("https://baconipsum.com/api/?type=meat-and-filler&sentences=4&format=text");
      const text = await response.text();
      const cleanText = text.split(/\s+/).slice(0, 50).join(" ");
      const container = document.getElementById("generated-text");
      container.innerHTML = "";
      window.generatedText = cleanText;

      for (let i = 0; i < cleanText.length; i++) {
        const span = document.createElement("span");
        span.textContent = cleanText[i];
        span.setAttribute("data-index", i);
        span.classList.add("inline-block", "text-gray-200", "font-mono", "text-lg", "whitespace-pre");
        container.appendChild(span);
      }
    } catch (err) {
      console.error("Paragraph fetch failed", err);
      document.getElementById("generated-text").textContent = "Could not load text.";
    }
  }

  function handleTyping() {
    const input = userInput.value;
    const spans = document.querySelectorAll("#generated-text span");
    correctChars = 0;
    totalTyped = input.length;

    spans.forEach((span, i) => {
      span.classList.remove("text-green-400", "bg-red-500", "text-white");
      if (input[i] == null) return;
      if (input[i] === span.textContent) {
        span.classList.add("text-green-400");
        correctChars++;
      } else {
        span.classList.add("bg-red-500", "text-white");
      }
    });
  }

  let timerInterval;
  let timeLeft = 0;
  let timerStarted = false;
  let correctChars = 0;
  let totalTyped = 0;

  const userInput = document.getElementById("user-input");
  const durationSelect = document.getElementById("test-duration");
  const timerDisplay = document.getElementById("countdown-timer");
  const newTestBtn = document.getElementById("new-test-btn");
  const submitBtn = document.getElementById("submit-btn");

  function startTimer(duration) {
    timeLeft = duration;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        userInput.disabled = true;
        showResults();
      }
    }, 1000);
  }

  function updateTimerDisplay(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }

  function showResults() {
    const wordsTyped = totalTyped / 5;
    const totalTime = parseInt(durationSelect.value) / 60;
    const wpm = Math.round(wordsTyped / totalTime);
    const accuracy = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);

    const resultBox = document.createElement("div");
    resultBox.className = "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50";
    resultBox.innerHTML = `
      <div class="bg-white text-gray-800 p-8 rounded-xl shadow-2xl text-center space-y-4">
        <h2 class="text-2xl font-bold">🏁Test Completed🔥</h2>
        <p class="text-lg">WPM: <span class="font-semibold">${wpm}</span></p>
        <p class="text-lg">Accuracy: <span class="font-semibold">${accuracy}%</span></p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="location.reload()">Restart</button>
      </div>
    `;
    document.body.appendChild(resultBox);
  }

  userInput.addEventListener("input", handleTyping);

  userInput.addEventListener("keydown", () => {
    if (!timerStarted) {
      const selectedTime = parseInt(durationSelect.value);
      userInput.disabled = false;
      startTimer(selectedTime);
      timerStarted = true;
    }
  });

  newTestBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerStarted = false;
    correctChars = 0;
    totalTyped = 0;
    userInput.disabled = false;
    userInput.value = "";
    timerDisplay.textContent = "00:00";
    fetchTypingParagraph();
  });

  submitBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    userInput.disabled = true;
    showResults();
  });

  fetchTypingParagraph();
});
