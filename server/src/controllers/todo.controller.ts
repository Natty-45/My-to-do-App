import { Application,Response ,Request } from "express";
import Todo from '../models/to-do.model'
import { todo } from "node:test";

export const createTodo = async(
    req:Request,
     res:Response
    ) : Promise<Application | any> =>{

        try {
           const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({ message: 'The title, description, and status are required' });
    }

    const todo = await Todo.findOne({ title });

    if (todo) {
      return res.status(400).json({ message: 'The todo already exists' });
    }

    const newTodo = await Todo.create({
      title,
      description,
      status,
    });

    console.log(newTodo);
    return res.status(200).json({ message: 'Todo created successfully', data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

};

export const getAllTodos = async(
    req:Request,
    res:Response): Promise<Application | any> =>{
        try {
            const todos = await Todo.find();
            if(!todos){
                return res.status(400).json({message:'No To-do found. please create one!'});
            }
            return res.status(200).json({
                        message: "Successfully fetched all to-dos",
                        data: todos.map(todo => ({ title: todo.title, createdAt: todo.createdAt }))
    });
        } catch (error) {
            return res.status(500).json({message:"Internal Server Error!"})
        }
};

export const getTodo = async(
    req:Request,
    res:Response
): Promise< Application | any> =>{
    try
    {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message:"Please add to-do ID to get the details"})
        }

        const todo = await Todo.findById(id);

        if(!todo){
            return res.status(400).json({message:'To-do not Found!'})
        }

        return res.status(200).json({message:"To-do Fetch Successfully", data:todo})
    }
    catch(error)
    {
        return res.status(500).json({message:'Internal server error'});
    }
};

export const updateTodo = async(
    req:Request,
    res:Response
): Promise<Application | any> =>{

    try {
           const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'To-do ID is required' });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'To-do not found' });
    }

    const { title, description, status } = req.body;
    if (!title && !description && !status) {
      return res.status(400).json({ message: 'At least one field (title, description, or status) must be provided' });
    }

    const updateData: { title?: string; description?: string; status?: string } = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(500).json({ message: 'Failed to update to-do' });
    }

    return res.status(200).json({
      message: 'To-do updated successfully',
      data: updatedTodo
    });
        

    } catch (error) {
        return res.status(500).json({message:'Intrenal server error'})
    }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<Application | any> => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: 'Id is required!' });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'To-do not found' });
    }

    return res.status(200).json({ message: 'To-do deleted successfully' });
  } catch (error) {
    console.error('Error deleting to-do:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};