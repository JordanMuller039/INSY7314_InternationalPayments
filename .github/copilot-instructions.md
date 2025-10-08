<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Banking API Development Guidelines

## Project Context
This is a secure Node.js Express banking API for international payment processing. The project emphasizes security-first development with comprehensive input validation, authentication, and protection against common vulnerabilities.

## Security Standards
- Always validate input using the regex patterns defined in `utils/regex.js`
- Use bcrypt for password hashing with configurable rounds
- Implement JWT authentication with proper token validation
- Apply rate limiting to sensitive endpoints (auth, payments)
- Use Helmet middleware for security headers
- Ensure HTTPS support for production deployment

## Code Style Guidelines
- Use async/await for asynchronous operations
- Implement comprehensive error handling with appropriate HTTP status codes
- Follow RESTful API design principles
- Use mongoose for MongoDB operations with proper schema validation
- Create reusable middleware for common functionality
- Implement proper logging for debugging and monitoring

## API Design Patterns
- Use controller functions for business logic
- Implement validation middleware using express-validator
- Apply authentication middleware to protected routes
- Use role-based authorization for admin functions
- Return consistent JSON response formats
- Implement proper pagination for list endpoints

## Database Best Practices
- Use mongoose schemas with proper validation
- Implement indexes for performance optimization
- Use transactions for operations affecting multiple collections
- Sanitize database queries to prevent injection attacks
- Implement soft deletion where appropriate

## Testing Approach
- Write unit tests for controller functions
- Test authentication and authorization middleware
- Validate input sanitization and rate limiting
- Test error handling scenarios
- Ensure proper HTTP status codes are returned

## Environment Configuration
- Use environment variables for sensitive configuration
- Provide .env.example template for setup
- Validate required environment variables on startup
- Use different configurations for development/production

When suggesting code improvements or new features, always prioritize security and follow the established patterns in this codebase.
