export default function PlayerList({players, updateCallback}) {
    async function onDelete(id) {
        try {
            const options = {
                'method': 'DELETE'
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_player/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            }
            else {
                console.error('Failed to delete')
            }
        }
        catch (error) {
            alert(error)
        }
    }
    return <div>
        <h2>Players</h2>
        <table>
            <thead>
                <tr>
                    <th>Player Tag</th>
                    <th>Player Rank</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player)=>(
                    <tr key={player.id}> 
                        <td>{player.riotID} </td>
                        <td>{player.rank}</td>
                        <td>
                            <div className="buttonHolder">
                                <button onClick = {()=>onDelete(player.id)}>Delete</button>
                                <button>View</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}