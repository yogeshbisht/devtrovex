import React from "react";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "./Pagination";
import { getUserQuestions } from "@/lib/actions/user.action";

type QuestionsTabProps = {
  userId: string;
  clerkId: string | null;
  page: number;
};

const QuestionsTab = async ({ userId, clerkId, page }: QuestionsTabProps) => {
  const result = await getUserQuestions({
    userId,
    page,
  });

  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          clerkId={clerkId}
          question={question}
        />
      ))}

      <div className="mt-10">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </>
  );
};

export default QuestionsTab;
