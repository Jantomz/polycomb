# Polycomb

Welcome to Polycomb, a spelling bee management software for organizations to create competitions and share information with their spellers. This manual will show you how to begin using it, as well as provide an overview of what you can do in Polycomb!

## Table of Contents

- [Introduction](#polycomb)
- [Video Demo](#video-demo)
- [Usage](#usage)
  - [A web browser via local deployment](#a-web-browser-via-local-deployment)
    - [Steps to Deploy Locally](#steps-to-deploy-locally)
    - [Account Creation](#account-creation)
  - [A web browser via polycomb.jadenzhang.com](#a-web-browser-via-polycombjadenzhangcom)
  - [A desktop application](#a-desktop-application)
- [Raw text readMe](#raw-text-readme)

## Video Demo

[Watch the video demo](https://www.youtube.com/watch?v=oagr_u9Uv2A)

This video does not cover the majority of functionalities in the application. There are many more features that can be explored using the methods provided below.

## Usage

There are three ways you can use this project:

1. A web browser via local deployment
2. A web browser via [polycomb.jadenzhang.com](http://polycomb.jadenzhang.com) (NOTE THAT GOOGLE SIGN IN DOES NOT WORK HERE)
3. A desktop application only for windows (as apple is silly with its $99 subscription program)

### A web browser via local deployment

This method is quite difficult to get started with, so if you are not comfortable with cloning GitHub repositories and working with dependencies, maybe start with the other two!

To begin, let’s take a quick look at the base structure of the project. Go to [Polycomb Repository](https://github.com/Jantomz/polycomb) to access the repository that holds Polycomb. Within this repository, you will see two different folders, one called `app` and the other called `server`. The `app` folder stores all client-side or frontend components of the application. The `server` folder stores all server-side or backend components of the application. The two folders are effectively separate apps that talk through API endpoints, established through deploying both sides. Thus, let’s get to that!

#### Steps to Deploy Locally

1. **Clone the Repository**

   - Click on the blue button on the repository called `Code`, which will open a dropdown of information to clone the repository.
   - Choose `HTTPS` if you don’t know how to clone a repository or have not set up an SSH key.
   - Copy the link that should be the same link as the repository + `.git`.
   - Open your favorite code editor (we’ll use VSCode) and open a new folder.
   - Open your terminal in VSCode, and type:
     ```sh
     git clone https://github.com/Jantomz/polycomb.git
     ```
   - Note that you must have Git installed and configured properly. If you don’t have Git, download it through [Git SCM](https://git-scm.com/downloads).

2. **Install Dependencies**

   - In your terminal, navigate to the directory that has the folders `app` and `server`.
   - Open two terminal instances. In one terminal, type:
     ```sh
     cd app
     ```
     In the other terminal, type:
     ```sh
     cd server
     ```
   - In both terminals, type:
     ```sh
     npm i
     ```
   - Note that you must have Node.js installed to run this command. If you need to install Node.js, do so [here](https://nodejs.org/en/download/package-manager).

3. **Run the Application**
   - In both terminals, type:
     ```sh
     npm run start
     ```
   - A web browser should open automatically, and the application should be running. If a web browser does not automatically open, go to your web browser and type `http://localhost:3000` to get started.

#### Account Creation

I have pre-created an admin account for demo purposes. Here are the account logins:

**ADMIN**

- Email: admin@demo.com
- Password: HiCS50TF

**USER**

- Email: user@demo.com
- Password: HelloCS50TF

Please avoid spamming accounts, it does not pose any risks to the system, the only thing it does is take up MongoDB’s server space…

Now you have successfully locally deployed Polycomb! Feel free to explore. Technical design choices as well as a thorough rundown of the application will be explained in `DESIGN.md`.

### A web browser via polycomb.jadenzhang.com

Go to your browser of choice and enter [polycomb.jadenzhang.com](http://polycomb.jadenzhang.com).

#### Steps to Use Polycomb via polycomb.jadenzhang.com

1. **Deploy the Backend Locally**

   - Follow the steps in the [Steps to Deploy Locally](#steps-to-deploy-locally) section, but only for the `server` folder.
   - Ensure the backend is running on your local machine.

2. **Access the Application**
   - Open your web browser and go to [polycomb.jadenzhang.com](http://polycomb.jadenzhang.com).
   - The web application will connect to your locally hosted backend.

Voila! You have successfully accessed Polycomb via a browser from my website!

### A desktop application

Perform everything you did in method 1, where you host the frontend and backend on your machine. But then, open up another terminal and type:

```sh
cd app
npm run electron
```

This will open the desktop app!

### Raw text readMe

#### This raw text is the same as the one above, just not formatted - for the sake of demonstrating my initial ReadMe nuance

Welcome to Polycomb, a spelling bee management software for organizations to create competitions and share information with their spellers. This manual will show you how to begin using it, as well as provide an overview of what you can do in Polycomb!

Video Demo Link:

For usage, there are three ways you can use this project:
A web browser via local deployment
A web browser via polycomb.jadenzhang.com
A desktop application, only for windows as of now, as apple is quite silly with their little $99 subscription permits

A web browser via local deployment
This method is quite difficult to get started with, so if you are not comfortable with cloning github repositories and working dependencies, maybe start with the other two!

To begin, let’s take a quick look at the base structure of the project. Go to https://github.com/Jantomz/polycomb to access the repository that holds Polycomb. Within this repository, you will see two different folders, one called “app” and the other called “server”. The “app” folder stores all client-side or frontend components of the application. The “server” folder stores all server-side or backend components of the application. The two folders are effectively separate apps that talk through api endpoints, established through deploying both sides. Thus, let’s get to that!

To start deploying the application, you need to first click on the blue button on the repository called “code,” which will open a dropdown of information to clone the repository. Choose “HTTPS” if you don’t know how to clone a repository or have not set up an ssh key (or if you don’t know what an ssh key is). If you do know how to clone through SSH or want to clone in some other fashion, feel free to, though we will stick with a simple HTTPS clone for the repository.

Copy paste the link that should be the same link as the repository + “.git”. Take that link and open your favorite code editor, in this case we’ll stick with VSCode (you can even clone using your terminal, though we will try and keep things all within a code editor).

Open up your vscode and open a new folder. Now, open your terminal in VSCode, and type “git clone https://github.com/Jantomz/polycomb.git”, which should be the link you previously copied. Note that you must have git installed and configured properly to do this. If you don’t have git, download it through https://git-scm.com/downloads.

Now, press enter in your terminal, and you should see a progress bar quickly cloning the repository. In essence, we are just copy-pasting the folders and files from the repository on github’s servers to your local machine. Once the cloning is complete, you should see in your file viewer in VSCode, that there are the two folders “app” and “server” as well as this README.md.

Go ahead and explore the folders if you’d like, though DESIGN.md will explain the file structure and design choices. Note that I have pushed the .env file without any protection. You can take a look inside, there are a few secrets that I am happy to leak to the public, though under normal circumstances you should avoid doing so. I am aware of this push and have done it intentionally to make it easier for local deployment of the backend. However, I have a separate branch that is deployed on the web we can discuss later, and the .env is hidden there.

Now, in your terminal, make sure you are in the directory that has the folders “app” and “server”. On the right side of the terminal, you should see a plus sign that you can click to create another instance of the terminal. In one of the terminals, type “cd app” and in the other, type “cd server”. These will open the folders from each separate terminal and thus allow local deployment from both. In both terminals, type “npm i.” There is a file called package.json that holds all necessary dependencies for the project to deploy properly. Thus, you are using node package manager to install all the dependencies listed in that file. Note that you must have nodeJs installed to run this command. If you need to install nodeJs, do so here https://nodejs.org/en/download/package-manager.

Now that your local system has dependencies from both individual folders downloaded, go to each terminal and for both of them, type “npm run start”. This command will run the deployments of both folders, which should show in the terminals. A web browser should open automatically and the application should be running and good to go! If a web browser does not automatically open, go to your web browser and type “http://localhost:3000” to get started.

In terms of account creation, I have pre-created an admin account for demo purposes, as I am keeping the admin privileges more difficult to access and not allowing just any user who signs in to become an administrator account. I have also pre-created a user account for demo purposes, though please feel free to create your own account or sign in with Google. DO NOT use a password that you use elsewhere, this application demo is not secure. Here are the account logins:

ADMIN
Email: admin@demo.com
Password: HiCS50TF

USER
Email: user@demo.com
Password: HelloCS50TF

Please avoid spamming accounts, it does not pose any risks to the system, the only thing it does is take up MongoDB’s server space…

Now you have successfully locally deployed Polycomb! Feel free to explore, technical design choices as well as a thorough rundown of the application will be explained in DESIGN.md and a video demo is available at the top of this README.md.

A web browser via polycomb.jadenzhang.com
Go to your browser of choice and enter “polycomb.jadenzhang.com”
Do all previous steps for the local hosting, but only for "server"
The web browser will need your locally hosted backend to run! (Backend hosting on the cloud is expensive and/or time consuming)

Voila! You have successfully accessed Polycomb via a browser from my website!

Desktop Application
Perform everything you did in method 1, where you host the frontend and backend on your machine. But then, open up another terminal and type:

```sh
cd app
npm run electron
```

This will open the desktop app!
