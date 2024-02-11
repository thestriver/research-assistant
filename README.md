# AI-Powered Research Assistant
This project contains the implementation of an AI-powered Research Assistant that leverages OpenAI's GPT-4 model to generate responses based on user queries. The v2 version integrates external data from the [NewsAPI](https://newsapi.org/docs/get-started#search) for enhanced, real-time insights.

## Getting Started
### Prerequisites
- Node.js 
- OpenAI API Key
- NewsAPI API Key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/thestriver/research-assistant
   cd research-assistant
   ```
2. Install dependencies
    ```
    npm install
    ```
3. Fill in your API Keys and run the `index.js` file:
    ```
    node index.js
    ```
    To run the advanced version with external data, run:
     ```
    node indexv2.js
    ```