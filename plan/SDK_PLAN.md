# Gmail Agent SDK Plan

## 1. Project Overview

**Project Name**: Gmail Agent for TAPS Aero
**Type**: Standalone Python SDK Agent
**Core Functionality**: An AI agent that connects to Gmail to automatically read, process, and respond to emails related to aircraft parts RFQs, pricing inquiries, and buyer connections.

## 2. User Requirements Summary

Based on the interview with the user:

1. **Email Reading**: Automatically read emails from Gmail inbox, especially RFQs (Requests for Quotes)
2. **Email Sending**: Send emails to potential buyers (Boeing, Airbus, Embraer, Gulfstream)
3. **Email Monitoring**: Monitor inbox for specific conditions and trigger actions
4. **Business Context**: Aircraft parts business (Boeing 737-700/800/900, 747-400+, Airbus A320/A389, Embraer, Gulfstream G4/G5)
5. **Core Goal**: Save time by automatically sifting through emails and processing RFQs

## 3. Technical Architecture

### 3.1 OpenHands SDK Components

- **LLM**: Using `openhands.sdk.LLM` with configurable model
- **Agent**: Using `openhands.sdk.Agent` with custom tools
- **Conversation**: Using `openhands.sdk.Conversation` for interaction
- **Custom Tools**: Using `openhands.sdk.Tool` and `openhands.sdk.tool` for Gmail integration

### 3.2 Gmail Integration

- Using Google Gmail API via Google OAuth2
- Custom executor for Gmail operations
- Labels for organizing processed emails

### 3.3 Tool Definitions

| Tool | Description |
|------|-------------|
| `GmailReadTool` | Read emails from inbox with filters |
| `GmailSearchTool` | Search emails by query |
| `GmailSendTool` | Send emails to buyers |
| `GmailLabelTool` | Apply labels to emails for tracking |
| `FileEditorTool` | Save extracted data to files |
| `TerminalTool` | Run shell commands for system operations |

## 4. Implementation Details

### 4.1 Gmail API Setup

- OAuth2 authentication with Gmail API
- Scopes: `https://www.googleapis.com/auth/gmail.readonly`, `https://www.googleapis.com/auth/gmail.send`
- Credentials stored securely in workspace

### 4.2 Agent Prompt Strategy

The agent will be configured with a detailed system prompt that includes:
- Business context (TAPS Aero, aircraft types)
- Email processing rules
- Buyer identification criteria
- Response templates

### 4.3 Data Flow

1. **Authentication**: OAuth2 flow to get Gmail access
2. **Read**: Fetch emails matching criteria (RFQs, new inquiries)
3. **Process**: Extract part numbers, pricing requests, buyer info
4. **Action**: Send to appropriate buyers or respond
5. **Track**: Apply labels to processed emails

### 4.4 Configuration

- **Environment Variables**:
  - `LLM_API_KEY`: Required for LLM
  - `LLM_MODEL`: Default: `openhands/claude-sonnet-4-5-20250929`
  - `GMAIL_CREDENTIALS_PATH`: Path to OAuth credentials

## 5. Agent Capabilities

The Gmail Agent will:

1. **Auto-read RFQ emails**: Identify and extract key information from RFQ emails
2. **Categorize by aircraft type**: Sort emails by Boeing, Airbus, Embraer, Gulfstream
3. **Find matching buyers**: Identify appropriate buyers for specific parts
4. **Generate responses**: Create professional email responses with pricing
5. **Track progress**: Label processed emails for audit trail
6. **Summary reports**: Generate daily/weekly summaries of processed emails

## 6. Security Considerations

- Credentials stored securely in workspace
- No plaintext email content in logs
- Confirmation mode for sending emails (safety)
- Audit trail of all actions

## 7. File Structure

```
output/
├── gmail_agent.py          # Main agent implementation
├── gmail_tools.py          # Custom Gmail tools
├── requirements.txt        # Python dependencies
└── README.md              # Usage instructions

plan/
├── SDK_PLAN.md            # This plan
└── agent_flow.html       # Visual flow diagram
```

## 8. Next Steps

1. User approval of this plan
2. Generate implementation code
3. Test Gmail OAuth setup
4. Configure agent prompts
5. Run initial tests