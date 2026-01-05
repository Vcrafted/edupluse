
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, BrainCircuit, Users2 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Master Student Performance with <span className="text-indigo-600">EduPulse</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The ultimate analytical tool for educators. Clean data, visualize trends, and get AI-powered insights to help every student succeed.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/input" 
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/analysis" 
            className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            View Sample Analysis
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
            title: "Data Visualization",
            desc: "Instantly turn raw marks into beautiful, interactive charts that show trends at a glance."
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            title: "Smart Validation",
            desc: "Automatic cleaning and validation ensures your analysis is always based on accurate data."
          },
          {
            icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
            title: "AI Analysis",
            desc: "Gemini-powered insights suggest personalized study plans and identify students at risk."
          }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-indigo-900 rounded-3xl p-12 overflow-hidden relative">
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to predict student outcomes?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Upload your class spreadsheet or enter data manually. Our algorithm predicts Pass/Fail status based on industry standards.
          </p>
          <Link 
            to="/input" 
            className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors inline-block"
          >
            Analyze Now
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 transform scale-150 rotate-12 hidden md:block">
           <Users2 className="w-full h-full text-indigo-400" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
