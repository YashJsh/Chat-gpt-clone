import Groq from "groq-sdk"
import { tavily } from "@tavily/core"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY environment variable is not set. Please set it before running the app.");
}

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


const messages: any = [
    {
        role: "assistant",
        content: `You are a smart assistant, who is here for the user to solve and answer his query.
        You have to answer crisp and short, and only what user want's to know.
        Example : 
        User : What is the weather of Delhi?
        Assistant : The weather of Delhi is 26 degree celcius.

        Don't share anything else, only when user ask for depth then only share.

        You have access to following tools : 
                1. webSearch({query} : {query : string}) => description : Search the latest information and realtime data on the internet.
        `
    }
];

const webSearch = async ({ query }: { query: string }) => {
    console.log(query);
    const response = await tvly.search(query);
    const finalResult = response.results.map((a) => a.content).join('\n\n');
    return finalResult;
}


export const generate = async (message: string) => {
    messages.push({
        role: 'user',
        content: message
    })
    while (true) {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            messages,
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
            const answer = response.choices[0]?.message.content;
            return answer;
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
                    name: tool.function.name
                })
            };
        }
    }
}