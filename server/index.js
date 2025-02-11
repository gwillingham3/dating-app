const PORT = 8000

const express = require('express');
const { MongoClient } = require('mongodb');
const { v1: uuidv1 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const uri = "mongodb+srv://gerard:mypassword@cluster0.fqr6m.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, }));

app.get("/", (req, res) => {
	res.json("Hello World!");
})

// Collects email and password to create a new user
app.post("/signup", async (req, res) => {
	const client = new MongoClient(uri);
	const { email, password } = req.body;
	
	const generatedUserId = uuidv1();
	const hashedPassword = await bcrypt.hash(password, 10);
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const existingUser = await users.findOne({ email });
		
		if (existingUser) {
			console.log("User already exists");
			return res.status(409).send("User already exists. Please log in");
		}
		
		const sanitizedEmail = email.toLowerCase();
		const data = {
			user_id: generatedUserId,
			email: sanitizedEmail,
			password: hashedPassword
		}
		const insertedUser = await users.insertOne(data);
		const token = jwt.sign(insertedUser, sanitizedEmail, { expiresIn: 60*24 });
		
		res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail });
	} catch (error) {
		console.log("Oopsie");
		res.send("Oopsie");
	} finally {
		await client.close();
	}
	
})

// Collects email and password inputs to log in as an existing user
app.post("/login", async (req, res) => {
	const client = new MongoClient(uri);
	const { email, password } = req.body;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const user = await users.findOne({ email });
		const pass = user.hashed_password ? user.hashed_password : user.password;
		const passwordCheck = await bcrypt.compare(password, pass);
		
		if (user && passwordCheck) {
			const sanitizedEmail = email.toLowerCase();
			const token = jwt.sign(user, sanitizedEmail, { expiresIn: 60*24 });
			res.status(201).json({ token, userId: user.user_id, email: sanitizedEmail });
		}
		
		res.status(400).send("Wrong email/password combination");
	} catch (error) {
		console.log("Oopsie");
		console.log(error);
	} finally {
		await client.close();
	}
	
})

app.get("/user", async (req, res) => {
	const client = new MongoClient(uri);
	const userId = req.query.userId;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const query = { user_id: userId };
		const user = await users.findOne(query);
		res.send(user);
	} catch (error) {
		console.log("Oopsie");
		console.log(error);
	} finally {
		await client.close();
	}
	
})

app.put("/user", async (req, res) => {
	const client = new MongoClient(uri);
	const formData = req.body.formData;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const query = { user_id: formData.user_id };
		const updateData = {
			$set: {
				first_name: formData.first_name,
				last_name: formData.last_name,
				dob_day: formData.dob_day,
				dob_month: formData.dob_month,
				dob_year: formData.dob_year,
				show_gender: formData.show_gender,
				gender_identity: formData.gender_identity,
				sexual_preference: formData.sexual_preference,
				email: formData.email,
				profile_image: formData.profile_image,
				about: formData.about,
				matches: formData.matches
			},
		}
		const insertedUser = await users.updateOne(query, updateData);
		res.send(insertedUser);
	} catch (error) {
		console.log("Oopsie");
	} finally {
		await client.close();
	}
})

// Gets a list of users that fit a particular gender
// NOTE: Include something that converts everyone to all or unfiltered
app.get("/filter-users-by-gender", async (req, res) => {
	const client = new MongoClient(uri);
	const gender = req.query.gender;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const query = { gender_identity: gender };
		const returnedUsers = await users.find(query).toArray();
		res.send(returnedUsers);
	} catch (error) {
		console.log("Oopsie");
	} finally {
		await client.close();
	}
})

// Updates the likes for a user
app.put("/update-likes", async (req, res) => {
	const client = new MongoClient(uri);
	const { userId, likedUserId } = req.body;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		const query = { user_id: userId };
		const updateDocument = {
			$push: { matches: { user_id: likedUserId } },
		};
		const user = await users.updateOne(query, updateDocument);
		res.send(user);
	} catch (error) {
		console.log("Oopsie");
		console.log(error);
	} finally {
		await client.close();
	}
})

// aggregates the users that you have matched with (currently just gathers users that you have liked) and sends it back as an array
app.get("/matches", async (req, res) => {
	const client = new MongoClient(uri);
	const matchedUserIds = JSON.parse(req.query.userIds);
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const users = database.collection("users");
		
		const pipeline = [{
			"$match": {
				"user_id": {
					"$in": matchedUserIds
				}
			}
		}];
		const foundUsers = await users.aggregate(pipeline).toArray();
		console.log(foundUsers);
		res.send(foundUsers);
	} catch (error) {
		console.log("Oopsie");
		console.log(error);
	} finally {
		await client.close();
	}
})

app.get("/messages", async (req, res) => {
	const client = new MongoClient(uri);
	const {userId, correspondingUserId} = req.query
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const messages = database.collection("messages");
		
		const query = {
			from_userId: userId, to_userId: correspondingUserId
		};
		
		const foundMessages = await messages.find(query).toArray();
		res.send(foundMessages);
	} catch (error) {
		console.log(error);
	} finally {
		await client.close();
	}
})

app.post("/message", async (req, res) => {
	const client = new MongoClient(uri);
	const message = req.body.message;
	
	try {
		await client.connect();
		const database = client.db("app-data");
		const messages = database.collection("messages");
		const insertedMessage = await messages.insertOne(message);
		res.send(insertedMessage);
	} catch (error) {
		console.log(error);
	} finally {
		await client.close();
	}
})		

app.listen(PORT, () => console.log("server running on PORT " + PORT));