import React from 'react';
import './teamInfoIcons.css';
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiOutlineBank } from "react-icons/ai";
import { GoCalendar } from "react-icons/go";
import { GiCash } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";

export const cash = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoCash"}}>
  <GiCash />
</IconContext.Provider>;
export const calendar = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <GoCalendar />
</IconContext.Provider>;
export const search = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <FaSearch />
</IconContext.Provider>;
export const buy = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoGreenBuy"}}>
  <GiMoneyStack />
</IconContext.Provider>;
export const bank = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <AiOutlineBank />
</IconContext.Provider>;
export const eye = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <FaRegEye />
</IconContext.Provider>;
export const list = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <FaRegListAlt />
</IconContext.Provider>;
export const check = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoGreenCheck"}}>
  <FaCheck />
</IconContext.Provider>;