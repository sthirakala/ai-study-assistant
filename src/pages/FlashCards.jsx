import { useState } from "react";
import "../components/css/Flashcard.css"



const Flashcards = () => {
  const [flashcard, setFlashcard] = useState([]);
  const [loading,setLoading] = useState(false);
  const [currCard, setCurrCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateFlashcards = async()=>{
    setLoading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/flashcards`,
        {
          method: "POST",
        }
      )
      const data = await res.json();
      setFlashcard(data.flashcards);
      setCurrCard(0);
      setShowAnswer(false);
    }
    catch(error){
      console.error(error);
      setFlashcard("Failed to generate flashcards.");
    }
    finally{
      setLoading(false);
    }
  }



  return (
    <div className="flashcard-page">

      <h1>
        Flashcard Generator 📄
      </h1>


      <p>
        Create Flashcards and check your understanding of your notes.
      </p>


      <button
        onClick={generateFlashcards}
        disabled={loading}
      >
        {loading ? "Creating Flashcards..." : "Generate Flashcards"}
      </button>
      {flashcard.length > 0 && ( 
        <div className="flashcard-section">
             <div className="flashcard"> 
                {!showAnswer ? ( 
                    <div className="flashcard-front"> 
                    <h2> 
                        {flashcard[currCard].front} 
                    </h2> 
                    <button onClick={() => setShowAnswer(true)} > 
                        Show Answer 
                    </button> 
                    </div> 
                    ) : ( 
                    <div className="flashcard-back"> 
                    <h2> 
                        Answer 
                    </h2> 
                    <p> 
                        {flashcard[currCard].back} 
                    </p> 
                    <button onClick={() => setShowAnswer(false)} > 
                        Show Question 
                    </button> </div> )} 
                    </div> 
                    <div className="flashcard-navigation"> 
                        <button onClick={() => { 
                            setCurrCard(currCard - 1); 
                            setShowAnswer(false); 
                        }} 
                        disabled={currCard === 0} 
                    > Previous 
                    </button> 
                    <span> 
                        {currCard + 1} / {flashcard.length} 
                    </span> 
                    <button onClick={() => { 
                        setCurrCard(currCard + 1); setShowAnswer(false); 
                    }} 
                    disabled={currCard === flashcard.length - 1}> 
                    Next </button> </div> </div> )} </div> 
                    ); 
                }; 
export default Flashcards;