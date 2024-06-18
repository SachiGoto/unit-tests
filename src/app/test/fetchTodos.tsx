// import type { Todo } from "@/types/Todo"

type Todo = {
  userId: number,
  id: number,
  title: string,
  completed: boolean,
}

export default async function fetchTodos() {
    try {
        const res = await fetch("/todos")

        const todos: Todo[] = await res.json()

        return todos
    } catch (err) {
        if (err instanceof Error) console.log(err.message)
        return []
    }
}