export interface Lesson {
  id: string;
  title: string;
  category: string;
  description: string;
  hint?: string;
  task: string;
  solution: string;
  expectedColumns?: string[];
  expectedRowCount?: number;
  expectedOutput?: Array<Record<string, unknown>>;
  explanation?: string;
  schema: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LessonCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  order: number;
}

export const categories: LessonCategory[] = [
  {
    id: 'querying',
    title: 'Querying Data',
    icon: '🔍',
    description: 'Learn to retrieve data from tables',
    order: 1,
  },
  {
    id: 'filtering',
    title: 'Filtering Data',
    icon: '🎯',
    description: 'Filter rows based on conditions',
    order: 2,
  },
  {
    id: 'sorting',
    title: 'Sorting Data',
    icon: '📊',
    description: 'Order your results',
    order: 3,
  },
  {
    id: 'aggregation',
    title: 'Aggregation',
    icon: '📈',
    description: 'Summarize and group data',
    order: 4,
  },
  {
    id: 'joins',
    title: 'Joins',
    icon: '🔗',
    description: 'Combine data from multiple tables',
    order: 5,
  },
  {
    id: 'subqueries',
    title: 'Subqueries',
    icon: '🎭',
    description: 'Queries within queries',
    order: 6,
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    icon: '🚀',
    description: 'Set operations and complex queries',
    order: 7,
  },
];

export const lessons: Lesson[] = [
  // QUERYING DATA
  {
    id: 'select-all',
    title: 'SELECT All Columns',
    category: 'querying',
    description: 'Learn to retrieve all data from a table using SELECT *',
    hint: 'Use SELECT * to get all columns. The asterisk (*) is a wildcard that means "all columns".',
    task: 'Retrieve all columns from the users table to see the complete customer information.',
    solution: 'SELECT * FROM users',
    expectedRowCount: 10,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 5, name: 'Eve Wilson', email: 'eve@email.com', age: 26, country: 'Australia', city: 'Sydney' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 7, name: 'Grace Lee', email: 'grace@email.com', age: 29, country: 'South Korea', city: 'Seoul' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
    ],
    explanation: 'SELECT * retrieves every column from a table. The asterisk (*) is a wildcard that means "all columns".',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'select-columns',
    title: 'SELECT Specific Columns',
    category: 'querying',
    description: 'Choose only the columns you need',
    hint: 'List column names separated by commas: SELECT column1, column2 FROM table',
    task: 'Retrieve only the name and email columns from the users table.',
    solution: 'SELECT name, email FROM users',
    expectedColumns: ['name', 'email'],
    expectedRowCount: 10,
    expectedOutput: [
      { name: 'Alice Johnson', email: 'alice@email.com' },
      { name: 'Bob Smith', email: 'bob@email.com' },
      { name: 'Charlie Brown', email: 'charlie@email.com' },
      { name: 'Diana Prince', email: 'diana@email.com' },
      { name: 'Eve Wilson', email: 'eve@email.com' },
      { name: 'Frank Miller', email: 'frank@email.com' },
      { name: 'Grace Lee', email: 'grace@email.com' },
      { name: 'Henry Davis', email: 'henry@email.com' },
      { name: 'Ivy Chen', email: 'ivy@email.com' },
      { name: 'Jack Robinson', email: 'jack@email.com' },
    ],
    explanation: 'SELECT chooses which columns appear in your result. You can list specific columns instead of using * to get only what you need.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'distinct',
    title: 'DISTINCT Values',
    category: 'querying',
    description: 'Remove duplicate rows from results',
    hint: 'Use SELECT DISTINCT column FROM table to get unique values',
    task: 'Get a list of all unique countries from the users table.',
    solution: 'SELECT DISTINCT country FROM users',
    expectedRowCount: 7,
    expectedOutput: [
      { country: 'USA' },
      { country: 'UK' },
      { country: 'Canada' },
      { country: 'Australia' },
      { country: 'South Korea' },
      { country: 'China' },
    ],
    explanation: 'DISTINCT removes duplicate rows from your result. Each unique country appears only once, even if multiple users are from that country.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'limit',
    title: 'LIMIT Results',
    category: 'querying',
    description: 'Restrict the number of rows returned',
    hint: 'Add LIMIT n at the end of your query to get only n rows',
    task: 'Retrieve the first 5 users from the users table.',
    solution: 'SELECT * FROM users LIMIT 5',
    expectedRowCount: 5,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 5, name: 'Eve Wilson', email: 'eve@email.com', age: 26, country: 'Australia', city: 'Sydney' },
    ],
    explanation: 'LIMIT restricts how many rows are returned. It stops after the specified number, regardless of how many rows match your query.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },

  // FILTERING DATA
  {
    id: 'where-basic',
    title: 'WHERE Clause',
    category: 'filtering',
    description: 'Filter rows based on conditions',
    hint: 'WHERE filters rows. Syntax: SELECT * FROM table WHERE condition',
    task: 'Find all users from the USA.',
    solution: "SELECT * FROM users WHERE country = 'USA'",
    expectedRowCount: 3,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
    ],
    explanation: 'WHERE filters rows before SELECT chooses columns. Think of WHERE as a bouncer - only rows meeting the condition get through.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'where-and',
    title: 'AND Operator',
    category: 'filtering',
    description: 'Combine multiple conditions (all must be true)',
    hint: 'Use AND to combine conditions: WHERE condition1 AND condition2',
    task: 'Find all users from USA who are older than 30.',
    solution: "SELECT * FROM users WHERE country = 'USA' AND age > 30",
    expectedRowCount: 2,
    expectedOutput: [
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
    ],
    explanation: 'AND requires both conditions to be true. A row must match the first condition AND the second condition to be included.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'where-or',
    title: 'OR Operator',
    category: 'filtering',
    description: 'Match rows where at least one condition is true',
    hint: 'Use OR when any condition can be true: WHERE condition1 OR condition2',
    task: 'Find all users from either UK or Canada.',
    solution: "SELECT * FROM users WHERE country = 'UK' OR country = 'Canada'",
    expectedRowCount: 4,
    expectedOutput: [
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
    ],
    explanation: 'OR matches rows where at least one condition is true. A row is included if it matches the first condition OR the second condition.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'between',
    title: 'BETWEEN Operator',
    category: 'filtering',
    description: 'Filter values within a range',
    hint: 'BETWEEN checks if a value is in a range: WHERE column BETWEEN value1 AND value2',
    task: 'Find all users whose age is between 30 and 40 (inclusive).',
    solution: 'SELECT * FROM users WHERE age BETWEEN 30 AND 40',
    expectedRowCount: 4,
    expectedOutput: [
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
    ],
    explanation: 'BETWEEN checks if a value falls within a range, including both endpoints. It\'s equivalent to column >= value1 AND column <= value2.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'in-operator',
    title: 'IN Operator',
    category: 'filtering',
    description: 'Match any value in a list',
    hint: 'IN checks if a value matches any in a list: WHERE column IN (value1, value2, ...)',
    task: 'Find all users from USA, UK, or Canada.',
    solution: "SELECT * FROM users WHERE country IN ('USA', 'UK', 'Canada')",
    expectedRowCount: 7,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
    ],
    explanation: 'IN checks if a value matches any value in a list. It\'s a shorthand for multiple OR conditions.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'like-operator',
    title: 'LIKE Pattern Matching',
    category: 'filtering',
    description: 'Search for patterns in text',
    hint: 'LIKE matches patterns. Use % for any characters, _ for single character',
    task: 'Find all users whose name starts with "A".',
    solution: "SELECT * FROM users WHERE name LIKE 'A%'",
    expectedRowCount: 1,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
    ],
    explanation: 'LIKE matches patterns in text. The % wildcard means "any characters" - so A% matches anything starting with A.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },

  // SORTING DATA
  {
    id: 'order-by-asc',
    title: 'ORDER BY Ascending',
    category: 'sorting',
    description: 'Sort results in ascending order',
    hint: 'ORDER BY column sorts results. ASC is ascending (default)',
    task: 'Get all users sorted by age from youngest to oldest.',
    solution: 'SELECT * FROM users ORDER BY age ASC',
    expectedRowCount: 10,
    expectedOutput: [
      { id: 5, name: 'Eve Wilson', email: 'eve@email.com', age: 26, country: 'Australia', city: 'Sydney' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 7, name: 'Grace Lee', email: 'grace@email.com', age: 29, country: 'South Korea', city: 'Seoul' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
    ],
    explanation: 'ORDER BY sorts your results. ASC means ascending (smallest to largest). The default sort order is ASC if you don\'t specify.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'order-by-desc',
    title: 'ORDER BY Descending',
    category: 'sorting',
    description: 'Sort results in descending order',
    hint: 'Use DESC for descending order: ORDER BY column DESC',
    task: 'Get all users sorted by age from oldest to youngest.',
    solution: 'SELECT * FROM users ORDER BY age DESC',
    expectedRowCount: 10,
    expectedOutput: [
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 7, name: 'Grace Lee', email: 'grace@email.com', age: 29, country: 'South Korea', city: 'Seoul' },
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
      { id: 5, name: 'Eve Wilson', email: 'eve@email.com', age: 26, country: 'Australia', city: 'Sydney' },
    ],
    explanation: 'DESC means descending (largest to smallest). ORDER BY sorts rows after filtering and selecting.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'order-by-multiple',
    title: 'ORDER BY Multiple Columns',
    category: 'sorting',
    description: 'Sort by multiple columns',
    hint: 'You can sort by multiple columns: ORDER BY column1, column2',
    task: 'Sort users by country (ascending), then by age (descending).',
    solution: 'SELECT * FROM users ORDER BY country ASC, age DESC',
    expectedRowCount: 10,
    expectedOutput: [
      { id: 5, name: 'Eve Wilson', email: 'eve@email.com', age: 26, country: 'Australia', city: 'Sydney' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 10, name: 'Jack Robinson', email: 'jack@email.com', age: 27, country: 'Canada', city: 'Vancouver' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
      { id: 7, name: 'Grace Lee', email: 'grace@email.com', age: 29, country: 'South Korea', city: 'Seoul' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 4, name: 'Diana Prince', email: 'diana@email.com', age: 31, country: 'USA', city: 'Los Angeles' },
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com', age: 28, country: 'USA', city: 'New York' },
    ],
    explanation: 'You can sort by multiple columns. The first column is the primary sort, and the second breaks ties when values are equal.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },

  // AGGREGATION
  {
    id: 'count',
    title: 'COUNT Function',
    category: 'aggregation',
    description: 'Count the number of rows',
    hint: 'COUNT(*) counts all rows, COUNT(column) counts non-NULL values',
    task: 'Count the total number of users.',
    solution: 'SELECT COUNT(*) as total_users FROM users',
    expectedRowCount: 1,
    expectedOutput: [
      { total_users: 10 },
    ],
    explanation: 'COUNT(*) counts all rows, returning a single number. Aggregate functions like COUNT collapse multiple rows into one result.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'avg',
    title: 'AVG Function',
    category: 'aggregation',
    description: 'Calculate the average value',
    hint: 'AVG(column) calculates the average of numeric values',
    task: 'Calculate the average age of all users.',
    solution: 'SELECT AVG(age) as average_age FROM users',
    expectedRowCount: 1,
    expectedOutput: [
      { average_age: 33.5 },
    ],
    explanation: 'AVG calculates the average of numeric values. Like COUNT, it returns a single row with the aggregated result.',
    difficulty: 'beginner',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'group-by',
    title: 'GROUP BY Basics',
    category: 'aggregation',
    description: 'Group rows and aggregate data',
    hint: 'GROUP BY collapses rows with the same value. Combine with COUNT, SUM, AVG, etc.',
    task: 'Count how many users are in each country.',
    solution: 'SELECT country, COUNT(*) as user_count FROM users GROUP BY country',
    expectedRowCount: 7,
    expectedOutput: [
      { country: 'USA', user_count: 3 },
      { country: 'UK', user_count: 2 },
      { country: 'Canada', user_count: 2 },
      { country: 'Australia', user_count: 1 },
      { country: 'South Korea', user_count: 1 },
      { country: 'China', user_count: 1 },
    ],
    explanation: 'GROUP BY collapses rows with the same value into groups. Each group becomes one row in the result, and you can aggregate within each group.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'having',
    title: 'HAVING Clause',
    category: 'aggregation',
    description: 'Filter grouped results',
    hint: 'HAVING filters after GROUP BY. WHERE filters before grouping.',
    task: 'Find countries that have more than 1 user.',
    solution: 'SELECT country, COUNT(*) as user_count FROM users GROUP BY country HAVING COUNT(*) > 1',
    expectedRowCount: 3,
    expectedOutput: [
      { country: 'USA', user_count: 3 },
      { country: 'UK', user_count: 2 },
      { country: 'Canada', user_count: 2 },
    ],
    explanation: 'HAVING filters groups after GROUP BY, while WHERE filters rows before grouping. Use HAVING when filtering on aggregate results.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },

  // JOINS
  {
    id: 'inner-join',
    title: 'INNER JOIN',
    category: 'joins',
    description: 'Combine tables - only matching rows',
    hint: 'INNER JOIN returns rows that have matches in both tables',
    task: 'List all orders with customer names.',
    solution: 'SELECT customers.name, orders.order_id, orders.amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id',
    expectedRowCount: 4,
    expectedOutput: [
      { name: 'Alice Johnson', order_id: 101, amount: 99.99 },
      { name: 'Alice Johnson', order_id: 102, amount: 149.50 },
      { name: 'Bob Smith', order_id: 103, amount: 75.00 },
      { name: 'Charlie Brown', order_id: 104, amount: 200.00 },
    ],
    explanation: 'INNER JOIN combines rows from two tables where the join condition matches. Only rows with matches in both tables appear in the result.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
      
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        amount REAL,
        order_date TEXT
      );
      
      INSERT INTO customers VALUES
      (1, 'Alice Johnson', 'alice@email.com'),
      (2, 'Bob Smith', 'bob@email.com'),
      (3, 'Charlie Brown', 'charlie@email.com'),
      (4, 'Diana Prince', 'diana@email.com');
      
      INSERT INTO orders VALUES
      (101, 1, 99.99, '2024-01-15'),
      (102, 1, 149.50, '2024-01-20'),
      (103, 2, 75.00, '2024-01-18'),
      (104, 3, 200.00, '2024-01-22');
    `,
  },
  {
    id: 'left-join',
    title: 'LEFT JOIN',
    category: 'joins',
    description: 'Include all rows from left table',
    hint: 'LEFT JOIN returns all rows from left table, even without matches',
    task: 'List all customers and their orders (include customers with no orders).',
    solution: 'SELECT customers.name, orders.order_id, orders.amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id',
    expectedRowCount: 5,
    expectedOutput: [
      { name: 'Alice Johnson', order_id: 101, amount: 99.99 },
      { name: 'Alice Johnson', order_id: 102, amount: 149.50 },
      { name: 'Bob Smith', order_id: 103, amount: 75.00 },
      { name: 'Charlie Brown', order_id: 104, amount: 200.00 },
      { name: 'Diana Prince', order_id: null, amount: null },
    ],
    explanation: 'LEFT JOIN returns all rows from the left table, even if there\'s no match in the right table. Missing values appear as NULL.',
    difficulty: 'intermediate',
    schema: `
      CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
      
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        amount REAL,
        order_date TEXT
      );
      
      INSERT INTO customers VALUES
      (1, 'Alice Johnson', 'alice@email.com'),
      (2, 'Bob Smith', 'bob@email.com'),
      (3, 'Charlie Brown', 'charlie@email.com'),
      (4, 'Diana Prince', 'diana@email.com');
      
      INSERT INTO orders VALUES
      (101, 1, 99.99, '2024-01-15'),
      (102, 1, 149.50, '2024-01-20'),
      (103, 2, 75.00, '2024-01-18'),
      (104, 3, 200.00, '2024-01-22');
    `,
  },
  {
    id: 'multi-join',
    title: 'Multiple Table Joins',
    category: 'joins',
    description: 'Join more than two tables',
    hint: 'You can chain multiple JOINs to combine many tables',
    task: 'List all orders with customer names and product details.',
    solution: 'SELECT customers.name, orders.order_id, products.product_name, products.price FROM orders INNER JOIN customers ON orders.customer_id = customers.id INNER JOIN products ON orders.product_id = products.id',
    expectedRowCount: 4,
    expectedOutput: [
      { name: 'Alice Johnson', order_id: 101, product_name: 'Laptop', price: 999.99 },
      { name: 'Alice Johnson', order_id: 102, product_name: 'Mouse', price: 29.99 },
      { name: 'Bob Smith', order_id: 103, product_name: 'Keyboard', price: 79.99 },
      { name: 'Charlie Brown', order_id: 104, product_name: 'Monitor', price: 299.99 },
    ],
    explanation: 'You can chain multiple JOINs to combine many tables. Each JOIN connects one more table to your result set.',
    difficulty: 'advanced',
    schema: `
      CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
      
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        price REAL
      );
      
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        order_date TEXT
      );
      
      INSERT INTO customers VALUES
      (1, 'Alice Johnson', 'alice@email.com'),
      (2, 'Bob Smith', 'bob@email.com'),
      (3, 'Charlie Brown', 'charlie@email.com');
      
      INSERT INTO products VALUES
      (1, 'Laptop', 999.99),
      (2, 'Mouse', 29.99),
      (3, 'Keyboard', 79.99),
      (4, 'Monitor', 299.99);
      
      INSERT INTO orders VALUES
      (101, 1, 1, 1, '2024-01-15'),
      (102, 1, 2, 2, '2024-01-15'),
      (103, 2, 3, 1, '2024-01-18'),
      (104, 3, 4, 1, '2024-01-22');
    `,
  },

  // SUBQUERIES
  {
    id: 'subquery-where',
    title: 'Subquery in WHERE',
    category: 'subqueries',
    description: 'Use query results in conditions',
    hint: 'A subquery is a query inside another query, wrapped in parentheses',
    task: 'Find all users who are older than the average age.',
    solution: 'SELECT * FROM users WHERE age > (SELECT AVG(age) FROM users)',
    expectedRowCount: 5,
    expectedOutput: [
      { id: 2, name: 'Bob Smith', email: 'bob@email.com', age: 35, country: 'UK', city: 'London' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', age: 42, country: 'Canada', city: 'Toronto' },
      { id: 6, name: 'Frank Miller', email: 'frank@email.com', age: 39, country: 'USA', city: 'Chicago' },
      { id: 8, name: 'Henry Davis', email: 'henry@email.com', age: 45, country: 'UK', city: 'Manchester' },
      { id: 9, name: 'Ivy Chen', email: 'ivy@email.com', age: 33, country: 'China', city: 'Beijing' },
    ],
    explanation: 'A subquery runs first and its result is used in the outer query. Here, the subquery calculates the average, then the outer query filters by it.',
    difficulty: 'advanced',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        country TEXT,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice Johnson', 'alice@email.com', 28, 'USA', 'New York'),
      (2, 'Bob Smith', 'bob@email.com', 35, 'UK', 'London'),
      (3, 'Charlie Brown', 'charlie@email.com', 42, 'Canada', 'Toronto'),
      (4, 'Diana Prince', 'diana@email.com', 31, 'USA', 'Los Angeles'),
      (5, 'Eve Wilson', 'eve@email.com', 26, 'Australia', 'Sydney'),
      (6, 'Frank Miller', 'frank@email.com', 39, 'USA', 'Chicago'),
      (7, 'Grace Lee', 'grace@email.com', 29, 'South Korea', 'Seoul'),
      (8, 'Henry Davis', 'henry@email.com', 45, 'UK', 'Manchester'),
      (9, 'Ivy Chen', 'ivy@email.com', 33, 'China', 'Beijing'),
      (10, 'Jack Robinson', 'jack@email.com', 27, 'Canada', 'Vancouver');
    `,
  },
  {
    id: 'subquery-in',
    title: 'Subquery with IN',
    category: 'subqueries',
    description: 'Check if value exists in subquery results',
    hint: 'Use IN with a subquery to match against multiple values',
    task: 'Find customers who have placed orders.',
    solution: 'SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders)',
    expectedRowCount: 3,
    expectedOutput: [
      { id: 1, name: 'Alice Johnson', email: 'alice@email.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@email.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@email.com' },
    ],
    explanation: 'Using IN with a subquery checks if a value exists in the subquery results. This is useful for finding related records across tables.',
    difficulty: 'advanced',
    schema: `
      CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
      
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        amount REAL,
        order_date TEXT
      );
      
      INSERT INTO customers VALUES
      (1, 'Alice Johnson', 'alice@email.com'),
      (2, 'Bob Smith', 'bob@email.com'),
      (3, 'Charlie Brown', 'charlie@email.com'),
      (4, 'Diana Prince', 'diana@email.com');
      
      INSERT INTO orders VALUES
      (101, 1, 99.99, '2024-01-15'),
      (102, 1, 149.50, '2024-01-20'),
      (103, 2, 75.00, '2024-01-18'),
      (104, 3, 200.00, '2024-01-22');
    `,
  },

  // ADVANCED
  {
    id: 'union',
    title: 'UNION Operator',
    category: 'advanced',
    description: 'Combine results from multiple queries',
    hint: 'UNION combines results and removes duplicates. UNION ALL keeps duplicates.',
    task: 'Get a list of all cities from both users and offices tables.',
    solution: 'SELECT city FROM users UNION SELECT city FROM offices',
    expectedRowCount: 5,
    expectedOutput: [
      { city: 'New York' },
      { city: 'London' },
      { city: 'Toronto' },
      { city: 'Paris' },
      { city: 'Tokyo' },
    ],
    explanation: 'UNION combines results from multiple queries and removes duplicates. Both queries must return the same number of columns.',
    difficulty: 'advanced',
    schema: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT
      );
      
      CREATE TABLE offices (
        office_id INTEGER PRIMARY KEY,
        office_name TEXT NOT NULL,
        city TEXT
      );
      
      INSERT INTO users VALUES
      (1, 'Alice', 'New York'),
      (2, 'Bob', 'London'),
      (3, 'Charlie', 'Toronto');
      
      INSERT INTO offices VALUES
      (1, 'HQ', 'New York'),
      (2, 'Europe Office', 'Paris'),
      (3, 'Asia Office', 'Tokyo');
    `,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

export function getLessonsByCategory(categoryId: string): Lesson[] {
  return lessons.filter(lesson => lesson.category === categoryId);
}

export function getCategoryById(id: string): LessonCategory | undefined {
  return categories.find(cat => cat.id === id);
}
