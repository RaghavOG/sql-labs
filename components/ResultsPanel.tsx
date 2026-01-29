import { useState } from 'react';

interface QueryResult {
    rows?: Record<string, unknown>[];
    error?: string;
    message?: string;
    isCorrect?: boolean;
    expectedRowCount?: number;
    actualRowCount?: number;
}

interface ResultsPanelProps {
    result: QueryResult | null;
    explanation?: string;
}

export default function ResultsPanel({ result, explanation }: ResultsPanelProps) {

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                    <span className="text-2xl opacity-20">⌨</span>
                </div>
                <p className="text-xs uppercase tracking-widest font-bold opacity-50">Ready to Execute</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            <div className="px-4 py-3 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${result.error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    Execution Output
                </h3>
                {result.rows && (
                    <span className="text-[10px] font-mono text-gray-600">
                        {result.rows.length} rows returned in 0.04s
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-white/10">
                {result.error ? (
                    <div className="p-6">
                        <div className="glass-panel border-red-500/20 bg-red-900/5 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                            </div>
                            <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                                ERROR ENCOUNTERED
                            </h4>
                            <p className="text-sm text-red-300 font-mono bg-black/20 p-4 rounded-lg border border-red-500/10">
                                {result.error}
                            </p>
                        </div>
                    </div>
                ) : result.isCorrect ? (
                    <div className="space-y-0">
                        {/* Success Banner */}
                        <div className="p-4 bg-green-500/5 border-b border-green-500/10">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <span className="text-green-400 text-xl">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-green-400 mb-1">SUCCESSFUL EXECUTION</h4>
                                    {explanation && (
                                        <p className="text-xs text-green-300/70 leading-relaxed max-w-prose">
                                            {explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results Table */}
                        {result.rows && result.rows.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                                        <tr>
                                            {Object.keys(result.rows[0] || {}).map(key => (
                                                <th
                                                    key={key}
                                                    className="px-4 py-3 text-left font-mono font-medium text-gray-400 uppercase tracking-wider border-b border-white/5"
                                                >
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {result.rows.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/5 transition-colors"
                                            >
                                                {Object.values(row).map((value: unknown, cellIdx) => (
                                                    <td key={cellIdx} className="px-4 py-3 text-gray-300 font-mono whitespace-nowrap">
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
                        )}

                        {result.rows && result.rows.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 text-sm font-mono">Query executed successfully but returned no rows.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Incorrect result but valid SQL
                    <div className="p-6">
                        <div className="glass-panel border-yellow-500/20 bg-yellow-900/5 rounded-xl p-6">
                            <h4 className="text-sm font-bold text-yellow-500 mb-2">INCORRECT OUTPUT</h4>
                            <p className="text-xs text-yellow-200/70 mb-4">
                                The executed query is valid SQL, but it did not produce the expected results for this mission.
                            </p>

                            {result.rows && result.rows.length > 0 && (
                                <div className="rounded-lg overflow-hidden border border-white/5">
                                    <div className="overflow-x-auto max-h-60">
                                        <table className="min-w-full text-xs">
                                            <thead className="bg-white/5 sticky top-0">
                                                <tr>
                                                    {Object.keys(result.rows[0] || {}).map(key => (
                                                        <th
                                                            key={key}
                                                            className="px-4 py-2 text-left font-mono font-medium text-gray-500 border-b border-white/5"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 bg-black/20">
                                                {result.rows.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx}>
                                                        {Object.values(row).map((value: unknown, cellIdx) => (
                                                            <td key={cellIdx} className="px-4 py-2 text-gray-400 font-mono">
                                                                {String(value)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
