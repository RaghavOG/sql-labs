'use client';

import { useState, useEffect, useRef } from 'react';
import type { editor } from 'monaco-editor';
import { getLessonById } from '@/lib/lessons';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Components
import LessonSidebar from '@/components/LessonSidebar';
import ProblemStatement from '@/components/ProblemStatement';
import SqlEditor from '@/components/SqlEditor';
import ResultsPanel from '@/components/ResultsPanel';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
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
    setCompletedLessons(prev => {
      const updated = new Set(prev);
      updated.add(lessonId);
      localStorage.setItem('completedLessons', JSON.stringify(Array.from(updated)));
      return updated;
    });
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
      setShowConfetti(false);
    }
  }, [currentLessonId, currentLesson]);

  const handleRunQuery = async (editorValue?: string) => {
    // Use editor value if provided (from keyboard shortcut), otherwise use state
    const queryToRun = editorValue !== undefined ? editorValue : query;

    // Always sync state when editor value is provided
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

      const enhancedResult = {
        ...data,
        isCorrect,
        expectedRowCount: currentLesson.expectedRowCount,
        actualRowCount: data.rows?.length || 0,
      };

      setResult(enhancedResult);

      if (isCorrect) {
        markAsCompleted(currentLessonId);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500); // Longer confetti
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

    const normalizeQuery = (q: string) =>
      q
        .trim()
        .replace(/;+\s*$/, '')
        .replace(/\s+/g, ' ')
        .toUpperCase();
    const normalizedUserQuery = normalizeQuery(userQuery);
    const normalizedSolution = normalizeQuery(lesson.solution);

    if (normalizedUserQuery === normalizedSolution) {
      return true;
    }

    if (lesson.expectedRowCount !== undefined) {
      if (!result.rows) return false;
      return result.rows.length === lesson.expectedRowCount;
    }

    return false;
  };

  // Editor mounting logic (preserved for Brave support)
  const handleEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    try {
      editorRef.current = editor;

      setTimeout(() => {
        try {
          editor.focus();
          editor.updateOptions({ readOnly: false });
        } catch (error) {
          console.warn('Editor focus error:', error);
        }
      }, 100);

      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        () => {
          const currentValue = editor.getValue();
          setQuery(currentValue);
          handleRunQuery(currentValue);
        }
      );

      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => { return false; }
      );

      const container = editor.getContainerDomNode();
      if (container) {
        container.setAttribute('tabindex', '0');
        container.style.outline = 'none';
      }
    } catch (error) {
      console.error('Monaco editor mount error:', error);
      setEditorError('Failed to initialize editor. Using fallback editor.');
    }
  };

  if (!currentLesson) return null;

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-black text-white overflow-hidden font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Confetti & Modal */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']}
          />
          <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
            <div className="bg-black/80 backdrop-blur-xl border border-green-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Excellent Work!</h2>
              <p className="text-green-400 font-mono">Mission Accomplished</p>
            </div>
          </div>
        </div>
      )}

      {/* App Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <LessonSidebar
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onSelectLesson={setCurrentLessonId}
          isOpen={sidebarOpen}
        />

        {/* Sidebar Toggle (Floating) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
                absolute top-4 z-40 p-2 rounded-full 
                bg-black/50 backdrop-blur border border-white/10 
                text-white/50 hover:text-white hover:bg-white/10 transition-all
                ${sidebarOpen ? 'left-[265px]' : 'left-4'}
            `}
        >
          {sidebarOpen ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 14l-6-6 6-6" /></svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 14l6-6-6-6" /></svg>
          )}
        </button>

        {/* Main Content Split */}
        <main className="flex-1 flex overflow-hidden">

          {/* Left: Problem & Context */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
            <ProblemStatement
              lesson={currentLesson}
              tableInfo={tableInfo}
            />
          </div>

          {/* Right: Editor & Results (resizer could be added later, for now 50/50 split) */}
          <div className="w-[50%] flex flex-col min-w-[400px] border-l border-white/5 bg-black">

            {/* Top: Editor */}
            <div className="h-[55%] flex flex-col">
              <SqlEditor
                query={query}
                setQuery={setQuery}
                onRun={() => handleRunQuery()}
                loading={loading}
                error={editorError}
                onMount={handleEditorMount}
              />
            </div>

            {/* Bottom: Results */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-white/5 bg-[#0a0a0a]">
              <ResultsPanel
                result={result}
                explanation={currentLesson.explanation}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
