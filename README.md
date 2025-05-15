# AI Data Agent

An AI-powered data analysis assistant that converts natural language business questions into SQL queries, fetches and processes data from PostgreSQL, and provides insightful explanations with dynamic visualizations. Built with a Node.js backend, React frontend styled with Tailwind CSS, and integrated with GroqCloud’s LLM API.

Link: https://ai-driven-data-analyst.vercel.app/
---

## Features

- Upload CSV datasets to dynamically create and populate PostgreSQL tables  
- Ask complex business questions in natural language  
- AI converts questions into optimized SQL queries based on current database schema  
- AI analyzes query results to generate explanations, summarized tables, and visualization recommendations  
- Supports bar, pie, and line charts rendered dynamically on the frontend  
- Clean, responsive UI built with React and Tailwind CSS  

---

## ScreenShots
For this sample csv data 
```bash
col1,x2,data,datee,x4,amount_,xyz,unkn
123,jon,   USA ,12-13-2022,na,200.5 ,#N/A,??
abc,jane , ,2023/03/04,Val, ,1000,ZZ
NaN,JON,india ,04-05-23,  ,error,-12,?
456,Mike,,2022.12.01,NA,300.99,na,**
789,amy,UK,10/22/21,TBD, 500,123abc,0
NaN,JOHN,Usa ,31-04-2022,None,350.5,,maybe
xyz,joe,usa,,null,,null,x
0.0,,uSa,2020-01-01,yes,999.99,0.01,null
```
![image](https://github.com/user-attachments/assets/55ed8cd3-d6e2-454e-8971-3dc045cd570f)

These are the questions along with the response -

### 1. What is the average value in amount_ for each country in data, excluding errors?
![image](https://github.com/user-attachments/assets/d30c5ba3-55db-4ed2-9c90-646831591dea)
![image](https://github.com/user-attachments/assets/17c96e9b-66c7-417e-b80d-0043970b2e9d)

### 2. Can you show a time trend of transactions based on date and amount?
![image](https://github.com/user-attachments/assets/79d92a1f-2f4d-4803-96b2-e9e8f339c55e)
![image](https://github.com/user-attachments/assets/d7a6a702-8be5-445a-bf71-53697daf76aa)

### 3. Create a pie chart showing the proportion of country's different values of amount out of the total amount.
![image](https://github.com/user-attachments/assets/f84fc42d-5ae1-4bce-9ad4-448783f99d64)
![image](https://github.com/user-attachments/assets/94d86bd0-759a-43f1-8700-5fdcd1450208)

### 4. Can you build a customer segmentation from this data?
![image](https://github.com/user-attachments/assets/0a729571-ba1a-4189-84fb-8f2d75d58eb3)
![image](https://github.com/user-attachments/assets/087126c5-1e7f-42af-90c2-062fa66eb6f6)

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
