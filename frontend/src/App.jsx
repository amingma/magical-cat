import { useState, useEffect } from 'react'
import SearchForm from './SearchForm'
import PlayerList from './PlayerList'
import './App.css'

function App() {
  const [players, setPlayers] = useState([])
  const [curPlayer, setCurPlayer] = useState()
  const [isViewOpen, setIsViewOpen] = useState(true)

  useEffect(()=>{
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const response = await fetch("http://127.0.0.1:5000/players")
    const data = await response.json()
    setPlayers(data.players)
  }

  function updateCallback() {
    fetchPlayers();
  }
  
  return (
    <>
      <SearchForm updateCallback = {updateCallback}/>
      <div className="main">
        <PlayerList players = {players} updateCallback = {updateCallback}/>
        {isViewOpen && <div className="test">Hello</div>}
      </div>
      
    </>
  )
}

export default App
