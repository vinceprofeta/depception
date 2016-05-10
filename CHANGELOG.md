# Change Log
## [Unreleased]

## [0.1.2] - 2016-05-10
### Added
- Chain for each dependency ("via ... > ...") is now dimmed for easier reading.

### Fixed
- Any dependency which is required in your package.json and also required by one of your dependencies is now listed only once.

### Security
- NPM registry URL now uses HTTPS.

## [0.1.1] - 2016-05-09
### Added
- Now accepts a second parameter (integer) which limits the number of results. If no second parameter is supplied this defaults to 20.

## 0.1.0 - 2016-05-09
### Added
- Initial release.

[Unreleased]: https://github.com/bengummer/depception/compare/v0.1.2...HEAD
[0.1.1]: https://github.com/bengummer/depception/compare/v0.1.0...v0.1.1
[0.1.2]: https://github.com/bengummer/depception/compare/v0.1.1...v0.1.2
