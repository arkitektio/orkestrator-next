import { JustUsername } from "@/lok-next/components/UserAvatar";
import { usePeerHomePageStatsQuery } from "@/mikro-next/api/graphql";
import {
    Activity,
    Calendar,
    Images,
    TrendingUp
} from "lucide-react";

export const PeerStatisticsSidebar = (props: { sub: string }) => {
    const { data, error, loading } = usePeerHomePageStatsQuery({
        variables: { id: props.sub }
    });

    // Calculate additional metrics from available data
    const totalImages = data?.imagesStats?.count || 0;
    const recentActivity = data?.imagesStats?.series?.reduce((sum, bucket) => sum + bucket.count, 0) || 0;
    const averageDaily = recentActivity > 0 ? Math.round(recentActivity / 7) : 0; // Assuming 7 days of data

    const statsCards = [
        {
            title: "Total Images",
            value: loading ? "..." : totalImages,
            description: "Total number of images in your collection",
            icon: Images,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Recent Activity",
            value: loading ? "..." : recentActivity,
            description: "Images created in the past week",
            icon: Activity,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Daily Average",
            value: loading ? "..." : averageDaily,
            description: "Average images created per day",
            icon: TrendingUp,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "This Week",
            value: loading ? "..." : recentActivity,
            description: "Total new images added this week",
            icon: Calendar,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
    ];

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Statistics for <JustUsername sub={props.sub} /></h2>
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Error loading statistics: {error.message}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Image Statistics for <JustUsername sub={props.sub} /></h2>
                <p className="text-sm text-muted-foreground">
                    Microscopy and scientific images stored in your Mikro repository.
                    These include raw data, processed images, and analysis results from your experiments.
                </p>
            </div>
            {statsCards.map((card) => (
                <div
                    key={card.title}
                    className="p-4 rounded-lg border dark:border-gray-700 flex items-center gap-4"
                >
                    <div
                        className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}
                    >
                        <card.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <p className="text-2xl font-semibold">{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};