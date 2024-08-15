import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContext } from 'react';
import { Context } from '@/store/contextProvider';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const {
    showPopup,
    setShowPopup,
    showTileBoundaries,
    setShowTileBoundaries,
    showDetails,
    setShowDetails,
    searchRadius,
    setSearchRadius,
    typeComplexBuilding,
    setTypeComplexBuilding,
  } = useContext(Context);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-28 right-2 z-10 w-8 h-8">
          <GearIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showPopup}
          onCheckedChange={() => setShowPopup(!showPopup)}
          onSelect={(e) => e.preventDefault()}>
          Show popup
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showTileBoundaries}
          onCheckedChange={() => setShowTileBoundaries(!showTileBoundaries)}
          onSelect={(e) => e.preventDefault()}>
          Show tile boundaries
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showDetails}
          onCheckedChange={() => setShowDetails(!showDetails)}
          onSelect={(e) => e.preventDefault()}>
          Show details
        </DropdownMenuCheckboxItem>
        <DropdownMenuItem
          className="w-58 h-8 pl-8"
          onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center space-x-2">
            <Switch
              id="type-mode"
              checked={typeComplexBuilding}
              onCheckedChange={() =>
                setTypeComplexBuilding(!typeComplexBuilding)
              }
            />
            <Label htmlFor="type-mode" className="text-xs">
              Complexity by <b>attributes/geometry</b>
            </Label>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-58 h-8 pl-8"
          onSelect={(e) => e.preventDefault()}>
          <div className="flex items-center">
            <Slider
              defaultValue={[200]}
              value={[searchRadius]}
              min={100}
              max={300}
              step={100}
              className="w-20"
              disabled={typeComplexBuilding}
              onValueChange={(values) => setSearchRadius(values[0])}
            />
            <div className={`text-xs pl-2 ${typeComplexBuilding ? 'text-gray-300' : 'text-black'}`}>{`${searchRadius}m search`}</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
