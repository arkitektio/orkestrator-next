import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CypherQueryDisplayProps {
    query: string;
    title?: string;
}

export const CypherQueryDisplay = ({
    query,
    title = "Generated Cypher Query",
}: CypherQueryDisplayProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(query);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="w-full">
            <div className="p-3 border-b flex items-center justify-between">
                <div className="font-semibold text-sm">{title}</div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-8 px-2"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            <div className="p-3">
                <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto max-h-96 overflow-y-auto">
                    {query}
                </pre>
            </div>
        </Card>
    );
};
