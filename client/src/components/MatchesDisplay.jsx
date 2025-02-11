import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const MatchesDisplay = ( { matches, setClickedUser } ) => {
	
	const [matchedProfiles, setMatchedProfiles] = useState(null);
	const [cookies, setCookie, removeCookie] = useCookies(['user'])
	
	const matchedUserIds = matches.map( ({ user_id }) => user_id );
	const userId = cookies.userId;
	
	const getMatches = async () => {
		
		try {
			const response = await axios.get("http://localhost:8000/matches", { params: { userIds: JSON.stringify(matchedUserIds) } });
			setMatchedProfiles(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	useEffect(() => {
		getMatches();
	}, []);
	
	const filteredMatchedProfiles = matchedProfiles?.filter(matchedProfile => matchedProfile.matches.filter(profile => profile.user_id == userId).length > 0)
	
	return (
		<div className="matches-container">
			{filteredMatchedProfiles?.map((match, _index) => (
				<div key={{_index}} className="match-card row" onClick={() => setClickedUser(match)}>
					<div className="img-container col-md-4">
						<img src={match?.profile_image} alt={match?.first_name + " profile"} className="match-img-container"/>
					</div>
					<div className="match-name-container col-md-8">
						<h5>{match?.first_name}</h5>
					</div>
				</div>
			))}
		</div>
	);
}

export default MatchesDisplay