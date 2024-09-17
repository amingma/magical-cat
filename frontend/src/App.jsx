import { useState, useEffect } from 'react'
import SearchForm from './SearchForm'
import PlayerList from './PlayerList'
import './App.css'

function App() {
  const [players, setPlayers] = useState([])
  const [curPlayer, setCurPlayer] = useState()
  const [isViewOpen, setIsViewOpen] = useState(false)

  useEffect(()=>{
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const response = await fetch("http://127.0.0.1:5000/players")
    const data = await response.json()
    setPlayers(data.players)
  }

  function updateCallback() {
    fetchPlayers()
  }

  async function hitView(id) {
    const response = await fetch(`http://127.0.0.1:5000/get_player/${id}`)
    const data = await response.json()
    setCurPlayer(data.player)
    setIsViewOpen(true)
  }

  function hitHide() {
    setIsViewOpen(false)
    setCurPlayer()
  }
  
  return (
    <>
      <SearchForm updateCallback = {updateCallback}/>
      <div className="main">
        <PlayerList players = {players} 
                    updateCallback = {updateCallback} 
                    viewFunc = {hitView}
                    curPlayer = {curPlayer}
                    hideFunc = {hitHide}/>
        {isViewOpen && <div className="test">{"Hello " + curPlayer.riotID}</div>}
      </div>
      
    </>
  )
}

export default App
