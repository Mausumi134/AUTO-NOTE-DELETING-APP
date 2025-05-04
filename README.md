# 🗒️ Auto Note Deleting App

A simple and clean React app that lets you take quick notes that **automatically delete** after a user-defined time. Perfect for jotting down temporary thoughts, reminders, or sensitive info you don’t want lingering.

## ✨ Features

- ✅ Create and manage notes in real-time
- ⏱️ Auto-delete notes after a set time (e.g., 1 min, 5 min, 1 hour)
- 🧠 Intuitive and minimal UI
- 💾 All notes stored in-memory or optionally in `localStorage`
- ⚛️ Built using modern React (with Hooks)

## 📦 Tech Stack

- **Frontend**: React, HTML, CSS (or styled-components, Tailwind — adjust based on your project)
- **Storage**: In-memory or browser `localStorage`
- **Timer**: `setTimeout()` for auto-deletion

## 🖥️ Demo

> [Live Demo Link](https://statuesque-queijadas-116cff.netlify.app)

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Mausumi134/AUTO-NOTE-DELETING-APP.git
cd project
npm install
npm run dev
````

The app will run on `http://localhost:5173`.


## 📸 Screenshots

![Screenshot 2025-04-14 164307](https://github.com/user-attachments/assets/63a6f652-2f3f-4b20-9205-522ccc550820)

![Screenshot 2025-04-14 164328](https://github.com/user-attachments/assets/b36e3c36-fd35-44a4-adcd-ee0e3c12dc74)

![Screenshot 2025-04-14 164348](https://github.com/user-attachments/assets/f99f547a-4de7-40a9-b544-c8aab9ef3833)

## 🧠 How It Works

* Each note is assigned a timestamp and a time-to-live (TTL)
* React's `useEffect` with `setTimeout` automatically deletes the note after TTL expires
* Optional: Store notes in `localStorage` to persist until browser refresh (only if needed)

## 💡 Use Cases

* Temporary to-do lists
* Writing down sensitive content like OTPs or passwords
* Brain-dumping thoughts you want to forget later

## 📌 Future Ideas

* User-defined TTL dropdown
* Toast notifications before deletion
* Dark mode toggle
* Note color-coding or priority


Built with ❤️ using React by Mausumi Ghadei
