export default function MatchHist({player}) {
    return (
        <>
            {player && 
            <div>{"You are currently " + player.rank}</div>}
        </>
    )
}