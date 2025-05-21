// StepProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  /**
   * If the final step is fully completed,
   * we can show a checkmark on the last circle.
   */
  isFinalStepComplete?: boolean;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  totalSteps,
  labels = ["Select Game", "Choose Service", "Set Rank/Level"],
  isFinalStepComplete = false,
}) => {
  // Steps = [1, 2, 3] if totalSteps=3
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((stepIndex) => {
        /**
         * By default, a step is completed if stepIndex < currentStep.
         * But for the last step, if isFinalStepComplete is true, we also consider it completed.
         */
        let isCompleted = stepIndex < currentStep;
        if (stepIndex === totalSteps && isFinalStepComplete) {
          isCompleted = true;
        }

        // "Active" means it’s not completed yet, but it’s the current step
        const isActive = stepIndex === currentStep && !isCompleted;

        return (
          <React.Fragment key={stepIndex}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isCompleted
                    ? styles.completedCircle
                    : isActive
                    ? styles.activeCircle
                    : styles.inactiveCircle
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                ) : (
                  <Text style={styles.circleText}>{stepIndex}</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>
                {labels[stepIndex - 1] || `Step ${stepIndex}`}
              </Text>
            </View>
            {stepIndex < totalSteps && <View style={styles.line} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default StepProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  activeCircle: {
    backgroundColor: '#635BFF',
    borderColor: '#635BFF',
  },
  completedCircle: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  inactiveCircle: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  circleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  line: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  stepLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    width: 80,
  },
});
