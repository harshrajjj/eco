# EcoSnap X - Unified Smart Waste Assistant

An AI-powered waste management platform that helps users detect, classify, and properly dispose of waste through image recognition, community engagement, and gamification.

## Features

- 🔍 **AI Waste Detection**: Real-time image classification using computer vision
- 🗺️ **Interactive Maps**: Find nearby recycling centers and report waste hotspots  
- 🏆 **Gamification**: Earn points, badges, and compete with friends
- 👥 **Community**: Share activities, join cleanup events, connect with NGOs
- 📊 **Analytics**: Track personal and community environmental impact
- 🌙 **Dark Mode**: Full dark/light theme support with smooth transitions
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/ecosnap-x.git
cd ecosnap-x
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

4. Add your Hugging Face API key to `.env.local`:
\`\`\`env
HUGGINGFACE_API_KEY=your_huggingface_api_key
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

### Waste Detection APIs

The app supports multiple AI APIs for waste detection:

1. **Roboflow** (Primary): Specialized waste classification model
2. **Clarifai** (Fallback): General object detection with waste filtering
3. **Custom API**: Support for your own waste detection endpoints

### Getting API Keys

#### Hugging Face
1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to your profile settings → Access Tokens
3. Create a new token with "Write" permissions
4. Copy the token and add it as `HUGGINGFACE_API_KEY` in your `.env.local`

**Note**: Hugging Face provides free inference API access. No credit card required!

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI/ML**: Roboflow, Clarifai APIs
- **Deployment**: Vercel (recommended)

## Project Structure

\`\`\`
ecosnap-x/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── detect/            # Waste detection page
│   ├── map/               # Interactive map page
│   ├── dashboard/         # User dashboard
│   └── community/         # Community features
├── components/            # Reusable UI components
├── lib/                   # Utility functions
└── public/               # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for hackathons and environmental sustainability
- Inspired by the need for better waste management solutions
- Thanks to the open-source community for the amazing tools and libraries
