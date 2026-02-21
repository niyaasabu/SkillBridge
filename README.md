

# SkillBridge 🎯

> A lightweight freelance & task marketplace frontend for connecting clients and freelancers among students

**Team:** Team Bit & Byte

**Team Members**
- Member 1: Ardra M R - College of Engineering Kallooppara
- Member 2: Neya Sabu - College of Engineering Kallooppara

**Hosted Project Link**
https://skill-bridge-ecru-alpha.vercel.app/

## Project Overview

SkillBridge is a static frontend prototype for a marketplace where users can post tasks, list skills, browse jobs, and chat. It demonstrates core UI flows for authentication, listings, profile management, and messaging.

### Problem Statement

Freelancers and clients often lack a lightweight platform focused on quick task postings and skill discovery without heavy onboarding.

### Solution

Provide a simple, fast, and easy-to-host frontend that showcases task posting, skill listings, searching, and messaging to validate UX and early workflows.

---

## Technical Details

**For Software:**
- Languages used: HTML, CSS, JavaScript
- Frameworks used: None (vanilla frontend)
- Libraries used: None required (add dependencies if integrating backend)
- Tools used: VS Code, Git

**Project structure**
- `index.html`, `login.html`, `register.html` — Core pages
- `dashboard.html`, `profile.html` — User views
- `marketplace.html`, `post-task.html`, `post-skill.html` — Listings and posting
- `chat.html` — Messaging UI
- `styles.css` — Global styles
- `script.js` — Frontend behavior

---

## Features

- Browse marketplace: view and search tasks/skills
- Post task: clients can create new task listings
- Post skill: freelancers can advertise skills/services
- Authentication flows: login and registration pages (UI only)
- Dashboard: user-specific overview
- Profile: view and edit basic user info
- Chat: simple messaging UI for user communication

---

## Implementation

### Installation

This is a static site — open `index.html` directly, or run a local static server.


Then open http://localhost:8000 (or the port you chose).

### Run

Open the site in your browser after starting the static server.

---

## Project Documentation

### Screenshots

Add at least three screenshots into a `docs/` or `screenshots/` folder and link them here.

![Homepage](docs/<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/2784900a-08ec-408a-a497-1f625b13a534" />
)
*Homepage / landing view*

![Marketplace](docs/<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/556c29bc-0b62-494b-9993-6d5aafec4d9b" />
)
*Marketplace browsing and search*

![Post Task](docs/<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/16085e4a-dc3c-4b1f-b7ad-cde045028c77" />
)
*Post a new task form*


## API


**GET /api/tasks** — List tasks
- Response example:

```json
{
	"status": "success",
	"data": [ /* tasks */ ]
}
```

**POST /api/tasks** — Create a task
- Body:

```json
{
	"title": "Fix CSS bug",
	"description": "Details...",
	"budget": 50
}
```

Adapt the endpoints to match your backend if/when integrated.

---

## Development

- Edit `styles.css` and `script.js` to change UI and behavior.
- Keep changes modular: update only the page-specific HTML and associated JS functions.
- If adding build tooling, update `package.json` with `start` and `build` scripts.

## Deployment

Hosted as a static site on GitHub Pages,  Vercel, or any static file server.

## Contributing

- Open an issue for feature requests or bugs.
- Send pull requests with a clear description and small changes.

## License

Add a `LICENSE` file to indicate project licensing (MIT recommended for permissive use).

---



---

## Team Contributions

- Ardra MR: Frontend development, UI design
- Neya Sabu: Backend, testing, documentation

---



---

Made with ❤️ by Team Bit & Byte
