from flask import request, jsonify
from config import app, db, api_key
from models import Player
import requests

def get_db_info(puuid):
    url = f'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    summoner_id = data["id"]
    url = f'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    rank = "N/A"
    for block in data:
        if block["queueType"] == "RANKED_SOLO_5x5":
            if block["tier"] == "CHALLENGER" or block["tier"] == "GRANDMASTER" or block["tier"] == "MASTER":
                rank = block["tier"]
            else:
                rank = block["tier"] + " " + block["rank"]
    return summoner_id, rank

def get_ritoid(puuid):
    url = f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/{puuid}?api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    return data["gameName"] + "#" + data["tagLine"]

@app.route("/")
def hello():
    return "Hello World"

@app.route("/players", methods=["GET"])
def get_players():
    players = Player.query.all()
    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})

@app.route("/get_player/<player_id>", methods=["GET"])
def get_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return (jsonify({"message": "Player not found"})), 404
    json_player = player.to_json()
    return jsonify({"player": json_player})

@app.route("/get_matches/<player_id>", methods=["GET"])
def get_matches(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"message": "Player not found"}), 404
    json_player = player.to_json()
    puuid = json_player["puuid"]
    url = f'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20&api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    return jsonify({"matches": data}), 200

@app.route("/create_player", methods=["POST"])
def create_player():
    game_name = request.json.get('name')
    tag_line = request.json.get('tag')
    riot_id = request.json.get("riotID")
    if not riot_id:
        return (jsonify({"message": "You must specify a riot id"}), 400)
    url = f'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}?api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    if "status" in data:
        return jsonify({"message":"Invalid player tag combination"}), data["status"]["status_code"]
    else:
        puuid = data["puuid"]
        riot_id = data["gameName"] + "#" + data["tagLine"]
        summoner_id, rank = get_db_info(puuid)
    new_player = Player(riot_id = riot_id, puuid = puuid, summoner_id = summoner_id, rank = rank)
    try:
        db.session.add(new_player)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Player added!"}), 201 

@app.route("/delete_player/<player_id>", methods=["DELETE"])
def delete_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return (jsonify({"message": "Player not found"})), 404
    db.session.delete(player)
    db.session.commit()
    return (jsonify({"message": "Player successfully deleted"}), 200)

@app.route("/find_champ/<player_id>/<match_id>", methods=["GET"])
def find_champ(player_id, match_id):
    player = Player.query.get(player_id)
    if not player:
        return (jsonify({"message": "Player not found"})), 404
    json_player = player.to_json()
    puuid = json_player["puuid"]
    url = f'https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    participant_list = data['metadata']['participants']
    player_idx = -1
    for i in range(10):
        if participant_list[i] == puuid:
            player_idx = i
    if player_idx == -1:
        return jsonify({"message": "Player not found in match"}), 404
    return jsonify({"champion": data['info']['participants'][player_idx]['championName']}), 200

@app.route("/update_player/<player_id>", methods=["PATCH"])
def update_player(player_id):
    print("hi")
    player = Player.query.get(player_id)
    if not player:
        return (jsonify({"message": "Player not found"})), 404
    json_player = player.to_json()
    puuid = json_player["puuid"]
    riot_id = get_ritoid(puuid)
    summoner_id, rank = get_db_info(puuid)

    player.riot_id = riot_id
    player.summoner_id = summoner_id
    player.rank = rank

    db.session.commit()

    return jsonify({"message":"User updated"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)