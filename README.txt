// initliaze node
npm init -y
npm install express
npm install path

// update relavent components with proptypes
npm install prop-types

// add babel
npm install --save-dev @babel/cli @babel/core @babel/preset-env

// Add react basics
npm install react react-dom
npm install react-router-dom
npm install --save-dev @babel/preset-react babel-loader webpack webpack-cli

// Add CSS 
npm install --save-dev style-loader css-loader

// Add webpack
npx webpack
npm start

// run in a separate terminal for auto-rebundling on changes
npx webpack -w

----------------------------------------------------------------------

// Docker
docker build -t u23542676 .
docker run --name express -p 3005:8080 u23542676

----------------------------------------------------------------------
// GitHub Link
https://github.com/adridder02/IMY220_Build

----------------------------------------------------------------------]
MongoDBConnectionString
mongodb+srv://test-user:test-password@imy220.hywxd3y.mongodb.net/?retryWrites=true&w=majority