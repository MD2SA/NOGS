import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../css/Competition.css";
import Competition from "../components/organisms/Competition";
import CompetitionComposer from "../components/organisms/CompetitionComposer";
import { useAuth } from "../components/AuthContext";
import { NACK_COMPETITIONS_OF_PARTICIPANT } from "../assets/urls/djangoUrls";
import SwiperCompetitionModal from "../components/molecules/SwiperCompetitionModal";

export default function CompetitionsPage() {

    const { api } = useAuth()
    const location = useLocation();
    const [nackCompetitions, setNackCompetitions] = useState();
    const [modalVisible, setModalVisible] = useState(true);
    const [shownCompetition, setShownCompetition] = useState();
    const [lastRefresh, setLastRefresh] = useState(-1);

    const loadNackCompetitions = () => {
        api.get(NACK_COMPETITIONS_OF_PARTICIPANT)
            .then(response => {
                setNackCompetitions(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        loadNackCompetitions();
        setModalVisible(true);
    }, []);

    useEffect(() => {
        if (location.state?.refresh !== lastRefresh) {
            setShownCompetition(null)
            setLastRefresh(location.state?.refresh);
        }
    }, [location.state]);



    const handleCloseSwiper = (ackCompetitionsIndex) => {
        if (ackCompetitionsIndex > 0) {
            const ackCompetitions = nackCompetitions.slice(0, ackCompetitionsIndex);
            api.put(NACK_COMPETITIONS_OF_PARTICIPANT, ackCompetitions)
                .then(response => {
                    console.log("ACK RESPONSE", response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        setModalVisible(false);
    }

    return (
        <>
            <SwiperCompetitionModal
                isOpen={(!!nackCompetitions && modalVisible)}
                onClose={(ackCompetitionsIndex) => handleCloseSwiper(ackCompetitionsIndex)}
                data={nackCompetitions}
            />
            {!shownCompetition ? (
                <CompetitionComposer setShownCompetition={setShownCompetition} />
            ) : (
                <Competition data={shownCompetition} />
            )}
        </>

    );
}

