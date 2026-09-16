import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "../components/css/Quizzes.css"


const Quizzes = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading,setLoading] = useState(false);

  const generateQuiz = async()=>{
    setLoading(true);
    try{
      const res = await fetch("http://localhost:8000/quiz",
        {
          method: "POST",
        }
      )
      const data = await res.json();
      setQuiz(data);
    }
    catch(error){
      console.error(error);
      setQuiz("Failed to generate quiz.");
    }
    finally{
      setLoading(false);
    }
  }



  return (
    <div className="quiz-page">

      <h1>
        Quiz Generator 📝
      </h1>


      <p>
        Test your knowledge from your uploaded notes.
      </p>


      <button
        onClick={generateQuiz}
        disabled={loading}
      >
        {loading ? "Creating Quiz..." : "Generate Quiz"}
      </button>
      {quiz && (
        <>   <div className="quiz-card">

          <h2>
            Questions
          </h2>
          <ReactMarkdown>
            {quiz.questions}
          </ReactMarkdown>

        </div>

        <div className="answers-card">

          <h2>
            Answers
          </h2>


          <ReactMarkdown>
            {quiz.answers}
          </ReactMarkdown>
        </div>


        </>

      )}


    </div>
  );
};


export default Quizzes;