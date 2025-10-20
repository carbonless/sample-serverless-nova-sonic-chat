# MCP Tool Reference Guide

## Available Tools

### fetch
**Purpose**: HTTP requests and web scraping
**Usage**: Fetch URLs, extract content as markdown

### MLB Data Sources
When using fetch for baseball data, use these endpoints:

**MLB Stats API:**
- Teams: `https://statsapi.mlb.com/api/v1/teams/{teamId}`
- Players: `https://statsapi.mlb.com/api/v1/people/{playerId}`
- Standings: `https://statsapi.mlb.com/api/v1/standings`
- Schedule: `https://statsapi.mlb.com/api/v1/schedule`

**ESPN API:**
- MLB Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard`
- Team Info: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/{teamAbbr}`

**Team IDs:**
- Phillies: 143
- Yankees: 147
- Red Sox: 111

**Player IDs:**
- Kyle Schwarber: 656941
- Aaron Judge: 592450

### filesystem
**Purpose**: File operations in /tmp directory
**Usage**: Read/write temporary files

### time
**Purpose**: Date/time operations
**Usage**: Current time, timezone conversion