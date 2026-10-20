
const sourceText = document.getElementById("sourceText");
const charCount = document.getElementById("charCount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const mode = document.getElementById("mode");
const aiStatus = document.getElementById("aiStatus");

const initialResult = "Your converted message will appear here.";
const API_URL = "http://127.0.0.1:8000/api/convert";

function updateCharacterCount() {
  const count = sourceText.value.length;
  charCount.textContent =
    `${count} character${count === 1 ? "" : "s"}`;
}

function showResult(message) {
  result.textContent = message;
}

function setLoading(isLoading) {
  convertBtn.disabled = isLoading;
  convertBtn.textContent = isLoading
    ? "Converting with AI..."
    : "Convert message";
}

sourceText.addEventListener("input", updateCharacterCount);

convertBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();

  if (!text) {
    showResult("Please enter a message first.");
    sourceText.focus();
    return;
  }

  if (text.length > 3000) {
    showResult("Please keep your message under 3000 characters.");
    return;
  }

  setLoading(true);
  aiStatus.textContent = "CONNECTING";
  showResult("Sending your message to LinguaFlow AI...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        mode: mode.value
      })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      const message =
        typeof data.detail === "string"
          ? data.detail
          : `Server error (${response.status})`;

      throw new Error(message);
    }

    if (
      typeof data.result !== "string" ||
      !data.result.trim()
    ) {
      throw new Error("The AI returned an empty result.");
    }

    showResult(data.result.trim());
    aiStatus.textContent = "AI CONNECTED";

  } catch (error) {
    console.error("LinguaFlow AI error:", error);

    if (error instanceof TypeError) {
      showResult(
        "Could not connect to the backend. Make sure FastAPI is " +
        "running at http://127.0.0.1:8000, then try again."
      );
    } else {
      showResult(`Conversion failed: ${error.message}`);
    }

    aiStatus.textContent = "AI ERROR";

  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener("click", async () => {
  const output = result.textContent.trim();

  if (!output || output === initialResult) {
    showResult("There is no result to copy yet.");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);

    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = "Copy result";
    }, 1500);

  } catch (error) {
    console.error("Copy error:", error);

    showResult(
      "Copy failed. Please select the result and copy it manually."
    );
  }
});

clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  showResult(initialResult);

  aiStatus.textContent = "AI READY";
  copyBtn.textContent = "Copy result";

  updateCharacterCount();
  sourceText.focus();
});

updateCharacterCount();
