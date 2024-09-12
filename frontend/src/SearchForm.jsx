import {useState} from 'react'

export default function SearchForm({updateCallback}) {
    const [name, setName] = useState("")
    const [tag, setTag] = useState("")
    async function handleSubmit(e) {
        e.preventDefault();
        const riotID = name + tag;
        const data = {
          name,
          tag,
          riotID,
        };
        const url = "http://127.0.0.1:5000/create_player"
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
          const data = await response.json();
          alert(data.message);
        }
        else {
          updateCallback();
        }
    }
    return (
      <>
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e=>setName(e.target.value)}/>
            <input value={tag} onChange={e=>setTag(e.target.value)} />
            <button>Go</button>
        </form>
      </>
    )
}