import Login from "./components/Login";
import Body from "./pages/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path='/' element={
            <Body />
          }>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
