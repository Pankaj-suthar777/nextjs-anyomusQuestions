"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Suggestion from "@/messages.json";
import { Loader2 } from "lucide-react";

const Public = () => {
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [value, setValue] = useState("");

  const schema = z.object({
    content: z.string().min(10),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: res.data.message,
      });
    } catch (error) {
      console.error("Error in sending message");
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function addSuggestion(content: string) {
    form.setValue("content", content);
  }
  return (
    <div>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl text-center font-bold mb-4">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">
                    Send Anonymous Messages to @{params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous here"
                      {...field}
                      defaultValue={value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center mt-10">
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting && <Loader2 className="animate-spin mr-2" />} Send
                It
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex justify-center items-center flex-col space-y-8">
        <h1 className="text-lg font-bold">Suggestion</h1>
        {Suggestion.map((item, i) => {
          return (
            <h1
              key={i}
              className="cursor-pointer"
              onClick={() => addSuggestion(item.content)}
            >
              {item.content}
            </h1>
          );
        })}
      </div>
    </div>
  );
};

export default Public;
