import WebSocket from "ws";

export function initSideband(callId: string, interviewId: string) {
  const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1";
  const ws = new WebSocket(url, {
    headers: {
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      "OpenAI-Safety-Identifier": "hashed-user-id",
    },
  });

  ws.on("open", function open() {
    console.log("Connected to server.");

    // Send client events over the WebSocket once connected
    ws.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          instructions:
            "You are supposed to interview the candidate and ask them questions about their GitHub profile. You should ask questions about their projects, contributions, and any other relevant information you can find on their GitHub profile. The goal is to assess the candidate's skills and experience based on their GitHub activity. only ask 3 questions also use only english language ",
        },
      }),
    );
  });

  ws.on("message", function incoming(message) {
  const parsedMessage= (JSON.parse(message.toString()));
  if(parsedMessage.type === "response.done"){
    console.log(parsedMessage);
  }
});
}
