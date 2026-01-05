
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, Save, FileText, AlertCircle } from 'lucide-react';
import { Student } from '../types';

interface InputPageProps {
  currentData: Student[];
  onSave: (data: Student[]) => void;
}

const InputPage: React.FC<InputPageProps> = ({ currentData, onSave }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(
    currentData.length > 0 ? currentData : [
      { id: '1', name: '', marks: 0, attendance: 0, studyHours: 0 }
    ]
  );
  const [error, setError] = useState<string | null>(null);

  const addStudent = () => {
    setStudents([...students, { id: Date.now().toString(), name: '', marks: 0, attendance: 0, studyHours: 0 }]);
  };

  const removeStudent = (id: string) => {
    if (students.length > 1) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const updateStudent = (id: string, field: keyof Student, value: string | number) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      const newStudents: Student[] = [];

      // Assume CSV header: Name, Marks, Attendance, StudyHours
      rows.slice(1).forEach((row, index) => {
        const columns = row.split(',').map(c => c.trim());
        if (columns.length >= 4 && columns[0]) {
          newStudents.push({
            id: `upload-${Date.now()}-${index}`,
            name: columns[0],
            marks: parseFloat(columns[1]) || 0,
            attendance: parseFloat(columns[2]) || 0,
            studyHours: parseFloat(columns[3]) || 0,
          });
        }
      });

      if (newStudents.length > 0) {
        setStudents(newStudents);
        setError(null);
      } else {
        setError("Invalid file format. Please ensure CSV matches headers: Name, Marks, Attendance, StudyHours");
      }
    };
    reader.readAsText(file);
  };

  const validateAndSave = () => {
    // Validation
    const invalid = students.some(s => 
      !s.name || 
      s.marks < 0 || s.marks > 100 || 
      s.attendance < 0 || s.attendance > 100 || 
      s.studyHours < 0
    );

    if (invalid) {
      setError("Please ensure all names are filled and values are within valid ranges (Marks/Attendance 0-100).");
      return;
    }

    onSave(students);
    navigate('/analysis');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Student Data Entry</h2>
          <p className="text-slate-500">Add student records manually or upload a CSV file.</p>
        </div>
        <div className="flex gap-2">
          <label className="bg-white border border-slate-300 px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2 shadow-sm transition-colors">
            <Upload className="w-4 h-4" /> Import CSV
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={validateAndSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save & Analyze
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Student Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Marks (0-100)</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Attendance (%)</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Study Hours/Day</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={student.name}
                    onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 placeholder:text-slate-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    value={student.marks}
                    min="0"
                    max="100"
                    onChange={(e) => updateStudent(student.id, 'marks', parseFloat(e.target.value))}
                    className="w-24 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded px-3 py-1"
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    value={student.attendance}
                    min="0"
                    max="100"
                    onChange={(e) => updateStudent(student.id, 'attendance', parseFloat(e.target.value))}
                    className="w-24 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded px-3 py-1"
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    value={student.studyHours}
                    step="0.5"
                    min="0"
                    onChange={(e) => updateStudent(student.id, 'studyHours', parseFloat(e.target.value))}
                    className="w-24 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded px-3 py-1"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button 
            onClick={addStudent}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 bg-white border border-indigo-200 px-6 py-2 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Add Another Student
          </button>
        </div>
      </div>

      <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex gap-4">
          <div className="bg-amber-100 p-2 rounded-lg h-fit">
            <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">CSV Template Guide</h4>
            <p className="text-amber-800 text-sm opacity-80 leading-relaxed">
              For bulk upload, format your CSV like this:<br />
              <code className="bg-amber-100 px-1 rounded">Name, Marks, Attendance, StudyHours</code><br />
              <code className="bg-amber-100 px-1 rounded">Alice Johnson, 85, 92, 4.5</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
