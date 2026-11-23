import {
  Button,
  AssetPickerDialog,
  VendureImage,
  graphql,
  api,
  assetFragment,
} from "@vendure/dashboard";
import { DashboardFormComponent } from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon, X } from "lucide-react";
import { useState, useEffect } from "react";

const getAssetDocument = graphql(
  `
    query GetAsset($id: ID!) {
      asset(id: $id) {
        ...Asset
      }
    }
  `,
  [assetFragment],
);

export const AssetIdInput: DashboardFormComponent = ({
  value,
  onChange,
  entity,
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Initial load of asset from entity if available
  useEffect(() => {
    if (entity?.image && entity.image.id === value) {
      setSelectedAsset(entity.image);
    }
  }, [entity, value]);

  // Fetch asset if ID changes and we don't have the object
  const { data } = useQuery({
    queryKey: ["asset", value],
    queryFn: () => api.query(getAssetDocument, { id: value }),
    enabled: !!value && (!selectedAsset || selectedAsset.id !== value),
  });

  useEffect(() => {
    if (data?.asset) {
      setSelectedAsset(data.asset);
    }
  }, [data]);

  // Cleanup: if value becomes null, clear selectedAsset
  useEffect(() => {
    if (!value) {
      setSelectedAsset(null);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        {selectedAsset ? (
          <div className="relative group">
            <VendureImage
              asset={selectedAsset}
              preset="thumb"
              className="w-24 h-24 object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedAsset(null);
                onChange(null);
              }}
              className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 shadow-md flex items-center justify-center opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground bg-muted/30">
            <ImageIcon className="w-8 h-8 opacity-50" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            {selectedAsset ? "Change Asset" : "Select Asset"}
          </Button>
          <p className="text-xs text-muted-foreground">
            {selectedAsset ? selectedAsset.name : "No image selected"}
          </p>
        </div>
      </div>

      <AssetPickerDialog
        open={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(assets) => {
          if (assets.length > 0) {
            const asset = assets[0];
            setSelectedAsset(asset);
            onChange(asset.id);
          }
          setPickerOpen(false);
        }}
        initialSelectedAssets={selectedAsset ? [selectedAsset] : []}
      />
    </div>
  );
};
