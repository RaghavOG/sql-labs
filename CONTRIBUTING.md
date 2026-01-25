# Contributing to SQL Labs

Thank you for considering contributing to SQL Labs! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

### Suggesting Features

Have an idea? Open an issue with:
- Clear description of the feature
- Why it would be useful
- Example use case

### Code Contributions

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sql-labs.git
   cd sql-labs
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**
   - Follow the existing code style
   - Test your changes locally
   - Ensure no linter errors: `npm run lint`

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues

## Adding New Lessons

To add a SQL lesson, edit `lib/lessons.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Lesson Title',
  category: 'querying', // or filtering, sorting, aggregation, joins, subqueries, advanced
  description: 'Brief description',
  hint: 'Optional hint for learners',
  task: 'What the user should accomplish',
  solution: 'SELECT * FROM table',
  difficulty: 'beginner', // or intermediate, advanced
  schema: `
    CREATE TABLE example (
      id INTEGER PRIMARY KEY,
      name TEXT
    );
    INSERT INTO example VALUES (1, 'Test');
  `
}
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow existing patterns
- Use Tailwind CSS for styling
- Keep components simple and focused

### Testing Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### Before Submitting
- [ ] Code runs without errors
- [ ] No linter warnings
- [ ] Tested in the browser
- [ ] Follows existing patterns
- [ ] Documented if needed

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in the pull request
- Reach out to [@RaghavOG](https://github.com/RaghavOG)

## Code of Conduct

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

---

**Thank you for contributing!** 🙏
