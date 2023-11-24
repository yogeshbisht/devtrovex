"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Tag, { TTagDoc } from "@/database/tag.model";
import Question, { TQuestionDoc } from "@/database/question.model";
import { Populated } from "@/database/shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

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

type TPopulatedQuestionsTagById = Omit<TTagDoc, "questions"> & {
  questions: Populated<TQuestionDoc, "author" | "tags">[];
};

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<TTagDoc> = { _id: tagId };
    const fullDocs = await Tag.countDocuments();

    const tag = await Tag.findOne(
      tagFilter
    ).populate<TPopulatedQuestionsTagById>({
      path: "questions",
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      model: Question,
      options: { sort: { createdAt: -1 }, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "author", model: User, select: "_id clerkId name picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = tag.questions.length + skipAmount < fullDocs;

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
