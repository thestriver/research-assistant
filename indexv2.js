const { OpenAI } = require("openai");
 
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',
  dangerouslyAllowBrowser: true,
});
 

// Function to fetch the latest news based on a query using the NewsAPI
async function fetchLatestNews(query) {
    const apiKey = 'your_newsapi_api_key';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=2024-02-9&sortBy=popularity&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Ensure data.articles exists and has elements, then slice the first 5
        const first5Articles = data.articles && data.articles.length > 0
            ? data.articles.slice(0, 5) // Adjusted to get the first 5 articles
            : [];

        // Log only the first 5 articles
        const resultJson = JSON.stringify({ articles: first5Articles });

        // Log the JSON string
        //console.log(resultJson);

        return resultJson
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
  

const tools = [
    // Add the news fetching function as a tool
    {
        type: "function",
        function: {
        name: "fetchLatestNews",
        description: "Fetch the latest news based on a query",
        parameters: {
            type: "object",
            properties: {
            query: {
                type: "string",
            },
            },
            required: ["query"],
        },
        }
    },
];

const availableTools = {
    fetchLatestNews, // Add the news fetching function here
};

const messages = [
    {
        role: "system",
        content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
];

async function researchAssistant(userInput) {
    // Add user input to the messages array as a 'user' role message
    messages.push({
      role: "user",
      content: userInput,
    });
    // Iterate up to 5 times to handle conversation turns or tool calls
	// necessary for cases where API response might not be relevant enough at first. 
    //We reduced ours to just 5 
    for (let i = 0; i < 5; i++) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        tools: tools,
        max_tokens: 4096
      });
      // Destructure the AI response to get the finish reason and the message
      const { finish_reason, message } = response.choices[0];
      // Check if the AI's response was to make a tool call
      if (finish_reason === "tool_calls" && message.tool_calls) {
        // Get the name of the function the AI wants to call
        const functionName = message.tool_calls[0].function.name;
        // Find the corresponding function in the availableTools
        const functionToCall = availableTools[functionName];
        // Parse the arguments for the function call
        const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
        // Call the function with the parsed arguments and await its response
        const functionResponse = await functionToCall.apply(null, [functionArgs.query]);
         // Add the function response to the conversation as a 'function' role message
        messages.push({
          role: "function",
          name: functionName,
        content: `
                The result of the last function was this: ${JSON.stringify(
                  functionResponse
                )}
                `,
        });
      } else if (finish_reason === "stop") {
        // If the AI decides to stop, add its last message to the conversation
        messages.push(message);
        // Return the AI's last message as the function's output
        return message.content;
      }
    }
    // If the maximum number of iterations (i.e, 5) is reached without a 'stop', return the default message below
    return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

async function main() {
    const response = await researchAssistant("I have a presentation to make. Write a market research report on Apple Vision Pro and summarize the key points.");
    console.log("Response:", response);
}
  
main();
  
