import { Database } from "./database.js";
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js";
import { runUpload } from "./streams/import-csv.js";


const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            let task = database.select('tasks', {
                id: id
            })[0]

            if (!task) {
                return res.writeHead(404).end('Task not found')
            }

            console.log(title)

            if (title) {
                task.title = title;
            }

            if (description) {
                task.description = description;
            }

            database.update('tasks', id, {
                ...task,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            let task = database.select('tasks', {
                id: id
            })[0]

            if (!task) {
                return res.writeHead(404).end('Task not found')
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            let task = database.select('tasks', {
                id: id
            })[0]

            if (!task) {
                return res.writeHead(404).end('Task not found')
            }

            task.completed_at = true;

            database.update('tasks', id, task)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/upload'),
        handler: async (req, res) => {
            await runUpload()

            return res.writeHead(204).end()
        }
    }
]