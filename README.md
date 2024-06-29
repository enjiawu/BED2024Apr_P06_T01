# ReThink

## Assignment for IT - Back-end Development (AY24/25)
## Team Members
| Name | Student ID |
| --- | --- |
| Wu Enjia | S10256978E |
| Joseph Wan | S10262528G |
| Timothy Chai | S10256132A |
| Xue Wenya | S10262410A |


## Overview
This project is a backend-focused assignment that includes a simple front-end interface. The primary goal of this project is to design and implement a RESTful API using express.js to perform CRUD (Create, Read, Update, Delete) operations on a database. This project was developed by a team of four members, each contributing to different features and functions.  
  
[Figma Sitemap](https://www.figma.com/board/nv7S5KvsDjxtC6Kox3NVgx/Untitled?node-id=1-127&t=4SBsDU8YbP7SYPoj-1)  
[Figma Wireframe](https://www.figma.com/design/H7ZDSVtAHVsLTA5eA0g6Le/BED_Wireframe?node-id=0-1&t=4SBsDU8YbP7SYPoj-1)

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

> * **API Endpoints**:
>   + **GET /communityforum**: Retrieve all posts from the community forum.
>   + **GET /communityforum/:id**: Retrieve a specific post by its ID.
>   + **POST /communityforum**: Create a new post with provided data.
>   + **PUT /communityforum/:id**: Update an existing post identified by its ID.
>   + **DELETE /communityforum/:id**: Delete a post based on its ID.
>   + **GET /communityforum/search**: Search posts by a specific term.
>   + **GET /communityforum/post-count**: Get the total count of posts.
>   + **GET /communityforum/posts-by-topic/:id**: Retrieve posts filtered by a specific topic ID.
>   + **GET /communityforum/likes-count**: Get the total count of likes across all posts.
>   + **GET /communityforum/sort-by-likes-desc**: Retrieve posts sorted in descending order by likes.
>   + **GET /communityforum/sort-by-likes-asc**: Retrieve posts sorted in ascending order by likes.
>   + **GET /communityforum/sort-by-newest**: Retrieve posts sorted from newest to oldest.
>   + **GET /communityforum/sort-by-oldest**: Retrieve posts sorted from oldest to newest.


* **Community Forum Topic**:
  + Implemented endpoints for managing community forum topics.
  + Implemented UI to allow users to view trending topics

> * **API Endpoints**:
>   + **GET /communityforum/topics**: Retrieve all topics available in the community forum.
>   + **GET /communityforum/topics/:id**: Retrieve a specific topic by its ID.
>   + **GET /communityforum/topic-count**: Get the total count of topics.


### Team Member 2 - Joseph Wan
* **Community Forum**:
	+ Implemented...
* **API Endpoints**:
	+ **GET /communityforum**: Retrieve...

### Team Member 3 - Timothy Chai
* **Community Forum**:
	+ Implemented...
* **API Endpoints**:
	+ **GET /communityforum**: Retrieve...

### Team Member 4 - Xue Wenya
* **Community Forum**:
	+ Implemented...
* **API Endpoints**:
	+ **GET /communityforum**: Retrieve...

## Setup and Installation
**Getting Started:**

**Prerequisites:**
* [Node.js and npm](https://nodejs.org/en/download/package-manager) installed on your system
* [Microsoft SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16) installed on your system

**Installation:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/enjiawu/BED2024Apr_P06_T01.git
   
2. **Start the server::**

   ```bash
   npm start
   
## Technologies Used
**1. [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)**
   - This project uses HTML as the markup language.

**2. [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)**
   - This project uses CSS for styling and formatting.

**3. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**
   - This project uses JS to ...
     
## Troubleshooting and Debugging
* [Provide any troubleshooting tips or debugging techniques]

## Conclusion
This project demonstrates a basic backend API with CRUD functions and a simple frontend interface. The API is designed to be scalable and secure, with proper error handling and validation.

## Credits
### Content
- The text for the "" Page was referenced from [Title](link)
  
### Media
- The photos used in this site were obtained from:
  - https://unsplash.com/photos/green-plant-x8ZStukS2PM?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash
  - https://www.freepik.com/free-photo/group-businesspeople-fist-bumping-desk_2555046.htm#query=sustainable%20community&position=42&from_view=keyword&track=ais_user&uuid=a101f4c7-2653-4ee9-a1fb-a44d6165bbbf 
  - https://www.vecteezy.com/photo/7950886-small-plant-growing-in-morning-light-at-garden-concept-earth-day

### Acknowledgement
- We received inspiration for this project from:
  - E
