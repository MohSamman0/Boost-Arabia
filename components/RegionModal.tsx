// components/RegionModal.tsx
import React from 'react';
import SelectionModal, { SelectionOption } from './SelectionModal';

interface RegionModalProps {
  visible: boolean;
  currentRegion: string;
  onSelectRegion: (region: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

const options: SelectionOption[] = [
  { value: 'Europe&ME', label: 'Europe & ME', iconName: 'globe-outline' },
  { value: 'North-America', label: 'North-America', iconName: 'globe-outline' },
];

const RegionModal: React.FC<RegionModalProps> = ({
  visible,
  currentRegion,
  onSelectRegion,
  onClose,
  isDarkMode,
}) => (
  <SelectionModal
    visible={visible}
    title="Select Region"
    options={options}
    currentValue={currentRegion}
    onSelect={onSelectRegion}
    onClose={onClose}
    isDarkMode={isDarkMode}
  />
);

export default RegionModal;
