import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// Force Node.js runtime (required for better-sqlite3 on Vercel)
export const runtime = 'nodejs';

// Initialize a fresh in-memory database with provided schema
function createFreshDatabase(schema: string): Database.Database {
  const db = new Database(':memory:');
  
  // Execute schema and seed data
  const statements = schema.split(';').filter(stmt => stmt.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement.trim() + ';');
    }
  }
  
  return db;
}

// Validate query safety
function validateQuery(query: string): { valid: boolean; error?: string } {
  const trimmed = query.trim();
  
  // Reject empty queries
  if (!trimmed) {
    return { valid: false, error: 'Query cannot be empty' };
  }
  
  // Reject multiple SQL statements (count semicolons that aren't in strings)
  // Simple check: count semicolons outside of quotes
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let semicolonCount = 0;
  
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    const prevChar = i > 0 ? trimmed[i - 1] : '';
    
    if (char === "'" && prevChar !== '\\') {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && prevChar !== '\\') {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === ';' && !inSingleQuote && !inDoubleQuote) {
      semicolonCount++;
    }
  }
  
  if (semicolonCount > 1) {
    return { valid: false, error: 'Multiple SQL statements are not allowed' };
  }
  
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, schema } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!schema || typeof schema !== 'string') {
      return NextResponse.json(
        { error: 'Schema is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Validate query safety
    const validation = validateQuery(query);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Create fresh database for this request with provided schema
    const db = createFreshDatabase(schema);
    
    try {
      // Execute query
      const trimmedQuery = query.trim();
      const statement = db.prepare(trimmedQuery);
      
      // Check if it's a SELECT query (read operation)
      const isSelect = trimmedQuery.toUpperCase().trim().startsWith('SELECT');
      
      if (isSelect) {
        const rows = statement.all();
        
        // Limit results to 100 rows
        const limitedRows = rows.slice(0, 100);
        
        // Close database
        db.close();
        
        return NextResponse.json({ rows: limitedRows });
      } else {
        // For non-SELECT queries (INSERT, UPDATE, DELETE, etc.)
        const result = statement.run();
        db.close();
        
        return NextResponse.json({
          rows: [],
          message: `Query executed successfully. ${result.changes || 0} row(s) affected.`
        });
      }
    } catch (error: any) {
      db.close();
      return NextResponse.json(
        { error: error.message || 'SQL execution error' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Invalid request' },
      { status: 500 }
    );
  }
}
