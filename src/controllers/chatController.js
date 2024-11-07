const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs/promises");
const path = require("path");

require("dotenv").config();

const sendChat = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const filePath = path.join(process.cwd(), "/static-data/cpc.txt");
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Combine the file content and prompt for rich context
    const inputText = `Here is the school's information:\n${fileContent}\n\nQ: ${
      prompt || "Please provide details based on the school's information."
    }`;

    const aiClient = new GoogleGenerativeAI(process.env.NODE_AI_KEY);
    const model = await aiClient.getGenerativeModel({
      model: "gemini-1.0-pro",
    });

    const result = await model
      .startChat({
        generationConfig: {
          temperature: 0.7,
          topP: 1,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain",
        },
        history: [],
      })
      .sendMessage(inputText);

    // Check if the response is context-specific or more general
    if (!result.response.text().includes("no relevant information found")) {
      return res.status(200).json({ message: result.response.text() });
    } else {
      return res
        .status(200)
        .json({ message: "General response related to schools." });
    }
  } catch (error) {
    console.error("Error in AI request:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  sendChat,
};
