// @ts-nocheck
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useContext, useEffect, useState } from 'react';
import { Context } from '@/store/contextProvider';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-menu';
import { Textarea } from '@/components/ui/textarea';

const allBuildings = (
  selectedBuilding: MapboxGeoJSONFeature,
  buildings: MapboxGeoJSONFeature[],
) => {
  return [selectedBuilding, ...buildings];
};

export default function BottomDrawer() {
  const {
    selectedOtherBuildings,
    selectedBuilding,
    setCurrentDetailsFeatureId,
  } = useContext(Context);
  const [open, setOpen] = useState(
    selectedOtherBuildings.length > 0 || !!selectedBuilding,
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  useEffect(() => {
    setOpen(selectedOtherBuildings.length > 0 || !!selectedBuilding);
    setSelectedId(undefined);
  }, [selectedOtherBuildings, selectedBuilding]);

  const buildings = allBuildings(selectedBuilding!, selectedOtherBuildings);
  const buildingsIds = buildings
    .map((building) => building.id)
    .filter(Boolean)
    .reduce((acc: string[], id) => {
      let newId = "" + id;
      let counter = 2;
      while (acc.includes(newId as string)) {
        newId = `${id}-${counter}`;
        counter += 1;
      }
      acc.push(newId);
      return acc;
    }, []);
  const selectedBuildingId = (id: string) => {
    setSelectedId(id);
    setCurrentDetailsFeatureId(Number(id.split('-')[0]));
  };

  return (
    <Sheet key="bottom" modal={false} open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="h-1/3 flex">
        <div>
          <SheetHeader>
            <SheetTitle>
              {selectedOtherBuildings.length > 1
                ? 'Complex Building'
                : 'Simple Building'}
            </SheetTitle>
            <SheetDescription className="text-sm">
              Click on the ID to see the details
            </SheetDescription>
          </SheetHeader>
          <Select onValueChange={selectedBuildingId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Building ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {buildingsIds.map((id, index) => (
                  <SelectItem key={id} value={[] + id} className="text-sm">
                    {id}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-col gap-1.5 hidden sm:block">
          <Label htmlFor="props" className="text-sm">
            Properties
          </Label>
          {selectedId && (
            <Textarea
              id="props"
              rows={13}
              className="w-52 resize-none"
              disabled={true}
              value={selectedBuildingProps(
                buildings[buildingIndex(selectedId, buildingsIds)],
              )}
            />
          )}
        </div>
        <div className="flex-col gap-1.5 hidden md:block">
          <Label htmlFor="props" className="text-sm">
            Values
          </Label>
          {selectedId && (
            <Textarea
              id="props"
              rows={13}
              className="w-52 resize-none"
              disabled={true}
              value={selectedBuildingValues(
                buildings[buildingIndex(selectedId, buildingsIds)],
              )}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const buildingIndex = (id: string, buildingsIds: string[]) => {
  return buildingsIds.findIndex((building) => building === id);
};

const selectedBuildingProps = (building: MapboxGeoJSONFeature) => {
  const props = building?.properties;
  return Object.entries(props || {})
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join('\n');
};

const selectedBuildingValues = (building: MapboxGeoJSONFeature) => {
  const props = building?._vectorTileFeature?._values;
  return Object.entries(props || {})
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join('\n');
};
