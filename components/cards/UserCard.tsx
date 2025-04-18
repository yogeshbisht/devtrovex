"use client";

import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import RenderTag from "@/components/shared/RenderTag";
import { TUserDoc } from "@/database/user.model";
import { useRouter } from "next/navigation";

type UserCardProps = {
  user: Partial<TUserDoc>;
};

const UserCard = async ({ user }: UserCardProps) => {
  const router = useRouter();
  const interactedTags = await getTopInteractedTags({
    userId: user._id as string
  });

  const onUserClick = () => {
    router.push(`/profile/${user.clerkId}`);
  };

  return (
    <div
      onClick={onUserClick}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center border p-8">
        <Image
          src={user.picture!}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interactedTags.map((tag) => (
                <RenderTag
                  key={tag._id as string}
                  _id={tag._id as string}
                  name={tag.name}
                />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
