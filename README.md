# Slot Machine - The House Always Wins

A full-stack slot machine game built with React and Rails.

## Features

- Player starts with 10 credits
- Rolling costs 1 credit
- 4 symbols: Cherry (10), Lemon (20), Orange (30), Watermelon (40)
- Match 3 symbols to win
- House edge: server re-rolls winning spins based on credit thresholds
- Cash out button with dodge mechanics

## Running the Application

**Backend (Rails API):**
```bash
cd backend
bundle install
rails db:create db:migrate
rails server
```
The backend runs on http://localhost:3000

**Frontend (React):**
```bash
cd frontend
npm install
npm start
```
The frontend runs on http://localhost:3001

## Testing

**Backend:**
```bash
cd backend
bundle exec rspec
```

**Frontend:**
```bash
cd frontend
npm test
```

## Linting

**Frontend (TypeScript/React):**
```bash
cd frontend
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
```

**Backend (Ruby):**
```bash
cd backend
bundle exec rubocop        # Check for linting issues
bundle exec rubocop -a     # Auto-fix linting issues
```
