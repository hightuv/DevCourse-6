import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  let name = "리액트";

  return (
    <div className="App">
      <h1>Hello, 
        {
          name === '리액트' ? (<h1>YES</h1>) : (<h1>NO</h1>)
        }!!</h1>
      <p>반갑습니다.</p>
    </div>
  );
}

export default App;
