"use server";

import { FilterQuery } from "mongoose";
import User, { TUserDoc } from "@/database/user.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, { TQuestionDoc } from "@/database/question.model";
import Answer, { TAnswerDoc } from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "@/lib/utils";
import { Populated } from "@/database/shared.types";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = userData;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = userData;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    // delete user questions
    await Question.deleteMany({
      author: user._id,
      _id: { $in: userQuestionIds },
    });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<TUserDoc> = {};
    const sortOptions: FilterQuery<TUserDoc> = {};

    switch (filter) {
      case "new_users":
        sortOptions.joinedAt = -1;
        break;
      case "old_users":
        sortOptions.joinedAt = 1;
        break;
      case "top_contributors":
        sortOptions.reputation = -1;
        break;
      default:
        break;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = users.length + skipAmount < totalUsers;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path, hasSaved } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    let updateQuery: Record<string, any> = {};

    if (hasSaved) {
      updateQuery = { $pull: { saved: questionId } };
    } else {
      updateQuery = { $addToSet: { saved: questionId } };
    }

    const result = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });
    if (!result) throw new Error("user not found");

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<TQuestionDoc> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const sortOptions: FilterQuery<TQuestionDoc> = {};

    switch (filter) {
      case "most_recent":
        sortOptions.createdAt = -1;
        break;
      case "oldest":
        sortOptions.createdAt = 1;
        break;
      case "most_voted":
        sortOptions.upvotes = -1;
        break;
      case "most_viewed":
        sortOptions.views = -1;
        break;
      case "most_answered":
        sortOptions.answers = -1;
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "author", model: User, select: "_id clerkId name picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const totalUsers = await User.countDocuments(query);
    const isNext = user.saved.length + skipAmount < totalUsers;

    return { questions: user.saved, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria: Array<{ type: BadgeCriteriaType; count: number }> = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      reputation: user.reputation,
      badgeCounts,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = (await Question.find({ author: userId })
      .populate("author", "_id clerkId name picture")
      .populate("tags", "_id name")
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)) as Populated<TQuestionDoc, "author" | "tags">[];

    if (!userQuestions) {
      throw new Error("Question not found");
    }

    const isNext = skipAmount + userQuestions.length < totalQuestions;

    return { questions: userQuestions, totalQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

type PopulatedAnswerByUserId = Populated<TAnswerDoc, "author" | "question">[];

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = (await Answer.find({ author: userId })
      .populate("author")
      .populate("question")
      .sort({ views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)) as PopulatedAnswerByUserId;

    const isNext = skipAmount + answers.length < totalAnswers;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
