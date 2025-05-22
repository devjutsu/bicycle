# Bike Together - Ride Coordination App

A real-time bike ride coordination app that helps cyclists find and join group rides.

## Features

- Create and join group bike rides
- Real-time location tracking
- Mobile-first, map-centric interface
- Open route support
- Distance-based ride filtering

## Tech Stack

- Next.js 15
- TypeScript
- Mapbox GL JS
- Tailwind CSS
- Radix UI Components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env.local` file with your Mapbox access token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Development

The app is built with a mobile-first approach, focusing on ease of use and quick access to nearby rides. The main components are:

- `Map`: Displays the map and handles location tracking
- `RideList`: Shows available rides in the area
- `CreateRideButton`: Allows users to create new rides

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
