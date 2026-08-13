from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Date, Time, Text, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, time, datetime
from typing import List

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    first_name: Mapped[str] = mapped_column(String(120))
    last_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    trips: Mapped[List["Trip"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    favorites: Mapped[List["Favorite"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Trip(db.Model):
    __tablename__ = "trip"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE")
    )
    user: Mapped["User"] = relationship(back_populates="trips")
    destinations: Mapped[List["Destination"]] = relationship(
        back_populates="trip", cascade="all, delete-orphan"
    )


class Destination(db.Model):
    __tablename__ = "destination"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False)
    trip_id: Mapped[int] = mapped_column(
        ForeignKey("trip.id", ondelete="CASCADE")
    )
    trip: Mapped["Trip"] = relationship(back_populates="destinations")
    activities: Mapped[List["Activity"]] = relationship(
        back_populates="destination", cascade="all, delete-orphan"
    )


class Activity(db.Model):
    __tablename__ = "activity"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    time: Mapped[time] = mapped_column(Time)
    date: Mapped[date] = mapped_column(Date)
    notes: Mapped[str] = mapped_column(Text)
    destination_id: Mapped[int] = mapped_column(
        ForeignKey("destination.id", ondelete="CASCADE")
    )
    destination: Mapped["Destination"] = relationship(back_populates="activities")

class Place(db.Model):
    __tablename__ = "place"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    favorites: Mapped[List["Favorite"]] = relationship(
        back_populates="place", cascade="all, delete-orphan"
    )

class Favorite(db.Model):
    __tablename__ = "favorite"
    __table_args__ = (
        UniqueConstraint("user_id", "place_id", name="uq_favorite_user_place"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE")
    )
    place_id: Mapped[int] = mapped_column(
        ForeignKey("place.id", ondelete="CASCADE")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    user: Mapped["User"] = relationship(back_populates="favorites")
    place: Mapped["Place"] = relationship(back_populates="favorites")