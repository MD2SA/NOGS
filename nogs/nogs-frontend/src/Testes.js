import React, { useState } from 'react';
import axios from 'axios';

export default function Testes() {
    const [data, setData] = useState("NADA");

    const getAxios = () => {
        axios.get("http://localhost:8000/type/api/generate", {
            params: {
                mode: 'words',
                time_seconds: null,
                word_count: '20',
            }
        })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                setData("Error fetching data");
                console.error("There was an error!", error);
            });
    };

    return (
        <div>
            <button onClick={getAxios}>Get Data</button>
            <h2 className="sub-title">
                {JSON.stringify(data)}
            </h2>
        </div>
    );
}

