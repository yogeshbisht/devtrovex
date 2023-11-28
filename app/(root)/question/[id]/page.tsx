import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs";

import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import {
  formatAndDivideNumber,
  getPluralString,
  getTimestamp,
} from "@/lib/utils";
import { URLProps } from "@/types";
import { redirect } from "next/navigation";

const QuestionPage = async ({ params, searchParams }: URLProps) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const result = await getQuestionById({ questionId: params.id });
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  if (!result) redirect("/");

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) redirect("/");

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="profile"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasUpvoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasDownvoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          iconName="thumbs-up"
          value={` asked ${getTimestamp(result.createdAt)}`}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          iconName="message-circle"
          value={formatAndDivideNumber(result.answers.length)}
          title={getPluralString(result.answers.length, "answer")}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          iconName="eye"
          value={formatAndDivideNumber(result.views)}
          title={getPluralString(result.views, "view")}
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag) => (
          <RenderTag
            key={tag.id}
            _id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result.id}
        userId={mongoUser.id}
        totalAnswers={result.answers.length}
        page={page}
        filter={searchParams.filter}
      />

      <Answer
        question={result.content}
        questionId={result.id}
        authorId={mongoUser.id}
      />
    </>
  );
};

export default QuestionPage;
