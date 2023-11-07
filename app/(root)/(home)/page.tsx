import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sqlalchemy" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john_doe_picture.jpg",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How do I use express as a custom server in NextJS?",
    tags: [
      { _id: "1", name: "nextjs" },
      { _id: "2", name: "express" },
    ],
    author: {
      _id: "2",
      name: "Jane Smith",
      picture: "jane_smith_picture.jpg",
    },
    upvotes: 15,
    views: 120000,
    answers: [],
    createdAt: new Date("2021-09-02T14:30:00.000Z"),
  },
  {
    _id: "3",
    title: "Managing State in React",
    tags: [{ _id: "3", name: "react" }],
    author: {
      _id: "3",
      name: "Alice Johnson",
      picture: "alice_johnson_picture.jpg",
    },
    upvotes: 8,
    views: 80,
    answers: [],
    createdAt: new Date("2021-09-03T09:15:00.000Z"),
  },
  {
    _id: "4",
    title: "Getting Started with GraphQL",
    tags: [{ _id: "4", name: "graphql" }],
    author: {
      _id: "4",
      name: "Bob Wilson",
      picture: "bob_wilson_picture.jpg",
    },
    upvotes: 12,
    views: 110,
    answers: [],
    createdAt: new Date("2021-09-04T17:45:00.000Z"),
  },
];

export default function HomePage() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h=[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There are no questions to show"
            description=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non explicabo
          voluptatum quis earum molestias suscipit asperiores autem, perferendis,
          fugit provident porro neque sapiente quasi consectetur quas molestiae
          nisi mollitia soluta!"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
