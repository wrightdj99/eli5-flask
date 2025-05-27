import { List, TextField, Typography } from '@mui/material';
import './App.css'
import { useState } from 'react';
import {Paper, ListItem, ListItemText} from '@mui/material'
import axios from 'axios';

function App() {
  const [request, setRequest] = useState("")
  const [messages, addMessages] = useState<string[]>([])
  function handleSubmit(request: string) {
    addMessages(prev => [...prev, request])
    axios.post("http://127.0.0.1:5000/submit", {
      "request": request,
      "age": "26",
      "history": []
    }).then(res => {
        console.log(res.data.response);
        addMessages(prev => [...prev, res.data.response]);
    }).catch(error => {
        console.error(error);
    });
  }
  const handleKeyDown = (e) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (request.trim()) {
        handleSubmit(request);
        setRequest("");
      }
    }
  }
  return (
    <div>
      <Typography variant='h3'>Explain Like I'm 5 Client</Typography>
      <Paper sx={{ height: 300, overflowY: 'auto', p: 2, mb: 2}}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={msg}/>
            </ListItem>
          ))}
        </List>
      </Paper>
      <TextField
        id='request-content'
        label='Request'
        placeholder='Ask anything'
        multiline
        variant='filled'
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default App
