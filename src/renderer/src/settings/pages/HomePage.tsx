import { SwitchField } from "@/components/fields/SwitchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateChecker } from "@/components/ui/update-checker";
import { Arkitekt } from "@/lib/arkitekt/Arkitekt";
import { useSettings } from "@/providers/settings/SettingsContext";
import {
  CheckCircle,
  Globe,
  Minus,
  Plus,
  Search,
  Server,
  Settings,
  XCircle,
} from "lucide-react";
import deepEqual from "deep-equal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type IRepresentationScreenProps = Record<string, never>;

// Component to display fakts data in a structured way
const FaktsViewer: React.FC<{ fakts: unknown }> = ({ fakts }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null) return <span className="text-gray-400">None</span>;
    if (value === undefined)
      return <span className="text-gray-400">Undefined</span>;
    if (typeof value === "boolean")
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value.toString()}
        </Badge>
      );
    if (typeof value === "string") {
      if (value.startsWith("http")) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            {value}
          </a>
        );
      }
      return <span className="text-green-400">&quot;{value}&quot;</span>;
    }
    if (typeof value === "number")
      return <span className="text-orange-400">{value}</span>;
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          {value.map((item, index) => (
            <div key={index} className="border-l border-gray-600 pl-2 my-1">
              [{index}]: {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="ml-4">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="border-l border-gray-600 pl-2 my-1">
              <span className="text-blue-300 font-medium">{k}:</span>{" "}
              {renderValue(v)}
            </div>
          ))}
        </div>
      );
    }
    return <span>{String(value)}</span>;
  };

  const filterData = (data: unknown, search: string): unknown => {
    if (!search) return data;

    const searchLower = search.toLowerCase();

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      const filtered: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        data as Record<string, unknown>,
      )) {
        if (key.toLowerCase().includes(searchLower)) {
          filtered[key] = value;
        } else if (
          typeof value === "string" &&
          value.toLowerCase().includes(searchLower)
        ) {
          filtered[key] = value;
        } else if (typeof value === "object") {
          const filteredChild = filterData(value, search);
          if (
            filteredChild &&
            typeof filteredChild === "object" &&
            Object.keys(filteredChild as Record<string, unknown>).length > 0
          ) {
            filtered[key] = filteredChild;
          }
        }
      }
      return Object.keys(filtered).length > 0 ? filtered : null;
    }

    return data;
  };

  const filteredFakts = filterData(fakts, searchTerm);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search configuration..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[60vh]">
        <div className="space-y-3">
          {filteredFakts && typeof filteredFakts === "object"
            ? Object.entries(filteredFakts as Record<string, unknown>).map(
                ([key, value]) => (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        {key}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderValue(value)}</CardContent>
                  </Card>
                ),
              )
            : null}
        </div>
      </ScrollArea>
    </div>
  );
};

// Component to display services in a nice card layout
const ServiceCard: React.FC<{
  serviceKey: string;
  service: Record<string, unknown>;
  isUnresolved?: boolean;
}> = ({ serviceKey, service, isUnresolved = false }) => {
  return (
    <Card
      className={
        isUnresolved ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            {serviceKey}
          </div>
          <Badge variant={isUnresolved ? "destructive" : "default"}>
            {isUnresolved ? (
              <XCircle className="w-3 h-3 mr-1" />
            ) : (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {isUnresolved ? "Unresolved" : "Active"}
          </Badge>
        </CardTitle>
        {typeof service.description === "string" ? (
          <CardDescription>{service.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {typeof service.base_url === "string" ? (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <a
                href={service.base_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {service.base_url}
              </a>
            </div>
          ) : null}
          {typeof service.version === "string" ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Version: {service.version}
            </div>
          ) : null}
          {typeof service.name === "string" && service.name !== serviceKey ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Name: {service.name}
            </div>
          ) : null}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            View Raw Configuration
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
            {JSON.stringify(service, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { setSettings, settings } = useSettings();
  const fakts = Arkitekt.useFakts();


  const form = useForm({
    defaultValues: settings,
  });

  const {
    formState,
    formState: { isValidating },
    watch,
  } = form;

  const data = watch();

  useEffect(() => {
    if (formState.isValid && !isValidating) {
      if (!deepEqual(data, settings)) {
        setSettings(data);
      }
    }
  }, [formState, data, isValidating, settings]);

  return (
    <PageLayout
      pageActions={
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Inspect Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[80vw] max-w-[90vw] h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Application Configuration (Fakts)
                </DialogTitle>
              </DialogHeader>
              <FaktsViewer fakts={fakts} />
            </DialogContent>
          </Dialog>
        </>
      }
      title="Application Settings"
    >
      <div className="space-y-8">
        {/* App Updates Section */}
        <Card>
          <CardHeader>
            <CardTitle>Application Updates</CardTitle>
            <CardDescription>
              Check for and manage application updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateChecker />
          </CardContent>
        </Card>

        {/* Settings Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              User Preferences
            </CardTitle>
            <CardDescription>
              Customize your application experience with these settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => {
                  setSettings(data);
                })}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SwitchField
                    name="experimentalViv"
                    label="Experimental Viv"
                    description="Enable experimental visualization features"
                  />
                  <SwitchField
                    name="experimentalCache"
                    label="Experimental Cache Mode"
                    description="Cache image layers for better performance"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="defaultZoomLevel"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center justify-between w-full gap-2">
                        <FormLabel>
                          Default Zoom Level (
                          {Math.round((field.value || 1.0) * 100)}%)
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const currentValue = field.value || 1.0;
                                const newValue = Math.max(
                                  0.25,
                                  currentValue - 0.05,
                                );
                                field.onChange(newValue);
                              }}
                              disabled={(field.value || 1.0) <= 0.25}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[80px] text-center text-sm font-medium">
                              {Math.round((field.value || 1.0) * 100)}%
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const currentValue = field.value || 1.0;
                                const newValue = Math.min(
                                  3.0,
                                  currentValue + 0.05,
                                );
                                field.onChange(newValue);
                              }}
                              disabled={(field.value || 1.0) >= 3.0}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                      </div>
                      <FormDescription>
                        Set the default zoom level for the application (25% -
                        300%)
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Services Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Server className="w-6 h-6" />
              Connected Services
            </h2>
            <p className="text-muted-foreground mt-1">
              Services that are currently active and configured in your
              application.
            </p>
          </div>

          {fakts?.instances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fakts?.instances.map((service) => (
                <ServiceCard
                  key={service.key}
                  serviceKey={service.key}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active services found</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Page;
