import React, { useContext, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const expenseItems = [
  '食費', '外食費', '日用品', '交通費', '衣服', '雑費', 'インフラ', 'その他'
];

const TransactionList: React.FC = () => {
  const context = useContext(TransactionContext);

  if (context === undefined) {
    throw new Error('TransactionList must be used within a TransactionProvider');
  }

  const { transactions, deleteTransaction, updateTransaction } = context;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedItem, setEditedItem] = useState('');
  const [editedAmountText, setEditedAmountText] = useState('');
  const [editedCategory, setEditedCategory] = useState<'income' | 'expense'>('expense');

  const handleEdit = (transaction: any) => {
    setEditingId(transaction.id);
    setEditedDate(transaction.date);
    setEditedItem(transaction.item);
    setEditedAmountText(String(Math.abs(transaction.amount))); // 絶対値と文字列に変換
    setEditedCategory(transaction.category);
  };

  const handleSave = (id: string) => {
    const amount = Number(editedAmountText);
    if (!editedItem || isNaN(amount) || amount === 0) return;

    updateTransaction(id, {
      date: editedDate,
      item: editedItem,
      amount: editedCategory === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      category: editedCategory,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>項目</th>
          <th>金額</th>
          <th>カテゴリ</th>
          <th>アクション</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            {editingId === transaction.id ? (
              <>
                <td>
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={editedItem}
                    onChange={(e) => setEditedItem(e.target.value)}
                  >
                    {expenseItems.map((expItem) => (
                      <option key={expItem} value={expItem}>{expItem}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={editedAmountText}
                    onChange={(e) => setEditedAmountText(e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value as 'income' | 'expense')}
                  >
                    <option value="income">収入</option>
                    <option value="expense">支出</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleSave(transaction.id)}>保存</button>
                  <button onClick={handleCancel}>キャンセル</button>
                </td>
              </>
            ) : (
              <>
                <td>{transaction.date}</td>
                <td>{transaction.item}</td>
                <td style={{ color: transaction.amount < 0 ? 'red' : 'black' }}>
                  {transaction.amount.toLocaleString()}
                </td>
                <td>{transaction.category === 'income' ? '収入' : '支出'}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(transaction)}>編集</button>
                  <button className="delete-button" onClick={() => deleteTransaction(transaction.id)}>削除</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;
