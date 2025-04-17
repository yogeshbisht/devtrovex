import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const result = await getQuestionById({ questionId: params.id });
  if (!result) return redirect("/");

  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) return redirect("/");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={mongoUser.id}
          questionDetails={JSON.parse(JSON.stringify(result))}
        />
      </div>
    </>
  );
};

export default EditQuestionPage;
