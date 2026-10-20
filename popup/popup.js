
const sourceText = document.getElementById("sourceText");
const charCount = document.getElementById("charCount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const mode = document.getElementById("mode");

const initialResult = "Your converted message will appear here.";
const API_URL = "http://127.0.0.1:8000/api/convert";

function updateCharacterCount() {
  const count = sourceText.value.length;
  charCount.textContent =
    `${count} character${count === 1 ? "" : "s"}`;
}

sourceText.addEventListener("input", updateCharacterCount);

convertBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();

  if (!text) {
    result.textContent = "Please enter a message first.";
    sourceText.focus();
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = "Connecting to backend...";
  result.textContent = "Sending your message to LinguaFlow AI...";

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || `Request failed (${response.status})`
      );
    }

    result.textContent = data.result;
  } catch (error) {
    console.error("LinguaFlow API error:", error);
    result.textContent =
      "Could not connect to the backend. Make sure the FastAPI server is running at http://127.0.0.1:8000, then try again.";
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Convert message";
  }
});

copyBtn.addEventListener("click", async () => {
  const output = result.textContent.trim();

  if (!output || output === initialResult) {
    result.textContent = "There is no result to copy yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = "Copy result";
    }, 1500);
  } catch (error) {
    result.textContent =
      "Copy failed. Please select the result and copy it manually.";
  }
});

clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  result.textContent = initialResult;
  copyBtn.textContent = "Copy result";
  updateCharacterCount();
  sourceText.focus();
});

updateCharacterCount();
