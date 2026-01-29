import { useState } from 'react';

// Define the interface for a Lesson since I can't import it directly from the component without circular dep issues potentially or just ensuring types match. 
// Ideally this should be imported from types/ or lib/lessons if available. 
// Checking page.tsx, it uses typeof currentLesson. 
// I'll assume the structure based on page.tsx usage.

interface Lesson {
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    task: string;
    hint?: string;
    explanation?: string;
    expectedOutput?: Record<string, unknown>[];
    expectedRowCount?: number;
    schema: string;
    solution: string;
}

interface TableInfo {
    name: string;
    columns: Array<{ name: string; type: string; pk: boolean }>;
}

interface ProblemStatementProps {
    lesson: Lesson;
    tableInfo: TableInfo[];
}

export default function ProblemStatement({ lesson, tableInfo }: ProblemStatementProps) {
    const [showHint, setShowHint] = useState(false);
    const [showFullExpected, setShowFullExpected] = useState(false);

    return (
        <div className="flex-1 overflow-y-auto bg-transparent p-6 custom-scrollbar relative animate-fade-in">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Title and Difficulty */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {lesson.title}
                        </h2>
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${lesson.difficulty === 'beginner'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10'
                                    : lesson.difficulty === 'intermediate'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10'
                                }`}
                        >
                            {lesson.difficulty}
                        </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">{lesson.description}</p>
                </div>

                {/* Task Section */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Mission Task
                    </h3>
                    <div className="glass-panel rounded-xl p-5 shadow-lg">
                        <p className="text-sm text-gray-200 leading-7 font-medium">
                            {lesson.task}
                        </p>
                    </div>
                </div>

                {/* Hint Toggle */}
                <div className="mb-8">
                    {lesson.hint && (
                        <div>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-xs flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/20 px-3 py-1.5 rounded-lg bg-blue-500/5 hover:bg-blue-500/10"
                            >
                                {showHint ? 'Hide Intelligence Info' : 'Unlock Intelligence Info (Hint)'}
                            </button>

                            {showHint && (
                                <div className="mt-3 bg-blue-500/5 border-l-2 border-blue-500 p-4 rounded-r-lg animate-slide-up">
                                    <p className="text-xs text-blue-300 leading-relaxed">
                                        💡 {lesson.hint}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Expected Output */}
                {lesson.expectedOutput && lesson.expectedOutput.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Target Data Structure
                        </h3>
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-inner">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {Object.keys((showFullExpected ? lesson.expectedOutput[0] : lesson.expectedOutput[0]) || {}).map(key => (
                                                <th
                                                    key={key}
                                                    className="px-4 py-3 text-left font-mono font-semibold text-purple-300 border-b border-white/5"
                                                >
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(showFullExpected ? lesson.expectedOutput : lesson.expectedOutput.slice(0, 5)).map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/5 transition-colors"
                                            >
                                                {Object.values(row).map((value: unknown, cellIdx) => (
                                                    <td key={cellIdx} className="px-4 py-2.5 text-gray-400 font-mono">
                                                        {value === null || value === undefined ? (
                                                            <span className="text-gray-600 italic">NULL</span>
                                                        ) : (
                                                            String(value)
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 px-1">
                            <p className="text-[10px] text-gray-500 font-mono">
                                {lesson.expectedRowCount} row(s) required
                            </p>
                            {lesson.expectedOutput.length > 5 && (
                                <button
                                    onClick={() => setShowFullExpected(s => !s)}
                                    className="text-[10px] text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    {showFullExpected ? 'COLLAPSE' : 'EXPAND ALL'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Database Schema */}
                <div className="pb-10">
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        System Schema
                    </h3>
                    <div className="space-y-4">
                        {tableInfo.map(table => (
                            <div
                                key={table.name}
                                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="bg-white/5 px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                                    <h4 className="text-sm font-mono font-bold text-gray-200">
                                        {table.name}
                                    </h4>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-2">
                                        {table.columns.map(col => (
                                            <div
                                                key={col.name}
                                                className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-300 font-mono font-medium">{col.name}</span>
                                                    {col.pk && (
                                                        <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[9px] font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(234,179,8,0.2)]">
                                                            PK
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-gray-500 font-mono text-[10px]">
                                                    {col.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
