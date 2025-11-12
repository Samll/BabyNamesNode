import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SupermatchBadgeProps {
  remaining?: number;
  active?: boolean;
}

const SupermatchBadge: React.FC<SupermatchBadgeProps> = ({ remaining, active = true }) => {
  return (
    <View style={[styles.container, !active && styles.inactive]}>
      <Text style={styles.label}>Supermatch</Text>
      {typeof remaining === 'number' ? (
        <View style={styles.counter}>
          <Text style={styles.counterText}>{remaining}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999
  },
  inactive: {
    backgroundColor: '#6b7280'
  },
  label: {
    color: '#facc15',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  counter: {
    marginLeft: 8,
    backgroundColor: '#facc15',
    borderRadius: 999,
    minWidth: 24,
    alignItems: 'center'
  },
  counterText: {
    paddingHorizontal: 8,
    color: '#111827',
    fontWeight: '700'
  }
});

export default SupermatchBadge;
