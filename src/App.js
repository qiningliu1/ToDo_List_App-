
import React, { useState, useEffect } from "react";
import Task from "./components/Task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [tasks, setTasks] = useState([]); 
  const [input, setInput] = useState(""); 
  const [filter, setFilter] = useState("all"); 
  const [editingTask, setEditingTask] = useState(null); 

  // load localStorage data
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // save data to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  
  const addTask = () => {
    if (input.trim()) {
      if (editingTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id ? { ...task, text: input } : task
          )
        );
        setEditingTask(null);
      } else {
        const newTask = { id: Date.now(), text: input, completed: false };
        setTasks([...tasks, newTask]);
      }
      setInput("");
    }
  };

  
  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

 
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  
  const editTask = (task) => {
    setInput(task.text);
    setEditingTask(task);
  };

  
  const handleDragEnd = (result) => {
    if (!result.destination) return; // 如果没有拖放到有效位置
    const reorderedTasks = Array.from(tasks);
    const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, reorderedItem);
    setTasks(reorderedTasks);
  };

  // 筛选任务
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <h1>任务清单</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入新任务..."
        />
        <button onClick={addTask}>
          {editingTask ? "更新任务" : "添加任务"}
        </button>
      </div>
      <div>
        <button onClick={() => setFilter("all")}>全部</button>
        <button onClick={() => setFilter("active")}>未完成</button>
        <button onClick={() => setFilter("completed")}>已完成</button>
      </div>

      {/* 拖放排序功能 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ marginTop: "20px" }}
            >
              {filteredTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task
                        task={task}
                        onComplete={completeTask}
                        onDelete={deleteTask}
                        onEdit={editTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

const styles = {
  container: { margin: "20px auto", textAlign: "center", maxWidth: "600px" },
};

export default App;
