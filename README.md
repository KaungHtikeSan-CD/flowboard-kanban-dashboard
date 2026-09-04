# FlowBoard — Kanban Board with Dashboard

FlowBoard is a two-page React web application for planning and tracking team work. It provides a three-column Kanban board and a live dashboard, with all information stored in the browser using Local Storage—no backend is used.

## Features

- Create, edit, and delete tasks
- Move tasks between **TO DO**, **DOING**, and **DONE** using drag-and-drop or the card status selector
- Automatically records the completion date when a task moves to DONE
- Assign a provided team member and category to every task
- Add categories that remain available after refreshing the page
- Dashboard with summary cards, a task-status doughnut chart, category bar chart, and early/on-time/late completion performance chart
- Responsive layout for desktop and mobile

## Screenshots

| Kanban board | Dashboard |
| --- | --- |
| ![Kanban board screenshot](docs/screenshots/kanban-board.png) | ![Dashboard screenshot](docs/screenshots/dashboard.png) |

## Team members

- Kaung Htike San
- Phyo Min Khaing
- Oak Soe Khant

## Run locally

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Open the local address displayed by Vite.

To create a production build, run `npm run build`.

## GitHub Pages deployment

1. Push this folder as its own GitHub repository.
2. In the repository, go to **Settings → Pages** and select **GitHub Actions** as the source.
3. Add the workflow below at `.github/workflows/deploy.yml`, commit, and push.

```yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

The Vite configuration uses a relative asset path, so it works from a GitHub Pages project URL.

## Suggested three-person contribution plan

1. **Member 1:** board UI, task card, and task movement.
2. **Member 2:** task form, category management, and Local Storage.
3. **Member 3:** dashboard, README, screenshots, and deployment.

Each person should use a separate branch, make an individual commit, push their branch, and open a pull request into `main`. This produces clear individual contribution history while keeping the final branch stable.
