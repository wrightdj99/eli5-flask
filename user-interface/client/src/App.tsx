import './App.css'
import { useState } from 'react';
import ReactMarkdown from "react-markdown"
import { Paper, ListItem, ListItemText, List, TextField, Typography, RadioGroup, Radio, FormControlLabel, FormLabel } from '@mui/material'
import axios from 'axios';
import type { ChatMessage } from "./lib/types/ChatMessage";


function App() {
  const [request, setRequest] = useState<string>("")
  const [messages, addMessages] = useState<ChatMessage[]>([])
  const [age, setAge] = useState<number>(5)
  const [specificAge, setSpecificAge] = useState<boolean>(false)
  const [ageRadioValue, setAgeRadioValue] = useState("false"); // Controls selected radio button

  function handleSubmit(request: string) {
    const userMessage: ChatMessage = { role: "USER", message: request }
    addMessages(prev => [...prev, userMessage])
    const jsonMessages = [...messages, userMessage];
    axios.post("http://127.0.0.1:5000/submit", {
      "request": request,
      "age": age,
      "history": jsonMessages ?? []
    }).then(res => {
        const botMessage: ChatMessage = { role: "CHATBOT", message: res.data.response };
        addMessages(prev => [...prev, botMessage]);
    }).catch(error => {
        console.error(error);
    });
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (request.trim()) {
        handleSubmit(request);
        setRequest("");
      }
    }
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(Number(e.target.value))
  }

  const handleSpecificAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "true";
    setSpecificAge(value);
    setAgeRadioValue(e.target.value);
  }
  return (
    <div>
      <Typography variant='h3'>Explain Like I'm 5 Client</Typography>
        <Paper sx={{ minHeight: 300, maxHeight: 500, overflowY: 'auto', p: 2, mb: 2}}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem className="chat-message" key={idx}>
                <ListItemText
                  primary={ <ReactMarkdown>{msg.message}</ReactMarkdown> }
                  secondary={ msg.role === "USER" ? "Client" : "Chatbot" }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      <div className='main-form'>
        <FormLabel id="specific-age-radio-label">Would you like to enter a specific age for a more accurate response?</FormLabel>
        <RadioGroup 
          defaultValue={false}
          name='age-radio'
          aria-label='test'
          value={ageRadioValue}
          onChange={handleSpecificAge}
          aria-labelledby='age-radio-button'>
            <FormControlLabel control={<Radio/>} value={true} label="Yes"/>
            <FormControlLabel control={<Radio/>} value={false} label="No"/>
        </RadioGroup>
        {specificAge && (
          <TextField
          id='requester-age'
          label="Requester Age"
          value={age}
          onChange={handleAgeChange}
          type='number'
          />
        )}
        <TextField
        id='request-content'
        label='Request'
        placeholder='Ask anything'
        multiline
        variant='filled'
        value={request}
        rows={5}
        onChange={(e) => setRequest(e.target.value)}
        onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default App
