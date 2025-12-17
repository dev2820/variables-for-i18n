# Variables for i18n

Make it easier for users who use variables for i18n to manage those variables.

A Figma plugin for managing internationalization (i18n) variables in your design system. This plugin provides a spreadsheet-like interface to edit, manage, and export Figma variables as JSON files for different language modes.

## Features

- **Spreadsheet Interface**: Edit i18n variables in a familiar spreadsheet view with support for multiple language modes
- **Multi-language Support**: Manage translations across multiple language modes defined in your Figma variable collections
- **JSON Export**: Extract variables as JSON objects for each language mode, ready to use in your application
- **Search & Filter**: Quickly find variables by name or value with real-time search
- **CRUD Operations**: Create, read, update, and delete i18n variables directly from the plugin
- **Permission Management**: Handles Figma API permissions to ensure safe editing of variables
- **Resizable UI**: Adjustable plugin window size that persists across sessions

## Installation

### From Figma Community

Link: https://www.figma.com/community/plugin/1465032483656605623

1. Search for "Variables for i18n" in the Figma Community
2. Install the plugin
3. Run it from the Plugins menu

## Usage

### Setup

1. Create a variable collection in Figma with a name that starts or ends with "i18n" (e.g., "i18n", "i18n-app", "my-i18n")
2. Add modes to your collection for different languages (e.g., "en", "es", "fr")
3. Run the plugin

### Managing Variables

- **View**: The plugin displays all variables in a spreadsheet format with columns for each language mode
- **Edit**: Click on any cell to edit the variable name or values for different modes
- **Add**: Click the "+" button to add new variables
- **Delete**: Select rows and delete them to remove variables
- **Search**: Use the search bar to filter variables by name or value

### Exporting

1. Click the "Extract JSON" button for the desired language mode
2. A dialog will display the preview of the JSON output
3. Copy the JSON for use in your application

The exported JSON structure follows the variable naming convention:

```json
{
  "welcome": {
    "title": "Welcome",
    "subtitle": "Get started"
  }
}
```

## Project Structure

```
variables-for-i18n/
├── src/
│   ├── plugin/          # Figma plugin code (runs in Figma's sandbox)
│   │   ├── index.ts     # Main plugin entry point
│   │   └── VariableCollectionSchema.ts  # Variable collection management
│   ├── ui/              # React UI code
│   │   ├── App.tsx      # Main React application
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Utility functions
│   └── shared/          # Shared types and utilities
├── dist/                # Built plugin files
├── webpack-configs/     # Webpack configuration
└── manifest.json        # Figma plugin manifest
```

## Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Webpack**: Module bundler
- **Vanilla Extract**: Type-safe CSS
- **@jspreadsheet-ce/react**: Spreadsheet component
- **Lucide React**: Icon library
- **Figma Plugin API**: Variable management and plugin integration

## Development

### Available Scripts

- `pnpm run watch` - Build in development mode with watch
- `pnpm run build` - Build for production
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run style:write` - Format code with Prettier
- `pnpm run update_typings_file` - Update Figma typings

### Code Quality

This project uses:

- **ESLint** with Airbnb configuration for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## Requirements

- Figma Desktop App
- Node.js 16+
- pnpm (or npm/yarn)

## License

MIT License - see LICENSE file for details

## Author

dev2820
