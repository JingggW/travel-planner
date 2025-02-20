import { NextResponse } from "next/server";
import Together from "together-ai";

const TOGETHER_API_KEY = process.env.TOGETHER_AI_API_KEY;

interface Attraction {
  name: string;
  description: string;
  type: string;
  estimatedDuration?: string;
  bestTimeToVisit?: string;
}

export async function POST(request: Request) {
  try {
    if (!TOGETHER_API_KEY) {
      return new NextResponse("Together AI API key not configured", {
        status: 500,
      });
    }

    const { destination } = await request.json();
    const together = new Together({ apiKey: TOGETHER_API_KEY });

    console.log("Received destination:", destination);

    const prompt = `List 5 must-visit tourist attractions that are specifically located in ${destination}. These must be actual attractions that exist in ${destination}. For each attraction, provide:
1. Name
2. A brief description
3. Type (e.g., museum, landmark, park)
4. Estimated time to spend there
5. Best time to visit

Format the response as a JSON array with the following structure:
[{
  "name": "Attraction name",
  "description": "Brief description",
  "type": "Type of attraction",
  "estimatedDuration": "Time to spend",
  "bestTimeToVisit": "Best time"
}]

Only return the JSON array, no other text. All attractions MUST be located in ${destination}.`;
    console.log("Prompt:", prompt);
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel guide that provides information in JSON format. Always provide information ONLY about the specific city that is asked for.",
        },
        { role: "user", content: prompt },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log("API Response:", JSON.stringify(response, null, 2));

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    let attractions: Attraction[];

    try {
      // Try to parse the response as JSON
      attractions = JSON.parse(content.trim());
    } catch (error) {
      console.error("JSON Parse Error:", error);
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        attractions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse attractions data");
      }
    }

    return new NextResponse(JSON.stringify({ places: attractions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching place recommendations:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
