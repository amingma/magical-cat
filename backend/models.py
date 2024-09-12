from config import db

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_name = db.Column(db.String(120), unique=False, nullable=False)
    tag_line = db.Column(db.String(120), unique=False, nullable=False)
    riot_id = db.Column(db.String(120), unique=True, nullable=False)
    #rank = db.Column(db.string(80), unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "gameName": self.game_name,
            "tagLine": self.tag_line,
            "riotID": self.riot_id,
            # "rank": self.rank,
        }