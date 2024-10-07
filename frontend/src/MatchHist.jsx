import {useState, useEffect} from "react"

export default function MatchHist({player}) {
    const [matches, setMatches] = useState([])
    const [curMatchIdx, setCurMatchIdx]  = useState(0)
    const [curChamp, setCurChamp] = useState()
    const [curDate, setCurDate] = useState()
    const [curDuration, setCurDuration] = useState()
    async function queryMatches() {
        try {
            const options = {
                'method':'GET'
            }
            const response = await fetch(`http://127.0.0.1:5000/get_matches/${player.id}`, options)
            const data = await response.json()
            setMatches(data.matches)
            setCurMatchIdx(0)
        }
        catch (error) {
            console.log('wait')
            alert(error)
        }
    }

    async function matchInfo() {
        try {
            const options = {
                'method':'GET'
            }
            const response = await fetch(`http://127.0.0.1:5000/match_info/${player.id}/${matches[curMatchIdx]}`, options)
            const data = await response.json()
            setCurChamp(data["champion"])
            setCurDate(data["start"])
            setCurDuration(data["duration"])
        }
        catch (error) {
            alert(error)
        }
    }

    useEffect(()=>{
        queryMatches()
    }, [player])

    useEffect(()=>{
        matchInfo()
    }, [matches, curMatchIdx])

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
                <div>{"Current match: " + curDate}</div>
                <div>{"Match duration: " + curDuration}</div>
                <div>{curMatchIdx!=0 && <button onClick={()=>goPrevMatch()}>Prev Match</button>} 
                     {curMatchIdx!=matches.length-1 && <button onClick={()=>goNextMatch()}>Next Match</button>}
                </div>    
                <div>{"Champion played: " + curChamp}</div>
                {curChamp && 
                    <div>
                        <img src={`./champion/${curChamp}.png`} alt="Champion icon" />
                    </div>
                }
            </div>}
        </>
    )
}