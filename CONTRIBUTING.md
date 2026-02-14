# Contributing to Alexa MCP Server

Thank you for your interest in contributing!

## Development Setup

1.  **Install dependencies**:

    ```bash
    pnpm install
    ```

2.  **Linting**:
    To lint your code:

    ```bash
    pnpm lint
    ```

    To fix linting issues:

    ```bash
    pnpm lint:fix
    ```

3.  **Formatting**:
    To format your code:

    ```bash
    pnpm format
    ```

    To check formatting:

    ```bash
    pnpm format:check
    ```

4.  **Type Checking**:
    To check TypeScript types:
    ```bash
    pnpm type-check
    ```

## Code Style

This project follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) and uses [Prettier](https://prettier.io/) for consistent code formatting.

## Pull Requests

1.  Create a new branch for your feature or fix.
2.  Make your changes.
3.  Run `pnpm lint`, `pnpm format:check`, and `pnpm type-check` to ensure your changes are clean.
4.  Submit a Pull Request. CI will automatically run these checks.
