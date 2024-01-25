import { useState } from "react";
import { useEffect } from "react";

export function StarRating({ initialRating, itemID }) {
  const [rating, setRating] = useState(initialRating);
  const [clicked, setClicked] = useState(false);

  const [canRate, setCanRate] = useState(false);

  const [ratingTxt, setRatingTxt] = useState("Rating");

  useEffect(() => {
    if (localStorage.getItem(`${itemID} Rating`)) {
      setRating(localStorage.getItem(`${itemID} Rating`));
      console.log("It's rated before");
      setRatingTxt("Your rating");
    }

    const accessToken = localStorage.getItem("token");
    const ratingCheckEndPoint = `/api/dish/${itemID}/rating/check`;

    fetch(ratingCheckEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCanRate(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [itemID, rating]);

  const handleMouseOver = (starIdx) => {
    if (!clicked) {
      setRating(starIdx);
    }
  };

  const handleMouseLeave = () => {
    if (!clicked) {
      setRating(initialRating);
    }
  };

  const handleClick = (starIdx) => {
    console.log(starIdx);
    if (!canRate) alert(`You have to try it before you rate it :)`);
    else {
      setRating(starIdx);
      setClicked(true);
      // alert(`Done!`);
      handleRating(starIdx);
    }
  };

  const stars = [];
  for (let i = 1; i <= 10; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? "filled" : "empty"}
        onMouseOver={() => handleMouseOver(i)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i)}
      >
        &#9733; {/* Unicode star symbol */}
      </span>
    );
  }

  //   useEffect(() => {
  //     const accessToken = localStorage.getItem("token");
  //     const dishEndPoint = `/api/dish/${itemID}/rating`;

  //     fetch(dishEndPoint, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         if (!localStorage.getItem(`${itemID} Rating`)) setRating(data.rating);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }, [itemID]);

  const handleRating = (rate) => {
    const accessToken = localStorage.getItem("token");
    const ratingEndPoint = `/api/dish/${itemID}/rating`;

    const queryParams = new URLSearchParams({
      ratingScore: rate,
    });
    const endpointWithParams = `${ratingEndPoint}/?${queryParams.toString()}`;
    // const endpointWithParams = `${ratingEndPoint}/${rate.toString()}`;

    // const page = req.nextUrl.searchParams.get("page");

    // fetch(`/api/dish/${itemID}/rating/?${rate.toString()}`, {
    fetch(endpointWithParams, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      // .then((response) => {
      //   response.json();
      //   if (response.status === 200) {
      //     console.log("Yoo");
      //     localStorage.setItem(`${itemID} Rating`, rate);
      //   }
      // })
      .then((data) => {
        console.log(data);
        // if (data.status) {
        //   localStorage.setItem(`${itemID} Rating`, rate);
        // }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ margin: "0 auto", alignSelf: "center" }}>
        <p>
          {ratingTxt} {rating}
        </p>
      </div>
      <div style={{ margin: "0 auto", alignSelf: "center", cursor: "pointer" }}>
        {stars}
      </div>
      <div style={{ margin: "0 auto", alignSelf: "center" }}>
        {!canRate && <p>You have to try it before you rate it &#128512;</p>}
      </div>
    </div>
  );
}
