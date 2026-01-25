'use client';

import { useState, useEffect } from 'react';
import { categories, getLessonById, getLessonsByCategory } from '@/lib/lessons';

interface QueryResult {
  rows?: Record<string, unknown>[];
  error?: string;
  message?: string;
}

interface TableInfo {
  name: string;
  columns: Array<{ name: string; type: string; pk: boolean }>;
}

export default function Home() {
  const [currentLessonId, setCurrentLessonId] = useState('select-all');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);

  const currentLesson = getLessonById(currentLessonId);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed lessons to localStorage
  const markAsCompleted = (lessonId: string) => {
    const updated = new Set(completedLessons);
    updated.add(lessonId);
    setCompletedLessons(updated);
    localStorage.setItem('completedLessons', JSON.stringify(Array.from(updated)));
  };

  // Extract table info from schema
  useEffect(() => {
    if (currentLesson) {
      const tables: TableInfo[] = [];
      const createTableRegex = /CREATE TABLE (\w+)\s*\(([\s\S]*?)\);/gi;
      let match;

      while ((match = createTableRegex.exec(currentLesson.schema)) !== null) {
        const tableName = match[1];
        const columnsText = match[2];
        const columns: Array<{ name: string; type: string; pk: boolean }> = [];

        const columnLines = columnsText.split(',').map(line => line.trim());
        for (const line of columnLines) {
          const columnMatch = line.match(/(\w+)\s+(INTEGER|TEXT|REAL|BLOB)(\s+PRIMARY KEY)?/i);
          if (columnMatch) {
            columns.push({
              name: columnMatch[1],
              type: columnMatch[2].toUpperCase(),
              pk: !!columnMatch[3],
            });
          }
        }

        tables.push({ name: tableName, columns });
      }

      setTableInfo(tables);
      setQuery('');
      setResult(null);
      setShowHint(false);
      setShowSolution(false);
    }
  }, [currentLessonId, currentLesson]);

  const handleRunQuery = async () => {
    if (!query.trim() || !currentLesson) {
      setResult({ error: 'Query cannot be empty' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sql/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, schema: currentLesson.schema }),
      });

      const data = await response.json();
      setResult(data);

      // Mark as completed if successful
      if (!data.error && data.rows) {
        markAsCompleted(currentLessonId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute query';
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleRunQuery();
    }
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      setQuery(query.substring(0, start) + '  ' + query.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (!currentLesson) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0`}
      >
        {sidebarOpen && (
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                <span className="text-3xl">🍵</span>
                <span>Chai <span className="text-yellow-400">SQL</span>ab</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Learn SQL Interactively</p>
            </div>

            <div className="space-y-6">
              {categories.map(category => {
                const categoryLessons = getLessonsByCategory(category.id);
                const completedCount = categoryLessons.filter(l => 
                  completedLessons.has(l.id)
                ).length;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.title}</span>
                      </h3>
                      <span className="text-xs text-gray-500">
                        {completedCount}/{categoryLessons.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {categoryLessons.map(lesson => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            currentLessonId === lesson.id
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{lesson.title}</span>
                            {completedLessons.has(lesson.id) && (
                              <span className="text-green-400">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-10 p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{currentLesson.title}</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentLesson.difficulty === 'beginner' ? 'bg-green-900 text-green-300' :
                  currentLesson.difficulty === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {currentLesson.difficulty}
                </span>
              </div>
              <p className="text-gray-400">{currentLesson.description}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-md">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-400 mb-1">Task:</h3>
                <p className="text-gray-300">{currentLesson.task}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          </div>

          {showHint && currentLesson.hint && (
            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700 rounded-md">
              <p className="text-sm text-blue-200">💡 <strong>Hint:</strong> {currentLesson.hint}</p>
            </div>
          )}

          {showSolution && (
            <div className="mt-3 p-3 bg-purple-900/30 border border-purple-700 rounded-md">
              <p className="text-sm text-purple-200 font-mono">
                <strong>Solution:</strong> {currentLesson.solution}
              </p>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor & Results */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SQL Editor */}
            <div className="bg-gray-800 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">SQL Query Editor</label>
                <button
                  onClick={handleRunQuery}
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Running...' : 'Run Query'} <span className="text-xs ml-1">(Ctrl+Enter)</span>
                </button>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="-- Write your SQL query here"
              />
            </div>

            {/* Results */}
            <div className="flex-1 bg-gray-900 p-6 overflow-auto">
              <h3 className="text-lg font-semibold text-orange-400 mb-4">Query Results</h3>
              
              {result?.error ? (
                <div className="bg-red-900/20 border border-red-700 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <div>
                      <h4 className="text-sm font-medium text-red-300 mb-1">Error</h4>
                      <p className="text-sm text-red-200">{result.error}</p>
                    </div>
                  </div>
                </div>
              ) : result?.message ? (
                <div className="bg-green-900/20 border border-green-700 rounded-md p-4">
                  <p className="text-sm text-green-200">✅ {result.message}</p>
                </div>
              ) : result?.rows ? (
                <div>
                  {result.rows.length === 0 ? (
                    <p className="text-gray-400 text-sm">No rows returned.</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 mb-3">
                        {result.rows.length} row(s) returned
                        {result.rows.length === 100 && ' (limited to 100 rows)'}
                      </p>
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <table className="min-w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              {Object.keys(result.rows[0] || {}).map((key) => (
                                <th
                                  key={key}
                                  className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider border-b border-gray-700"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {result.rows.map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-800 transition-colors">
                                {Object.values(row).map((value: unknown, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                                  >
                                    {value === null || value === undefined ? (
                                      <span className="text-gray-500 italic">NULL</span>
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
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Run a query to see results here.
                </p>
              )}
            </div>
          </div>

          {/* Database Schema Panel */}
          <aside className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-4">Database Schema</h3>
              <p className="text-xs text-gray-400 mb-4">Explore the tables and their structure</p>

              <div className="space-y-4">
                {tableInfo.map(table => (
                  <div key={table.name} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                      <h4 className="font-mono text-sm font-semibold text-yellow-400">{table.name}</h4>
                    </div>
                    <div className="p-3">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-700">
                            <th className="text-left py-1 pr-2">Column</th>
                            <th className="text-left py-1">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map(col => (
                            <tr key={col.name} className="border-b border-gray-800 last:border-0">
                              <td className="py-2 pr-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-300 font-mono">{col.name}</span>
                                  {col.pk && (
                                    <span className="px-1 bg-yellow-900 text-yellow-300 rounded text-[10px] font-bold">
                                      PK
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 font-mono text-gray-400">{col.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
