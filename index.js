const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
let exercises = [];

//tao nguoi dung moi
app.post('/api/users', (req, res)=>{
  const {username} = req.body;
  const newUser = {username, _id:`id_${users.length+1}`};
  users.push(newUser);
  res.json(newUser);
});

app.post('/api/users/:_id/exercises', (req, res)=>{
  const {_id} = req.params;
  const {description} = req.body;
  const {duration} = req.body;
  const {date}=req.body;

  const user = users.find(i => i._id === _id)
  if(!user)
    return res.status(404).json({error: "User not found"});
  
  const newExercises = {
    username: user.username, 
    description, 
    duration:parseInt(duration), 
    date: date ? new Date(date).toDateString() : new Date().toDateString(), 
    _id: user._id,
  };
  exercises.push(newExercises);
  res.json(newExercises);
})

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const user = users.find(u => u._id === _id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const userExercises = exercises.filter(ex => ex._id === _id);

  const log = userExercises.map(ex => ({
    description: ex.description,
    duration: ex.duration,
    date: ex.date
  }));

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log
  });
});

app.get('/api/log', (req, res)=>{
  const {username, _id, description, duration, date} = req.body;


})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
