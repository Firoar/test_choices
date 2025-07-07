// server.js
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storySessions = new Map();

const questionContext = {
  1: "Economics - Capitalism vs Socialism",
  2: "Education Access - Merit vs Equity",
  3: "Gender Equality - Liberal vs Traditional",
  4: "Technology Access - Open vs Proprietary",
  5: "Wealth Distribution - Redistribution vs Trickle-down",
};

function generateSystemPrompt(studentAnswers) {
  const answerContext = Object.entries(studentAnswers)
    .map(
      ([questionId, answer]) =>
        `Q${questionId} (${questionContext[questionId]}): Student chose "${answer}"`
    )
    .join("\n");

  return `
You are "The Perspective Guide" - an expert storyteller creating interactive narratives set in contemporary India.

STUDENT'S CURRENT BELIEFS:
${answerContext}

YOUR MISSION:
Create an engaging, branching story that SUBTLY challenges the student's perspectives through realistic scenarios. The story should:

1. Be set in modern India with relatable characters and situations
2. Present scenarios where the student's chosen positions face realistic challenges
3. Offer choices that gradually introduce opposing viewpoints
4. Never be preachy or direct - let the story naturally reveal complexities
5. Use emotional engagement and practical examples from Indian society
6. Each scene should be 120-150 words maximum
7. Provide 2-3 meaningful choices that advance the narrative

RESPONSE FORMAT (JSON only):
{
  "scene": "Vivid description of the current scenario...",
  "choices": [
    {"id": "A", "text": "Choice description that subtly challenges student's view"},
    {"id": "B", "text": "Choice that reinforces but shows complexity"},
    {"id": "C", "text": "Choice that introduces alternative perspective"}
  ],
  "reflection": "Brief note on which belief is being challenged"
}

TONE: Engaging, realistic, thought-provoking but not judgmental.
SETTING: Contemporary India - cities, villages, institutions, families.
CHARACTERS: Relatable Indians from various backgrounds.
`;
}

function generateContinuationPrompt(previousChoice) {
  return `
The student chose: "${previousChoice}"

Continue the story based on this choice. Remember to:
- Show realistic consequences of the chosen path
- Introduce new dilemmas that challenge their original quiz responses
- Keep the Indian context authentic and relatable
- Build emotional investment in characters
- Gradually reveal complexities in their initial positions

Continue with the same JSON format.
`;
}

//Helper: Call Ollama's phi model and collect the full response
async function callPhiModel(prompt) {
  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "phi",
      prompt: prompt,
      stream: false,
    },
    { timeout: 120000 * 2 }
  );
  // Ollama returns { response: "...", ... }
  return response.data.response;
}

// Start a new story session
app.post("/api/story/start", async (req, res) => {
  try {
    const { studentId, quizAnswers } = req.body;
    if (!studentId || !quizAnswers) {
      return res
        .status(400)
        .json({ error: "Missing studentId or quizAnswers" });
    }

    const sessionId = uuidv4();
    const systemPrompt = generateSystemPrompt(quizAnswers);

    // Compose the initial prompt for phi
    const userPrompt =
      "Start an engaging story that will challenge my perspectives. Begin with a compelling opening scenario.";
    const fullPrompt = systemPrompt + "\n" + userPrompt;

    // Call phi model
    const phiResponse = await callPhiModel(fullPrompt);

    // Try to parse JSON from phi's response
    let storyData;
    try {
      storyData = JSON.parse(phiResponse);
    } catch {
      // If phi's output is not valid JSON, try to extract JSON substring
      const match = phiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        storyData = JSON.parse(match[0]);
      } else {
        throw new Error("Phi model did not return valid JSON.");
      }
    }

    storySessions.set(sessionId, {
      id: sessionId,
      studentId,
      quizAnswers,
      conversation: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
        { role: "assistant", content: phiResponse },
      ],
      currentStep: 1,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      sessionId,
      scene: storyData.scene,
      choices: storyData.choices,
      step: 1,
      reflection: storyData.reflection || "",
    });
  } catch (error) {
    console.error("Error starting story:", error);
    res.status(500).json({ error: "Failed to start story session" });
  }
});

// Continue story based on choice
app.post("/api/story/continue", async (req, res) => {
  try {
    const { sessionId, choiceId, choiceText } = req.body;
    if (!sessionId || !choiceId) {
      return res.status(400).json({ error: "Missing sessionId or choiceId" });
    }

    const session = storySessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Story session not found" });
    }

    // Compose the prompt for continuation
    const previousChoice = `I chose option ${choiceId}: "${choiceText}"`;
    const continuationPrompt = generateContinuationPrompt(previousChoice);

    // Build conversation context (system + all previous user/assistant turns)
    let contextPrompt = session.conversation
      .map((msg) => msg.content)
      .join("\n\n");
    contextPrompt += "\n\n" + continuationPrompt;

    // Call phi model
    const phiResponse = await callPhiModel(contextPrompt);

    // Try to parse JSON from phi's response
    let storyData;
    try {
      storyData = JSON.parse(phiResponse);
    } catch {
      const match = phiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        storyData = JSON.parse(match[0]);
      } else {
        throw new Error("Phi model did not return valid JSON.");
      }
    }

    // Update session
    session.conversation.push({ role: "user", content: previousChoice });
    session.conversation.push({ role: "assistant", content: phiResponse });
    session.currentStep += 1;
    storySessions.set(sessionId, session);

    res.json({
      scene: storyData.scene,
      choices: storyData.choices,
      step: session.currentStep,
      reflection: storyData.reflection || "",
    });
  } catch (error) {
    console.error("Error continuing story:", error);
    res.status(500).json({ error: "Failed to continue story" });
  }
});

// Get story session details
app.get("/api/story/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = storySessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Story session not found" });
  }

  res.json({
    sessionId: session.id,
    currentStep: session.currentStep,
    createdAt: session.createdAt,
  });
});

// End story session
app.delete("/api/story/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const deleted = storySessions.delete(sessionId);

  if (!deleted) {
    return res.status(404).json({ error: "Story session not found" });
  }

  res.status(204).send();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Story server running on port ${PORT}`);
  console.log(`📖 Ready to create perspective-changing stories with phi!`);
});
