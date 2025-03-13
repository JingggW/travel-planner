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

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  estimatedCost?: string;
  reservationNeeded: boolean;
}

export interface DayItinerary {
  date: string;
  activities: ItineraryActivity[];
}

export interface GeneratedItinerary {
  destination: string;
  startDate: string;
  endDate: string;
  content: string; // Raw LLM response
}

export async function generateDetailedItinerary(
  trip: Trip
): Promise<GeneratedItinerary> {
  if (!TOGETHER_API_KEY) {
    throw new Error("Together AI API key is not configured");
  }

  if (!trip.location || !trip.start_date || !trip.end_date) {
    throw new Error("Trip must have location, start date, and end date");
  }

  console.log("Generating itinerary for:", {
    location: trip.location,
    startDate: trip.start_date,
    endDate: trip.end_date,
  });

  const prompt = `You MUST return your response in the following JSON format ONLY. Do not include any other text or explanations outside the JSON structure:

{
  "destination": "${trip.location}",
  "startDate": "${new Date(trip.start_date).toLocaleDateString()}",
  "endDate": "${new Date(trip.end_date).toLocaleDateString()}",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "HH:MM AM/PM - HH:MM AM/PM",
          "activity": "Name of the activity",
          "location": "Full address or location name",
          "description": "Detailed description of the activity",
          "estimatedCost": "Cost in local currency or 'Free'",
          "reservationNeeded": true/false
        }
      ]
    }
  ]
}

Create a detailed day-by-day itinerary for this trip:
Title: ${trip.title}
${trip.description ? `Description: ${trip.description}` : ""}
Location: ${trip.location}
Start Date: ${new Date(trip.start_date).toLocaleDateString()}
End Date: ${new Date(trip.end_date).toLocaleDateString()}

For each day's activities include:
1. A mix of popular attractions, local experiences, and dining options
2. Realistic timing considering travel distances
3. Specific locations with full addresses
4. Accurate cost estimates in local currency
5. Clear indication if reservations are needed

Remember:
- Use the exact JSON format shown above
- Include breakfast, lunch, and dinner recommendations
- Add transportation details between locations when needed
- Keep timings realistic with travel time between places
- Include specific addresses and location details`;

  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a travel itinerary API that MUST return responses in valid JSON format only. Do not include any explanatory text or markdown formatting. Your entire response must be parseable as JSON. Format dates as YYYY-MM-DD and times as HH:MM AM/PM.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      temperature: 0.7,
      max_tokens: 3000,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("No itinerary generated");
    }

    console.log("LLM Response:", response.choices[0].message.content);

    try {
      // Try to parse the response as JSON
      const jsonResponse = JSON.parse(response.choices[0].message.content);
      return {
        destination: jsonResponse.destination || trip.location,
        startDate:
          jsonResponse.startDate ||
          new Date(trip.start_date).toISOString().split("T")[0],
        endDate:
          jsonResponse.endDate ||
          new Date(trip.end_date).toISOString().split("T")[0],
        content: JSON.stringify(jsonResponse, null, 2), // Pretty print the JSON
      };
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", parseError);
      // Fall back to raw response if JSON parsing fails
      return {
        destination: trip.location,
        startDate: new Date(trip.start_date).toISOString().split("T")[0],
        endDate: new Date(trip.end_date).toISOString().split("T")[0],
        content: response.choices[0].message.content,
      };
    }
  } catch (error) {
    console.error("Error generating detailed itinerary:", error);
    throw error;
  }
}

async function generateRecommendation(prompt: string) {
  if (!TOGETHER_API_KEY) {
    throw new Error("Together AI API key is not configured");
  }

  const response = await together.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a knowledgeable travel expert who provides specific, practical recommendations. Format your response as a list with each item starting with '- ' followed by the name and description separated by ': '. Keep descriptions informative but concise.",
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
}

export async function generateActivityRecommendations(trip: Trip) {
  const prompt = `Please suggest 3 must-do activities or attractions for a trip to ${
    trip.location || "the destination"
  }.
${
  trip.start_date
    ? `Trip starts on: ${new Date(trip.start_date).toLocaleDateString()}`
    : ""
}
${
  trip.end_date
    ? `Trip ends on: ${new Date(trip.end_date).toLocaleDateString()}`
    : ""
}

Focus on:
- Popular tourist attractions
- Local cultural experiences
- Unique or seasonal activities

For each activity, provide:
- Name of the activity
- Brief description including location, estimated duration, and any special notes
- Why it's worth visiting

Format each recommendation as:
- [Activity Name]: [Description]`;

  return generateRecommendation(prompt);
}

export async function generateHotelRecommendations(trip: Trip) {
  const prompt = `Please suggest 3 excellent accommodation options for a stay in ${
    trip.location || "the destination"
  }.
${
  trip.start_date
    ? `Check-in: ${new Date(trip.start_date).toLocaleDateString()}`
    : ""
}
${
  trip.end_date
    ? `Check-out: ${new Date(trip.end_date).toLocaleDateString()}`
    : ""
}

Focus on:
- Location and accessibility
- Quality and amenities
- Value for money
- Guest reviews and ratings

For each hotel, provide:
- Name of the hotel
- Brief description including location, key amenities, and room types
- What makes it special

Format each recommendation as:
- [Hotel Name]: [Description]`;

  return generateRecommendation(prompt);
}

export async function generateFoodRecommendations(trip: Trip) {
  const prompt = `Please suggest 3 must-try dining experiences in ${
    trip.location || "the destination"
  }.
${
  trip.start_date
    ? `Visit period starts: ${new Date(trip.start_date).toLocaleDateString()}`
    : ""
}
${
  trip.end_date
    ? `Visit period ends: ${new Date(trip.end_date).toLocaleDateString()}`
    : ""
}

Focus on:
- Local specialties and cuisine
- Popular restaurants
- Unique dining experiences
- Food markets or street food

For each recommendation, provide:
- Name of the restaurant or dining spot
- Brief description including cuisine type, location, and price range
- What makes it special

Format each recommendation as:
- [Restaurant/Place Name]: [Description]`;

  return generateRecommendation(prompt);
}
