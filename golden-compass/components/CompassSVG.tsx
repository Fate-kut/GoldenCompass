import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/theme';

interface CompassSVGProps {
  size?: number;
  spin?: boolean;
}

export function CompassSVG({ size = 60, spin = false }: CompassSVGProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spin) return;
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s / 2 - 3;

  return (
    <Animated.View style={spin ? { transform: [{ rotate }] } : undefined}>
      <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={Colors.gold} strokeWidth={1.5} opacity={0.6} />
        <Circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke={Colors.gold} strokeWidth={0.8} opacity={0.3} />
        <Circle cx={cx} cy={cy} r={2.5} fill={Colors.goldLight} />
        {/* North needle - gold */}
        <Path d={`M${cx} ${cy * 0.15} L${cx + 4} ${cy - 4} L${cx} ${cy - 2} L${cx - 4} ${cy - 4} Z`} fill={Colors.goldLight} />
        {/* South needle - grey */}
        <Path d={`M${cx} ${s - cy * 0.15} L${cx + 4} ${cy + 4} L${cx} ${cy + 2} L${cx - 4} ${cy + 4} Z`} fill={Colors.textMuted} />
        {/* East needle - grey */}
        <Path d={`M${s - cx * 0.15} ${cy} L${cx + 4} ${cy - 4} L${cx + 2} ${cy} L${cx + 4} ${cy + 4} Z`} fill={Colors.textMuted} opacity={0.7} />
        {/* West needle - grey */}
        <Path d={`M${cx * 0.15} ${cy} L${cx - 4} ${cy - 4} L${cx - 2} ${cy} L${cx - 4} ${cy + 4} Z`} fill={Colors.textMuted} opacity={0.7} />
        {/* Cardinal markers */}
        <Line x1={cx} y1={3} x2={cx} y2={10} stroke={Colors.gold} strokeWidth={1.5} />
        <Line x1={cx} y1={s - 3} x2={cx} y2={s - 10} stroke={Colors.gold} strokeWidth={1} opacity={0.6} />
        <Line x1={3} y1={cy} x2={10} y2={cy} stroke={Colors.gold} strokeWidth={1} opacity={0.6} />
        <Line x1={s - 3} y1={cy} x2={s - 10} y2={cy} stroke={Colors.gold} strokeWidth={1} opacity={0.6} />
      </Svg>
    </Animated.View>
  );
}
