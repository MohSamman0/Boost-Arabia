// components/SelectionModal.tsx
import React from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SelectionOption {
  value: string;
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

interface SelectionModalProps {
  visible: boolean;
  title: string;
  options: SelectionOption[];
  currentValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  visible,
  title,
  options,
  currentValue,
  onSelect,
  onClose,
  isDarkMode,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, isDarkMode && styles.darkSheet]}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>{title}</Text>
            {options.map(({ value, label, iconName }) => (
              <TouchableOpacity
                key={value}
                style={styles.itemRow}
                onPress={() => {
                  onSelect(value);
                  onClose();
                }}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isDarkMode ? '#fff' : '#000'}
                  style={styles.icon}
                />
                <Text style={[styles.label, isDarkMode && styles.darkText]}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  darkSheet: {
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cancelText: {
    fontSize: 16,
    color: '#000',
  },
});

export default SelectionModal;