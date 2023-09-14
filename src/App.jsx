import { Routes,Route } from "react-router-dom"
import HomePage from "./pages/Home"
import NotFoundPage from "./pages/NotFound"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </div>
  )
}

export default App