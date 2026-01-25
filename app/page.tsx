'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { categories, getLessonById, getLessonsByCategory } from '@/lib/lessons';
import Logo from '@/components/Logo';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface QueryResult {
  rows?: Record<string, unknown>[];
  error?: string;
  message?: string;
  isCorrect?: boolean;
  expectedRowCount?: number;
  actualRowCount?: number;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { width, height } = useWindowSize();

  const currentLesson = getLessonById(currentLessonId);

  // Detect Brave browser
  useEffect(() => {
    const nav = navigator as Navigator & { brave?: { isBrave: () => boolean } };
    const isBrave = nav.brave?.isBrave() || false;
    if (isBrave) {
      console.log('Brave browser detected - using compatibility mode');
    }
  }, []);

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

  // Extract table info from schema and reset state when lesson changes
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
      setShowExplanation(false);
      setShowConfetti(false);
    }
  }, [currentLessonId, currentLesson]);

  const handleRunQuery = async (editorValue?: string) => {
    // Use editor value if provided (from keyboard shortcut), otherwise use state
    const queryToRun = editorValue !== undefined ? editorValue : query;
    
    // Always sync state when editor value is provided (from keyboard shortcut)
    if (editorValue !== undefined) {
      setQuery(editorValue);
    }
    
    if (!queryToRun.trim() || !currentLesson) {
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
        body: JSON.stringify({ query: queryToRun, schema: currentLesson.schema }),
      });

      const data = await response.json();
      
      // Check if query is correct
      const isCorrect = checkQueryCorrectness(data, queryToRun, currentLesson);
      
      // Add validation info to result
      const enhancedResult = {
        ...data,
        isCorrect,
        expectedRowCount: currentLesson.expectedRowCount,
        actualRowCount: data.rows?.length || 0,
      };
      
      setResult(enhancedResult);

      // Mark as completed if correct
      if (isCorrect) {
        markAsCompleted(currentLessonId);
        
        // Show full-screen confetti and modal on every successful submission
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
        
        // Show explanation
        if (currentLesson.explanation) {
          setShowExplanation(true);
        }
      } else {
        setShowExplanation(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute query';
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Check if query matches solution or expected row count
  const checkQueryCorrectness = (result: QueryResult, userQuery: string, lesson: typeof currentLesson): boolean => {
    if (!lesson || result.error) return false;
    
    // Normalize queries for comparison (remove whitespace, convert to uppercase)
    const normalizeQuery = (q: string) => q.trim().replace(/\s+/g, ' ').toUpperCase();
    const normalizedUserQuery = normalizeQuery(userQuery);
    const normalizedSolution = normalizeQuery(lesson.solution);
    
    // Check if query matches solution
    if (normalizedUserQuery === normalizedSolution) {
      return true;
    }
    
    // Check expected row count if available
    if (lesson.expectedRowCount !== undefined && result.rows) {
      return result.rows.length === lesson.expectedRowCount;
    }
    
    // If no specific validation, consider it correct if no error
    return !result.error && result.rows !== undefined;
  };

  if (!currentLesson) return null;

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-gray-100 relative overflow-hidden">
      {showConfetti && (
        <>
          <Confetti
            width={width || window.innerWidth}
            height={height || window.innerHeight}
            recycle={false}
            numberOfPieces={120}
            gravity={0.9}
            initialVelocityY={25}
            initialVelocityX={8}
            tweenDuration={300}
            confettiSource={{
              x: width ? width / 2 : window.innerWidth / 2,
              y: height ? height / 2 : window.innerHeight / 2,
              w: 0,
              h: 0,
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 40,
              pointerEvents: 'none',
            }}
          />
          {/* Celebration Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-[#252526] border-2 border-orange-500 rounded-lg p-8 shadow-2xl pointer-events-auto animate-fade-in animate-scale-in">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">Excellent!</h2>
                <p className="text-orange-400 font-semibold">Query executed successfully!</p>
                {currentLesson && (
                  <p className="text-sm text-gray-400 mt-3">
                    {currentLesson.title} completed
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Lessons */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 bg-[#252526] border-r border-[#3e3e42] overflow-hidden flex-shrink-0`}
        >
          {sidebarOpen && (
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-[#3e3e42]">
                <Logo />
                <p className="text-xs text-gray-400 mt-2">Interactive Learning</p>
              </div>

              <div className="p-3 space-y-4">
                {categories.map(category => {
                  const categoryLessons = getLessonsByCategory(category.id);
                  const completedCount = categoryLessons.filter(l => 
                    completedLessons.has(l.id)
                  ).length;

                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                          {category.title}
                        </h3>
                        <span className="text-[10px] text-gray-600">
                          {completedCount}/{categoryLessons.length}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {categoryLessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => setCurrentLessonId(lesson.id)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                              currentLessonId === lesson.id
                                ? 'bg-[#37373d] text-white'
                                : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{lesson.title}</span>
                              {completedLessons.has(lesson.id) && (
                                <span className="text-green-500 ml-1">✓</span>
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
          className={`fixed top-3 z-20 p-1.5 bg-[#252526] border border-[#3e3e42] rounded text-gray-400 hover:text-white hover:bg-[#2a2d2e] transition-all text-xs ${
            sidebarOpen ? 'left-[252px]' : 'left-3'
          }`}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Center Panel - Problem Statement */}
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Problem Statement */}
            <div className="flex-1 overflow-y-auto bg-[#1e1e1e] p-6 border-r border-[#3e3e42]">
              <div className="max-w-3xl mx-auto">
                {/* Title and Difficulty */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-semibold text-white">
                      {currentLesson.title}
                    </h2>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        currentLesson.difficulty === 'beginner'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : currentLesson.difficulty === 'intermediate'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {currentLesson.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{currentLesson.description}</p>
                </div>

                {/* Task Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                    Task
                  </h3>
                  <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentLesson.task}
                    </p>
                  </div>
                </div>

                {/* Hint Toggle */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showHint ? '▼ Hide Hint' : '▶ Show Hint'}
                  </button>
                  {showHint && currentLesson.hint && (
                    <div className="mt-3 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-xs text-blue-300 leading-relaxed">
                        💡 {currentLesson.hint}
                      </p>
                    </div>
                  )}
                </div>

                {/* Database Schema */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                    Database Schema
                  </h3>
                  <div className="space-y-3">
                    {tableInfo.map(table => (
                      <div
                        key={table.name}
                        className="bg-[#252526] border border-[#3e3e42] rounded-lg overflow-hidden"
                      >
                        <div className="bg-[#2d2d30] px-4 py-2 border-b border-[#3e3e42]">
                          <h4 className="text-sm font-mono font-semibold text-yellow-400">
                            {table.name}
                          </h4>
                        </div>
                        <div className="p-3">
                          <div className="space-y-1">
                            {table.columns.map(col => (
                              <div
                                key={col.name}
                                className="flex items-center justify-between text-xs py-1"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-300 font-mono">{col.name}</span>
                                  {col.pk && (
                                    <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-semibold">
                                      PK
                                    </span>
                                  )}
                                </div>
                                <span className="text-gray-500 font-mono text-[11px]">
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
          </div>

          {/* Right Panel - Code Editor & Results */}
          <div className="w-[50%] flex flex-col bg-[#1e1e1e]">
            {/* SQL Editor */}
            <div className="border-b border-[#3e3e42]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
                <span className="text-xs text-gray-400 font-medium">SQL Editor</span>
                <button
                  onClick={() => handleRunQuery()}
                  disabled={loading}
                  className="px-4 py-1.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Running...' : 'Run Query'}
                </button>
              </div>
              <div className="h-64">
                {editorError ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 bg-[#252526] border border-[#3e3e42] rounded">
                    <p className="text-sm text-red-400 mb-2">Editor failed to load</p>
                    <p className="text-xs text-gray-500 mb-4">{editorError}</p>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          e.preventDefault();
                          handleRunQuery();
                        }
                      }}
                      className="w-full h-full px-4 py-3 bg-[#1e1e1e] border border-[#3e3e42] rounded font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="-- Write your SQL query here"
                    />
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    defaultLanguage="sql"
                    theme="vs-dark"
                    value={query}
                    onChange={(value) => {
                      setQuery(value || '');
                    }}
                    loading={
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Loading editor...
                      </div>
                    }
                    beforeMount={(monaco) => {
                      // Configure Monaco for Brave browser compatibility
                      try {
                        monaco.editor.defineTheme('vs-dark-brave', {
                          base: 'vs-dark',
                          inherit: true,
                          rules: [],
                          colors: {},
                        });
                      } catch (error) {
                        console.warn('Monaco theme setup error:', error);
                        setEditorError('Monaco editor initialization failed. Using fallback editor.');
                      }
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 12, bottom: 12 },
                      readOnly: false,
                      suggest: {
                        showKeywords: false,
                      },
                      quickSuggestions: false,
                      parameterHints: { enabled: false },
                      acceptSuggestionOnCommitCharacter: false,
                      acceptSuggestionOnEnter: 'off',
                      snippetSuggestions: 'none',
                      tabCompletion: 'off',
                      wordBasedSuggestions: 'off',
                      formatOnType: false,
                      formatOnPaste: false,
                      contextmenu: true,
                      renderWhitespace: 'none',
                      links: false,
                    }}
                    onMount={(editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
                      try {
                        editorRef.current = editor;
                        
                        // Force focus after a short delay (Brave needs this)
                        setTimeout(() => {
                          try {
                            editor.focus();
                            // Ensure editor is ready for input
                            editor.updateOptions({ readOnly: false });
                          } catch (error) {
                            console.warn('Editor focus error:', error);
                          }
                        }, 100);
                        
                        // Run query shortcut - get value directly from editor
                        editor.addCommand(
                          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                          () => {
                            // Get the current value directly from editor (always fresh)
                            const currentValue = editor.getValue();
                            
                            // Update React state to keep it in sync (for UI consistency)
                            setQuery(currentValue);
                            
                            // Call handleRunQuery with the editor value
                            // This bypasses any state sync issues
                            handleRunQuery(currentValue);
                          }
                        );
                        
                        // Override Ctrl+S to prevent browser save dialog
                        editor.addCommand(
                          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                          () => {
                            // Prevent default save behavior
                            return false;
                          }
                        );
                        
                        // Additional Brave compatibility: ensure editor container is accessible
                        const container = editor.getContainerDomNode();
                        if (container) {
                          container.setAttribute('tabindex', '0');
                          container.style.outline = 'none';
                        }
                      } catch (error) {
                        console.error('Monaco editor mount error:', error);
                        setEditorError('Failed to initialize editor. Using fallback editor.');
                      }
                    }}
                    onValidate={() => {
                      // Handle validation if needed
                    }}
                  />
                )}
              </div>
            </div>

            {/* Query Results */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-3 bg-[#252526] border-b border-[#3e3e42]">
                <h3 className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Query Results
                </h3>
              </div>

              <div className="p-4">
                {result?.error ? (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg">⚠</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-400 mb-1">Error</h4>
                        <p className="text-xs text-red-300 leading-relaxed font-mono">
                          {result.error}
          </p>
        </div>
                    </div>
                  </div>
                ) : result?.isCorrect ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-green-400 text-lg">✓</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-green-400 mb-2">Correct! 🎉</h4>
                          {currentLesson.explanation && showExplanation && (
                            <p className="text-xs text-green-200 leading-relaxed mb-2">
                              {currentLesson.explanation}
                            </p>
                          )}
                          {result.rows && (
                            <p className="text-xs text-green-300">
                              {result.rows.length} row(s) returned
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {result.rows && result.rows.length > 0 && (
                      <div className="border border-[#3e3e42] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead className="bg-[#252526]">
                              <tr>
                                {Object.keys(result.rows[0] || {}).map(key => (
                                  <th
                                    key={key}
                                    className="px-4 py-2 text-left font-medium text-orange-400 uppercase tracking-wider border-b border-[#3e3e42]"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-[#1e1e1e]">
                              {result.rows.map((row, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-[#3e3e42] last:border-0 hover:bg-[#252526] transition-colors"
                                >
                                  {Object.values(row).map((value: unknown, cellIdx) => (
                                    <td key={cellIdx} className="px-4 py-2 text-gray-300">
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
                    )}
                  </div>
                ) : result?.message ? (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="text-xs text-green-300">✓ {result.message}</p>
                  </div>
                ) : result?.rows ? (
                  <div>
                    {result.rows.length === 0 ? (
                      <p className="text-xs text-gray-500">No rows returned.</p>
                    ) : (
                      <>
                        {/* Show expected vs actual if wrong */}
                        {result.expectedRowCount !== undefined && result.actualRowCount !== undefined && result.actualRowCount !== result.expectedRowCount && (
                          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 mb-3">
                            <p className="text-xs text-yellow-300 font-medium">
                              Expected {result.expectedRowCount} row(s), got {result.actualRowCount} row(s)
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mb-3">
                          {result.rows.length} row(s) returned
                          {result.rows.length === 100 && ' (limited to 100 rows)'}
                        </p>
                        <div className="border border-[#3e3e42] rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead className="bg-[#252526]">
                                <tr>
                                  {Object.keys(result.rows[0] || {}).map(key => (
                                    <th
                                      key={key}
                                      className="px-4 py-2 text-left font-medium text-orange-400 uppercase tracking-wider border-b border-[#3e3e42]"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-[#1e1e1e]">
                                {result.rows.map((row, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-[#3e3e42] last:border-0 hover:bg-[#252526] transition-colors"
                                  >
                                    {Object.values(row).map((value: unknown, cellIdx) => (
                                      <td key={cellIdx} className="px-4 py-2 text-gray-300">
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
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Write your SQL query above and click &quot;Run Query&quot; or press Ctrl+Enter
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#252526] border-t border-[#3e3e42] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>
            Made by <span className="text-gray-400">Raghav</span> with <span className="text-red-500">❤️</span>
          </span>
          <span className="text-gray-700">•</span>
          <a
            href="https://github.com/RaghavOG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://linkedin.com/in/singlaraghav"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://github.com/RaghavOG/sql-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Contribute
          </a>
        </div>
      </footer>
    </div>
  );
}
