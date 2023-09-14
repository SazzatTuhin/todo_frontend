import axios from "axios";
import { useEffect, useState } from "react";
import { useActionData } from "react-router-dom";
import {GrFormClose} from "react-icons/gr";

const HomePage = () => {
    const [todoData, settodoData] = useState({
        name: "",
        description: ""
    })

    const [todos,setTodos] = useState([])
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [updatedTodo,setupdatedTodo] = useState(null);

    useEffect(()=>{
        const getTodos = async ()=>{
            const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/todos`)

        if(res?.data){
            setTodos(res?.data)
        }
        }

        getTodos()

    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/todos`,todoData)
            
            if(res?.data){
                setTodos([...todos,res?.data])
                settodoData({
                    name: "",
                description: "",
                })

            }
            
        } catch (error) {
            console.log(error.message)
            
        }        
    }

    const handleDelete = async(id) =>{
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_APP_BASE_URL}/api/todos/${id}`
                )

            if(res?.data){
                setTodos(todos.filter(todo=>todo._id !== id))
            }
        } catch (error) {
            console.log(error.message)
            
        }

    }

    const handleEdit = id =>{
        setIsModalOpen(true)

        const filtredTodo = todos.find(todo=>todo._id === id)
        setupdatedTodo(filtredTodo)
    }

    const handleUpdate = async(e)=>{
        e.preventDefault()

        try {
            const res = await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}/api/todos/${updatedTodo._id}`,updatedTodo)


            if(res?.data){
                setIsModalOpen(false)
                setTodos([res?.data,...todos.filter(todo=>todo._id !== updatedTodo._id)])
            }
            
        } catch (error) {
            console.log(error.message)
            
        }
    }


  return (
<>
<div className="container mx-auto py-20 min-h-screen grid gap-20 grid-cols-1 md:grid-cols-2">
        <form  onSubmit={handleSubmit} className=" w-full flex flex-col gap-5">
            <h2 className="text-4xl font-bold">Add new todo</h2>
            <div className="form-control flex flex-col gap 2.5">
                <label htmlFor="name">Name</label>
                <input value={todoData.name}
                onChange={e=>settodoData({...todoData,name:e.target.value})}
                 required type="text" id="name" className="border px-2.5 py-5 rounded-xl text-2xl" />
            </div>

            <div className="form-control flex flex-col gap-2.5">
                <label htmlFor="description">Description</label>
                <textarea value={todoData.description}
                onChange={e=>settodoData({...todoData,description:e.target.value})}
                 required id="description" className="border resize-none rounded-xl px-2.5 py-5 text-2xl" rows={7} />
            </div>
            
            <button type="submit" className="self-start bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-80">Submit</button>
        </form>


        <div className="w-full">
            <h2 className="text-4xl font-bold">Todos</h2>

            <div className="mt-10 flex flex-col gap-5">
                {
                    todos.map(todo=>(
                        <div key={todo._id} className="flex justify-between gap-5 items-center border-b">
                            <div>
                                <h3 className="text-lg font-medium">{todo.name}</h3>
                                <p className="text-gray-500">{todo.description}</p>
                            </div>



                            <div className="flex gap-5 font-medium">
                                <button onClick={()=>handleEdit(todo._id)} className="text-blue-500">Edit</button>
                                <button onClick={()=>handleDelete(todo._id)} className="text-red-500">Delete</button>
                            </div>


                            
                        </div>
                    ))
                }

                {
                    todos.length === 0 && <div><p>There is no todo </p></div>
                }
            </div>
        </div>
    </div>

    {/* overlay  */}

    {
        isModalOpen && <div onClick={()=>setIsModalOpen(false)} className="fixed z-[99] top-0 left-0 right-0 bottom-0 w-full h-full bg-transparent"></div>
    }

    {/* modal  */}

        {
            isModalOpen && (<div className="fixed w-[30rem] h-[30rem] bg-white rounded-xl shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] p-10">

                <span onClick={()=>setIsModalOpen(false)} className="text-xl absolute top-5 right-5 cursor-pointer hover:text-red-500">
                    <GrFormClose/>
                </span>

                <form onSubmit={handleUpdate} className="flex flex-col gap-5" >
                    <h2 className="text-2xl font-semibold">Update Todo</h2>

                    <div className="form-control flex flex-col gap-2">
                        <label htmlFor="name">Name</label>
                        <input
                        value={updatedTodo.name}
                        onChange={(e)=>setupdatedTodo({...updatedTodo,name:e.target.value})}
                         type="text" id="name" className="border p-2.5 rounded-lg"/>
                    </div>

                    <div className="form-control flex flex-col gap-2">
                        <label htmlFor="description">Description</label>
                        <textarea 
                        value={updatedTodo.description}
                        onChange={(e)=>setupdatedTodo({...updatedTodo,description:e.target.value})}
                         id="description" rows={5} className="resize-none border rounded-lg p-2.5"/>
                        <button type="submit" className="self-start bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-80">Update</button>
                    </div>
                </form>

            </div>
            )
        }

</>
  )
}

export default HomePage