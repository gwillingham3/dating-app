import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Onboarding() {
	
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const navigate = useNavigate();
	
	const [formData, setFormData] = useState({
		user_id: cookies.UserId,
		first_name: "",
		last_name: "",
		dob_day: "",
		dob_month: "",
		dob_year: "",
		show_gender: false,
		gender_identity: "other",
		sexual_preference: "everyone",
		email: cookies.Email,
		profile_image: "",
		about: "",
		matches: []
	});
	
	const authToken = true;
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put("http://localhost:8000/user", { formData });
			const success = response.status == 200;
			if (success) {
				navigate("/swiper");
			}
		} catch (error) {
			console.log("Oopsie");
			console.log(error);
		}
		console.log("Submitted!");
	}
	
	const handleChange = (e) => {
		const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		const name = e.target.name;
		
		setFormData((prevState) => ({
			...prevState,
			[name] : value
		}))
		console.log("Value of: " + name + " is now: " + value);
	}
	
	console.log(formData);
	
	return (
		<>
			<div className="container onboarding">
				<h3>Create Account</h3>
				
				<form onSubmit={handleSubmit}>
					<section>
						<label htmlFor="profile_image">Profile Image URL</label>
						<input id="profile_image" type="url" name="profile_image" value={""} onChange={handleChange}/>
						<div className="photo-container">
						{ formData.profile_image && <img src={formData.profile_image} alt="profile image"/> }
						</div>
					</section>
					
					<section>
						<label htmlFor="first_name">First Name</label>
						<input id="first_name" type="text" name="first_name" required={true} value={formData.first_name} onChange={handleChange}/>
						<label htmlFor="last_name">Last Name</label>
						<input id="last_name" type="text" name="last_name" required={true} value={formData.last_name} onChange={handleChange}/>
						
						<label>Birthday</label>
						<div className="multi-input container">
							<label htmlFor="dob_day">Day of birth</label>
							<input id="dob_day" type="number" name="dob_day" required={true} placeholder="DD" value={formData.dob_day} onChange={handleChange}/>
							<label htmlFor="dob_month">Month of birth</label>
							<input id="dob_month" type="number" name="dob_month" required={true} placeholder="MM" value={formData.dob_month} onChange={handleChange}/>
							<label htmlFor="dob_year">Year of birth</label>
							<input id="dob_year" type="number" name="dob_year" required={true} placeholder="YYYY" value={formData.dob_year} onChange={handleChange}/>
						</div>
						
						<label>Gender</label>
						<div className="multi-input container">
							<input id="man_gender_identity" type="radio" name="gender_identity" value="male" onChange={handleChange} checked={formData.gender_identity === "male"}/>
							<label htmlFor="man_gender_identity">Man</label>
							<input id="woman_gender_identity" type="radio" name="gender_identity" value="female" onChange={handleChange} checked={formData.gender_identity === "female"}/>
							<label htmlFor="woman_gender_identity">Woman</label>
							<input id="other_gender_identity" type="radio" name="gender_identity" value="other" onChange={handleChange} checked={formData.gender_identity === "other"}/>
							<label htmlFor="other">Other</label>
						</div>
						
						<label>Sexual Preference</label>
						<div className="multi-input container">
							<input id="man_sexual_preference" type="radio" name="sexual_preference" value="male" onChange={handleChange} checked={formData.sexual_preference === "male"}/>
							<label htmlFor="man_sexual_preference">Men</label>
							<input id="woman_sexual_preference" type="radio" name="sexual_preference" value="female" onChange={handleChange} checked={formData.sexual_preference === "female"}/>
							<label htmlFor="woman_sexual_preference">Women</label>
							<input id="everyone_sexual_preference" type="radio" name="sexual_preference" value="everyone" onChange={handleChange} checked={formData.sexual_preference === "everyone"}/>
							<label htmlFor="everyone">Everyone</label>
						</div>
						
						<label htmlFor="show_gender">Display gender on my profile?</label>
						<input id="show_gender" type="checkbox" name="show_gender" onChange={handleChange} checked={formData.show_gender}/>
						<label htmlFor="about">Bio</label>
						<input id="about" type="text" name="about" required={true} placeholder="Write your life story here..." value={formData.about} onChange={handleChange}/>
						<input type="submit" />
					</section>
				</form>
			</div>
		</>
	);
}	

export default Onboarding;