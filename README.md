# 🎲 Dice Clash

A Solana-powered dice betting game where players predict dice roll outcomes and can fund their gameplay using their connected Solana wallet.

![Dice Clash Game Preview](https://via.placeholder.com/800x400/1f2937/facc15?text=Dice Clash+Game)

## 🎯 About

Dice Clash is an interactive web-based dice game that combines traditional gaming with modern blockchain technology. Players can:

- 🎲 Predict whether a dice roll will be **over 4** or **under 3**
- 💰 Bet with in-game currency and win 1.8x their bet amount
- 🔒 Connect their Solana wallet for secure fund management
- ⚡ Experience fast, responsive gameplay with beautiful animations
- 📊 Track their game history and betting performance

## 🎮 Game Rules

### Betting Options
- **Over**: Predict the dice will roll 5 or 6
- **Under**: Predict the dice will roll 1 or 2

### Outcomes
- **🏆 Win**: Correct prediction → 1.8x payout
- **💰 Refund**: Dice rolls 3 or 4 → Get your bet back
- **❌ Loss**: Wrong prediction → Lose your bet

## 🚀 Features

- **🔗 Solana Integration**: Connect your Solana wallet to fund gameplay
- **🎨 Modern UI**: Beautiful dark theme with responsive design
- **⚡ Real-time Updates**: Instant dice rolling animations and results
- **📱 Mobile Friendly**: Optimized for all device sizes
- **🔐 Secure Authentication**: Wallet ownership verification
- **📈 Game History**: Track your recent rolls and performance
- **💸 Fund Management**: Deposit SOL to get game tokens (1 SOL = 10 tokens)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Authentication**: Custom wallet verification with JWT
- **Animations**: CSS animations and transitions
- **State Management**: React hooks and context

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- A Solana wallet (Phantom, Solflare, etc.)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dice Clash
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## 🎯 Usage

### Getting Started
1. **Launch the game** at [http://localhost:3000](http://localhost:3000)
2. **Start with demo balance** of $1000 in-game tokens
3. **Connect your Solana wallet** (optional) for funding

### Playing the Game
1. Click **"Start Game"** from the welcome screen
2. **Choose your bet amount** using the slider or input
3. **Select your prediction**: Over (5-6) or Under (1-2)
4. **Watch the dice roll** and see your results!
5. **Continue playing** or adjust your bet for the next round

### Wallet Integration
1. Click the **wallet icon** in the top-right corner
2. **Connect** your Solana wallet when prompted
3. **Verify ownership** by signing a message
4. **Deposit SOL** to receive game tokens (1:10 ratio)

## 📁 Project Structure

```
Dice Clash/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── game-container.tsx # Main game logic
│   ├── dice.tsx          # Dice animation component
│   ├── wallet-connect.tsx # Solana wallet integration
│   └── ...               # Other game screens
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript definitions
│   └── utils.ts          # Helper functions
├── hooks/                 # Custom React hooks
├── public/               # Static assets
├── styles/               # Additional stylesheets
└── ...                   # Config files
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# JWT Secret for wallet authentication
JWT_SECRET=your-secret-key-here
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Dark theme optimization
- Custom color palette
- Animation utilities
- Responsive breakpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. **Follow TypeScript best practices**
2. **Use the existing component patterns**
3. **Maintain responsive design principles**
4. **Test wallet integration thoroughly**
5. **Keep the UI/UX consistent**

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm dev:https` - Start development server with HTTPS

## 🔒 Security

- **Wallet Verification**: Users must sign a message to prove wallet ownership
- **No Private Keys**: The application never requests or stores private keys
- **Client-Side Security**: All wallet interactions happen client-side
- **Demo Mode**: Game works without wallet connection for testing

## 🚧 Roadmap

- [ ] **Real Solana Transactions**: Implement actual on-chain betting
- [ ] **Multiplayer Modes**: Add rooms and player vs player betting
- [ ] **Advanced Statistics**: Detailed analytics and game history
- [ ] **Mobile App**: React Native version
- [ ] **Additional Games**: More casino-style games
- [ ] **Social Features**: Leaderboards and achievements

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. **Check the Issues** section on GitHub
2. **Create a new issue** with detailed information
3. **Include your browser and wallet information**

---

**Disclaimer**: This is a demo/educational project. Please gamble responsibly and be aware of the risks involved in blockchain gaming. 