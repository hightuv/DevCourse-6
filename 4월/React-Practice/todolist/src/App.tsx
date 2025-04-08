import React from 'react';
import logo from './logo.svg';
import './App.css';
import TodoList from './Todolist';
import Timer from './Timer';
import Clock from './Clock';

function App() {
  let name = "리액트";

  return (
    <div className="container">
      <TodoList></TodoList>
      <Timer></Timer>
      <Clock></Clock>
    </div>
  );
}

export default App;
