# Lingo-Diff - Linguistic Diff Checker

A modern **standalone web application** designed to help localization managers compare and analyze text changes in languages they don't understand. Lingo-Diff provides visual diff analysis and generates detailed prompts for external AI analysis to make informed quality assurance decisions.

## 🎯 Vision

Localization managers often struggle with comparing translated text versions in languages they don't speak. Standard diff tools only show character changes without linguistic context. Lingo-Diff bridges this gap by providing:

- **Visual character-level diff** with color-coded changes
- **Real-time diffing** that updates as you type
- **AI prompt generation** for external LLM analysis
- **Context tracking** for source information and translation context

## 🚀 Features

### Core Functionality
- **Side-by-side text comparison** with real-time visual diff
- **Instant prompt generation** for ChatGPT, Claude, or other LLM tools
- **Context-aware analysis** with source term and translation context
- **Standalone operation** - no server required, runs entirely in the browser

### User Experience
- **Clean, intuitive interface** requiring no training
- **Responsive design** that works on desktop and tablet
- **Real-time feedback** with instant diff visualization
- **Pre-loaded sample data** for immediate testing

## 🛠 Tech Stack

### Frontend Only
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Diff library** for character-level comparison
- **Clipboard API** for prompt copying

## 📁 Project Structure

```
Lingo-Diff/
├── client/                 # Frontend React App
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DiffViewer.tsx
│   │   │   ├── ClipboardPromptButton.tsx
│   │   │   └── Header.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lingo-Diff
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🧪 Testing the Application

### Sample Data
The application includes pre-loaded sample data to demonstrate functionality:

- **Source Term:** "Room Selected At Check In"
- **Context:** "This is a room name"
- **Candidate 1:** チェックイン時にお部屋を選択
- **Candidate 2:** チェックイン時お部屋選択

### Expected Results
For the sample data, you should see:
- **Visual Diff:** Red highlighting for removed particles (に, を)
- **AI Prompt:** A comprehensive prompt ready to copy and paste into your preferred LLM tool

## 🔧 Development

### Frontend Development
```bash
cd client
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🎨 UI Components

### DiffViewer
- Character-level diff visualization
- Color-coded additions (green) and deletions (red)
- Real-time updates as you type
- Legend for easy interpretation

### ClipboardPromptButton
- Generates comprehensive AI prompts
- Includes all context and translation candidates
- One-click copying to clipboard
- Validation and user feedback

### Header
- Application branding and navigation
- Reset functionality for clearing all fields

## 🔮 How It Works

### 1. Input Phase
- Enter the **Source Term** (original English text)
- Provide **Translation Context** (where/how the text will be used)
- Input two **Translation Candidates** for comparison

### 2. Analysis Phase
- **Visual Diff:** See character-level differences in real-time
- **Prompt Generation:** Click the button to generate a detailed AI prompt

### 3. External Analysis
- Copy the generated prompt
- Paste it into ChatGPT, Claude, or your preferred LLM
- Receive expert linguistic analysis and recommendations

## 🔮 Future Enhancements

### Version 2.0 Roadmap
- **File Upload:** Support for .xliff, .po, and other translation files
- **History & Persistence:** Save comparison history to localStorage
- **Advanced Diffing:** Word-level and sentence-level diff options
- **Multiple Languages:** Support for languages beyond Japanese
- **Export Options:** PDF reports, CSV exports, etc.

### Potential Integrations
- **Browser Extensions:** For comparing text on any website
- **Desktop App:** Electron-based standalone application
- **API Integration:** Optional backend for team collaboration
- **Translation Memory:** Integration with CAT tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for localization managers who need better tools for quality assurance
- Inspired by the challenges of managing multilingual content
- Uses modern web technologies for optimal user experience
- Leverages the power of external LLMs for expert analysis

---

**Lingo-Diff** - Empowering localization managers with linguistic insights 🚀 