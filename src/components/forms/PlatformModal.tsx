// components/PlatformModal.tsx
import React from 'react';
import SelectionModal, { SelectionOption } from './SelectionModal';

interface PlatformModalProps {
  visible: boolean;
  currentPlatform: string;
  onSelectPlatform: (platform: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

const options: SelectionOption[] = [
  { value: 'Pc', label: 'PC', iconName: 'desktop-outline' },
  { value: 'Ps5', label: 'PS5', iconName: 'logo-playstation' },
];

const PlatformModal: React.FC<PlatformModalProps> = ({
  visible,
  currentPlatform,
  onSelectPlatform,
  onClose,
  isDarkMode,
}) => (
  <SelectionModal
    visible={visible}
    title="Select Platform"
    options={options}
    currentValue={currentPlatform}
    onSelect={onSelectPlatform}
    onClose={onClose}
    isDarkMode={isDarkMode}
  />
);

export default PlatformModal;
