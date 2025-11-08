# To run

## Backend

1. configure aws credentials with ```aws configure```
2. ```sam build``` in the backend folder
3. ```sam deploy --guided``` in the backend folder

That sets up the aws backend

- To run tests first build then execute ```npm run test```

## Frontend

1. as in .env.example create a .env file with the aws api url you got from setting up the backend
2. ```npm install```
3. ```npm run dev```

- To run tests execute ```npm run test```

# Demo

To see a demo of the app: http://weight-tracker-fe.s3-website.eu-north-1.amazonaws.com/
