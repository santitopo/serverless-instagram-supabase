Project done using:
- Supabase as a Backend as a Service provider
  - Relational Database
  - Auth Provider
  - Row level security
  - Storage
  - Edge functions (Slack notifications)
- React for frontend

## Implemented functionalities:

- User Registration
- With email and password
- With magic link
- Login:
	- With email and password
	- With magic link
- Logout.
- View list of posts (feed), displaying for each post its image, username, posting date, as well as the number of likes and comments. Sorted by creation date with pagination showing a maximum of 5 items per page.
- User Search, users can search for other registered users in the app, viewing their full name, username, email, and profile picture.
- View user profile, both for oneself and other users.
- Create a post, users can create a post from the home page, uploading the image and its description.
- View comments, users can see comments on a post, sorted by creation date, showing the author and content of each comment.
- Create comment, users can also add comments to different posts.
- Like/unlike, users can like a post and also remove the like.
- Delete post, a user can delete their own posts.
- Activity Report / Rankings, a user can view certain rankings within the app, including:
	- Top 5 users with the most posts and their quantity.
	- Top 5 posts with the most likes and the number of likes they have.
	- Top 5 users with the most comments and their quantity.
- Post creation notifications, the ORT is notified every time a post is uploaded, through an integration with Slack, where a message is sent to a channel each time a new post is created.


## Non-functional requirements:

- Access control with Row Level Security.
- Configuration and secret management, it works with environment variables kept outside version control.
- System distribution, the system is hosted using Firebase, specifically Firebase Hosting.

## Screenshots

<img width="700" alt="image" src="https://github.com/santitopo/serverless-instagram-supabase/assets/43559181/72aa03dc-54b1-474d-8728-2ebf0f86d402">

<img width="700" alt="image" src="https://github.com/santitopo/serverless-instagram-supabase/assets/43559181/dee1ec46-c3a1-4f0b-8b21-d824ffaa1c33">

<img width="300" alt="image" src="https://github.com/santitopo/serverless-instagram-supabase/assets/43559181/2f1d5f54-dbd4-458b-83d3-7e2ef44f54cb">




## Project Execution

First, navigate to the root folder of the project.
Once in the root folder, execute the following commands to run the application:

1.  `npm ci`
2.  `npm run start`


## Public Link

https://instagram-serverless.web.app
