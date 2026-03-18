# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-08

### Added

- Initial release of @strimz/sdk
- Client-side SDK (`StrimzSDK`) for browser usage
- Server-side SDK (`StrimzServer`) for Node.js backend
- React components (`StrimzProvider`, `StrimzButton`)
- React hooks (`useStrimz`, `useStrimzSDK`)
- Support for one-time payments
- Support for recurring subscriptions (daily, weekly, monthly, yearly)
- Hosted checkout redirect flow
- Payment session creation and management
- Transaction verification
- Webhook signature verification
- Comprehensive error handling with typed error classes
- TypeScript type definitions
- Modular, tree-shakeable architecture
- Test mode support
- Automatic retry logic for network errors
- Input validation with Zod schemas
- URL parsing utilities
- Comprehensive documentation and examples

### Features

- **Payment Types**: One-time and subscription payments
- **Currencies**: USD (USDC & USDT stablecoins)
- **Intervals**: Daily, weekly, monthly, yearly subscriptions
- **Security**: HTTPS-only URLs, API key validation, webhook signature verification
- **Developer Experience**: Full TypeScript support, modular exports, React components
- **Testing**: Test mode with test API keys
- **Error Handling**: Typed errors with retry logic

### Documentation

- Complete README with quick start guide
- API reference documentation
- TypeScript type definitions
- React component documentation
- Server-side integration guide
- Webhook handling examples

## [Unreleased]

### Planned Features

- Vue.js adapter
- Angular adapter
- Payment links (no-code integration)
- Subscription pause/resume
- Trial periods
- Embedded checkout (iframe)
- React Native SDK
- Custom token support
- Multi-language support
