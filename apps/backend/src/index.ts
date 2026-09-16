import express from "express";
import { PORT } from "./config/config";
import { PreInterviewBody } from "./types/types";
import axios from "axios";
import cors from "cors";
import { scrapeGithub } from "./scraper/github";
import { prisma } from "./db";
import { initSideband } from "./sideband";

const app = express();
app.use(express.json());
app.use(cors());
// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/v1/pre-interview", async (req, res) => {
  const { success, data } = PreInterviewBody.safeParse(req.body);
  console.log(success, data);
  if (!success) {
    return res.status(400).json({ error: "Incorrect body" });
  }

  //Url can be malformed, use SLM here
  const githubUrl = data.github.endsWith("/")
    ? data.github.slice(0, -1)
    : data.github;

  const githubUsername: string = githubUrl.split("/").pop() as string;

  const githubData = await scrapeGithub(githubUsername);
  const interview = await prisma.interview.create({
    data: {
      githubMetadata: JSON.stringify(githubData),
    },
  });

  res.send({ id: interview.id });
});


app.post("/api/v1/session/:interviewId", async (req, res) => {
  const sessionConfig = JSON.stringify({
    type: "realtime",
    model: "gpt-realtime-2.1",
    audio: { output: { voice: "marin" } },
  });

  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  try {
    const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });


    const location = sdpResponse.headers.get("Location");
    if (!location) {
      throw new Error("No Location header in response");
    }
    const callId = location.split("/").pop();
    console.log("callId", callId);


    // Send back the SDP we received from the OpenAI REST API
    const sdp = await sdpResponse.text();

    // initialise websocket
    initSideband(callId!, req.params.interviewId);

    res.send(sdp);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.post("/api/v1/session/user/response/:interviewId", async (req, res) => {
 const {message} = req.body;
 await prisma.message.create({
    data : {
      interviewId : req.params.interviewId,
      type : "User",
      message : message,
    }
 });
});


app.get("/api/v1/result/:intervireID", async (req,res) => {
  const interview = await prisma.interview.findFirst({
    where : {
      id : req.params.intervireID,
    },
    include : {
      conversations : true,
    }
  });

  if (!interview) {
    return res.status(404).json({ error: "Interview not found" });
  }

  if(interview.status == "InProgress"){
    
  }

  res.json({
    score : interview.score,
    feedback : interview.feedback,
    transcript : interview.conversations.map(x => ({
      type: x.type,
      content: x.message,
      createdAt: x.createdAt,
    }))
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
