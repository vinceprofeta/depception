# depception

[![Greenkeeper badge](https://badges.greenkeeper.io/bengummer/depception.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/depception.svg)](https://badge.fury.io/js/depception) [![Build Status](https://api.travis-ci.org/bengummer/depception.svg?branch=master)](https://travis-ci.org/bengummer/depception) ![depdency status](https://david-dm.org/bengummer/depception.svg)

_For when your app breaks due to dependency inception._

If you have your direct npm dependecy versions pinned/locked but don't want to [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap) your entire project, you may wake up one day and notice that your tests fail because one of your unpinned sub-dependencies was updated.

depception shows you your most recently updated dependecies/sub-dependencies so you can work out which unpinned dependency likely broke your build.

## Installation and usage

Install with `npm install -g depception`

![depception demo](https://i.imgur.com/fKYfkxW.gif)

You can also use `depception package.json <integer>` to control the number of results.
