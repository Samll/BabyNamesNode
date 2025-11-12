import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCurrentRound } from '../hooks/useRounds';
import { BabyName } from '../types';

const RoundSummaryScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'RoundSummary'>
> = () => {
  const { data, isLoading, isError } = useCurrentRound();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>Fetching latest results…</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>We could not load the round summary.</Text>
      </View>
    );
  }

  const renderName = ({ item }: { item: BabyName }) => (
    <View style={styles.nameRow}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>{item.origin ?? 'Unknown origin'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round {data.roundId}</Text>
      <Text style={styles.subtitle}>
        {data.totalVotes} votes cast • {data.superMatches.length} supermatches
      </Text>
      <Text style={styles.sectionTitle}>Supermatches</Text>
      <FlatList
        data={data.superMatches}
        keyExtractor={(item) => item.id}
        renderItem={renderName}
        ListEmptyComponent={<Text style={styles.helper}>No supermatches yet.</Text>}
      />
      <Text style={styles.sectionTitle}>Matched names</Text>
      <FlatList
        data={data.matchedNames}
        keyExtractor={(item) => item.id}
        renderItem={renderName}
        ListEmptyComponent={<Text style={styles.helper}>No matches yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#4b5563'
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  nameRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  meta: {
    fontSize: 14,
    color: '#6b7280'
  },
  helper: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center'
  }
});

export default RoundSummaryScreen;
