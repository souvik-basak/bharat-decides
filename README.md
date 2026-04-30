# 🇮🇳 Bharat Decides: The Elite Voter Intelligence Portal

**Empowering 1.4 Billion Citizens with Data-Driven Democracy.**

Bharat Decides is a state-of-the-art digital platform designed to simplify the complex journey of an Indian voter. Built with an "Elite" design philosophy, it combines real-world geospatial intelligence with cutting-edge AI to provide every citizen with a personalized, action-driven election guide.

---

## 🌟 Key Features

### 1. 🗺️ Electoral Pulse (Interactive Map)
Navigate India's democratic landscape like never before.
*   **Dual-Layer Intelligence**: Toggle between **Parliamentary (PC)** and **Assembly (AC)** constituency boundaries.
*   **Geospatial Data Layer**: Powered by official simplified GeoJSON datasets for high-performance rendering.
*   **Shimmering Skeleton Loader**: A premium visual state that ensures a smooth experience during data synchronization.
*   **Constituency Deep-Dive**: Click any region to see MP/MLA performance, local demographics, and the 2024 election schedule.

### 2. 🤖 Vani: Action-Driven AI Guide
Vani is not just a chatbot; she is your democratic mission commander.
*   **Real-time Streaming**: Powered by **Google Gemini API**, providing instant, character-by-character responses.
*   **Task-Oriented Intelligence**: Optimized to move users from "How do I?" to "Done!" using a strict action-driven persona.
*   **Multilingual Support**: Fully capable of guiding users in English and major regional Indian languages.
*   **Simplified Logic**: Bridges the gap between complex election laws and simple, actionable steps.

### 3. 🎓 Civic Knowledge Hub
An immersive journey through the democratic process.
*   **Voter Timeline**: A narrative-driven scroll experience explaining the stages of an election.
*   **Interactive Quizzes**: Test your "Democracy IQ" with a real-time scoring system.
*   **Booth Finder**: A specialized interface for locating your exact polling station using Google Places integration.

---

## 🛠️ Technical Architecture

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router / Turbopack) |
| **AI Engine** | Google Gemini API (`gemini-flash-latest`) |
| **Mapping** | Google Maps SDK (`@vis.gl/react-google-maps`) |
| **Styling** | Tailwind CSS & Framer Motion |
| **State Management** | Zustand |
| **Analytics/Auth** | Firebase (Foundation Ready) |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+ 
*   Google Cloud Project (Maps & Gemini API access)

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/election-process-education.git
    cd election-process-education
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the portal in action.

---

## ♿ Accessibility & Design
*   **Simple English**: All content is written for maximum clarity, avoiding jargon.
*   **Glassmorphism UI**: Uses premium backdrop-blurs and high-contrast color tokens.
*   **Responsive**: Fully optimized for mobile-first voters across India.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Bharat Decides: Your Vote is Your Power.** 🇮🇳
