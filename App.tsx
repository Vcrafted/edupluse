
import React, { useState, useCallback, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Home, LayoutDashboard, Database, Info, Trophy, TrendingUp, Users, AlertCircle } from 'lucide-react';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import AnalysisPage from './pages/AnalysisPage';
import { Student, StudentResult } from './types';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const processedData = useMemo(() => {
    return students.map(s => ({
      ...s,
      status: (s.marks >= 50 && s.attendance >= 75) ? 'Pass' : 'Fail' as const,
      performanceScore: (s.marks * 0.7) + (s.attendance * 0.3) // Weighted score example
    }));
  }, [students]);

  const handleUpdateData = (newData: Student[]) => {
    setStudents(newData);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">EduPulse</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/input" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors">
                  <Database className="w-4 h-4" /> Data Entry
                </Link>
                <Link to="/analysis" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Analysis
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/input" 
              element={<InputPage currentData={students} onSave={handleUpdateData} />} 
            />
            <Route 
              path="/analysis" 
              element={<AnalysisPage data={processedData} />} 
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} EduPulse Performance Analyzer. Powered by Gemini AI.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
