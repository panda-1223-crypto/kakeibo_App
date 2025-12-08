import React, { useContext, useState, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseSummary: React.FC = () => {
  const context = useContext(TransactionContext);

  if (context === undefined) {
    throw new Error('ExpenseSummary must be used within a TransactionProvider');
  }

  const { transactions } = context;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatMonth = (date: Date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: 'long' });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
      return newMonth;
    });
  };

  // 選択された月に該当する支出のみをフィルタリング
  const filteredExpenses = transactions.filter(t => {
    if (t.category !== 'expense') return false;
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getFullYear() === currentMonth.getFullYear() &&
      transactionDate.getMonth() === currentMonth.getMonth()
    );
  });

  // 項目ごとの支出を集計
  const expenseByCategory: { [key: string]: number } = {};
  filteredExpenses.forEach(expense => {
    if (expenseByCategory[expense.item]) {
      expenseByCategory[expense.item] += Math.abs(expense.amount);
    } else {
      expenseByCategory[expense.item] = Math.abs(expense.amount);
    }
  });

  // 合計支出を計算
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);

  const chartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: '金額 (円)',
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <main>
      <section className="expense-summary">
        <h2>支出項目別サマリー</h2>
        <div className="month-navigation">
          <button onClick={goToPreviousMonth}>&lt; 前の月</button>
          <h3>{formatMonth(currentMonth)}</h3>
          <button onClick={goToNextMonth}>次の月 &gt;</button>
        </div>

        <h3>合計支出: {totalExpenses.toLocaleString()} 円</h3>
        <div className="expense-content">
          {totalExpenses === 0 ? (
            <div className="no-data-message">
              <p>この月には支出データがありません。</p>
            </div>
          ) : (
            <>
              <div className="expense-table">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>金額</th>
                      <th>割合</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(expenseByCategory).map(([item, amount]) => (
                      <tr key={item}>
                        <td>{item}</td>
                        <td>{amount.toLocaleString()} 円</td>
                        <td>{((amount / totalExpenses) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="chart-container">
                <Doughnut data={chartData} />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default ExpenseSummary;
