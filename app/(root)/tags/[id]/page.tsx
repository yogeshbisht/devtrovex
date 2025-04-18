import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";

const TagDetailsPage = async ({ params, searchParams }: URLProps) => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;

  const { page, q } = await searchParams;
  const pageNumber = page ? Number(page) : 1;

  const result = await getQuestionsByTagId({
    tagId: id,
    page: pageNumber,
    searchQuery: q
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={`/tags/${id}`}
          iconPosition="right"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id as string}
              clerkId={userId}
              question={question}
            />
          ))
        ) : (
          <NoResult
            title="There are no tag questions to show"
            description="You can save questions by clicking on the bookmark icon on the question card. You can also ask a question. Go ahead"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination pageNumber={pageNumber} isNext={result.isNext} />
      </div>
    </>
  );
};

export default TagDetailsPage;
