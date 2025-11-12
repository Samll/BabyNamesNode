import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RoundProgressProps {
  current: number;
  total: number;
}

const RoundProgress: React.FC<RoundProgressProps> = ({ current, total }) => {
  const progress = total === 0 ? 0 : (current / total) * 100;

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <View style={[styles.bar, { width: `${progress}%` }]} />
      <Text style={styles.label}>
        {current} of {total} names reviewed
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 16
  },
  bar: {
    height: 12,
    backgroundColor: '#2563eb'
  },
  label: {
    position: 'absolute',
    width: '100%',
    top: 12,
    textAlign: 'center',
    fontSize: 12,
    color: '#111827'
  }
});

export default RoundProgress;
