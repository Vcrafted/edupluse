
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell, PieChart, Pie 
} from 'recharts';
import { 
  ArrowLeft, Brain, TrendingUp, Users, Clock, Percent, 
  CheckCircle2, XCircle, ChevronRight, Sparkles
} from 'lucide-react';
import { StudentResult } from '../types';
import { getAIInsights } from '../services/geminiService';

interface AnalysisPageProps {
  data: StudentResult[];
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data }) => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setIsLoadingInsight(true);
      getAIInsights(data).then(insight => {
        setAiInsight(insight || null);
        setIsLoadingInsight(false);
      });
    }
  }, [data]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const avgMarks = data.reduce((acc, curr) => acc + curr.marks, 0) / data.length;
    const avgAttendance = data.reduce((acc, curr) => acc + curr.attendance, 0) / data.length;
    const avgHours = data.reduce((acc, curr) => acc + curr.studyHours, 0) / data.length;
    const passCount = data.filter(d => d.status === 'Pass').length;
    
    return {
      avgMarks: Math.round(avgMarks * 10) / 10,
      avgAttendance: Math.round(avgAttendance * 10) / 10,
      avgHours: Math.round(avgHours * 10) / 10,
      passRate: Math.round((passCount / data.length) * 100),
      total: data.length
    };
  }, [data]);

  const chartData = useMemo(() => {
    return data.map(d => ({
      name: d.name,
      marks: d.marks,
      attendance: d.attendance,
      studyHours: d.studyHours,
      score: Math.round(d.performanceScore)
    }));
  }, [data]);

  const pieData = useMemo(() => {
    const passed = data.filter(d => d.status === 'Pass').length;
    const failed = data.length - passed;
    return [
      { name: 'Passed', value: passed, color: '#10b981' },
      { name: 'Failed', value: failed, color: '#ef4444' }
    ];
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data to Analyze</h2>
        <p className="text-slate-500 mb-8">Please enter student data first to see performance insights.</p>
        <button 
          onClick={() => navigate('/input')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700"
        >
          Go to Data Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/input')}
            className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Edit
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h1>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-400 text-sm font-medium">
          <Clock className="w-4 h-4" /> Last analyzed: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: <TrendingUp className="w-6 h-6 text-indigo-600" />, label: "Avg Marks", value: `${stats?.avgMarks}/100`, color: "bg-indigo-50" },
          { icon: <Percent className="w-6 h-6 text-emerald-600" />, label: "Avg Attendance", value: `${stats?.avgAttendance}%`, color: "bg-emerald-50" },
          { icon: <Clock className="w-6 h-6 text-amber-600" />, label: "Avg Study Hours", value: `${stats?.avgHours}h`, color: "bg-amber-50" },
          { icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />, label: "Pass Rate", value: `${stats?.passRate}%`, color: "bg-blue-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Marks vs Attendance Distribution
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend />
                  <Bar dataKey="marks" fill="#6366f1" radius={[4, 4, 0, 0]} name="Marks" />
                  <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Study Hours Correlation
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="studyHours" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} name="Daily Study Hours" />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#8b5cf6' }} name="Weighted Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI & Summary Section */}
        <div className="space-y-8">
          <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
              <Brain className="w-6 h-6 text-indigo-300" /> AI-Powered Insights
            </h3>
            <div className="prose prose-invert prose-sm max-w-none relative z-10">
              {isLoadingInsight ? (
                <div className="flex flex-col items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300 mb-4"></div>
                  <p className="text-indigo-200 text-center animate-pulse">Gemini is analyzing your class trends...</p>
                </div>
              ) : (
                <div className="text-indigo-100 whitespace-pre-line leading-relaxed">
                  {aiInsight || "No insights available."}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Pass/Fail Breakdown</h3>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Student Achievement List</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-1 rounded">
            Auto-Generated Report
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Outcome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Performance Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Prediction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...data].sort((a, b) => b.performanceScore - a.performanceScore).map((student, index) => (
                <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">#{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.studyHours}h Avg Study</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-bold text-slate-700">{Math.round(student.marks)}%</span>
                       <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${student.marks >= 50 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{width: `${student.marks}%`}}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {Math.round(student.performanceScore)} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.status === 'Pass' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-red-100 text-red-700 border border-red-200">
                        <XCircle className="w-4 h-4" /> FAIL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper component for Icons that I forgot to import in local scope
const BarChart3 = ({className}: {className: string}) => <BarChart3Icon className={className} />;
import { BarChart3 as BarChart3Icon } from 'lucide-react';

export default AnalysisPage;
