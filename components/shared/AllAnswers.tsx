import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Image from "next/image";
import Link from "next/link";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

type AllAnswersProps = {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page: number;
  filter: string | undefined;
};

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter
}: AllAnswersProps) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article
            key={answer._id as string}
            className="light-border border-b py-10"
          >
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  alt="profile"
                  width={18}
                  height={18}
                  className="mx-sm:mt-0.5 rounded-full object-cover"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p>{answer.author.name}</p>
                  <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden">&nbsp;-&nbsp;</span>
                    answered {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
            </div>
            <div className="flex justify-end">
              <Votes
                type="Answer"
                itemId={JSON.stringify(answer._id)}
                userId={JSON.stringify(userId)}
                upvotes={answer.upvotes.length}
                downvotes={answer.downvotes.length}
                hasUpvoted={answer.upvotes.includes(answer.author.id)}
                hasDownvoted={answer.downvotes.includes(answer.author.id)}
              />
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10 w-full">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
