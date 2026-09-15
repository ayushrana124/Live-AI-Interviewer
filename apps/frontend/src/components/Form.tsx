import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../lib/config";
import { useNavigate } from "react-router";

function Form() {
  const [github, setGithub] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit() {
    if (loading) return;

    if (!github.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
        github : github.trim(),
      });
      navigate(`/interview/${response.data.id}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">AI Interview Kickstart</h2>
        <Input
          className="mb-4"
          placeholder="GitHub Profile URL"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
        <Button disabled={loading} onClick={onSubmit}>
          {loading ? "Starting Interview..." : "Start Interview"}
        </Button>
      </div>
    </div>
  );
}

export default Form;
