import React from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Taj Mahal",
    description:
      "Ivory-white marble mausoleum on the right bank of the river Yamuna ",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjDSfRHrbEPMqEahC0gJ66y5h32TG4Ce4qAw&s",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    location: {
      lat: 27.1751448,
      lng: 78.0421422,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Qutab Minar",
    description:
      "Lies at the site of Delhi's oldest fortified city, Lal Kot, founded by the Tomar Rajputs",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk5mr62EixL3d2alqsEwbuIKTI6Pj6IkiCKA&s",
    address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
    location: {
      lat: 28.5244946,
      lng: 77.1855177,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  const [formState, inputHandler] = useForm(
    {
    title: {
        value: identifiedPlace.title,
        isValid: true,
    },
    description: {
        value: identifiedPlace.description,
        isValid: true,
    }
    },true);

    const placeUpdateSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs); //send this to backend
    }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
