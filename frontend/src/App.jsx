import { useState, useEffect } from 'react'
import SearchForm from './SearchForm'
import PlayerList from './PlayerList'

function App() {
  const [players, setPlayers] = useState([{"id":1234, "riotID": "blah"}])
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
      <PlayerList players = {players} updateCallback = {updateCallback}/>
    </>
  )
}

export default App
