# ReThink

## Assignment for IT - Back-end Development (AY24/25)
## Team Members
| Name |
| --- |
| Enjia |
| Joseph |
| Timothy |
| Wenya | 


## Overview
This project is a backend-focused assignment that includes a simple front-end interface. The primary goal of this project is to design and implement a RESTful API using express.js to perform CRUD (Create, Read, Update, Delete) operations on a database. This project was developed by a team of four members, each contributing to different features and functions.  
  
For detailed wireframes and sitemap, refer to:
- [Figma Sitemap](https://www.figma.com/board/nv7S5KvsDjxtC6Kox3NVgx/Untitled?node-id=1-127&t=4SBsDU8YbP7SYPoj-1)
- [Figma Wireframe](https://www.figma.com/design/H7ZDSVtAHVsLTA5eA0g6Le/BED_Wireframe?node-id=0-1&t=4SBsDU8YbP7SYPoj-1)


### Welcome to Rethink

Rethink is a web platform designed to foster community engagement and promote sustainability. It offers a variety of features aimed at empowering users to contribute positively to environmental conservation efforts. From educational articles on sustainability to practical tools like a carbon footprint calculator, Rethink aims to educate and inspire action.

#### Key Features:

- **Community Forum**: Engage with like-minded individuals, share ideas, and discuss important topics related to sustainability.
  
- **Events Management**: Host and participate in events that promote environmental awareness and sustainable practices.
  
- **Donation Portal**: Support charitable causes dedicated to environmental conservation through secure and convenient online donations.
  
- **Carbon Footprint Calculator**: Assess your environmental impact with a user-friendly tool that provides personalized tips for reducing carbon emissions.
  
- **User Authentication**: Secure sign-up and login processes ensure a personalized experience tailored to each user's interests.

#### How It Works:

1. **Explore**: Navigate through articles, forums, and events to discover valuable information and opportunities to get involved.
   
2. **Engage**: Participate in discussions, host or attend events, and contribute to a community dedicated to sustainability.
   
3. **Act**: Use the carbon footprint calculator to understand your impact, donate to causes that matter, and take steps towards a more sustainable lifestyle.

## Contributions
### Team Member 1 - Wu Enjia
* **Community Forum**:
  + Implemented endpoints for managing community forum posts and topics.
  + Implemented UI to allow users to view community forum posts

**API Endpoints**:
	+ **GET /communityforum** - Retrieve all posts from the community forum.
	+ **GET /communityforum/:id**: Retrieve a specific post by its ID.
	+ **POST /communityforum**: Create a new post with provided data.
	+ **PUT /communityforum/:id**: Update an existing post identified by its ID.
	+ **DELETE /communityforum/:id**: Delete a post based on its ID.
	+ **GET /communityforum/search**: Search posts by a specific term.
	+ **GET /communityforum/posts-by-topic/:id**: Retrieve posts filtered by a specific topic ID.
	+ **GET /communityforum/likes-count**: Get the total count of likes across all posts.
	+ **GET /communityforum/sort-by-likes-desc**: Retrieve posts sorted in descending order by likes.
	+ **GET /communityforum/sort-by-likes-asc**: Retrieve posts sorted in ascending order by likes.
	+ **GET /communityforum/sort-by-newest**: Retrieve posts sorted from newest to oldest.
	+ **GET /communityforum/sort-by-oldest**: Retrieve posts sorted from oldest to newest.


* **Community Forum Topic**:
  + Implemented endpoints for managing community forum topics.
  + Implemented UI to allow users to view trending topics

* **API Endpoints**:
  + **GET /communityforum/topics**: Retrieve all topics available in the community forum.
  +   + **GET /communityforum/topics/:id**: Retrieve a specific topic by its ID.
  + **GET /communityforum/topic-count**: Get the total count of topics.


### Team Member 2 - Joseph Wan
* **Events Page**:
	+ Implemented endpoints to retrieve events
	+ Implemented front-end to allow users to view events on the main event page.
* **API Endpoints**:
	+ **GET /events**: Retrieve all events for the event page.
	+ **GET /events/count**: Retrieve event count
	+ **GET /events/search**: Search function to search for events
	+ **GET /events/status/:status**: Retrieve events filtered by a specific status


* **Participate Events Page**:
    + Implemented endpoints to view information of the specific event
    + Implemented front-end to allow users to view the specific event
* **API Endpoints**:
    + **GET /events/:id**: Retrieve a specific event and its contents by its ID


* **Host Event Page**:
    + Implemented endpoint to add/post events with the provided user data such as: event title, description..etc
	+ Implemented front-end to allow users to fill in the relevant fields needed to host their event
* **API Endpoints**:
    + **POST /events**: Create new events with the provided data

### Team Member 3 - Timothy Chai
* **Post Report**:
	+ Implemented endpoints to retrieve and delete forum post reports.
 	+ Implemented front-end to allow administrators to manage forum post reports.
* **API Endpoints**:
	+ **GET /reports**: Retrieve all community forum post reports.
 	+ **GET /reports/:id**: Retrieve a specific community forum post report.
  	+ **DELETE /reports/:id**: Delete a specific community forum post report.
  
* **Contact Us Submission**:
	+ Implemented endpoints to retrieve messages.
 	+ Implemented front-end to allow administrators to view and reply to messages.
* **API Endpoints**:
	+ **GET /messages**: Retrieve all messages.
 	+ **GET /messages/:id**: Retrieve a specific message.

* **Contact Us Reply**:
	+ Implemented endpoints to retrieve and add administrator replies.
* **API Endpoints**:
	+ **GET /replies/:id**: Retrieve a specific reply.
 	+ **POST /replies**: Create a new reply based on data input by administrator.

### Team Member 4 - Xue Wenya
* **User Accounts**:
	+ Implemented endpoints for manage user account.
 	+ Implemented UI to allow user to register and login their account. 
* **API Endpoints**:
	+ **POST /users**: Create new account based on data input by user.
 	+ **POST /users/login**: Authenticate user credentials and log in the user.
  	+ **GET /users/:id**: Retrieve specific user account details.

* **Contact Us Submissions**:
	+ Implemented endpoints for manage contact form.
 	+ Implemented UI to allow user to submit contact form. 
* **API Endpoints**:
	+ **POST /messages**:Create a new message based on data input by user in the contact us form.

## Setup and Installation
**Getting Started:**

**Prerequisites:**
* [Node.js and npm](https://nodejs.org/en/download/package-manager) installed on your system
* [Microsoft SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16) installed on your system

**Installation:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/enjiawu/BED2024Apr_P06_T01.git
   
2. **Install Dependencies:**
   
   ```bash
   npm install axios bcrypt bcryptjs body-parser dotenv env express joi mssql nodemon swagger nodemailer swagger-autogen swagger-ui-express multer path jsdom @mozilla/readability stripe

3. **Start the server::**

   ```bash
   npm start
   
## Technologies Used
1. [@mozilla/readability](https://www.npmjs.com/package/@mozilla/readability)
   - A library to extract readable content from web pages.

2. [axios](https://www.npmjs.com/package/axios)
   - Promise based HTTP client for the browser and node.js.

3. [bcrypt](https://www.npmjs.com/package/bcrypt)
   - A library to help hash passwords.

4. [bcryptjs](https://www.npmjs.com/package/bcryptjs)
   - Optimized bcrypt in JavaScript with zero dependencies.

5. [body-parser](https://www.npmjs.com/package/body-parser)
   - Node.js body parsing middleware.

6. [dotenv](https://www.npmjs.com/package/dotenv)
   - Loads environment variables from a `.env` file into `process.env`.

7. [env](https://www.npmjs.com/package/env)
   - A library for managing environment variables.

8. [express](https://www.npmjs.com/package/express)
   - Fast, unopinionated, minimalist web framework for node.

9. [joi](https://www.npmjs.com/package/joi)
   - Object schema validation.

10. [jsdom](https://www.npmjs.com/package/jsdom)
    - A JavaScript implementation of various web standards, notably the WHATWG DOM and HTML Standards.

11. [jwt-decode](https://www.npmjs.com/package/jwt-decode)
    - A small library that decodes JSON Web Tokens (JWTs) without verifying the signature.

12. [mssql](https://www.npmjs.com/package/mssql)
    - A Microsoft SQL Server client for Node.js.

13. [multer](https://www.npmjs.com/package/multer)
    - Middleware for handling `multipart/form-data`, which is primarily used for uploading files.

14. [nodemailer](https://www.npmjs.com/package/nodemailer)
    - Easy as cake email sending from your Node.js applications.

15. [nodemon](https://www.npmjs.com/package/nodemon)
    - A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

16. [path](https://www.npmjs.com/package/path)
    - A utility module for working with file and directory paths.

17. [stripe](https://www.npmjs.com/package/stripe)
    - The Stripe Node.js library for integrating Stripe's API.

18. [swagger](https://www.npmjs.com/package/swagger)
    - A tool for implementing the OpenAPI Specification (formerly known as Swagger Specification).

19. [swagger-autogen](https://www.npmjs.com/package/swagger-autogen)
    - A library to autogenerate a Swagger documentation.

20. [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
    - Swagger UI for express.js projects.

## Credits
### Media
- The photos used in this site were obtained from:
  - https://unsplash.com/photos/green-plant-x8ZStukS2PM?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash
  - https://www.freepik.com/free-photo/group-businesspeople-fist-bumping-desk_2555046.htm#query=sustainable%20community&position=42&from_view=keyword&track=ais_user&uuid=a101f4c7-2653-4ee9-a1fb-a44d6165bbbf 
  - https://www.vecteezy.com/photo/7950886-small-plant-growing-in-morning-light-at-garden-concept-earth-day


