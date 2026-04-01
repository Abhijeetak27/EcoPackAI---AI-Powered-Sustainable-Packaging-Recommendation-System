# Contributing to EcoPackAI

Thank you for your interest in contributing! 🌿

## Getting Started

1. **Fork** the repository and clone your fork.
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development Guidelines

- **TypeScript**: All new code must be typed. Avoid `any`.
- **Components**: Keep components focused and under ~150 lines. Extract sub-components as needed.
- **Styling**: Use the existing TailwindCSS utility classes and the `eco-*` design system classes in `index.css`. Avoid inline styles.
- **Data**: To add packaging materials, edit `src/data/materials.ts` and follow the `PackagingMaterial` interface exactly.
- **Linting**: Run `npm run lint` before pushing. Fix all errors.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add hemp fiber material to database
fix: correct CO₂ filter range on MaterialsPage
chore: update dependencies
docs: improve README setup section
```

## Pull Requests

- Keep PRs focused on a single concern.
- Add a clear description of what changed and why.
- Ensure `npm run build` passes with no errors.
- For UI changes, include a screenshot or short screen recording.

## Reporting Issues

Use GitHub Issues. Include:
- Steps to reproduce
- Expected vs. actual behavior
- Browser/OS version if applicable

---

Thank you for helping make packaging more sustainable! 🌍
