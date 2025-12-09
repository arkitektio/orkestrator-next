import { Separator } from "@/components/ui/separator";
import { useMeQuery } from "@/lok-next/api/graphql";
import { Username } from "../Me";
import { LatestMentionsSection } from "./LatestMentionsSection";
import { RecentAppsSection } from "./RecentAppsSection";
import { UserOrganizationsSection } from "./UserOrganizationsSection";

export const DashboardLayout = () => {
  const { data: userData } = useMeQuery();

  return (
    <div className="space-y-8 p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <Username />!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s been happening in your Lok workspace
        </p>
      </div>

      <Separator />

      {/* Latest Mentions - Top Priority */}
      <LatestMentionsSection />

      <Separator />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Apps */}
        <RecentAppsSection />

        {/* User Organizations */}
        <UserOrganizationsSection />
      </div>
    </div>
  );
};
