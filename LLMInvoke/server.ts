import express, { type Request, type Response } from "express";
import { generate } from "./chatbot";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/chat', async (req: Request, res: Response) => {
	const message: chat_data = req.body;
	console.log(message);
	const response = await generate(message.data);
	res.json({
		message: "Chat box",
		data: message.data,
		response: response
	});
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`)
})

interface chat_data {
	data: string
};