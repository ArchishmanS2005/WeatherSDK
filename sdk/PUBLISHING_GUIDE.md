# Publishing Guide - Adiyogi Weather SDKs

## 📦 TypeScript SDK - npm Publishing

### Prerequisites

1. Create npm account at https://www.npmjs.com/signup
2. Login to npm:
   ```bash
   npm login
   ```

### Publishing Steps

1. Navigate to TypeScript SDK:
   ```bash
   cd sdk/typescript
   ```

2. Build the package:
   ```bash
   npm run build
   ```

3. Test the build:
   ```bash
   npm pack
   ```
   This creates a `.tgz` file you can test locally.

4. Publish to npm:
   ```bash
   npm publish --access public
   ```

### Version Updates

To publish a new version:

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Rebuild and publish:
   ```bash
   npm run build
   npm publish
   ```

### Testing Before Publishing

```bash
# Link locally
npm link

# In another project
npm link @adiyogi/weather-sdk

# Test import
import { AdiyogiClient } from '@adiyogi/weather-sdk';
```

---

## 🐍 Python SDK - PyPI Publishing

### Prerequisites

1. Create PyPI account at https://pypi.org/account/register/
2. Create API token at https://pypi.org/manage/account/token/
3. Install build tools:
   ```bash
   pip install build twine
   ```

### Publishing Steps

1. Navigate to Python SDK:
   ```bash
   cd sdk/python
   ```

2. Build the package:
   ```bash
   python -m build
   ```
   This creates `dist/` directory with `.tar.gz` and `.whl` files.

3. Test with TestPyPI (optional but recommended):
   ```bash
   # Upload to test repository
   twine upload --repository testpypi dist/*
   
   # Install from test repository
   pip install --index-url https://test.pypi.org/simple/ adiyogi-weather
   ```

4. Publish to PyPI:
   ```bash
   twine upload dist/*
   ```
   
   Enter your PyPI username and API token when prompted.

### Using API Token

Create `~/.pypirc`:

```ini
[pypi]
username = __token__
password = pypi-your-api-token-here

[testpypi]
username = __token__
password = pypi-your-test-api-token-here
```

### Version Updates

1. Update version in `pyproject.toml`:
   ```toml
   version = "1.0.1"
   ```

2. Remove old builds and rebuild:
   ```bash
   rm -rf dist/
   python -m build
   twine upload dist/*
   ```

### Testing Before Publishing

```bash
# Install in development mode
pip install -e .

# Test import
python -c "from adiyogi_weather import Adiyogi; print('Success!')"
```

---

## ✅ Pre-Publishing Checklist

### TypeScript SDK

- [ ] README.md is complete and accurate
- [ ] package.json version is updated
- [ ] All dependencies are listed correctly
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Tests pass (if any)
- [ ] LICENSE file exists
- [ ] .npmignore excludes unnecessary files

### Python SDK

- [ ] README.md is complete and accurate
- [ ] pyproject.toml version is updated
- [ ] All dependencies are listed correctly
- [ ] Package builds without errors (`python -m build`)
- [ ] Tests pass (if any)
- [ ] LICENSE file exists
- [ ] MANIFEST.in includes necessary files (if needed)

---

## 🔄 Continuous Updates

### Semantic Versioning

Follow semver (https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Automated Publishing (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish SDKs

on:
  release:
    types: [created]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: cd sdk/typescript && npm install && npm run build
      - run: cd sdk/typescript && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

  publish-pypi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install build twine
      - run: cd sdk/python && python -m build
      - run: cd sdk/python && twine upload dist/*
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{secrets.PYPI_TOKEN}}
```

---

## 📝 Documentation

After publishing:

1. Update documentation at https://docs.adiyogi.com
2. Add changelog to GitHub releases
3. Tweet/announce the new version
4. Update examples in repository

---

## 🐛 Troubleshooting

### npm Issues

- **403 Forbidden**: Check if package name is already taken
- **Need authentication**: Run `npm login` again
- **Build errors**: Delete `node_modules` and `package-lock.json`, run `npm install`

### PyPI Issues

- **Package already exists**: Choose a different name or contact PyPI support
- **Invalid credentials**: Regenerate API token
- **Build errors**: Check `pyproject.toml` syntax and dependencies

---

## 📞 Support

- npm: https://docs.npmjs.com/
- PyPI: https://pypi.org/help/
- GitHub Issues: https://github.com/adiyogi/weather-sdk/issues
