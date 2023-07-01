const fs = require("fs");
require("dotenv").config();
const octokit = require("@octokit/core");

const client = new octokit.Octokit({ auth: process.env.GH_TOKEN });

function getNewTemplateSection() {
	return fs.readFileSync("template.md").toString();
}

async function writeReadMe() {
	try {
		const res = await client.request(`GET /repos/tuxrace/react-merchants/contents/README.md`);
		const { path, sha, content, encoding } = res.data;
		const rawContent = Buffer.from(content, encoding).toString();
		const startIndex = rawContent.indexOf("## Other Projects");
		const updatedContent = `${startIndex === -1 ? rawContent : rawContent.slice(0, startIndex)}\n${getNewTemplateSection()}`;
		writeNewReadme(path, sha, encoding, updatedContent);
	} catch (error) {
		try {
			const content = `\n${getNewTemplateSection()}`;
			await client.request(`PUT /repos/tuxrace/react-merchants/contents/README.md`, {
				message: "Write README",
				content: Buffer.from(content, "utf-8").toString(encoding),
			});
		} catch (err) {
			console.log(err);
		}
	}
}

async function writeNewReadme(path, sha, encoding, updatedContent) {
	try {
		await client.request(`PUT /repos/tuxrace/react-merchants/contents/{path}`, {
			message: "Write README",
			content: Buffer.from(updatedContent, "utf-8").toString(encoding),
			path,
			sha,
		});
	} catch (err) {
		console.log(err);
	}
}

writeReadMe();