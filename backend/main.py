from fastapi import FastAPI,UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from pydantic import BaseModel
import io

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS 
from langchain_core.documents import Document
from langchain_groq import ChatGroq


from dotenv import load_dotenv
import os

load_dotenv()

print("Sentence transformers works")

app = FastAPI()

pdf_text = ""
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstoredb = None

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.3
)





app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "StudyBuddy backend running"
    }


@app.get("/test")
def test():
    return {
        "message": "React connected successfully!"
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    contents = await file.read()

    pdf = PdfReader(io.BytesIO(contents))

    global pdf_text
    pdf_text = ""

    for page in pdf.pages:
        pdf_text += page.extract_text() or ""

    document = Document(page_content = pdf_text)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    pdf_chunks = text_splitter.split_documents([document])

    
    global vectorstoredb
    vectorstoredb = FAISS.from_documents(pdf_chunks, embeddings)



    return {
        "filename": file.filename,
        "pages": len(pdf.pages),
        "text_preview": pdf_text[:500]
    }

class Question(BaseModel):
    question: str
    mode: str = "chat"
    history: list=[]

@app.post("/ask")
async def ask_question(data:Question):
    if vectorstoredb is None:
        return{
            "answer": "Please upload your PDF."
        }
    docs = vectorstoredb.similarity_search(data.question, k=2)
    context = "\n\n".join(doc.page_content for doc in docs)
    conversation = ""

    for msg in data.history:
        conversation += f"""
User: {msg['user']}
StudyBuddy: {msg['ai']}
"""


    prompt = f"""
You are StudyBuddy, a helpful study assistant.

You have access to the previous conversation below.
Use it when the user asks follow-up questions.

Conversation history:
{conversation}


Use ONLY the study material below for factual answers.

Study material:
{context}


Current question:
{data.question}


Rules:
- Be concise.
- Explain concepts clearly.
- Use bullet points when helpful.
- Do not introduce yourself.
- Do not say "Hello".
"""


    response = llm.invoke(prompt)


    return {
        "answer": response.content
    }

@app.post("/quiz")
async def generate_quiz():

    if vectorstoredb is None:
        return {
            "quiz": "Please upload your PDF first.",
            "answers": ""
        }


    docs = vectorstoredb.similarity_search(
        "important concepts definitions key facts",
        k=8,
        fetch_k=20
    )


    context = "\n\n".join(
        doc.page_content for doc in docs
    )


    prompt = f"""
You are StudyBuddy, an AI quiz generator.

Use ONLY the study material below.

Create a quiz with exactly two sections.
- Generate different questions each time.
- Avoid repeating previous questions.
- Test different concepts from the study material.
- Mix question difficulty levels:
  - easy recall
  - understanding
  - application

You MUST follow this format exactly:

===QUESTIONS===

### Question 1
(question text)

- A) option
- B) option
- C) option
- D) option


### Question 2
(question text)

- A) option
- B) option
- C) option
- D) option


(continue until Question 5)


===ANSWERS===

Format answers like this:

### Answer 1
Correct Answer: answer

Explanation:
explanation

### Answer 2
Correct Answer: answer

Explanation:
explanation


(continue until Answer 5)


Rules:
- Create exactly 5 multiple choice questions.
- Do NOT put answers in the QUESTIONS section.
- Do NOT add introductions.
- Do NOT add extra text.
- Always include BOTH sections.

Study Material:

{context}
"""


    response = llm.invoke(prompt)


    quiz_text = response.content

    parts = quiz_text.split("===ANSWERS===")


    questions = parts[0].replace("===QUESTIONS===", "").strip()

    answers = ""

    if len(parts) > 1:
        answers = parts[1].strip()


    return {
        "questions": questions,
        "answers": answers
    }

@app.post("/flashcards")
async def generate_flashcards():

    if vectorstoredb is None:
        return {
            "flashcards": []
        }


    docs = vectorstoredb.similarity_search(
        "important concepts definitions key facts terms",
        k=8,
        fetch_k=20
    )
    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
You are StudyBuddy, an AI flashcard generator.

Use ONLY the study material below.

Create exactly 10 flashcards.

Each flashcard should test an important concept,
definition, term, or key fact.

Format exactly like this:

### Flashcard 1
Front: question or term
Back: answer

### Flashcard 2
Front: question or term
Back: answer

Continue until Flashcard 10.

Rules:
- Create exactly 10 flashcards.
- Cover different concepts.
- Keep answers concise but complete.
- Do not repeat concepts.
- Do not add introductions or extra text.
- Use ONLY the study material.

Study Material:

{context}
"""

    response = llm.invoke(prompt)

    flashcards_text = response.content

    flashcards = []

    cards = flashcards_text.split("### Flashcard")

    for card in cards[1:]:
        lines = card.strip().splitlines()

        front = ""
        back = ""

        for line in lines:
            if line.startswith("Front:"):
                front = line.replace("Front:", "").strip()

            elif line.startswith("Back:"):
                back = line.replace("Back:", "").strip()

        if front and back:
            flashcards.append({
                "front": front,
                "back": back
            })

    return {
        "flashcards": flashcards
    }

