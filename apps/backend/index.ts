import express from "express";
import { PORT } from "./src/config/config";
import { PreInterviewBody } from "./src/types/types";
import axios from "axios";
import cors from "cors";
import { scrapeGithub } from "./src/scraper/github";

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

    const filteredRepos = await scrapeGithub(githubUsername);
    console.log(filteredRepos);
    
    res.send({ repos: filteredRepos });

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})