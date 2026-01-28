# Quick Publishing Commands

## 🚀 Step-by-Step Publishing

### 📦 TypeScript SDK to npm

**Step 1: Create npm account**
- Go to https://www.npmjs.com/signup
- Create your account

**Step 2: Login**
```bash
npm login
```
Enter your username, password, and email.

**Step 3: Build and Publish**
```bash
cd sdk/typescript
npm install
npm run build
npm publish --access public
```

Done! Your package will be live at: `https://www.npmjs.com/package/@adiyogi/weather-sdk`

---

### 🐍 Python SDK to PyPI

**Step 1: Create PyPI account**
- Go to https://pypi.org/account/register/
- Verify your email

**Step 2: Create API Token**
- Go to https://pypi.org/manage/account/token/
- Click "Add API token"
- Name it "adiyogi-weather"
- Scope: "Entire account"
- Copy the token (starts with `pypi-...`)

**Step 3: Install Build Tools**
```bash
pip install build twine
```

**Step 4: Build and Publish**
```bash
cd sdk/python
python -m build
twine upload dist/*
```

When prompted:
- Username: `__token__`
- Password: `<paste your pypi token>`

Done! Your package will be live at: `https://pypi.org/project/adiyogi-weather/`

---

## 📝 After Publishing

### Install Your Packages

**TypeScript:**
```bash
npm install @adiyogi/weather-sdk
```

**Python:**
```bash
pip install adiyogi-weather
```

### Update Your Docs Page

Update `frontend/app/docs/page.tsx` with real installation commands showing your actual published packages!

---

## 🐛 Common Issues

### npm: "You must be logged in to publish packages"
```bash
npm logout
npm login
```

### PyPI: "403 Forbidden"
- Check if package name is available
- Or use a different name in `pyproject.toml`

### npm: "Package name too similar to existing package"
- Change name in `package.json` to something unique
- Example: `@your-username/adiyogi-weather-sdk`

---

## 🎯 Quick Commands Reference

```bash
# TypeScript SDK
cd sdk/typescript && npm install && npm run build && npm publish --access public

# Python SDK  
cd sdk/python && python -m build && twine upload dist/*
```
