import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
// import { useRef } from 'react'; // Not strictly needed if logic is passed down, but good for local fallback

interface SqlEditorProps {
    query: string;
    setQuery: (query: string) => void;
    onRun: () => void;
    error: string | null;
    loading: boolean;
    onMount?: OnMount;
}

export default function SqlEditor({ query, setQuery, onRun, error, loading, onMount }: SqlEditorProps) {

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-white/10 relative">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/5 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <span className="text-xs text-gray-500 font-mono">buffer.sql</span>
                </div>

                <button
                    onClick={onRun}
                    disabled={loading}
                    className={`
            group relative px-5 py-1.5 rounded-md text-xs font-bold transition-all duration-300
            ${loading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                        }
          `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                            <>
                                <span className="animate-spin h-3 w-3 border-2 border-white/20 border-t-white rounded-full"></span>
                                EXECUTING...
                            </>
                        ) : (
                            <>
                                <span>▶</span> RUN QUERY
                            </>
                        )}
                    </span>
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative group">
                {error ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">

                        <div className="text-center p-6 border border-red-500/20 bg-red-500/5 rounded-xl max-w-md">
                            <p className="text-red-400 font-bold mb-2">Editor Initialization Failed</p>
                            <p className="text-xs text-red-300/70 mb-6 font-mono">{error}</p>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-32 px-4 py-3 bg-black/50 border border-white/10 rounded-lg font-mono text-sm text-gray-300 focus:outline-none focus:border-red-500/40 transition-colors resize-none"
                                placeholder="Fallback editor mode..."
                            />
                        </div>
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        defaultLanguage="sql"
                        theme="vs-dark"
                        value={query}
                        onChange={(value) => setQuery(value || '')}
                        loading={
                            <div className="flex flex-col items-center gap-3 text-gray-500 text-xs font-mono">
                                <span className="animate-pulse">INITIALIZING SQL CORE...</span>
                            </div>
                        }
                        onMount={onMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Geist Mono', monospace",
                            lineNumbers: 'on',

                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                            padding: { top: 20, bottom: 20 },
                            readOnly: false,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            smoothScrolling: true,
                            renderLineHighlight: 'all',
                            lineHeight: 22,
                            // Clean appearance
                            guides: { indentation: false },
                            foldStyle: undefined,
                            matchBrackets: 'always',
                            renderWhitespace: 'none',

                            suggest: {
                                showKeywords: true,
                            },
                            quickSuggestions: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
