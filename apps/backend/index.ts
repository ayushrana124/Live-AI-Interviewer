import express from "express";
import { PORT } from "./src/config/config";
import { PreInterviewBody } from "./src/types/types";
import axios from "axios";

const app = express();
app.use(express.json());


app.post("/api/v1/pre-interview", async (req, res) => {
    const { success, data } = PreInterviewBody.safeParse(req.body);
    
    if(!success){
        return res.status(400).json({ error: "Incorrect body" });
    }

    //Url can be malformed, use SLM here
    const githubUrl = data.github.endsWith("/") ? data.github.slice(0, -1) : data.github;


    const githubUsername = githubUrl.split("/").pop();

    const userRepos = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
    const filterUserRepos = userRepos.data.map((x:any) => {
        desc: x.description,
        name: x.name,
        fullName: x.full_name,
        starCount: x.stargazers_count,
    });

    console.log(filterUserRepos); 



})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})