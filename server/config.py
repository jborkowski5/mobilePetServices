from flask import Flask, url_for
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import logging


db = SQLAlchemy()
migrate = Migrate()
api = Api()
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Joe'
    app.config['WTF_CSRF_ENABLED'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False
    

    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    CORS(app)

    # Set the logging level to capture all messages (optional)
    app.logger.setLevel(logging.INFO)

    # Configure the log format (optional)
    formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] - %(message)s')
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    app.logger.addHandler(stream_handler)
    def get_photo_url(filename):
        return url_for("static", filename=f"uploads/{filename}")
    
    app.jinja_env.globals.update(get_photo_url=get_photo_url)

    return app
