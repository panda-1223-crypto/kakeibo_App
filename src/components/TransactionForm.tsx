import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const expenseItems = [
  '食費', '外食費', '日用品', '交通費', '衣服', '雑費', 'インフラ', 'その他'
];

const TransactionForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [item, setItem] = useState(expenseItems[0]); // 初期値を設定
  const [amountText, setAmountText] = useState(''); // 金額をテキストとして管理
  const [category, setCategory] = useState<'income' | 'expense'>('expense');

  const context = useContext(TransactionContext);

  if (context === undefined) {
    throw new Error('TransactionForm must be used within a TransactionProvider');
  }

  const { addTransaction } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountText); // 数値に変換

    if (!item || isNaN(amount) || amount === 0) return; // 項目が選択されていないか、金額が無効な場合はスキップ

    const newTransaction = {
      id: Math.random().toString(), // 仮のID生成
      date,
      item,
      amount: category === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      category,
    };

    addTransaction(newTransaction);

    // フォームをリセット
    setDate('');
    setItem(expenseItems[0]); // 初期値に戻す
    setAmountText('');
    setCategory('expense');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">日付:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="item">項目:</label>
        <select id="item" value={item} onChange={(e) => setItem(e.target.value)}>
          {expenseItems.map((expItem) => (
            <option key={expItem} value={expItem}>{expItem}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount">金額:</label>
        <input type="text" id="amount" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
      </div>
      <div>
        <label htmlFor="category">カテゴリ:</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as 'income' | 'expense')}>
          <option value="income">収入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <button type="submit">追加</button>
    </form>
  );
};

export default TransactionForm;
