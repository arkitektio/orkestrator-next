import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateSpaceMembershipMutation,
  useCreateAgentSceneMutation,
  useAgentSceneOptionsLazyQuery,
  useAgentOptionsLazyQuery,
  useThreeDModelOptionsLazyQuery,
} from "../api/graphql";
import { useSpaceScene } from "./context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const SearchSelect = ({
  label,
  onSearch,
  options,
  value,
  onChange,
}: {
  label: string;
  onSearch: (term: string) => void;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input
        placeholder={`Search ${label.toLowerCase()}...`}
        onChange={(e) => onSearch(e.target.value)}
      />
      {options.length > 0 && (
        <div className="mt-1 max-h-32 overflow-y-auto rounded border bg-background">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`w-full px-2 py-1 text-left text-sm hover:bg-accent ${
                value === opt.value ? "bg-accent font-medium" : ""
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AddMembershipDialog = () => {
  const spaceId = useSpaceScene((s) => s.spaceId);
  const addMembership = useSpaceScene((s) => s.addMembership);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("viewer");
  const [selectedSceneId, setSelectedSceneId] = useState("");

  const [searchScenes, { data: sceneData }] =
    useAgentSceneOptionsLazyQuery();
  const [createMembership, { loading }] =
    useCreateSpaceMembershipMutation();

  const handleSearchScenes = useCallback(
    (term: string) => {
      searchScenes({ variables: { search: term } });
    },
    [searchScenes],
  );

  const handleCreate = useCallback(async () => {
    if (!name || !selectedSceneId) return;

    const { data } = await createMembership({
      variables: {
        input: {
          spaceId,
          agentId: selectedSceneId,
        },
      },
    });

    if (data?.createSpaceMembership) {
      const m = data.createSpaceMembership;
      addMembership({
        id: m.id,
        name,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        sceneId: selectedSceneId,
        sceneName: "",
        agentId: "",
        agentName: "",
        media: m.scene.model.file,
      });
      setOpen(false);
      setName("");
      setSelectedSceneId("");
    }
  }, [name, selectedSceneId, spaceId, createMembership, addMembership]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Add Membership
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Space Membership</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Membership name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Role</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. viewer, editor"
            />
          </div>
          <SearchSelect
            label="Agent Scene"
            onSearch={handleSearchScenes}
            options={sceneData?.options ?? []}
            value={selectedSceneId}
            onChange={setSelectedSceneId}
          />
          <Button onClick={handleCreate} disabled={loading || !name || !selectedSceneId}>
            {loading ? "Creating..." : "Create Membership"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CreateAgentSceneDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  const [searchAgents, { data: agentData }] = useAgentOptionsLazyQuery();
  const [searchModels, { data: modelData }] =
    useThreeDModelOptionsLazyQuery();
  const [createScene, { loading }] = useCreateAgentSceneMutation();

  const handleCreate = useCallback(async () => {
    if (!name || !selectedAgentId || !selectedModelId) return;

    await createScene({
      variables: {
        input: {
          agentId: selectedAgentId,
          modelId: selectedModelId,
          transferFunction: description || "default",
        },
      },
    });

    setOpen(false);
    setName("");
    setDescription("");
    setSelectedAgentId("");
    setSelectedModelId("");
  }, [name, description, selectedAgentId, selectedModelId, createScene]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          New Agent Scene
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Agent Scene</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Scene name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <SearchSelect
            label="Agent"
            onSearch={(term) => searchAgents({ variables: { search: term } })}
            options={agentData?.options ?? []}
            value={selectedAgentId}
            onChange={setSelectedAgentId}
          />
          <SearchSelect
            label="3D Model"
            onSearch={(term) => searchModels({ variables: { search: term } })}
            options={modelData?.options ?? []}
            value={selectedModelId}
            onChange={setSelectedModelId}
          />
          <Button
            onClick={handleCreate}
            disabled={
              loading || !name || !selectedAgentId || !selectedModelId
            }
          >
            {loading ? "Creating..." : "Create Scene"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
