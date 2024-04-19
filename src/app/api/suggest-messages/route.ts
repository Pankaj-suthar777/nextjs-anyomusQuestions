import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apikey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single  string. Each question sholud be separated by '||'. These questions are for an anoymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, foucusing instead on universal theme that encourage friendly interactions. For example, your output should be structured like this: 'What's a hooby you've recently started?||If you could have dinner with any hisorical figure, whou it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational enviroment.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        {
          status,
        }
      );
    } else {
      console.error("An unexpected error occured", error);
    }
  }
}
