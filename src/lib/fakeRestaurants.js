import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeRestaurantsAndReviews() {
  const data = [];

  for (const mmo of randomData.mmos) {
    const restaurantTimestamp = Timestamp.fromDate(getRandomDateBefore());
    const ratingsData = [];

    for (let j = 0; j < randomNumberBetween(1, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(restaurantTimestamp.toDate())
      );
      const review =
        randomData.restaurantReviews[
          randomNumberBetween(0, randomData.restaurantReviews.length - 1)
        ];

      ratingsData.push({
        rating: review.rating,
        text: review.text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      });
    }

    const sumRating = ratingsData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.rating,
      0
    );
    const avgRating = sumRating / ratingsData.length;

    data.push({
      restaurantData: {
        category: mmo.category,
        name: mmo.name,
        avgRating,
        city: mmo.city,
        numRatings: ratingsData.length,
        sumRating,
        price: mmo.price,
        photo: mmo.photo,
        timestamp: restaurantTimestamp,
      },
      ratingsData,
    });
  }

  return data;
}
