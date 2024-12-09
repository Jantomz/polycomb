# Polycomb Design Document

Welcome to the design document for Polycomb. This markdown file will provide insight into why I made the design choices I made and a rough overview of using the application.

## NOTE

Polycomb is more so a functionality application, and so it has many many parts to it that were unable to be in the live demo.
Examples are creating posts and practicing wordlists.

## Design Choices

There are a few categories of design choices, which are split into many more. Here is the rough tree:

- **Tech Stack**
  - Frontend
    - UI/UX
      - Placement and Styling
      - Responsivity
    - Authentication
    - File Structure and Atomic Design
    - Hooks
      - useApi
      - useAuth
      - useCSV
    - Pages
      - States and UseEffects
    - Routes
  - Backend
    - Controllers
      - File Controllers
      - General Controllers
    - Models
    - Routes
      - General Routes
      - Routing Safety
    - Data
    - .env

### Tech Stack

I decided on the tech stack, MERN, because it is very flexible and I have experience using it with $0 costs. Being able to have very little friction in getting an application up and running was a prime reason I chose MERN. However, I also have firebase authentication as I have used MERN for authentication through JWT and session management, though it was just too finicky, so I decided to learn how to make use of firebase authentication. MongoDB’s very simple noSQL design and ability to query through nodeJs smoothly attracted me to using it. Additionally, I have experience with MongoDB Atlas, and so I knew I would be able to use it free of charge and get it on a remote server quite easily. The Express and NodeJs were chosen mainly because of how clean the organizational structure could be, as I have come in great contact with organizing different backend systems, and I enjoy the organization of ExpressJs much more. React was a simple choice for me, due to how smart it is with objects, as well as how important states were going to be for this project. Ever since I learned how to use states, they have been key to almost all seamless frontend components. However, I had to get use to the rendering situation with React, as the states don’t take immediate effect, but only on the next render. However, using useEffect helped this process quite a lot.

### Frontend

#### UI/UX

##### Placement and Styling

For the styling, I used Tailwindcss because of how quick and lightweight it is. In a project where I don’t have months to optimize and organize, it is paramount I don’t bog down my application with too many stylesheets. The styling is quite basic and amateur, as I am not a designer. However, I decided to go with a yellow palette for the spelling bee theme. I also decided to make it more squarish, as that appeals more to a management software than something too modern looking. The placement of objects throughout the page is more so what came naturally to me. The side navbar seemed to make the most sense for the amount of things available to be used. However, the sidebar did have to end up on top for the responsive design.

##### Responsivity

With the need to make things responsive in the design, I opted for more containerized components, which I could scale as the screen size changed. Just using Tailwindcss to make the application responsive was very simple and helpful. This solidifies my choice with Tailwindcss. There is also just a basic need for responsive design nowadays, especially with mobile, so that is what guided me towards a responsive design.

#### Authentication

I used firebase authentication to perform the brunt of authentication. This was decided because I knew that coding up an authentication system from scratch is really not the point of programming in this case, because for me, I had a goal for my program, so being efficient with the tools I use would be paramount. Thus, I chose firebase authentication. Also, I know firebase authentication has free perks, and I would be able to use it quite seamlessly with my design. The main interesting design choice I made with authentication is the choice to create a database object for the user, despite the user already being in firebase auth. The reason for this choice was because a user needed to store more information that just a simple authentication sequence, so I connected the database with the firebase authentication service by using the uid (user id) as a property in the database user. An interesting situation was that I wasn't able to override the mongoDB \_id property, so I just set a new one and made it more primary.

#### File Structure and Atomic Design

The file structure of the frontend is based on component abilities + Atomic Design. Atomic design focuses on using components (atoms, molecules, components and pages) to create a web page. I only went one level deep with some components, as the rest may be better for the long run and more efficient, though not as time-efficient for this project. Thus, I decided to have components with different abilities in different folders. The other way I organized the files was through component abilities, which led to the “hooks” folder. This was a group of helper functions that can be used and called like a toolkit throughout the application. The other big group of files I have are pages. These are components that would be actually rendered in the application, as opposed to rendered from a different component. These pages are the literal pages of the application. However, some are nested in groups like ‘admin’, ‘auth’, ‘user’ or just the root. The reason I did this separation was so that it is easier to find the different pages of the application when adding more to the codebase, since the folders denoted the path to get there from the browser and also its purpose. The pages that concerned a specific competition for an admin were stored in ‘admin/competition’ and for users it would be ‘user/competition’. The logic is pretty strong. For the pages directly in the pages folder, they are for all application users, to view different posts, schedules or otherwise from a competition. They are more out as users and admins have the same view of these pages.

##### Hooks

###### useApi

useApi is a huge file, though the explanation is quite short and sweet. It is simply a “toolkit” that can be called upon throughout the application so that it can use specific functions within the toolkit. useApi can be called and specific functions within can be used. This is just a simple abstraction, though just in a separate folder. However, all the functions in useApi have something in common, they all fetch and use the API. Hopefully that is obvious, and hopefully the reason for my decision to go with such a system is obvious. It is easier to group things that are alike then not. I could have gone even further and split up useApi into different hooks that used API’s for different purposes, as useApi got pretty large. However, I decided to keep it together for the sake of speed in creation. If I had more time, I would certainly split it up. Another design choice I made in useApi that is interesting is that I abstracted out the actual apiRequest to another function within useApi, so that the preprocessing and error handling would be separate from the api calling. This choice was made for the sake of making things easier on the eyes + efficiency in the number of lines I had to write. The final interesting design choice I made was putting the base url in a constant above. I did this so that later on I could switch the url out for something else if needed, as well as for the testing scene.

###### useAuth

This one is a very quick explanation. The authentication system followed the documentation of firebase authentication, and so it was designed that way. It is simply a hook to grab the authenticated user.

###### useCSV

This hook is interesting as it does processing on the frontend as opposed to pushing it to the backend. It essentially parses csv files and feeds the data back out. This system was chosen for the frontend as it would be too cumbersome to send an entire file out to the backend, process it and then send it back if it can be done without too much bearing on the frontend. There is lots of preprocessing of the csv data, as quotation marks and commas are an extreme annoyance, and preservation of the characters needs to be retained. Returning an array of words is the whole function of the hook, and having this capability allows the users of the application to upload an entire csv to upload the wordlist instead of manually typing each individual word.

#### Pages

##### States and useEffects

The pages exist with the basic intention to show information to the user in a format that is as friendly as possible. Thus, the actual jsx component had not too many design choices, and the useState/useEffect were more intensive in design/logic. The useEffect in many of the pages is missing dependencies in their dependency array on purpose, as the functions within only want to be triggered on first rendering, not every time the dependencies change. Now to explain the groups of pages. Many of the “view” pages are similar, where they fetch information using the useApi hook and store it in states to then display it through mapping over an object. The “edit” pages are a bit more interesting, as they not only retrieve and store the information, but they allow updates by the user, which creates the need for a function to be triggered to submit the updates to the database later on.

#### Routes

The routes designs were technically quite simple. Each route would provide two possibilities to a renderRoute function, which would then decide what to do depending on the user. This is quite simple, and the choice was made because of its simplicity. The one other design choice made was to navigate to /login in the renderRoute function instead of the actual route, as all routes could lead to /login if granted the right conditions.

### Backend

#### Controllers

##### File Controllers

This looks quite technically interesting, and I believe it is. Two things are occurring for the backend to make the files (audio and pdf) properly saved in the mongoDB. The first thing is using GridFS as a storage mechanism to split the chunks of the data up and store them. This creates the uploads.chunks and uploads.file collections in the DB. These are where the actual files live. The design choice to store the ids in a separate file object was quite helpful, as more metadata could be stored with the file. Having access to the file’s metadata without needing to access the file through GridFS was helpful. I decided to have the extra metadata in case of future scaling or otherwise. The actual deleting of the files then had to have multiple effects, where the chunks and file were deleted while also deleting the actual database object. The streaming of the files is also quite interesting, as the direct use of the api urls would provide the right data to stream the file on the frontend.

##### General Controllers

These controllers were just the basic functions that did CRUD, along with other small tasks to alter the database. I decided to split them into controllers so that organizationally it would be easier to access the right files and functions. There is a lot of error handling throughout the controllers to ensure data is placed correctly. However, I would like to admit these controllers are not foolproof, as they are not extremely rigorous in checking the inputted data. This is something I would like to change for the future, though for now this works. As long as the user isn’t extremely malicious, this application will be fine. However, it is certainly not ready for production because of this fact/flaw. An example of this bad design would be accepting the fields of the templates as just an object and directly replacing it. I patched this flaw a bit, though it would be very possible to create a template that had field types that were impossible, which would break the form itself. The good thing is that the entire server will never crash as rigorous all or nothing error handling is done, so no matter what, nothing will permanently break. It will just send errors for specific components.

#### Models

The models were designed with intent on how they will be connected with each other. I decided that some of the components will be remembered by the user, while other components will remember the user. There is a difference. An example is how the posts remember the competition while the competition has no clue it has posts. This is done, as it is helpful for getting the posts through the competitionCode, instead of getting all the postIds from the competition and then querying for the posts one by one. At the end of the day, they have similar effects with databases that are quite small, though I decided on a convention and have stuck with it. Some of the models also just hold arrays of any data type, this is all by convention and actually a danger to the application for dirty data. I would protect against this in future updates, though this time I would love to acknowledge that this program does have these flaws, and that it is part of the continuous development process. There is truly no completion, just revisions. The models may have to be expanded in later times, and with MongoDB, it is not too big of an issue, so I worried very little about the models, and just decided on them through a diagram of models and understanding how they connected. Like how one competition has many posts, and it has a wordlist, which has many words etc. I decided to store some data I am not quite accessing yet, like the timestamps for most things, as it is great metadata. The creatorId is also great metadata to have, in case a crime is committed on the database and we can track which id is linked to it. These are all design choices I made to prevent future crimes!!

#### Routes

##### General Routes

The general routing system is quite simple. The routes all call to a specific function/controller, and the routes are bundled into an express router that gets used by the app in the server file. The only design choice I would like to bring attention to is the use of parameters for routes that don’t need much protection. Although they don’t need much protection, it is still great to keep them under a bit of control, which I will explain in the next section.

##### Routing Safety

When I typically work with routes, in express or another framework, I always have some sort of middleware that prevents unauthenticated users or specific user groups from attacking/accessing the routes. This is NOT the case this time. The routes are completely open to be accessed, and the only thing protecting them is obscurity. This is a design flaw I hope to correct in the very near future, as this project will be actually used for competitions and storing user payment information, which is sensitive. I normally use something like AWS Amplify and the user pools to ensure a user is authenticated and part of the right group to access a route. However, this time, there is barely any protection. I will certainly have to add protection on the routing where only admins can access certain routes while only authenticated users can access the rest. I hope to close up and protect these endpoints soon. I understand if I get docked for security issues in the code, though I am just stating that I am aware of these issues and understand how to solve them. There is another option with middleware, where I can use bearer tokens after logging in. I believe firebase authentication can provide this level of security, so I will explore them as a next step.

### Data

The data folder with text files seems quite bizarre, but it is there out of simplicity. The information is not sensitive, and it was a fun experiment on language frequency data. I used nltk quite a lot when working with python, and so I just downloaded a bunch of their corpi and copy pasted them unformatted. I then used it as a point of reference to get frequencies of words, which correspond loosely to difficulty. The word bank is also a project I worked on in the past with my brother. This was a project for spelling bee word list generation from word scraping. I just took the txt file and used it as a point of reference for the wordlist generation in my own application. This is a bonus segment so I hope it is ok if I in fact took it from a past project I worked on. However, the actually processing and usage of the data is my own code, it’s just the actual text file is not.

### .env

I decided to leave the .env in the github repository for the sake of ease when locally hosting the entire site. I did not want TFs to have to make a mongoDB database. I am ok with this uri being public, the password and username are not linked to any other accounts I own :) I understand the risks and have made a design choice to keep the .env for the ease of CS50 staff!

## Overview of the Application

Polycomb has two main ways to use it, as an admin, or as a user/speller. As an admin, you can create competitions and add details to them. You can upload files and wordlists for spellers to access. As a speller/user, you can access all the information and files the administrator has put up, as well as practice the word lists provided :) The video linked in the README will give a fun demo.

## Overview on Using the Wordlist Functionalities

Following login as an admin, you will be met with the possibility to use wordlist tools. The wordlists must follow the format of having these headers: "Word, Part of Speech", "Pronunciation", "Definition", "Etymology", "Sentence"
As long as those headers exist, then the wordlist should be acceptable. Please make sure its the right file type. It helps with processing

## Overview on Other Functionalities

All other functionalities should be a bit more understandable. Just feel free to explore, the components are more spelling bee based, so those unfamiliar with the world may be a bit confused. Some quick tips:

- The upload of files as an admin is just that, uploading a pdf. However, it's functionality can range from sending wordlists to sending certificates for spellers. Make sure to click "Upload" to ensure the pdf gets uploaded.
- Practicing the word lists is a bit finicky, though it should work only for words with audio. If a wordlist has no audio, none of the words will ever show up. This is not quite user friendly unfortunately.
- Creating a new post as an admin, you can add image urls into the image blocks to show them in the post. The posts and images are interwoven.
- Make sure to save when you edit any schedules, timelines or other things.

## Notes on Goals:

I achieved all goals that I made, except for intentionally leaving out payment and the leaderboard system. The payment will not be added here, as that contains actually API keys I can't disclose, and so would make the local version quite difficult. The leaderboard system was avoided as that is actually skewed against the rules of a spelling bee, where the spellers can technically compete before the competition. However, since I left these stretch goals out, I decided to make the editing and audio/file components of the application more robust, which I hope makes up for it. The ability to edit posts, templates, schedules and other things is quite neat, and I did not think about adding that before.
