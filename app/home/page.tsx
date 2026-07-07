"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { GET } from '../api/getApis/route';


const HomePage = () => {
    const [data, setData] = useState<string[][]>([]);

    const getData = async () => {
    try {
      const response = await fetch("/api/responsesApis/sheet1");

      const result = await response.json();

      setData(result);

      console.log(result,"results");
    } catch (error) {
      console.log(error,"error");
    }
  };

    useEffect(() => {
        getData();
    }, []);
  return (
    <div>
        Hello World
    </div>
  )
}

export default HomePage;