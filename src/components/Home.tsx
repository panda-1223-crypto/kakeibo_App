import React from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Home: React.FC = () => {
  return (
    <main>
      <section className="transaction-form">
        <h2>新しい取引を追加</h2>
        <TransactionForm />
      </section>
      <section className="transaction-list">
        <h2>取引履歴</h2>
        <TransactionList />
      </section>
    </main>
  );
};

export default Home;
