/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Season from "../components/Season";
import ShowBody from "../components/ShowsBody";

export default function Shows() {
    const [showData, setShowData] = useState(null);
    const [seasonsData, setSeasonsData] = useState(null);

    useEffect(() => {
        fetchData();
    
    })

    