import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type ContextType = {
  selectedBuildingId: number;
  setSelectedBuildingId: Dispatch<
    SetStateAction<ContextType['selectedBuildingId']>
  >;
  selectedOtherBuildings: MapboxGeoJSONFeature[];
  setSelectedOtherBuildings: Dispatch<
    SetStateAction<ContextType['selectedOtherBuildings']>
  >;
  showPopup: boolean;
  setShowPopup: Dispatch<SetStateAction<ContextType['showPopup']>>;
  showTileBoundaries: boolean;
  setShowTileBoundaries: Dispatch<
    SetStateAction<ContextType['showTileBoundaries']>
  >;
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<ContextType['showDetails']>>;
  searchRadius: number;
  setSearchRadius: Dispatch<SetStateAction<ContextType['searchRadius']>>;
  typeComplexBuilding: boolean;
  setTypeComplexBuilding: Dispatch<
    SetStateAction<ContextType['typeComplexBuilding']>
  >;
};

const initialContext: ContextType = {
  selectedBuildingId: 0,
  setSelectedBuildingId: () => {},
  selectedOtherBuildings: [],
  setSelectedOtherBuildings: () => {},
  showPopup: true,
  setShowPopup: () => {},
  showTileBoundaries: false,
  setShowTileBoundaries: () => {},
  showDetails: false,
  setShowDetails: () => {},
  searchRadius: 200,
  setSearchRadius: () => {},
  typeComplexBuilding: false,
  setTypeComplexBuilding: () => {},
};

export const Context = createContext<ContextType>(initialContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    ContextType['selectedBuildingId']
  >(initialContext.selectedBuildingId);
  const [selectedOtherBuildings, setSelectedOtherBuildings] = useState<
    ContextType['selectedOtherBuildings']
  >(initialContext.selectedOtherBuildings);
  const [showPopup, setShowPopup] = useState<ContextType['showPopup']>(
    initialContext.showPopup,
  );
  const [showTileBoundaries, setShowTileBoundaries] = useState<
    ContextType['showTileBoundaries']
  >(initialContext.showTileBoundaries);
  const [showDetails, setShowDetails] = useState<ContextType['showDetails']>(
    initialContext.showDetails,
  );
  const [searchRadius, setSearchRadius] = useState<ContextType['searchRadius']>(
    initialContext.searchRadius,
  );
  const [typeComplexBuilding, setTypeComplexBuilding] = useState<
    ContextType['typeComplexBuilding']
  >(initialContext.typeComplexBuilding);

  return (
    <Context.Provider
      value={{
        selectedBuildingId,
        setSelectedBuildingId,
        selectedOtherBuildings,
        setSelectedOtherBuildings,
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
      }}>
      {children}
    </Context.Provider>
  );
};
