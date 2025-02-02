import React from "react";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Taj Mahal",
        description: "Ivory-white marble mausoleum on the right bank of the river Yamuna ",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjDSfRHrbEPMqEahC0gJ66y5h32TG4Ce4qAw&s",
        address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
        location: {
            lat: 27.1751448,
            lng: 78.0421422
        },
        creator: "u1"
    },
    {
        id: "p2",
        title: "Qutab Minar",
        description: "Lies at the site of Delhi's oldest fortified city, Lal Kot, founded by the Tomar Rajputs",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk5mr62EixL3d2alqsEwbuIKTI6Pj6IkiCKA&s",
        address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
        location: {
            lat: 28.5244946,
            lng: 77.1855177
        },
        creator: "u2"
    },
];

const UserPlaces = () => {
    return <PlaceList items={DUMMY_PLACES}/>;
};

export default UserPlaces;