import axios from "axios";

export async function scrapeGithub(username : string ){
    const userRepos = await axios.get(`https://api.github.com/users/${username}/repos`);
    
   return userRepos.data.map((repo : any) => ({
           description: repo.description,
              name: repo.name,
              full_name: repo.full_name,
              starCount: repo.stargazers_count,
   }));
};




