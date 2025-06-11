"use client";

import { useLoaderData, redirect } from "react-router";
import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/chat";
import { getAuth } from "@clerk/react-router/ssr.server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

const CONVEX_SITE_URL = import.meta.env.VITE_CONVEX_URL!.replace(
  /.cloud$/,
  ".site"
);

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/sign-in");
  }

  try {
    const subscriptionStatus = await fetchQuery(api.subscriptions.checkUserSubscriptionStatus, { userId });
    
    // Redirect to subscription required if no active subscription
    if (!subscriptionStatus?.hasActiveSubscription) {
      throw redirect("/subscription-required");
    }

    return { hasActiveSubscription: true };
  } catch (error) {
    console.error("Error checking subscription:", error);
    throw redirect("/subscription-required");
  }
}

export default function Chat() {
  const { hasActiveSubscription } = useLoaderData<typeof loader>();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      maxSteps: 10,
      api: `${CONVEX_SITE_URL}/api/chat`,
    });

  if (!hasActiveSubscription) {
    return (
      <div className="flex flex-col w-full py-24 justify-center items-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="flex items-center justify-center">
              <Crown className="w-5 h-5 mr-2 text-orange-600" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              AI Chat is available for premium subscribers only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/pricing">
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full py-24 justify-center items-center">
      <div className="w-full max-w-xl space-y-4 mb-20">
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[65%] px-3 py-1.5 text-sm shadow-sm",
                message.role === "user"
                  ? "bg-[#0B93F6] text-white rounded-2xl rounded-br-sm"
                  : "bg-[#E9E9EB] text-black rounded-2xl rounded-bl-sm"
              )}
            >
              {message.parts.map((part) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose-sm prose-p:my-0.5 prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1"
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex gap-2 justify-center w-full items-center fixed bottom-0"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 justify-center items-start mb-8 max-w-xl w-full border p-2 rounded-lg bg-white ">
          <Input
            className="w-full border-0 shadow-none !ring-transparent "
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <div className="flex justify-end gap-3 items-center w-full">
            <Button size="sm" className="text-xs" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}