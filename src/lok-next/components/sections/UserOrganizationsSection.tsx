import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeQuery } from "@/lok-next/api/graphql";
import { Building2, Users } from "lucide-react";
import OrganizationCard from "../cards/OrganizationCard";

export const UserOrganizationsSection = () => {
  const { data, loading } = useMeQuery();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Your Organizations</CardTitle>
          </div>
          <CardDescription>Organizations you&apos;re a member of</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract organizations from memberships
  const organizations = data?.me?.memberships?.map(membership => membership.organization) || [];

  if (organizations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Your Organizations</CardTitle>
          </div>
          <CardDescription>Organizations you&apos;re a member of</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <Users className="h-8 w-8 mb-2" />
            <p>You&apos;re not a member of any organizations yet</p>
            <p className="text-xs mt-1">Join an organization to collaborate with others</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Your Organizations</CardTitle>
        </div>
        <CardDescription>Organizations you&apos;re a member of</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} item={org} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
