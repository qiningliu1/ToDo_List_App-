import React from "react";

const Task = ({ task, onComplete, onDelete, onEdit }) => {
  return (
    <div style={styles.task}>
      <span
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "gray" : "black",
        }}
      >
        {task.text}
      </span>
      <div>
        <button onClick={() => onComplete(task.id)}>完成</button>
        <button onClick={() => onEdit(task)}>编辑</button>
        <button onClick={() => onDelete(task.id)}>删除</button>
      </div>
    </div>
  );
};

const styles = {
  task: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
  },
};

export default Task;
