# Nisar-ai-studio- 

[![TypeScript](https://img.shields.io/badge/TypeScript-4B0082?style=for-the-badge&logo=typescript&logoColor=white)]() 
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)]() 
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]() 
[![Express](https://img.shields.io/badge/Express-404D59?style=for-the-badge&logo=express&logoColor=white)]() 
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)]() 
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)]() 

## Description 

Nisar AI Studio is a comprehensive AI-powered development environment designed to streamline the process of writing, converting, and reviewing code. It leverages the power of AI models like Gemini to provide advanced features such as code generation, code explanation, bug detection, and optimization suggestions. The studio also includes integrated tools for terminal simulation (Git, Firebase), master automation pipelines for data synchronization, and project memory for saving and recalling code snippets.

## Table of Contents 

- [Project Title & Badges](#nisar-ai-studio-) 
- [Description](#description) 
- [Table of Contents](#table-of-contents) 
- [Features](#features) 
- [Tech Stack](#tech-stack) 
- [Installation](#installation) 
- [Usage](#usage) 
- [Project Structure](#project-structure) 
- [API Reference](#api-reference) 
- [Contributing](#contributing) 
- [License](#license) 
- [Important Links](#important-links) 
- [Footer](#footer)

## Features 

✨ **AI-Powered Code Generation:** Generate production-ready code in various languages based on natural language prompts.

🔄 **Code Conversion:** Seamlessly convert code between different languages, frameworks, and libraries.

🔍 **AI Code Reviewer:** Get detailed line-by-line explanations, identify bugs, and receive optimization suggestions.

💬 **AI Chat Assistant:** Interact with multiple AI models (Gemini, Claude, OpenAI) for diverse coding assistance.

💻 **Simulated Terminal:** Practice Git and Firebase commands in a safe, simulated environment.

⚙️ **Master Automation Assistant:** Automate data synchronization pipelines between various cloud services with configurable rules and strategies.

💾 **Project Memory:** Save and recall your code snippets and prompts, synced with Cloud Firestore.

🚀 **Firebase Deployment:** Simplified deployment of web assets and Firestore rules to Firebase.

📦 **Export Build Packages:** Bundle and export your projects in various formats (ZIP, GitHub, APK).

## Tech Stack 

- **Languages:** TypeScript, JavaScript, HTML, CSS, JSON, Markdown 
- **Frameworks/Libraries:** Node.js, React, Express, Vite, Tailwind CSS, Google Generative AI, Firebase, Lucide React, Motion

## Installation 

**Prerequisites:**

- Node.js (v18 or higher recommended)

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rananisarsb51214-web/Nisar-ai-studio-.git
   cd Nisar-ai-studio-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```dotenv
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
   *(Note: `.env.example` is provided in the repository for reference.)*

## Usage 

Nisar AI Studio provides a web-based interface to leverage its AI capabilities.

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command will start the Vite development server, typically on `http://localhost:3000` (as defined in `server.ts`).

2.  **Access the Studio:**
    Open your web browser and navigate to `http://localhost:3000`.

3.  **Explore Features:**
    Use the sidebar navigation to access different modules:
    -   **Dashboard:** Overview of system status and project memory.
    -   **Automation:** Configure and run data synchronization pipelines.
    -   **Generator:** Create code snippets using AI prompts.
    -   **Converter:** Convert code between different formats.
    -   **Chat:** Engage with AI assistants for coding help.
    -   **Git Integration:** Simulate Git commands.
    -   **Deploy:** Manage Firebase deployments.
    -   **Memory:** Access saved projects and code snippets.
    -   **Export:** Compile and export your project.

### Real-world Use Cases:

-   **Rapid Prototyping:** Quickly generate frontend components or backend logic using the AI Generator.
-   **Code Modernization:** Convert legacy codebases to modern frameworks like React with the Code Converter.
-   **Learning and Debugging:** Understand complex code sections or identify bugs using the AI Code Reviewer.
-   **Data Synchronization:** Automate data flow between business applications (e.g., Google Sheets to Airtable) using the Master Automation Assistant.
-   **Development Practice:** Experiment with Git and Firebase commands in a safe, simulated terminal environment.

## Project Structure 

```
nisar-ai-os/
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── firebase-applet-config.json # Firebase configuration
├── firebase-blueprint.json   # Firebase blueprint (content empty)
├── firestore.rules           # Firestore security rules
├── index.html                # Main HTML entry point
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
├── server.ts                 # Express server implementation
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── memory/
│   └── saveMemory.js         # Script to save memory to Firestore
├── src/
│   ├── App.tsx               # Main React application component
│   ├── firebase.ts           # Firebase initialization and export
│   ├── index.css             # Global CSS styles
│   └── main.tsx              # React application entry point
└── sync/
    └── firebase-sync.js      # Script for Firebase synchronization
```

## API Reference 

This project exposes several API endpoints via the Express server (`server.ts`) for its frontend to consume:

-   **`POST /api/generate`**: Generates code based on a prompt and language.
-   **`POST /api/convert`**: Converts code from a source format to a target format.
-   **`POST /api/explain`**: Analyzes code for explanations, bugs, or optimizations.
-   **`POST /api/chat`**: Facilitates chat interactions with AI models.
-   **`POST /api/terminal`**: Simulates terminal commands (Git, Firebase, custom scripts).
-   **`POST /api/automation/run`**: Simulates the execution of a master automation pipeline.
-   **`POST /api/automation/script`**: Generates a data synchronization script based on provided parameters.

## Contributing 

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License 

This project does not appear to have a license specified in the provided files.

## Important Links 

-   **GitHub Repository:** [https://github.com/rananisarsb51214-web/Nisar-ai-studio-](https://github.com/rananisarsb51214-web/Nisar-ai-studio-)
-   **AI Studio View:** [https://ai.studio/apps/4d274081-2bb2-4f5e-9ede-16331c3b321d](https://ai.studio/apps/4d274081-2bb2-4f5e-9ede-16331c3b321d)

## Footer 

© **Nisar AI Studio** | [rananisarsb51214-web](https://github.com/rananisarsb51214-web) 

Repository URL: [https://github.com/rananisarsb51214-web/Nisar-ai-studio-](https://github.com/rananisarsb51214-web/Nisar-ai-studio-)

Made with ❤️ and AI 🤖

Give a ⭐ if you liked this project!


---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**