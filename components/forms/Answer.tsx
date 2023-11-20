"use client";

import { z } from "zod";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import { AnswersSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

type AnswerProps = {
  question: string;
  questionId: string;
  authorId: string;
};

const Answer = ({ question, questionId, authorId }: AnswerProps) => {
  const pathname = usePathname();
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswersSchema>) => {
    setIsSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
          onClick={() => {}}
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate an AI Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue=""
                    onBlur={field.onBlur}
                    onEditorChange={(content) => {
                      field.onChange(content);
                    }}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-900" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
