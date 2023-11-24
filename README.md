# u-develop-it

The u-develop-it is a web application built with Express.js that allows users to participate in polls and vote on different topics. It utilizes Jest for testing and MySQL2 for storing voting data.

## Overview

The U-develop-it provides a platform for creating and participating in polls. Users can vote on different topics, view poll results, and create their own polls.

## Features

- Create and manage polls.
- Vote on different topics.
- View real-time poll results.
- Jest for testing.

## Getting Started

### Prerequisites

- Node.js installed
- npm package manager
- MySQL installed

### Installation

1. Clone the repository
   
   ```bash
    git clone https://github.com/jay1195/u-develop-it.git
   
## Install dependencies
    npm install

## Database Setup
1. Create a MySQL database.
2. Update the database configuration in config.js with your MySQL credentials.

## Usage
1. Open a terminal and navigate to the project directory.
2. Run the server
   
   ```bash
   node server.js

3. Access the application at http://localhost:3000 in your web browser.
4. Create and participate in polls.
   
### API Routes
- GET /polls: Retrieve a list of all polls.
- GET /polls/:id: Retrieve information about a specific poll.
- POST /polls: Create a new poll.
- PUT /polls/:id/vote: Vote on a specific poll option.
  
## Technologies Used
- Node.js
- Express.js
- MySQL2
- Jest for testing
- Running Tests
  
  ````bash
  npm test
  
Run tests to ensure the integrity of the code.

## Contributing
- Contributions are welcome! Feel free to open issues or submit pull requests.

## License
![badge](https://img.shields.io/badge/license-MIT-brightgreen)
<br />
This application is covered by the MIT license. 
