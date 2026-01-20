import { TaskBoard } from './components/TaskBoard'
import { TaskProvider } from './context/TaskContext'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <TaskProvider>
        <TaskBoard />
      </TaskProvider>
    </div>
  )
}

export default App
