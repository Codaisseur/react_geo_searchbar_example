import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { IoIosClose } from "react-icons/io";

const KEY = "AIzaSyAeZKwSXWbLNjI9lQFk-8D2CKi4uN1M5Xs";

// 1. loading
// 2. predictions

type Prediction = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    // ...
  };
  // ...
};

export default function GeoSearchBar() {
  const [searchText, setSearchText] = useState("nijm");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>();

  const clear = () => {
    setSearchText("");
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await axios(
        "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
          KEY +
          "&input=" +
          encodeURIComponent(searchText)
      );
      if (response.data && response.data.status === "OK") {
        setPredictions(response.data.predictions);
      } else {
        setPredictions(undefined);
      }
      setLoading(false);
    }
    if (searchText !== "") {
      fetchData();
    } else {
      setPredictions(undefined);
      setLoading(false);
    }
  }, [searchText]);

  let content: any = <p>No predictions</p>;
  if (predictions) {
    content = predictions.map((prediction) => {
      return <div>{prediction.description}</div>;
    });
  }

  return (
    <Container>
      <SearchBar>
        <input
          type="text"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
          }}
        />
        <CloseButton onClick={clear}>
          <IoIosClose style={{ fontSize: 24 }} />
        </CloseButton>
      </SearchBar>
      <DropdownContainer>{content}</DropdownContainer>
    </Container>
  );
}

const Container = styled.div`
  margin: 100px;
  border: 1px solid black;
  max-width: 300px;
`;

const SearchBar = styled.div`
  position: relative;

  input {
    display: block;
    width: 100%;
    border: none;
    height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
  }
`;

const CloseButton = styled.button`
  all: inherit;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`;

const DropdownContainer = styled.div``;
