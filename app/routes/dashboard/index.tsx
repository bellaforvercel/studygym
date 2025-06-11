"use client";
import { useLoaderData } from "react-router";
import { ChartAreaInteractive } from "~/components/dashboard/chart-area-interactive";
import { SectionCards } from "~/components/dashboard/section-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import type { Route } from "./+types/index";

export async function loader(args: Route.LoaderArgs) {
  // This loader inherits the user and subscription data from the layout
  return null;
}

export default function Page() {
  const layoutData = useLoaderData() as any;
  const hasActiveSubscription = layoutData?.subscriptionStatus?.hasActiveSubscription;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Welcome Message for New Users */}
          {!hasActiveSubscription && (
            <div className="px-4 lg:px-6">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                        Welcome to Your Dashboard!
                      </CardTitle>
                      <CardDescription className="mt-2">
                        You're currently on the free plan. Upgrade to unlock premium features and enhance your experience.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      Free Plan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <a href="/pricing">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/dashboard/settings">
                        View Account Settings
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}