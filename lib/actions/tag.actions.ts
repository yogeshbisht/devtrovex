"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find interactions for the user and group by tags
    // TODO Interactions model

    return [
      { _id: "1", name: "tag 1" },
      { _id: "2", name: "tag 2" },
      { _id: "3", name: "tag 3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const tag = await Tag.findOne({ _id: tagId }).populate({
      path: "questions",
      model: Question,
      match: tagFilter,
      options: { sort: { createdAt: -1 }, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = tag.questions.length > pageSize;

    return { tagTitle: tag.name, questions: tag.questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return { popularTags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
