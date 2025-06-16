# AI Maturity Model

## Deployment

The site is automatically deployed to GitHub Pages from the `docs` folder on the `main` branch using Vite and GitHub Actions. Any changes merged into `main` will trigger a redeploy.

## Branch Protection (Recommended)

To protect the `main` branch:
1. Go to your repository on GitHub.
2. Navigate to **Settings > Branches**.
3. Add a branch protection rule for `main`:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - (Optional) Require linear history, signed commits, etc.

## Local Development

1. Clone the repository and install dependencies:
   ```sh
   npm ci
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Build for production (outputs to `docs`):
   ```sh
   npm run build
   ```

---

Feel free to open issues or PRs to improve the project or its documentation!
