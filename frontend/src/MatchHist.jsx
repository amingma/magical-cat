import {useState, useEffect} from "react"

export default function MatchHist({player}) {
    const [matches, setMatches] = useState([])
    const [curMatchIdx, setCurMatchIdx]  = useState()
    async function queryMatches() {
        try {
            const options = {
                'method':'GET'
            }
            const response = await fetch(`http://127.0.0.1:5000/get_matches/${player.id}`, options)
            const data = await response.json()
            console.log(data.matches)
            setMatches(data.matches)
            setCurMatchIdx(0)
        }
        catch (error) {
            alert(error)
        }
    }
    useEffect(()=>{
        queryMatches()
    }, [player])

    function goPrevMatch() {
        setCurMatchIdx(curMatchIdx - 1);
    }

    function goNextMatch() {
        setCurMatchIdx(curMatchIdx + 1);
    }

    return (
        <>
            {player && 
            <div>
                <div>{"You are currently " + player.rank}</div>
                <div>{"Current match: " + matches[curMatchIdx]}</div>
                <div>{curMatchIdx!=0 && <button onClick={()=>goPrevMatch()}>Prev Match</button>} 
                     {curMatchIdx!=matches.length-1 && <button onClick={()=>goNextMatch()}>Next Match</button>}
                </div>    
            </div>}
        </>
    )
}