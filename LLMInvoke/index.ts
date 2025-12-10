import Groq from "groq-sdk"
import { tavily } from "@tavily/core"
import readline from "node:readline/promises"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY environment variable is not set. Please set it before running the app.");
}

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


const webSearch = async ({ query }: { query: string }) => {
    const response = await tvly.search(query);
    const finalResult = response.results.map((a) => a.content).join('\n\n');
    return finalResult
}

interface message {
    role : "system" | "user" | "developer",
    content : string
}

async function main() {
    const messages: any = [
        {
            role: "system",
            content: `
                You are a smart personal assistant, who answer the user's query. For his day to day tasks.
                You have access to following tools : 
                1. webSearch({query} : {query : string}) => description : Search the latest information and realtime data on the internet.
            `
        },
        {
            role: "user",
            content: "Can you tell me the current weather in Delhi and its AQI?"
        }
    ];

    while(true){
        const question = await rl.question("You : ");
        messages.push({
            role : "user", 
            content : question
        });
        if (question === "bye"){
            break;
        }
        while (true) {
            const response = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages,
                // max_completion_tokens : 1000,
                //frequency_penalty : 1,
                //presene_penalty : 1
                temperature: 0,
                // stop : "ga",
                // response_format : {
                //     type : "json_object"
                // },
                tools: [
                    {
                        "type": "function",
                        function: {
                            name: "webSearch",
                            description: "Search the latest information and realtime data on the internet.",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "The search query to use."
                                    }
                                },
                                required: ["query"]
                            }
                        }
                    }
                ],
                tool_choice: "auto",
    
            })
            messages.push(response.choices[0]?.message);
            const toolCall = response.choices[0]?.message.tool_calls;
            if (!toolCall) {
                console.log(`Assistant : ${response.choices[0]?.message.content}`);
                break;
            }
            for (const tool of toolCall) {
                const functionName = tool.function.name;
                const functionParams = tool.function.arguments;
                if (functionName === "webSearch") {
                    const result = await webSearch(JSON.parse(functionParams));
                    messages.push({
                        tool_call_id: tool.id,
                        role: "tool",
                        content: result,
                        name : tool.function.name
                    })
                };
            }
            console.log(JSON.stringify(response.choices[0]?.message, null, 2));
        }
    }

  
};

main();