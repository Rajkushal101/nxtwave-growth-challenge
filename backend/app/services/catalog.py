"""Project Catalog containing 17 realistic 60-minute AI projects for engineering students."""

from typing import List, Dict, Any

PROJECT_CATALOG: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # 1. AI / ML
    # -------------------------------------------------------------
    {
        "id": "ai-study-assistant",
        "name": "AI Personal Study Assistant",
        "category": "AI / Machine Learning",
        "description": "An interactive AI-powered study buddy that ingests lecture notes or textbook chapters, generates instant conceptual summaries, and quizzes you with adaptive flashcards.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Streamlit", "Gemini API"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2],
        "suitable_branches": ["All", "Computer Science / CSE", "Information Technology / IT", "Electronics / ECE", "Electrical / EEE", "Mechanical", "Civil", "Other"],
        "primary_interests": ["AI / Machine Learning", "Productivity"],
        "goals": ["Explore AI", "Learn by building"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A clean web interface where you paste your syllabus or notes. The AI parses the text, extracts key definitions, creates an interactive 5-question quiz, and grades your answers with constructive explanations.",
        "learning_outcomes": [
            "Prompt engineering with system instructions",
            "Connecting Python to modern Generative AI APIs",
            "Building instant web interfaces using Streamlit",
            "Handling user input and parsing structured responses"
        ],
        "portfolio_value": "High",
        "career_relevance": "Demonstrates practical API integration and full-stack prototyping basics, perfect for 1st/2nd year GitHub portfolios.",
        "why_it_matches_template": "Because you are a {year} student in {branch} with {level} coding skills looking to {goal}, this project gives you an immediate win without wrestling with complex neural net math."
    },
    {
        "id": "ai-resume-analyzer",
        "name": "AI Resume & ATS Matcher",
        "category": "AI / Machine Learning",
        "description": "An automated resume evaluator that scans your PDF resume against target job descriptions, scores ATS compatibility, and pinpoints missing technical keywords.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "PDFPlumber", "Gemini API", "Streamlit"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "Electronics / ECE", "All"],
        "primary_interests": ["AI / Machine Learning", "Productivity"],
        "goals": ["Prepare for placements/career", "Build a portfolio"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A dual-input tool that extracts raw text from PDF resumes, tokenizes job descriptions, runs semantic similarity comparisons, and outputs a concrete improvement checklist with match percentage.",
        "learning_outcomes": [
            "Document parsing and text extraction in Python",
            "Semantic similarity and keyword extraction",
            "Structured JSON schema outputs from LLMs",
            "Deploying a career tool you can actually use for placement season"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Top-tier conversation starter in placement interviews; directly addresses real-world HR recruitment automation.",
        "why_it_matches_template": "Because you are a {year} {branch} student preparing for {goal}, this delivers an immediate competitive advantage for campus placement rounds."
    },
    {
        "id": "ai-code-explainer",
        "name": "AI Code Reviewer & Bug Explainer",
        "category": "AI / Machine Learning",
        "description": "A developer productivity utility that reads code snippets in Python, C++, or Java, explains time complexity, and suggests idiomatic refactoring.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Gemini API", "FastAPI / Gradio"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "All"],
        "primary_interests": ["AI / Machine Learning", "Automation", "Web Development"],
        "goals": ["Learn by building", "Build a portfolio"],
        "preferred_tech": ["Python", "JavaScript", "Java", "No preference"],
        "what_you_will_build": "A syntax-highlighted code inspector that highlights syntax bugs, calculates Big-O algorithmic complexity, and proposes clean optimized diffs.",
        "learning_outcomes": [
            "Code tokenization and prompt design for AST understanding",
            "Building responsive developer tools",
            "Markdown rendering with syntax highlighting",
            "Benchmarking LLM code refactoring reliability"
        ],
        "portfolio_value": "High",
        "career_relevance": "Shows deep software craftsmanship and familiarity with modern AI pair-programming pipelines.",
        "why_it_matches_template": "Because you are a {year} student in {branch} focusing on {interest}, this sharpens your coding fundamentals while delivering an AI project you can use daily."
    },
    {
        "id": "ai-sentiment-analyzer",
        "name": "AI Social Sentiment & Brand Analyzer",
        "category": "AI / Machine Learning",
        "description": "Scrapes and analyzes customer feedback or social comments to detect user emotion, polarity, and key product pain points.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "TextBlob", "Gemini API", "Pandas"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2, 3],
        "suitable_branches": ["All", "Computer Science / CSE", "Information Technology / IT"],
        "primary_interests": ["AI / Machine Learning", "Data / Analytics"],
        "goals": ["Explore AI", "Learn by building"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A dashboard where you upload a CSV of comments or product reviews, categorize them into positive/neutral/negative, and extract the top 3 requested feature improvements.",
        "learning_outcomes": [
            "Natural Language Processing fundamentals",
            "Batch processing tabular data with Pandas",
            "Visualizing sentiment distributions with charts",
            "Zero-shot classification techniques"
        ],
        "portfolio_value": "High",
        "career_relevance": "Appeals directly to data science, marketing tech, and product analyst interview tracks.",
        "why_it_matches_template": "Because you are in {year} focusing on {interest} and want to {goal}, this introduces practical NLP without heavy math overhead."
    },
    {
        "id": "ai-multimodal-classifier",
        "name": "Multimodal AI Object & Defect Inspector",
        "category": "AI / Machine Learning",
        "description": "Upload any image or webcam capture to classify objects, detect physical defects, and generate instant audio-visual descriptions.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Gemini Vision API", "OpenCV", "Streamlit"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["Computer Science / CSE", "Electronics / ECE", "Mechanical", "All"],
        "primary_interests": ["AI / Machine Learning", "Automation"],
        "goals": ["Build a portfolio", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A computer-vision web app that accepts uploaded photos, identifies visual anomalies, draws bounding boxes, and generates technical damage inspection reports.",
        "learning_outcomes": [
            "Multimodal image ingestion with AI APIs",
            "Image preprocessing and tensor representations",
            "Building interactive camera widgets in Streamlit",
            "Industrial QA automation principles"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Demonstrates cutting-edge multimodal vision skills, highly valued in autonomous systems and industrial IoT.",
        "why_it_matches_template": "Because you are a {year} {branch} student with {level} experience aiming to {goal}, this gives you a visually stunning project to demo live."
    },

    # -------------------------------------------------------------
    # 2. Cybersecurity
    # -------------------------------------------------------------
    {
        "id": "ai-phishing-detector",
        "name": "AI Phishing & Malicious URL Detector",
        "category": "Cybersecurity",
        "description": "An intelligent security scanner that inspects suspicious email texts, SMS messages, and domain redirects to flag social engineering threats in real-time.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Scikit-Learn", "Gemini API", "Streamlit"],
        "required_skill_level": ["Beginner", "Intermediate", "Advanced"],
        "suitable_years": [1, 2, 3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "Electronics / ECE", "All"],
        "primary_interests": ["Cybersecurity", "AI / Machine Learning"],
        "goals": ["Build a portfolio", "Learn by building", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A security console where users paste an email message or link. The app extracts URL heuristics (typosquatting, IP masking), runs NLP heuristics on urgency triggers, and outputs a threat threat score from 0–100 with defense tips.",
        "learning_outcomes": [
            "Heuristic feature extraction from text and URLs",
            "Combining rule-based security filters with AI threat reasoning",
            "Cybersecurity threat modeling for social engineering",
            "Creating intuitive threat indicators and risk gauges"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "High-demand security domain; shows recruiters you understand both practical cyber defense and AI.",
        "why_it_matches_template": "Because you are a {year} student in {branch} interested in {interest}, this provides an impactful, defense-oriented project for your portfolio."
    },
    {
        "id": "ai-password-auditor",
        "name": "AI Password & Credential Auditor",
        "category": "Cybersecurity",
        "description": "Analyzes password entropy, estimates cracking time against dictionary/GPU attacks, and provides AI-generated memorable passphrase recommendations.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Zxcvbn", "Gemini API", "Streamlit"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2],
        "suitable_branches": ["All", "Computer Science / CSE", "Information Technology / IT"],
        "primary_interests": ["Cybersecurity", "Productivity"],
        "goals": ["Explore AI", "Learn by building"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A client-side security meter that evaluates password strength in real-time, explains specific vulnerabilities (e.g. repeated patterns, leetspeak), and generates cryptographically sound mnemonics.",
        "learning_outcomes": [
            "Information entropy calculation and password security basics",
            "Safe client-side evaluation without storing credentials",
            "Prompt engineering for secure credential guidelines",
            "Real-time UI reactive state management"
        ],
        "portfolio_value": "Medium-High",
        "career_relevance": "Excellent introductory cybersecurity project proving foundational security hygiene and user education.",
        "why_it_matches_template": "Because you are a {year} {branch} student with {level} background, this lets you ship a working security tool in under an hour."
    },
    {
        "id": "ai-security-log-analyzer",
        "name": "AI Security Log & Incident Explainer",
        "category": "Cybersecurity",
        "description": "Parses complex server logs (Apache, Nginx, or firewall events), detects suspicious brute-force attempts, and writes an executive incident response brief.",
        "difficulty": "Advanced",
        "difficulty_stars": 4,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Regex", "Gemini API", "Pandas"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "All"],
        "primary_interests": ["Cybersecurity", "Automation", "Data / Analytics"],
        "goals": ["Prepare for placements/career", "Build a portfolio"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "An automated SOC (Security Operations Center) triaging tool that ingests raw server logs, flags unauthorized access spikes, and synthesizes a mitigation summary for security leads.",
        "learning_outcomes": [
            "Log pattern recognition and regex parsing",
            "Anomaly detection in timestamped connection events",
            "Generating incident response reports via LLM orchestration",
            "Data aggregation and forensic analysis fundamentals"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Direct match for Cloud Security, SOC Analyst, and DevOps roles.",
        "why_it_matches_template": "Because you are a {year} student looking for {goal} in {interest}, this demonstrates real-world enterprise infrastructure defense skills."
    },

    # -------------------------------------------------------------
    # 3. Data / Analytics
    # -------------------------------------------------------------
    {
        "id": "ai-expense-analyzer",
        "name": "AI Student Expense & Budget Coach",
        "category": "Data / Analytics",
        "description": "Upload UPI transaction statements or receipt photos to automatically categorize spending, detect wasteful habits, and generate a personalized savings forecast.",
        "difficulty": "Intermediate",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Pandas", "Gemini API", "Plotly"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2, 3],
        "suitable_branches": ["All", "Computer Science / CSE", "Electrical / EEE", "Mechanical"],
        "primary_interests": ["Data / Analytics", "Productivity"],
        "goals": ["Learn by building", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A personal finance web app that parses raw bank/UPI CSV exports, groups expenses (Food, Travel, Subscriptions), generates interactive pie and bar charts, and produces a budget action plan.",
        "learning_outcomes": [
            "Tabular data wrangling and cleaning with Pandas",
            "Interactive financial visualization using Plotly",
            "Zero-shot categorical classification via LLMs",
            "Real-world data modeling for consumer fintech"
        ],
        "portfolio_value": "High",
        "career_relevance": "Great demonstration of end-to-end data analytics and business intelligence prototyping.",
        "why_it_matches_template": "Because you are in {year} studying {branch} and want to {goal}, this tackles a relatable everyday challenge using data science."
    },
    {
        "id": "ai-performance-forecaster",
        "name": "AI Academic Performance & Exam Forecaster",
        "category": "Data / Analytics",
        "description": "Predicts semester GPA trends and identifies weak subject areas based on past internal marks, study hours, and historical course difficulty.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Scikit-Learn", "Matplotlib", "Gemini API"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["All", "Computer Science / CSE", "Information Technology / IT"],
        "primary_interests": ["Data / Analytics", "AI / Machine Learning"],
        "goals": ["Build a portfolio", "Learn by building"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A regression model that factors in attendance, midterm scores, and credit weightage to predict final grade bounds, accompanied by an AI study timetable.",
        "learning_outcomes": [
            "Linear regression and tree-based predictive modeling",
            "Feature scaling and model evaluation metrics (RMSE, R2)",
            "Dynamic chart rendering and actionable AI coaching",
            "Data storytelling for presentations"
        ],
        "portfolio_value": "High",
        "career_relevance": "Validates core predictive machine learning and tabular modeling expertise.",
        "why_it_matches_template": "Because you are a {year} {branch} student with {level} coding proficiency aiming to {goal}, this delivers solid quantitative ML credentials."
    },
    {
        "id": "ai-market-trend-generator",
        "name": "AI Market Insights & Trend Forecaster",
        "category": "Data / Analytics",
        "description": "Analyzes live tech news feeds and GitHub trending repositories to highlight upcoming frameworks and skill demands for engineering grads.",
        "difficulty": "Advanced",
        "difficulty_stars": 4,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "BeautifulSoup", "Gemini API", "Pandas"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "All"],
        "primary_interests": ["Data / Analytics", "Web Development"],
        "goals": ["Prepare for placements/career", "Build a portfolio"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "An automated scraper and synthesizer that aggregates tech headlines, extracts keyword trajectories, and compiles a weekly tech intelligence memo.",
        "learning_outcomes": [
            "Web scraping ethical best practices and rate limiting",
            "Text clustering and keyword trend tracking",
            "Synthesizing structured analytics reports from unstructured streams",
            "Building scheduled automation scripts"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Highlights independent initiative and market research abilities, highly prized by product-driven startups.",
        "why_it_matches_template": "Because you are a {year} student in {branch} preparing for {goal}, this shows prospective employers you track tech industry velocity."
    },

    # -------------------------------------------------------------
    # 4. Productivity
    # -------------------------------------------------------------
    {
        "id": "ai-flashcard-generator",
        "name": "AI Lecture Notes to Flashcard Generator",
        "category": "Productivity",
        "description": "Transforms messy voice recordings, PDF lecture slides, or rough notes into spaced-repetition Anki-compatible flashcards.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Gemini API", "Streamlit", "GenAnki"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2, 3],
        "suitable_branches": ["All", "Computer Science / CSE", "Electronics / ECE", "Mechanical", "Civil"],
        "primary_interests": ["Productivity", "AI / Machine Learning"],
        "goals": ["Explore AI", "Learn by building", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A productivity web application that takes raw lecture bullet points and automatically outputs active-recall question-answer pairs exported to standard CSV/Anki formats.",
        "learning_outcomes": [
            "Prompt engineering for concise question-answer extraction",
            "Handling file export and downloads in web apps",
            "Spaced repetition algorithms and active recall UX",
            "Fast prototyping with interactive Python frameworks"
        ],
        "portfolio_value": "Medium-High",
        "career_relevance": "Demonstrates product mindset: solving real problems faced by thousands of fellow college students.",
        "why_it_matches_template": "Because you are in {year} studying {branch} and want to {goal}, this is a high-utility project you and your batchmates will immediately use."
    },
    {
        "id": "ai-task-planner",
        "name": "Smart AI Project & Exam Task Planner",
        "category": "Productivity",
        "description": "Breaks down massive semester projects or hackathon ideas into bite-sized 45-minute daily action sprints with calendar integration.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Gemini API", "Streamlit"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2, 3, 4],
        "suitable_branches": ["All"],
        "primary_interests": ["Productivity", "Automation"],
        "goals": ["Explore AI", "Learn by building"],
        "preferred_tech": ["Python", "JavaScript", "No preference"],
        "what_you_will_build": "A goal planner where you input a project title (e.g. 'Build an E-commerce App') and deadline. The AI estimates subtask hours, orders prerequisites, and creates an interactive checklist.",
        "learning_outcomes": [
            "Deconstructing complex workflows using LLM chains",
            "Building interactive stateful checklists in Python",
            "JSON parsing and dynamic UI rendering",
            "Agile task estimation fundamentals"
        ],
        "portfolio_value": "Medium",
        "career_relevance": "Shows solid engineering project management and problem decomposition thinking.",
        "why_it_matches_template": "Because you are a {year} student looking to {goal}, this project turns fuzzy ideas into crisp, executable roadmaps."
    },

    # -------------------------------------------------------------
    # 5. Web / Automation & Hardware Integrations
    # -------------------------------------------------------------
    {
        "id": "ai-college-faq-bot",
        "name": "AI Campus FAQ & Support Assistant",
        "category": "Web / Automation",
        "description": "A smart 24/7 chatbot that answers college questions regarding library timings, exam dates, hostel rules, and syllabus details using RAG search.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "ChromaDB / FAISS", "Gemini API", "FastAPI"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["Computer Science / CSE", "Information Technology / IT", "All"],
        "primary_interests": ["Web Development", "AI / Machine Learning", "Automation"],
        "goals": ["Build a portfolio", "Solve a practical problem"],
        "preferred_tech": ["Python", "JavaScript", "No preference"],
        "what_you_will_build": "A retrieval-augmented generation (RAG) assistant that indexes your college handbook, retrieves the exact official policy, and answers queries with verified citations.",
        "learning_outcomes": [
            "Vector databases (Chroma/FAISS) and text embeddings",
            "Retrieval-Augmented Generation (RAG) architecture",
            "Building REST APIs with FastAPI",
            "Prompt grounding to eliminate AI hallucinations"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "RAG is the #1 enterprise Generative AI architecture in modern tech hiring today.",
        "why_it_matches_template": "Because you are a {year} student in {branch} looking to {goal}, this gives you hands-on mastery over vector search and enterprise RAG."
    },
    {
        "id": "ai-iot-anomaly-detector",
        "name": "AI IoT Hardware Sensor Anomaly Detector",
        "category": "Web / Automation",
        "description": "Monitors simulated Arduino/ESP32 sensor telemetry (temperature, vibration, voltage) to predict motor failure and hardware breakdowns.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Numpy", "Isolation Forest", "Streamlit"],
        "required_skill_level": ["Intermediate", "Advanced"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["Electronics / ECE", "Electrical / EEE", "Mechanical", "Civil"],
        "primary_interests": ["Automation", "Data / Analytics", "AI / Machine Learning"],
        "goals": ["Build a portfolio", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "An industrial dashboard that receives simulated hardware sensor telemetry streams, flags anomalous spikes using unsupervised anomaly detection, and triggers preventative alerts.",
        "learning_outcomes": [
            "Time-series signal processing and rolling statistics",
            "Unsupervised machine learning with Isolation Forests",
            "Real-time sensor data visualization",
            "Predictive maintenance architecture for core engineering"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Direct bridge between electronics/mechanical engineering and AI software skills.",
        "why_it_matches_template": "Because you are a {year} student in {branch} looking to {goal}, this proves you can blend core engineering hardware with modern AI."
    },
    {
        "id": "ai-civil-cad-summarizer",
        "name": "AI Construction & Structural Spec Analyzer",
        "category": "Web / Automation",
        "description": "Extracts bill-of-materials and structural safety specifications from architectural notes and estimates compliance with building codes.",
        "difficulty": "Intermediate",
        "difficulty_stars": 3,
        "estimated_time": "~60 minutes",
        "technologies": ["Python", "Gemini API", "Pandas", "Streamlit"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [2, 3, 4],
        "suitable_branches": ["Civil", "Mechanical", "Other"],
        "primary_interests": ["Automation", "Productivity", "AI / Machine Learning"],
        "goals": ["Explore AI", "Learn by building", "Solve a practical problem"],
        "preferred_tech": ["Python", "No preference"],
        "what_you_will_build": "A specialized technical assistant that ingests construction project requirements, organizes concrete/steel material estimates, and highlights safety regulation red flags.",
        "learning_outcomes": [
            "Domain-specific document parsing with AI",
            "Tabular extraction from unformatted engineering specs",
            "Automated compliance and safety checklist generation",
            "Building customized domain AI tools"
        ],
        "portfolio_value": "Very High",
        "career_relevance": "Rare, standout project showing how AI transforms traditional civil and infrastructure engineering.",
        "why_it_matches_template": "Because you are a {year} {branch} student looking to {goal}, this shows high innovation in your core engineering discipline."
    },
    {
        "id": "ai-portfolio-builder",
        "name": "AI Personal Developer Portfolio Generator",
        "category": "Web / Automation",
        "description": "Takes your raw GitHub repository links and bio, and automatically drafts an elegant, responsive web portfolio highlighting your top projects.",
        "difficulty": "Beginner",
        "difficulty_stars": 2,
        "estimated_time": "~60 minutes",
        "technologies": ["HTML/CSS", "JavaScript", "Gemini API", "GitHub API"],
        "required_skill_level": ["Beginner", "Intermediate"],
        "suitable_years": [1, 2, 3, 4],
        "suitable_branches": ["All"],
        "primary_interests": ["Web Development", "Productivity"],
        "goals": ["Build a portfolio", "Prepare for placements/career"],
        "preferred_tech": ["JavaScript", "Python", "No preference"],
        "what_you_will_build": "A portfolio generation tool that queries GitHub public APIs, summarizes repository READMEs into high-impact recruiter bullets, and generates a downloadable single-page website.",
        "learning_outcomes": [
            "Calling third-party developer APIs (GitHub REST API)",
            "Dynamic HTML/CSS generation with templating",
            "Recruiter-focused project storytelling",
            "Instant web deployment with GitHub Pages"
        ],
        "portfolio_value": "High",
        "career_relevance": "Immediate utility for every internship application and campus drive.",
        "why_it_matches_template": "Because you are a {year} {branch} student focused on {goal}, this gives you both a functioning project and a live portfolio to showcase it."
    }
]

def get_project_by_id(project_id: str) -> Dict[str, Any]:
    """Retrieve a single project by its unique ID."""
    for p in PROJECT_CATALOG:
        if p["id"] == project_id:
            return p
    return PROJECT_CATALOG[0]  # Fallback to first project
