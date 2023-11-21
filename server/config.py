from flask import Flask, url_for
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import logging
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from flask_login import LoginManager






db = SQLAlchemy()
migrate = Migrate()
api = Api()
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",})
csrf = CSRFProtect() 


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'joe'
    app.config['WTF_CSRF_ENABLED'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True, resources={
        r"/*": {"origins": "http://localhost:3000"}
    })  


    logging.basicConfig(level=logging.INFO)  


    def get_photo_url(filename):
            return url_for("static", filename=f"uploads/{filename}")
        
    app.jinja_env.globals.update(get_photo_url=get_photo_url)

    return app


