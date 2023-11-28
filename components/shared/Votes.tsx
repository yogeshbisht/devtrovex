"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type VotesProps = {
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  type: "Question" | "Answer";
  hasSaved?: boolean;
};

const Votes = ({
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  type,
  hasSaved,
}: VotesProps) => {
  const path = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId,
      questionId: itemId,
      hasSaved,
      path,
    });

    return toast({
      title: `Question ${
        !hasSaved ? "Saved in" : "Removed from"
      } your collection`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });
    }

    const params = {
      userId,
      hasUpvoted,
      hasDownvoted,
      path,
    };

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion(Object.assign(params, { questionId: itemId }));
      } else if (type === "Answer") {
        await upvoteAnswer(Object.assign(params, { answerId: itemId }));
      }
      return toast({
        title: `Upvote ${!hasUpvoted ? "Successful" : "Removed"}`,
        variant: !hasUpvoted ? "default" : "destructive",
      });
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion(Object.assign(params, { questionId: itemId }));
      } else if (type === "Answer") {
        await downvoteAnswer(Object.assign(params, { answerId: itemId }));
      }
      return toast({
        title: `Downvote ${!hasUpvoted ? "Successful" : "Removed"}`,
        variant: !hasUpvoted ? "default" : "destructive",
      });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });
  }, [userId, itemId, path, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${hasUpvoted ? "upvoted" : "upvote"}.svg`}
            width={18}
            height={18}
            alt="upvote"
            onClick={() => handleVote("upvote")}
            role="button"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${hasDownvoted ? "downvoted" : "downvote"}.svg`}
            width={18}
            height={18}
            alt="downvote"
            onClick={() => handleVote("downvote")}
            role="button"
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={`/assets/icons/${hasSaved ? "star-filled" : "star-red"}.svg`}
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
