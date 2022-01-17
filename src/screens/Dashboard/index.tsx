import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import {
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Container,
  Header,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  ListTransactions,
  LogoutButton,
  LoadContainer,
} from './styles';
import HighlightCard from '../../components/HighlightCard';
import TransactionCard, {
  TransactionCardProps,
} from '../../components/TransactionCard';
import { ActivityIndicator } from 'react-native';

export interface DataListProps extends TransactionCardProps {
  id: string;
}
const data: DataListProps[] = [
  {
    id: '1',
    type: 'positive',
    name: 'Desenvolvimento de site',
    amount: 'R$ 12.000,00',
    category: { name: 'Vendas', icon: 'dollar-sign' },
    date: '13/04/2022',
  },
  {
    id: '2',
    type: 'negative',
    name: 'Hamburgueria Pizzy',
    amount: 'R$ 59',
    category: { name: 'Alimentação', icon: 'coffee' },
    date: '10/04/2022',
  },
  {
    id: '3',
    type: 'negative',
    name: 'Aluguel do Apartamento',
    amount: 'R$ 1.200,00',
    category: { name: 'Casa', icon: 'home' },
    date: '27/03/2022',
  },
  {
    id: '4',
    type: 'positive',
    name: 'Computador',
    amount: 'R$ 5.400,00',
    category: { name: 'Vendas', icon: 'dollar-sign' },
    date: '27/03/2022',
  },
];

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const dataKey = `@gofinances:transactions_user:${user.id}`;
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();

  const getLastTransactionDate = (
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) => {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFiltered.length === 0) return 0;
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`;
  };
  const loadTransactions = async () => {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    let entriesTotal = transactions
      .filter((transaction: DataListProps) => transaction.type === 'positive')
      .reduce((acc: number, curr: DataListProps) => acc + curr.amount, 0);
    let expensesTotal = transactions
      .filter((transaction: DataListProps) => transaction.type === 'negative')
      .reduce((acc: number, curr: DataListProps) => acc + curr.amount, 0);
    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          date,
          type: item.type,
          category: item.category,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionsEntries = getLastTransactionDate(
      transactions,
      'positive'
    );

    const lastTransactionsExpenses = getLastTransactionDate(
      transactions,
      'negative'
    );

    const totalInterval =
      lastTransactionsExpenses === 0
        ? 'Não há transações'
        : `01 a ${lastTransactionsExpenses}`;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionsEntries,
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionsExpenses,
      },
      total: {
        amount: (entriesTotal - expensesTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
    // AsyncStorage.removeItem(dataKey);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size='large' />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name} </UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name='power' onPress={signOut} />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              type='up'
              title='Entradas'
              amount={highlightData?.entries?.amount}
              lastTransaction={
                highlightData.entries.lastTransaction === 0
                  ? 'Não há transações'
                  : `Última entrada dia ${highlightData.entries.lastTransaction}`
              }
            />
            <HighlightCard
              type='down'
              title='Saídas'
              amount={highlightData?.expenses?.amount}
              lastTransaction={
                highlightData.expenses.lastTransaction === 0
                  ? 'Não há transações'
                  : `Última entrada dia ${highlightData.expenses.lastTransaction}`
              }
            />
            <HighlightCard
              type='total'
              title='Total'
              amount={highlightData?.total?.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <ListTransactions
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
