import { Schema, models, model, Types, Model, Document } from "mongoose";
import { TTagDoc } from "./tag.model";
import { TUserDoc } from "./user.model";

export type TQuestion = {
  title: string;
  content: string;
  tags: Types.ObjectId[] | TTagDoc[];
  views: number;
  upvotes: Types.ObjectId[] | TUserDoc[];
  downvotes: Types.ObjectId[] | TUserDoc[];
  author: Types.ObjectId | TUserDoc;
  answers: Types.ObjectId[];
};

export type TQuestionDoc = TQuestion &
  Document & {
    createdAt: Date;
  };

const questionSchema = new Schema<TQuestionDoc>(
  {
    title: { required: true, type: String },
    content: { required: true, type: String },
    tags: [{ required: true, type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Question: Model<TQuestionDoc> =
  models.Question || model("Question", questionSchema);

export default Question;
