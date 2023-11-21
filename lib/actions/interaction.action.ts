"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    // Update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    // If the user is logged in, create an interaction
    if (userId) {
      // Check if the user has already viewed the question
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      // If the user has already viewed the question, update the timestamp
      if (existingInteraction) {
        return await Interaction.findByIdAndUpdate(existingInteraction._id, {
          createdAt: Date.now(),
        });
      }

      // Otherwise, create a new interaction
      await Interaction.create({
        user: userId,
        question: questionId,
        action: "view",
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
