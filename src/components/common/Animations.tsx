import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface Props {
  style?: ViewStyle;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
  from?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
}

const FadeInComponent: React.FC<Props> = ({
  style,
  duration = 300,
  delay = 0,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [duration, delay]);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

const SlideInComponent: React.FC<Props> = ({
  style,
  duration = 300,
  delay = 0,
  from = 'bottom',
  distance = 50,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translation = useRef(new Animated.Value(
    from === 'right' || from === 'bottom' ? distance : -distance
  )).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translation, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [duration, delay, translation]);

  const transform = React.useMemo(() => {
    switch (from) {
      case 'left':
      case 'right':
        return [{ translateX: translation }];
      case 'top':
      case 'bottom':
        return [{ translateY: translation }];
      default:
        return [{ translateY: translation }];
    }
  }, [from, translation]);

  return (
    <Animated.View style={[style, { opacity, transform }]}>
      {children}
    </Animated.View>
  );
};
export const FadeIn = React.memo(FadeInComponent);
export const SlideIn = React.memo(SlideInComponent);

