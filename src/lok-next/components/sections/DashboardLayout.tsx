import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMeQuery } from "@/lok-next/api/graphql";
import { Username } from "../Me";
import { LatestMentionsSection } from "./LatestMentionsSection";
import { RecentAppsSection } from "./RecentAppsSection";
import { UserOrganizationsSection } from "./UserOrganizationsSection";

export const DashboardLayout = () => {
  const { data: userData } = useMeQuery();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome back{userData?.me?.firstName ? `, ${userData.me.firstName}` : ''}!
          </CardTitle>
          <CardDescription className="text-base">
            Here&apos;s what&apos;s been happening in your Lok workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Logged in as:</span>
            <Username />
          </div>
        </CardContent>
      </Card>

      {/* Latest Mentions - Top Priority */}
      <LatestMentionsSection />

      <Separator />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Apps */}
        <RecentAppsSection />

        {/* User Organizations */}
        <UserOrganizationsSection />
      </div>
    </div>
  );
};
