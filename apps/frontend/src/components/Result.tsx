import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface Result {
    transcript: {
        type: "Assistant" | "User";
        content: string;
        createdAt: Date;
    }[];
    score: number;
    feedback: string;
    status: "Done" | "InProgress" | "Pre";
}

export const Result = () => {
    const { interviewId } = useParams();

    const [result, setResult] = useState<Result>({
        score: 0,
        feedback: "",
        transcript: [],
        status: "Pre",
    });

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/result/${interviewId}`)
            .then((res) => {
                setResult(res.data);
            });

        const interval = setInterval(() => {
            axios
                .get(`${BACKEND_URL}/api/v1/result/${interviewId}`)
                .then((res) => {
                    setResult(res.data);
                    if(res.data.status === "Done"){
                        clearInterval(interval);
                    }
                });
        }, 5000);

        return () => clearInterval(interval);
    }, [interviewId]);

    return (
        result.status === "Done" && (
            <>
                Score : {result.score} <br />
                Feedback : {result.feedback} <br />
                Transcript : <br />

                {result.transcript.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((t, index) => (
                    <div key={index}>
                        <strong>{t.type}:</strong> {t.content}{" "}
                        <em>
                            ({new Date(t.createdAt).toLocaleString()})
                        </em>
                    </div>
                ))}
            </>
        )
    );
};