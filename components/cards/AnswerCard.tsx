import {
  formatAndDivideNumber,
  getPluralString,
  getTimestamp,
} from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Metric from "@/components/shared/Metric";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import { Populated } from "@/database/shared.types";
import { TAnswerDoc } from "@/database/answer.model";

type AnswerCardProps = {
  answer: Populated<TAnswerDoc, "author" | "question">;
  clerkId: string | null;
};

const AnswerCard = ({ answer, clerkId }: AnswerCardProps) => {
  const { _id, createdAt, upvotes, author, question } = answer;
  const isAuthor = clerkId && clerkId === author.clerkId;

  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className="card-wrapper px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        <SignedIn>
          {isAuthor && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Link href={`/profile/${author.clerkId}`} className="flex-center gap-1">
          <Image
            src={author.picture}
            alt="user avatar"
            width={16}
            height={16}
            className="rounded-full object-contain"
          />
          <p className="body-medium text-dark400_light700 flex items-center gap-1">
            {author.name}
            <span className="small-regular line-clamp-1 max-sm:hidden">
              {` • asked ${getTimestamp(createdAt)}`}
            </span>
          </p>
        </Link>
        <div className="flex-center gap-3">
          <Metric
            iconName="thumbs-up"
            value={formatAndDivideNumber(upvotes.length)}
            title={getPluralString(upvotes.length, "upvote")}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Link>
  );
};

export default AnswerCard;
