import { Trip } from "@/types";
import Together from "together-ai";

const TOGETHER_API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
const together = new Together({ apiKey: TOGETHER_API_KEY });

export async function generateTripRecommendations(trip: Trip) {
  if (!TOGETHER_API_KEY) {
    throw new Error("Together AI API key is not configured");
  }

  const prompt = `As a travel expert, please suggest some trip items (activities, accommodations, and transportation) for a trip with the following details:

Title: ${trip.title}
${trip.description ? `Description: ${trip.description}` : ""}
${trip.location ? `Location: ${trip.location}` : ""}
${
  trip.start_date
    ? `Start Date: ${new Date(trip.start_date).toLocaleDateString()}`
    : ""
}
${
  trip.end_date
    ? `End Date: ${new Date(trip.end_date).toLocaleDateString()}`
    : ""
}

${
  trip.location
    ? `Please provide location-specific recommendations for ${trip.location}, including:`
    : "Please provide recommendations including:"
}

Activities:
- Local attractions and experiences specific to ${
    trip.location || "the destination"
  }
- Cultural activities and events
- Popular tourist spots and hidden gems

Accommodations:
- Hotels, resorts, or vacation rentals in good locations
- Options that fit different budgets
- Places with good reviews and amenities

Transportation:
- Best ways to get around ${trip.location || "the destination"}
- Local transportation options
- Transfer suggestions from airports or between attractions

Please provide recommendations in the following format:
Activities:
- [Activity name]: [Brief description]

Accommodations:
- [Accommodation name]: [Brief description]

Transportation:
- [Transportation option]: [Brief description]

Focus on providing specific, practical suggestions that would enhance the trip experience.`;

  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable travel expert who provides specific, practical recommendations for trips.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      temperature: 0.7,
      max_tokens: 800,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("No recommendations generated");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating trip recommendations:", error);
    throw error;
  }
}
