const fs = require("fs");
require("dotenv").config();
const octokit = require("@octokit/core");

const client = new octokit.Octokit({ auth: process.env.GH_TOKEN});


function getNewTemplateSection() {
	return fs.readFileSync("template.md").toString();
}

async function writeReadMe() {
	try {
		const res = await client.request(`GET /repos/tuxrace/github-action-update-readme/contents/README.md`);
		const { path, sha, content, encoding } = res.data;
    console.log(res.data)
		const rawContent = Buffer.from(content, encoding).toString();
		const startIndex = rawContent.indexOf("## Other Projects");
		const updatedContent = `${startIndex === -1 ? rawContent : rawContent.slice(0, startIndex)}\n${getNewTemplateSection()}`;
		writeNewReadme(path, sha, encoding, updatedContent);
	} catch (error) {
			console.log(error);
	}
}

async function writeNewReadme(path, sha, encoding, updatedContent) {
	try {
		await client.request(`PUT /repos/tuxrace/github-action-update-readme/contents/${path}`, {
			message: "Write README",
			content: Buffer.from(updatedContent, "utf-8").toString('base64'),
			path,
			sha,
		});
    console.log('done', updatedContent)

	} catch (err) {
		console.log(err);
	}
}

writeReadMe();