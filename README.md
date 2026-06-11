# project-music-data

# Listening Answers

A small semantic HTML and JavaScript frontend that calculates listening answers on demand from the supplied data.

## What It Does

- Provides a labelled drop-down for selecting a user.
- Calculates all answers in the browser when a user is selected.
- Hides questions that do not apply to the selected user.
- Uses plain JavaScript modules with no authentication and no framework.
- Includes a Node unit test for the calculation logic.

## Project Files

- `index.html` - semantic page structure.
- `styles.css` - accessible responsive styling.
- `data.mjs` - supplied data helpers.
- `common.mjs` - shared helpers based on the data module.
- `analytics.mjs` - pure calculation functions.
- `app.mjs` - DOM rendering and user selection.
- `tests/analytics.test.mjs` - unit test.
- `.github/workflows/deploy.yml` - GitHub Pages deployment.

## Run Locally

Use any static file server from this folder. For example:

```sh
npm start
```

Then open the printed local URL.

## Test

```sh
npm test
```

## Deployment

The included GitHub Actions workflow deploys the site to GitHub Pages whenever changes are pushed or merged to the `main` branch.

In GitHub, set Pages to use GitHub Actions as the source. After the workflow runs, GitHub will provide the public site URL.

## Accessibility Notes

The page uses landmarks, labelled controls, keyboard-friendly native elements, visible focus styles, and a polite live results region. Result sections are generated only when their question applies to the selected user's data.
