import express from "express";
import { PORT } from "./config/config";
import { PreInterviewBody } from "./types/types";
import axios from "axios";
import cors from "cors";
import { scrapeGithub } from "./scraper/github";
import {prisma} from "./db";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.post("/api/v1/pre-interview", async (req, res) => {
    const { success, data } = PreInterviewBody.safeParse(req.body);
    console.log(success, data);
    if(!success){
        return res.status(400).json({ error: "Incorrect body" });
    }
    
    //Url can be malformed, use SLM here
    const githubUrl = data.github.endsWith("/") ? data.github.slice(0, -1) : data.github;


    const githubUsername : string = githubUrl.split("/").pop() as string;

    const githubData = await scrapeGithub(githubUsername);
    const interview = await prisma.interview.create({
        data : {
            githubMetadata : JSON.stringify(githubData),
        }
    })
    
    res.send({ id : interview.id });

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})