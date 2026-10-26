"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a Server Action
export async function handleReviewFormSubmission(data) {
    const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
    const db = getFirestore(firebaseServerApp);
  
    await addReviewToRestaurant(db, data.get("restaurantId"), {
      text: data.get("text"),
      rating: data.get("rating"),
      userId: currentUser.uid,
    });
  }
  