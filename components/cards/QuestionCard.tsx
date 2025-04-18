import React from "react";
import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";
import Metric from "@/components/shared/Metric";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import {
  formatAndDivideNumber,
  getPluralString,
  getTimestamp
} from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { Populated } from "@/database/shared.types";
import { TQuestionDoc } from "@/database/question.model";

type QuestionCardProps = {
  question: Populated<TQuestionDoc, "author" | "tags">;
  clerkId: string | null;
};

const QuestionCard = ({ question, clerkId }: QuestionCardProps) => {
  const { id, title, createdAt, tags, upvotes, answers, views, author } =
    question;
  const isAuthor = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {isAuthor && <EditDeleteAction type="Question" itemId={id} />}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <RenderTag
            key={tag._id as string}
            _id={tag._id as string}
            name={tag.name}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Link href={`/profile/${author.clerkId}`} className="flex-center gap-1">
          <Image
            src={author.picture}
            alt="user"
            width={16}
            height={16}
            className="rounded-full object-contain"
          />
          <p className="body-medium text-dark400_light700 flex items-center gap-1">
            {author.name}
            <span className="small-regular line-clamp-1 max-sm:hidden">
              {` - asked ${getTimestamp(createdAt)}`}
            </span>
          </p>
        </Link>
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            iconName="thumbs-up"
            value={formatAndDivideNumber(upvotes.length)}
            title={getPluralString(upvotes.length, "upvote")}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            iconName="message-circle"
            value={formatAndDivideNumber(answers.length)}
            title={getPluralString(answers.length, "answer")}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            iconName="eye"
            value={formatAndDivideNumber(views)}
            title={getPluralString(views, "view")}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
