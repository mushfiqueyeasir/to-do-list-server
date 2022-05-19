const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emmtc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();

        const taskCollection = client.db('ToDoList').collection('taskList');

        //Get Specific Task from mongo DB
        app.get('/taskList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = taskCollection.find(query);
            const taskList = await cursor.toArray();
            res.send(taskList);
        })

        //Get all task
        app.get('/taskList', async (req, res) => {
            const email = req.query.email;
            let query;
            if (email) {
                query = { email: email };
            } else {
                query = {};
            }
            const cursor = taskCollection.find(query);
            const taskList = await cursor.toArray();
            res.send(taskList);
        })

        //Add Task
        app.post('/taskList', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        //Delete Task
        app.delete('/taskList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        //Modify Task
        app.put('/taskList/:id', async (req, res) => {
            const id = req.params.id;
            const completed = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: completed
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => [
    res.send('Hello to-dolist!')
])

app.listen(port, () => {
    console.log(`to-do-list listening on port ${port}`)
})