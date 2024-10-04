from config import db

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    riot_id = db.Column(db.String(120), unique=True, nullable=False)
    puuid = db.Column(db.String(120), unique=True, nullable=False)
    summoner_id = db.Column(db.String(120), unique=True, nullable=False)
    rank = db.Column(db.String(80), unique=False, nullable=False)
    wins = db.Column(db.Integer, nullable = False)
    losses = db.Column(db.Integer, nullable = False)

    def to_json(self):
        return {
            "id": self.id,
            "riotID": self.riot_id,
            "puuid": self.puuid,
            "summonerID": self.summoner_id,
            "rank": self.rank,
            "wins": self.wins,
            "losses": self.losses
        }