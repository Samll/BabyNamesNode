import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList } from '../navigation/types';
import { namesApi } from '../services/api';
import { BabyName } from '../types';

const MatchedNamesScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'MatchedNames'>
> = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matchedNames'],
    queryFn: namesApi.fetchMatched
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>Loading your shared favourites…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>Unable to retrieve matched names.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matched names</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: BabyName }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.meaning ?? 'Meaning coming soon'}</Text>
            <Text style={styles.meta}>Origin: {item.origin ?? 'Unknown'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.helper}>No matches just yet. Keep swiping!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc'
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
    marginBottom: 16,
    color: '#0f172a'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a'
  },
  meta: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4
  },
  helper: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center'
  }
});

export default MatchedNamesScreen;
