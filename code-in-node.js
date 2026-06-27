// ==========================
// GitHub Webhook Payload
// ==========================
const payload = $("Github-workflow-failure").first().json.body;

// ==========================
// Workflow Logs
// ==========================
const jobs = $("Fetch logs gh workflow").first().json.jobs || [];

const failedJob =
  jobs.find(job => job.conclusion === "failure") ||
  jobs.find(job => job.status === "completed") ||
  jobs[0];

const failedSteps = failedJob?.steps?.filter(
  step => step.conclusion === "failure"
) || [];

const failedStepSummary = failedSteps.length
  ? failedSteps.map(step => `
Step: ${step.name}
Status: ${step.conclusion}
Started: ${step.started_at}
Completed: ${step.completed_at}
`).join("\n")
  : "No failed step information available.";

// ==========================
// Changed Files
// ==========================
const commitData = $("Fetch modified files").first().json;

const changedFiles = commitData.files || [];

const supportedExtensions = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".py",
  ".json",
  ".yml",
  ".yaml",
  ".sh",
  ".java",
  ".go",
  ".rb",
  ".tf",
  ".tfvars",
  ".dockerfile",
  ".md"
];

const relevantFiles = changedFiles.filter(file =>
  supportedExtensions.some(ext =>
    file.filename.toLowerCase().endsWith(ext)
  ) && file.status !== "removed"
);

// ==========================
// Current File Content
// ==========================

const fileResponse = $("Fetch file content").first().json;

let currentFileContent = "";

if (typeof fileResponse === "string") {
  currentFileContent = fileResponse;
}
else if (fileResponse.content) {
  currentFileContent = fileResponse.content;
}
else if (fileResponse.data) {
  currentFileContent = fileResponse.data;
}
else {
  currentFileContent = JSON.stringify(fileResponse, null, 2);
}

// limit prompt size
if (currentFileContent.length > 18000) {
  currentFileContent =
    currentFileContent.substring(0, 18000) +
    "\n\n...FILE TRUNCATED...";
}

// ==========================
// File Summary
// ==========================

const filesSummary =
  relevantFiles.length > 0
    ? relevantFiles
        .map(file =>
          `• ${file.filename}
  Status: ${file.status}
  Additions: ${file.additions}
  Deletions: ${file.deletions}`
        )
        .join("\n")
    : "No relevant source files changed.";

// detect language
const filePath = relevantFiles[0]?.filename || "unknown";

const extension = filePath.split(".").pop();

const languageMap = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
  java: "java",
  go: "go",
  rb: "ruby",
  tf: "terraform"
};

const language = languageMap[extension] || "";

// ==========================
// AI Prompt
// ==========================

const prompt = `
You are an expert Software Engineer, DevOps Engineer and Platform Engineer.

Your task is to automatically repair a failed GitHub Actions workflow.

------------------------------------------------
Repository Information
------------------------------------------------

Repository:
${payload.repo}

Branch:
${payload.branch}

Commit:
${payload.commit}

Triggered By:
${payload.actor}

Run ID:
${payload["run-id"]}

Workflow URL:
https://github.com/${payload.repo}/actions/runs/${payload["run-id"]}

------------------------------------------------
Workflow Failure
------------------------------------------------

Failed Job

${failedJob?.name || "Unknown"}

Failed Steps

${failedStepSummary}

Workflow Summary

${failedJob?.steps
  ?.map(step => `- ${step.name} : ${step.conclusion}`)
  .join("\n")}

------------------------------------------------
Files Changed
------------------------------------------------

${filesSummary}

------------------------------------------------
Current Source Code
------------------------------------------------

File

${filePath}

\`\`\`${language}
${currentFileContent}
\`\`\`

------------------------------------------------
Instructions
------------------------------------------------

1. Identify the real root cause.
2. Ignore unrelated warnings.
3. Modify ONLY the file responsible.
4. Preserve formatting.
5. Preserve comments.
6. Preserve existing logic.
7. Make the minimum change required.
8. Return the COMPLETE corrected file.
9. Do not truncate the code.
10. Do not use placeholders.
11. Do not invent dependencies.
12. Ensure GitHub Actions succeeds.

------------------------------------------------
Output

Return ONLY valid JSON.

{
  "branch_name": "ai-fix/<description>",
  "file_path": "relative/path",
  "fixed_code": "complete corrected source code",
  "pr_title": "fix: ...",
  "pr_body": "Root cause and solution."
}
`;

return {
  json: {
    prompt
  }
};