# Change Log
## [Unreleased]
None

## [0.2.0] - 2016-05-13
### Improved
- NPM registry requests are now done in parallel, reducing overall execution time by a decent amount.
- Progress is now text based rather than progress bar, as the total number of dependencies is initially unknown due to the dependency tree.

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
[0.2.0]: https://github.com/bengummer/depception/compare/v0.1.2...v0.2.0
