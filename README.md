Note: While running the project, please wait if the backend doesn't load immediately. The bakcend API end points works correctly but little slow depending on the network, so please wait for sometime and let the changes from backend to load and render on frontend. Thank you.

# How to Pull the full code

Make a folder on your device (let's say Pull Code) and pull the backend first from the link->https://github.com/shadow855/task-management-backend.
After that make a folder named-> frontend in the root folder (Pull Code Folder) and pull this frontend code in it.

## How to Run
Before running make .env variables in the root folder (Pull Code) for backend, which are->
1. PORT
2. MONGO_URI
3. JWT_SECRET
4. NODE_ENV=production

And, make another .env in the root of your frontend folder-> REACT_APP_SERVER_URL=http://localhost:5000

Now,
In the root project directory, you can run:
### `npm start` to run the backend.

Move to frontend directory using cd frontend command in  root project directory, and run frontend using->
### `npm start`
