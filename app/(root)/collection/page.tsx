import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";

const CollectionPage = async ({ searchParams }: SearchParamsProps) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  const { page, q, filter } = await searchParams;
  const pageNumber = page ? Number(page) : 1;

  const result = await getSavedQuestions({
    clerkId,
    searchQuery: q,
    filter: filter,
    page: pageNumber
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="right"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[48px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              clerkId={clerkId}
              question={question}
            />
          ))
        ) : (
          <NoResult
            title="There are no saved questions to show"
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

export default CollectionPage;
