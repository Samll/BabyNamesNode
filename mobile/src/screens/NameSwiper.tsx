import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import NameCard from '../components/NameCard';
import { usePendingNames } from '../hooks/usePendingNames';
import SupermatchBadge from '../components/SupermatchBadge';
import RoundProgress from '../components/RoundProgress';
import { useNameStore } from '../store/useNameStore';

const NameSwiperScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'NameSwiper'>
> = ({ navigation }) => {
  const {
    currentName,
    isLoading,
    isError,
    refetch,
    superMatchesRemaining,
    next,
    vote,
    voteStatus
  } = usePendingNames();
  const pendingCount = useNameStore((state) => state.pendingNames.length);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [initialTotal, setInitialTotal] = useState<number | null>(null);

  useEffect(() => {
    if (pendingCount === 0) {
      setInitialTotal(null);
      return;
    }

    if (initialTotal === null) {
      setInitialTotal(pendingCount);
      setReviewedCount(0);
      return;
    }

    if (pendingCount > initialTotal) {
      setInitialTotal(pendingCount);
      setReviewedCount(0);
    }
  }, [pendingCount, initialTotal]);

  const handleVote = useCallback(
    async (voteType: 'like' | 'dislike' | 'supermatch') => {
      if (!currentName) {
        return;
      }
      try {
        await vote({ nameId: currentName.id, vote: voteType });
        next();
        setReviewedCount((count) => count + 1);
      } catch (error) {
        Alert.alert('Vote failed', 'Please try again in a moment.');
      }
    },
    [currentName, next, vote]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.helper}>Loading fresh names…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>Unable to load names.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentName) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helper}>You are all caught up for now!</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => navigation.navigate('RoundSummary')}
        >
          <Text style={styles.retryText}>View round summary</Text>
        </Pressable>
      </View>
    );
  }

  const totalCount = reviewedCount + pendingCount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vote together</Text>
        <SupermatchBadge remaining={superMatchesRemaining} active={superMatchesRemaining > 0} />
      </View>
      <RoundProgress current={reviewedCount} total={totalCount} />
      <NameCard
        name={currentName}
        onLike={() => handleVote('like')}
        onDislike={() => handleVote('dislike')}
        onSupermatch={superMatchesRemaining > 0 ? () => handleVote('supermatch') : undefined}
        disableSupermatch={superMatchesRemaining <= 0 || voteStatus === 'pending'}
      />
      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('MatchedNames')}
      >
        <Text style={styles.secondaryText}>See matched names</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f1f5f9'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  helper: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569',
    textAlign: 'center'
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb'
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  secondaryButton: {
    marginTop: 'auto',
    alignItems: 'center'
  },
  secondaryText: {
    color: '#2563eb',
    fontWeight: '600'
  }
});

export default NameSwiperScreen;
