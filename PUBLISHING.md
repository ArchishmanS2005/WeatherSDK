# 🚀 Publishing Guide

Follow these steps to publish your SDKs to PyPI (Python) and npm (TypeScript).

## 🐍 Python SDK (PyPI)
**Goal**: Publish `adiyogi-weather` to [pypi.org/user/adiyogi-ai/](https://pypi.org/user/adiyogi-ai/)

1.  **Navigate to directory**:
    ```bash
    cd sdk/python
    ```
2.  **Install build tools**:
    ```bash
    pip install build twine
    ```
3.  **Build the package**:
    ```bash
    python -m build
    ```
    *   This creates a `dist/` folder with `.tar.gz` and `.whl` files.
4.  **Upload to PyPI**:
    ```bash
    twine upload dist/*
    ```
    *   **Username**: `__token__` (recommended) or `adiyogi-ai`
    *   **Password**: Your PyPI API Token or password.

## 🟦 TypeScript SDK (npm)
**Goal**: Publish `@archishman2005/adiyogi-weather-sdk` to [npmjs.com](https://www.npmjs.com/)

1.  **Navigate to directory**:
    ```bash
    cd sdk/typescript
    ```
2.  **Review Package**:
    *   Only `dist/` folder will be published (configured in `package.json`).
3.  **Login to npm**:
    ```bash
    npm login
    ```
    *   Follow the browser prompt to authenticate as `archishman2005`.
4.  **Publish**:
    ```bash
    npm publish --access public
    ```
    *   **Note**: Because this is a scoped package (`@archishman2005/...`), you **MUST** use `--access public`.
    *   **2FA**: If you have 2FA enabled, append your code:
        ```bash
        npm publish --access public --otp=123456
        ```

## 🔄 Version Updates
When you want to release an update (e.g., v0.1.1):
1.  **Python**: Update `version = "0.1.1"` in `pyproject.toml`.
2.  **TypeScript**: Update `"version": "0.1.1"` in `package.json`.
3.  Repeat the build and publish steps above.
