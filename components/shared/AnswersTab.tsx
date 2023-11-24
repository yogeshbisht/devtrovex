import React from "react";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

type AnswersTabProps = {
  userId: string;
  clerkId: string | null;
  page: number;
};

const AnswersTab = async ({ userId, clerkId, page }: AnswersTabProps) => {
  const result = await getUserAnswers({ userId, page });

  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard key={answer._id} clerkId={clerkId} answer={answer} />
      ))}

      <div className="mt-10">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </>
  );
};

export default AnswersTab;
