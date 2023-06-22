<a name="readme-top"></a>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="front/public/pong.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Transcendance</h3>

  <p align="center">
    Transcendance is a website designed to play a custom game of pong with people online.
    <br />
    <a href="https://github.com/Blodispic/transcendance"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Blodispic/transcendance/issues">Report Bug</a>
    ·
    <a href="https://github.com/Blodispic/transcendance/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#how-to-install">How to install</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is about creating a website for the mighty Pong contest!

Users will be able to play Pong with others with a nice user
interface and a chat!


<p align="right">(<a href="#readme-top">Back to top</a>)</p>



### Built With

* [![Nest][Nest.js]][Nest-url]
* [![React][React.js]][React-url]
* [![Docker][Docker]][Docker-url]
* [![Konva][Konva]][Konva-url]
* [![Adminer][Adminer]][Adminer-url]
* [![sass][sass]][sass-url]



<p align="right">(<a href="#readme-top">Back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.


### How to install
Be aware that as it stands, you can only connect to transcendance using 42API, which means adding your IP adress in the API from your 42 account.
Start by add a .env file following the template below:
```
#URL
APP_BACK=http://localhost:4000/
FRONT_URL=http://localhost:3000

#42API
API42_UID=ExempleAPI
API42_SECRET=ExempleSecret
REDIRECT_URI=http://localhost:3000/

#PostGres
POSTGRES_HOST=PostgreSQL
POSTGRES_PORT=5432
POSTGRES_USER=DB_Username
POSTGRES_PASSWORD=DB_Password

#JWT
JWT_SECRET=secretKey

#TWO_FA
TWO_FACTOR_NAME=Trandancense
```

Install Docker, and launch the project with:
```
docker-compose up --build
```

<p align="right">(<a href="#readme-top">Back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

The game is played as shown below.

You can move around with the arrow keys, pressing both at the same time makes you go up.

<img src="images/game.gif" alt="Game" width="300" height="400">


You can also chat with other players, using the chat page shown below.

<img src="images/chat.png" alt="Chat" width="550" height="400">

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- CONTACT -->
## Contact

Seoyoung Lee: [https://github.com/se-lee](https://github.com/se-lee)

Emmanuel Labasque: [https://github.com/emmanuel-lbs](https://github.com/emmanuel-lbs)

Guillaume Beco: [https://github.com/KobeLaC](https://github.com/KobeLaC)

Romain Zhou: [https://github.com/Blodispic](https://github.com/Blodispic)

Adam Cusanno: [https://github.com/Acusanno](https://github.com/Acusanno)

Project Link: [https://github.com/Blodispic/transcendance](https://github.com/Blodispic/transcendance)

<p align="right">(<a href="#readme-top">Back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Blodispic/transcendance.svg?style=for-the-badge
[contributors-url]: https://github.com/Blodispic/transcendance/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Blodispic/transcendance.svg?style=for-the-badge
[forks-url]: https://github.com/Blodispic/transcendance/network/members
[stars-shield]: https://img.shields.io/github/stars/Blodispic/transcendance.svg?style=for-the-badge
[stars-url]: https://github.com/Blodispic/transcendance/stargazers
[issues-shield]: https://img.shields.io/github/issues/Blodispic/transcendance.svg?style=for-the-badge
[issues-url]: https://github.com/Blodispic/transcendance/issues
[product-screenshot]: images/homepage.png
[Nest.js]: https://img.shields.io/badge/nest.js-000000?style=for-the-badge&logo=nestdotjs&logoColor=white
[Nest-url]: https://nestjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Docker]: https://img.shields.io/badge/Docker-019DDD?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Konva]: https://img.shields.io/badge/Konva-0784CE?style=for-the-badge&logo=konva&logoColor=white
[Konva-url]: https://konvajs.org/
[Adminer]: https://img.shields.io/badge/adminer-9BB2D7?style=for-the-badge&logo=adminer&logoColor=015982
[Adminer-url]: https://www.adminer.org/
[Sass]: https://img.shields.io/badge/sass-CD6799?style=for-the-badge&logo=sass&logoColor=white
[Sass-url]: https://sass-lang.com/
