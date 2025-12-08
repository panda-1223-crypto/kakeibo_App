import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import ExpenseSummary from './components/ExpenseSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="summary" element={<ExpenseSummary />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
