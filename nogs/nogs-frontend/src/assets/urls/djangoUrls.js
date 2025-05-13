
//type
export const GENERATE_GAME_URL = "http://127.0.0.1:8000/type/api/generate";
export const SUBMIT_RESULT_URL = "http://127.0.0.1:8000/type/api/submit";

//accounts
export const SIGNUP_URL = "http://127.0.0.1:8000/accounts/api/register/";
export const LOGIN_URL = "http://127.0.0.1:8000/accounts/api/login/";
export const LOGOUT_URL = "http://127.0.0.1:8000/accounts/api/logout/";
export const ME_URL = "http://127.0.0.1:8000/accounts/api/me/";

//competition
export const COMPETITIONS_URL = "http://127.0.0.1:8000/competition/api/competitions";
export const NACK_COMPETITIONS_OF_PARTICIPANT = "http://127.0.0.1:8000/competition/api/participant/competitions";
export const COMPETITION_DETAIL_URL = (id) => "http://127.0.0.1:8000/competition/api/competition/" + id
export const COMPETITION_PARTICIPANTS_URL = (id) => `http://127.0.0.1:8000/competition/api/competition/${id}/participants`
export const COMPETITION_TRY_URL = (id) => `http://127.0.0.1:8000/competition/api/competition/${id}/try`
export const COMPETITION_SUBMIT_URL = (id) => `http://127.0.0.1:8000/competition/api/competition/${id}/submit`

//teams
export const TEAMS_URL = "http://127.0.0.1:8000/Team/teams/";
export const TEAM_JOIN_URL = (id) => `http://127.0.0.1:8000/Team/teams/${id}/join/`;
export const TEAM_LEAVE_URL = "http://127.0.0.1:8000/Team/teams/leave/";
export const TEAM_DETAIL_URL = (id) => `http://127.0.0.1:8000/Team/teams/${id}/`;
export const CREATE_TEAM_URL = "http://127.0.0.1:8000/Team/teams/create/";

