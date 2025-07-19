# 🎓 AI Learning Platform

> Personalized Learning Assessment with AI-Powered Feedback

A comprehensive full-stack web application that provides intelligent learning feedback through both AI and rule-based systems. Built with modern technologies and deployed using Docker.

![Platform Screenshot](docs/screenshots/platform-overview.png)

## 🚀 Features

### Core Functionality
- **🔐 User Authentication** - Secure registration and login with session management
- **📊 Assessment System** - 0-100 scoring with intuitive input validation
- **🤖 Dual Feedback Modes** - AI-powered (Cohere API) and rule-based feedback
- **📈 Progress Tracking** - Visual charts and historical data analysis
- **📄 Export Capabilities** - PDF reports and CSV data export
- **🌙 Dark Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Works seamlessly on all devices

### Technical Features
- **🐳 Docker Deployment** - One-command deployment with Docker Compose
- **🔒 Security** - Password hashing, session tokens, user data isolation
- **📊 Data Visualization** - Interactive charts with Chart.js
- **🎨 Modern UI** - Tailwind CSS with responsive design
- **🔄 Real-time Updates** - Dynamic content updates and validation

## 🛠️ Technology Stack

### Frontend
- **⚛️ React 18** - Modern component-based UI
- **🎨 Tailwind CSS** - Utility-first styling
- **📊 Chart.js** - Interactive data visualization
- **🔄 React Hooks** - State management

### Backend
- **🐍 Python Flask** - Lightweight REST API
- **🗄️ SQLite** - File-based database
- **🤖 Cohere AI API** - Natural language processing
- **🔐 Session Auth** - Secure authentication

### DevOps
- **🐳 Docker** - Containerization
- **🌐 Nginx** - Reverse proxy and static serving
- **📁 Volume Persistence** - Data persistence
- **🔄 Multi-stage Builds** - Optimized images

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-learning-platform.git
   cd ai-learning-platform
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Cohere API key
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:5000

### Manual Setup (Development)

<details>
<summary>Click to expand manual setup instructions</summary>

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

</details>

## 📖 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create an assessment** by entering topics and confidence scores (0-100)
3. **Choose feedback mode**: AI-powered or rule-based
4. **View results** with interactive charts and personalized feedback
5. **Track progress** over time in the History and Progress tabs
6. **Export data** as PDF reports or CSV files

### Screenshots

<details>
<summary>View Application Screenshots</summary>

#### Login Interface
![Login Page](docs/screenshots/login.png)

#### Assessment Creation
![Assessment Form](docs/screenshots/assessment.png)

#### Results and Feedback
![Results Page](docs/screenshots/results.png)

#### Progress Tracking
![Progress Charts](docs/screenshots/progress.png)

</details>

## 🐳 Docker Deployment

### Quick Deployment
```bash
# Clone and start
git clone https://github.com/yourusername/ai-learning-platform.git
cd ai-learning-platform
cp .env.example .env
# Add your Cohere API key to .env
docker-compose up --build
```

### Docker Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Rebuild containers
docker-compose up --build
```

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │────│   (Flask)       │────│   (SQLite)      │
│   Port: 80      │    │   Port: 5000    │    │   File-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐              
         └──────────────│   AI Service    │              
                        │   (Cohere)      │              
                        └─────────────────┘              
```

### Database Schema
- **Users**: Authentication and user management
- **Sessions**: Secure session tracking
- **Submissions**: Assessment data with user isolation

### API Endpoints
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /feedback` - Submit assessment and get feedback
- `GET /history` - Retrieve assessment history
- `GET /progress` - Get progress analytics
- `GET /export/csv` - Export data

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Manual Testing
1. **Authentication flow** - Registration, login, logout
2. **Assessment creation** - Both AI and rule-based modes
3. **Data visualization** - Charts and progress tracking
4. **Export functionality** - PDF and CSV generation
5. **Responsive design** - Mobile and desktop views

## 🔧 Development

### Project Structure
```
ai-learning-platform/
├── backend/           # Flask API server
├── frontend/          # React application
├── docs/             # Documentation and screenshots
├── docker-compose.yml # Container orchestration
└── README.md         # This file
```

### Environment Variables
```bash
# Required
COHERE_API_KEY=your_cohere_api_key_here

# Optional
REACT_APP_API_URL=http://localhost:5000
```

### Development Workflow
1. **Backend changes**: Modify Python files, restart Flask server
2. **Frontend changes**: React hot reload handles updates automatically
3. **Database changes**: Update schema in `database.py`
4. **Docker changes**: Rebuild containers with `docker-compose up --build`

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **Commits**: Use conventional commit messages

## 📚 Documentation

### Additional Resources
- [Technical Report](docs/technical-report.pdf) - Comprehensive project documentation
- [API Documentation](docs/api-docs.md) - Detailed API reference
- [Deployment Guide](docs/deployment.md) - Production deployment instructions

## 🚧 Roadmap

### Version 2.0 (Planned)
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Machine learning recommendations
- [ ] Multi-language support
- [ ] Social features (study groups)

### Version 3.0 (Future)
- [ ] Cloud deployment (AWS/Azure)
- [ ] Microservices architecture
- [ ] Real-time collaboration
- [ ] LMS integration

## 🐛 Known Issues

- PDF export requires print dialog interaction
- AI feedback depends on external API availability
- Mobile navigation could be improved

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Abbas Yaghi** - 6484
- **Hussein Darwish** - 6297

## 🙏 Acknowledgments

- **Cohere AI** for providing the language model API
- **React Team** for the excellent frontend framework
- **Flask Community** for the lightweight backend framework
- **Docker** for containerization technology

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** in the `docs/` folder
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the authors** for urgent matters

---

**⭐ If you find this project useful, please give it a star!**

Built with ❤️ for educational assessment and personalized learning.