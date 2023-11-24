"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type VotesWithSaveProps = {
  hasSaved: boolean;
  type: "Question";
};

type VotesWithoutSaveProps = {
  type: "Answer";
};

type VotesProps = {
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
} & (VotesWithSaveProps | VotesWithoutSaveProps);

const Votes = (props: VotesProps) => {
  const path = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: props.userId,
      questionId: props.itemId,
      hasSaved: "hasSaved" in props && props.hasSaved,
      path,
    });
  };

  const handleVote = async (action: string) => {
    if (!props.userId) return;

    const params = {
      userId: props.userId,
      hasUpvoted: props.hasUpvoted,
      hasDownvoted: props.hasDownvoted,
      path,
    };

    if (action === "upvote") {
      if (props.type === "Question") {
        await upvoteQuestion(
          Object.assign(params, { questionId: props.itemId })
        );
      } else if (props.type === "Answer") {
        await upvoteAnswer(Object.assign(params, { answerId: props.itemId }));
      }
    } else if (action === "downvote") {
      if (props.type === "Question") {
        await downvoteQuestion(
          Object.assign(params, { questionId: props.itemId })
        );
      } else if (props.type === "Answer") {
        await downvoteAnswer(Object.assign(params, { answerId: props.itemId }));
      }
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: props.itemId,
      userId: props.userId,
    });
  }, [props.userId, props.itemId, path, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${props.hasUpvoted ? "upvoted" : "upvote"}.svg`}
            width={18}
            height={18}
            alt="upvote"
            onClick={() => handleVote("upvote")}
            role="button"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(props.upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${
              props.hasDownvoted ? "downvoted" : "downvote"
            }.svg`}
            width={18}
            height={18}
            alt="downvote"
            onClick={() => handleVote("downvote")}
            role="button"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(props.downvotes)}
            </p>
          </div>
        </div>
      </div>

      {props.type === "Question" && (
        <Image
          src={`/assets/icons/${
            props.hasSaved ? "star-filled" : "star-red"
          }.svg`}
          width={18}
          height={18}
          alt="star"
          onClick={handleSave}
          role="button"
        />
      )}
    </div>
  );
};

export default Votes;
