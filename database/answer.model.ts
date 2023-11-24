import { Schema, models, model, Document, Types, Model } from "mongoose";
import { TUserDoc } from "./user.model";
import { TQuestionDoc } from "./question.model";

export type TAnswer = {
  author: Types.ObjectId | TUserDoc;
  question: Types.ObjectId | TQuestionDoc;
  content: string;
  upvotes: Types.ObjectId[] | TUserDoc[];
  downvotes: Types.ObjectId[] | TUserDoc[];
};

export type TAnswerDoc = TAnswer &
  Document & {
    createdAt: Date;
  };

const answerSchema = new Schema<TAnswerDoc>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Answer: Model<TAnswerDoc> =
  models.Answer || model("Answer", answerSchema);

export default Answer;
