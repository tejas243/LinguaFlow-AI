
const sourceText = document.getElementById("sourceText");
const charCount = document.getElementById("charCount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const mode = document.getElementById("mode");

const initialResult = "Your converted message will appear here.";

function updateCharacterCount() {
  const count = sourceText.value.length;
  charCount.textContent =
    `${count} character${count === 1 ? "" : "s"}`;
}

sourceText.addEventListener("input", updateCharacterCount);

convertBtn.addEventListener("click", () => {
  const text = sourceText.value.trim();

  if (!text) {
    result.textContent = "Please enter a message first.";
    sourceText.focus();
    return;
  }

  let modeDescription;

  switch (mode.value) {
    case "professional":
      modeDescription = "rewritten professionally";
      break;
    case "casual":
      modeDescription = "rewritten in a friendly, casual style";
      break;
    case "grammar":
      modeDescription = "checked and corrected for grammar";
      break;
    default:
      modeDescription = "processed";
  }

  result.textContent =
    `DEMO ONLY: Your message would be ${modeDescription} here.\n\n` +
    `Original message: ${text}\n\n` +
    "Real AI conversion is not connected yet.";
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
