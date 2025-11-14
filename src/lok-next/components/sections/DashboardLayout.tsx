import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMeQuery } from "@/lok-next/api/graphql";
import { Username } from "../Me";
import { LatestMentionsSection } from "./LatestMentionsSection";
import { RecentAppsSection } from "./RecentAppsSection";
import { UserOrganizationsSection } from "./UserOrganizationsSection";
import { Link } from "@/components/ui/link";

export const DashboardLayout = () => {
  const { data: userData } = useMeQuery();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <CardHeader>
        <CardTitle className="text-2xl">
          Welcome back, <Username />!
        </CardTitle>
        <CardDescription className="text-base">
          Here&apos;s what&apos;s been happening in your Lok workspace
        </CardDescription>
      </CardHeader>

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
