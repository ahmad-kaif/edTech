# Peer-to-Peer Co-Education & Knowledge Sharing Platform

## Overview
This project aims to build a collaborative learning platform that bridges the gap between learners and mentors. It provides a space where individuals can share their expertise, learn new skills, and engage in meaningful discussions. The platform is designed to be flexible, accessible, and personalized, catering to a wide range of users.

---

## Features

### Core Features
1. **User Registration & Profile Management**  
    - Users can register as learners, mentors, or both.  
    - Profiles include details such as expertise, interests, and learning goals.

2. **Class Creation Module**  
    - Instructors can create classes with the following attributes:  
      - Title, description, and category.  
      - Content types: live sessions, video uploads, or downloadable materials.  
      - Free or paid options for classes.  

3. **Community Discussion Boards**  
    - Topic-specific boards for learners and mentors to engage in discussions.  
    - Users can ask questions, share resources, and collaborate.

4. **Live Video Sessions**  
    - Integration with a video call API for hosting live classes.  
    - Scheduling and notifications for upcoming sessions.

5. **Review & Rating System**  
    - Learners can rate and review classes and mentors.  
    - Reviews help improve content quality and mentor credibility.

6. **Admin Dashboard**  
    - Tools for managing flagged content.  
    - Verification of expert instructors to maintain platform quality.

---

### Advanced Features (Bonus)
1. **Personalized Class Recommendations**  
    - Collaborative filtering to suggest classes based on user interests and history.

2. **Sentiment Analysis on Reviews**  
    - Highlight top-rated content by analyzing user feedback.

3. **Skill-Gap Suggestions**  
    - Recommend topics for users to learn based on their profile and activity.

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Video API**: LiveKit  
- **Authentication**: JWT, OAuth  
 

---

## Installation & Setup
1. Clone the repository:  
    ```bash
    git clone https://github.com/your-repo-name.git
    cd your-repo-name
    ```

2. Install dependencies:  
    ```bash
    npm install
    ```

3. Set up environment variables:  
    - Create a `.env` file in the root directory.  
    - Add the following variables:  
      ```env
      DATABASE_URL=your_database_url
      VIDEO_API_KEY=your_video_api_key
      JWT_SECRET=your_jwt_secret
      ```

4. Start the development server:  
    ```bash
    npm run dev
    ```

5. Access the application at `http://localhost:5173`.

6. Start LiveKit

7. Start server
---

## Usage
1. **Register** as a learner, mentor, or both.  
2. **Create or join classes** based on your interests.  
3. **Engage in discussions** on community boards.  
4. **Host or attend live sessions** for real-time learning.  
5. **Rate and review** classes to help others make informed decisions.

---

## Contributing
Contributions are welcome! Please follow these steps:  
1. Fork the repository.  
2. Create a new branch:  
    ```bash
    git checkout -b feature-name
    ```  
3. Commit your changes:  
    ```bash
    git commit -m "Add feature-name"
    ```  
4. Push to the branch:  
    ```bash
    git push origin feature-name
    ```  
5. Open a pull request.

---


 
