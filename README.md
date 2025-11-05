API Test Bench & AI Assistant
![alt text](https://img.shields.io/badge/License-MIT-blue.svg)

![alt text](https://img.shields.io/badge/React-19-blue?logo=react)

![alt text](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

![alt text](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?logo=tailwindcss)

![alt text](https://img.shields.io/badge/Google-Gemini_API-orange?logo=google)
A sleek, shadcn-inspired UI to test and demonstrate your FastAPI backend. Features an integrated Google Gemini AI assistant to analyze API responses, providing actionable insights and suggestions for improvement.
(Replace the above URL with a screenshot of your application)
Overview
This project provides a comprehensive, browser-based interface for interacting with and testing RESTful APIs. It's designed for developers who need a quick, efficient, and intelligent tool for API development and demonstration. The key differentiator is its built-in AI assistant, powered by the Google Gemini API, which offers expert-level analysis of your API's performance, security, and structure.
✨ Key Features
Full REST Client: Send GET, POST, PUT, PATCH, DELETE requests with custom headers and JSON bodies.
Intelligent AI Analysis: Use the power of Google Gemini to get expert feedback on your API responses, including status codes, headers, and body structure.
Connection Manager: A central hub to perform CRUD operations on various service connections (PostgreSQL, MongoDB, Redis, Milvus).
Integrated Connection Testing: Securely test database connections via your own configurable backend endpoint.
Rich Response Viewer: View formatted and syntax-highlighted JSON responses, raw headers, response time, and size.
Request History: A persistent panel saves your recent requests for easy re-use.
Modern & Responsive UI: A beautiful dark-themed interface built with Tailwind CSS that works seamlessly on all screen sizes.
Zero Installation Frontend: Runs directly in the browser with no complex setup required.
🛠️ Tech Stack
Frontend: React 19, TypeScript, Tailwind CSS
AI Integration: Google Gemini API (@google/genai)
Backend (Required for Connection Testing): Python with FastAPI
🚀 Getting Started: Local Setup
To run this project locally, you'll need to set up two main components:
The Frontend: The UI itself, which runs in your browser.
The Backend: A simple FastAPI server, which is required for the "Test Connection" feature to work.
Prerequisites
Git
Node.js (v18 or later)
Python (v3.8 or later)
A Google Gemini API Key: Get one from Google AI Studio.
1. Clone the Repository
First, clone the project from your GitHub repository to your local machine.
code
Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
2. Configure the Gemini API Key
The frontend needs your Gemini API key to analyze responses. The application is configured to read this from a specific environment variable. This setup is typically handled by the hosting environment, so you do not need to create a .env file. Ensure the process.env.API_KEY variable is available in your deployment context.
3. Set up the FastAPI Backend (for Connection Testing)
The Connection Manager's "Test" button sends a request to a backend endpoint that you control. Here’s how to set up a minimal server.
a. Create Project Files:
Inside your project folder, create a new directory for your backend, e.g., backend. In that directory, create two files: main.py and requirements.txt.
backend/requirements.txt:
code
Txt
fastapi
uvicorn[standard]
backend/main.py:
code
Python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Extra
from typing import Any, Dict

# This is a placeholder for your actual connection logic
# In a real app, you would import libraries like psycopg2, pymongo, etc.

app = FastAPI(
    title="API Test Bench Connection Tester",
    description="A backend service to verify database connection details.",
    version="1.0.0",
)

# --- IMPORTANT: Add CORS Middleware ---
# This allows the frontend UI to communicate with this backend server.
origins = [
    "*",  # For development, allow all. For production, restrict to your frontend's domain.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionDetails(BaseModel, extra=Extra.allow):
    """A flexible model to accept any connection details from the frontend."""
    id: str
    name: str
    type: str
    details: Dict[str, Any]


@app.post("/test-connection")
async def test_connection(connection: ConnectionDetails):
    """
    Receives connection details and simulates a connection test.
    ---
    In a real-world scenario, you would add logic here to actually
    connect to PostgreSQL, MongoDB, Redis, etc., based on `connection.type`.
    """
    print(f"Received request to test connection: {connection.name} ({connection.type})")
    print(f"Details: {connection.details}")

    # **Placeholder Logic**: Replace this with actual connection tests.
    try:
        if connection.name and connection.type:
            # Simulate a successful connection
            return {"message": f"Successfully connected to {connection.name}!"}
        else:
            # Simulate a failure
            raise ValueError("Connection name or type is missing.")
    except Exception as e:
        # If your actual connection logic fails, raise an HTTPException
        raise HTTPException(
            status_code=400,
            detail=f"Connection failed for '{connection.name}': {str(e)}"
        )


@app.get("/")
def read_root():
    return {"message": "Connection test server is running."}
b. Install Dependencies and Run:
Open a terminal, navigate into the backend directory, and run the following commands:
code
Bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate it
# On Windows:
# .\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload
Your backend is now running at http://localhost:8000. The frontend's default test endpoint is already configured to use this address.
4. Running the Frontend
The frontend consists of static HTML, CSS, and JS files that can be served by any simple web server.
The Easiest Method (using npx serve):
Open a new terminal in the root directory of the project.
Run the following command:
code
Bash
npx serve
The terminal will output a URL (usually http://localhost:3000). Open this URL in your browser to use the application.
📖 Local Development Guides
Using IntelliJ IDEA Ultimate
Open the Project: Select File > Open... and choose the root folder of the cloned repository.
Run the Backend:
Find the main.py file in the backend directory.
IntelliJ should prompt you to configure a Python interpreter. Choose the one inside the venv folder you created earlier.
Right-click inside the main.py file and select Run 'main'. This may require you to create a run configuration for Uvicorn.
Alternatively, open the built-in Terminal (View > Tool Windows > Terminal) and run the uvicorn main:app --reload command from the backend directory.
Run the Frontend:
Open the Terminal tool window.
Run npx serve from the project's root directory.
Click the link (http://localhost:3000) provided in the terminal to open the app.
Using Visual Studio Code
Open the Project: Select File > Open Folder... and choose the root folder of the cloned repository.
Run the Backend:
Open a new Integrated Terminal (Terminal > New Terminal or `Ctrl+``).
Navigate to the backend directory: cd backend.
Activate the virtual environment and run the server:
code
Bash
source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
uvicorn main:app --reload
Run the Frontend:
Open another Integrated Terminal (+ icon in the terminal panel).
In this new terminal (which should be at the project root), run the server:
code
Bash
npx serve
Ctrl+Click the link (http://localhost:3000) in the terminal to open the app.
🤝 Contributing
Contributions are welcome! If you have suggestions for improvements, please feel free to fork the repository, create a new branch, and submit a pull request.
Fork the repository.
Create your feature branch (git checkout -b feature/AmazingFeature).
Commit your changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.
📜 License
This project is distributed under the MIT License. See the LICENSE file for more information.
🙏 Acknowledgements
React
Tailwind CSS
Google Gemini API
Icons by Feather
