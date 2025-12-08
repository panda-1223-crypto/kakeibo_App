import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>家計簿アプリ</h1>
        <nav>
          <Link to="/">ホーム</Link>
          <Link to="/summary">支出サマリー</Link>
        </nav>
      </header>
      <div className="App-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
