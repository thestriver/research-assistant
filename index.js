const { OpenAI } = require("openai");

const openai = new OpenAI({
      apiKey: "YOUR_OPENAI_API_KEY",
      dangerouslyAllowBrowser: true,
});

async function queryAIModel(question) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful research assistant." },
        { role: "user", content: question }
      ],
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("An error occurred while querying GPT-4:", error);
    return "Sorry, an error occurred. Please try again.";
  }
}

async function queryResearchAssistant() {
  const query = "What is the role of Javascript in building AI Applications?";
  const answer = await queryAIModel(query);
  console.log(`Question: ${query}\nAnswer: ${answer}`);
}

queryResearchAssistant();
