# VoyagerAI

## 🚀 Setup Guide (For Team Members)

Use this guide to run the project on your local machine.

---

### ✅ Step 1: Install Node.js & npm

If you haven’t installed Node.js yet:

1. Go to [https:node//nodejs.org](https://nodejs.org)
2. Download and install the **LTS version** (Long-Term Support)
3. Verify installation:

```bash
node -v
npm -v
```

You should see version numbers (e.g., `v20.x.x`, `8.x.x`).

---

### ✅ Step 2: Install Project Dependencies

Inside the project folder, run:

```bash
npm install
```

This installs everything listed in `package.json`.

---

### ✅ Step 3: Install `nodemon` Globally

We use `nodemon` to auto-restart the server on file changes.

Install it once globally:

```bash
npm install -g nodemon
```

> If you’re on Mac or Linux and get a permission error, use:

```bash
sudo npm install -g nodemon
```

---

### ✅ Step 4: Start the Development Server

Start the server with:

```bash
npm run dev
```

You should see:

```
✅ Server running at http://localhost:3000
```

Now open your browser and go to:
[http://localhost:3000](http://localhost:3000)

---

### 📁 Project Structure (Important folders)

```
VoyagerAI/
├── public/          # Contains all HTML, CSS, JS
│   ├── support.html
│   ├── css/
│   └── scripts/
├── server.js        # Node.js server
├── package.json
```

---

### 🚫 To Stop the Server

Press `Ctrl + C` in the terminal where it’s running.

---
