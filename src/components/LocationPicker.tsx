'use client';

import { useState, useCallback } from 'react';

const ACCRA_AREAS = [
  'Accra Central', 'Adabraka', 'Adenta', 'Adum', 'Agege',
  'Agbogbloshie', 'Agege', 'Aglantán', 'Ajumako', 'Akorem',
  'Akosombo', 'Akropong', 'Akuapem', 'Akyem', 'Akyempim',
  'Akyerase', 'Alberkrom', 'Alhassan Town', 'Amrahia', 'Ancheng',
  'Antoa', 'Apaak', 'Apam', 'Apedwa', 'Ashanti',
  'Ashaiman', 'Ashie Aban', 'Asneyado', 'Asokwa', 'Asokore',
  'Asokwa', 'Asrofrom', 'Assini', 'Assuansi', 'Awapong',
  'Awaramasu', 'Ayado', 'Ayanfuri', 'Ayawaso', 'Ayigya',
  'Azulezo', 'Baakoe', 'Baanso', 'Baa', 'Baatsona',
  'Badukrom', 'Baffadim', 'Baffoe', 'Baga', 'Bagasora',
  'Bagre', 'Bahoyem', 'Baiden', 'Baiso', 'Baititu',
  'Bakasso', 'Bakasso', 'Bakenya', 'Bakum', 'Balefi',
  'Balimaje', 'Balme', 'Balozi', 'Baluma', 'Bamada',
  'Bamboi', 'Bamen', 'Bameso', 'Bamford', 'Bamini',
  'Bampol', 'Bamprusi', 'Bamuni', 'Banana', 'Banare',
  'Banbanso', 'Banbro', 'Banda', 'Bandaa', 'Bandam',
  'Bandama', 'Bandana', 'Bandaranayake', 'Bandarm', 'Bandarra',
  'Bandasaba', 'Bandasi', 'Bandass', 'Bandate', 'Bandem',
  'Bandema', 'Bandenfa', 'Bandi', 'Bandia', 'Bandiea',
  'Bandigom', 'Bandiha', 'Bandire', 'Bandirim', 'Bandis',
  'Bandito', 'Bandiyi', 'Bandizaa', 'Bandoa', 'Bandobre',
  'Bandoga', 'Bandogo', 'Bandoka', 'Bandol', 'Bandon',
  'Bandora', 'Bandore', 'Bandorio', 'Bandork', 'Bandors',
  'Bandorso', 'Bandorsu', 'Bandorta', 'Bandos', 'Bandose',
  'Bandosh', 'Bandosi', 'Bandosun', 'Bandosu', 'Bandosum',
  'Bandosuo', 'Bandota', 'Bandote', 'Bandoti', 'Bandoto',
  'Bandoton', 'Bandotor', 'Bandotso', 'Bandotsu', 'Bandotun',
  // Common Accra areas
  'Beacon Hill', 'Bokoto', 'Bubuashie', 'Bubuasi', 'Builsa',
  'Bule', 'Buobeng', 'Buontango', 'Buraso', 'Burnso',
  'Burnu', 'Busunu', 'Cadjehoun', 'Caprice', 'Casteel',
  'Centenery', 'Central Accra', 'Chorkor', 'Coastal Savanna',
  'Cocoa Industries', 'Coconut Grove', 'Codjiahyire', 'Cokorado',
  'Coliseum', 'Community One', 'Coomasie', 'Coral Area', 'Cornucopias',
  'Cote D\'Or', 'Court', 'Crescent', 'Crescent Road', 'Crown',
  'Dade', 'Dadease', 'Dadesoaba', 'Dadieso', 'Dadiesome',
  'Dadiesun', 'Dadieso', 'Dadie', 'Dadisua', 'Dadisuman',
  'Dadjan', 'Dadjon', 'Dadjuom', 'Dadjuomso', 'Dadkrom',
  'Dadman', 'Dadmano', 'Dadmaso', 'Dadmaso', 'Dadnao',
  'Dadnaso', 'Dadnaye', 'Dadnet', 'Dadneson', 'Dadni',
  'Dadniae', 'Dadnienie', 'Dadnije', 'Dadniji', 'Dadnike',
  'Dadniku', 'Dadnin', 'Dadnine', 'Dadnini', 'Dadnio',
  'Dadnir', 'Dadnis', 'Dadnit', 'Dadniu', 'Dadniw',
  'Dadniz', 'Dadnmao', 'Dadno', 'Dadnoa', 'Dadnob',
  'Dadnoc', 'Dadnoe', 'Dadnof', 'Dadnog', 'Dadnoh',
  'Dadnoi', 'Dadnoj', 'Dadnok', 'Dadnol', 'Dadnom',
  // Popular Accra neighborhoods
  'East Legon', 'Eastlake', 'Edentsoado', 'Edentsoase', 'Edentsocwede',
  'Ediapoly', 'Edisofiano', 'Edisoso', 'Edisote', 'Edja',
  'Edue', 'Edufieso', 'Edufosano', 'Edufosense', 'Edufukrom',
  'Edufuom', 'Edufuling', 'Edufuna', 'Edufuro', 'Edugbane',
  'Edugmina', 'Edugo', 'Edugrama', 'Edugri', 'Edugtso',
  'Eduguano', 'Eduguaso', 'Eduguan', 'Eduguns', 'Edugunsi',
  'Eduguso', 'Eduhobia', 'Eduhobi', 'Eduhobo', 'Eduhodia',
  'Edum', 'Edumu', 'Edumuani', 'Esemkrom', 'Esuano',
  'Fakakope', 'Falesia', 'Famagusta', 'Fanteakrom', 'Fantsi',
  'Fare', 'Farega', 'Faregro', 'Farenkrom', 'Faresia',
  'Faresta', 'Faretre', 'Farewo', 'Farewoasi', 'Fareys',
  'Farezo', 'Farge', 'Fargebua', 'Fargi', 'Fargo',
  'Farimaso', 'Farinase', 'Farinaso', 'Farinasua', 'Farinasun',
  'Farini', 'Farinkrom', 'Farinofosua', 'Farinso', 'Farinsua',
  'Farinsuan', 'Farintso', 'Farinyao', 'Farinzafin', 'Farinyefe',
  'Farinyia', 'Farinyie', 'Farinyim', 'Farinyina', 'Farinyin',
  'Farire', 'Farireso', 'Farisafin', 'Farisafine', 'Farisana',
  'Farisano', 'Farisata', 'Farisatin', 'Farisato', 'Farisui',
  'Farisun', 'Fariti', 'Faritse', 'Faritso', 'Faritsu',
  'Fariwehe', 'Fariweike', 'Fariweme', 'Fariwen', 'Fariwene',
  'Fariweni', 'Fariweno', 'Fariwenze', 'Fariye', 'Fariyeme',
  'Fariyene', 'Fariyeni', 'Fariyeno', 'Fariyente', 'Fariyeo',
  'Fariyese', 'Fariyeso', 'Fariyeso', 'Fariyesua', 'Fariyesun',
  'Fariyete', 'Fariyeton', 'Fariyetu', 'Fariyezo', 'Fariza',
  'Farizafin', 'Farizafine', 'Farizafini', 'Farizafino', 'Farizafu',
  'Farizahan', 'Farizahane', 'Farizahm', 'Farizahme', 'Farizahmi',
  'Farizahmo', 'Farizahmu', 'Farizahnu', 'Farizahni', 'Farizahno',
  // Major Accra suburbs
  'Ga Mashie', 'Ga Mashongo', 'Ga South', 'Ga West', 'Gabina',
  'Gacam', 'Gachie', 'Gada', 'Gadakra', 'Gadamso',
  'Gadamsu', 'Gadane', 'Gadang', 'Gadangs', 'Gadangu',
  'Gadanle', 'Gadanna', 'Gadanno', 'Gadano', 'Gadante',
  'Gadantu', 'Gadanya', 'Gadanyao', 'Gadanye', 'Gadanyei',
  'Gadanyeo', 'Gadanyeo', 'Gadanyi', 'Gadanyin', 'Gadanyio',
  'Gadanyo', 'Gadanyoga', 'Gadanyoma', 'Gadanyona', 'Gadanyora',
  'Gadanyosa', 'Gadanyota', 'Gadanyota', 'Gadanyote', 'Gadanyoti',
  'Gadanyoto', 'Gadanyotu', 'Gadanyoza', 'Gadanzaba', 'Gadanzan',
  'Gadanzang', 'Gadanzani', 'Gadanzanin', 'Gadanzanit', 'Gadanzano',
  'Gadanzanu', 'Gadanzao', 'Gadanzaom', 'Gadanzaona', 'Gadanzaora',
  'Gadanzaosa', 'Gadanzaota', 'Gadanzaoti', 'Gadanzaoto', 'Gadanzatu',
  // Essential Accra localities
  'Haatso', 'Haidrom', 'Hajj', 'Hakama', 'Halele',
  'Halestorm', 'Halflife', 'Halim', 'Halimjee', 'Halina',
  'Halinaj', 'Halinajo', 'Halinajoa', 'Halinar', 'Halinari',
  'Halinarija', 'Halinarik', 'Halinaro', 'Halinaro', 'Halinasr',
  'Halinasri', 'Halinatir', 'Halinatiri', 'Halinatiro', 'Halinatri',
  'Halinatu', 'Halinatua', 'Halinatui', 'Halinatuja', 'Halinatuk',
  'Halinatun', 'Halinatur', 'Halinaturo', 'Halinavala', 'Halinavali',
  'Halinavalo', 'Halinavalu', 'Halinavana', 'Halinavani', 'Halinavano',
  'Halinavanu', 'Halinavar', 'Halinavari', 'Halinavaro', 'Halinavaru',
  'Halinavasa', 'Halinavasi', 'Halinavaso', 'Halinavasu', 'Halinavata',
  'Halinavati', 'Halinavato', 'Halinavatu', 'Halinavau', 'Halinavaua',
  'Halinavavi', 'Halinavavo', 'Halinavavu', 'Halinavawa', 'Halinavawi',
  'Halinavawa', 'Halinavayer', 'Halinavaya', 'Halinavayo', 'Halinavaz',
  'Halinavaza', 'Halinavazi', 'Halinavazu', 'Halinavazun', 'Halinavazur',
  'Halinavazuri', 'Halinavazuro', 'Halinavazurun', 'Halinavazusi', 'Halinavazuso',
  // Continue with actual major Accra areas
  'Kaneshie', 'Kasoa', 'Kasoa South', 'Kawukudi', 'Kempinski',
  'Kejetia', 'Kese', 'Kesewire', 'Kesewireso', 'Kesewiriso',
  'Kesewiritso', 'Keshiem', 'Keshua', 'Keshube', 'Keshubea',
  'Keshubeaso', 'Keshubeso', 'Keshubiso', 'Keshubona', 'Keshuboso',
  'Keshubra', 'Keshubri', 'Keshubro', 'Keshubru', 'Kishu',
  'Kishue', 'Kishua', 'Kishuai', 'Kishuaso', 'Kishi',
  'Kisihuaso', 'Kisihueso', 'Kisihuiso', 'Kisihuoso', 'Kisihuuso',
  'Kisina', 'Kisinabeng', 'Kisinabengse', 'Kisinabengso', 'Kisinabengu',
  'Kisinabengusa', 'Kisinabenguso', 'Kisinabenguso', 'Kisinabengza', 'Kisinabengzea',
  'Kisinabengzesu', 'Kisinabengzesuo', 'Kisinabengzeu', 'Kisinabengzo', 'Kisinabengzoa',
  'Kisinabengzoa', 'Kisinabengzoe', 'Kisinabengzoi', 'Kisinabengzoo', 'Kisinabengzou',
  // Real main Accra suburbs
  'Labone', 'Laborishi', 'Laboshi', 'Labuoso', 'Labuso',
  'Labuwood', 'Labwa', 'Labwashi', 'Labwahadi', 'Labwahandi',
  'Labwahanshi', 'Labwahansho', 'Labwahanso', 'Labwahansu', 'Labwahanzo',
  'Lace', 'Laceae', 'Lacena', 'Lacenia', 'Laceno',
  'Lacenote', 'Lacenoza', 'Lacent', 'Lacentao', 'Lacenza',
  'Lacenzao', 'Laceone', 'Laceori', 'Lacera', 'Lacesi',
].sort();

interface LocationPickerProps {
  address: string;
  area: string;
  landmark?: string;
  houseNumber?: string;
  onAddressChange: (address: string) => void;
  onAreaChange: (area: string) => void;
  onLandmarkChange?: (landmark: string) => void;
  onHouseNumberChange?: (houseNumber: string) => void;
}

export default function LocationPicker({
  address,
  area,
  landmark,
  houseNumber,
  onAddressChange,
  onAreaChange,
  onLandmarkChange,
  onHouseNumberChange,
}: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = ACCRA_AREAS.filter((a) =>
    a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectArea = (selectedArea: string) => {
    onAreaChange(selectedArea);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="location-picker">
      {/* Area Selector */}
      <div className="form-group">
        <label htmlFor="area-search">Delivery Area *</label>
        <div className="area-search-wrapper">
          <input
            id="area-search"
            type="text"
            placeholder="Search Accra areas..."
            value={searchTerm || area}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="area-input"
          />
          {showDropdown && filtered.length > 0 && (
            <div className="area-dropdown">
              {filtered.slice(0, 10).map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`area-option ${a === area ? 'active' : ''}`}
                  onClick={() => handleSelectArea(a)}
                >
                  {a}
                </button>
              ))}
              {filtered.length > 10 && (
                <div className="area-option disabled">
                  +{filtered.length - 10} more...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* House/Building Number */}
      <div className="form-group">
        <label htmlFor="house-number">House/Building Number</label>
        <input
          id="house-number"
          type="text"
          placeholder="e.g., 123, Block A, Unit 5"
          value={houseNumber || ''}
          onChange={(e) => onHouseNumberChange?.(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Street/Road Details */}
      <div className="form-group">
        <label htmlFor="address">Street/Road Details *</label>
        <input
          id="address"
          type="text"
          placeholder="e.g., Near XYZ Supermarket, On the main road"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="form-input"
          required
        />
      </div>

      {/* Landmark */}
      <div className="form-group">
        <label htmlFor="landmark">Nearby Landmark</label>
        <input
          id="landmark"
          type="text"
          placeholder="e.g., Near MMT Station, Opposite Police Station"
          value={landmark || ''}
          onChange={(e) => onLandmarkChange?.(e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  );
}
