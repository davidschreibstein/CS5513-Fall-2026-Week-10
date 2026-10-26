import { vertexAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

// Server component that turns this restaurant's reviews into one sentence.
export async function GeminiSummary({ restaurantId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByRestaurantId(
    getFirestore(firebaseServerApp),
    restaurantId
  );

  const reviewSeparator = "@";
  // The separator keeps each review distinct inside a single prompt.
  const prompt = `
    Based on the following MMO reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what people think of the game. 

    Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
  `;

  try {
    // Prefer Vertex Express Mode with GEMINI_API_KEY (set in App Hosting secrets).
    // Fall back to ADC on App Hosting if no key is present.
    const ai = genkit({
      plugins: [
        process.env.GEMINI_API_KEY
          ? vertexAI({ apiKey: process.env.GEMINI_API_KEY })
          : vertexAI({ location: "global" }),
      ],
      model: vertexAI.model("gemini-2.5-flash"),
    });
    const { text } = await ai.generate(prompt);

    return (
      <div className="restaurant__review_summary">
        <p>{text}</p>
        <p>✨ Summarized with Gemini</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <p>
        Error summarizing reviews.{" "}
        <span style={{ opacity: 0.7 }}>({e?.message || String(e)})</span>
      </p>
    );
  }
}

// Placeholder shown while the summary request is still running.
export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}
