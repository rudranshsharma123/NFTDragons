import React from "react";
// cards
import { parts } from "../parts/parts";
import _r1 from "../assets/images/rarity/_rarity_1.png";
import _r2 from "../assets/images/rarity/_rarity_2.png";
import _r3 from "../assets/images/rarity/_rarity_3 (2).png";
import * as s from "../styles/globalStyles"

const DragonNFTGen = ({ dragon = null, size = 200, style }) => {
  if (!dragon) {
    return null;
  }
  let rarity = _r1;

  if (dragon.rarity >= 80) {
    rarity = _r2;
  }
  if (dragon.rarity >= 95) {
    rarity = _r3;
  }

  let dnaStr = String(dragon.dna);

  while (dnaStr.length < 16) dnaStr = "0" + dnaStr;

  let DragonDeatils = {
    wings: dnaStr.substring(0, 2) % 5,
    body: dnaStr.substring(2, 4) % 5,
    head: dnaStr.substring(4, 6) % 5,
    tails: dnaStr.substring(6, 8) % 5,
    bg: dnaStr.substring(8, 10) % 5,
    name: dragon.name,
  };

  const dragonStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
  };

  return (
    <s.Container jc={"center"} ai={"center"}
      style={{
        minWidth: size,
        minHeight: size,
        position: "relative",
        ...style,
      }}
    >
      <img alt={"line"} src={parts.head[DragonDeatils.head]} style={{ width: "50px", }} />
      <img alt={"bg"} src={parts.wings[DragonDeatils.wings]} style={{ width: "150px", position: "absolute", bottom: "100px" }} />
      <img alt={"bg"} src={parts.bg[DragonDeatils.bg]} style={{ opacity: "30%", position: "absolute", width: "100&", height: "100%" }} />

      <img alt={"mask"} src={parts.body[DragonDeatils.body]} style={{ width: "50px", }} />
      <img alt={"addon"} src={parts.tails[DragonDeatils.tails]} style={{ width: "50px", }} />




      =
      <img alt={"rarity"} src={rarity} style={dragonStyle} />
    </s.Container>
  );
};

export default DragonNFTGen;
