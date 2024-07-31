# DevTroveX

DevTroveX is a Next.js application that allows users to create accounts, join communities, ask questions, and provide answers to queries either manually or with the help of AI. It is a collaborative platform designed to facilitate knowledge sharing and problem-solving within user communities.

## Features

- User authentication and account creation
- Post questions to user communities
- Provide answers to your own questions or others'
- Ability to create answers with the help of integration AI
- Upvote and downvote answers
- Search functionality to find relevant questions and answers
- Responsive design for optimal viewing on different devices

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yogeshbisht/devtrovex.git
   cd devtrovex
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the example environment file to a new `.env.local` file:

   ```bash
   cp env.example .env.local
   ```

   Then, fill in the values in the `.env.local` file:

   ```plaintext
   MONGODB_URL=your-database-url
   NEXT_PUBLIC_SERVER_URL=your-api-url

   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Sign up** to create a new account or **log in** if you already have one.
2. **Ask questions** within a community to get help from other users.
3. **Answer questions** posed by other users to share your knowledge.
4. **Vote on answers** to highlight the most helpful responses.

## Contact

For any inquiries or feedback, please reach out to me through my website [Yogesh Bisht](https://yogeshbisht.com).
