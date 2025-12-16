import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, addTask, updateTask, toggleTask, deleteTask }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [date, setDate] = useState('');

  const startEditing = (task: Task) => {
    setTitle(task.title);
    setPriority(task.priority);
    setDate(task.dueDate);
    setEditingId(task.id);
  };

  const cancelEdit = () => {
    setTitle('');
    setDate('');
    setPriority(Priority.MEDIUM);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      // Update
      const existingTask = tasks.find(t => t.id === editingId);
      if (existingTask) {
        updateTask({
          ...existingTask,
          title: title,
          priority: priority,
          dueDate: date || existingTask.dueDate
        });
      }
    } else {
      // Add
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 5).toUpperCase(), // Process ID look
        title: title,
        priority: priority,
        dueDate: date || new Date().toISOString().split('T')[0],
        completed: false,
        estimatedMinutes: 30,
      };
      addTask(newTask);
    }

    cancelEdit();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="h-full flex flex-col font-mono text-sm">
      
      {/* Header Info */}
      <div className="mb-6 text-zinc-500 text-xs">
        Tasks - {tasks.length} total, {tasks.filter(t => !t.completed).length} running, {tasks.filter(t => t.completed).length} sleeping, 0 zombie
      </div>

      {/* Input Line */}
      <div className={`border-b-2 p-2 mb-6 ${editingId ? 'bg-yellow-900/10 border-yellow-500' : 'bg-zinc-900 border-zinc-700'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:items-center">
          <span className={`${editingId ? 'text-yellow-500' : 'text-green-500'} font-bold whitespace-nowrap`}>
            root@tasks:{editingId ? '/edit' : '~'}#
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-zinc-100 flex-1 placeholder-zinc-700"
            placeholder={editingId ? "Update task name..." : "sudo new-task --title..."}
          />
          <div className="flex gap-2 text-xs">
             <select 
               value={priority}
               onChange={(e) => setPriority(e.target.value as Priority)}
               className="bg-black text-zinc-400 border border-zinc-700 p-1"
             >
               <option value={Priority.HIGH}>--high</option>
               <option value={Priority.MEDIUM}>--normal</option>
               <option value={Priority.LOW}>--low</option>
             </select>
             <input
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="bg-black text-zinc-400 border border-zinc-700 p-1"
             />
             
             {editingId && (
               <button 
                type="button" 
                onClick={cancelEdit}
                className="text-red-500 px-2 font-bold border border-red-900 hover:bg-red-900/20"
               >
                 [ESC]
               </button>
             )}

             <button type="submit" className={`${editingId ? 'text-yellow-500' : 'text-green-500'} px-2 font-bold`}>
               [ENTER]
             </button>
          </div>
        </form>
      </div>

      {/* Task Table */}
      <div className="border border-zinc-800 bg-black flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900 text-black font-bold sticky top-0">
            <tr>
              <th className="p-2 w-20">PID</th>
              <th className="p-2 w-20">PRI</th>
              <th className="p-2 w-24">STATE</th>
              <th className="p-2">COMMAND</th>
              <th className="p-2 w-32 text-right">DUE</th>
              <th className="p-2 w-32 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {sortedTasks.map((task) => (
              <tr key={task.id} className={`hover:bg-zinc-900/50 group ${task.completed ? 'opacity-50' : ''}`}>
                <td className="p-2 text-zinc-500">{task.id}</td>
                <td className={`p-2 font-bold ${
                  task.priority === Priority.HIGH ? 'text-red-500' : 
                  task.priority === Priority.MEDIUM ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {task.priority === Priority.HIGH ? '-20' : task.priority === Priority.MEDIUM ? '0' : '19'}
                </td>
                <td className="p-2 text-zinc-400">{task.completed ? 'S' : 'R'}</td>
                <td className={`p-2 ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                  {task.title}
                </td>
                <td className="p-2 text-right text-zinc-500 text-xs">{task.dueDate}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="text-xs text-green-500 hover:bg-green-500 hover:text-black px-1"
                    >
                      {task.completed ? 'RST' : 'KIL'}
                    </button>
                    <button 
                      onClick={() => startEditing(task)}
                      className="text-xs text-blue-500 hover:text-blue-300 px-1"
                    >
                      VI
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs text-zinc-600 hover:text-red-500 px-1"
                    >
                      RM
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {sortedTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-600">
                  No processes running.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;