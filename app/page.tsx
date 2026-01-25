'use client';

import { useState } from 'react';

interface QueryResult {
  rows?: Record<string, unknown>[];
  error?: string;
  message?: string;
}


export default function Home() {
  const [query, setQuery] = useState('SELECT * FROM users');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunQuery = async () => {
    if (!query.trim()) {
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
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            SQL Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write and execute SQL queries against a users table. Press Ctrl+Enter (Cmd+Enter on Mac) to run.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <label htmlFor="sql-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter your SQL query here..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleRunQuery}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Running...' : 'Run Query'}
              </button>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Results
            </h2>
            
            {result?.error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {result.error}
                    </p>
                  </div>
                </div>
              </div>
            ) : result?.message ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {result.message}
                </p>
              </div>
            ) : result?.rows ? (
              <div className="overflow-x-auto">
                {result.rows.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
                    No rows returned.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {result.rows.length} row(s) returned
                      {result.rows.length === 100 && ' (limited to 100 rows)'}
                    </p>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {Object.keys(result.rows[0] || {}).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {result.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            {Object.values(row).map((value: unknown, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                              >
                                {value === null || value === undefined ? (
                                  <span className="text-gray-400 italic">NULL</span>
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
                No results yet. Write a query and click &quot;Run Query&quot; to see results.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Available Table: users
          </h3>
          <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
            Schema: id (INTEGER), name (TEXT), email (TEXT), age (INTEGER), country (TEXT), city (TEXT)
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Try: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">SELECT * FROM users</code> or{' '}
            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">SELECT name, email FROM users WHERE age &gt; 25</code>
          </p>
        </div>
      </div>
    </div>
  );
}
