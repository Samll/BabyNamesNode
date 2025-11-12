import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BabyName } from '../types';
import SupermatchBadge from './SupermatchBadge';

interface NameCardProps {
  name: BabyName;
  onLike?: () => void;
  onDislike?: () => void;
  onSupermatch?: () => void;
  disableSupermatch?: boolean;
}

const NameCard: React.FC<NameCardProps> = ({
  name,
  onLike,
  onDislike,
  onSupermatch,
  disableSupermatch
}) => {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.name}>{name.name}</Text>
      {name.meaning ? <Text style={styles.meta}>{name.meaning}</Text> : null}
      {name.origin ? (
        <Text style={styles.meta}>Origin: {name.origin}</Text>
      ) : null}
      <Text style={styles.gender}>Suggested for {name.gender}</Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onDislike}
          style={[styles.button, styles.dislike]}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onLike}
          style={[styles.button, styles.like]}
        >
          <Text style={styles.buttonText}>Like</Text>
        </Pressable>
      </View>
      {onSupermatch ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSupermatch}
          disabled={disableSupermatch}
          style={[styles.button, styles.supermatch, disableSupermatch && styles.disabled]}
        >
          <Text style={[styles.buttonText, styles.supermatchText]}>Supermatch</Text>
          <SupermatchBadge active={!disableSupermatch} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginVertical: 16,
    alignItems: 'center'
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937'
  },
  meta: {
    marginTop: 8,
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center'
  },
  gender: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    columnGap: 16
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  like: {
    backgroundColor: '#2563eb'
  },
  dislike: {
    backgroundColor: '#ef4444'
  },
  supermatch: {
    marginTop: 16,
    columnGap: 12,
    backgroundColor: '#f59e0b'
  },
  disabled: {
    backgroundColor: '#d1d5db'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  },
  supermatchText: {
    textTransform: 'uppercase'
  }
});

export default NameCard;
