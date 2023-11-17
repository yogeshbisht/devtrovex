"use server";

import User from "@/database/user.model";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";

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

    const tags = await Tag.find({});
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
