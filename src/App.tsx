import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './sections/Header';
import { Dashboard } from './sections/Dashboard';
import { ArticleList } from './sections/ArticleList';
import { ArticleDetail } from './sections/ArticleDetail';
import { ArticleSubmit } from './sections/ArticleSubmit';
import { Validators } from './sections/Validators';
import { Leaderboard } from './sections/Leaderboard';
import { ValidatePaper } from './sections/ValidatePaper';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/submit" element={<ArticleSubmit />} />
            <Route path="/validators" element={<Validators />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/validate" element={<ValidatePaper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
