import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type ContextType = {
  selectedBuilding: MapboxGeoJSONFeature | null;
  setSelectedBuilding: Dispatch<
    SetStateAction<ContextType['selectedBuilding']>
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
  currentDetailsFeatureId: number;
  setCurrentDetailsFeatureId: Dispatch<
    SetStateAction<ContextType['currentDetailsFeature']>
  >;
};

const initialContext: ContextType = {
  selectedBuilding: null,
  setSelectedBuilding: () => {},
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
  currentDetailsFeatureId: 0,
  setCurrentDetailsFeatureId: () => {},
};

export const Context = createContext<ContextType>(initialContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    ContextType['selectedBuilding']
  >(initialContext.selectedBuilding);
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
  const [currentDetailsFeatureId, setCurrentDetailsFeatureId] = useState<
    ContextType['currentDetailsFeatureId']
  >(initialContext.currentDetailsFeatureId);

  return (
    <Context.Provider
      value={{
        selectedBuilding: selectedBuildingId,
        setSelectedBuilding: setSelectedBuildingId,
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
        currentDetailsFeatureId,
        setCurrentDetailsFeatureId,
      }}>
      {children}
    </Context.Provider>
  );
};
