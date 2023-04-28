# transcendance
## Presentation
Transcendance is a website designed to play a custom game of pong with people online.
The game is played as shown below.
![pong gif](https://user-images.githubusercontent.com/80698496/235122589-6db7a8e4-d88b-442d-9592-db2efb576674.gif)

You can also chat with other players, using the chat page shown below.
![chat screenshot](https://user-images.githubusercontent.com/80698496/235122888-9c24c0e9-750e-4edd-9d0e-99a4fdf894d0.png)

## How to install
Be aware that as it stands, you can only connect to transcendance using 42API, which means adding your IP adress in the API from your 42 account.
Start by add a .env file following the template below:
```
#URL
APP_BACK=http://10.11.8.2:4000/
FRONT_URL=http://10.11.8.2:3000

#42API
API42_UID=ExempleAPI
API42_SECRET=ExempleSecret
REDIRECT_URI=http://10.11.8.2:3000/

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
