import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router";
interface Result {
    transcript : { type : "Assistant" | "User", content : string, createdAt : Date }[],
    score : number,
    feedback : string,
}

export const Result = () => {

    const {interviewId} = useParams();

    const [result, setResult] = useState<Result>({
        score : 0,
        feedback : "",
        transcript : [],
    });

    useEffect(() => {
   
        axios.get(`${BACKEND_URL}/api/v1/result/${interviewId}`)
        .then((res) => {
            setResult(res.data);
        })

        let interval = setInterval(() => {
            axios.get(`${BACKEND_URL}/api/v1/result/${interviewId}`)
            .then((res) => {
                setResult(res.data);
            })  
        }, 5000);

        return () => clearInterval(interval);

      
    }, [interviewId])   
    return (
        <>
      Score : {result.score} <br />
      Feedback : {result.feedback} <br />
      Transcript : <br />
      {result.transcript.map((t, index) => (
        <div key={index}>
          <strong>{t.type}:</strong> {t.content} <em>({new Date(t.createdAt).toLocaleString()})</em>
        </div>
      ))}
        </>
    )
}

