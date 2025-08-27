# Contribution Guidelines for Torneopal Live Scoreboard

## Contribution Channels

Submit [ticket](https://github.com/terotil/torneopal-live-scoreboard/issues) for bugs, questions and ideas.

Submit a pull request for contribution. Adhering to coding style described below is appreciated.

## Resources

- [Taso API documentation](https://salibandy.api.torneopal.com/taso/rest/help)

## Key Components

- `index.html`: Complete application (HTML + CSS + JS in one file). Application state stored in DOM input element values and synchronzed to and from URL.
- `recorder.js`: Records API responses for testing/debugging
- `reducer.js`: Filters recorded data to show only changes
- `console-scoreboard.js`: Console-based scoreboard controller for manual operation and testing
- `taso/rest/get[Resource].json`: Local API mock. Dev server defaults to json and disables cache for this.

## Code Style Preferences

### JavaScript

- Use modern ES6+ syntax
- Use `const` and `let` over `var`
- Use arrow functions for short functions
- Use template literals for string interpolation
- Language in user interface and end user documentation is Finnish
- Language in code, comments and version control is English

### HTML/CSS

- Use semantic HTML5 elements
- Use CSS Grid or Flexbox for layouts
- Keep styles organized and compact

### Project Structure

- Keep all application code in one file: index.html
- Supporting scripts should consist of one .js file each
- When adding new tools or constructs, verify that you use latest recommended patterns and versions, not deprecated ones
- Use clear separation between data processing and UI
- Keep API interactions separate from UI logic

### API Integration

- Handle errors gracefully for API calls and discard event handling completely rather than crash
- Use async/await for API requests
- Never cache API responses
- Respect rate limiting

### Documentation

- Use Finnish for user documentation
- Use English for developer documentation and technical implementation details
- Keep README.md updated with new features
