import { Schema, models, model, Document, Types, Model } from "mongoose";
import { TQuestionDoc } from "./question.model";
import { TUserDoc } from "./user.model";

export type TTag = {
  name: string;
  description: string;
  questions: Types.ObjectId[] | TQuestionDoc[];
  followers: Types.ObjectId[] | TUserDoc[];
};

export type TTagDoc = TTag &
  Document & {
    createdOn: Date;
  };

const tagSchema = new Schema<TTagDoc>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdOn: { type: Date, default: Date.now },
});

const Tag: Model<TTagDoc> = models.Tag || model("Tag", tagSchema);

export default Tag;
