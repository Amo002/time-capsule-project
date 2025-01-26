==================================================
                 CAPSULE PROJECT
==================================================

A web application for managing time capsules where users can store content and set a release date to access the content in the future. The app supports roles (admin and user) and includes features like countdown timers, user profiles, and dynamic content fetching.

==================================================
                   FEATURES
==================================================
- **User Roles:** Admin and User roles with distinct permissions.
- **Time Capsules:** Create, edit, delete, and view capsules with release dates.
- **Countdown Timer:** Display countdown for capsules not yet released.
- **Profile Management:** User profiles with profile pictures and details.
- **Admin Management:** Admin can oversee and manage users and capsules.

==================================================
                   HOW TO USE
==================================================
1. **Clone the Repository:**
   ```bash
   git clone <repository-link>
   cd <repository-folder>
   ```

2. **Install Dependencies:**
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Setup the Environment Variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=yourpassword
   MYSQL_DATABASE=capsule_project
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```
   
4. **Set Up the Database:**
   - Run the database setup script:
     ```bash
     node config/databaseSetup.js
     ```
   - This will:
     - Create the database and tables.
     - Seed the default roles (`admin`, `user`).
     - Create a default admin user:
       - Email: `admin@cp.com`
       - Password: `admin`

5. **Run the Application:**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

6. **Access the Application:**
   Open your browser and go to:
   ```
   http://localhost:3000
   ```

==================================================
                DATABASE SCHEMA
==================================================
### Tables:
1. **roles**
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR, UNIQUE, e.g., "admin", "user")

2. **users**
   - `id` (INT, Primary Key, Auto Increment)
   - `username` (VARCHAR)
   - `email` (VARCHAR, UNIQUE)
   - `password` (VARCHAR)
   - `profile_picture` (TEXT)
   - `role_id` (INT, Foreign Key to `roles.id`)
   - `created_at` (TIMESTAMP, Default: Current Timestamp)
   - `updated_at` (DATETIME)

3. **capsules**
   - `id` (INT, Primary Key, Auto Increment)
   - `user_id` (INT, Foreign Key to `users.id`)
   - `title` (VARCHAR)
   - `content` (TEXT)
   - `image_url` (TEXT)
   - `release_date` (TIMESTAMP)
   - `created_at` (TIMESTAMP, Default: Current Timestamp)
   - `updated_at` (TIMESTAMP, Default: Current Timestamp, On Update)

==================================================
           DEFAULT CREDENTIALS
==================================================
- Admin Email: `admin@cp.com`
- Admin Password: `admin`

==================================================
                   NOTES
==================================================
- **JWT Secret:** Update `JWT_SECRET` in `.env` for better security.
- **Images Directory:** Default profile pictures are stored in `assets/images/default/`.

==================================================
                   SUPPORT
==================================================
If you encounter any issues, feel free to contact the project maintainer.

==================================================
                  THANK YOU!
==================================================

