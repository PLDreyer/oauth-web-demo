import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { render } from 'react-dom'
import Homepage from "./homepage";
import Login from "./login";
import { MyContext, Store } from "./context";

function App() {
  return (
    <MyContext.Provider value={Store()}>
      <BrowserRouter>
        <Routes>
          <Route path="/redirect" element={<Homepage/>} />
          <Route path="/" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  )
}

render(<App/>,
  document.querySelector("#app")
)

module.hot.accept();