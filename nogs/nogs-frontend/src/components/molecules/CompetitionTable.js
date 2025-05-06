import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { COMPETITION_PARTICIPANTS_URL } from "../../assets/urls/djangoUrls";
import Table from "../atoms/Table";


export default function CompetitionTable({ data }) {

    const transformedData = data.
        sort((a, b) => b.wpm - a.wpm)
        .map(({ accuracy, wpm, username }, index) => (
            {
                '#': index + 1,
                name: username,
                wpm: wpm,
                accuracy: accuracy,
            }
        ));

    return (
        <Table data={transformedData} />
    );
}

