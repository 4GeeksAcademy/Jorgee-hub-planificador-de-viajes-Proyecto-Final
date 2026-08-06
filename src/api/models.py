from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Date, Time, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, time

db = SQLAlchemy()

class User(db.Model):
    __tablename__= "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash= Mapped[str] = mapped_column(nullable=False)


class Destination(db.Model):
    __tablename__= "destination"
    id: Mapped[int] = mapped_column(primary_key=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)


class Trip(db.Model):
    __tablename__= "trip"
    id: Mapped[int] = mapped_column(primary_key="True")
    name: Mapped[str] = mapped_column(String(100), nullable=False)

class Activity(db.Model):
    __tablename__= "activity"
    id: Mapped[int] = mapped_column(primary_key="True")
    time: Mapped[str] = mapped_column(date)
    date: Mapped[str] = mapped_column(time)
    notes: Mapped[str] = mapped_column(Text)