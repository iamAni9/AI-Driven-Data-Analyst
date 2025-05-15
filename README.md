# AI Data Agent

An AI-powered data analysis assistant that converts natural language business questions into SQL queries, fetches and processes data from PostgreSQL, and provides insightful explanations with dynamic visualizations. Built with a Node.js backend, React frontend styled with Tailwind CSS, and integrated with GroqCloud’s LLM API.

---

## Features

- Upload CSV datasets to dynamically create and populate PostgreSQL tables  
- Ask complex business questions in natural language  
- AI converts questions into optimized SQL queries based on current database schema  
- AI analyzes query results to generate explanations, summarized tables, and visualization recommendations  
- Supports bar, pie, and line charts rendered dynamically on the frontend  
- Clean, responsive UI built with React and Tailwind CSS  

---

## Tech Stack

- Backend: Node.js, Express, PostgreSQL, GroqCloud API for LLM  
- Frontend: React, Tailwind CSS, Recharts for charting  
- Deployment ready for cloud hosting  

---

## Getting Started

### Prerequisites

- Node.js (v16+) and npm  
- PostgreSQL database running locally or remotely  
- GroqCloud API key (free tier available)  

### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
2. Configure environment variables:
   
   Create a .env file in /server directory with the following content:
   ```bash
   GROQ_API_KEY=your_groqcloud_api_key_here
   DATABASE_URL=postgres://user:password@localhost:5432/yourdb
   ```
3. Install dependencies:

   ```bash
   cd server
   npm install
    
   cd ../client
   npm install
   ```
4. Start the backend server:

   ```bash
   cd ../server
   npm start
   ```
5. Start the frontend development server:

   ```bash
   cd ../client
   npm start
   ```
6. Open your browser and go to http://localhost:3000 to use the app.

## Usage

* Upload your CSV dataset via the "Dataset Upload" form
* Ask natural language business questions in the input box
* View AI-generated explanations, tables, and interactive charts

## Contributing

Feel free to open issues or submit pull requests for improvements.
