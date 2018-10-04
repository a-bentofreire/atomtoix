# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2018-10-04
### Added
- Port of vsctoix 1.1.0.
> This code is a port of [vsctoix](https://github.com/a-bentofreire/vsctoix) 1.1.  
> However some parts still need work:  
> 1. It only supports one selection.  
> 2. It only transforms text inside the selection.  
> 3. All the code is inside one file only due the fact when I tried to place it in multiple code files,  
> babel compiler always reported an error on the export key.  
> 4. Add Mocha Tests and travis support.  