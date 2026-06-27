# AI-ASSISTED-SELF-HEALING-CICD Self-healing-CICD

Tools:

nodeJs
Git&Github
n8n+Google gemini Ai
CICD: GithubActions

Github Actions wokrflow:  Build&Test the node.JS application --> trigger n8n workflow

N8N WorkFlow: 
n8n is a powerful, source-available workflow automation platform used to connect different apps, databases, and APIs so they can communicate and execute tasks automatically. It acts as a digital glue, allowing you to build everything from simple data transfers to complex AI agents and chatbots without writing extensive code

<img width="1721" height="190" alt="image" src="https://github.com/user-attachments/assets/5747bf87-d297-41fa-9d32-b2931de0dcd9" />

<img width="1920" height="1080" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/85f214d2-d421-451a-8280-f2670aeeac9b" />

AI FIX: <img width="1906" height="1024" alt="image" src="https://github.com/user-attachments/assets/8e368b62-93c4-4f26-b837-9236626b767a" />

Gmail Notification: 

<img width="1920" height="1080" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/69e4a1bd-5e68-4ef9-ad64-25ca1e21d0a7" />


🚀 **AI Self-Healing CI/CD Notification**

Hello,

The AI Self-Healing CI/CD pipeline has successfully analyzed a failed GitHub Actions workflow, identified the root cause, generated an automated fix, and created a Pull Request for review.

### Repository Information

**Repository:** Krao83609/Self-healing-CICD

**Original Branch:** main

**AI Fix Branch:** ai-fix/fix-nosole-typo

### Generated Fix

**Pull Request Title:**
fix: Correct typo in console.log call

**Summary:**
## AI Auto-Fix

**Root Cause Identified:**
The `index.js` file contained a `ReferenceError` due to a typo `nosole.log` instead of `console.log`. This prevents the Node.js script from executing successfully.

**Changes Applied:**
Changed `nosole.log` to `console.log` on line 18 to fix the `ReferenceError` and allow the script to run without crashing.

### Review Required

Please review the AI-generated changes, validate the proposed fix, and merge the Pull Request if appropriate.

**Repository:**
https://github.com/Krao83609/Self-healing-CICD

**Pull Requests:**
https://github.com/Krao83609/Self-healing-CICD/pulls

---

This fix was generated automatically by the AI Self-Healing CI/CD Pipeline using GitHub Actions, n8n, and Google Gemini.

Thank you,

**AI Self-Healing CI/CD System**

---
This email was sent automatically with n8n
https://n8n.io


